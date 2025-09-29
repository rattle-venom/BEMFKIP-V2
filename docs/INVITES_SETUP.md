# Invite-only Signup with Security Codes

This document describes how the invite-only signup flow works and the Firestore rules to secure it.

Overview:
- SUPERADMIN generates a one-time Security Code in the Admin Dashboard (Invite Codes tab).
- The plaintext code is never stored. Instead, the client computes SHA-256(code) and stores it as the Firestore document ID.
- Public users sign up with email, password, and Security Code. The client hashes the code and looks up `invite_codes/{hash}`. If the invite exists and is unused, the client creates the account and marks the invite as used.
- Audit logs track invite generation/revocation and signup success/failure events.

Data Model (Firestore):
- Collection: `invite_codes`
  - Document ID: hex string of SHA-256(securityCode)
  - Fields:
    - `createdBy`: string (uid of the SUPERADMIN who generated it)
    - `createdAt`: timestamp (serverTimestamp)
    - `used`: boolean (default false)
    - `usedBy`: string|null (uid who redeemed)
    - `usedAt`: timestamp|null (serverTimestamp at redemption)
    - `role`: string (default "BEM")
    - `note`: string (optional description/label)

Client Responsibilities:
- Admin (SUPERADMIN)
  - Generate code (random 12 characters) → compute SHA-256 → write `invite_codes/{hash}` with `used=false`.
  - Show plaintext once in a modal with a Copy button. Do not persist plaintext.
  - Revoke unused code by deleting its document.
- Public Signup
  - Hash user-entered Security Code → read `invite_codes/{hash}` (GET by ID).
  - If exists and `used == false`:
    - `createUserWithEmailAndPassword`
    - Set `users/{uid}` with `{ role: "BEM", email }`
    - `update invite_codes/{hash}` → `{ used:true, usedBy: uid, usedAt: serverTimestamp() }`
  - Else show error.

Audit Events:
- `invite_generate` { codeId }
- `invite_revoke` { codeId }
- `signup_success` { uid, email, codeId }
- `signup_fail` { reason }

## Firestore Security Rules (Additive Snippet)

Merge the following snippet into your existing Firestore rules. This secures the `invite_codes` collection to prevent enumeration and ensure only correct state transitions are allowed.

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Invite codes: stored by hashed doc ID; allow GET-by-ID only.
    match /invite_codes/{codeId} {
      // Allow direct GET of a specific document.
      // Do NOT add any list/query rule here to avoid enumeration.
      allow get: if true;

      // Only SUPERADMIN may create or delete invite codes.
      allow create, delete: if request.auth != null
        && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "SUPERADMIN";

      // Allow update only to redeem a code by the authenticated user:
      // - must flip used from false to true
      // - must set usedBy to the current uid
      // - must set usedAt to a timestamp
      allow update: if request.auth != null
        && resource.data.used == false
        && request.resource.data.used == true
        && request.resource.data.usedBy == request.auth.uid
        && request.resource.data.usedAt is timestamp;
    }

    // Keep your existing rules for users, news, gallery, cabinet, audit_logs, etc.
    // For example (illustrative, adjust to your existing RBAC rules):
    // match /users/{uid} { allow read, write: if request.auth != null && request.auth.uid == uid; }
    // match /audit_logs/{doc} { allow read: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "SUPERADMIN"; allow write: if request.auth != null; }
  }
}
```

Notes:
- This design intentionally allows `get` by document ID and disallows list/query to prevent code enumeration.
- The client computes the hash and only knows its own code’s hash; without the plaintext, codes cannot be guessed at scale.
- Marking a code as used is authorized only for the authenticated user who is redeeming the code and only from `used=false` → `true`.
- If you need per-role invites in the future (e.g., ADMIN invites), set `role` accordingly at creation time and assign that role to `users/{uid}` on redemption. Update rules as needed.

## Testing Checklist

1) As SUPERADMIN:
   - Open Admin → Invite Codes tab → Generate Code.
   - Copy the plaintext code when shown; the plaintext is not stored.
   - Confirm the list shows the new invite (with CodeId = first 8 chars of hash) as unused.

2) Public Signup:
   - Open the home page login modal → click “Sign up”.
   - Enter email, password, and the Security Code (plaintext).
   - Verify:
     - The account is created.
     - `users/{uid}.role == "BEM"`.
     - `invite_codes/{hash}` flips `used` to true, `usedBy` and `usedAt` set.
     - Audit logs have `signup_success`.

3) Invalid/Used Code:
   - Try with wrong or already used code.
   - The UI shows an error and `signup_fail` is logged.

4) Revoke:
   - As SUPERADMIN, revoke an unused code.
   - Try to sign up with the revoked code → must fail.

Deployment:
- Re-deploy static site as usual (e.g., Vercel).
- Update Firestore rules in the Firebase Console by copy-pasting the snippet above into your existing rules, merging carefully with current RBAC rules.
