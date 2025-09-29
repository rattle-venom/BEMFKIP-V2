import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, doc, deleteDoc, getDoc, updateDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAK2s6ex4tj7ycOPiEqb_bnatojCFCTMzg",
    authDomain: "bemfkip-a5bb1.firebaseapp.com",
    projectId: "bemfkip-a5bb1",
    storageBucket: "bemfkip-a5bb1.firebasestorage.app",
    messagingSenderId: "717492980350",
    appId: "1:717492980350:web:e602c64e54d616daf2a62f"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- Translation System ---
const translations = {
    id: {
        home: "Beranda",
        about: "Tentang Kami",
        news: "Berita",
        gallery: "Galeri",
        structure: "Struktural Kabinet",
        contact: "Kontak",
        "welcome-title": "Selamat Datang di BEM FKIP UMM",
        "welcome-subtitle": "Kabinet Waskita Mandala Periode 2025/2026",
        "learn-more": "Pelajari Lebih Lanjut",
        "about-title": "Tentang Kami",
        "about-description": "Badan Eksekutif Mahasiswa Fakultas Keguruan dan Ilmu Pendidikan UMM adalah organisasi eksekutif mahasiswa di tingkat fakultas yang berperan sebagai wadah aspirasi, pengembangan potensi, serta penggerak kegiatan kemahasiswaan di lingkungan FKIP.",
        "division-general-title": "Bidang Umum",
        "division-general-desc": "Kami merupakan inti dari struktur kepemimpinan dan administrasi BEM yang dikoordinasi langsung oleh Gubernur Mahasiswa, Wakil Gubernur, Sekretaris Umum, dan Bendahara Umum. Kami memastikan seluruh roda organisasi berjalan secara efektif dan efisien dengan mengelola surat-menyurat, arsip, inventaris, serta alur keuangan. Peran kami adalah sebagai penopang utama yang mendukung kelancaran program kerja seluruh bidang lainnya.",
        "division-media-title": "Media & Komunikasi",
        "division-media-desc": "Kami adalah garda terdepan dalam menyebarkan informasi dan menjadi wajah BEM di ranah publik. Tugas kami tidak hanya mengelola seluruh kanal media sosial, tetapi juga merancang strategi komunikasi dan menciptakan konten kreatif seperti poster, video, dan infografis. Kami bekerja untuk membangun citra positif BEM serta memastikan setiap suara dan aspirasi mahasiswa dapat tersampaikan dengan baik.",
        "division-academic-title": "Keilmuan dan Kastrat",
        "division-academic-desc": "Kami hadir sebagai pusat pengembangan intelektual dan daya kritis mahasiswa. Melalui program keilmuan, kami menyelenggarakan seminar, lokakarya, dan diskusi untuk memperluas wawasan akademik. Sementara itu, melalui Kajian Strategis (Kastrat), kami secara aktif menganalisis isu-isu penting di tingkat universitas maupun nasional, kemudian merumuskan sikap dan rekomendasi kebijakan sebagai dasar gerakan advokasi BEM.",
        "division-talent-title": "Bakat dan Minat",
        "division-talent-desc": "Kami menjadi wadah bagi seluruh mahasiswa untuk menyalurkan dan mengembangkan potensi di luar bidang akademik. Kami memfasilitasi berbagai kegiatan di bidang olahraga, seni, dan hobi lainnya, mulai dari latihan rutin hingga penyelenggaraan kompetisi dan pertunjukan. Tujuan kami adalah untuk menumbuhkan semangat sportivitas, kreativitas, dan mempererat kebersamaan antar mahasiswa melalui minat yang mereka miliki.",
        "division-religious-title": "Keagamaan",
        "division-religious-desc": "Kami berfokus pada pembinaan dan peningkatan kualitas spiritual serta moral mahasiswa. Kami secara rutin menyelenggarakan berbagai kegiatan keagamaan, seperti perayaan hari besar, kajian kitab suci, dan acara-acara rohani lainnya. Melalui program kami, kami berupaya menciptakan lingkungan kampus yang harmonis, toleran, dan religius bagi seluruh civitas akademika.",
        "division-humanity-title": "Kehumanusiaan",
        "division-humanity-desc": "Kami bergerak di garda terdepan dalam aksi kepedulian sosial dan pengabdian kepada masyarakat. Kami menginisiasi dan mengorganisir berbagai program kemanusiaan, mulai dari bakti sosial di desa binaan, penggalangan dana untuk korban bencana, hingga kampanye isu sosial. Tujuan utama kami adalah menumbuhkan kepekaan dan jiwa sosial mahasiswa agar dapat memberikan kontribusi nyata bagi masyarakat luas.",
        "news-title": "Berita & Artikel Terbaru",
        "add-news": "Tambah Berita Baru"
    },
    en: {
        home: "Home",
        about: "About Us",
        news: "News",
        gallery: "Gallery",
        structure: "Cabinet Structure",
        contact: "Contact",
        "welcome-title": "Welcome to BEM FKIP UMM",
        "welcome-subtitle": "Waskita Mandala Cabinet Period 2025/2026",
        "learn-more": "Learn More",
        "about-title": "About Us",
        "about-description": "The Student Executive Board of the Faculty of Teacher Training and Education UMM is a faculty-level student executive organization that serves as a forum for aspirations, potential development, and a driver of student activities in the FKIP environment.",
        "division-general-title": "General Division",
        "division-general-desc": "We are the core of BEM's leadership and administrative structure, coordinated directly by the Student Governor, Vice Governor, General Secretary, and General Treasurer. We ensure that all organizational wheels run effectively and efficiently by managing correspondence, archives, inventory, and financial flows. Our role is as the main support that supports the smooth running of work programs for all other divisions.",
        "division-media-title": "Media & Communication",
        "division-media-desc": "We are at the forefront of disseminating information and becoming BEM's face in the public sphere. Our duties are not only to manage all social media channels, but also to design communication strategies and create creative content such as posters, videos, and infographics. We work to build a positive image of BEM and ensure that every voice and student aspiration can be conveyed well.",
        "division-academic-title": "Academic & Strategic Studies",
        "division-academic-desc": "We are present as a center for the intellectual development and critical thinking of students. Through academic programs, we organize seminars, workshops, and discussions to broaden academic insights. Meanwhile, through Strategic Studies (Kastrat), we actively analyze important issues at university and national levels, then formulate attitudes and policy recommendations as the basis for BEM's advocacy movement.",
        "division-talent-title": "Talent & Interests",
        "division-talent-desc": "We provide a forum for all students to channel and develop potential outside the academic field. We facilitate various activities in sports, arts, and other hobbies, from regular training to organizing competitions and performances. Our goal is to foster a spirit of sportsmanship, creativity, and strengthen togetherness among students through their interests.",
        "division-religious-title": "Religious Affairs",
        "division-religious-desc": "We focus on fostering and improving the spiritual and moral quality of students. We regularly organize various religious activities, such as celebrating major holidays, studying holy books, and other spiritual events. Through our programs, we strive to create a harmonious, tolerant, and religious campus environment for all academic community members.",
        "division-humanity-title": "Humanitarian Affairs",
        "division-humanity-desc": "We are at the forefront of social care actions and community service. We initiate and organize various humanitarian programs, ranging from social service in fostered villages, fundraising for disaster victims, to social issue campaigns. Our main goal is to foster sensitivity and social spirit in students so that they can make real contributions to the wider community.",
        "news-title": "Latest News & Articles",
        "add-news": "Add New News",
        "contact-title": "Contact Us",
        "contact-subtitle": "Feel free to contact us through social media or the email address below.",
        "contact-info-title": "Contact Information",
        "address-label": "Address:",
        "address": "Student Center Building, UMM Campus III, Jl. Raya Tlogomas No. 246, Malang, East Java 65144",
        "email-label": "Email:",
        "social-label": "Social Media:",
        "send-message": "Send Message",
        "full-name": "Full Name",
        "message": "Message",
        "send": "Send",
        "structure-title": "Cabinet Structure",
        "structure-subtitle": "Get to know the leaders and members who drive BEM FKIP UMM.",
        "cabinet-structure-title": "BEM FKIP UMM Cabinet Structure 2025/2026",
        "governor-title": "Student Governor",
        "vice-governor-title": "Vice Student Governor",
        "secretary-title": "General Secretary",
        "treasurer-title": "General Treasurer",
        "division-head": "Division Head",
        "division-secretary": "Division Secretary",
        "members": "Members"
    }
};

let currentLang = localStorage.getItem('language') || 'id';

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
    updateTexts();
}

function updateTexts() {
    const elements = document.querySelectorAll('[data-key]');
    elements.forEach(element => {
        const key = element.getAttribute('data-key');
        if (translations[currentLang][key]) {
            element.textContent = translations[currentLang][key];
        }
    });
    // Update lang toggle button
    const langToggle = document.getElementById('lang-toggle');
    if (langToggle) {
        langToggle.textContent = currentLang === 'id' ? 'EN' : 'ID';
    }
}
 
// --- RBAC helpers (roles: BEM, ADMIN, SUPERADMIN) ---
let currentUserRole = null;
const ROLE = { BEM: 'BEM', ADMIN: 'ADMIN', SUPERADMIN: 'SUPERADMIN' };

async function ensureUserDoc(user) {
    // Create users/{uid} if missing with default role BEM
    try {
        const uref = doc(db, "users", user.uid);
        const snap = await getDoc(uref);
        if (!snap.exists()) {
            await setDoc(uref, {
                role: ROLE.BEM,
                email: user.email || '',
                createdAt: serverTimestamp()
            }, { merge: true });
        }
    } catch (e) {
        console.warn("ensureUserDoc error:", e);
    }
}

async function getUserRole(uid) {
    try {
        const uref = doc(db, "users", uid);
        const snap = await getDoc(uref);
        const role = snap.exists() && snap.data().role ? snap.data().role : ROLE.BEM;
        return role;
    } catch (e) {
        console.warn("getUserRole error:", e);
        return ROLE.BEM;
    }
}

function isAdminish() {
    return currentUserRole === ROLE.ADMIN || currentUserRole === ROLE.SUPERADMIN;
}
function isSuper() {
    return currentUserRole === ROLE.SUPERADMIN;
}

function setRoleBadge(role) {
    const badge = document.getElementById('role-badge');
    if (!badge) return;
    // map roles to custom images (placed in the project root)
    let src = 'role-BEM.png', label = 'BEM';
    if (role === ROLE.ADMIN) { src = 'role-admin.png'; label = 'ADMIN'; }
    if (role === ROLE.SUPERADMIN) { src = 'role-superAdmin.png'; label = 'SUPERADMIN'; }
    // render as image-only badge
    badge.className = 'inline-flex items-center justify-center w-8 h-8'; // removes 'hidden'
    badge.title = label;
    badge.innerHTML = `<img src="${src}" alt="${label} badge" class="w-8 h-8 rounded-full object-cover" />`;
}

/* Audit logging helper (SUPERADMIN-only read via rules) */
async function logActivity(action, payload = {}) {
    try {
        const user = auth.currentUser;
        if (!user) return; // only log for authenticated users
        await addDoc(collection(db, "audit_logs"), {
            uid: user.uid,
            email: user.email || "",
            action,
            payload,
            path: location.pathname + location.hash,
            userAgent: navigator.userAgent,
            at: serverTimestamp()
        });
    } catch (e) {
        console.warn("audit log failed:", e);
    }
}

// --- Invite codes helpers ---
async function sha256Hex(text) {
    const enc = new TextEncoder();
    const data = enc.encode(text);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}
function randomCode(len = 12) {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789abcdefghijkmnpqrstuvwxyz';
    let out = '';
    const arr = new Uint32Array(len);
    crypto.getRandomValues(arr);
    for (let i = 0; i < len; i++) out += chars[arr[i] % chars.length];
    return out;
}
 
// helpers to build human descriptions and diffs for updates
function stringifyVal(v) {
    if (Array.isArray(v)) return v.join(', ');
    if (v === undefined || v === null) return '';
    return String(v);
}
function diffObjects(before = {}, after = {}) {
    const changes = [];
    const keys = new Set([...Object.keys(before || {}), ...Object.keys(after || {})]);
    keys.forEach((k) => {
        const a = stringifyVal(before ? before[k] : '');
        const b = stringifyVal(after ? after[k] : '');
        if (a !== b) changes.push({ key: k, before: a, after: b });
    });
    return changes;
}
function trunc(s, len = 60) {
    if (s == null) return '';
    const t = String(s).replace(/\s+/g, ' ').trim();
    return t.length > len ? t.slice(0, len) + '…' : t;
}
function describeLog(log) {
    const a = log.action;
    const p = log.payload || {};
    switch (a) {
        case 'login': return 'This user logged in';
        case 'logout': return 'This user logged out';
        case 'news_add': return `This user added news "${p.title || p.docId || ''}"`;
        case 'news_edit': {
            // Simple human summary listing which parts were changed (exclude auto fields)
            const labelMap = {
                title: 'Title of the news',
                content: 'Content of the news',
                imageUrl: 'Image link of the news',
                date: 'Date of the news',
                category: 'Category of the news',
                author: 'Author of the news'
            };
            const fieldsAll = Array.isArray(p.fields) && p.fields.length
                ? p.fields
                : (Array.isArray(p.changes) ? p.changes.map(c => c.key) : []);
            const fields = fieldsAll.filter(k => k !== 'date' && k !== 'updatedAt');
            const parts = fields.map(k => labelMap[k] || k);
            if (!parts.length) return 'This user edited a news item';
            return `This user changed ${parts.join(', ')}`;
        }
        case 'news_delete': return `This user deleted news "${p.title || p.docId || ''}"`;
        case 'gallery_add': return `This user added photo "${p.caption || p.docId || ''}"`;
        case 'gallery_delete': return `This user deleted photo "${p.caption || p.docId || ''}"`;
        case 'cabinet_update':
            if (Array.isArray(p.changes) && p.changes.length) {
                const parts = p.changes.slice(0, 3).map(c => `${c.key} from "${c.before}" to "${c.after}"`);
                const extra = p.changes.length > 3 ? `, +${p.changes.length - 3} more` : '';
                return `This user updated cabinet: ${parts.join('; ')}${extra}`;
            }
            return 'This user updated cabinet';
        case 'invite_generate':
            return `This user generated an invite code (${(p.codeId || '').slice(0,8)}…)`;
        case 'invite_revoke':
            return `This user revoked an invite code (${(p.codeId || '').slice(0,8)}…)`;
        case 'signup_success':
            return `Signup success for ${p.email || p.uid || ''} using code ${(p.codeId || '').slice(0,8)}…`;
        case 'signup_fail':
            return `Signup failed: ${p.reason || 'unknown'}`;
        default: return `This user performed ${a || 'an action'}`;
    }
}
 
// --- Tab Switching Logic ---
/* Pop-in helper for cards with .pop-card inside a container */
function applyPopIn(container) {
    if (!container) return;
    const cards = container.querySelectorAll('.pop-card');
    let delay = 0;
    cards.forEach((el) => {
        el.classList.remove('pop-in');
        // force reflow to restart animation
        void el.offsetWidth;
        el.style.animationDelay = `${delay}ms`;
        el.classList.add('pop-in');
        delay += 80; // stagger
    });
}

/* Tabs with animated slider and card pop-in */
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const slider = document.getElementById('tab-slider');

    function positionSlider(targetBtn) {
        if (!slider || !targetBtn) return;
        const container = targetBtn.parentElement;
        const btnRect = targetBtn.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const left = btnRect.left - containerRect.left;
        slider.style.width = `${btnRect.width}px`;
        slider.style.transform = `translateX(${left}px)`;
    }

    // Initial slider position and initial pop for active content
    const initialBtn = document.querySelector('.tab-btn.active') || tabButtons[0];
    if (initialBtn) {
        positionSlider(initialBtn);
        const initialContentId = initialBtn.getAttribute('data-tab');
        applyPopIn(document.getElementById(initialContentId));
    }

    window.addEventListener('resize', () => {
        const activeBtn = document.querySelector('.tab-btn.active');
        if (activeBtn) positionSlider(activeBtn);
    });

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');

            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            const contentEl = document.getElementById(tabId);
            if (contentEl) contentEl.classList.add('active');

            // Move slider and animate cards
            positionSlider(button);
            applyPopIn(contentEl);
        });
    });
}

// --- Theme Toggle Logic ---
let currentTheme = localStorage.getItem('theme') || 'light';

function setTheme(theme) {
    currentTheme = theme;
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeIcon();
}

function updateThemeIcon() {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.textContent = currentTheme === 'light' ? '🌙' : '☀️';
    }
}

function toggleTheme() {
    setTheme(currentTheme === 'light' ? 'dark' : 'light');
}

// --- Language Toggle Logic ---
function toggleLanguage() {
    setLanguage(currentLang === 'id' ? 'en' : 'id');
}

// --- Initialize Features ---
function initFeatures() {
    // Set initial theme
    setTheme(currentTheme);

    // Set initial language
    setLanguage(currentLang);

    // Initialize tabs
    initTabs();

    // Add event listeners
    const themeToggle = document.getElementById('theme-toggle');
    const langToggle = document.getElementById('lang-toggle');

    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
    if (langToggle) langToggle.addEventListener('click', toggleLanguage);
}

 // --- Common Elements (used across multiple pages) ---
const logoutBtn = document.getElementById('logout-btn');
const loginBtn = document.getElementById('login-btn');
const dashboardBtn = document.getElementById('dashboard-btn');

// Mobile nav elements (index.html)
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLoginBtn = document.getElementById('mobile-login-btn');
const mobileLogoutBtn = document.getElementById('mobile-logout-btn');
const mobileDashboardBtn = document.getElementById('mobile-dashboard-btn');
const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
const mobileLangToggle = document.getElementById('mobile-lang-toggle');

// --- Authentication State Checker (Common) ---
if (auth) {
    onAuthStateChanged(auth, async (user) => {
        const addNewsBtnContainer = document.getElementById('add-news-btn-container');
        if (user) {
            // Ensure user profile and fetch role
            await ensureUserDoc(user);
            currentUserRole = await getUserRole(user.uid);

            // Header buttons (desktop)
            if (loginBtn) loginBtn.classList.add('hidden');
            if (logoutBtn) logoutBtn.classList.remove('hidden');
            if (dashboardBtn) {
                if (isAdminish()) dashboardBtn.classList.remove('hidden');
                else dashboardBtn.classList.add('hidden');
            }

            // Mobile equivalents
            if (mobileLoginBtn) mobileLoginBtn.classList.add('hidden');
            if (mobileLogoutBtn) mobileLogoutBtn.classList.remove('hidden');
            if (mobileDashboardBtn) {
                if (isAdminish()) mobileDashboardBtn.classList.remove('hidden');
                else mobileDashboardBtn.classList.add('hidden');
            }

            // Homepage "Add News" button visible only to ADMIN/SUPERADMIN
            if (addNewsBtnContainer) {
                if (isAdminish()) addNewsBtnContainer.classList.remove('hidden');
                else addNewsBtnContainer.classList.add('hidden');
            }
        } else {
            currentUserRole = null;

            if (loginBtn) loginBtn.classList.remove('hidden');
            if (logoutBtn) logoutBtn.classList.add('hidden');
            if (dashboardBtn) dashboardBtn.classList.add('hidden');

            // Mobile equivalents
            if (mobileLoginBtn) mobileLoginBtn.classList.remove('hidden');
            if (mobileLogoutBtn) mobileLogoutBtn.classList.add('hidden');
            if (mobileDashboardBtn) mobileDashboardBtn.classList.add('hidden');

            if (addNewsBtnContainer) addNewsBtnContainer.classList.add('hidden');
        }
    });
}

// --- Logout Button Functionality (Common) ---
if (logoutBtn) {
    logoutBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        await logActivity('logout', {});
        signOut(auth).catch((error) => console.error("Sign Out Error", error));
    });
}

// --- Login Modal Handling (Common for all pages) ---
const loginModal = document.getElementById('login-modal');
const loginFormOverlay = document.getElementById('login-form-overlay');
const closeLoginBtn = document.getElementById('close-login-btn');
const loginErrorMessage = document.getElementById('login-error-message');
// Signup modal elements
const signupModal = document.getElementById('signup-modal');
const signupForm = document.getElementById('signup-form');
const closeSignupBtn = document.getElementById('close-signup-btn');
const signupErrorMessage = document.getElementById('signup-error-message');
const openSignupBtn = document.getElementById('open-signup-btn');

// Support in-modal panel toggle (CodePen-like) instead of separate signup modal
const loginPanel = document.getElementById('login-panel');
const signupPanel = document.getElementById('signup-panel');
const openLoginBtn = document.getElementById('open-login-btn');

if (loginBtn) {
    loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (loginModal) loginModal.classList.remove('hidden');
    });
}
if (closeLoginBtn) closeLoginBtn.addEventListener('click', () => { if (loginModal) loginModal.classList.add('hidden'); });
if (openSignupBtn) {
    openSignupBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (signupPanel && loginPanel) {
            // Toggle inside the same modal
            loginPanel.classList.add('hidden');
            signupPanel.classList.remove('hidden');
        } else {
            // Fallback to separate modal if present
            if (loginModal) loginModal.classList.add('hidden');
            if (signupModal) signupModal.classList.remove('hidden');
        }
    });
}
if (openLoginBtn) {
    openLoginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (signupPanel && loginPanel) {
            signupPanel.classList.add('hidden');
            loginPanel.classList.remove('hidden');
        } else {
            // If using separate modal, just show login modal
            if (signupModal) signupModal.classList.add('hidden');
            if (loginModal) loginModal.classList.remove('hidden');
        }
    });
}
if (closeSignupBtn) closeSignupBtn.addEventListener('click', () => { if (signupModal) signupModal.classList.add('hidden'); });
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('signup-email-input').value.trim();
        const password = document.getElementById('signup-password-input').value;
        const code = document.getElementById('signup-security-code-input').value.trim();
        try {
            const hash = await sha256Hex(code);
            const invRef = doc(db, "invite_codes", hash);
            const invSnap = await getDoc(invRef);
            if (!invSnap.exists() || invSnap.data().used) {
                if (signupErrorMessage) signupErrorMessage.textContent = "Security code tidak valid atau sudah digunakan.";
                await logActivity('signup_fail', { reason: 'invalid_or_used', codeId: hash });
                return;
            }
            const cred = await createUserWithEmailAndPassword(auth, email, password);
            await ensureUserDoc(cred.user);
            await setDoc(doc(db, "users", cred.user.uid), { role: ROLE.BEM, email: cred.user.email || email }, { merge: true });
            await updateDoc(invRef, { used: true, usedBy: cred.user.uid, usedAt: serverTimestamp() });
            await logActivity('signup_success', { uid: cred.user.uid, email: cred.user.email || email, codeId: hash });
            if (signupModal) signupModal.classList.add('hidden');
            signupForm.reset();
            if (signupErrorMessage) signupErrorMessage.textContent = "";
        } catch (err) {
            console.error("signup error:", err);
            if (signupErrorMessage) signupErrorMessage.textContent = "Pendaftaran gagal. Coba lagi.";
            await logActivity('signup_fail', { reason: err && err.code ? err.code : String(err) });
        }
    });
}
if (loginFormOverlay) {
    loginFormOverlay.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email-input-overlay').value;
        const password = document.getElementById('password-input-overlay').value;
        try {
            await signInWithEmailAndPassword(auth, email, password);
            await logActivity('login', {});
            if (loginModal) loginModal.classList.add('hidden');
            loginFormOverlay.reset();
            if (loginErrorMessage) loginErrorMessage.classList.add('hidden');
            // Stay on homepage after successful login (no redirect)
            // Header buttons (Login/Dashboard/Logout) will auto-update via onAuthStateChanged.
        } catch (error) {
            if (loginErrorMessage) {
                loginErrorMessage.textContent = "Email atau password salah.";
                loginErrorMessage.classList.remove('hidden');
            }
        }
    });
}

 // --- Mobile Navigation (index.html) ---
if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
        const expanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
        mobileMenuButton.setAttribute('aria-expanded', String(!expanded));
        mobileMenu.classList.toggle('hidden');
    });
    const links = mobileMenu.querySelectorAll('a');
    links.forEach(a => a.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        mobileMenuButton.setAttribute('aria-expanded', 'false');
    }));
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            mobileMenu.classList.add('hidden');
            mobileMenuButton.setAttribute('aria-expanded', 'false');
        }
    });
}
if (mobileThemeToggle) mobileThemeToggle.addEventListener('click', toggleTheme);
if (mobileLangToggle) mobileLangToggle.addEventListener('click', toggleLanguage);
if (mobileLoginBtn) {
    mobileLoginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (loginModal) loginModal.classList.remove('hidden');
        if (mobileMenu) mobileMenu.classList.add('hidden');
        if (mobileMenuButton) mobileMenuButton.setAttribute('aria-expanded', 'false');
    });
}
if (mobileLogoutBtn) {
    mobileLogoutBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        await logActivity('logout', {});
        signOut(auth).catch((error) => console.error("Sign Out Error", error));
        if (mobileMenu) mobileMenu.classList.add('hidden');
        if (mobileMenuButton) mobileMenuButton.setAttribute('aria-expanded', 'false');
    });
}

// --- Page Specific Logic ---

// --- /galeri.html specific logic ---
const galleryContainer = document.getElementById('gallery-container');
if (galleryContainer) {
    const galleryQuery = query(collection(db, "gallery"), orderBy("uploadedAt", "desc"));
    onSnapshot(galleryQuery, (snapshot) => {
        if (snapshot.empty) {
            galleryContainer.innerHTML = '<p class="col-span-full text-gray-500">Belum ada foto di galeri.</p>';
            return;
        }
        let photosHtml = '';
        snapshot.forEach(doc => {
            const photo = doc.data();
            photosHtml += `
                <div class="relative group">
                    <img src="${photo.imageUrl}" alt="${photo.caption}" class="w-full h-48 object-cover rounded-lg shadow-md transition-transform transform group-hover:scale-105">
                    <div class="absolute bottom-0 left-0 right-0 p-2 bg-black bg-opacity-50 text-white text-xs text-center rounded-b-lg">
                        ${photo.caption}
                    </div>
                </div>
            `;
        });
        galleryContainer.innerHTML = photosHtml;
    });
}

// --- /index.html specific logic ---
const messageModal = document.getElementById('message-modal');
const modalTitle = document.getElementById('modal-title');
const modalMessage = document.getElementById('modal-message');
const modalCloseBtn = document.getElementById('modal-close-btn');
const newsFormModal = document.getElementById('news-form-modal');
const addNewsForm = document.getElementById('add-news-form');
const closeFormBtn = document.getElementById('close-form-btn');
const addNewsBtn = document.getElementById('add-news-btn');
const newsContainer = document.getElementById('news-container');

if (newsContainer) { // Check if on index.html
    // --- Modal and Form Logic ---
    function showModal(title, message) {
        if (modalTitle && modalMessage && messageModal) {
            modalTitle.textContent = title;
            modalMessage.textContent = message;
            messageModal.classList.remove('hidden');
        }
    }
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', () => messageModal.classList.add('hidden'));
    if (addNewsBtn) addNewsBtn.addEventListener('click', () => newsFormModal.classList.remove('hidden'));
    if (closeFormBtn) closeFormBtn.addEventListener('click', () => newsFormModal.classList.add('hidden'));

    if (addNewsForm) {
        addNewsForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!isAdminish()) { showModal("Akses ditolak", "Peran Anda tidak memiliki izin menambah berita."); return; }
            const newsData = {
                title: document.getElementById('news-title-input').value,
                content: document.getElementById('news-content-input').value,
                imageUrl: document.getElementById('news-image-url-input').value,
                category: document.getElementById('news-category-input').value,
                author: 'BEM FKIP',
                date: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
            };
            try {
                const docRef = await addDoc(collection(db, "news"), newsData);
                await logActivity('news_add', { docId: docRef.id, title: newsData.title });
                newsFormModal.classList.add('hidden');
                addNewsForm.reset();
                showModal("Berhasil!", "Berita baru telah ditambahkan.");
            } catch (err) {
                console.error("Error adding document: ", err);
                showModal("Error", "Gagal menambahkan berita.");
            }
        });
    }



    // --- Auth Gate Helper ---
    function checkAuthAndGate() {
        onAuthStateChanged(auth, (user) => {
            if (!user) {
                // If not logged in, show login modal for admin features
                if (window.location.pathname.includes('admin')) {
                    if (loginModal) loginModal.classList.remove('hidden');
                }
            }
        });
    }

    // --- Display News from Firestore ---
    const newsQuery = query(collection(db, "news"), orderBy("date", "desc"));
    onSnapshot(newsQuery, (snapshot) => {
        if (snapshot.empty) {
            newsContainer.innerHTML = '<p class="text-center text-gray-500 col-span-full">Belum ada berita.</p>';
            return;
        }
        let newsHtml = '';
        snapshot.forEach((doc) => {
            const news = doc.data();
            newsHtml += `
                <a href="news-detail.html?id=${doc.id}" class="block rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden bg-white text-gray-800 pop-card">
                    <div class="relative">
                        <img class="w-full h-48 object-cover" src="${news.imageUrl}" alt="${news.title}">
                        <span class="absolute top-2 left-2 bg-violet-600 text-white px-2 py-1 text-xs font-semibold rounded-full">${news.category}</span>
                    </div>
                    <div class="p-6">
                        <h3 class="font-bold text-xl mb-2">${news.title}</h3>
                        <div class="flex items-center text-sm font-medium text-gray-500 mb-4 space-x-4">
                            <span>${news.date}</span>
                            <span>by ${news.author}</span>
                        </div>
                        <p class="text-sm text-gray-600 leading-relaxed">${news.content.substring(0, 100)}...</p>
                        <span class="inline-block mt-4 text-violet-600 font-semibold">Continue reading →</span>
                    </div>
                </a>
            `;
        });
        newsContainer.innerHTML = newsHtml;
        // trigger pop-in animation for the newly rendered news cards
        animateCardsIn(newsContainer);
    });

    // Call checkAuthAndGate at the end
    checkAuthAndGate();
}

// --- /news-detail.html specific logic ---
const articleContainer = document.getElementById('article-container');
if (articleContainer) { // Check if on news-detail.html
    console.log("News detail page detected, initializing...");
    
    // This function takes a string and replaces HTML characters with safe ones
    function sanitizeHTML(str) {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    async function loadArticle() {
        console.log("Starting to load article...");
        const urlParams = new URLSearchParams(window.location.search);
        const newsId = urlParams.get('id');
        console.log("News ID from URL:", newsId);

        if (!newsId) {
            console.error("No news ID found in URL");
            articleContainer.innerHTML = '<h1>Artikel tidak ditemukan.</h1><p>ID artikel tidak ada di URL.</p>';
            return;
        }

        try {
            console.log("Fetching document from Firebase...");
            const docRef = doc(db, "news", newsId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                console.log("Document found, loading content...");
                const news = docSnap.data();
                console.log("News data:", news);

                // Update page title
                document.title = news.title + " - BEM FKIP UMM";
                
                // Update news title
                const titleElement = document.getElementById('news-title');
                if (titleElement) {
                    titleElement.textContent = news.title;
                    titleElement.className = "text-3xl sm:text-4xl font-bold text-gray-800 mb-6";
                }
                
                // Update news image
                const imageElement = document.getElementById('news-image');
                if (imageElement) {
                    imageElement.src = news.imageUrl;
                    imageElement.alt = news.title;
                    imageElement.className = "w-full h-auto rounded-lg mb-8 shadow-lg";
                }
                
                // Update news meta information
                const metaElement = document.getElementById('news-meta');
                if (metaElement) {
                    metaElement.innerHTML = `<div class="flex items-center text-sm text-gray-500 mb-6 space-x-4"><span>By ${news.author}</span><span>&bull;</span><span>${news.date}</span></div>`;
                }

                // Update news content
                const contentElement = document.getElementById('news-content');
                if (contentElement) {
                    const paragraphsArray = news.content.split('\n').filter(p => p.trim() !== '');
                    const contentHtml = paragraphsArray.map(p => `<p class="mb-4 text-gray-700 leading-relaxed">${sanitizeHTML(p.trim())}</p>`).join('');
                    contentElement.innerHTML = contentHtml;
                }

                console.log("Article loaded successfully!");

            } else {
                console.error("Document does not exist");
                articleContainer.innerHTML = '<h1 class="text-3xl font-bold text-gray-800 mb-4">Artikel tidak ditemukan.</h1><p class="text-gray-600">Tidak ada berita dengan ID ini.</p>';
            }
        } catch (error) {
            console.error("Error fetching document:", error);
            articleContainer.innerHTML = '<h1 class="text-3xl font-bold text-red-600 mb-4">Terjadi Kesalahan</h1><p class="text-gray-600">Tidak dapat memuat artikel. Silakan coba lagi nanti.</p>';
        }
    }
    loadArticle();
}

// --- /struktural.html specific logic ---
const strukturKonten = document.getElementById('struktur-konten');
if (strukturKonten) { // Check if on struktural.html
    const cabinetDocRefPublic = doc(db, "cabinet", "current_cabinet");
    onSnapshot(cabinetDocRefPublic, (docSnap) => {
        if (docSnap.exists()) {
            const data = docSnap.data();
            for (const key in data) {
                const element = document.getElementById(key);
                if (element) {
                    if (Array.isArray(data[key])) {
                        element.innerHTML = data[key].map(name => `<span>${name}</span>`).join('');
                    } else {
                        element.textContent = data[key];
                    }
                }
            }
        } else {
            console.log("Cabinet document does not exist!");
        }
    }, (error) => {
        console.error("Error loading cabinet:", error);
    });
}

// --- /admin.html specific logic ---
const loginSection = document.getElementById('login-section');
const dashboardSection = document.getElementById('dashboard-section');
const loginForm = document.getElementById('login-form');
const tabs = document.querySelectorAll('.admin-tab-btn');
const contents = document.querySelectorAll('.tab-content');
const addNewsFormAdmin = document.getElementById('add-news-form'); // Renamed to avoid conflict
const successMessage = document.getElementById('success-message');
const newsListContainer = document.getElementById('news-list-container');
const editNewsModal = document.getElementById('edit-news-modal');
const editNewsForm = document.getElementById('edit-news-form');
const cancelEditBtn = document.getElementById('cancel-edit-btn');
const addPhotoForm = document.getElementById('add-photo-form');
const addPhotoStatus = document.getElementById('add-photo-status');
const galleryListContainer = document.getElementById('gallery-list-container');
const cabinetForm = document.getElementById('cabinet-form');
const cabinetStatus = document.getElementById('cabinet-status');
const logsListContainer = document.getElementById('logs-list-container');
const logsStatus = document.getElementById('logs-status');
// Invites (SUPERADMIN)
const generateInviteBtn = document.getElementById('generate-invite-btn');
const invitesStatus = document.getElementById('invites-status');
const invitesListContainer = document.getElementById('invites-list-container');
const inviteNoteInput = document.getElementById('invite-note-input');
const inviteCodeModal = document.getElementById('invite-code-modal');
const invitePlaintextInput = document.getElementById('invite-plaintext');
const copyInviteBtn = document.getElementById('copy-invite-btn');
const closeInviteModalBtn = document.getElementById('close-invite-modal');

if (dashboardSection) { // Check if on admin.html
    // Cabinet real-time listener unsubscribe holder
    let cabinetUnsub = null;

    // Logs real-time listener unsubscribe holder
    let logsUnsub = null;

    // Invites real-time listener unsubscribe holder
    let invitesUnsub = null;

    // --- TAB SWITCHING ---
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => {
                t.classList.remove('text-violet-600', 'border-violet-600');
                t.classList.add('text-gray-500', 'hover:text-gray-700', 'hover:border-gray-300');
            });
            contents.forEach(c => { c.classList.add('hidden'); c.classList.remove('active'); });

            tab.classList.add('text-violet-600', 'border-violet-600');
            tab.classList.remove('text-gray-500', 'hover:text-gray-700', 'hover:border-gray-300');

            const contentId = `content-${tab.id.split('-')[1]}`;
            const target = document.getElementById(contentId);
            if (target) { target.classList.remove('hidden'); target.classList.add('active'); }

            // stop previous listeners when changing tabs
            if (typeof cabinetUnsub === 'function') { cabinetUnsub(); cabinetUnsub = null; }
            if (typeof logsUnsub === 'function') { logsUnsub(); logsUnsub = null; }
            if (typeof invitesUnsub === 'function') { invitesUnsub(); invitesUnsub = null; }
            if (tab.id === 'tab-gallery') loadGalleryForAdmin();
            if (tab.id === 'tab-cabinet') startCabinetListener();
            if (tab.id === 'tab-invites') startInvitesListener();
            if (tab.id === 'tab-logs') startLogsListener();
        });
    });

    // --- AUTHENTICATION (Admin specific) ---
    onAuthStateChanged(auth, async user => {
        if (user) {
            await ensureUserDoc(user);
            currentUserRole = await getUserRole(user.uid);
            setRoleBadge(currentUserRole);
            // Show/hide SUPERADMIN tabs
            const logsTabBtn = document.getElementById('tab-logs');
            const invitesTabBtn = document.getElementById('tab-invites');
            if (logsTabBtn) {
                if (isSuper()) logsTabBtn.classList.remove('hidden');
                else logsTabBtn.classList.add('hidden');
            }
            if (invitesTabBtn) {
                if (isSuper()) invitesTabBtn.classList.remove('hidden');
                else invitesTabBtn.classList.add('hidden');
            }

            if (isAdminish()) {
                if (loginSection) loginSection.classList.add('hidden');
                if (dashboardSection) dashboardSection.classList.remove('hidden');
                loadNewsForAdmin();
                const newsContent = document.getElementById('content-news');
                if (newsContent) { newsContent.classList.add('active'); newsContent.classList.remove('hidden'); }
            } else {
                // No access to dashboard for BEM
                if (loginSection) {
                    loginSection.classList.remove('hidden');
                    const err = document.getElementById('error-message');
                    if (err) err.textContent = "Akses ditolak: Anda tidak memiliki izin.";
                }
                if (dashboardSection) dashboardSection.classList.add('hidden');
                // Ensure any admin-only realtime listeners are stopped
                if (typeof cabinetUnsub === 'function') { cabinetUnsub(); cabinetUnsub = null; }
                if (typeof logsUnsub === 'function') { logsUnsub(); logsUnsub = null; }
                if (typeof invitesUnsub === 'function') { invitesUnsub(); invitesUnsub = null; }
            }
        } else {
            currentUserRole = null;
            // Ensure any admin-only realtime listeners are stopped on sign-out
            if (typeof cabinetUnsub === 'function') { cabinetUnsub(); cabinetUnsub = null; }
            if (typeof logsUnsub === 'function') { logsUnsub(); logsUnsub = null; }
            if (typeof invitesUnsub === 'function') { invitesUnsub(); invitesUnsub = null; }
            if (loginSection) loginSection.classList.remove('hidden');
            if (dashboardSection) dashboardSection.classList.add('hidden');
            const logsTabBtn = document.getElementById('tab-logs');
            if (logsTabBtn) logsTabBtn.classList.add('hidden');
            const invitesTabBtn = document.getElementById('tab-invites');
            if (invitesTabBtn) invitesTabBtn.classList.add('hidden');
        }
    });
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            try {
                await signInWithEmailAndPassword(auth, e.target.elements['email-input'].value, e.target.elements['password-input'].value);
                await logActivity('login', {});
                // Do not toggle UI here; onAuthStateChanged will handle visibility based on role
            } catch (error) {
                const errEl = document.getElementById('error-message');
                if (errEl) errEl.textContent = "Email atau password salah.";
            }
        });
    }

    // --- NEWS MANAGEMENT ---
    if (addNewsFormAdmin) {
        addNewsFormAdmin.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!isAdminish()) { alert("Akses ditolak."); return; }
            const newsData = {
                title: e.target.elements['news-title-input'].value, content: e.target.elements['news-content-input'].value,
                imageUrl: e.target.elements['news-image-url-input'].value, category: e.target.elements['news-category-input'].value,
                author: 'BEM FKIP', date: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
            };
            try {
                const docRef = await addDoc(collection(db, "news"), newsData);
                await logActivity('news_add', { docId: docRef.id, title: newsData.title });
                addNewsFormAdmin.reset();
                if (successMessage) successMessage.textContent = "Berita berhasil ditambahkan!";
                setTimeout(() => { if (successMessage) successMessage.textContent = ''; }, 3000);
            } catch (err) { alert("Gagal menambahkan berita."); }
        });
    }
    function loadNewsForAdmin() {
        if (!newsListContainer) return;
        const newsQuery = query(collection(db, "news"), orderBy("date", "desc"));
        onSnapshot(newsQuery, (snapshot) => {
            let newsHtml = '';
            if (snapshot.empty) { newsListContainer.innerHTML = '<p>Belum ada berita.</p>'; return; }
            snapshot.forEach(doc => {
                const news = doc.data();
                newsHtml += `<div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"><div><p class="font-semibold">${news.title}</p><p class="text-sm text-gray-500">${news.date}</p></div><div class="flex space-x-2"><button data-id="${doc.id}" class="edit-btn text-sm bg-blue-500 text-white px-3 py-1 rounded-md">Edit</button><button data-id="${doc.id}" class="delete-btn text-sm bg-red-500 text-white px-3 py-1 rounded-md">Delete</button></div></div>`;
            });
            newsListContainer.innerHTML = newsHtml;
        });
    }
    if (newsListContainer) {
        newsListContainer.addEventListener('click', async (e) => {
            const newsId = e.target.dataset.id;
            if (!newsId) return;
            if (e.target.classList.contains('delete-btn')) {
                if (!isAdminish()) { alert("Akses ditolak."); return; }
                if (confirm("Yakin ingin menghapus berita ini?")) { 
                    const ref = doc(db, "news", newsId);
                    const snap = await getDoc(ref);
                    const title = snap.exists() ? (snap.data().title || '') : '';
                    await deleteDoc(ref); 
                    await logActivity('news_delete', { docId: newsId, title });
                }
            }
            if (e.target.classList.contains('edit-btn')) {
                if (!isAdminish()) { alert("Akses ditolak."); return; }
                const docSnap = await getDoc(doc(db, "news", newsId));
                if (docSnap.exists()) {
                    const news = docSnap.data();
                    if (editNewsForm) {
                        editNewsForm.elements['edit-news-id'].value = newsId;
                        editNewsForm.elements['edit-news-title'].value = news.title;
                        editNewsForm.elements['edit-news-content'].value = news.content;
                        editNewsForm.elements['edit-news-image'].value = news.imageUrl;
                        editNewsForm.elements['edit-news-category'].value = news.category;
                        if (editNewsModal) editNewsModal.classList.remove('hidden');
                    }
                }
            }
        });
    }
    if (editNewsForm) {
        editNewsForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!isAdminish()) { alert("Akses ditolak."); return; }
            const newsId = e.target.elements['edit-news-id'].value;
            const updatedData = {
                title: e.target.elements['edit-news-title'].value, content: e.target.elements['edit-news-content'].value,
                imageUrl: e.target.elements['edit-news-image'].value, category: e.target.elements['edit-news-category'].value,
            };
            const prevSnap = await getDoc(doc(db, "news", newsId));
            const prevData = prevSnap.exists() ? prevSnap.data() : {};
            const changes = diffObjects(prevData, updatedData);
            const ignore = new Set(['date','updatedAt']);
            const filteredChanges = changes.filter(c => !ignore.has(c.key));
            const fields = filteredChanges.map(c => c.key);
            await updateDoc(doc(db, "news", newsId), updatedData);
            await logActivity('news_edit', { docId: newsId, title: prevData.title || updatedData.title || '', changes: filteredChanges, fields });
            if (editNewsModal) editNewsModal.classList.add('hidden');
        });
    }
    if (cancelEditBtn) cancelEditBtn.addEventListener('click', () => { if (editNewsModal) editNewsModal.classList.add('hidden'); });

    // --- GALLERY MANAGEMENT ---
    if (addPhotoForm) {
        addPhotoForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!isAdminish()) { alert("Akses ditolak."); return; }
            const photoData = {
                imageUrl: e.target.elements['photo-url-input'].value, caption: e.target.elements['photo-caption-input'].value,
                uploadedAt: new Date()
            };
            try {
                const docRef = await addDoc(collection(db, "gallery"), photoData);
                await logActivity('gallery_add', { docId: docRef.id, caption: photoData.caption });
                if (addPhotoStatus) addPhotoStatus.textContent = "Foto berhasil ditambahkan!";
                addPhotoForm.reset();
                setTimeout(() => { if (addPhotoStatus) addPhotoStatus.textContent = ''; }, 3000);
            } catch (error) { if (addPhotoStatus) addPhotoStatus.textContent = "Gagal menambahkan foto."; }
        });
    }
    function loadGalleryForAdmin() {
        if (!galleryListContainer) return;
        const galleryQuery = query(collection(db, "gallery"), orderBy("uploadedAt", "desc"));
        onSnapshot(galleryQuery, (snapshot) => {
            let photosHtml = '';
            if (snapshot.empty) { galleryListContainer.innerHTML = '<p>Belum ada foto di galeri.</p>'; return; }
            snapshot.forEach(doc => {
                const photo = doc.data();
                photosHtml += `<div class="flex items-center justify-between p-2 bg-gray-50 rounded-lg border"><img src="${photo.imageUrl}" class="w-12 h-12 object-cover rounded-md mr-4"><p class="font-semibold text-sm flex-grow">${photo.caption}</p><button data-id="${doc.id}" class="delete-photo-btn text-sm bg-red-500 text-white px-3 py-1 rounded-md">Delete</button></div>`;
            });
            galleryListContainer.innerHTML = photosHtml;
        });
    }
    if (galleryListContainer) {
        galleryListContainer.addEventListener('click', async (e) => {
            if (e.target.classList.contains('delete-photo-btn')) {
                if (!isAdminish()) { alert("Akses ditolak."); return; }
                if (confirm("Yakin ingin menghapus foto ini?")) { 
                    const id = e.target.dataset.id;
                    const ref = doc(db, "gallery", id);
                    const snap = await getDoc(ref);
                    const caption = snap.exists() ? (snap.data().caption || '') : '';
                    await deleteDoc(ref); 
                    await logActivity('gallery_delete', { docId: id, caption });
                }
            }
        });
    }

    // --- INVITE CODES (SUPERADMIN only) ---
    function startInvitesListener() {
        if (!isSuper()) {
            if (invitesStatus) invitesStatus.textContent = "Akses ditolak.";
            if (invitesListContainer) invitesListContainer.innerHTML = '';
            return;
        }
        if (typeof invitesUnsub === 'function') { invitesUnsub(); invitesUnsub = null; }
        if (invitesStatus) invitesStatus.textContent = "Memuat daftar kode...";
        try {
            const qInv = query(collection(db, "invite_codes"), orderBy("createdAt", "desc"));
            invitesUnsub = onSnapshot(qInv, async (snapshot) => {
                if (!invitesListContainer) return;
                if (snapshot.empty) {
                    invitesListContainer.innerHTML = '<p class="text-gray-500">Belum ada undangan.</p>';
                    if (invitesStatus) invitesStatus.textContent = "";
                    return;
                }
                let html = '';
                snapshot.forEach(d => {
                    const v = d.data();
                    const usedBadge = v.used ? '<span class="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800">used</span>' : '<span class="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800">unused</span>';
                    const usedBy = v.usedBy ? v.usedBy : '-';
                    const ts = v.createdAt && typeof v.createdAt.toDate === 'function' ? v.createdAt.toDate().toLocaleString('id-ID') : '-';
                    html += `
                        <div class="p-3 border rounded-md bg-gray-50 flex items-center justify-between">
                            <div>
                                <div class="font-semibold text-sm">CodeId: ${d.id.slice(0,8)}…</div>
                                <div class="text-xs text-gray-600">created: ${ts} • by: ${v.createdBy || '-'}</div>
                                <div class="text-xs text-gray-600">usedBy: ${usedBy}</div>
                            </div>
                            <div class="flex items-center gap-2">
                                ${usedBadge}
                                ${v.used ? '' : `<button data-id="${d.id}" class="revoke-invite-btn px-3 py-1 text-sm bg-red-500 text-white rounded-md">Revoke</button>`}
                            </div>
                        </div>
                    `;
                });
                invitesListContainer.innerHTML = html;
                if (invitesStatus) invitesStatus.textContent = "";
            }, (error) => {
                console.error("invites listener error:", error);
                if (invitesStatus) invitesStatus.textContent = "Gagal memuat undangan.";
            });
        } catch (e) {
            console.error("startInvitesListener error:", e);
            if (invitesStatus) invitesStatus.textContent = "Gagal memuat undangan.";
        }
    }
    if (generateInviteBtn) {
        generateInviteBtn.addEventListener('click', async () => {
            if (!isSuper()) { if (invitesStatus) invitesStatus.textContent = "Akses ditolak."; return; }
            try {
                const plaintext = randomCode(12);
                const hash = await sha256Hex(plaintext);
                const note = inviteNoteInput ? inviteNoteInput.value.trim() : '';
                await setDoc(doc(db, "invite_codes", hash), {
                    createdBy: auth.currentUser ? auth.currentUser.uid : '',
                    createdAt: serverTimestamp(),
                    used: false,
                    usedBy: null,
                    usedAt: null,
                    role: ROLE.BEM,
                    note
                });
                await logActivity('invite_generate', { codeId: hash });
                if (invitePlaintextInput) invitePlaintextInput.value = plaintext;
                if (inviteCodeModal) inviteCodeModal.classList.remove('hidden');
            } catch (e) {
                console.error("generate invite error:", e);
                if (invitesStatus) invitesStatus.textContent = "Gagal membuat kode.";
            }
        });
    }
    if (copyInviteBtn) {
        copyInviteBtn.addEventListener('click', async () => {
            try {
                const val = invitePlaintextInput ? invitePlaintextInput.value : '';
                await navigator.clipboard.writeText(val);
            } catch {}
        });
    }
    if (closeInviteModalBtn) {
        closeInviteModalBtn.addEventListener('click', () => { if (inviteCodeModal) inviteCodeModal.classList.add('hidden'); });
    }
    if (invitesListContainer) {
        invitesListContainer.addEventListener('click', async (e) => {
            const target = e.target;
            if (target && target.classList.contains('revoke-invite-btn')) {
                const id = target.getAttribute('data-id');
                if (!id) return;
                if (!confirm("Revoke kode ini?")) return;
                try {
                    await deleteDoc(doc(db, "invite_codes", id));
                    await logActivity('invite_revoke', { codeId: id });
                } catch (e) {
                    console.error("revoke invite error:", e);
                }
            }
        });
    }

    // --- AUDIT LOGS (SUPERADMIN only) ---
    function startLogsListener() {
        // Guard by role
        if (!isSuper()) {
            if (logsStatus) logsStatus.textContent = "Akses ditolak.";
            if (logsListContainer) logsListContainer.innerHTML = '';
            return;
        }
        if (typeof logsUnsub === 'function') { logsUnsub(); logsUnsub = null; }
        if (logsStatus) logsStatus.textContent = "Memuat log...";

        try {
            const logsQuery = query(collection(db, "audit_logs"), orderBy("at", "desc"));
            logsUnsub = onSnapshot(logsQuery, (snapshot) => {
                if (!logsListContainer) return;
                if (snapshot.empty) {
                    logsListContainer.innerHTML = '<p class="text-gray-500">Belum ada log.</p>';
                    if (logsStatus) logsStatus.textContent = "";
                    return;
                }
                let html = '';
                snapshot.forEach(d => {
                    const log = d.data();
                    const ts = log.at && typeof log.at.toDate === 'function' ? log.at.toDate().toLocaleString('id-ID') : '-';
                    const who = log.email || log.uid || '';
                    const message = describeLog(log);
                    html += `
                        <div class="p-3 border rounded-md bg-gray-50">
                            <div class="flex items-center justify-between text-xs text-gray-500">
                                <span>${ts}</span>
                                <span>${who}</span>
                            </div>
                            <div class="mt-1 text-sm text-gray-800">${message}</div>
                        </div>
                    `;
                });
                logsListContainer.innerHTML = html;
                if (logsStatus) logsStatus.textContent = "";
            }, (error) => {
                console.error("logs listener error:", error);
                if (logsStatus) logsStatus.textContent = "Gagal memuat log.";
            });
        } catch (e) {
            console.error("startLogsListener error:", e);
            if (logsStatus) logsStatus.textContent = "Gagal memuat log.";
        }
    }

    // --- CABINET MANAGEMENT ---
    const cabinetDocRef = doc(db, "cabinet", "current_cabinet");
    function startCabinetListener() {
        if (typeof cabinetUnsub === 'function') { cabinetUnsub(); cabinetUnsub = null; }
        if (cabinetStatus) cabinetStatus.textContent = "Memuat data...";
        cabinetUnsub = onSnapshot(cabinetDocRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data() || {};
                for (const key in data) {
                    const element = document.getElementById(key);
                    if (element) {
                        if (Array.isArray(data[key])) { element.value = data[key].join(', '); }
                        else { element.value = data[key]; }
                    }
                }
                if (cabinetStatus) cabinetStatus.textContent = "";
            } else {
                if (cabinetForm) {
                    const inputs = cabinetForm.querySelectorAll('input[type="text"], textarea');
                    inputs.forEach(input => { input.value = ''; });
                }
                if (cabinetStatus) cabinetStatus.textContent = "Dokumen kabinet belum ada. Isi form dan simpan untuk membuat.";
            }
        }, (error) => {
            console.error("Error listening cabinet data:", error);
            if (cabinetStatus) cabinetStatus.textContent = "Gagal memuat data kabinet.";
        });
    }
    if (cabinetForm) {
        cabinetForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!isAdminish()) { if (cabinetStatus) cabinetStatus.textContent = "Akses ditolak."; return; }
            const updatedData = {};
            const inputs = cabinetForm.querySelectorAll('input[type="text"], textarea');
            inputs.forEach(input => {
                if (input.tagName.toLowerCase() === 'textarea') {
                    updatedData[input.id] = input.value.split(',').map(item => item.trim()).filter(item => item);
                } else { updatedData[input.id] = input.value; }
            });
            try {
                const prevSnap = await getDoc(cabinetDocRef);
                const prevData = prevSnap.exists() ? prevSnap.data() : {};
                const changes = diffObjects(prevData, updatedData);
                await setDoc(cabinetDocRef, updatedData);
                await logActivity('cabinet_update', { changes });
                if (cabinetStatus) cabinetStatus.textContent = "Struktur kabinet berhasil diperbarui!";
                setTimeout(() => { if (cabinetStatus) cabinetStatus.textContent = '' }, 3000);
            } catch (error) { if (cabinetStatus) cabinetStatus.textContent = "Gagal memperbarui data."; }
        });
    }
}

// --- Initialize Features for all pages ---
initFeatures();
