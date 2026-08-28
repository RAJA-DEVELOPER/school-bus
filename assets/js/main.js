/* ============================================================
   SafeRide Schools — main.js
   Core: Navbar · Theme · RTL · Page Loader · Back to Top · Cookie
   ============================================================ */

'use strict';

/* ── DOM Ready ─────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initPageLoader();
  initNavbar();
  initThemeToggle();
  initRTLToggle();
  initBackToTop();
  initCookieBar();
  initSmoothLinks();
  initMobileMenu();
  initProfileMenu();
});

/* ── Page Loader ────────────────────────────────────────────── */
function initPageLoader() {
  const loader = document.getElementById('page-loader');
  if (!loader) return;
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
    }, 600);
  });
  // Fallback
  setTimeout(() => { if (loader) loader.classList.add('hidden'); }, 3000);
}

/* ── Navbar ─────────────────────────────────────────────────── */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const isHeroPage = navbar.classList.contains('transparent');

  function updateNavbar() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  if (isHeroPage) {
    window.addEventListener('scroll', updateNavbar, { passive: true });
    updateNavbar();
  } else {
    navbar.classList.add('scrolled');
  }

  // Active link highlight
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .dropdown-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && href === currentPath) {
      link.classList.add('active');
    }
  });
}

/* ── Mobile Menu ────────────────────────────────────────────── */
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.nav-mobile');
  if (!hamburger || !mobileNav) return;

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on link click
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close on backdrop click
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

/* ── Theme Toggle (Light / Dark) ────────────────────────────── */
function initThemeToggle() {
  const btn = document.getElementById('theme-toggle');
  const stored = localStorage.getItem('saferide-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = stored || (prefersDark ? 'dark' : 'light');

  applyTheme(theme);

  if (btn) {
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem('saferide-theme', next);
    });
  }
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const btn = document.getElementById('theme-toggle');
  if (btn) {
    btn.innerHTML = theme === 'dark'
      ? '<i class="ph ph-sun"></i>'
      : '<i class="ph ph-moon"></i>';
    btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    btn.setAttribute('title', theme === 'dark' ? 'Light Mode' : 'Dark Mode');
  }
}

/* ── RTL Toggle ─────────────────────────────────────────────── */
function initRTLToggle() {
  const btn = document.getElementById('rtl-toggle');
  const stored = localStorage.getItem('saferide-dir') || 'ltr';

  applyDir(stored);

  if (btn) {
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('dir') || 'ltr';
      const next = current === 'rtl' ? 'ltr' : 'rtl';
      applyDir(next);
      localStorage.setItem('saferide-dir', next);
    });
  }
}

function applyDir(dir) {
  document.documentElement.setAttribute('dir', dir);
  document.body.setAttribute('dir', dir);
  const btn = document.getElementById('rtl-toggle');
  if (btn) {
    btn.innerHTML = dir === 'rtl' ? 'RTL' : 'LTR';
    btn.setAttribute('title', dir === 'rtl' ? 'Switch to LTR' : 'Switch to RTL');
  }
}

/* ── Profile Menu ───────────────────────────────────────────── */
function initProfileMenu() {
  const btn = document.getElementById('profile-btn');
  const menu = document.getElementById('profile-menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = menu.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target)) {
      menu.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      menu.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ── Back to Top ────────────────────────────────────────────── */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── Cookie Consent ─────────────────────────────────────────── */
function initCookieBar() {
  const bar = document.getElementById('cookie-bar');
  const acceptBtn = document.getElementById('cookie-accept');
  if (!bar) return;

  if (!localStorage.getItem('saferide-cookies')) {
    setTimeout(() => bar.classList.add('visible'), 1500);
  }

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('saferide-cookies', 'accepted');
      bar.classList.remove('visible');
      setTimeout(() => bar.remove(), 400);
    });
  }
}

/* ── Smooth Anchor Links ────────────────────────────────────── */
function initSmoothLinks() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 90;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

/* ── Page Transition (optional, between pages) ──────────────── */
function navigateTo(url) {
  const overlay = document.getElementById('page-transition');
  if (!overlay) { window.location.href = url; return; }
  overlay.classList.add('in');
  setTimeout(() => { window.location.href = url; }, 450);
}

// Intercept internal links for transition effect
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href]');
  if (!link) return;
  const href = link.getAttribute('href');
  if (!href || href.startsWith('#') || href.startsWith('http') ||
      href.startsWith('mailto') || href.startsWith('tel') ||
      link.hasAttribute('target')) return;

  e.preventDefault();
  navigateTo(href);
});

// Animate in on page load
window.addEventListener('pageshow', () => {
  const overlay = document.getElementById('page-transition');
  if (overlay) {
    overlay.classList.remove('in');
    overlay.classList.add('out');
    setTimeout(() => overlay.classList.remove('out'), 500);
  }
});

/* ── Dashboard Sidebar Toggle ───────────────────────────────── */
function initDashboardSidebar() {
  const toggleBtn = document.getElementById('sidebar-toggle');
  const sidebar   = document.querySelector('.dashboard-sidebar');
  const main      = document.querySelector('.dashboard-main');
  if (!toggleBtn || !sidebar) return;

  toggleBtn.addEventListener('click', () => {
    if (window.innerWidth <= 1023) {
      sidebar.classList.toggle('mobile-open');
    } else {
      sidebar.classList.toggle('collapsed');
      main && main.classList.toggle('expanded');
    }
  });

  // Active nav item
  const currentPage = window.location.pathname.split('/').pop();
  document.querySelectorAll('.sidebar-nav-item[data-page]').forEach(item => {
    if (item.getAttribute('data-page') === currentPage) {
      item.classList.add('active');
    }
    item.addEventListener('click', () => {
      document.querySelectorAll('.sidebar-nav-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    });
  });
}

// Run on dashboard page
if (document.querySelector('.dashboard-wrapper')) {
  initDashboardSidebar();
}

/* ── Expose helpers globally ────────────────────────────────── */
window.SafeRide = {
  navigateTo,
  applyTheme,
  applyDir
};
