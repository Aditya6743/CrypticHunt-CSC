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
    <div className="sticky top-0 z-40 w-full bg-[#030407]/40 backdrop-blur-lg min-h-[120px] flex items-center border-b border-white/5 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <nav className="flex flex-col md:flex-row justify-between items-center gap-4 w-full">
        <div className="flex items-center gap-8 pl-16 md:pl-24 xl:pl-0">
          <div className="hidden lg:flex items-center gap-6 text-xs font-bold tracking-[0.15em] uppercase text-gray-400">
            <Link href="/dashboard" className={`transition-colors ${activePage === 'dashboard' ? 'text-cyan-400' : 'hover:text-white'}`}>Dashboard</Link>
            <Link href="/leaderboard" className={`transition-colors ${activePage === 'leaderboard' ? 'text-cyan-400' : 'hover:text-white'}`}>Leaderboard</Link>
            <Link href="/rules" className={`transition-colors ${activePage === 'rules' ? 'text-cyan-400' : 'hover:text-white'}`}>Rules</Link>
          </div>
        </div>
        <div className="flex items-center gap-6 text-xs font-mono">
          <div className="hidden sm:block text-right">
            <p className="text-cyan-500 font-bold">{team.teamName}</p>
            <p className="text-gray-600 text-[10px]">{team.teamId}</p>
          </div>
          <LogoutButton className="px-4 py-2 border border-white/10 hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400 transition-all rounded-sm uppercase tracking-widest" />
        </div>
      </nav>
      </div>
    </div>
  );
}
