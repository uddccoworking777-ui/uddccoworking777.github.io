  const CMS = {
52:     data: null,
53: 
54:     /* Load CMS data from localStorage */
55:     load() {
56:       try {
57:         const raw = localStorage.getItem(KEY);
58:         if (raw) this.data = JSON.parse(raw);
59:       } catch (e) { this.data = null; }
60:       return this.data;
61:     },
62: 
63:     /* Save CMS data to localStorage */
64:     save(data) {
65:       try {
66:         localStorage.setItem(KEY, JSON.stringify(data));
67:         this.data = data;
68:         return true;
69:       } catch (e) { return false; }
70:     },
71: 
72:     /* Get data with fallback to default */
73:     getData() {
74:       return this.data || this.getDefault();
75:     },
76: 
77:     /* Default data (mirrors the static HTML) */
78:     getDefault() {
79:       return {
80:         gallery: [
81:           { id: '1',  src: 'https://picsum.photos/seed/hj01/800/600', title: '現代簡約三房公寓',    category: 'interior',   meta: '台北市大安區・40坪・2024.03', visible: true },
82:           { id: '2',  src: 'https://picsum.photos/seed/hj02/800/600', title: '商辦大樓全棟水電更新', category: 'water',      meta: '新北市・680坪・2024.01',   visible: true },
83:           { id: '3',  src: 'https://picsum.photos/seed/hj03/800/600', title: '廚房衛浴全面翻新',    category: 'interior',   meta: '台中市・28坪・2023.11',    visible: true },
84:           { id: '4',  src: 'https://picsum.photos/seed/hj04/800/600', title: '透天厝全屋翻修設計',  category: 'design',     meta: '台北市士林區・65坪・2023.09', visible: true },
85:           { id: '5',  src: 'https://picsum.photos/seed/hj05/800/600', title: '餐飲店面空間改造',    category: 'commercial', meta: '桃園市・35坪・2023.07',    visible: true },
86:           { id: '6',  src: 'https://picsum.photos/seed/hj06/800/600', title: '老公寓水電全面更新',  category: 'water',      meta: '台北市萬華區・24坪・2023.05', visible: true },
87:           { id: '7',  src: 'https://picsum.photos/seed/hj07/800/600', title: '北歐風格兩房裝修',    category: 'interior',   meta: '新北市板橋區・32坪・2023.04', visible: true },
88:           { id: '8',  src: 'https://picsum.photos/seed/hj08/800/600', title: '小坪數機能空間設計',  category: 'design',     meta: '台北市中山區・18坪・2023.03', visible: true },
89:           { id: '9',  src: 'https://picsum.photos/seed/hj09/800/600', title: '辦公室空間整體翻新',  category: 'commercial', meta: '台北市內湖區・80坪・2023.01', visible: true },
90:           { id: '10', src: 'https://picsum.photos/seed/hj10/800/600', title: '電梯大廈全室裝修',    category: 'interior',   meta: '桃園市・45坪・2022.12',    visible: true },
91:           { id: '11', src: 'https://picsum.photos/seed/hj11/800/600', title: '社區管線整體汰換',    category: 'water',      meta: '新北市新店區・120坪・2022.10', visible: true },
92:           { id: '12', src: 'https://picsum.photos/seed/hj12/800/600', title: '精品風格主臥套房設計', category: 'design',     meta: '台北市大安區・25坪・2022.08', visible: true }
93:         ],
94:         news: [],
95:         contact: {
96:           phone1:  '(02) 2345-6789',
97:           phone2:  '0912-345-678',
98:           email:   'service@hongjiang.com.tw',
99:           region:  '台北・新北・桃園・台中・全台接洽',
100:           hours:   '週一至週六 08:00 — 18:00'
101:         }
102:       };
103:     },
104: 
105:     /* Apply CMS overrides to current page DOM */
106:     apply() {
107:       const d = this.data;
108:       if (!d) return; // No CMS data → keep original HTML
109: 
110:       const page    = location.pathname.split('/').pop() || 'index.html';
111:       const gallery = (d.gallery || []).filter(i => i.visible !== false);
112: 
113:       /* gallery.html — full grid */
114:       if (page === 'gallery.html') {
115:         const grid = document.querySelector('.gallery-grid');
116:         if (grid && gallery.length) {
117:           grid.innerHTML = gallery.map(galleryItemHTML).join('');
118:           const cnt = document.querySelector('.filter-count span');
119:           if (cnt) cnt.textContent = gallery.length;
120:         }
121:       }
122: 
123:       /* index.html — preview grid + news */
124:       if (page === 'index.html' || page === '') {
125:         const preview = document.querySelector('.gallery-preview-grid');
126:         if (preview && gallery.length) {
127:           preview.innerHTML = gallery.slice(0, 5).map(galleryItemHTML).join('');
128:         }
129:         this._applyNews(d.news || []);
130:       }
131: 
132:       /* Service pages — filter by category */
133:       if (page in PAGE_CAT) {
134:         const cat      = PAGE_CAT[page];
135:         const filtered = cat ? gallery.filter(i => i.category === cat) : gallery;
136:         const grid     = document.querySelector('.gallery-grid');
137:         if (grid && filtered.length) {
138:           grid.innerHTML = filtered.map(galleryItemHTML).join('');
139:         }
140:       }
141: 
142:       /* contact.html — contact info */
143:       if (page === 'contact.html' && d.contact) {
144:         this._applyContact(d.contact);
145:       }
146:     },
147: 
148:     _applyContact(c) {
149:       const vals = document.querySelectorAll('.c-value');
150:       if (vals[0]) vals[0].innerHTML = `${esc(c.phone1)}<br />${esc(c.phone2)}`;
151:       if (vals[1]) vals[1].textContent = c.email   || '';
152:       if (vals[2]) vals[2].textContent = c.region  || '';
153:       if (vals[3]) vals[3].textContent = c.hours   || '';
154:     },
155: 
156:     _applyNews(news) {
157:       const visible = news.filter(n => n.visible !== false);
158:       if (!visible.length) return;
159: 
160:       document.getElementById('cms-news')?.remove();
161: 
162:       const cta = document.querySelector('.cta-banner');
163:       if (!cta) return;
164: 
165:       const sec = document.createElement('section');
166:       sec.id = 'cms-news';
167:       sec.className = 'section-gap';
168:       sec.style.background = 'var(--surface)';
169:       sec.innerHTML = `
170:         <div class="container">
171:           <div style="text-align:center;margin-bottom:48px;" class="reveal">
172:             <div class="label" style="justify-content:center;margin-bottom:12px;">最新消息</div>
173:             <div class="section-divider" style="margin:12px auto 0;"></div>
174:             <h2 class="section-title" style="margin-top:16px;">鴻匠<span class="blue"> 最新動態</span></h2>
175:           </div>
176:           <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:20px;">
177:             ${visible.slice(0, 6).map(n => `
178:               <article class="card reveal" style="padding:24px;cursor:default;">
179:                 <div style="font-size:11px;color:var(--text-subtle);font-weight:600;letter-spacing:.06em;margin-bottom:8px;text-transform:uppercase;">
180:                   ${esc(n.category || '最新消息')} · ${esc(n.date || '')}
181:                 </div>
182:                 <h3 style="font-size:17px;font-weight:700;margin-bottom:10px;line-height:1.4;">${esc(n.title)}</h3>
183:                 <p style="font-size:14px;color:var(--text-muted);line-height:1.75;">
184:                   ${esc((n.content || '').slice(0, 150))}${(n.content || '').length > 150 ? '…' : ''}
185:                 </p>
186:               </article>`).join('')}
187:           </div>
188:         </div>`;
189:       cta.before(sec);
190:     },
191: 
192:     /* Initialize default CMS users if none exist */
193:     initAuth() {
194:       if (!localStorage.getItem(AUTH_KEY)) {
195:         // Default: admin@hongjiang.com / HongJiang2024
196:         const hash = hashPwd('HongJiang2024');
197:         localStorage.setItem(AUTH_KEY, JSON.stringify({
198:           users: [{ email: 'admin@hongjiang.com', name: '系統管理員', hash, role: 'admin' }]
199:         }));
200:       }
201:     }
202:   };
203: 
204:   /* Pure-JS password hash — no crypto.subtle required */
205: 