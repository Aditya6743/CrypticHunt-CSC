const fs = require('fs');

// 1. Remove SYSTEM.NODE from Admin Layout
let layout = fs.readFileSync('src/app/admin/(dashboard)/layout.tsx', 'utf8');
layout = layout.replace('<div className="text-[10px] text-cyan-500 font-mono tracking-[0.3em] uppercase mb-2">SYSTEM.NODE</div>\n        ', '');
fs.writeFileSync('src/app/admin/(dashboard)/layout.tsx', layout);

// 2. Remove rotating spinner from Admin Overview
let overview = fs.readFileSync('src/app/admin/(dashboard)/page.tsx', 'utf8');
const spinnerString = `        <div className="w-12 h-12 bg-cyan-950/30 border border-cyan-500/30 flex items-center justify-center rounded-sm">
          <div className="w-6 h-6 border-2 border-cyan-400 rounded-sm border-t-transparent animate-spin"></div>
        </div>\n`;
overview = overview.replace(spinnerString, '');
fs.writeFileSync('src/app/admin/(dashboard)/page.tsx', overview);

console.log("Removed extra UI elements");
