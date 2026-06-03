/* =============================================
   REDWAY FIRE PROTECTION — MODERN SCRIPTS v2
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {


    // ==========================================
    //  NAVBAR SCROLL EFFECT
    // ==========================================
    const navbar = document.getElementById('navbar');
    function handleNavScroll() {
        if (!navbar) return;
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    window.addEventListener('scroll', handleNavScroll);
    handleNavScroll();

    // ==========================================
    //  MOBILE MENU
    // ==========================================
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');

    if (menuToggle && navLinks) {
        // Create overlay element
        const overlay = document.createElement('div');
        overlay.className = 'nav-overlay';
        document.body.appendChild(overlay);

        function openMenu() {
            menuToggle.classList.add('active');
            navLinks.classList.add('open');
            overlay.classList.add('active');
            document.body.classList.add('menu-open');
        }

        function closeMenu() {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('open');
            overlay.classList.remove('active');
            document.body.classList.remove('menu-open');
            // Close any open dropdowns
            navLinks.querySelectorAll('.has-dropdown.active').forEach(dd => dd.classList.remove('active'));
        }

        menuToggle.addEventListener('click', () => {
            if (navLinks.classList.contains('open')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        // Overlay click closes menu
        overlay.addEventListener('click', closeMenu);

        // Dropdown toggle on mobile
        navLinks.querySelectorAll('.has-dropdown > a').forEach(link => {
            link.addEventListener('click', e => {
                if (window.innerWidth <= 1024) {
                    e.preventDefault();
                    link.parentElement.classList.toggle('active');
                }
            });
        });

        // Close on link click
        navLinks.querySelectorAll('a:not(.has-dropdown > a)').forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // Close on click outside
        document.addEventListener('click', e => {
            if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
                closeMenu();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && navLinks.classList.contains('open')) {
                closeMenu();
            }
        });
    }

    // ==========================================
    //  HERO IMAGE CROSSFADE
    // ==========================================
    const heroImages = document.querySelectorAll('.hero-img');
    if (heroImages.length > 1) {
        let currentImg = 0;
        setInterval(() => {
            heroImages[currentImg].classList.remove('active');
            currentImg = (currentImg + 1) % heroImages.length;
            heroImages[currentImg].classList.add('active');
        }, 6000);
    }

    // ==========================================
    //  COUNTER ANIMATION
    // ==========================================
    const counters = document.querySelectorAll('[data-count]');
    let counterDone = false;

    function animateCounters() {
        counters.forEach(el => {
            const target = parseInt(el.getAttribute('data-count'));
            const duration = 2200;
            const step = target / (duration / 16);
            let current = 0;
            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    el.textContent = target;
                    clearInterval(timer);
                } else {
                    el.textContent = Math.floor(current);
                }
            }, 16);
        });
    }

    function checkCounters() {
        if (counterDone) return;
        const first = counters[0];
        if (!first) return;
        const rect = first.getBoundingClientRect();
        if (rect.top < window.innerHeight - 50) {
            counterDone = true;
            animateCounters();
        }
    }
    window.addEventListener('scroll', checkCounters);
    checkCounters();

    // ==========================================
    //  SCROLL REVEAL
    // ==========================================
    const reveals = document.querySelectorAll('[data-reveal]');

    function revealOnScroll() {
        reveals.forEach(el => {
            const rect = el.getBoundingClientRect();
            const delay = parseInt(el.getAttribute('data-delay') || '0');
            if (rect.top < window.innerHeight - 60) {
                setTimeout(() => el.classList.add('revealed'), delay);
            }
        });
    }
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();

    // ==========================================
    //  SCROLL TO TOP
    // ==========================================
    const scrollTop = document.getElementById('scroll-top');
    if (scrollTop) {
        window.addEventListener('scroll', () => {
            scrollTop.classList.toggle('visible', window.scrollY > 400);
        });
        scrollTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ==========================================
    //  FORM SUBMISSION (Web3Forms)
    // ==========================================
    const quoteForm = document.getElementById('quote-form');
    if (quoteForm) {
        quoteForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = quoteForm.querySelector('.btn-submit');
            if (!btn) return;
            const orig = btn.innerHTML;

            // Show loading state
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            btn.disabled = true;

            try {
                const formData = new FormData(quoteForm);
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                });
                const result = await response.json();

                if (result.success) {
                    btn.innerHTML = '<i class="fas fa-check-circle"></i> Sent Successfully!';
                    btn.style.background = '#16a34a';
                    quoteForm.reset();
                } else {
                    btn.innerHTML = '<i class="fas fa-times-circle"></i> Failed to Send';
                    btn.style.background = '#dc2626';
                }
            } catch (error) {
                btn.innerHTML = '<i class="fas fa-times-circle"></i> Network Error';
                btn.style.background = '#dc2626';
            }

            setTimeout(() => {
                btn.innerHTML = orig;
                btn.style.background = '';
                btn.disabled = false;
            }, 3000);
        });
    }


    // ==========================================
    //  SMOOTH ANCHOR SCROLLS
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const id = this.getAttribute('href');
            if (id === '#') return;
            const target = document.querySelector(id);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ==========================================
    //  GALLERY LIGHTBOX
    // ==========================================
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');

    if (lightbox) {
        document.querySelectorAll('.gallery-item, .tile-image').forEach(item => {
            item.addEventListener('click', () => {
                const img = item.querySelector('img');
                if (lightboxImg) {
                    lightboxImg.src = img.src;
                    lightboxImg.alt = img.alt;
                }
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        function closeLB() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }

        if (lightboxClose) lightboxClose.addEventListener('click', closeLB);
        lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLB(); });
        document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLB(); });
    }

    // ==========================================
    //  ACTIVE NAV LINK
    // ==========================================
    const page = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links > li > a').forEach(link => {
        const href = link.getAttribute('href');
        link.classList.remove('active');
        if (href === page || (page === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });

});
