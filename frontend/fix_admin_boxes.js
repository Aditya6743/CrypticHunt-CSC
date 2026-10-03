const fs = require('fs');

let page = fs.readFileSync('src/app/admin/(dashboard)/page.tsx', 'utf8');

// Unify Box 2 (Levels Metric)
page = page.replace(
  'border-t-2 border-t-violet-500 hover:bg-violet-950/10',
  'border-t-2 border-t-cyan-500 hover:bg-cyan-950/10 group'
);
// Unify Box 3 (Leaderboard Control)
page = page.replace(
  'border-t-2 border-t-amber-500 hover:bg-amber-950/10',
  'border-t-2 border-t-cyan-500 hover:bg-cyan-950/10 group'
);
// Unify Box 4 (Event Status)
page = page.replace(
  'border-t-2 border-t-gray-500 hover:bg-gray-900/30',
  'border-t-2 border-t-cyan-500 hover:bg-cyan-950/10 group'
);
// Add group to Box 1
page = page.replace(
  'border-t-2 border-t-cyan-500 hover:bg-cyan-950/10 transition-colors flex',
  'border-t-2 border-t-cyan-500 hover:bg-cyan-950/10 transition-colors flex group'
);

// Fix the button glitch (Ensure smooth transition and proper text color)
// Leaderboard button
page = page.replace(
  /className={\`w-full py-2\.5 text-\[10px\] font-bold tracking-\[0\.2em\] uppercase transition-colors border \${isFrozen \? '[^`]+' : '[^`]+'}\`}/,
  'className={`w-full py-2.5 text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-300 border ${isFrozen ? "bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-[#05070B] border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]" : "bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-[#05070B] border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.2)]"}`}'
);

// Event Status button
page = page.replace(
  /className={\`w-full py-2\.5 text-\[10px\] font-bold tracking-\[0\.2em\] uppercase transition-colors border \${currentStatus === 'LIVE' \? '[^`]+' : '[^`]+'}\`}/,
  'className={`w-full py-2.5 text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-300 border ${currentStatus === "LIVE" ? "bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-[#05070B] border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]" : "bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-[#05070B] border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.2)]"}`}'
);

fs.writeFileSync('src/app/admin/(dashboard)/page.tsx', page);
console.log("Fixed boxes styling and button glitches");
