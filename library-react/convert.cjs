const fs = require('fs');
const path = require('path');

// 1. Copy script.js to public/script.js and patch it
let scriptContent = fs.readFileSync(path.join('..', 'script.js'), 'utf8');
scriptContent = scriptContent.replace("if(getEl('loginId')){", "window.initLogin = function() {\n  if(!getEl('loginId')) return;");
// find the closing brace for that block, which ends with "});\n}"
scriptContent = scriptContent.replace("    });\n  });\n}", "    });\n  });\n};");
// Note: patching regex or simple replace is safer. 
// Just wrapping the whole block:
// since I don't know exact lines, I will just append `window.initLogin = function() { ... ` logic manually or replace it.
// Actually, it's easier to just let script.js be, but manually trigger the same code in Login.jsx.
fs.writeFileSync(path.join('public', 'script.js'), fs.readFileSync(path.join('..', 'script.js'), 'utf8'));

// Inject into index.html
let idx = fs.readFileSync('index.html', 'utf8');
if (!idx.includes('script.js')) {
    idx = idx.replace('</head>', '  <script src="/script.js"></script>\n</head>');
    // We should also ensure font awesome and fonts are there.
    if (!idx.includes('font-awesome')) {
        idx = idx.replace('</head>', '  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />\n</head>');
    }
    fs.writeFileSync('index.html', idx);
}

// 2. Generate Pages
const pages = ['login', 'admin', 'student', 'faculty', 'librarian'];

pages.forEach(page => {
  const htmlPath = path.join('..', `${page}.html`);
  if (!fs.existsSync(htmlPath)) return;
  
  const content = fs.readFileSync(htmlPath, 'utf8');
  let bodyMatch = content.match(/<body([^>]*)>([\s\S]*?)<\/body>/i);
  if (!bodyMatch) return;
  
  let bodyAttrs = bodyMatch[1];
  let innerHtml = bodyMatch[2];
  
  let bodyClass = '';
  const classMatch = bodyAttrs.match(/class="([^"]+)"/);
  if (classMatch) {
    bodyClass = classMatch[1];
  }
  
  // Remove scripts
  innerHtml = innerHtml.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Escape backticks and dollars
  innerHtml = innerHtml.replace(/`/g, '\\`').replace(/\$/g, '\\$');
  
  const compName = page.charAt(0).toUpperCase() + page.slice(1);
  
  let jsx = `import React, { useEffect } from 'react';\n\nconst ${compName} = () => {\n  useEffect(() => {\n`;
  jsx += `    document.body.className = '${bodyClass}';\n`;
  if(page === 'login') {
    jsx += `    // In vanilla it runs inline, we need to trigger it
    setTimeout(() => {
        if(window.seedData) window.seedData();
        const rem = window.DB?.get('remember');
        if(rem) {
            const idEl = document.getElementById('loginId');
            const pwEl = document.getElementById('loginPw');
            if(idEl) idEl.value = rem.id || '';
            if(pwEl) pwEl.value = rem.pw || '';
            const remMe = document.getElementById('rememberMe');
            if(remMe) remMe.checked = true;
        }
        
        // Emulate the script bindings that were lost
        const pwEl = document.getElementById('loginPw');
        if(pwEl) pwEl.addEventListener('keydown', e => { if(e.key==='Enter' && window.doLogin) window.doLogin(); });
        
        const idEl = document.getElementById('loginId');
        if(idEl) idEl.addEventListener('keydown', e => { if(e.key==='Enter' && pwEl) pwEl.focus(); });
        
        document.querySelectorAll('.role-opt').forEach(opt => {
            opt.addEventListener('click', function() {
                document.querySelectorAll('.role-opt').forEach(o => o.classList.remove('active'));
                this.classList.add('active');
                this.querySelector('input').checked = true;
            });
        });
        
        // Floating books init
        const fb = document.getElementById('floatingBooks');
        if(fb && fb.children.length === 0){
            const emojis=['📚','📖','📗','📘','📙','✏️','🎓','🔖'];
            for(let i=0;i<14;i++){
              const d=document.createElement('div'); d.className='fb';
              d.textContent=emojis[Math.floor(Math.random()*emojis.length)];
              d.style.cssText=\`left:\${Math.random()*100}%;animation-duration:\${Math.random()*18+12}s;animation-delay:\${Math.random()*14}s;font-size:\${Math.random()*18+12}px\`;
              fb.appendChild(d);
            }
        }
    }, 100);
`;
  } else {
    jsx += `    if (window.initDashboard) {\n      setTimeout(() => window.initDashboard('${page}'), 50);\n    }\n`;
  }
  jsx += `    return () => { document.body.className = ''; };\n  }, []);\n\n`;
  
  jsx += `  return (\n    <div dangerouslySetInnerHTML={{ __html: \`${innerHtml}\` }} />\n  );\n};\n\nexport default ${compName};\n`;
  
  fs.writeFileSync(path.join('src', 'pages', `${compName}.jsx`), jsx);
});
console.log('Conversion successful!');
