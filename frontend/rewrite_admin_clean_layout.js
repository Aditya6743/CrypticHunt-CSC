const fs = require('fs');

const content = `import Link from 'next/link';
import LogoutButton from '@/components/LogoutButton';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#050505] text-gray-200 font-sans flex selectable">
      <aside className="relative w-64 border-r border-white/10 bg-[#0a0a0a] flex flex-col hidden md:flex">
        
        <nav className="flex-1 p-4 space-y-2 pt-12">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
            <span className="text-sm font-medium">Overview</span>
          </Link>
          <Link href="/admin/levels" className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
            <span className="text-sm font-medium">Manage Levels</span>
          </Link>
          <Link href="/admin/teams" className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
            <span className="text-sm font-medium">Manage Teams</span>
          </Link>
        </nav>
        <div className="p-6 border-t border-white/10">
          <LogoutButton className="w-full text-center px-4 py-2.5 text-sm font-medium border border-white/10 text-gray-400 hover:bg-white/5 hover:text-white transition-colors rounded-lg" />
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
`;

fs.writeFileSync('src/app/admin/(dashboard)/layout.tsx', content);
console.log("Admin layout upgraded to modern sleek SaaS style");
