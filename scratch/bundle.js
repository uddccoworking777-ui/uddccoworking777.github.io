const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const pages = [
  'index.html',
  'about.html',
  'contact.html',
  'gallery.html',
  'service-water.html',
  'service-interior.html',
  'service-design.html',
  'service-maintenance.html'
];

function build() {
  let mainJs = '';
  let styleCss = '';
  
  if (fs.existsSync(path.join(ROOT, 'js', 'main.js'))) {
    mainJs = fs.readFileSync(path.join(ROOT, 'js', 'main.js'), 'utf8');
  }
  if (fs.existsSync(path.join(ROOT, 'css', 'style.css'))) {
    styleCss = fs.readFileSync(path.join(ROOT, 'css', 'style.css'), 'utf8');
  }

  // We will use index.html as the shell
  let shellHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  
  const dom = new JSDOM(shellHtml);
  const doc = dom.window.document;
  
  // Replace links with inline styles
  doc.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
    if (link.href && link.href.includes('style.css')) {
      const style = doc.createElement('style');
      style.textContent = styleCss;
      link.replaceWith(style);
    }
  });

  // Remove scripts
  doc.querySelectorAll('script').forEach(s => s.remove());

  // Prepare a container for all pages
  const body = doc.body;
  // Clear the body but save the header and footer if they are shared.
  // Actually, each page has its own header and footer in this project.
  // We can just wrap the body content of each page in a div.
  
  // Clear shell body
  body.innerHTML = '';
  
  pages.forEach((pageName, idx) => {
    if (!fs.existsSync(path.join(ROOT, pageName))) return;
    
    let pageHtml = fs.readFileSync(path.join(ROOT, pageName), 'utf8');
    let pDom = new JSDOM(pageHtml);
    let pDoc = pDom.window.document;
    
    let wrapper = doc.createElement('div');
    wrapper.id = 'page-' + pageName.replace('.html', '');
    wrapper.className = 'page-wrapper';
    wrapper.style.display = idx === 0 ? 'block' : 'none';
    
    // Move all body children to wrapper
    while(pDoc.body.firstChild) {
      wrapper.appendChild(pDoc.body.firstChild);
    }
    
    body.appendChild(wrapper);
  });
  
  // Inject Router script
  const routerScript = doc.createElement('script');
  routerScript.textContent = `
    document.addEventListener('DOMContentLoaded', () => {
      function navigate(target) {
        if(!target) return;
        const pageId = 'page-' + target.replace('.html', '');
        const targetEl = document.getElementById(pageId);
        if(targetEl) {
          document.querySelectorAll('.page-wrapper').forEach(el => el.style.display = 'none');
          targetEl.style.display = 'block';
          window.scrollTo(0,0);
        }
      }

      document.body.addEventListener('click', (e) => {
        const a = e.target.closest('a');
        if (a && a.getAttribute('href') && !a.getAttribute('href').startsWith('http') && !a.getAttribute('href').startsWith('tel:') && !a.getAttribute('href').startsWith('mailto:')) {
          let href = a.getAttribute('href');
          if (href.includes('#')) href = href.split('#')[0];
          if (href && href.endsWith('.html')) {
            e.preventDefault();
            navigate(href);
            history.pushState({page: href}, '', '#' + href);
          }
        }
      });
      
      window.addEventListener('popstate', (e) => {
        if(e.state && e.state.page) {
           navigate(e.state.page);
        } else if(location.hash) {
           navigate(location.hash.substring(1));
        } else {
           navigate('index.html');
        }
      });
      
      if(location.hash) {
        navigate(location.hash.substring(1));
      }
    });
    
    // Main JS
    ${mainJs}
  `;
  body.appendChild(routerScript);
  
  // Output
  const outPath = path.join(ROOT, 'hj-website-demo.html');
  fs.writeFileSync(outPath, dom.serialize());
  console.log('Bundled into hj-website-demo.html');
}

build();
