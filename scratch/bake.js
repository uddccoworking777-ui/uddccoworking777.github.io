const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const htmlFiles = [
  'index.html',
  'about.html',
  'contact.html',
  'gallery.html',
  'service-water.html',
  'service-interior.html',
  'service-design.html',
  'service-maintenance.html'
];

async function bake() {
  for (const file of htmlFiles) {
    const filePath = path.join(ROOT, file);
    if (!fs.existsSync(filePath)) continue;
    
    console.log('Baking', file);
    let htmlContent = fs.readFileSync(filePath, 'utf8');
    
    // Remove main.js temporarily so it doesn't execute in JSDOM
    htmlContent = htmlContent.replace(/<script[^>]*src="[^"]*main\.js"[^>]*><\/script>/gi, '');
    // Also remove cms.js so it doesn't execute in JSDOM implicitly if we inject it directly
    // Actually we WANT cms.js to execute in JSDOM.
    
    const dom = new JSDOM(htmlContent, {
      runScripts: "dangerously",
      resources: "usable",
      url: "http://localhost/" + file
    });

    // Wait for CMS to finish applying (it uses DOMContentLoaded or runs immediately)
    await new Promise(resolve => setTimeout(resolve, 500));

    const document = dom.window.document;
    
    // Remove cms.js from the final DOM
    const scripts = document.querySelectorAll('script');
    scripts.forEach(s => {
      if (s.src && s.src.includes('cms.js')) {
        s.remove();
      }
    });

    // Serialize
    let finalHtml = dom.serialize();
    
    // Put back main.js before </body>
    if (finalHtml.includes('</body>')) {
      finalHtml = finalHtml.replace('</body>', '  <script src="js/main.js"></script>\n</body>');
    } else {
      finalHtml += '<script src="js/main.js"></script>';
    }

    fs.writeFileSync(filePath, finalHtml);
    console.log('Finished baking', file);
  }
}

bake().catch(console.error);
