/**
 * build_demo.js
 * 將 hj-website 所有頁面打包成一個獨立展示用 HTML 檔。
 * 原始檔案不做任何修改。
 *
 * 策略：
 *   1. 讀取 css/style.css 並 inline
 *   2. 讀取每個 HTML 頁面的 <body> 內容（去掉 nav/footer/lightbox/mobile-menu/script），
 *      存為 <div data-page="xxx"> 區塊
 *   3. 共用一組 nav、footer、lightbox、mobile-menu
 *   4. 讀取 js/main.js 並 inline，加上 SPA 路由邏輯
 *   5. 每頁的 <style> inline CSS 也全部收集合併
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'hj-website-demo.html');

// ── Helper: read file ──
function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8');
}

// ── Helper: extract content between <body> and </body> ──
function extractBody(html) {
  const m = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  return m ? m[1] : '';
}

// ── Helper: extract page-specific <style> from <head> ──
function extractPageStyles(html) {
  const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  if (!headMatch) return '';
  const head = headMatch[1];
  const styles = [];
  const re = /<style[^>]*>([\s\S]*?)<\/style>/gi;
  let m;
  while ((m = re.exec(head)) !== null) {
    styles.push(m[1]);
  }
  return styles.join('\n');
}

// ── Helper: remove shared elements from body content ──
function removeShared(bodyHtml) {
  // Remove <nav id="main-nav">...</nav>
  bodyHtml = bodyHtml.replace(/<nav\s+id="main-nav"[\s\S]*?<\/nav>/i, '');
  // Remove mobile menu
  bodyHtml = bodyHtml.replace(/<div\s+class="mobile-menu"[\s\S]*?<\/div>\s*(?=<)/i, '');
  // Remove lightbox
  bodyHtml = bodyHtml.replace(/<div\s+id="lightbox"[\s\S]*?<\/div>\s*<\/div>/i, '');
  // Remove footer
  bodyHtml = bodyHtml.replace(/<footer[\s\S]*?<\/footer>/i, '');
  // Remove <script> tags
  bodyHtml = bodyHtml.replace(/<script[\s\S]*?<\/script>/gi, '');
  return bodyHtml.trim();
}

// ── Pages to bundle ──
const pages = [
  { id: 'index',               file: 'index.html',              label: '首頁' },
  { id: 'service-water',       file: 'service-water.html',      label: '水電工程' },
  { id: 'service-interior',    file: 'service-interior.html',   label: '室內裝修' },
  { id: 'service-design',      file: 'service-design.html',     label: '設計規劃' },
  { id: 'service-maintenance', file: 'service-maintenance.html',label: '維修保固' },
  { id: 'gallery',             file: 'gallery.html',            label: '作品相冊' },
  { id: 'about',               file: 'about.html',              label: '關於我們' },
  { id: 'contact',             file: 'contact.html',            label: '聯絡我們' },
];

// ── 1. Collect CSS ──
let globalCSS = read('css/style.css');

// ── 2. Collect page-specific styles ──
let pageCSS = '';
for (const p of pages) {
  try {
    const html = read(p.file);
    const ps = extractPageStyles(html);
    if (ps) pageCSS += `\n/* ── ${p.label} (${p.file}) ── */\n${ps}\n`;
  } catch (e) {
    console.warn(`Skipping page styles for ${p.file}:`, e.message);
  }
}

// ── 3. Collect page bodies ──
let pageDivs = '';
for (const p of pages) {
  try {
    const html = read(p.file);
    const body = extractBody(html);
    const clean = removeShared(body);
    const display = p.id === 'index' ? 'block' : 'none';
    pageDivs += `\n<!-- ═══ PAGE: ${p.label} ═══ -->\n<div class="spa-page" data-page="${p.id}" style="display:${display};">\n${clean}\n</div>\n`;
  } catch (e) {
    console.warn(`Skipping page ${p.file}:`, e.message);
  }
}

// ── 4. Read main.js ──
const mainJS = read('js/main.js');

// ── 5. Build shared nav (from index.html) ──
const indexHtml = read('index.html');
const indexBody = extractBody(indexHtml);

// Extract nav
const navMatch = indexBody.match(/<nav\s+id="main-nav"[\s\S]*?<\/nav>/i);
const navHtml = navMatch ? navMatch[0] : '';

// Extract mobile menu
const mobileMatch = indexBody.match(/<div\s+class="mobile-menu"[\s\S]*?<\/div>\s*(?=<section|<\!--)/i);
const mobileHtml = mobileMatch ? mobileMatch[0] : '';

// Extract footer
const footerMatch = indexBody.match(/<footer[\s\S]*?<\/footer>/i);
const footerHtml = footerMatch ? footerMatch[0] : '';

// Extract lightbox
const lbMatch = indexBody.match(/<div\s+id="lightbox"[\s\S]*?<\/div>\s*<\/div>/i);
const lbHtml = lbMatch ? lbMatch[0] : '';

// ── 6. SPA Router JS ──
const spaRouter = `
/* ═══════════════════════════════════════════
   SPA Router for Demo
   ═══════════════════════════════════════════ */
(function() {
  'use strict';

  // Page mapping: link href → page id
  var PAGE_MAP = {
    'index.html':              'index',
    'service-water.html':      'service-water',
    'service-interior.html':   'service-interior',
    'service-design.html':     'service-design',
    'service-maintenance.html':'service-maintenance',
    'gallery.html':            'gallery',
    'about.html':              'about',
    'contact.html':            'contact',
  };

  function getPageFromHash() {
    var h = location.hash.replace('#', '') || 'index';
    return h;
  }

  function showPage(pageId) {
    var allPages = document.querySelectorAll('.spa-page');
    allPages.forEach(function(p) { p.style.display = 'none'; });

    var target = document.querySelector('.spa-page[data-page="' + pageId + '"]');
    if (target) {
      target.style.display = 'block';
    } else {
      // fallback to index
      var idx = document.querySelector('.spa-page[data-page="index"]');
      if (idx) idx.style.display = 'block';
      pageId = 'index';
    }

    // Update nav active state
    document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(function(a) {
      a.classList.remove('active');
      var href = a.getAttribute('href') || '';
      var mapped = PAGE_MAP[href];
      if (mapped === pageId) {
        a.classList.add('active');
      }
    });

    // Scroll to top
    window.scrollTo(0, 0);

    // Re-trigger reveal animations
    var reveals = document.querySelectorAll('.spa-page[data-page="' + pageId + '"] .reveal');
    reveals.forEach(function(el) {
      el.classList.remove('visible');
    });
    setTimeout(function() {
      reveals.forEach(function(el) {
        el.classList.add('visible');
      });
    }, 50);

    // Re-bind gallery items if on gallery page
    if (pageId === 'gallery' || pageId === 'index') {
      setTimeout(function() {
        bindDemoGalleryItems();
        bindDemoFilterBtns();
      }, 100);
    }

    // Re-bind accordion if needed
    setTimeout(function() { bindDemoAccordion(); }, 100);

    // Re-trigger counter animation on stats
    setTimeout(function() {
      var statsEl = document.querySelector('.spa-page[data-page="' + pageId + '"] .stats-row');
      if (statsEl) {
        statsEl.querySelectorAll('.stat-number[data-target]').forEach(function(el) {
          animateDemoCounter(el);
        });
      }
    }, 300);
  }

  // Counter animation
  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
  function animateDemoCounter(el) {
    var target = parseFloat(el.dataset.target);
    var isFloat = String(el.dataset.target).indexOf('.') !== -1;
    var suffix = el.dataset.suffix || '';
    var duration = 1600;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var elapsed = Math.min(ts - start, duration);
      var progress = easeOutCubic(elapsed / duration);
      var value = target * progress;
      var display = isFloat ? value.toFixed(1) : Math.round(value);
      el.innerHTML = display + '<span class="stat-unit">' + suffix + '</span>';
      if (elapsed < duration) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // Accordion binding
  function bindDemoAccordion() {
    document.querySelectorAll('.accordion-head').forEach(function(head) {
      if (head._demoBound) return;
      head._demoBound = true;
      head.addEventListener('click', function() {
        var item = head.closest('.accordion-item');
        var icon = head.querySelector('.accordion-icon');
        var isOpen = item.classList.contains('open');
        // Close all in this accordion
        var accordion = item.closest('.accordion');
        if (accordion) {
          accordion.querySelectorAll('.accordion-item.open').forEach(function(oi) {
            oi.classList.remove('open');
            var ic = oi.querySelector('.accordion-icon');
            if (ic) ic.textContent = '+';
          });
        }
        if (!isOpen) {
          item.classList.add('open');
          if (icon) icon.textContent = String.fromCharCode(8722); // −
        }
      });
    });
  }

  // Gallery items binding
  function bindDemoGalleryItems() {
    document.querySelectorAll('.gallery-item').forEach(function(item) {
      if (item._demoBound) return;
      item._demoBound = true;
      item.addEventListener('click', function() {
        var img = item.querySelector('img');
        if (!img) return;
        var lightbox = document.getElementById('lightbox');
        if (!lightbox) return;

        var visibleItems = Array.from(document.querySelectorAll('.spa-page[style*="block"] .gallery-item'))
          .filter(function(el) { return !el.classList.contains('is-hiding') && !el.classList.contains('is-hidden'); });

        var clickedIdx = visibleItems.indexOf(item);
        var data = visibleItems.map(function(el) {
          return {
            src:   el.dataset.full || (el.querySelector('img') || {}).src || '',
            title: el.dataset.title || (el.querySelector('.gallery-item-title') || {}).textContent || '',
            meta:  el.dataset.meta  || (el.querySelector('.gallery-item-cat') || {}).textContent || '',
          };
        });

        // Use the global lightbox functions from main.js (they should be available)
        window.__demoLightboxData = data;
        window.__demoLightboxIdx = Math.max(clickedIdx, 0);

        var lbImg = lightbox.querySelector('.lightbox-img');
        var lbTitle = lightbox.querySelector('.lb-title');
        var lbMeta = lightbox.querySelector('.lb-meta');
        var lbCounter = lightbox.querySelector('.lightbox-counter');

        function renderLB() {
          var d = window.__demoLightboxData;
          var i = window.__demoLightboxIdx;
          if (!d || !d.length) return;
          var cur = d[i];
          if (lbImg) { lbImg.src = cur.src; lbImg.alt = cur.title || ''; }
          if (lbTitle) lbTitle.textContent = cur.title || '';
          if (lbMeta) lbMeta.textContent = cur.meta || '';
          if (lbCounter) lbCounter.textContent = (i + 1) + ' / ' + d.length;
        }

        renderLB();
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';

        // Override lightbox nav temporarily
        window.__demoRenderLB = renderLB;
      });
    });
  }

  // Filter buttons binding
  function bindDemoFilterBtns() {
    document.querySelectorAll('.filter-btn').forEach(function(btn) {
      if (btn._demoBound) return;
      btn._demoBound = true;
      btn.addEventListener('click', function() {
        if (btn.classList.contains('active')) return;

        // Find all filter buttons in same container
        var container = btn.closest('.gallery-filters, .gallery-filters-row');
        if (container) {
          container.querySelectorAll('.filter-btn').forEach(function(b) { b.classList.remove('active'); });
        }
        btn.classList.add('active');

        var filter = btn.dataset.filter;
        // Find gallery items in same page
        var page = btn.closest('.spa-page');
        if (!page) return;
        var items = page.querySelectorAll('.gallery-item');

        items.forEach(function(item) {
          var cat = item.dataset.category || item.dataset.cat;
          var show = filter === 'all' || cat === filter;
          if (!show) {
            item.classList.remove('is-showing');
            item.classList.add('is-hiding');
            clearTimeout(item._hideTimer);
            item._hideTimer = setTimeout(function() {
              item.classList.add('is-hidden');
              item.classList.remove('is-hiding');
            }, 320);
          } else {
            clearTimeout(item._hideTimer);
            item.classList.remove('is-hidden', 'is-hiding');
            void item.offsetHeight;
            item.classList.add('is-showing');
            setTimeout(function() { item.classList.remove('is-showing'); }, 380);
          }
        });
      });
    });
  }

  // Intercept all internal link clicks
  document.addEventListener('click', function(e) {
    var a = e.target.closest('a');
    if (!a) return;

    var href = a.getAttribute('href');
    if (!href) return;

    // Skip external links, anchors, tel, mailto
    if (href.indexOf('://') !== -1 || href.indexOf('tel:') === 0 || href.indexOf('mailto:') === 0) return;
    if (href.charAt(0) === '#' && href.length > 1 && !href.startsWith('#!')) return;
    if (a.getAttribute('target') === '_blank') return;

    // Check if it maps to a page
    var cleanHref = href.split('?')[0].split('#')[0];
    // Handle admin links - skip
    if (cleanHref.indexOf('admin/') !== -1) return;

    var pageId = PAGE_MAP[cleanHref];
    if (pageId) {
      e.preventDefault();
      location.hash = pageId;
    }
  }, true);

  // Hash change handler
  window.addEventListener('hashchange', function() {
    showPage(getPageFromHash());
  });

  // Initial load
  document.addEventListener('DOMContentLoaded', function() {
    showPage(getPageFromHash());
  });

  // Lightbox nav override for SPA
  document.addEventListener('DOMContentLoaded', function() {
    var lb = document.getElementById('lightbox');
    if (!lb) return;

    var prevBtn = lb.querySelector('.lightbox-prev');
    var nextBtn = lb.querySelector('.lightbox-next');
    var closeBtn = lb.querySelector('.lightbox-close');

    function closeLB() {
      lb.classList.remove('open');
      document.body.style.overflow = '';
    }

    if (closeBtn) closeBtn.addEventListener('click', closeLB);
    lb.addEventListener('click', function(e) { if (e.target === lb) closeLB(); });

    if (prevBtn) prevBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      if (!window.__demoLightboxData || !window.__demoLightboxData.length) return;
      window.__demoLightboxIdx = (window.__demoLightboxIdx - 1 + window.__demoLightboxData.length) % window.__demoLightboxData.length;
      if (window.__demoRenderLB) window.__demoRenderLB();
    });

    if (nextBtn) nextBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      if (!window.__demoLightboxData || !window.__demoLightboxData.length) return;
      window.__demoLightboxIdx = (window.__demoLightboxIdx + 1) % window.__demoLightboxData.length;
      if (window.__demoRenderLB) window.__demoRenderLB();
    });

    document.addEventListener('keydown', function(e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') closeLB();
      if (e.key === 'ArrowLeft' && prevBtn) prevBtn.click();
      if (e.key === 'ArrowRight' && nextBtn) nextBtn.click();
    });
  });

})();
`;

// ── 7. Assemble final HTML ──
const finalHTML = `<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>鴻匠工程 — 完整展示 Demo</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Roboto:wght@300;400;500&display=swap" rel="stylesheet">
  <style>
/* ═══ Global CSS (style.css) ═══ */
${globalCSS}

/* ═══ Page-specific CSS ═══ */
${pageCSS}

/* ═══ SPA Page Container ═══ */
.spa-page { min-height: 0; }
  </style>
</head>
<body>

${navHtml}

${mobileHtml}

<!-- ═══ SPA Page Containers ═══ -->
${pageDivs}

${footerHtml}

${lbHtml}

<script>
${spaRouter}
</script>

</body>
</html>`;

fs.writeFileSync(OUT, finalHTML, 'utf8');
const sizeKB = (fs.statSync(OUT).size / 1024).toFixed(1);
console.log('Demo file generated: ' + OUT);
console.log('File size: ' + sizeKB + ' KB');
