import os

# Update privacy.html
with open('privacy.html', 'r', encoding='utf-8') as f:
    privacy_html = f.read()

privacy_html = privacy_html.replace(
    '<p style="font-size:18px; line-height:1.8;">這裡是隱私政策的預設內容。您可以在此處添加關於使用者資料收集、處理與保護的相關條款。請根據實際營運狀況填寫。</p>',
    '<div data-cms="content" style="font-size:18px; line-height:1.8; white-space: pre-line;">這裡是隱私政策的預設內容。您可以在此處添加關於使用者資料收集、處理與保護的相關條款。請根據實際營運狀況填寫。</div>'
)

with open('privacy.html', 'w', encoding='utf-8') as f:
    f.write(privacy_html)

# Update terms.html
with open('terms.html', 'r', encoding='utf-8') as f:
    terms_html = f.read()

terms_html = terms_html.replace(
    '<p style="font-size:18px; line-height:1.8;">這裡是服務條款的預設內容。您可以在此處添加關於網站使用規範、服務限制與免責聲明等相關條款。請根據實際營運狀況填寫。</p>',
    '<div data-cms="content" style="font-size:18px; line-height:1.8; white-space: pre-line;">這裡是服務條款的預設內容。您可以在此處添加關於網站使用規範、服務限制與免責聲明等相關條款。請根據實際營運狀況填寫。</div>'
)

with open('terms.html', 'w', encoding='utf-8') as f:
    f.write(terms_html)
