const fs = require('fs');
let content = fs.readFileSync('js/cms.js', 'utf8');

// The footer fields to append to the FIRST index.html schema
const footerFields = `
            , { "group": "頁尾與聯絡資訊 (Footer)", "key": "footer.tagline", "label": "品牌標語 / 鴻匠工程下方介紹", "type": "textarea", "default": "二十年工藝傳承，讓每一個空間都成為值得驕傲的作品。" },
            { "group": "頁尾與聯絡資訊 (Footer)", "key": "footer.phone1", "label": "聯絡電話 1 (主)", "type": "text", "default": "(02) 2345-6789" },
            { "group": "頁尾與聯絡資訊 (Footer)", "key": "footer.phone2", "label": "聯絡電話 2 (手機)", "type": "text", "default": "0912-345-678" },
            { "group": "頁尾與聯絡資訊 (Footer)", "key": "footer.email", "label": "電子郵件", "type": "text", "default": "service@hongjiang.com.tw" },
            { "group": "頁尾與聯絡資訊 (Footer)", "key": "footer.address", "label": "服務區域", "type": "text", "default": "台北・新北・桃園・台中・全台接洽" },
            { "group": "頁尾與聯絡資訊 (Footer)", "key": "footer.hours", "label": "服務時間", "type": "text", "default": "週一至週六 08:00 — 18:00" },
            { "group": "頁尾與聯絡資訊 (Footer)", "key": "footer.copyright", "label": "版權與統一編號", "type": "text", "default": "© 2024 鴻匠工程有限公司 · 統一編號：12345678" }`;

// Append to the first index.html
content = content.replace('"default": "30+ 名師傅"\n            }\n        ]\n    },\n    "service-water.html":', '"default": "30+ 名師傅"\n            }' + footerFields + '\n        ]\n    },\n    "service-water.html":');

// Remove the second index.html
content = content.replace(/,\s*"index\.html":\s*\{\s*"name":\s*"首頁"[\s\S]*?(?=\s*"about\.html":)/, ',');

fs.writeFileSync('js/cms.js', content, 'utf8');
console.log('Fixed cms.js!');
