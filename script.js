// =========================================================
// NEXORA SOLUTIONS — script.js
// =========================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Sticky navbar background on scroll ---------- */
  const navbar = document.getElementById('navbar');
  const scrollTopBtn = document.getElementById('scrollTop');

  const onScroll = () => {
    const scrolled = window.scrollY > 12;
    navbar.classList.toggle('is-scrolled', scrolled);
    scrollTopBtn.classList.toggle('is-visible', window.scrollY > 500);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- Mobile hamburger menu ---------- */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  const closeMobileMenu = () => {
    hamburger.classList.remove('is-open');
    mobileMenu.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
  };

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('is-open');
    hamburger.classList.toggle('is-open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  /* ---------- Smooth scroll for all in-page nav links ---------- */
  document.querySelectorAll('a[data-nav]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const navHeight = navbar.offsetHeight;
          const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 12;
          window.scrollTo({ top, behavior: 'smooth' });
          history.pushState(null, '', href);
        }
      }
    });
  });

  /* ---------- Active nav-link tracking via IntersectionObserver ---------- */
  const sections = Array.from(document.querySelectorAll('main section[id], main[id]'));
  const navLinkMap = new Map();
  document.querySelectorAll('.nav-link[data-nav]').forEach(link => {
    navLinkMap.set(link.getAttribute('href').replace('#', ''), link);
  });

  const setActive = (id) => {
    navLinkMap.forEach((link, key) => {
      link.classList.toggle('is-active', key === id);
    });
  };

  if ('IntersectionObserver' in window && sections.length) {
    const observer = new IntersectionObserver((entries) => {
      // Pick the entry closest to the top of viewport that's intersecting
      const visible = entries.filter(en => en.isIntersecting);
      if (visible.length > 0) {
        const topMost = visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        setActive(topMost.target.id);
      }
    }, {
      rootMargin: `-${(navbar.offsetHeight + 40)}px 0px -55% 0px`,
      threshold: [0, 0.1, 0.5, 1]
    });

    sections.forEach(sec => observer.observe(sec));
  }

  /* ---------- Contact form (front-end only demo submission) ---------- */
  const form = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const requiredFields = form.querySelectorAll('[required]');
      let allValid = true;
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          allValid = false;
          field.style.borderColor = 'rgba(239,68,68,0.7)';
        } else {
          field.style.borderColor = '';
        }
      });

      if (!allValid) {
        formNote.style.color = '#ef4444';
        formNote.textContent = 'Please fill in all required fields.';
        return;
      }

      const name = form.querySelector('#name').value.trim();

      // No backend connected — this is a front-end placeholder.
      // Replace this block with a fetch() call to your backend or form service.
      formNote.style.color = '#7be6ab';
      formNote.textContent = `Thanks, ${name}! Your message has been prepared. Connect a backend to send it automatically.`;

      form.reset();
    });
  }

});
