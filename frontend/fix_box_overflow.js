const fs = require('fs');

let page = fs.readFileSync('src/app/admin/(dashboard)/page.tsx', 'utf8');

// Add overflow-hidden to the boxes to guarantee no visual bleed
page = page.replace(
  /className="bg-\[#0a0e17\]\/80 backdrop-blur-2xl border border-cyan-900\/30 p-6 rounded-sm shadow-\[0_0_40px_rgba\(6,182,212,0\.05\)\] border-t-2 border-t-cyan-500 hover:bg-cyan-950\/10 transition-colors flex group flex-col justify-between"/,
  'className="bg-[#0a0e17]/80 backdrop-blur-2xl border border-cyan-900/30 p-6 rounded-sm shadow-[0_0_40px_rgba(6,182,212,0.05)] border-t-2 border-t-cyan-500 hover:bg-cyan-950/10 transition-colors flex group flex-col justify-between overflow-hidden"'
);

page = page.replace(
  /className="bg-\[#0a0e17\]\/80 backdrop-blur-2xl border border-cyan-900\/30 p-6 rounded-sm shadow-\[0_0_40px_rgba\(6,182,212,0\.05\)\] border-t-2 border-t-cyan-500 hover:bg-cyan-950\/10 group transition-colors flex flex-col justify-between"/g,
  'className="bg-[#0a0e17]/80 backdrop-blur-2xl border border-cyan-900/30 p-6 rounded-sm shadow-[0_0_40px_rgba(6,182,212,0.05)] border-t-2 border-t-cyan-500 hover:bg-cyan-950/10 transition-colors flex flex-col justify-between overflow-hidden group"'
);

// Reduce button letter-spacing slightly and remove brackets to save width
page = page.replace(/\[ {isFrozen \? "UNFREEZE BOARD" : "FREEZE BOARD"} \]/g, '{isFrozen ? "UNFREEZE BOARD" : "FREEZE BOARD"}');
page = page.replace(/\[ {currentStatus === "LIVE" \? "HALT EVENT" : "INITIATE EVENT"} \]/g, '{currentStatus === "LIVE" ? "HALT EVENT" : "INITIATE EVENT"}');

page = page.replace(/tracking-\[0\.2em\]/g, 'tracking-widest');

fs.writeFileSync('src/app/admin/(dashboard)/page.tsx', page);
console.log("Fixed overflow bleed");
