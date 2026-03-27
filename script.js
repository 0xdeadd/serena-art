/* ============================================
   Serena — Artist Portfolio Scripts
   ============================================ */

(function () {
  'use strict';

  // ---- Scroll-triggered fade-up animations ----
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.fade-up').forEach((el, i) => {
    el.style.transitionDelay = `${i % 4 * 0.1}s`;
    observer.observe(el);
  });

  // ---- Navbar: scroll style + active section ----
  const nav = document.getElementById('nav');
  const sections = document.querySelectorAll('.section, .hero');
  const navLinks = document.querySelectorAll('.nav-links a');

  function onScroll() {
    // Shrink nav
    nav.classList.toggle('scrolled', window.scrollY > 60);

    // Highlight active section link
    let current = '';
    sections.forEach((sec) => {
      if (window.scrollY >= sec.offsetTop - 200) {
        current = sec.getAttribute('id');
      }
    });
    navLinks.forEach((a) => {
      a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---- Mobile nav toggle ----
  const toggle = document.getElementById('nav-toggle');
  const navLinksEl = document.getElementById('nav-links');

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    navLinksEl.classList.toggle('open');
  });

  // Close mobile nav on link click
  navLinksEl.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      toggle.classList.remove('open');
      navLinksEl.classList.remove('open');
    });
  });

  // ---- Lightbox ----
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox.querySelector('img');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');
  const lightboxClose = lightbox.querySelector('.lightbox-close');

  document.querySelectorAll('.gallery-img-wrap').forEach((wrap) => {
    wrap.addEventListener('click', () => {
      const img = wrap.querySelector('img');
      const overlay = wrap.querySelector('.gallery-overlay');
      const title = overlay.querySelector('h3').textContent;
      const subtitle = overlay.querySelector('p').textContent;

      // Use a higher resolution image for lightbox
      const src = img.src.replace(/\/\d+\/\d+$/, '/800/1000');
      lightboxImg.src = src;
      lightboxCaption.textContent = `${title} — ${subtitle}`;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  // ---- Contact form → mailto ----
  const contactForm = document.getElementById('contact-form');
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = contactForm.querySelector('#name').value.trim();
    const email = contactForm.querySelector('#email').value.trim();
    const message = contactForm.querySelector('#message').value.trim();
    const subject = encodeURIComponent(`Inquiry from ${name}`);
    const body = encodeURIComponent(
      `Hi Serena,\n\n${message}\n\n— ${name}\n${email}`
    );
    window.location.href = `mailto:hello@serena.art?subject=${subject}&body=${body}`;
  });

  // ---- Shop "Notify Me" form ----
  const shopForm = document.getElementById('shop-form');
  shopForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = shopForm.querySelector('button');
    const original = btn.textContent;
    btn.textContent = 'Thank you!';
    btn.disabled = true;
    shopForm.querySelector('input').disabled = true;
    setTimeout(() => {
      btn.textContent = original;
      btn.disabled = false;
      shopForm.querySelector('input').disabled = false;
      shopForm.querySelector('input').value = '';
    }, 3000);
  });

  // ---- Parallax on hero background ----
  const hero = document.querySelector('.hero');
  window.addEventListener('scroll', () => {
    if (window.scrollY < window.innerHeight) {
      const offset = window.scrollY * 0.3;
      hero.style.backgroundPositionY = `${offset}px`;
    }
  }, { passive: true });

  // ---- Magnetic hover on CTA buttons (desktop only) ----
  if (window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.hero-cta, .btn-submit, .shop-form button').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  // ---- Gallery stagger on scroll ----
  const galleryItems = document.querySelectorAll('.gallery-item');
  const galleryObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, i * 80);
          galleryObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.05 }
  );

  galleryItems.forEach((item) => galleryObserver.observe(item));

  // ---- Smooth anchor scroll (fallback for browsers without scroll-behavior) ----
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ---- Cursor glow that follows mouse on hero (desktop) ----
  if (window.matchMedia('(pointer: fine)').matches) {
    const glow = document.createElement('div');
    glow.classList.add('hero-glow');
    hero.appendChild(glow);

    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      glow.style.left = `${e.clientX - rect.left}px`;
      glow.style.top = `${e.clientY - rect.top}px`;
      glow.style.opacity = '1';
    });

    hero.addEventListener('mouseleave', () => {
      glow.style.opacity = '0';
    });
  }
})();
