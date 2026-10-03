const fs = require('fs');

let layout = fs.readFileSync('src/app/admin/(dashboard)/layout.tsx', 'utf8');

const oldSidebar = `<aside className="w-64 border-r border-cyan-900/30 bg-[#020305] flex flex-col hidden md:flex">
        <nav className="flex-1 p-4 pt-32 space-y-2">
          <Link href="/admin" className="block px-4 py-3 rounded-sm hover:bg-cyan-900/20 text-gray-400 hover:text-cyan-400 transition-colors">Overview</Link>
          <Link href="/admin/levels" className="block px-4 py-3 rounded-sm hover:bg-cyan-900/20 text-gray-400 hover:text-cyan-400 transition-colors">Manage Levels</Link>
          <Link href="/admin/teams" className="block px-4 py-3 rounded-sm hover:bg-cyan-900/20 text-gray-400 hover:text-cyan-400 transition-colors">Manage Teams</Link>
        </nav>
        <div className="p-4 border-t border-cyan-900/30">
          <LogoutButton />
        </div>
      </aside>`;

const newSidebar = `<aside className="relative w-64 border-r border-white/5 bg-[#020305]/80 backdrop-blur-xl flex flex-col hidden md:flex overflow-hidden">
        <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-transparent via-cyan-500/50 to-transparent"></div>
        <div className="p-8 pt-12 border-b border-white/5">
          <div className="text-[10px] text-cyan-500 font-mono tracking-[0.3em] uppercase mb-2">SYSTEM.NODE</div>
          <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 tracking-widest">ADMIN_OS</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2 mt-4">
          <Link href="/admin" className="group flex items-center gap-3 px-4 py-3 rounded-sm hover:bg-white/5 border border-transparent hover:border-white/10 text-gray-400 hover:text-white transition-all">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-700 group-hover:bg-cyan-400 group-hover:shadow-[0_0_8px_#22d3ee] transition-all"></span>
            <span className="text-xs font-bold tracking-widest uppercase">Overview</span>
          </Link>
          <Link href="/admin/levels" className="group flex items-center gap-3 px-4 py-3 rounded-sm hover:bg-white/5 border border-transparent hover:border-white/10 text-gray-400 hover:text-white transition-all">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-700 group-hover:bg-violet-400 group-hover:shadow-[0_0_8px_#a78bfa] transition-all"></span>
            <span className="text-xs font-bold tracking-widest uppercase">Manage Levels</span>
          </Link>
          <Link href="/admin/teams" className="group flex items-center gap-3 px-4 py-3 rounded-sm hover:bg-white/5 border border-transparent hover:border-white/10 text-gray-400 hover:text-white transition-all">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-700 group-hover:bg-emerald-400 group-hover:shadow-[0_0_8px_#34d399] transition-all"></span>
            <span className="text-xs font-bold tracking-widest uppercase">Manage Teams</span>
          </Link>
        </nav>
        <div className="p-6 border-t border-white/5 bg-black/20">
          <LogoutButton className="w-full text-center px-4 py-3 text-[10px] font-bold tracking-widest uppercase border border-red-900/30 text-red-500 hover:bg-red-950/40 hover:text-red-400 hover:border-red-500/50 transition-all rounded-sm" />
        </div>
      </aside>`;

layout = layout.replace(oldSidebar, newSidebar);
fs.writeFileSync('src/app/admin/(dashboard)/layout.tsx', layout);
console.log("Admin layout upgraded");
