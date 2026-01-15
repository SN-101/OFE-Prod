// Application State
let currentLanguage = 'en';
let currentTheme = 'light';
let translations = {};
let portfolioImages = [];
let currentLightboxIndex = 0;

// Initialize Application
document.addEventListener('DOMContentLoaded', async function () {
    // Load translations
    await loadTranslations();

    // Initialize theme and language from localStorage
    initializeTheme();
    initializeLanguage();

    // Setup event listeners
    setupEventListeners();

    // Initialize portfolio
    initializePortfolio();

    console.log('OFÉ Production website loaded successfully');
});

// Load translations from JSON file
async function loadTranslations() {
    try {
        const response = await fetch('translations.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        translations = await response.json();
        console.log('Translations loaded successfully');
    } catch (error) {
        console.error('Error loading translations:', error);
        // Fallback translations if file loading fails
        translations = {
            en: {
                'site.title': 'OFÉ Production',
                'nav.home': 'Home',
                'hero.title': 'Photos that tell your story'
            }
        };
    }
}

// Initialize theme from localStorage or default
function initializeTheme() {
    const savedTheme = localStorage.getItem('ofe-theme');
    if (savedTheme) {
        currentTheme = savedTheme;
    } else {
        // Check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            currentTheme = 'dark';
        }
    }
    applyTheme(currentTheme);
}

// Initialize language from localStorage or default
function initializeLanguage() {
    const savedLanguage = localStorage.getItem('ofe-language');
    if (savedLanguage && translations[savedLanguage]) {
        currentLanguage = savedLanguage;
    }
    applyLanguage(currentLanguage);
}

// Apply theme to document
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ofe-theme', theme);
    currentTheme = theme;

    // Update theme toggle button
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.setAttribute('aria-label',
            theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
        );
    }

    console.log(`Theme applied: ${theme}`);
}

// Apply language and RTL support
function applyLanguage(language) {
    if (!translations[language]) {
        console.error(`Language ${language} not found in translations`);
        return;
    }

    currentLanguage = language;
    localStorage.setItem('ofe-language', language);

    // Update document language and direction
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';

    // Update current language display
    const currentLangSpan = document.querySelector('.current-lang');
    if (currentLangSpan) {
        const langCodes = { en: 'EN', ar: 'عر', fr: 'FR' };
        currentLangSpan.textContent = langCodes[language] || language.toUpperCase();
    }

    // Apply translations to elements with data-i18n attribute
    const elementsToTranslate = document.querySelectorAll('[data-i18n]');
    elementsToTranslate.forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[language][key]) {
            element.textContent = translations[language][key];
        }
    });

    // Apply translations to placeholders
    const elementsWithPlaceholder = document.querySelectorAll('[data-i18n-placeholder]');
    elementsWithPlaceholder.forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        if (translations[language][key]) {
            element.placeholder = translations[language][key];
        }
    });

    // Update page title
    if (translations[language]['site.title']) {
        document.title = translations[language]['site.title'];
    }

    console.log(`Language applied: ${language}`);
}

// Setup all event listeners
function setupEventListeners() {
    // Theme toggle
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Language selector
    const languageBtn = document.querySelector('.language-btn');
    const languageDropdown = document.querySelector('.language-dropdown');

    if (languageBtn && languageDropdown) {
        languageBtn.addEventListener('click', toggleLanguageDropdown);

        // Language options
        const languageOptions = document.querySelectorAll('.language-dropdown button[data-lang]');
        languageOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                const selectedLang = e.target.getAttribute('data-lang');
                applyLanguage(selectedLang);
                closeLanguageDropdown();
            });
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!languageBtn.contains(e.target) && !languageDropdown.contains(e.target)) {
                closeLanguageDropdown();
            }
        });
    }

    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }

    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactFormSubmit);
    }

    // Smooth scrolling for navigation links
    const navLinksElements = document.querySelectorAll('.nav-links a[href^="#"]');
    navLinksElements.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
            // Close mobile menu if open
            closeMobileMenu();
        });
    });

    // Lightbox events
    setupLightboxEvents();

    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);
}

// Theme toggle function
function toggleTheme() {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
}

// Language dropdown functions
function toggleLanguageDropdown() {
    const dropdown = document.querySelector('.language-dropdown');
    const btn = document.querySelector('.language-btn');

    if (dropdown && btn) {
        const isOpen = dropdown.classList.contains('active');
        if (isOpen) {
            closeLanguageDropdown();
        } else {
            dropdown.classList.add('active');
            btn.setAttribute('aria-expanded', 'true');
        }
    }
}

function closeLanguageDropdown() {
    const dropdown = document.querySelector('.language-dropdown');
    const btn = document.querySelector('.language-btn');

    if (dropdown && btn) {
        dropdown.classList.remove('active');
        btn.setAttribute('aria-expanded', 'false');
    }
}

// Mobile menu functions
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');

    if (navLinks && mobileMenuBtn) {
        const isOpen = navLinks.classList.contains('active');
        if (isOpen) {
            closeMobileMenu();
        } else {
            navLinks.classList.add('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'true');
        }
    }
}

function closeMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');

    if (navLinks && mobileMenuBtn) {
        navLinks.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
    }
}

// Initialize portfolio functionality
function initializePortfolio() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    portfolioImages = Array.from(portfolioItems).map(item => {
        const img = item.querySelector('img');
        return {
            src: img.src,
            alt: img.alt,
            category: item.getAttribute('data-category') || 'general'
        };
    });

    // Add click events to portfolio items
    portfolioItems.forEach((item, index) => {
        const btn = item.querySelector('.portfolio-btn');
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                openLightbox(index);
            });
        }

        // Also allow clicking on the image itself
        item.addEventListener('click', () => {
            openLightbox(index);
        });
    });
}

// Lightbox functionality
function setupLightboxEvents() {
    const lightbox = document.getElementById('lightbox');
    const closeBtn = document.querySelector('.lightbox-close');
    const backdrop = document.querySelector('.lightbox-backdrop');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');

    if (closeBtn) {
        closeBtn.addEventListener('click', closeLightbox);
    }

    if (backdrop) {
        backdrop.addEventListener('click', closeLightbox);
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', showPreviousImage);
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', showNextImage);
    }
}

function openLightbox(index) {
    if (index < 0 || index >= portfolioImages.length) return;

    currentLightboxIndex = index;
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');

    if (lightbox && lightboxImage) {
        lightboxImage.src = portfolioImages[index].src;
        lightboxImage.alt = portfolioImages[index].alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Focus on close button for accessibility
        const closeBtn = document.querySelector('.lightbox-close');
        if (closeBtn) {
            closeBtn.focus();
        }
    }
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function showPreviousImage() {
    const newIndex = currentLightboxIndex > 0 ? currentLightboxIndex - 1 : portfolioImages.length - 1;
    openLightbox(newIndex);
}

function showNextImage() {
    const newIndex = currentLightboxIndex < portfolioImages.length - 1 ? currentLightboxIndex + 1 : 0;
    openLightbox(newIndex);
}

// Keyboard navigation for lightbox and other features
function handleKeyboardNavigation(e) {
    const lightbox = document.getElementById('lightbox');

    if (lightbox && lightbox.classList.contains('active')) {
        switch (e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                showPreviousImage();
                break;
            case 'ArrowRight':
                showNextImage();
                break;
        }
    }

    // Global keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
            case 'd':
                e.preventDefault();
                toggleTheme();
                break;
        }
    }
}

// Contact form handling
function handleContactFormSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    // Basic validation
    const name = formData.get('name')?.trim();
    const email = formData.get('email')?.trim();
    const message = formData.get('message')?.trim();

    if (!name || !email || !message) {
        showFormError('Please fill in all fields.');
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showFormError('Please enter a valid email address.');
        return;
    }

    // Simulate form submission (replace with actual backend integration)
    showFormSuccess();

    // Reset form
    form.reset();

    console.log('Contact form submitted:', { name, email, message });
}

function showFormError(message) {
    // Create or show error message
    let errorDiv = document.querySelector('.error-message');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #fee2e2;
            color: #dc2626;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            border: 1px solid #fecaca;
            box-shadow: var(--shadow-lg);
            z-index: 1000;
            max-width: 400px;
        `;
        document.body.appendChild(errorDiv);
    }

    errorDiv.textContent = message;
    errorDiv.style.display = 'block';

    // Auto hide after 5 seconds
    setTimeout(() => {
        if (errorDiv) {
            errorDiv.style.display = 'none';
        }
    }, 5000);
}

function showFormSuccess() {
    const successMessage = document.getElementById('successMessage');
    if (successMessage) {
        successMessage.style.display = 'block';

        // Auto hide after 5 seconds
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 5000);

        // Allow clicking to close
        successMessage.addEventListener('click', () => {
            successMessage.style.display = 'none';
        });
    }
}

// Utility function for smooth animations
function animateElement(element, animation, duration = 300) {
    return new Promise(resolve => {
        element.style.animation = `${animation} ${duration}ms ease forwards`;
        setTimeout(() => {
            element.style.animation = '';
            resolve();
        }, duration);
    });
}

// Performance optimization: Lazy load images
function setupLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }
}

// Initialize lazy loading when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupLazyLoading);
} else {
    setupLazyLoading();
}

// Export functions for testing or external use
window.OFEProduction = {
    applyLanguage,
    applyTheme,
    toggleTheme,
    openLightbox,
    closeLightbox
};
