import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, doc, deleteDoc, getDoc, updateDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

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

// --- Common Elements (used across multiple pages) ---
const logoutBtn = document.getElementById('logout-btn');
const loginBtn = document.getElementById('login-btn');
const dashboardBtn = document.getElementById('dashboard-btn');

// --- Authentication State Checker (Common) ---
if (auth && loginBtn && logoutBtn && dashboardBtn) { // Check if elements exist on the page
    onAuthStateChanged(auth, (user) => {
        if (user) {
            loginBtn.classList.add('hidden');
            logoutBtn.classList.remove('hidden');
            dashboardBtn.classList.remove('hidden');
            // Specific for index.html
            const addNewsBtnContainer = document.getElementById('add-news-btn-container');
            if (addNewsBtnContainer) addNewsBtnContainer.classList.remove('hidden');
        } else {
            loginBtn.classList.remove('hidden');
            logoutBtn.classList.add('hidden');
            dashboardBtn.classList.add('hidden');
            // Specific for index.html
            const addNewsBtnContainer = document.getElementById('add-news-btn-container');
            if (addNewsBtnContainer) addNewsBtnContainer.classList.add('hidden');
        }
    });
}

// --- Logout Button Functionality (Common) ---
if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        signOut(auth).catch((error) => console.error("Sign Out Error", error));
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
            const newsData = {
                title: document.getElementById('news-title-input').value,
                content: document.getElementById('news-content-input').value,
                imageUrl: document.getElementById('news-image-url-input').value,
                category: document.getElementById('news-category-input').value,
                author: 'BEM FKIP',
                date: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
            };
            try {
                await addDoc(collection(db, "news"), newsData);
                newsFormModal.classList.add('hidden');
                addNewsForm.reset();
                showModal("Berhasil!", "Berita baru telah ditambahkan.");
            } catch (err) {
                console.error("Error adding document: ", err);
                showModal("Error", "Gagal menambahkan berita.");
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
                <a href="news-detail.html?id=${doc.id}" class="block rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden bg-white text-gray-800">
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
    });
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
    async function loadCabinet() {
        const docRef = doc(db, "cabinet", "current_cabinet");
        try {
            const docSnap = await getDoc(docRef);
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
        } catch (error) {
            console.error("Error loading cabinet:", error);
        }
    }
    loadCabinet();
}

// --- /admin.html specific logic ---
const loginSection = document.getElementById('login-section');
const dashboardSection = document.getElementById('dashboard-section');
const loginForm = document.getElementById('login-form');
const tabs = document.querySelectorAll('.tab-btn');
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

if (dashboardSection) { // Check if on admin.html
    // --- TAB SWITCHING ---
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => {
                t.classList.remove('text-violet-600', 'border-violet-600');
                t.classList.add('text-gray-500', 'hover:text-gray-700', 'hover:border-gray-300');
            });
            contents.forEach(c => c.classList.add('hidden'));

            tab.classList.add('text-violet-600', 'border-violet-600');
            tab.classList.remove('text-gray-500', 'hover:text-gray-700', 'hover:border-gray-300');

            const contentId = `content-${tab.id.split('-')[1]}`;
            document.getElementById(contentId).classList.remove('hidden');

            if (tab.id === 'tab-gallery') loadGalleryForAdmin();
            if (tab.id === 'tab-cabinet') loadCabinetData();
        });
    });

    // --- AUTHENTICATION (Admin specific) ---
    onAuthStateChanged(auth, user => {
        if (user) {
            if (loginSection) loginSection.classList.add('hidden');
            if (dashboardSection) dashboardSection.classList.remove('hidden');
            loadNewsForAdmin();
        } else {
            if (loginSection) loginSection.classList.remove('hidden');
            if (dashboardSection) dashboardSection.classList.add('hidden');
        }
    });
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            signInWithEmailAndPassword(auth, e.target.elements['email-input'].value, e.target.elements['password-input'].value)
                .then(() => { window.location.href = '/index'; })
                .catch((error) => { document.getElementById('error-message').textContent = "Email atau password salah."; });
        });
    }

    // --- NEWS MANAGEMENT ---
    if (addNewsFormAdmin) {
        addNewsFormAdmin.addEventListener('submit', async (e) => {
            e.preventDefault();
            const newsData = {
                title: e.target.elements['news-title-input'].value, content: e.target.elements['news-content-input'].value,
                imageUrl: e.target.elements['news-image-url-input'].value, category: e.target.elements['news-category-input'].value,
                author: 'BEM FKIP', date: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
            };
            try {
                await addDoc(collection(db, "news"), newsData);
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
                if (confirm("Yakin ingin menghapus berita ini?")) { await deleteDoc(doc(db, "news", newsId)); }
            }
            if (e.target.classList.contains('edit-btn')) {
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
            const newsId = e.target.elements['edit-news-id'].value;
            const updatedData = {
                title: e.target.elements['edit-news-title'].value, content: e.target.elements['edit-news-content'].value,
                imageUrl: e.target.elements['edit-news-image'].value, category: e.target.elements['edit-news-category'].value,
            };
            await updateDoc(doc(db, "news", newsId), updatedData);
            if (editNewsModal) editNewsModal.classList.add('hidden');
        });
    }
    if (cancelEditBtn) cancelEditBtn.addEventListener('click', () => { if (editNewsModal) editNewsModal.classList.add('hidden'); });

    // --- GALLERY MANAGEMENT ---
    if (addPhotoForm) {
        addPhotoForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const photoData = {
                imageUrl: e.target.elements['photo-url-input'].value, caption: e.target.elements['photo-caption-input'].value,
                uploadedAt: new Date()
            };
            try {
                await addDoc(collection(db, "gallery"), photoData);
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
                if (confirm("Yakin ingin menghapus foto ini?")) { await deleteDoc(doc(db, "gallery", e.target.dataset.id)); }
            }
        });
    }

    // --- CABINET MANAGEMENT ---
    const cabinetDocRef = doc(db, "cabinet", "current_cabinet");
    async function loadCabinetData() {
        if (cabinetStatus) cabinetStatus.textContent = "Memuat data...";
        try {
            const docSnap = await getDoc(cabinetDocRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                for (const key in data) {
                    const element = document.getElementById(key);
                    if (element) {
                        if (Array.isArray(data[key])) { element.value = data[key].join(', '); }
                        else { element.value = data[key]; }
                    }
                }
                if (cabinetStatus) cabinetStatus.textContent = "";
            } else { if (cabinetStatus) cabinetStatus.textContent = "Dokumen kabinet tidak ditemukan."; }
        } catch (error) { console.error("Error loading cabinet data:", error); }
    }
    if (cabinetForm) {
        cabinetForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const updatedData = {};
            const inputs = cabinetForm.querySelectorAll('input[type="text"], textarea');
            inputs.forEach(input => {
                if (input.tagName.toLowerCase() === 'textarea') {
                    updatedData[input.id] = input.value.split(',').map(item => item.trim()).filter(item => item);
                } else { updatedData[input.id] = input.value; }
            });
            try {
                await setDoc(cabinetDocRef, updatedData);
                if (cabinetStatus) cabinetStatus.textContent = "Struktur kabinet berhasil diperbarui!";
                setTimeout(() => { if (cabinetStatus) cabinetStatus.textContent = '' }, 3000);
            } catch (error) { if (cabinetStatus) cabinetStatus.textContent = "Gagal memperbarui data."; }
        });
    }
}
