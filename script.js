(() => {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Year in footer ----------
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---------- Header scroll state ----------
  const header = document.getElementById('header');
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 16);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---------- Mobile menu ----------
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const toggleMenu = (force) => {
    if (!hamburger || !mobileMenu) return;
    const open = force !== undefined ? force : !hamburger.classList.contains('open');
    hamburger.classList.toggle('open', open);
    mobileMenu.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
    mobileMenu.setAttribute('aria-hidden', String(!open));
    document.body.style.overflow = open ? 'hidden' : '';
  };
  if (hamburger) hamburger.addEventListener('click', () => toggleMenu());
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggleMenu(false)));
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') toggleMenu(false);
  });

  // ---------- Reveal animations ----------
  const revealEls = document.querySelectorAll('.reveal, .section-head, .hero-title');
  if ('IntersectionObserver' in window && !prefersReduced) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  // Hero immediate reveal
  requestAnimationFrame(() => {
    document.querySelectorAll('.hero .reveal, .hero .hero-title, .hero .section-head').forEach(el => el.classList.add('in'));
  });

  // ---------- Stat counters ----------
  const counters = document.querySelectorAll('.stat-num');
  const animateCounter = (el) => {
    const target = parseFloat(el.dataset.count || '0');
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const start = performance.now();
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const val = Math.round(target * ease(p));
      el.textContent = val.toLocaleString('he-IL') + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if ('IntersectionObserver' in window && !prefersReduced) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animateCounter(e.target);
          cio.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(el => cio.observe(el));
  } else {
    counters.forEach(el => {
      el.textContent = (el.dataset.count || '0') + (el.dataset.suffix || '');
    });
  }

  // ---------- Card tilt (desktop only) ----------
  const tiltEls = document.querySelectorAll('[data-tilt]');
  const canTilt = window.matchMedia('(hover: hover) and (pointer: fine)').matches && !prefersReduced;
  if (canTilt) {
    tiltEls.forEach(el => {
      const max = 6;
      let raf = null;
      const onMove = (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        const ry = (x - 0.5) * (max * 2);
        const rx = (0.5 - y) * (max * 2);
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          el.style.setProperty('--rx', rx.toFixed(2) + 'deg');
          el.style.setProperty('--ry', ry.toFixed(2) + 'deg');
        });
      };
      const reset = () => {
        el.style.setProperty('--rx', '0deg');
        el.style.setProperty('--ry', '0deg');
      };
      el.addEventListener('mousemove', onMove);
      el.addEventListener('mouseleave', reset);
    });
  }

  // ---------- Custom cursor (desktop) ----------
  const cursor = document.querySelector('.cursor');
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (cursor && window.matchMedia('(hover: hover) and (pointer: fine)').matches && !prefersReduced) {
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my;
    document.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      if (dot) {
        dot.style.left = mx + 'px';
        dot.style.top  = my + 'px';
      }
    });
    const animateRing = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      if (ring) {
        ring.style.left = rx + 'px';
        ring.style.top  = ry + 'px';
      }
      requestAnimationFrame(animateRing);
    };
    animateRing();

    const hoverables = 'a, button, summary, input, select, textarea, [data-tilt]';
    document.querySelectorAll(hoverables).forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  // ---------- Hero parallax on prism ----------
  const scene = document.querySelector('.hero-visual');
  if (scene && !prefersReduced && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const prism = scene.querySelector('.prism');
    scene.addEventListener('mousemove', (e) => {
      const r = scene.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      if (prism) {
        prism.style.transition = 'none';
        prism.style.animationPlayState = 'paused';
        prism.style.transform = `rotateX(${-12 + y * -10}deg) rotateY(${x * 30}deg)`;
      }
    });
    scene.addEventListener('mouseleave', () => {
      if (prism) {
        prism.style.transition = 'transform .8s cubic-bezier(0.22, 1, 0.36, 1)';
        prism.style.animationPlayState = 'running';
        prism.style.transform = '';
      }
    });
  }

  // ---------- Smooth anchor scroll (extra polish for older browsers) ----------
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href === '#' || href.length < 2) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: prefersReduced ? 'auto' : 'smooth' });
    });
  });

  // ---------- Contact form (mock submit) ----------
  const form = document.getElementById('contact-form');
  const note = document.getElementById('form-note');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name = (data.get('name') || '').toString().trim();
      const phone = (data.get('phone') || '').toString().trim();
      const topic = (data.get('topic') || '').toString().trim();
      const msg = (data.get('message') || '').toString().trim();

      if (!name || !phone) {
        if (note) {
          note.textContent = 'אנא מלאו שם וטלפון לפחות.';
          note.className = 'form-note error';
        }
        return;
      }

      // Build a WhatsApp-friendly message and open it in a new tab.
      const lines = [
        `שלום, שמי ${name}.`,
        `טלפון: ${phone}.`,
        topic ? `נושא: ${topic}.` : '',
        msg ? `הודעה: ${msg}` : ''
      ].filter(Boolean);
      const text = encodeURIComponent(lines.join('\n'));
      const wa = `https://wa.me/972527742312?text=${text}`;

      if (note) {
        note.textContent = 'תודה! מעבירים אתכם לוואטסאפ עם הפרטים שמילאתם...';
        note.className = 'form-note success';
      }
      setTimeout(() => { window.open(wa, '_blank', 'noopener'); }, 500);
      form.reset();
    });
  }

  // ---------- Reduce hero animation cost when off-screen ----------
  const hero = document.querySelector('.hero');
  if (hero && 'IntersectionObserver' in window) {
    const ho = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        const prism = hero.querySelector('.prism');
        if (!prism) return;
        prism.style.animationPlayState = e.isIntersecting ? 'running' : 'paused';
      });
    });
    ho.observe(hero);
  }

})();
