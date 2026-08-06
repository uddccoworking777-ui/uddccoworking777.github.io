import os, glob, shutil

# Create valid privacy and terms pages
shutil.copy('about.html', 'privacy.html')
shutil.copy('about.html', 'terms.html')

# Update links
files = glob.glob('*.html')
for file in files:
    if file.startswith('hj-website-demo') or file == 'chat_history.html':
        continue
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    content = content.replace('<li><a href="#"><span data-cms="global.footer.privacy">隱私政策</span></a></li>', '<li><a href="privacy.html">隱私政策</a></li>')
    content = content.replace('<li><a href="#"><span data-cms="global.footer.terms">服務條款</span></a></li>', '<li><a href="terms.html">服務條款</a></li>')
    
    content = content.replace('<li><a href="#">隱私政策</a></li>', '<li><a href="privacy.html">隱私政策</a></li>')
    content = content.replace('<li><a href="#">服務條款</a></li>', '<li><a href="terms.html">服務條款</a></li>')
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)
print('Done!')
