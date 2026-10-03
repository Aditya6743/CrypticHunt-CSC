const fs = require('fs');

// TEAM DASHBOARD
let teamDash = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');

// Inject ethereal logo into the background
if (!teamDash.includes('Image src="/logo.png"')) {
  teamDash = teamDash.replace(
    'import Link from "next/link";',
    'import Link from "next/link";\nimport Image from "next/image";'
  );
  
  const oldBg = `<div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#05070B 2px, transparent 2px), linear-gradient(90deg, #05070B 2px, transparent 2px)', backgroundSize: '40px 40px', backgroundColor: 'rgba(0, 255, 255, 0.05)' }}></div>`;
  const newBg = `<div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#05070B 1px, transparent 1px), linear-gradient(90deg, #05070B 1px, transparent 1px)', backgroundSize: '20px 20px', backgroundColor: 'rgba(0, 255, 255, 0.05)' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-[0.02] pointer-events-none mix-blend-screen flex items-center justify-center z-0">
        <Image src="/logo.png" alt="" fill className="object-contain" />
      </div>
      
      {/* HUD Borders */}
      <div className="absolute top-6 right-6 text-[10px] font-mono text-cyan-500/30 hidden md:block tracking-widest">SECURE_NODE_ACTIVE</div>
      <div className="absolute bottom-6 left-6 text-[10px] font-mono text-cyan-500/30 hidden md:block tracking-widest">LINK_ESTABLISHED</div>
      <div className="absolute bottom-6 right-6 text-[10px] font-mono text-cyan-500/30 hidden md:block tracking-widest animate-pulse">AWAITING_COMMAND...</div>
  `;
  teamDash = teamDash.replace(oldBg, newBg);
}

// Make the boxes even more glassmorphic
teamDash = teamDash.replace(
  'bg-[#020305]/80 backdrop-blur-xl border border-white/5',
  'bg-[#020305]/40 backdrop-blur-3xl border border-white/5 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]'
);
teamDash = teamDash.replace(
  'bg-[#030509]/80 backdrop-blur-2xl border border-white/10',
  'bg-white/[0.02] backdrop-blur-3xl border border-white/5 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]'
);

fs.writeFileSync('src/app/dashboard/page.tsx', teamDash);


// ADMIN OVERVIEW
let adminDash = fs.readFileSync('src/app/admin/(dashboard)/page.tsx', 'utf8');

// Inject ethereal logo into admin dashboard
if (!adminDash.includes('Image src="/logo.png"')) {
  adminDash = adminDash.replace(
    'import { revalidatePath } from "next/cache";',
    'import { revalidatePath } from "next/cache";\nimport Image from "next/image";'
  );
  
  const adminHeaderOld = `<div className="flex items-center gap-4 mb-10 border-b border-white/5 pb-6">`;
  const adminHeaderNew = `
      {/* Ambient Background */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-[0.02] pointer-events-none mix-blend-screen flex items-center justify-center z-0">
        <Image src="/logo.png" alt="" fill className="object-contain" />
      </div>
      <div className="fixed inset-0 z-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#05070B 1px, transparent 1px), linear-gradient(90deg, #05070B 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
      
      <div className="relative z-10">
      <div className="flex items-center gap-4 mb-10 border-b border-white/5 pb-6 relative">`;
      
  adminDash = adminDash.replace(adminHeaderOld, adminHeaderNew);
  
  // Close the relative z-10 div at the bottom
  adminDash = adminDash.replace(
    '</div>\n  );\n}',
    '</div>\n    </div>\n  );\n}'
  );
}

// Make admin cards ultra-premium glass
adminDash = adminDash.replace(/bg-\[#020305\]\/60 backdrop-blur-md border border-white\/5/g, 'bg-white/[0.02] backdrop-blur-3xl border border-white/5 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]');

fs.writeFileSync('src/app/admin/(dashboard)/page.tsx', adminDash);

console.log("Upgraded dashboards to ultra premium");
