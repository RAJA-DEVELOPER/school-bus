/* ============================================================
   SafeRide Schools — forms.js
   Form Validation · Newsletter · Contact · Subscription
   ============================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initContactForm();
  initNewsletterForm();
  initLoginForm();
  initSignupForm();
  initSubscribeForm();
  initRouteRequestForm();
  initPasswordToggle();
});

/* ── Validation Helpers ──────────────────────────────────────── */
const validators = {
  required: (v) => v.trim() !== '',
  email:    (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
  phone:    (v) => /^[\+]?[\d\s\-\(\)]{8,15}$/.test(v.trim()),
  minLen:   (v, n) => v.trim().length >= n,
  password: (v) => v.length >= 8,
};

function getErrorEl(input) {
  return input.closest('.form-group')?.querySelector('.form-error');
}

function setError(input, message) {
  input.classList.add('error');
  input.classList.remove('success');
  const err = getErrorEl(input);
  if (err) {
    err.innerHTML = `<i class="ph ph-warning-circle"></i> ${message}`;
    err.style.display = 'flex';
  }
}

function clearError(input) {
  input.classList.remove('error');
  const err = getErrorEl(input);
  if (err) err.style.display = 'none';
}

function setSuccess(input) {
  input.classList.remove('error');
  input.classList.add('success');
  clearError(input);
}

function validateField(input) {
  const value = input.value;
  const rules = (input.getAttribute('data-validate') || '').split('|').filter(Boolean);
  let isValid = true;
  let message = '';

  for (const rule of rules) {
    if (rule === 'required' && !validators.required(value)) {
      message = 'This field is required.';
      isValid = false;
      break;
    }
    if (rule === 'email' && value && !validators.email(value)) {
      message = 'Please enter a valid email address.';
      isValid = false;
      break;
    }
    if (rule === 'phone' && value && !validators.phone(value)) {
      message = 'Please enter a valid phone number.';
      isValid = false;
      break;
    }
    if (rule === 'password' && !validators.password(value)) {
      message = 'Password must be at least 8 characters.';
      isValid = false;
      break;
    }
    const minMatch = rule.match(/^min:(\d+)$/);
    if (minMatch && !validators.minLen(value, parseInt(minMatch[1]))) {
      message = `Minimum ${minMatch[1]} characters required.`;
      isValid = false;
      break;
    }
  }

  if (isValid && validators.required(value)) {
    setSuccess(input);
  } else if (!isValid) {
    setError(input, message);
  } else {
    clearError(input);
  }

  return isValid;
}

function validateForm(form) {
  const inputs = form.querySelectorAll('[data-validate]');
  let allValid = true;
  inputs.forEach(input => {
    if (!validateField(input)) allValid = false;
  });
  return allValid;
}

function attachLiveValidation(form) {
  form.querySelectorAll('[data-validate]').forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.classList.contains('error')) validateField(input);
    });
  });
}

/* ── Toast Notification ──────────────────────────────────────── */
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  const icons = { success: 'check-circle', error: 'x-circle', info: 'info' };
  toast.style.cssText = `
    position:fixed; bottom:90px; right:24px; z-index:9999;
    display:flex; align-items:center; gap:12px;
    padding:14px 20px;
    background:${type === 'success' ? 'var(--emerald)' : type === 'error' ? 'var(--color-error)' : 'var(--teal)'};
    color:#fff; border-radius:12px;
    font-family:var(--font-body); font-size:0.875rem; font-weight:600;
    box-shadow:0 8px 30px rgba(0,0,0,0.25);
    animation:fadeInRight 0.4s ease forwards;
    max-width:340px;
  `;
  toast.innerHTML = `<i class="ph ph-${icons[type]}"></i> <span>${message}</span>`;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'fadeIn 0.3s ease reverse forwards';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/* ── Submit Button State ─────────────────────────────────────── */
function setSubmitLoading(btn, loading, originalText) {
  if (loading) {
    btn.disabled = true;
    btn.innerHTML = '<i class="ph ph-circle-notch spin"></i> Sending…';
  } else {
    btn.disabled = false;
    btn.innerHTML = originalText;
  }
}

/* ── Contact Form ────────────────────────────────────────────── */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  attachLiveValidation(form);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateForm(form)) return;

    const btn = form.querySelector('[type="submit"]');
    const orig = btn.innerHTML;
    setSubmitLoading(btn, true);

    // Simulate API call
    await new Promise(r => setTimeout(r, 1500));
    setSubmitLoading(btn, false, orig);
    showToast('Message sent! We\'ll get back to you within 24 hours.', 'success');
    form.reset();
    form.querySelectorAll('.form-control').forEach(i => { i.classList.remove('success', 'error'); });
  });
}

/* ── Newsletter Form ─────────────────────────────────────────── */
function initNewsletterForm() {
  document.querySelectorAll('.newsletter-form').forEach(form => {
    attachLiveValidation(form);
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!validateForm(form)) return;
      const btn = form.querySelector('[type="submit"]');
      const orig = btn.innerHTML;
      setSubmitLoading(btn, true);
      await new Promise(r => setTimeout(r, 1200));
      setSubmitLoading(btn, false, orig);
      showToast('You\'re subscribed! Welcome to SafeRide updates.', 'success');
      form.reset();
      form.querySelectorAll('.form-control').forEach(i => i.classList.remove('success'));
    });
  });
}

/* ── Login Form ──────────────────────────────────────────────── */
function initLoginForm() {
  const form = document.getElementById('login-form');
  if (!form) return;

  attachLiveValidation(form);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateForm(form)) return;
    const btn = form.querySelector('[type="submit"]');
    const orig = btn.innerHTML;
    setSubmitLoading(btn, true);
    await new Promise(r => setTimeout(r, 1500));
    setSubmitLoading(btn, false, orig);
    // Simulate successful login
    showToast('Login successful! Redirecting to home page…', 'success');
    setTimeout(() => { window.location.href = 'index.html'; }, 1800);
  });

  // Forgot password link
  const forgot = document.getElementById('forgot-password-link');
  const forgotPanel = document.getElementById('forgot-panel');
  const backBtn = document.getElementById('back-to-login');

  forgot?.addEventListener('click', (e) => {
    e.preventDefault();
    form.closest('.login-form-wrap')?.classList.add('hidden');
    forgotPanel?.classList.remove('hidden');
  });

  backBtn?.addEventListener('click', () => {
    form.closest('.login-form-wrap')?.classList.remove('hidden');
    forgotPanel?.classList.add('hidden');
  });

  const forgotForm = document.getElementById('forgot-form');
  forgotForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = forgotForm.querySelector('[type="submit"]');
    const orig = btn.innerHTML;
    setSubmitLoading(btn, true);
    await new Promise(r => setTimeout(r, 1200));
    setSubmitLoading(btn, false, orig);
    showToast('Reset link sent! Check your email.', 'success');
  });
}

/* ── Signup Form ─────────────────────────────────────────────── */
function initSignupForm() {
  const form = document.getElementById('signup-form');
  if (!form) return;

  attachLiveValidation(form);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateForm(form)) return;

    // Confirm password match
    const pw = form.querySelector('#signup-password');
    const cpw = form.querySelector('#signup-confirm');
    if (pw && cpw && pw.value !== cpw.value) {
      setError(cpw, 'Passwords do not match.');
      return;
    }

    // Terms acceptance
    const terms = form.querySelector('#terms');
    if (terms && !terms.checked) {
      showToast('Please accept the Terms & Privacy Policy.', 'error');
      return;
    }

    const btn = form.querySelector('[type="submit"]');
    const orig = btn.innerHTML;
    setSubmitLoading(btn, true);
    // Simulate account creation
    await new Promise(r => setTimeout(r, 1500));
    setSubmitLoading(btn, false, orig);
    showToast('Account created! Redirecting to home page…', 'success');
    setTimeout(() => { window.location.href = 'index.html'; }, 1800);
  });
}

/* ── Password Toggle ─────────────────────────────────────────── */
function initPasswordToggle() {
  document.querySelectorAll('[data-password-toggle]').forEach(btn => {
    const targetId = btn.getAttribute('data-password-toggle');
    const input = document.getElementById(targetId);
    if (!input) return;

    btn.addEventListener('click', () => {
      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      btn.innerHTML = isPassword
        ? '<i class="ph ph-eye-slash"></i>'
        : '<i class="ph ph-eye"></i>';
    });
  });
}

/* ── Subscribe/Pricing Form ──────────────────────────────────── */
function initSubscribeForm() {
  const form = document.getElementById('subscribe-form');
  if (!form) return;

  attachLiveValidation(form);

  // Pricing toggle (monthly/annual)
  const toggle = document.querySelector('.pricing-toggle input[type="checkbox"]');
  const prices = document.querySelectorAll('[data-monthly][data-annual]');

  toggle?.addEventListener('change', () => {
    const isAnnual = toggle.checked;
    prices.forEach(el => {
      const val = isAnnual ? el.getAttribute('data-annual') : el.getAttribute('data-monthly');
      el.textContent = val;
    });
    document.querySelectorAll('.pricing-period').forEach(p => {
      p.textContent = isAnnual ? '/year' : '/month';
    });
    // Highlight savings badge
    document.querySelectorAll('.savings-badge').forEach(b => {
      b.style.display = isAnnual ? 'inline-flex' : 'none';
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateForm(form)) return;
    const btn = form.querySelector('[type="submit"]');
    const orig = btn.innerHTML;
    setSubmitLoading(btn, true);
    await new Promise(r => setTimeout(r, 1500));
    setSubmitLoading(btn, false, orig);
    showToast('Subscription activated! Welcome aboard.', 'success');
  });
}

/* ── Route Request Form ──────────────────────────────────────── */
function initRouteRequestForm() {
  const form = document.getElementById('route-request-form');
  if (!form) return;

  attachLiveValidation(form);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateForm(form)) return;
    const btn = form.querySelector('[type="submit"]');
    const orig = btn.innerHTML;
    setSubmitLoading(btn, true);
    await new Promise(r => setTimeout(r, 1500));
    setSubmitLoading(btn, false, orig);
    showToast('Route request submitted! Our team will contact you within 2 business days.', 'success');
    form.reset();
  });
}
