/* ========================================
   Little Red Esthetics - Main JS
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileNav();
  initScrollAnimations();
  initFAQ();
  initFloatingCTA();
});

/* --- Navbar Scroll --- */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const onScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* --- Mobile Navigation --- */
function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const overlay = document.querySelector('.nav-overlay');

  if (!toggle || !navLinks) return;

  const close = () => {
    toggle.classList.remove('active');
    navLinks.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  toggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.contains('active');
    if (isOpen) {
      close();
    } else {
      toggle.classList.add('active');
      navLinks.classList.add('active');
      if (overlay) overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  });

  if (overlay) {
    overlay.addEventListener('click', close);
  }

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', close);
  });
}

/* --- Scroll Animations --- */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.fade-in, .fade-in-scale, .slide-in-left, .slide-in-right');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(el => observer.observe(el));
}

/* --- Floating CTA visibility --- */
function initFloatingCTA() {
  const cta = document.querySelector('.floating-cta');
  if (!cta) return;

  const footer = document.querySelector('.footer');
  if (!footer) return;

  const onScroll = () => {
    const footerTop = footer.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (footerTop < windowHeight) {
      cta.style.opacity = '0';
      cta.style.pointerEvents = 'none';
    } else {
      cta.style.opacity = '1';
      cta.style.pointerEvents = 'auto';
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* --- FAQ Accordion --- */
function initFAQ() {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all
      items.forEach(i => i.classList.remove('active'));

      // Toggle clicked
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* --- Gallery Filter --- */
function initGalleryFilter() {
  const buttons = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.gallery-full-item');

  if (!buttons.length || !items.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      items.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.style.display = '';
          setTimeout(() => item.style.opacity = '1', 10);
        } else {
          item.style.opacity = '0';
          setTimeout(() => item.style.display = 'none', 300);
        }
      });
    });
  });
}
