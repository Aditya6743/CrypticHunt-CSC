import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import TimeElapsed from "@/components/TimeElapsed";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const team = await prisma.team.findUnique({
    where: { id: session.user.id },
    include: { hintUsages: true }
  });

  if (!team) redirect("/login");

  const event = await prisma.event.findFirst();
  const startTime = event?.startTime || null;
  const hintsCount = team.hintUsages.length;

  const allTeams = await prisma.team.findMany({
    where: { status: "ACTIVE" },
    orderBy: [
      { score: "desc" },
      { currentLevel: "desc" }
    ],
    include: {
      progress: {
        orderBy: { completedAt: 'desc' },
        take: 1
      }
    }
  });

  allTeams.sort((a, b) => {
    if (a.score === b.score && a.currentLevel === b.currentLevel) {
      const aTime = a.progress[0]?.completedAt?.getTime() || 0;
      const bTime = b.progress[0]?.completedAt?.getTime() || 0;
      return aTime - bTime;
    }
    return 0;
  });

  const rankIndex = allTeams.findIndex(t => t.id === team.id);
  const teamRank = rankIndex !== -1 ? rankIndex + 1 : "--";
  const progressPercentage = Math.round(((team.currentLevel - 1) / 5) * 100);

  return (
    <div className="min-h-screen bg-[#05070B] text-gray-100 font-mono p-4 md:p-8 pt-12 md:pt-16 relative overflow-hidden flex flex-col items-center">
      
      {/* Background ambient light (no shadow classes) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-cyan-900/10 blur-[100px] pointer-events-none rounded-full"></div>
      
      <div className="relative z-10 w-full max-w-5xl">
        
        {/* Superior Header */}
        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-cyan-900/50 pb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="w-2 h-2 bg-cyan-500 animate-pulse"></span>
              <p className="text-cyan-500 text-[10px] tracking-[0.3em] uppercase font-bold">Secure Connection Established</p>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-[0.15em] mb-4 uppercase">
              CRYPTIC <span className="text-cyan-500">HUNT</span>
            </h1>
            <div className="flex flex-col gap-1 text-xs tracking-widest uppercase">
              <p className="text-gray-500">OPERATIVE: <span className="text-gray-200 font-bold">{team.leaderName}</span></p>
              <p className="text-gray-500">DESIGNATION: <span className="text-cyan-400 font-bold">{team.teamName}</span></p>
            </div>
          </div>
          
          <div className="text-left md:text-right flex flex-col items-start md:items-end gap-4 w-full md:w-auto">
            <div className="bg-cyan-950/30 border border-cyan-900/50 px-4 py-3 rounded-sm w-full md:w-auto">
              <p className="text-[10px] text-gray-500 tracking-widest uppercase mb-1">NETWORK ID</p>
              <p className="text-xs text-gray-300 font-mono tracking-widest">{team.teamId}</p>
            </div>
            <LogoutButton className="text-[10px] tracking-[0.2em] uppercase text-gray-500 hover:text-cyan-400 transition-colors" />
          </div>
        </header>

        {/* Level Progress Block (Premium Focus) */}
        <div className="bg-[#0a0e17]/80 backdrop-blur-md border border-cyan-900/30 p-8 md:p-12 rounded-sm mb-8 relative overflow-hidden">
          {/* Subtle accent line */}
          <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500"></div>

          <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 mb-8">
            <div>
              <p className="text-cyan-500 text-xs tracking-[0.2em] uppercase mb-2">CURRENT DIRECTIVE</p>
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-widest uppercase">
                LEVEL {team.currentLevel} <span className="text-cyan-900/50 font-light">/ 5</span>
              </h2>
            </div>
            <div className="text-left md:text-right">
              <span className="text-cyan-400 font-light text-4xl">{progressPercentage}%</span>
              <p className="text-[10px] text-gray-500 tracking-[0.2em] uppercase mt-1">COMPLETION STATUS</p>
            </div>
          </div>

          {/* Premium Segmented-look Progress Line */}
          <div className="w-full h-1.5 bg-gray-900 overflow-hidden flex">
            <div className="bg-cyan-500 h-full transition-all duration-1000 ease-out" style={{ width: `${progressPercentage}%` }}></div>
          </div>
        </div>

        {/* 4 Stats Grid - Uniform Blue/Cyan theme */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          
          <div className="bg-[#0a0e17]/80 backdrop-blur-md border border-cyan-900/30 p-6 rounded-sm border-t-2 border-t-cyan-500 flex flex-col justify-between">
            <p className="text-cyan-600 text-[10px] tracking-[0.2em] uppercase font-bold mb-4">/// SCORE</p>
            <p className="text-4xl text-white font-light tracking-tight">{team.score}</p>
          </div>
          
          <div className="bg-[#0a0e17]/80 backdrop-blur-md border border-cyan-900/30 p-6 rounded-sm border-t-2 border-t-cyan-500 flex flex-col justify-between">
            <p className="text-cyan-600 text-[10px] tracking-[0.2em] uppercase font-bold mb-4">/// RANK</p>
            <p className="text-4xl text-white font-light tracking-tight">#{teamRank}</p>
          </div>
          
          <div className="bg-[#0a0e17]/80 backdrop-blur-md border border-cyan-900/30 p-6 rounded-sm border-t-2 border-t-cyan-500 flex flex-col justify-between">
            <p className="text-cyan-600 text-[10px] tracking-[0.2em] uppercase font-bold mb-4">/// HINTS DECRYPTED</p>
            <p className="text-4xl text-white font-light tracking-tight">{hintsCount}</p>
          </div>
          
          <div className="bg-[#0a0e17]/80 backdrop-blur-md border border-cyan-900/30 p-6 rounded-sm border-t-2 border-t-cyan-500 flex flex-col justify-between">
            <p className="text-cyan-600 text-[10px] tracking-[0.2em] uppercase font-bold mb-4">/// UPTIME</p>
            <p className="text-3xl text-white font-light tracking-tight pt-1">
              {startTime ? <TimeElapsed startTime={startTime} /> : "00:00:00"}
            </p>
          </div>
          
        </div>

        {/* Continue Action Button */}
        <div className="flex justify-center mb-12">
          <Link href={`/level/${team.currentLevel}`} className="w-full md:w-auto inline-block px-12 py-5 bg-cyan-950/20 border border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-[#05070B] transition-colors text-center group">
            <span className="font-bold tracking-[0.2em] uppercase text-sm flex items-center justify-center gap-3">
              {">"} INITIATE_PROTOCOL( {team.currentLevel} )
              <span className="w-2 h-4 bg-cyan-400 group-hover:bg-[#05070B] animate-pulse"></span>
            </span>
          </Link>
        </div>

        {/* Footer Link */}
        <div className="text-center pb-8 border-t border-cyan-900/30 pt-8">
          <Link href="/leaderboard" className="text-gray-600 hover:text-cyan-400 text-xs tracking-[0.2em] uppercase transition-colors">
            [ ACCESS GLOBAL LEADERBOARD ]
          </Link>
        </div>

      </div>
    </div>
  );
}
