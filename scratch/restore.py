import os, re
base = r'c:\Users\USER\Downloads\hj-website'
files = ['index.html', 'about.html', 'contact.html', 'privacy.html', 'terms.html', 'service-water.html', 'service-interior.html', 'service-design.html', 'service-maintenance.html']
for f in files:
    p = os.path.join(base, f)
    c = open(p, encoding='utf-8').read()
    c = re.sub(r'(<li><a href="service-maintenance\.html">維修保固</a></li>\s*</ul>\s*</li>)', r'\1\n        <li><a href="gallery.html">作品相冊</a></li>', c)
    c = re.sub(r'(<a href="service-maintenance\.html" class="mobile-sub">維修保固</a>)', r'\1\n  <a href="gallery.html">作品相冊</a>', c)
    c = re.sub(r'(<h4>快速連結</h4><ul class="footer-links">)', r'\1<li><a href="gallery.html">作品相冊</a></li>', c)
    open(p, 'w', encoding='utf-8').write(c)
print('Restored nav links')
