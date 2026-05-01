/* ============================================================
   JACK BULL — Portfolio
   script.js
   ============================================================ */

(function () {
  'use strict';

  /* ── Scroll-spy: add .scrolled to header ──────────────── */
  const header = document.getElementById('site-header');

  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  /* ── Mobile nav toggle ───────────────────────────────── */
  const navToggle  = document.getElementById('nav-toggle');
  const navLinks   = document.getElementById('nav-links');
  const mainContent = document.getElementById('main-content');
  const siteFooter  = document.querySelector('.site-footer');

  function openNav() {
    navLinks.classList.add('open');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    // Prevent keyboard focus from reaching content behind the drawer
    if (mainContent) mainContent.inert = true;
    if (siteFooter)  siteFooter.inert  = true;
    // Move focus into the nav
    const firstLink = navLinks.querySelector('a');
    if (firstLink) firstLink.focus();
  }

  function closeNav() {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (mainContent) mainContent.inert = false;
    if (siteFooter)  siteFooter.inert  = false;
  }

  navToggle.addEventListener('click', function () {
    navLinks.classList.contains('open') ? closeNav() : openNav();
  });

  // Close nav when a link is clicked
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      closeNav();
      navToggle.focus();
    });
  });

  // Close nav on Escape key, return focus to toggle
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      closeNav();
      navToggle.focus();
    }
  });

  // Close nav when clicking outside
  document.addEventListener('click', function (e) {
    if (
      navLinks.classList.contains('open') &&
      !navLinks.contains(e.target) &&
      !navToggle.contains(e.target)
    ) {
      closeNav();
    }
  });

  /* ── Scroll reveal (IntersectionObserver) ─────────────── */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: show all immediately
    revealEls.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* ── Contact form: Web3Forms submission ──────────────── */
  const form = document.querySelector('.contact-form');

  if (form) {
    const btn       = form.querySelector('.form-submit');
    const status    = form.querySelector('.form-status');
    const nameInput = form.querySelector('#name');
    const emailInput = form.querySelector('#email');
    const msgInput  = form.querySelector('#message');

    // Clear aria-invalid as the user corrects a field
    [nameInput, emailInput, msgInput].forEach(function (el) {
      if (!el) return;
      el.addEventListener('input', function () {
        el.removeAttribute('aria-invalid');
      });
    });

    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      const name    = nameInput  ? nameInput.value.trim()  : '';
      const email   = emailInput ? emailInput.value.trim() : '';
      const message = msgInput   ? msgInput.value.trim()   : '';

      // Reset validation state
      [nameInput, emailInput, msgInput].forEach(function (el) {
        if (el) el.removeAttribute('aria-invalid');
      });
      status.textContent = '';

      // Validate
      let hasError = false;

      if (!name)    { if (nameInput)  nameInput.setAttribute('aria-invalid', 'true');  hasError = true; }
      if (!message) { if (msgInput)   msgInput.setAttribute('aria-invalid', 'true');   hasError = true; }

      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        if (emailInput) emailInput.setAttribute('aria-invalid', 'true');
        hasError = true;
      }

      if (hasError) {
        const emptyFields = !name || !email || !message;
        status.textContent = emptyFields
          ? 'Please fill in all fields.'
          : 'Please enter a valid email address.';
        status.style.color = 'var(--error, #c0392b)';
        const firstInvalid = form.querySelector('[aria-invalid="true"]');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      btn.textContent = 'Sending…';
      btn.disabled = true;

      try {
        const res  = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            access_key: form.access_key.value,
            subject:    form.subject.value,
            botcheck:   form.botcheck.checked,
            name, email, message
          })
        });
        const data = await res.json();

        if (data.success) {
          status.textContent = 'Message sent — I\'ll be in touch soon.';
          status.style.color = 'var(--accent-text, #2a7a5a)';
          form.reset();
          [nameInput, emailInput, msgInput].forEach(function (el) {
            if (el) el.removeAttribute('aria-invalid');
          });
        } else {
          throw new Error(data.message || 'Submission failed');
        }
      } catch (err) {
        status.textContent = 'Something went wrong. Please email jrbull301@gmail.com directly.';
        status.style.color = 'var(--error, #c0392b)';
      } finally {
        btn.textContent = 'Send Message';
        btn.disabled = false;
      }
    });
  }

  /* ── Active nav link highlighting on scroll ──────────── */
  const sections   = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  function updateActiveLink() {
    let current = '';
    sections.forEach(function (section) {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navAnchors.forEach(function (a) {
      a.classList.remove('active');
      a.removeAttribute('aria-current');
      if (a.getAttribute('href') === '#' + current) {
        a.classList.add('active');
        a.setAttribute('aria-current', 'page');
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();

})();
