/* ========================================
   Little Red Esthetics - Main JS
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileNav();
  initScrollAnimations();
  initFAQ();
  initFloatingCTA();
  initSkinMap();
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

/* --- Interactive Skin Map --- */
function initSkinMap() {
  const hotspots = document.querySelectorAll('.face-hotspot');
  const tooltip = document.getElementById('faceTooltip');
  if (!hotspots.length || !tooltip) return;

  const zoneData = {
    forehead: {
      title: 'Forehead',
      concerns: 'Fine lines, sun damage, uneven texture, horizontal wrinkles',
      treatment: 'Botox + Chemical Peel'
    },
    eyes: {
      title: 'Eye Area',
      concerns: "Crow's feet, dark circles, puffiness, fine lines",
      treatment: 'Botox + Eye Cream Rx'
    },
    'eyes-r': {
      title: 'Eye Area',
      concerns: "Crow's feet, dark circles, puffiness, fine lines",
      treatment: 'Botox + Eye Cream Rx'
    },
    tzone: {
      title: 'T-Zone',
      concerns: 'Enlarged pores, blackheads, excess oil, congestion',
      treatment: 'Deep Cleanse + GlyMed+'
    },
    cheeks: {
      title: 'Cheeks',
      concerns: 'Volume loss, rosacea, acne scarring, pigmentation',
      treatment: 'Filler + Skin Treatment'
    },
    'cheeks-r': {
      title: 'Cheeks',
      concerns: 'Volume loss, rosacea, acne scarring, pigmentation',
      treatment: 'Filler + Skin Treatment'
    },
    lips: {
      title: 'Lips & Mouth',
      concerns: 'Perioral lines, volume loss, asymmetry, dryness',
      treatment: 'Lip Filler + Lip Flip'
    },
    jawline: {
      title: 'Jawline & Chin',
      concerns: 'Hormonal acne, sagging, loss of definition',
      treatment: 'Jawline Filler + Skin Rx'
    }
  };

  let activeHotspot = null;

  hotspots.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const zone = btn.dataset.zone;
      const data = zoneData[zone];
      if (!data) return;

      if (activeHotspot === btn) {
        closeTooltip();
        return;
      }

      hotspots.forEach(h => h.classList.remove('active'));
      btn.classList.add('active');
      activeHotspot = btn;

      tooltip.querySelector('.face-tooltip-title').textContent = data.title;
      tooltip.querySelector('.face-tooltip-concerns').textContent = data.concerns;
      tooltip.querySelector('.face-tooltip-treatment').textContent = data.treatment;

      const map = btn.closest('.face-map');
      const mapRect = map.getBoundingClientRect();
      const btnRect = btn.getBoundingClientRect();
      const btnCenterX = btnRect.left + btnRect.width / 2 - mapRect.left;
      const btnCenterY = btnRect.top + btnRect.height / 2 - mapRect.top;

      const tipW = 220;
      let left = btnCenterX + 20;
      let top = btnCenterY - 30;

      if (left + tipW > mapRect.width) {
        left = btnCenterX - tipW - 20;
      }
      if (top < 0) top = 10;
      if (top + 120 > mapRect.height) top = mapRect.height - 130;

      tooltip.style.left = left + 'px';
      tooltip.style.top = top + 'px';
      tooltip.classList.add('visible');
    });
  });

  function closeTooltip() {
    tooltip.classList.remove('visible');
    hotspots.forEach(h => h.classList.remove('active'));
    activeHotspot = null;
  }

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.face-map')) {
      closeTooltip();
    }
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
