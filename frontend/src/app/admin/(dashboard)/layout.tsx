import Link from 'next/link';
import LogoutButton from '@/components/LogoutButton';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#030408] text-gray-100 font-sans flex selectable">
      <aside className="relative w-52 border-r border-white/5 bg-[#05070B] flex flex-col hidden md:flex">
        
        {/* Massive padding top to completely clear the global CSC logo */}
        <nav className="flex-1 px-4 space-y-2 pt-36">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-3.5 rounded-2xl hover:bg-white/5 text-gray-400 hover:text-white transition-colors group">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/20 group-hover:bg-cyan-400 transition-colors"></div>
            <span className="text-xs font-bold tracking-widest uppercase">Overview</span>
          </Link>
          <Link href="/admin/levels" className="flex items-center gap-3 px-3 py-3.5 rounded-2xl hover:bg-white/5 text-gray-400 hover:text-white transition-colors group">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/20 group-hover:bg-cyan-400 transition-colors"></div>
            <span className="text-xs font-bold tracking-widest uppercase">Manage Levels</span>
          </Link>
          <Link href="/admin/teams" className="flex items-center gap-3 px-3 py-3.5 rounded-2xl hover:bg-white/5 text-gray-400 hover:text-white transition-colors group">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/20 group-hover:bg-cyan-400 transition-colors"></div>
            <span className="text-xs font-bold tracking-widest uppercase">Manage Teams</span>
          </Link>
        </nav>

        <div className="p-6 pb-10">
          <LogoutButton className="w-full text-center px-4 py-3.5 text-xs font-bold tracking-widest uppercase border border-white/5 text-gray-500 hover:bg-white/5 hover:text-white transition-colors rounded-2xl" />
        </div>
      </aside>
      
      <main className="flex-1 overflow-y-auto relative">
        {children}
      </main>
    </div>
  );
}
