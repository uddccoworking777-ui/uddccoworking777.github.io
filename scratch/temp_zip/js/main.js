/* ═══════════════════════════════════════════════
   鴻匠工程 — main.js v2.0
   ═══════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ────────────────────────────────────────────
     0. Preview Mode  (?pv=1 → force desktop nav)
     When loaded inside the admin preview pane with ?pv=1,
     override responsive breakpoints so the desktop nav
     always shows — no cross-frame JS required.
  ──────────────────────────────────────────── */
  if (location.search.indexOf('pv=1') !== -1) {
    document.documentElement.classList.add('pv-mode');
    // Intercept every internal link click and keep ?pv=1
    // so desktop mode persists as the user navigates pages.
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a');
      if (!a) return;
      var href = a.getAttribute('href');
      // Skip: empty, anchor-only, external, new-tab
      if (!href || href.charAt(0) === '#' || href.indexOf('://') !== -1) return;
      if (a.getAttribute('target') === '_blank') return;
      e.preventDefault();
      var base = href.split('?')[0].split('#')[0];
      location.href = base + '?pv=1';
    }, true);
  }

  /* ────────────────────────────────────────────
     1. Scroll Progress Bar
  ──────────────────────────────────────────── */
  const progressBar = document.createElement('div');
  progressBar.id = 'scroll-progress';
  document.body.prepend(progressBar);

  function updateProgress() {
    const scrolled = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = total > 0 ? (scrolled / total * 100) + '%' : '0%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });

  /* ────────────────────────────────────────────
     2. Nav: glass + scroll state
  ──────────────────────────────────────────── */
  const nav = document.getElementById('main-nav');
  if (nav) {
    const onNavScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onNavScroll, { passive: true });
    onNavScroll();
  }

  /* ────────────────────────────────────────────
     3. Mobile Menu (slide-in from right)
  ──────────────────────────────────────────── */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  // Inject overlay
  const overlay = document.createElement('div');
  overlay.className = 'mobile-overlay';
  document.body.appendChild(overlay);

  function openMenu() {
    mobileMenu && mobileMenu.classList.add('open');
    overlay.classList.add('open');
    hamburger && hamburger.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    mobileMenu && mobileMenu.classList.remove('open');
    overlay.classList.remove('open');
    hamburger && hamburger.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger && hamburger.addEventListener('click', () => {
    hamburger.classList.contains('open') ? closeMenu() : openMenu();
  });
  overlay.addEventListener('click', closeMenu);

  const mobileClose = document.getElementById('mobile-close');
  mobileClose && mobileClose.addEventListener('click', closeMenu);

  // Close mobile menu when a link is clicked
  mobileMenu && mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', closeMenu);
  });

  /* ────────────────────────────────────────────
     4. Keyboard: Esc closes overlays
  ──────────────────────────────────────────── */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeMenu();
      closeLightbox();
    }
  });

  /* ────────────────────────────────────────────
     5. Set active nav link
  ──────────────────────────────────────────── */
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* ────────────────────────────────────────────
     6. Scroll Reveal
  ──────────────────────────────────────────── */
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    const revealObserver = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          revealObserver.unobserve(e.target);
        }
      }),
      { threshold: 0.07, rootMargin: '0px 0px -32px 0px' }
    );
    reveals.forEach(el => revealObserver.observe(el));
  }

  /* ────────────────────────────────────────────
     7. Stats Counter (easeOut cubic)
  ──────────────────────────────────────────── */
  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  function animateCounter(el) {
    const target   = parseFloat(el.dataset.target);
    const isFloat  = String(el.dataset.target).includes('.');
    const suffix   = el.dataset.suffix || '';
    const duration = 1600;
    let start      = null;

    function step(ts) {
      if (!start) start = ts;
      const elapsed  = Math.min(ts - start, duration);
      const progress = easeOutCubic(elapsed / duration);
      const value    = target * progress;
      const display  = isFloat ? value.toFixed(1) : Math.round(value);
      el.innerHTML   = display + '<span class="stat-unit">' + suffix + '</span>';
      if (elapsed < duration) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const statsEl = document.querySelector('.stats-row');
  if (statsEl) {
    let counted = false;
    const counterObserver = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !counted) {
          counted = true;
          document.querySelectorAll('.stat-number[data-target]').forEach(animateCounter);
        }
      },
      { threshold: 0.4 }
    );
    counterObserver.observe(statsEl);
  }

  /* ────────────────────────────────────────────
     8. Accordion (smooth max-height)
  ──────────────────────────────────────────── */
  document.querySelectorAll('.accordion-head').forEach(head => {
    head.addEventListener('click', () => {
      const item   = head.closest('.accordion-item');
      const icon   = head.querySelector('.accordion-icon');
      const isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.accordion-item.open').forEach(openItem => {
        openItem.classList.remove('open');
        const ic = openItem.querySelector('.accordion-icon');
        if (ic) ic.textContent = '+';
      });

      // Open clicked (if was closed)
      if (!isOpen) {
        item.classList.add('open');
        if (icon) icon.textContent = '−';
      }
    });
  });

  /* ────────────────────────────────────────────
     9. Gallery Filter (fade + scale animation)
  ──────────────────────────────────────────── */
  const filterBtns   = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('active')) return;

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      galleryItems.forEach(item => {
        const cat  = item.dataset.category || item.dataset.cat;
        const show = filter === 'all' || cat === filter;

        if (!show) {
          // Fade out, then remove from layout
          item.classList.remove('is-showing');
          item.classList.add('is-hiding');
          clearTimeout(item._hideTimer);
          item._hideTimer = setTimeout(() => {
            item.classList.add('is-hidden');
            item.classList.remove('is-hiding');
          }, 320);
        } else {
          // Restore to layout, then fade in
          clearTimeout(item._hideTimer);
          item.classList.remove('is-hidden', 'is-hiding');
          // Force reflow so animation runs from start
          void item.offsetHeight;
          item.classList.add('is-showing');
          setTimeout(() => item.classList.remove('is-showing'), 380);
        }
      });
    });
  });

  /* ────────────────────────────────────────────
     10. Lightbox
  ──────────────────────────────────────────── */
  const lightbox  = document.getElementById('lightbox');
  const lbImg     = lightbox && lightbox.querySelector('.lightbox-img');
  const lbTitle   = lightbox && lightbox.querySelector('.lb-title');
  const lbMeta    = lightbox && lightbox.querySelector('.lb-meta');
  const lbCounter = lightbox && lightbox.querySelector('.lightbox-counter');

  let lightboxData  = [];
  let currentIndex  = 0;

  function renderLightbox() {
    if (!lbImg || !lightboxData.length) return;
    const item = lightboxData[currentIndex];
    lbImg.src                             = item.src;
    lbImg.alt                             = item.title || '';
    if (lbTitle)   lbTitle.textContent   = item.title || '';
    if (lbMeta)    lbMeta.textContent    = item.meta  || '';
    if (lbCounter) lbCounter.textContent = (currentIndex + 1) + ' / ' + lightboxData.length;
  }

  function openLightbox(data, idx) {
    lightboxData = data;
    currentIndex = idx;
    renderLightbox();
    lightbox && lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    if (lbImg) lbImg.src = '';
  }

  function prevImage() {
    if (!lightboxData.length) return;
    currentIndex = (currentIndex - 1 + lightboxData.length) % lightboxData.length;
    renderLightbox();
  }
  function nextImage() {
    if (!lightboxData.length) return;
    currentIndex = (currentIndex + 1) % lightboxData.length;
    renderLightbox();
  }

  if (lightbox) {
    lightbox.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox-prev')?.addEventListener('click', prevImage);
    lightbox.querySelector('.lightbox-next')?.addEventListener('click', nextImage);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

    // Keyboard nav
    document.addEventListener('keydown', e => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'ArrowLeft')  prevImage();
      if (e.key === 'ArrowRight') nextImage();
    });

    // Touch swipe support
    let touchStartX = null;
    lightbox.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });
    lightbox.addEventListener('touchend', e => {
      if (touchStartX === null) return;
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 50) {
        dx < 0 ? nextImage() : prevImage();
      }
      touchStartX = null;
    }, { passive: true });
  }

  // Bind gallery item clicks
  function bindGalleryItems() {
    document.querySelectorAll('.gallery-item').forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        if (!img) return;

        // Only collect visible (not hidden) items
        const visibleItems = Array.from(document.querySelectorAll('.gallery-item'))
          .filter(el => !el.classList.contains('is-hiding'));

        const clickedIdx = visibleItems.indexOf(item);
        const data = visibleItems.map(el => ({
          src:   el.dataset.full || el.querySelector('img')?.src || '',
          title: el.dataset.title || el.querySelector('.gallery-item-title')?.textContent || '',
          meta:  el.dataset.meta  || el.querySelector('.gallery-item-cat')?.textContent   || '',
        }));

        openLightbox(data, Math.max(clickedIdx, 0));
      });
    });
  }
  bindGalleryItems();

  /* ────────────────────────────────────────────
     11. Smooth Scroll
  ──────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - 80,
          behavior: 'smooth',
        });
      }
    });
  });

  /* ────────────────────────────────────────────
     12. Contact Form (validation + success)
  ──────────────────────────────────────────── */
  const form = document.getElementById('contact-form');
  if (form) {

    function validateField(input) {
      const group    = input.closest('.form-group');
      if (!group) return true;
      const required = input.hasAttribute('required');
      const empty    = input.value.trim() === '';
      const badEmail = input.type === 'email' && input.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value);
      const invalid  = badEmail || (required && empty);

      // Remove previous feedback
      group.querySelectorAll('.field-msg').forEach(m => m.remove());
      input.style.borderColor = '';
      input.style.boxShadow   = '';

      if (invalid) {
        input.style.borderColor = 'var(--red)';
        input.style.boxShadow   = '0 0 0 3px rgba(217,48,37,.12)';
        const msg = document.createElement('div');
        msg.className = 'field-msg';
        msg.style.cssText = 'font-size:12px;color:var(--red);margin-top:4px;font-weight:500;';
        msg.textContent = badEmail ? '請輸入有效的電子郵件' : '此欄位為必填';
        group.appendChild(msg);
        return false;
      }
      if (!empty) {
        input.style.borderColor = 'var(--green)';
        input.style.boxShadow   = '0 0 0 3px rgba(30,142,62,.1)';
      }
      return true;
    }

    form.querySelectorAll('.form-input, .form-textarea, .form-select').forEach(input => {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => {
        const isRed = input.style.borderColor.includes('217') || input.style.borderColor === 'var(--red)';
        if (isRed) validateField(input);
      });
    });

    form.addEventListener('submit', e => {
      e.preventDefault();
      let allValid = true;
      form.querySelectorAll('.form-input, .form-textarea, .form-select').forEach(input => {
        if (!validateField(input)) allValid = false;
      });
      if (!allValid) return;

      const btn = form.querySelector('.form-submit');
      btn.disabled    = true;
      btn.textContent = '送出中…';

      setTimeout(() => {
        form.innerHTML = `
          <div style="text-align:center;padding:64px 32px;display:flex;flex-direction:column;align-items:center;gap:16px;">
            <div style="
              width:64px;height:64px;border-radius:50%;
              background:var(--green-light);border:2px solid var(--green);
              display:flex;align-items:center;justify-content:center;
              font-size:30px;color:var(--green);
              animation:scaleIn .4s cubic-bezier(0.34,1.56,0.64,1) forwards;
            ">✓</div>
            <h3 style="font-size:22px;font-weight:800;color:var(--text);letter-spacing:-0.03em;">申請已成功送出！</h3>
            <p style="font-size:15px;color:var(--text-muted);max-width:320px;line-height:1.8;">
              感謝您的諮詢，我們將在一個工作日內與您聯繫，安排免費到府估價。
            </p>
            <a href="index.html" style="
              margin-top:8px;display:inline-flex;align-items:center;gap:8px;
              background:var(--primary);color:#fff;padding:12px 28px;
              border-radius:100px;font-size:14px;font-weight:700;
              box-shadow:0 1px 3px rgba(26,115,232,.45);
              transition:background .2s;
            ">返回首頁</a>
          </div>
          <style>@keyframes scaleIn{from{opacity:0;transform:scale(.5)}to{opacity:1;transform:scale(1)}}</style>
        `;
      }, 900);
    });
  }

})();
