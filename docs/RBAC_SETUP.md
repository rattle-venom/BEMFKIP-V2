# Firebase Role-Based Access Control (RBAC) Setup

This document describes how to configure roles and permissions for the BEM FKIP UMM website using Firebase Authentication + Firestore Security Rules.

Roles:
- SUPERADMIN: Full access; can manage user roles; can read audit_logs; can CRUD news, gallery, cabinet.
- ADMIN: Can CRUD news, gallery, cabinet. Cannot change roles and cannot read audit_logs.
- BEM: Read-only public content. No admin dashboard access and no writes.

Client changes already implemented
- script.js: 
  - On login, a Firestore document users/{uid} is created with default role: "BEM" if it doesn’t exist.
  - The current user’s role is read from users/{uid} and used to:
    - Hide/Show Dashboard links (homepage header + mobile)
    - Gate all write actions (News/Gallery/Cabinet)
    - Block admin dashboard for non-admin roles
  - Admin header shows an icon-only badge for the current role (🛡️ SUPERADMIN / 🧰 ADMIN / 🎓 BEM)

- admin.html:
  - Added a role badge placeholder <span id="role-badge">; script sets icon + colors dynamically.

No changes were pushed yet after RBAC code; push only when approved.

---

## 1) Seed initial roles (create users/{uid} docs)

A. Create/identify user accounts
1) In Firebase Console > Authentication > Users, create users or use existing ones.
2) Copy each user’s UID.

B. Create Firestore user profile docs
1) Go to Firestore Database > Data.
2) Create a new collection: users (if it doesn’t exist).
3) For each user, create a document with id = the user’s UID.
4) Set these fields (example for SUPERADMIN):
   - role: "SUPERADMIN"
   - email: "user@example.com"
   - createdAt: a server timestamp (optional)

Examples:
- SUPERADMIN: { role: "SUPERADMIN", email: "superadmin@yourdomain" }
- ADMIN: { role: "ADMIN", email: "admin@yourdomain" }
- BEM: { role: "BEM", email: "member@yourdomain" }

Note:
- The client auto-creates a users/{uid} doc with role: "BEM" on first login if missing. For elevated roles, change the role field manually in Firestore (or via a future Role Management page).

---

## 2) Firestore Security Rules (paste in Firebase Console)

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function isSignedIn() {
      return request.auth != null;
    }

    function userDoc(uid) {
      return get(/databases/$(database)/documents/users/$(uid));
    }

    function currentRole() {
      return isSignedIn() ? userDoc(request.auth.uid).data.role : null;
    }

    function isAdmin() {
      return currentRole() == "ADMIN" || currentRole() == "SUPERADMIN";
    }

    function isSuper() {
      return currentRole() == "SUPERADMIN";
    }

    // Public content
    match /news/{id} {
      allow read: if true;
      allow create, update, delete: if isSignedIn() && isAdmin();
    }

    match /gallery/{id} {
      allow read: if true;
      allow create, update, delete: if isSignedIn() && isAdmin();
    }

    match /cabinet/{id} {
      allow read: if true;
      // Per confirmation: ADMIN and SUPERADMIN can update cabinet
      allow create, update, delete: if isSignedIn() && isAdmin();
    }

    // Audit logs:
    // - Any authenticated user can create a log
    // - Only SUPERADMIN can read logs
    // - No one can update/delete logs
    match /audit_logs/{id} {
      allow create: if isSignedIn();
      allow read: if isSignedIn() && isSuper();
      allow update, delete: if false;
    }

    // Users collection:
    // - Users can read their own doc
    // - Users can create their own doc with default role "BEM"
    // - Users can update their own doc only if they are NOT changing role
    // - SUPERADMIN can read/write any user doc and change roles
    match /users/{uid} {
      allow get: if isSignedIn() && (request.auth.uid == uid || isSuper());
      allow list: if false; // prevent listing users collection

      // Create allowed for self; default role must be "BEM"
      allow create: if isSignedIn()
                    && request.auth.uid == uid
                    && request.resource.data.role == "BEM";

      // Update:
      //  - self-update allowed only if role stays the same
      //  - SUPERADMIN can update any fields/roles
      allow update: if isSignedIn() && (
        (request.auth.uid == uid
          && request.resource.data.role == resource.data.role)
        || isSuper()
      );

      // Delete only by SUPERADMIN
      allow delete: if isSignedIn() && isSuper();
    }
  }
}

How these rules protect you
- All write operations (news/gallery/cabinet) are permitted only if the user’s role is ADMIN or SUPERADMIN.
- Regular users (BEM) cannot perform any writes even if they try to call APIs or manipulate the client.
- Only SUPERADMIN can read audit logs (once implemented) and can escalate or change roles.

---

## 3) Testing (quick checklist)

1) SUPERADMIN account:
   - Log in to /admin.
   - Verify dashboard shows.
   - Create news, edit, delete; add/delete gallery; update cabinet.
   - Create/update roles by editing users/{uid} docs in Firestore.
   - (After logging is implemented) verify you can read audit_logs in the console (rules allow SUPERADMIN read).

2) ADMIN account:
   - Log in to /admin (dashboard should show).
   - Verify CRUD for news/gallery/cabinet works.
   - Cannot read audit_logs; cannot change roles.

3) BEM account:
   - Log in (header dashboard button should be hidden).
   - Visiting /admin should keep showing login; no access to dashboard.
   - Cannot perform any writes.

4) Logged out:
   - Public pages load.
   - No admin access; no writes.

---

## 4) Next – Per-user activity logging (audit_logs)

After roles are in place, recommended next step is to add per-user activity logs.

Implementation plan:
- Add a helper in script.js:

  async function logActivity(action, payload = {}) {
    try {
      const user = auth.currentUser;
      if (!user) return;
      await addDoc(collection(db, "audit_logs"), {
        uid: user.uid,
        email: user.email || "",
        action,          // e.g., "news_add", "news_edit", "gallery_delete", "cabinet_update", "login", "logout"
        payload,         // small object with identifiers/titles
        path: location.pathname,
        userAgent: navigator.userAgent,
        at: serverTimestamp()
      });
    } catch (e) {
      console.warn("audit log failed:", e);
    }
  }

- Call logActivity() in these places:
  - Login success, logout
  - News: add/edit/delete
  - Gallery: add/delete
  - Cabinet: update
- Firestore rules above already allow create by any authenticated user and read only by SUPERADMIN.

If you want, I can implement the logging calls now that RBAC is in place.

---

## 5) Notes and alternatives

- Why Firestore-based roles?
  - Simple setup; no Cloud Functions or Admin SDK needed client-side.
  - Rules read users/{uid} to enforce permissions at the server (source of truth).

- Alternative: Custom claims
  - Store roles in Firebase Auth custom claims and read them in rules.
  - Requires Admin SDK (Node/Cloud Functions) to set claims. If you want this later, I can provide a small Cloud Function.
