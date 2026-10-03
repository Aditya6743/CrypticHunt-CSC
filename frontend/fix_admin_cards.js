const fs = require('fs');

let page = fs.readFileSync('src/app/admin/(dashboard)/page.tsx', 'utf8');

// Replace the ultra-glass backgrounds with the cleaner ones
page = page.replace(
  /bg-white\/\[0\.02\] backdrop-blur-3xl border border-white\/5 shadow-\[0_8px_32px_0_rgba\(0,0,0,0\.37\)\]/g, 
  'bg-[#020305]/80 backdrop-blur-md border border-white/5 shadow-xl'
);

// Remove the fading gradient lines at the bottom of the cards (which look like they're cut off)
page = page.replace(
  /<div className="absolute bottom-0 left-0 w-full h-\[2px\] bg-gradient-to-r from-cyan-500 to-transparent"><\/div>/g,
  ''
);
page = page.replace(
  /<div className="absolute bottom-0 left-0 w-full h-\[2px\] bg-gradient-to-r from-violet-500 to-transparent"><\/div>/g,
  ''
);

fs.writeFileSync('src/app/admin/(dashboard)/page.tsx', page);
console.log("Fixed admin cards");
