/* =========================================================
   JOSIAH GRAPHICS — Shared JavaScript
   ========================================================= */

(function () {
  'use strict';

  /* ── Page Loader ────────────────────────────────────────── */
  const loader = document.getElementById('page-loader');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => loader.classList.add('hidden'), 600);
    });
  }

  /* ── Custom Cursor ──────────────────────────────────────── */
  const cursor     = document.querySelector('.cursor');
  const cursorRing = document.querySelector('.cursor-ring');

  if (cursor && cursorRing && window.innerWidth > 768) {
    let cx = 0, cy = 0;
    let rx = 0, ry = 0;

    document.addEventListener('mousemove', (e) => {
      cx = e.clientX;
      cy = e.clientY;
      cursor.style.left = cx + 'px';
      cursor.style.top  = cy + 'px';
    });

    // Ring follows with lag via RAF
    function animateRing() {
      rx += (cx - rx) * 0.12;
      ry += (cy - ry) * 0.12;
      cursorRing.style.left = rx + 'px';
      cursorRing.style.top  = ry + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    // Hover effects
    const hoverEls = document.querySelectorAll('a, button, .card, .portfolio-item, label, input, textarea');
    hoverEls.forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  /* ── Navigation Scroll State ────────────────────────────── */
  const nav = document.getElementById('nav');

  function updateNav() {
    if (!nav) return;
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  /* ── Active Nav Link ─────────────────────────────────────── */
  const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav a');
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (
      href === currentPage ||
      (currentPage === '' && href === 'index.html') ||
      (href && href !== 'index.html' && currentPage.startsWith(href.replace('.html', '')))
    ) {
      link.classList.add('active');
    }
  });

  /* ── Hamburger / Mobile Menu ─────────────────────────────── */
  const hamburger  = document.querySelector('.hamburger');
  const mobileNav  = document.querySelector('.mobile-nav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    mobileNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ── Scroll Progress Bar ─────────────────────────────────── */
  const progressBar = document.getElementById('scroll-progress');

  function updateProgress() {
    if (!progressBar) return;
    const scrollTop    = window.scrollY;
    const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
    const pct          = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
  }

  window.addEventListener('scroll', updateProgress, { passive: true });

  /* ── Back to Top ─────────────────────────────────────────── */
  const backTop = document.getElementById('back-top');

  if (backTop) {
    window.addEventListener('scroll', () => {
      backTop.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    backTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── Scroll Reveal (IntersectionObserver) ────────────────── */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach((el, i) => {
      el.style.transitionDelay = (i % 6) * 0.1 + 's';
      io.observe(el);
    });
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ── Portfolio Filter ────────────────────────────────────── */
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  if (filterBtns.length && portfolioItems.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Active state
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        portfolioItems.forEach(item => {
          const cats = item.dataset.category || '';
          if (filter === 'all' || cats.includes(filter)) {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.92)';
            item.style.display = '';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            }, 30);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.92)';
            setTimeout(() => { item.style.display = 'none'; }, 350);
          }
        });
      });
    });
  }

  /* ── Contact Form ────────────────────────────────────────── */
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const btn     = contactForm.querySelector('[type="submit"]');
      const original = btn.textContent;
      btn.textContent = 'Sending…';
      btn.disabled    = true;

      // Simulate send
      setTimeout(() => {
        btn.textContent = '✓ Message Sent';
        btn.style.background = '#2a7a4e';
        contactForm.reset();
        setTimeout(() => {
          btn.textContent = original;
          btn.style.background = '';
          btn.disabled = false;
        }, 4000);
      }, 1800);
    });
  }

  /* ── Parallax Hero ───────────────────────────────────────── */
  const heroParallax = document.querySelector('.hero-parallax');

  if (heroParallax && window.innerWidth > 768) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      heroParallax.style.transform = `translateY(${y * 0.3}px)`;
    }, { passive: true });
  }

  /* ── Number Counter Animation ────────────────────────────── */
  const counters = document.querySelectorAll('[data-count]');

  if (counters.length) {
    const countIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el     = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        let current  = 0;
        const step   = Math.ceil(target / 60);
        const timer  = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          el.textContent = current + suffix;
        }, 25);
        countIO.unobserve(el);
      });
    }, { threshold: 0.5 });

    counters.forEach(c => countIO.observe(c));
  }

  /* ── Marquee Pause on Hover ──────────────────────────────── */
  const marquees = document.querySelectorAll('.marquee-track');
  marquees.forEach(m => {
    m.addEventListener('mouseenter', () => m.style.animationPlayState = 'paused');
    m.addEventListener('mouseleave', () => m.style.animationPlayState = 'running');
  });

  /* ── Smooth internal anchor scrolling ───────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── Image Lightbox Popup ─────────────────────────────── */
  function createLightbox() {
    const lb = document.createElement('div');
    lb.id = 'image-lightbox';
    lb.innerHTML = `
      <div class="lightbox-backdrop"></div>
      <div class="lightbox-inner">
        <button type="button" class="lightbox-close" aria-label="Close image view">×</button>
        <img class="lightbox-img" src="" alt="" />
        <p class="lightbox-caption"></p>
      </div>
    `;
    document.body.appendChild(lb);

    lb.querySelector('.lightbox-backdrop').addEventListener('click', () => lb.classList.remove('open'));
    lb.querySelector('.lightbox-close').addEventListener('click', () => lb.classList.remove('open'));
    return lb;
  }

  const lightbox = createLightbox();

  function openLightbox(src, caption) {
    const img = lightbox.querySelector('.lightbox-img');
    const cap = lightbox.querySelector('.lightbox-caption');
    img.src = src;
    img.alt = caption || 'Project image';
    cap.textContent = caption || '';
    lightbox.classList.add('open');
  }

  function addLightboxHandlers(selector) {
    document.querySelectorAll(selector).forEach(card => {
      card.addEventListener('click', (e) => {
        const target = e.target.closest(selector);
        if (!target) return;

        // prevent navigation to '#' links
        if (e.target.closest('a')) {
          e.preventDefault();
        }

        const imageEl = target.querySelector('img');
        if (!imageEl) return;

        let caption = '';
        const titleEl = target.querySelector('.work-title, .overlay-title');
        if (titleEl) caption = titleEl.textContent.trim();

        openLightbox(imageEl.src, caption);
      });
    });
  }

  addLightboxHandlers('.work-card');
  addLightboxHandlers('.portfolio-item');

  // Close lightbox with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' || e.key === 'Esc') {
      lightbox.classList.remove('open');
    }
  });

  // Inject minimal lightbox styles
  const lightboxStyles = document.createElement('style');
  lightboxStyles.textContent = `
    #image-lightbox { position: fixed; inset: 0; display: none; align-items: center; justify-content: center; z-index: 9999; }
    #image-lightbox.open { display: flex; }
    #image-lightbox .lightbox-backdrop { position: absolute; inset: 0; background: rgba(6,6,11,0.82); backdrop-filter: blur(4px); }
    #image-lightbox .lightbox-inner { position: relative; max-width: min(95vw, 1000px); max-height: min(95vh, 90vh); background: rgba(10,10,12,0.95); border-radius: 10px; padding: 1rem; box-shadow: 0 20px 46px rgba(0,0,0,0.35); display: flex; flex-direction: column; align-items: center; }
    #image-lightbox .lightbox-img { max-width: 100%; max-height: 75vh; object-fit: contain; border-radius: 8px; }
    #image-lightbox .lightbox-caption { color: #fff; margin-top: 0.75rem; font-size: 0.95rem; text-align: center; line-height: 1.35; }
    #image-lightbox .lightbox-close { position: absolute; top: 8px; right: 8px; width: 36px; height: 36px; border: 0; border-radius: 50%; background: rgba(20,20,25,.75); color: #fff; font-size: 1.6rem; cursor: pointer; }
    #image-lightbox .lightbox-close:hover { background: rgba(255,255,255,0.15); }
  `;
  document.head.appendChild(lightboxStyles);


})();
