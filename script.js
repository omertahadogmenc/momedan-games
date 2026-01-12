import translations from './translations.js';

// ===================================
// MOMEDAN GAMES - ROBUST SCRIPT
// ===================================

(function () {
    'use strict';

    // === LANGUAGE LOGIC ===
    let currentLang = localStorage.getItem('preferredLang') || 'tr';

    function updateLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('preferredLang', lang);

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                el.innerHTML = translations[lang][key];
            }
        });

        // Add href support (for emails/links)
        document.querySelectorAll('[data-i18n-href]').forEach(el => {
            const key = el.getAttribute('data-i18n-href');
            if (translations[lang] && translations[lang][key]) {
                const val = translations[lang][key];
                el.href = val.includes('@') ? `mailto:${val}` : val;
            }
        });

        // Update switcher buttons
        document.querySelectorAll('.lang-btn').forEach(btn => {
            const btnLang = btn.getAttribute('data-lang');
            btn.classList.toggle('active', btnLang === lang);
        });

        document.documentElement.lang = lang;
    }

    // Initialize language
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => updateLanguage(currentLang));
    } else {
        updateLanguage(currentLang);
    }

    // Language switcher event listeners
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            updateLanguage(btn.getAttribute('data-lang'));
        });
    });

    // === INTERSECTION OBSERVER FOR LANDO-STYLE REVEALS ===
    const observerOptions = {
        root: document.querySelector('.scroll-container'),
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
        rootMargin: '0px'
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const ratio = entry.intersectionRatio;
            const content = entry.target;

            if (entry.isIntersecting) {
                // Smooth reveal as it snaps
                content.style.opacity = Math.min(1, ratio * 2);
                content.style.transform = `translateY(${(1 - ratio) * 50}px) scale(${0.98 + (ratio * 0.02)})`;
                content.classList.add('visible');

                // Trigger progress bar animation if in view
                if (content.closest('#project')) {
                    const bar = content.querySelector('.progress-fill');
                    if (bar) bar.style.width = '20%';
                }
            } else {
                content.classList.remove('visible');
                // Reset progress bar for re-animation
                if (content.closest('#project')) {
                    const bar = content.querySelector('.progress-fill');
                    if (bar) bar.style.width = '0%';
                }
            }
        });
    }, observerOptions);

    // Observe all section contents
    const contents = document.querySelectorAll('.section-content');
    contents.forEach(content => {
        sectionObserver.observe(content);
    });

    // === SMOOTH SNAP TRANSITIONS VIA NAV LINKS ===
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // === CONSOLE BRANDING ===
    console.log(
        '%c MOMEDAN GAMES ',
        'background: #649d60; color: #000; font-size: 16px; font-weight: bold; padding: 8px 16px; border-radius: 4px;'
    );

})();
