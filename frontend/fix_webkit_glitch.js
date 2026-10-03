const fs = require('fs');

let page = fs.readFileSync('src/app/admin/(dashboard)/page.tsx', 'utf8');

// Remove card shadows
page = page.replace(/shadow-\[0_0_40px_rgba\(6,182,212,0\.05\)\] /g, '');

// Remove dot shadows
page = page.replace(/shadow-\[0_0_8px_#f59e0b\] /g, '');
page = page.replace(/shadow-\[0_0_8px_#22c55e\] /g, '');
page = page.replace(/shadow-\[0_0_8px_#ef4444\] /g, '');

// Remove text drop shadows
page = page.replace(/drop-shadow-md /g, '');

fs.writeFileSync('src/app/admin/(dashboard)/page.tsx', page);
console.log("Removed all CSS shadows to fix WebKit bleeding");
