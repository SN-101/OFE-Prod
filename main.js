// ====================================
// OFE PRODUCTION - MAIN JavaScript
// ====================================

// Configuration & Data
const CONFIG = {
  defaultLanguage: 'fr',
  defaultTheme: 'light',
  languagesPath: 'languages/',
  animationDelay: 100
};

// Services Data
const SERVICES = [
  {
    icon: '📸',
    titleKey: 'services.events',
    descKey: 'services.eventsDesc'
  },
  {
    icon: '👤',
    titleKey: 'services.portrait',
    descKey: 'services.portraitDesc'
  },
  {
    icon: '🏢',
    titleKey: 'services.commercial',
    descKey: 'services.commercialDesc'
  },
  {
    icon: '🎉',
    titleKey: 'services.opening',
    descKey: 'services.openingDesc'
  },
];

// Portfolio Data
const PORTFOLIO = [
  // Photos
  {
    type: 'photo',
    src: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&dpr=1',
    alt: 'Wedding photography',
    title: 'Wedding Day',
    category: 'events'
  },
  {
    type: 'photo',
    src: 'https://images.pexels.com/photos/1680172/pexels-photo-1680172.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&dpr=1',
    alt: 'Portrait photography',
    title: 'Professional Portrait',
    category: 'portrait'
  },
  {
    type: 'photo',
    src: 'https://images.pexels.com/photos/279949/pexels-photo-279949.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&dpr=1',
    alt: 'Commercial photography',
    title: 'Commercial Shoot',
    category: 'commercial'
  },
  {
    type: 'photo',
    src: 'https://images.pexels.com/photos/1157394/pexels-photo-1157394.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&dpr=1',
    alt: 'Event photography',
    title: 'Corporate Event',
    category: 'events'
  },
  {
    type: 'photo',
    src: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&dpr=1',
    alt: 'Portrait session',
    title: 'Outdoor Portrait',
    category: 'portrait'
  },
  {
    type: 'photo',
    src: 'https://images.pexels.com/photos/792199/pexels-photo-792199.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&dpr=1',
    alt: 'Product photography',
    title: 'Product Showcase',
    category: 'commercial'
  },
  // Videos
  {
    type: 'video',
    src: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnail: 'https://images.pexels.com/photos/3944091/pexels-photo-3944091.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&dpr=1',
    alt: 'Store Opening Video',
    title: 'Grand Opening Coverage',
    category: 'opening'
  },
  {
    type: 'video',
    src: 'https://www.w3schools.com/html/movie.mp4',
    thumbnail: 'https://images.pexels.com/photos/3585089/pexels-photo-3585089.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&dpr=1',
    alt: 'Event Highlights',
    title: 'Event Highlights Reel',
    category: 'events'
  },
  {
    type: 'video',
    src: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnail: 'https://images.pexels.com/photos/3394310/pexels-photo-3394310.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&dpr=1',
    alt: 'Commercial Video',
    title: 'Product Commercial',
    category: 'commercial'
  },
  {
    type: 'video',
    src: 'files/street.mp4',
    thumbnail: 'https://images.pexels.com/photos/374710/pexels-photo-374710.jpeg',
    alt: 'Commercial Video',
    title: 'Product Commercial',
    category: 'hobby'
  }
];

// Application State
const State = {
  currentLanguage: CONFIG.defaultLanguage,
  currentTheme: CONFIG.defaultTheme,
  translations: {},
  currentFilter: 'all',
  currentLightboxIndex: 0,
  filteredPortfolio: [...PORTFOLIO]
};

// ====================================
// INITIALIZATION
// ====================================

document.addEventListener('DOMContentLoaded', async () => {
  showLoading();

  try {
    await loadTranslations();
    initializeTheme();
    initializeLanguage();
    renderServices();
    renderPortfolio();
    setupEventListeners();
    setupIntersectionObserver();

    console.log('✅ OFE Production website loaded successfully');
  } catch (error) {
    console.error('❌ Error initializing application:', error);
  } finally {
    hideLoading();
  }
});

// ====================================
// LOADING FUNCTIONS
// ====================================

function showLoading() {
  const spinner = document.getElementById('loadingSpinner');
  if (spinner) spinner.style.display = 'flex';
}

function hideLoading() {
  const spinner = document.getElementById('loadingSpinner');
  if (spinner) {
    setTimeout(() => {
      spinner.style.display = 'none';
    }, 300);
  }
}

// ====================================
// TRANSLATION SYSTEM
// ====================================

async function loadTranslations() {
  const languages = ['en', 'ar', 'fr'];

  try {
    const promises = languages.map(async (lang) => {
      const response = await fetch(`${CONFIG.languagesPath}${lang}.json`);
      if (!response.ok) throw new Error(`Failed to load ${lang}`);
      return { lang, data: await response.json() };
    });

    const results = await Promise.all(promises);
    results.forEach(({ lang, data }) => {
      State.translations[lang] = data;
    });

    console.log('✅ Translations loaded:', Object.keys(State.translations));
  } catch (error) {
    console.error('⚠️ Error loading translations:', error);
    // Fallback translations
    State.translations = {
      en: {
        'site.title': 'OFE Production',
        'nav.home': 'Home',
        'nav.services': 'Services',
        'nav.portfolio': 'Portfolio',
        'nav.about': 'About',
        'nav.contact': 'Contact'
      }
    };
  }
}

function applyLanguage(lang) {
  if (!State.translations[lang]) {
    console.error(`Language ${lang} not available`);
    return;
  }

  State.currentLanguage = lang;
  localStorage.setItem('ofe-language', lang);

  // Update HTML attributes
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

  // Update language display
  const currentLangSpan = document.querySelector('.current-lang');
  if (currentLangSpan) {
    const langCodes = { en: 'EN', ar: 'عر', fr: 'FR' };
    currentLangSpan.textContent = langCodes[lang] || lang.toUpperCase();
  }

  // Apply translations
  applyTranslations();

  console.log(`🌐 Language changed to: ${lang}`);
}

function applyTranslations() {
  const lang = State.currentLanguage;
  const translations = State.translations[lang];

  // Translate elements with data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[key]) {
      el.textContent = translations[key];
    }
  });

  // Translate placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (translations[key]) {
      el.placeholder = translations[key];
    }
  });

  // Update page title
  if (translations['site.title']) {
    document.title = translations['site.title'];
  }
}

// ====================================
// THEME SYSTEM
// ====================================

function initializeTheme() {
  const savedTheme = localStorage.getItem('ofe-theme');

  if (savedTheme) {
    State.currentTheme = savedTheme;
  } else if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
    State.currentTheme = 'dark';
  }

  applyTheme(State.currentTheme);
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('ofe-theme', theme);
  State.currentTheme = theme;

  const themeToggle = document.querySelector('.theme-toggle');
  if (themeToggle) {
    themeToggle.setAttribute('aria-label',
      theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
    );
  }
}

function toggleTheme() {
  const newTheme = State.currentTheme === 'light' ? 'dark' : 'light';
  applyTheme(newTheme);
}

// ====================================
// RENDERING FUNCTIONS
// ====================================

function renderServices() {
  const grid = document.getElementById('servicesGrid');
  if (!grid) return;

  grid.innerHTML = SERVICES.map(service => `
    <div class="service-card">
      <div class="service-icon">${service.icon}</div>
      <h3 data-i18n="${service.titleKey}"></h3>
      <p data-i18n="${service.descKey}"></p>
    </div>
  `).join('');

  // Apply translations after rendering
  applyTranslations();
}

function renderPortfolio() {
  const grid = document.getElementById('portfolioGrid');
  if (!grid) return;

  const items = State.filteredPortfolio.map((item, index) => {
    if (item.type === 'photo') {
      return `
        <div class="portfolio-item show" data-type="photo" data-index="${index}">
          <img src="${item.src}" alt="${item.alt}" loading="lazy">
          <div class="portfolio-overlay">
            <button class="portfolio-btn" aria-label="View ${item.title}">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </button>
            <div class="portfolio-title">${item.title}</div>
          </div>
        </div>
      `;
    } else {
      return `
        <div class="portfolio-item show" data-type="video" data-index="${index}">
          <img src="${item.thumbnail}" alt="${item.alt}" loading="lazy">
          <div class="video-indicator">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5,3 19,12 5,21"></polygon>
            </svg>
            Video
          </div>
          <div class="portfolio-overlay">
            <button class="portfolio-btn" aria-label="Play ${item.title}">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5,3 19,12 5,21"></polygon>
              </svg>
            </button>
            <div class="portfolio-title">${item.title}</div>
          </div>
        </div>
      `;
    }
  }).join('');

  grid.innerHTML = items;
  attachPortfolioListeners();
}

function attachPortfolioListeners() {
  document.querySelectorAll('.portfolio-item').forEach(item => {
    item.addEventListener('click', () => {
      const index = parseInt(item.dataset.index);
      openLightbox(index);
    });
  });
}

// ====================================
// PORTFOLIO FILTER
// ====================================

function filterPortfolio(filter) {
  State.currentFilter = filter;

  if (filter === 'all') {
    State.filteredPortfolio = [...PORTFOLIO];
  } else if (filter === 'photo') {
    State.filteredPortfolio = PORTFOLIO.filter(item => item.type === 'photo');
  } else if (filter === 'video') {
    State.filteredPortfolio = PORTFOLIO.filter(item => item.type === 'video');
  }

  renderPortfolio();

  // Update active filter button
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === filter);
  });
}

// ====================================
// LIGHTBOX
// ====================================

function openLightbox(index) {
  if (index < 0 || index >= State.filteredPortfolio.length) return;

  State.currentLightboxIndex = index;
  const item = State.filteredPortfolio[index];
  const lightbox = document.getElementById('lightbox');
  const imgEl = document.getElementById('lightbox-image');
  const videoEl = document.getElementById('lightbox-video');

  if (!lightbox || !imgEl || !videoEl) return;

  if (item.type === 'photo') {
    imgEl.src = item.src;
    imgEl.alt = item.alt;
    imgEl.style.display = 'block';
    videoEl.style.display = 'none';
    videoEl.pause();
  } else {
    videoEl.src = item.src;
    videoEl.style.display = 'block';
    imgEl.style.display = 'none';
    videoEl.play();
  }

  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';

  document.querySelector('.lightbox-close')?.focus();
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  const videoEl = document.getElementById('lightbox-video');

  if (lightbox) {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';

    if (videoEl) {
      videoEl.pause();
      videoEl.src = '';
    }
  }
}

function showPreviousMedia() {
  const newIndex = State.currentLightboxIndex > 0
    ? State.currentLightboxIndex - 1
    : State.filteredPortfolio.length - 1;
  openLightbox(newIndex);
}

function showNextMedia() {
  const newIndex = State.currentLightboxIndex < State.filteredPortfolio.length - 1
    ? State.currentLightboxIndex + 1
    : 0;
  openLightbox(newIndex);
}

// ====================================
// EVENT LISTENERS
// ====================================

function setupEventListeners() {
  // Theme toggle
  document.querySelector('.theme-toggle')?.addEventListener('click', toggleTheme);

  // Language selector
  const langBtn = document.querySelector('.language-btn');
  const langDropdown = document.querySelector('.language-dropdown');

  if (langBtn && langDropdown) {
    langBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      langDropdown.classList.toggle('active');
      langBtn.setAttribute('aria-expanded',
        langDropdown.classList.contains('active'));
    });

    document.querySelectorAll('.language-dropdown button').forEach(btn => {
      btn.addEventListener('click', (e) => {
        applyLanguage(e.target.dataset.lang);
        langDropdown.classList.remove('active');
        langBtn.setAttribute('aria-expanded', 'false');
      });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!langBtn.contains(e.target) && !langDropdown.contains(e.target)) {
        langDropdown.classList.remove('active');
        langBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Mobile menu
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => {
      const isActive = navLinks.classList.toggle('active');
      mobileBtn.classList.toggle('active', isActive);
      mobileBtn.setAttribute('aria-expanded', isActive);
    });

    // Close menu when clicking nav links
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileBtn.classList.remove('active');
        mobileBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = anchor.getAttribute('href');
      const target = document.querySelector(targetId);

      if (target) {
        const navHeight = document.querySelector('.navbar')?.offsetHeight || 70;
        const targetPosition = target.offsetTop - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Portfolio filters
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      filterPortfolio(btn.dataset.filter);
    });
  });

  // Lightbox
  document.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
  document.querySelector('.lightbox-backdrop')?.addEventListener('click', closeLightbox);
  document.querySelector('.lightbox-prev')?.addEventListener('click', showPreviousMedia);
  document.querySelector('.lightbox-next')?.addEventListener('click', showNextMedia);

  // Contact form
  document.getElementById('contactForm')?.addEventListener('submit', handleFormSubmit);

  // Keyboard navigation
  document.addEventListener('keydown', handleKeyboard);
}

// ====================================
// FORM HANDLING
// ====================================

function handleFormSubmit(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const name = formData.get('name')?.trim();
  const email = formData.get('email')?.trim();
  const message = formData.get('message')?.trim();

  if (!name || !email || !message) {
    showNotification('Please fill in all fields', 'error');
    return;
  }

  if (!isValidEmail(email)) {
    showNotification('Please enter a valid email address', 'error');
    return;
  }

  // Simulate sending (replace with actual backend call)
  showSuccess();
  e.target.reset();

  console.log('📧 Form submitted:', { name, email, message });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showSuccess() {
  const msg = document.getElementById('successMessage');
  if (msg) {
    msg.style.display = 'block';
    setTimeout(() => {
      msg.style.display = 'none';
    }, 5000);

    msg.addEventListener('click', () => {
      msg.style.display = 'none';
    }, { once: true });
  }
}

function showNotification(message, type = 'info') {
  let notif = document.querySelector('.notification');

  if (!notif) {
    notif = document.createElement('div');
    notif.className = 'notification';
    document.body.appendChild(notif);
  }

  notif.textContent = message;
  notif.className = `notification ${type}`;
  notif.style.cssText = `
    position: fixed;
    top: 90px;
    right: 20px;
    background: ${type === 'error' ? '#fee2e2' : '#dbeafe'};
    color: ${type === 'error' ? '#dc2626' : '#1d4ed8'};
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: var(--shadow-lg);
    z-index: 10000;
    animation: slideInRight 0.3s ease;
  `;

  setTimeout(() => {
    notif.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => notif.remove(), 300);
  }, 4000);
}

// ====================================
// KEYBOARD NAVIGATION
// ====================================

function handleKeyboard(e) {
  const lightbox = document.getElementById('lightbox');

  if (lightbox?.classList.contains('active')) {
    switch (e.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'ArrowLeft':
        showPreviousMedia();
        break;
      case 'ArrowRight':
        showNextMedia();
        break;
    }
  }

  // Global shortcuts
  if (e.ctrlKey || e.metaKey) {
    if (e.key === 'd') {
      e.preventDefault();
      toggleTheme();
    }
  }
}

// ====================================
// INTERSECTION OBSERVER (Performance)
// ====================================

function setupIntersectionObserver() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe service cards and portfolio items
  document.querySelectorAll('.service-card, .portfolio-item').forEach(el => {
    observer.observe(el);
  });
}

// ====================================
// INITIALIZE LANGUAGE
// ====================================

function initializeLanguage() {
  const savedLang = localStorage.getItem('ofe-language');
  if (savedLang && State.translations[savedLang]) {
    State.currentLanguage = savedLang;
  }
  applyLanguage(State.currentLanguage);
}

// ====================================
// EXPORT FOR EXTERNAL ACCESS
// ====================================

window.OFEProduction = {
  applyLanguage,
  applyTheme,
  toggleTheme,
  filterPortfolio,
  openLightbox,
  closeLightbox,
  getState: () => ({ ...State })
};
