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
  const navToggle = document.getElementById('nav-toggle');
  const navLinks  = document.getElementById('nav-links');

  navToggle.addEventListener('click', function () {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close nav when a link is clicked
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close nav on Escape key, return focus to toggle
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
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
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
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
    const btn    = form.querySelector('.form-submit');
    const status = form.querySelector('.form-status');

    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      // Basic client-side validation
      const name    = form.name.value.trim();
      const email   = form.email.value.trim();
      const message = form.message.value.trim();

      if (!name || !email || !message) {
        status.textContent = 'Please fill in all fields.';
        status.style.color = 'var(--error, #c0392b)';
        return;
      }

      btn.textContent = 'Sending…';
      btn.disabled = true;
      status.textContent = '';

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
  const sections = document.querySelectorAll('section[id]');
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
