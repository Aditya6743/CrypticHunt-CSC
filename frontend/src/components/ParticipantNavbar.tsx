import Link from "next/link";
import LogoutButton from "./LogoutButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function ParticipantNavbar({ activePage }: { activePage: string }) {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const team = await prisma.team.findUnique({
    where: { id: (session?.user as any)?.id },
    select: { teamName: true, teamId: true }
  });

  if (!team) return null;

  return (
    <div className="sticky top-0 z-40 w-full bg-[#010204]/90 md:bg-[#030407]/40 supports-[backdrop-filter]:bg-[#010204]/70 md:supports-[backdrop-filter]:bg-transparent backdrop-blur-2xl md:backdrop-blur-lg min-h-[120px] md:min-h-[120px] flex flex-col justify-center border-b border-cyan-900/30 md:border-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.8)] md:shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-4 pb-2 md:py-0">
        <nav className="flex justify-between items-center w-full">
          {/* Desktop Navigation Links */}
          <div className="flex items-center pl-20 md:pl-24 xl:pl-0">
            <div className="hidden md:flex items-center gap-4 lg:gap-6 text-[10px] sm:text-xs font-bold tracking-[0.15em] uppercase text-gray-400">
              <Link href="/dashboard" className={`transition-colors ${activePage === 'dashboard' ? 'text-cyan-400' : 'hover:text-white'}`}>Dashboard</Link>
              <Link href="/leaderboard" className={`transition-colors ${activePage === 'leaderboard' ? 'text-cyan-400' : 'hover:text-white'}`}>Leaderboard</Link>
              <Link href="/rules" className={`transition-colors ${activePage === 'rules' ? 'text-cyan-400' : 'hover:text-white'}`}>Rules</Link>
            </div>
          </div>
          
          {/* Team Info & Logout (Always visible) */}
          <div className="flex items-center gap-4 text-xs font-mono ml-auto">
            <div className="text-right">
              <p className="text-cyan-500 font-bold truncate max-w-[120px] sm:max-w-xs">{team.teamName}</p>
              <p className="text-gray-600 text-[10px] hidden sm:block select-text">{team.teamId}</p>
            </div>
            <LogoutButton className="px-3 py-2 text-[10px] sm:text-xs border border-white/10 hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400 transition-all rounded-sm uppercase tracking-widest whitespace-nowrap" />
          </div>
        </nav>
        
        {/* Mobile Navigation Row (Visible only on small screens) */}
        <div className="md:hidden flex items-center justify-center gap-4 mt-4 text-[10px] font-bold tracking-[0.15em] uppercase text-gray-400">
          <Link href="/dashboard" className={`transition-colors ${activePage === 'dashboard' ? 'text-cyan-400 border-b border-cyan-400 pb-1' : 'hover:text-white pb-1'}`}>Dashboard</Link>
          <Link href="/leaderboard" className={`transition-colors ${activePage === 'leaderboard' ? 'text-cyan-400 border-b border-cyan-400 pb-1' : 'hover:text-white pb-1'}`}>Leaderboard</Link>
          <Link href="/rules" className={`transition-colors ${activePage === 'rules' ? 'text-cyan-400 border-b border-cyan-400 pb-1' : 'hover:text-white pb-1'}`}>Rules</Link>
        </div>
      </div>
    </div>
  );
}
