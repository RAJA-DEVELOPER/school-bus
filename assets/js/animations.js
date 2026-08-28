/* ============================================================
   SafeRide Schools — animations.js
   Scroll Reveal · Animated Counters · Hero Slider · FAQ
   ============================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initCounters();
  initHeroSlider();
  initFAQ();
  initProgressBars();
  initTestimonialSlider();
  initTabSwitcher();
  initNumberTicker();
});

/* ── Scroll Reveal (IntersectionObserver) ────────────────────── */
function initScrollReveal() {
  const elements = document.querySelectorAll('[data-reveal], [data-stagger]');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Unobserve after reveal for performance
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* ── Animated Counters ───────────────────────────────────────── */
function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(el) {
  const target = parseFloat(el.getAttribute('data-counter'));
  const duration = parseInt(el.getAttribute('data-duration') || '2000');
  const suffix = el.getAttribute('data-suffix') || '';
  const prefix = el.getAttribute('data-prefix') || '';
  const decimals = el.getAttribute('data-decimals') || 0;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = eased * target;
    el.textContent = prefix + formatNumber(current, parseInt(decimals)) + suffix;
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = prefix + formatNumber(target, parseInt(decimals)) + suffix;
  }

  requestAnimationFrame(update);
}

function formatNumber(n, decimals) {
  if (decimals > 0) return n.toFixed(decimals);
  if (n >= 1000) return Math.floor(n).toLocaleString();
  return Math.floor(n).toString();
}

/* ── Hero Slider ─────────────────────────────────────────────── */
function initHeroSlider() {
  const slider = document.querySelector('.hero-slider');
  if (!slider) return;

  const slides = slider.querySelectorAll('.hero-slide');
  const dots   = slider.querySelectorAll('.slider-dot');
  const prevBtn = slider.querySelector('.slider-prev');
  const nextBtn = slider.querySelector('.slider-next');
  let current = 0;
  let autoPlay;
  const interval = 5000;

  function goTo(idx) {
    slides[current].classList.remove('active');
    dots[current]?.classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current]?.classList.add('active');
    updateProgress();
  }

  function updateProgress() {
    const bar = slider.querySelector('.slider-progress-fill');
    if (bar) { bar.style.width = '0'; setTimeout(() => { bar.style.width = '100%'; bar.style.transitionDuration = interval + 'ms'; }, 10); }
  }

  function startAutoPlay() {
    autoPlay = setInterval(() => goTo(current + 1), interval);
  }

  function stopAutoPlay() { clearInterval(autoPlay); }

  if (slides.length) {
    slides[0].classList.add('active');
    dots[0]?.classList.add('active');
    startAutoPlay();
    updateProgress();
  }

  prevBtn?.addEventListener('click', () => { stopAutoPlay(); goTo(current - 1); startAutoPlay(); });
  nextBtn?.addEventListener('click', () => { stopAutoPlay(); goTo(current + 1); startAutoPlay(); });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { stopAutoPlay(); goTo(i); startAutoPlay(); });
  });

  slider.addEventListener('mouseenter', stopAutoPlay);
  slider.addEventListener('mouseleave', startAutoPlay);

  // Touch/Swipe Support
  let touchStartX = 0;
  slider.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
  slider.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(dx) > 50) { stopAutoPlay(); goTo(dx < 0 ? current + 1 : current - 1); startAutoPlay(); }
  }, { passive: true });
}

/* ── FAQ Accordion ───────────────────────────────────────────── */
function initFAQ() {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer   = item.querySelector('.faq-answer');
    if (!question || !answer) return;

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all others (single-open accordion)
      items.forEach(other => {
        if (other !== item) {
          other.classList.remove('open');
          const otherAnswer = other.querySelector('.faq-answer');
          if (otherAnswer) otherAnswer.classList.remove('open');
        }
      });

      item.classList.toggle('open', !isOpen);
      answer.classList.toggle('open', !isOpen);
    });
  });
}

/* ── Progress Bars ───────────────────────────────────────────── */
function initProgressBars() {
  const bars = document.querySelectorAll('.progress-fill[data-width]');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        setTimeout(() => {
          bar.style.width = bar.getAttribute('data-width');
        }, 200);
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.5 });

  bars.forEach(bar => observer.observe(bar));
}

/* ── Testimonial Slider ──────────────────────────────────────── */
function initTestimonialSlider() {
  const slider = document.querySelector('.testimonial-slider');
  if (!slider) return;

  const track = slider.querySelector('.testimonial-track');
  const cards = track?.querySelectorAll('.testimonial-card');
  if (!track || !cards?.length) return;

  let current = 0;
  const perView = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1;
  const maxIndex = Math.max(0, cards.length - perView);

  function scrollTo(idx) {
    current = Math.min(Math.max(idx, 0), maxIndex);
    const cardWidth = cards[0].offsetWidth + 24; // gap
    track.style.transform = `translateX(-${current * cardWidth}px)`;
    updateDots();
  }

  function updateDots() {
    slider.querySelectorAll('.ts-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
    });
  }

  slider.querySelector('.ts-prev')?.addEventListener('click', () => scrollTo(current - 1));
  slider.querySelector('.ts-next')?.addEventListener('click', () => scrollTo(current + 1));
  slider.querySelectorAll('.ts-dot').forEach((dot, i) => {
    dot.addEventListener('click', () => scrollTo(i));
  });

  let autoT = setInterval(() => scrollTo(current < maxIndex ? current + 1 : 0), 4000);
  slider.addEventListener('mouseenter', () => clearInterval(autoT));
  slider.addEventListener('mouseleave', () => {
    autoT = setInterval(() => scrollTo(current < maxIndex ? current + 1 : 0), 4000);
  });
}

/* ── Tab Switcher ────────────────────────────────────────────── */
function initTabSwitcher() {
  document.querySelectorAll('[data-tabs]').forEach(tabGroup => {
    const triggers = tabGroup.querySelectorAll('[data-tab]');
    const panels   = document.querySelectorAll('[data-tab-panel]');

    triggers.forEach(trigger => {
      trigger.addEventListener('click', () => {
        const target = trigger.getAttribute('data-tab');
        triggers.forEach(t => t.classList.remove('active'));
        trigger.classList.add('active');
        panels.forEach(p => {
          const isMatch = p.getAttribute('data-tab-panel') === target;
          p.hidden = !isMatch;
          if (isMatch) {
            p.style.animation = 'fadeIn 0.4s ease forwards';
          }
        });
      });
    });

    // Init first tab active
    const firstTrigger = triggers[0];
    if (firstTrigger) firstTrigger.click();
  });
}

/* ── Number Ticker (fast animated count widget) ──────────────── */
function initNumberTicker() {
  // Triggers counter animation on visible stat sections
  const statSections = document.querySelectorAll('.stats-section');
  statSections.forEach(section => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          section.querySelectorAll('[data-counter]').forEach(el => {
            if (!el.classList.contains('counted')) {
              el.classList.add('counted');
              animateCounter(el);
            }
          });
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    obs.observe(section);
  });
}
