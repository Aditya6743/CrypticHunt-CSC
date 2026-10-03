const fs = require('fs');

let page = fs.readFileSync('src/app/admin/(dashboard)/page.tsx', 'utf8');

page = page.replace(/hover:text-\[#05070B\]/g, 'hover:text-black');

fs.writeFileSync('src/app/admin/(dashboard)/page.tsx', page);
console.log("Fixed button text compilation issue");
