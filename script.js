// Skrip untuk efek typing animation
const typingTextElement = document.getElementById('typing-text');
const textToType = "LippWangsaff";
let i = 0;
function typeWriter() {
    if (i < textToType.length) {
        typingTextElement.innerHTML += textToType.charAt(i);
        i++;
        setTimeout(typeWriter, 150); // Kecepatan ketik
    }
}

// Skrip untuk pengubah tema
const htmlElement = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const backToTopBtn = document.getElementById('back-to-top');
const navMenu = document.getElementById('nav-menu');
const hamburgerButton = document.getElementById('hamburger-button');

// Three.js Global Variables
let scene, camera, renderer, particles, mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
let particleColor = new THREE.Color();
let particleCount = 2000; // Jumlah partikel

// Fungsi untuk menginisialisasi Three.js background
function initThreeDBackground() {
    // Scene: Tempat di mana objek, cahaya, dan kamera berada
    scene = new THREE.Scene();
    
    // Kamera: Sudut pandang ke dalam scene
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 1000;
    
    // Renderer: Menggambar scene di kanvas
    renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('three-js-bg'), alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // Latar belakang transparan
    
    // Partikel: Membuat geometri dan material
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    const color = new THREE.Color();
    const currentTheme = htmlElement.classList.contains('light') ? 'light' : 'dark';
    const baseColor = currentTheme === 'light' ? 0x00aaff : 0x36CFFF;

    for (let i = 0; i < particleCount; i++) {
        // Menempatkan partikel di ruang 3D secara acak
        positions[i * 3 + 0] = Math.random() * 2000 - 1000;
        positions[i * 3 + 1] = Math.random() * 2000 - 1000;
        positions[i * 3 + 2] = Math.random() * 2000 - 1000;

        // Mengatur warna partikel
        color.setHex(baseColor);
        colors[i * 3 + 0] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;

        // Mengatur ukuran partikel secara acak
        sizes[i] = 10 + Math.random() * 20;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    // Material: Menentukan tampilan partikel (warna, ukuran, dll)
    const material = new THREE.PointsMaterial({
        size: 15, // Ukuran default partikel
        sizeAttenuation: true,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Menambahkan event listener untuk interaksi mouse
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    window.addEventListener('resize', onWindowResize, false);
}

// Fungsi animasi Three.js
function animate() {
    requestAnimationFrame(animate);
    render();
}

// Fungsi render Three.js
function render() {
    camera.position.x += (mouseX - camera.position.x) * 0.05;
    camera.position.y += (-mouseY - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
}

// Fungsi untuk menangani resize window
function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Fungsi untuk menangani pergerakan mouse
function onDocumentMouseMove(event) {
    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;
}

// Fungsi untuk mengubah warna partikel saat tema diganti
function updateParticleColors(theme) {
    if (!particles || !particles.geometry) return;
    const colors = particles.geometry.attributes.color.array;
    const color = new THREE.Color();
    const baseColor = theme === 'light' ? 0x00aaff : 0x36CFFF;
    for (let i = 0; i < colors.length / 3; i++) {
        color.setHex(baseColor);
        colors[i * 3 + 0] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
    }
    particles.geometry.attributes.color.needsUpdate = true;
}

// Atur tema saat halaman dimuat dari localStorage
function setTheme(theme) {
    if (theme === 'light') {
        htmlElement.classList.add('light');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else {
        htmlElement.classList.remove('light');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }
    localStorage.setItem('theme', theme);
    updateParticleColors(theme);
}

// Skrip untuk navigasi dan tombol kembali ke atas
window.addEventListener('scroll', () => {
    // Animasi untuk navbar saat scroll
    const nav = document.getElementById('main-nav');
    if (window.scrollY > 50) {
        nav.classList.add('py-2');
        nav.classList.remove('py-4');
        nav.classList.add('bg-opacity-95');
        nav.classList.add('md:shadow-md');
    } else {
        nav.classList.remove('py-2');
        nav.classList.add('py-4');
        nav.classList.remove('bg-opacity-95');
        nav.classList.remove('md:shadow-md');
    }

    // Animasi untuk tombol back-to-top
    if (window.scrollY > 300) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
});

document.getElementById('back-to-top').addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Event listener untuk tombol hamburger
hamburgerButton.addEventListener('click', () => {
    navMenu.classList.toggle('hidden');
});

// Menutup menu mobile saat link diklik
const navLinks = navMenu.querySelectorAll('a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (!navMenu.classList.contains('hidden') && window.innerWidth < 768) {
            navMenu.classList.add('hidden');
        }
    });
});

// Atur tema saat halaman dimuat
document.addEventListener('DOMContentLoaded', (event) => {
    // Inisialisasi AOS.js
    AOS.init({
        duration: 1000,
        once: true,
    });

    // Inisialisasi Three.js dan animasinya setelah halaman dimuat
    initThreeDBackground();
    animate();

    // Atur tema dan mulai animasi setelah Three.js diinisialisasi
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    
    // Fade out the loading screen once the page is fully loaded
    window.addEventListener('load', () => {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            typeWriter(); // Start the typing animation after loading screen is gone
        }, 500); // Wait for the fade-out transition to complete
    });
});

// Event listener untuk tombol pengubah tema
themeToggle.addEventListener('click', () => {
    const currentTheme = htmlElement.classList.contains('light') ? 'dark' : 'light';
    setTheme(currentTheme);
});

// Logika untuk Modal Proyek
const projectData = {
    'project-1': {
        title: 'Project One: Aplikasi Manajemen Tugas',
        description: 'Sebuah aplikasi web yang dirancang untuk membantu pengguna mengelola tugas harian mereka dengan antarmuka yang intuitif. Dibangun menggunakan **React** untuk front-end yang dinamis dan **Firebase** untuk back-end, menyediakan fitur otentikasi pengguna, penyimpanan data real-time, dan notifikasi.',
        tech: ['React', 'Firebase', 'Tailwind CSS'],
        image: 'https://placehold.co/800x450/0F172A/36CFFF?text=Proyek+Satu'
    },
    'project-2': {
        title: 'Project Two: Game Puzzle 2D',
        description: 'Game puzzle 2D sederhana yang dibuat menggunakan vanilla **JavaScript** dan elemen **HTML Canvas**. Proyek ini menampilkan animasi yang halus, logika permainan yang menantang, sistem skor, dan efek suara interaktif. Ini adalah demonstrasi kemampuan untuk membuat aplikasi interaktif tanpa framework.',
        tech: ['JavaScript', 'HTML Canvas', 'CSS'],
        image: 'https://placehold.co/800x450/0F172A/36CFFF?text=Proyek+Dua'
    },
    'project-3': {
        title: 'Project Three: E-commerce Dummy',
        description: 'Prototipe aplikasi e-commerce dengan fitur-fitur dasar seperti keranjang belanja, otentikasi pengguna (login/logout), dan daftar produk. Menggunakan **Node.js** dan **Express.js** untuk back-end, dengan database **MongoDB** untuk menyimpan data produk dan pengguna.',
        tech: ['Node.js', 'Express.js', 'MongoDB'],
        image: 'https://placehold.co/800x450/0F172A/36CFFF?text=Proyek+Tiga'
    },
    'project-4': {
        title: 'Project Four: AI-Powered Chatbot',
        description: 'Chatbot pintar yang dikembangkan menggunakan **Python** dan framework web **Flask**. Chatbot ini mampu memahami input bahasa alami dari pengguna dan memberikan respons yang relevan, menjadikannya asisten virtual yang efektif untuk berbagai kasus penggunaan.',
        tech: ['Python', 'Flask', 'Machine Learning'],
        image: 'https://placehold.co/800x450/0F172A/36CFFF?text=Proyek+Empat'
    },
    'project-5': {
        title: 'Project Five: Real-time Multiplayer Game',
        description: 'Sebuah game multiplayer sederhana berbasis web yang memungkinkan beberapa pemain berinteraksi dalam satu sesi. Proyek ini menggunakan **Socket.IO** untuk komunikasi real-time yang cepat dan lancar, menciptakan pengalaman bermain yang mulus bagi semua pemain.',
        tech: ['JavaScript', 'Node.js', 'Socket.IO'],
        image: 'https://placehold.co/800x450/0F172A/36CFFF?text=Proyek+Lima'
    }
};

const modal = document.getElementById('projectModal');
const closeModalBtn = document.getElementsByClassName('close-modal-btn')[0];
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');
const modalTechList = document.getElementById('modal-tech-list');
const modalImage = document.getElementById('modal-image');

function openModal(projectId) {
    const project = projectData[projectId];
    if (project) {
        modalImage.src = project.image;
        modalTitle.textContent = project.title;
        modalDescription.textContent = project.description;
        
        modalTechList.innerHTML = '';
        project.tech.forEach(tech => {
            const techBadge = document.createElement('span');
            techBadge.textContent = tech;
            techBadge.className = 'bg-[var(--primary-color)] text-[var(--background-color)] font-semibold text-sm px-3 py-1 rounded-full';
            modalTechList.appendChild(techBadge);
        });

        modal.style.display = 'block';
    }
}

closeModalBtn.onclick = function() {
    modal.style.display = 'none';
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

