const fs = require('fs');

const content = `import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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
  const progressPercentage = Math.round(((team.currentLevel - 1) / 50) * 100);

  return (
    <div className="min-h-screen bg-[#05070B] text-gray-100 font-mono p-4 md:p-8 pt-24 md:pt-32 relative overflow-hidden">
      
      {/* Background Logo (No grid or mesh) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-[0.03] pointer-events-none mix-blend-screen flex items-center justify-center z-0">
        <Image src="/logo.png" alt="" fill className="object-contain" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Header Reverted to Original Structure but Premium */}
        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-[#0a0e17]/80 backdrop-blur-2xl border border-cyan-900/30 p-8 rounded-sm shadow-[0_0_40px_rgba(6,182,212,0.05)] relative overflow-hidden">
          {/* Subtle top edge highlight */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
          
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-white tracking-[0.2em] mb-4">
              CRYPTIC HUNT
            </h1>
            <div className="space-y-1 text-xs tracking-widest uppercase">
              <p className="text-gray-500">TEAM: <span className="text-white font-bold">{team.teamName}</span></p>
              <p className="text-gray-500">LEADER: <span className="text-gray-300">{team.leaderName}</span></p>
              <p className="text-gray-500">EMAIL: <span className="text-gray-300">{team.leaderEmail}</span></p>
            </div>
          </div>
          
          <div className="text-left md:text-right flex flex-col items-start md:items-end gap-3">
            <p className="text-cyan-400 text-xs tracking-widest font-bold flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]"></span>
              STATUS: ONLINE
            </p>
            <p className="text-[10px] text-gray-500 tracking-widest uppercase mb-1">
              NODE ID: <span className="text-gray-300">{team.teamId}</span>
            </p>
            <LogoutButton className="px-5 py-2 text-[10px] tracking-widest uppercase text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 transition-colors bg-black/50" />
          </div>
        </header>

        {/* Level Block */}
        <div className="bg-[#0a0e17]/80 backdrop-blur-2xl border border-cyan-900/30 p-8 md:p-10 rounded-sm shadow-[0_0_40px_rgba(6,182,212,0.05)] mb-8 relative">
          <div className="flex justify-between items-end mb-6 border-b border-cyan-900/30 pb-4">
            <h2 className="text-3xl font-black text-white tracking-widest uppercase drop-shadow-md">
              LEVEL {team.currentLevel} <span className="text-gray-600">/ 50</span>
            </h2>
            <div className="text-right">
              <span className="text-cyan-400 font-bold text-xl">{progressPercentage}%</span>
              <p className="text-[10px] text-gray-500 tracking-widest uppercase mt-1">COMPLETION</p>
            </div>
          </div>

          {/* Solid Segmented Progress Bar */}
          <div className="w-full bg-black border border-cyan-900/50 p-1 flex gap-1 h-4 mb-2">
            {Array.from({length: 25}).map((_, i) => {
              const isActive = i < Math.floor((progressPercentage / 100) * 25);
              return (
                <div key={i} className={\`flex-1 \${isActive ? 'bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]' : 'bg-cyan-950/20'}\`}></div>
              )
            })}
          </div>
        </div>

        {/* 4 Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
          <div className="bg-[#0a0e17]/80 backdrop-blur-2xl border border-cyan-900/30 p-5 rounded-sm border-t-2 border-t-cyan-500 hover:bg-cyan-950/10 transition-colors">
            <p className="text-gray-500 text-[10px] tracking-[0.2em] uppercase mb-2">SCORE</p>
            <p className="text-3xl text-white font-bold drop-shadow-md">{team.score}</p>
          </div>
          <div className="bg-[#0a0e17]/80 backdrop-blur-2xl border border-cyan-900/30 p-5 rounded-sm border-t-2 border-t-violet-500 hover:bg-violet-950/10 transition-colors">
            <p className="text-gray-500 text-[10px] tracking-[0.2em] uppercase mb-2">RANK</p>
            <p className="text-3xl text-white font-bold drop-shadow-md">#{teamRank}</p>
          </div>
          <div className="bg-[#0a0e17]/80 backdrop-blur-2xl border border-cyan-900/30 p-5 rounded-sm border-t-2 border-t-amber-500 hover:bg-amber-950/10 transition-colors">
            <p className="text-gray-500 text-[10px] tracking-[0.2em] uppercase mb-2">HINTS USED</p>
            <p className="text-3xl text-white font-bold drop-shadow-md">{hintsCount}</p>
          </div>
          <div className="bg-[#0a0e17]/80 backdrop-blur-2xl border border-cyan-900/30 p-5 rounded-sm border-t-2 border-t-gray-500 hover:bg-gray-900/30 transition-colors">
            <p className="text-gray-500 text-[10px] tracking-[0.2em] uppercase mb-2">TIME ELAPSED</p>
            <p className="text-2xl text-white font-bold drop-shadow-md pt-1">
              {startTime ? <TimeElapsed startTime={startTime} /> : "00:00:00"}
            </p>
          </div>
        </div>

        {/* Big Continue Button */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-violet-500 rounded-sm blur opacity-40 group-hover:opacity-75 transition duration-500"></div>
          <Link href={\`/level/\${team.currentLevel}\`} className="relative block w-full py-5 text-center bg-[#05070B] border border-cyan-500/30 group-hover:bg-cyan-500 transition-all duration-300">
            <span className="text-cyan-400 group-hover:text-black font-black tracking-[0.3em] uppercase text-sm drop-shadow-md transition-colors">
              [ CONTINUE CHALLENGE ]
            </span>
          </Link>
        </div>

        <div className="text-center mt-12">
          <Link href="/leaderboard" className="text-gray-500 hover:text-cyan-400 text-xs tracking-[0.2em] uppercase transition-colors">
            ACCESS LEADERBOARD
          </Link>
        </div>

      </div>
    </div>
  );
}
`;

fs.writeFileSync('src/app/dashboard/page.tsx', content);
console.log("Reverted dashboard to original premium structure");
