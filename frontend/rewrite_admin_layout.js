const fs = require('fs');

const content = `import Link from 'next/link';
import LogoutButton from '@/components/LogoutButton';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#020202] text-green-500 font-mono flex selectable">
      <aside className="relative w-64 border-r border-green-500/30 bg-black flex flex-col hidden md:flex">
        
        <nav className="flex-1 p-4 space-y-2 pt-28">
          <Link href="/admin" className="group flex items-center gap-3 px-4 py-3 hover:bg-green-900/20 border border-transparent hover:border-green-500/30 text-green-700 hover:text-green-400 transition-colors">
            <span className="text-xs font-bold tracking-widest uppercase">> Overview</span>
          </Link>
          <Link href="/admin/levels" className="group flex items-center gap-3 px-4 py-3 hover:bg-green-900/20 border border-transparent hover:border-green-500/30 text-green-700 hover:text-green-400 transition-colors">
            <span className="text-xs font-bold tracking-widest uppercase">> Manage Levels</span>
          </Link>
          <Link href="/admin/teams" className="group flex items-center gap-3 px-4 py-3 hover:bg-green-900/20 border border-transparent hover:border-green-500/30 text-green-700 hover:text-green-400 transition-colors">
            <span className="text-xs font-bold tracking-widest uppercase">> Manage Teams</span>
          </Link>
        </nav>
        <div className="p-6 border-t border-green-500/30 bg-green-950/10">
          <LogoutButton className="w-full text-center px-4 py-2 text-[10px] font-bold tracking-widest uppercase border border-green-900/50 text-green-600 hover:bg-green-500 hover:text-black hover:border-green-500 transition-colors" />
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
`;

fs.writeFileSync('src/app/admin/(dashboard)/layout.tsx', content);
console.log("Admin layout upgraded to raw SecOps terminal style");
