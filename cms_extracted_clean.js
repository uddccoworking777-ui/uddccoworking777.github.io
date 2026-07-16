  const CMS = {
    data: null,

    /* Load CMS data from localStorage */
    load() {
      try {
        const raw = localStorage.getItem(KEY);
        if (raw) this.data = JSON.parse(raw);
      } catch (e) { this.data = null; }
      return this.data;
    },

    /* Save CMS data to localStorage */
    save(data) {
      try {
        localStorage.setItem(KEY, JSON.stringify(data));
        this.data = data;
        return true;
      } catch (e) { return false; }
    },

    /* Get data with fallback to default */
    getData() {
      return this.data || this.getDefault();
    },

    /* Default data (mirrors the static HTML) */
    getDefault() {
      return {
        gallery: [
          { id: '1',  src: 'https://picsum.photos/seed/hj01/800/600', title: '現代簡約三房公寓',    category: 'interior',   meta: '台北市大安區・40坪・2024.03', visible: true },
          { id: '2',  src: 'https://picsum.photos/seed/hj02/800/600', title: '商辦大樓全棟水電更新', category: 'water',      meta: '新北市・680坪・2024.01',   visible: true },
          { id: '3',  src: 'https://picsum.photos/seed/hj03/800/600', title: '廚房衛浴全面翻新',    category: 'interior',   meta: '台中市・28坪・2023.11',    visible: true },
          { id: '4',  src: 'https://picsum.photos/seed/hj04/800/600', title: '透天厝全屋翻修設計',  category: 'design',     meta: '台北市士林區・65坪・2023.09', visible: true },
          { id: '5',  src: 'https://picsum.photos/seed/hj05/800/600', title: '餐飲店面空間改造',    category: 'commercial', meta: '桃園市・35坪・2023.07',    visible: true },
          { id: '6',  src: 'https://picsum.photos/seed/hj06/800/600', title: '老公寓水電全面更新',  category: 'water',      meta: '台北市萬華區・24坪・2023.05', visible: true },
          { id: '7',  src: 'https://picsum.photos/seed/hj07/800/600', title: '北歐風格兩房裝修',    category: 'interior',   meta: '新北市板橋區・32坪・2023.04', visible: true },
          { id: '8',  src: 'https://picsum.photos/seed/hj08/800/600', title: '小坪數機能空間設計',  category: 'design',     meta: '台北市中山區・18坪・2023.03', visible: true },
          { id: '9',  src: 'https://picsum.photos/seed/hj09/800/600', title: '辦公室空間整體翻新',  category: 'commercial', meta: '台北市內湖區・80坪・2023.01', visible: true },
          { id: '10', src: 'https://picsum.photos/seed/hj10/800/600', title: '電梯大廈全室裝修',    category: 'interior',   meta: '桃園市・45坪・2022.12',    visible: true },
          { id: '11', src: 'https://picsum.photos/seed/hj11/800/600', title: '社區管線整體汰換',    category: 'water',      meta: '新北市新店區・120坪・2022.10', visible: true },
          { id: '12', src: 'https://picsum.photos/seed/hj12/800/600', title: '精品風格主臥套房設計', category: 'design',     meta: '台北市大安區・25坪・2022.08', visible: true }
        ],
        news: [],
        contact: {
          phone1:  '(02) 2345-6789',
          phone2:  '0912-345-678',
          email:   'service@hongjiang.com.tw',
          region:  '台北・新北・桃園・台中・全台接洽',
          hours:   '週一至週六 08:00 — 18:00'
        }
      };
    },

    /* Apply CMS overrides to current page DOM */
    apply() {
      const d = this.data;
      if (!d) return; // No CMS data → keep original HTML

      const page    = location.pathname.split('/').pop() || 'index.html';
      const gallery = (d.gallery || []).filter(i => i.visible !== false);

      /* gallery.html — full grid */
      if (page === 'gallery.html') {
        const grid = document.querySelector('.gallery-grid');
        if (grid && gallery.length) {
          grid.innerHTML = gallery.map(galleryItemHTML).join('');
          const cnt = document.querySelector('.filter-count span');
          if (cnt) cnt.textContent = gallery.length;
        }
      }

      /* index.html — preview grid + news */
      if (page === 'index.html' || page === '') {
        const preview = document.querySelector('.gallery-preview-grid');
        if (preview && gallery.length) {
          preview.innerHTML = gallery.slice(0, 5).map(galleryItemHTML).join('');
        }
        this._applyNews(d.news || []);
      }

      /* Service pages — filter by category */
      if (page in PAGE_CAT) {
        const cat      = PAGE_CAT[page];
        const filtered = cat ? gallery.filter(i => i.category === cat) : gallery;
        const grid     = document.querySelector('.gallery-grid');
        if (grid && filtered.length) {
          grid.innerHTML = filtered.map(galleryItemHTML).join('');
        }
      }

      /* contact.html — contact info */
      if (page === 'contact.html' && d.contact) {
        this._applyContact(d.contact);
      }
    },

    _applyContact(c) {
      const vals = document.querySelectorAll('.c-value');
      if (vals[0]) vals[0].innerHTML = `${esc(c.phone1)}<br />${esc(c.phone2)}`;
      if (vals[1]) vals[1].textContent = c.email   || '';
      if (vals[2]) vals[2].textContent = c.region  || '';
      if (vals[3]) vals[3].textContent = c.hours   || '';
    },

    _applyNews(news) {
      const visible = news.filter(n => n.visible !== false);
      if (!visible.length) return;

      document.getElementById('cms-news')?.remove();

      const cta = document.querySelector('.cta-banner');
      if (!cta) return;

      const sec = document.createElement('section');
      sec.id = 'cms-news';
      sec.className = 'section-gap';
      sec.style.background = 'var(--surface)';
      sec.innerHTML = `
        <div class="container">
          <div style="text-align:center;margin-bottom:48px;" class="reveal">
            <div class="label" style="justify-content:center;margin-bottom:12px;">最新消息</div>
            <div class="section-divider" style="margin:12px auto 0;"></div>
            <h2 class="section-title" style="margin-top:16px;">鴻匠<span class="blue"> 最新動態</span></h2>
          </div>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:20px;">
            ${visible.slice(0, 6).map(n => `
              <article class="card reveal" style="padding:24px;cursor:default;">
                <div style="font-size:11px;color:var(--text-subtle);font-weight:600;letter-spacing:.06em;margin-bottom:8px;text-transform:uppercase;">
                  ${esc(n.category || '最新消息')} · ${esc(n.date || '')}
                </div>
                <h3 style="font-size:17px;font-weight:700;margin-bottom:10px;line-height:1.4;">${esc(n.title)}</h3>
                <p style="font-size:14px;color:var(--text-muted);line-height:1.75;">
                  ${esc((n.content || '').slice(0, 150))}${(n.content || '').length > 150 ? '…' : ''}
                </p>
              </article>`).join('')}
          </div>
        </div>`;
      cta.before(sec);
    },

    /* Initialize default CMS users if none exist */
    initAuth() {
      if (!localStorage.getItem(AUTH_KEY)) {
        // Default: admin@hongjiang.com / HongJiang2024
        const hash = hashPwd('HongJiang2024');
        localStorage.setItem(AUTH_KEY, JSON.stringify({
          users: [{ email: 'admin@hongjiang.com', name: '系統管理員', hash, role: 'admin' }]
        }));
      }
    }
  };

  /* Pure-JS password hash — no crypto.subtle required */
