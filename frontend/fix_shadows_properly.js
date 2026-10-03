const fs = require('fs');

let page = fs.readFileSync('src/app/admin/(dashboard)/page.tsx', 'utf8');

// Strip all shadows literally
page = page.replace(/shadow-\[0_0_40px_rgba\(6,182,212,0\.05\)\]/g, '');
page = page.replace(/shadow-\[0_0_8px_#f59e0b\]/g, '');
page = page.replace(/shadow-\[0_0_8px_#22c55e\]/g, '');
page = page.replace(/shadow-\[0_0_8px_#ef4444\]/g, '');
page = page.replace(/drop-shadow-md/g, '');

// Clean up any double spaces left behind
page = page.replace(/  +/g, ' ');

fs.writeFileSync('src/app/admin/(dashboard)/page.tsx', page);
console.log("Properly stripped all shadows");
