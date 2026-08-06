import re

def update_page(filename, title, content_html):
    with open(filename, 'r', encoding='utf-8') as f:
        html = f.read()
    
    # Replace the hero section and content
    start = html.find('<section class="page-hero">')
    end = html.find('<section class="cta-banner">')
    
    if start != -1 and end != -1:
        new_content = f'''<section class="page-hero"><div class="page-hero-bg"></div>
  <div class="container page-hero-content">
    <div class="breadcrumb"><a href="index.html">首頁</a><span class="breadcrumb-sep">›</span><span>{title}</span></div>
    <div class="label page-hero-label">LEGAL / 法律聲明</div>
    <h1 class="page-hero-title"><span class="blue">{title}</span></h1>
  </div>
</section>
<section class="section-gap" style="background:var(--surface);">
  <div class="container" style="max-width:800px; padding: 40px 0; min-height: 400px;">
    {content_html}
  </div>
</section>
'''
        html = html[:start] + new_content + html[end:]
        
        # Also update the <title> tag
        html = re.sub(r'<title>.*?</title>', f'<title>鴻匠工程 — {title}</title>', html)
        
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(html)

update_page('privacy.html', '隱私政策', '<p style="font-size:18px; line-height:1.8;">這裡是隱私政策的預設內容。您可以在此處添加關於使用者資料收集、處理與保護的相關條款。請根據實際營運狀況填寫。</p>')
update_page('terms.html', '服務條款', '<p style="font-size:18px; line-height:1.8;">這裡是服務條款的預設內容。您可以在此處添加關於網站使用規範、服務限制與免責聲明等相關條款。請根據實際營運狀況填寫。</p>')
