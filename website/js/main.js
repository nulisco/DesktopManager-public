document.addEventListener('DOMContentLoaded', () => {
    // Theme Logic
    const themeBtn = document.getElementById('themeBtn');
    const themeIcon = document.getElementById('themeIcon');
    const htmlElement = document.documentElement;

    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
        updateIcon(savedTheme);
    } else if (systemPrefersDark) {
        htmlElement.setAttribute('data-theme', 'dark');
        updateIcon('dark');
    } else {
        htmlElement.setAttribute('data-theme', 'light');
        updateIcon('light');
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateIcon(newTheme);
        });
    }

    function updateIcon(theme) {
        if (themeIcon) {
            themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
        }
    }

    // Copy to Clipboard Logic
    const copyBtn = document.getElementById('copyBtn');
    const wingetCmd = document.getElementById('wingetCmd');

    if (copyBtn && wingetCmd) {
        copyBtn.addEventListener('click', () => {
            const textToCopy = wingetCmd.innerText;
            navigator.clipboard.writeText(textToCopy).then(() => {
                const originalIcon = copyBtn.innerHTML;
                copyBtn.innerHTML = '<span style="color: #ffffff; font-weight: bold;">✓</span>';
                setTimeout(() => {
                    copyBtn.innerHTML = originalIcon;
                }, 2000);
            }).catch(err => { console.error('Failed to copy', err); });
        });
    }

    // Carousel Navigation Logic
    const carousel = document.getElementById('carousel');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (carousel && prevBtn && nextBtn) {
        nextBtn.addEventListener('click', () => {
            const scrollAmount = carousel.offsetWidth * 0.7;
            carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });
        
        prevBtn.addEventListener('click', () => {
            const scrollAmount = carousel.offsetWidth * 0.7;
            carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });
    }

    // Privacy Modal Logic
    const privacyModal = document.getElementById('privacyModal');
    const closePrivacy = document.getElementById('closePrivacy');
    const privacyLinkHero = document.getElementById('privacyLinkHero');

    function openPrivacy() {
        if (privacyModal) privacyModal.showModal();
    }

    function closePrivacyModal() {
        if (privacyModal) privacyModal.close();
    }

    if (privacyLinkHero) {
        privacyLinkHero.addEventListener('click', (e) => {
            e.preventDefault();
            openPrivacy();
        });
    }

    if (closePrivacy) {
        closePrivacy.addEventListener('click', closePrivacyModal);
    }

    if (privacyModal) {
        // Close modal when clicking backdrop
        privacyModal.addEventListener('click', (e) => {
            if (e.target === privacyModal) closePrivacyModal();
        });
    }

    // Auto-open if URL has #privacy
    if (window.location.hash === '#privacy') {
        openPrivacy();
    }

    // Handle hash changes
    window.addEventListener('hashchange', () => {
        if (window.location.hash === '#privacy') {
            openPrivacy();
        }
    });

    // Lightbox Logic
    const imageModal = document.getElementById('imageModal');
    const lightboxImg = document.getElementById('lightboxImg');
    const closeLightbox = document.getElementById('closeLightbox');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    const screenshots = document.querySelectorAll('.screenshot-card img');
    
    let currentIndex = 0;

    if (imageModal && lightboxImg) {
        const updateLightbox = (index) => {
            currentIndex = index;
            lightboxImg.src = screenshots[currentIndex].src;
        };

        screenshots.forEach((img, index) => {
            img.parentElement.addEventListener('click', () => {
                updateLightbox(index);
                imageModal.showModal();
            });
        });

        const nextImage = (e) => {
            if (e) e.stopPropagation();
            updateLightbox((currentIndex + 1) % screenshots.length);
        };

        const prevImage = (e) => {
            if (e) e.stopPropagation();
            updateLightbox((currentIndex - 1 + screenshots.length) % screenshots.length);
        };

        if (lightboxNext) lightboxNext.addEventListener('click', nextImage);
        if (lightboxPrev) lightboxPrev.addEventListener('click', prevImage);

        const closeImageModal = () => imageModal.close();
        if (closeLightbox) closeLightbox.addEventListener('click', closeImageModal);
        
        imageModal.addEventListener('click', (e) => {
            if (e.target === imageModal) closeImageModal();
        });

        // Keyboard Navigation
        document.addEventListener('keydown', (e) => {
            if (!imageModal.open) return;
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
            if (e.key === 'Escape') closeImageModal();
        });
    }
});
