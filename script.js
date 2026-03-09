/* ============================================================
   script.js — Sreeram I | Developer Portfolio
   ============================================================ */

/* ==================== AOS INIT ==================== */
AOS.init({
  duration: 700,
  easing: 'ease-out-cubic',
  once: true,
  offset: 60,
});

/* ==================== TYPING ANIMATION ==================== */
(function initTypingAnimation() {
  const phrases = [
    'Django Developer',
    'React Enthusiast',
    'Problem Solver',
    'Full-Stack Builder',
  ];

  const el     = document.getElementById('typingText');
  if (!el) return;

  let phraseIdx = 0;
  let charIdx   = 0;
  let deleting  = false;
  const SPEED_TYPE   = 80;
  const SPEED_DELETE = 45;
  const PAUSE_END    = 1800;
  const PAUSE_START  = 350;

  function tick() {
    const current = phrases[phraseIdx];

    if (!deleting) {
      // Typing forward
      charIdx++;
      el.textContent = current.slice(0, charIdx);

      if (charIdx === current.length) {
        // Finished typing — pause then delete
        deleting = true;
        setTimeout(tick, PAUSE_END);
        return;
      }
      setTimeout(tick, SPEED_TYPE);
    } else {
      // Deleting
      charIdx--;
      el.textContent = current.slice(0, charIdx);

      if (charIdx === 0) {
        // Move to next phrase
        deleting  = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        setTimeout(tick, PAUSE_START);
        return;
      }
      setTimeout(tick, SPEED_DELETE);
    }
  }

  tick();
})();

/* ==================== SKILL PROGRESS BARS ==================== */
(function initSkillBars() {
  /**
   * Animate progress bars when they scroll into view.
   * Uses IntersectionObserver for efficiency.
   */
  const bars = document.querySelectorAll('.progress-bar[data-width]');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar       = entry.target;
        const targetPct = bar.getAttribute('data-width');
        // Small delay for aesthetic stagger
        setTimeout(() => { bar.style.width = targetPct + '%'; }, 200);
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.2 });

  bars.forEach(bar => observer.observe(bar));
})();

/* ==================== NAVBAR SCROLL EFFECT ==================== */
(function initNavbar() {
  const nav = document.getElementById('mainNav');
  if (!nav) return;

  function onScroll() {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // Close mobile menu on nav link click
  document.querySelectorAll('#navMenu .nav-link').forEach(link => {
    link.addEventListener('click', () => {
      const toggler = document.querySelector('.navbar-toggler');
      const menu    = document.getElementById('navMenu');
      if (menu.classList.contains('show')) {
        toggler.click();
      }
    });
  });
})();

/* ==================== ACTIVE NAV LINK ON SCROLL ==================== */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('#mainNav .nav-link');

  function updateActive() {
    const scrollPos = window.scrollY + 120;
    sections.forEach(sec => {
      if (
        scrollPos >= sec.offsetTop &&
        scrollPos < sec.offsetTop + sec.offsetHeight
      ) {
        navLinks.forEach(link => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === `#${sec.id}`
          );
        });
      }
    });
  }

  window.addEventListener('scroll', updateActive, { passive: true });
  updateActive();
})();

/* ==================== BACK TO TOP BUTTON ==================== */
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ==================== CONTACT FORM VALIDATION ==================== */
(function initContactForm() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  const submitBtn = document.getElementById('submitBtn');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let valid = true;

    // Validate each required field
    form.querySelectorAll('[required]').forEach(field => {
      const isEmail = field.type === 'email';
      const empty   = field.value.trim() === '';
      const badEmail = isEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());

      if (empty || badEmail) {
        field.classList.add('is-invalid');
        valid = false;
      } else {
        field.classList.remove('is-invalid');
      }

      // Live validation: remove error on input
      field.addEventListener('input', () => {
        field.classList.remove('is-invalid');
      }, { once: false });
    });

    if (!valid) return;

    // Simulate send (no backend wired) — show success state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-2"></i>Sending…';

    setTimeout(() => {
      form.reset();
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane me-2"></i>Send Message';
      success.classList.remove('d-none');

      // Hide success after 5s
      setTimeout(() => success.classList.add('d-none'), 5000);
    }, 1400);
  });
})();

/* ==================== SMOOTH SCROLL FOR ANCHOR LINKS ==================== */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 72; // navbar height
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ==================== NAVBAR SCROLLED STYLE (inline) ==================== */
(function addNavScrollStyle() {
  const style = document.createElement('style');
  style.textContent = `
    #mainNav.scrolled {
      background: rgba(10,15,30,0.98) !important;
      box-shadow: 0 4px 30px rgba(0,0,0,0.4);
    }
  `;
  document.head.appendChild(style);
})();
