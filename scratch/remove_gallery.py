import os
import re

base_dir = r"c:\Users\USER\Downloads\hj-website"

html_files = [
    "index.html", "about.html", "contact.html", "privacy.html", "terms.html",
    "service-water.html", "service-interior.html", "service-design.html", "service-maintenance.html",
    "admin/dashboard.html"
]

for file_name in html_files:
    path = os.path.join(base_dir, file_name)
    if not os.path.exists(path):
        continue
    
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove lists items with gallery
    content = re.sub(r'\s*<li><a href="gallery\.html"[^>]*>作品相冊</a></li>', '', content)
    # Remove links directly
    content = re.sub(r'\s*<a href="gallery\.html"[^>]*>作品相冊</a>', '', content)
    # Remove hero button in index.html
    content = re.sub(r'\s*<a href="gallery\.html"[^>]*>瀏覽作品相冊</a>', '', content)
    # Remove "作品相冊" label div in index.html
    content = re.sub(r'\s*<div class="label"[^>]*>作品相冊</div>', '', content)
    # Remove gallery option in dashboard
    content = re.sub(r'\s*<option value="\.\./gallery\.html">作品相冊</option>', '', content)
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

gallery_path = os.path.join(base_dir, "gallery.html")
if os.path.exists(gallery_path):
    os.remove(gallery_path)
    print("Deleted gallery.html")

print("Done cleaning gallery links.")
