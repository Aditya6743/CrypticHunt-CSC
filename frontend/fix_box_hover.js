const fs = require('fs');

let page = fs.readFileSync('src/app/admin/(dashboard)/page.tsx', 'utf8');

// Remove hover states and groups from the 4 metric boxes
page = page.replace(/hover:bg-cyan-950\/10 transition-colors flex flex-col justify-between overflow-hidden group/g, 'flex flex-col justify-between overflow-hidden');
page = page.replace(/hover:bg-cyan-950\/10 transition-colors flex group flex-col justify-between overflow-hidden/g, 'flex flex-col justify-between overflow-hidden');

fs.writeFileSync('src/app/admin/(dashboard)/page.tsx', page);
console.log("Removed hover states from boxes");
