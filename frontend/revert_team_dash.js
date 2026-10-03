const fs = require('fs');

const content = `import { prisma } from "@/lib/db";
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
    <div className="min-h-screen bg-[#05070B] text-gray-100 font-mono p-4 md:p-8 pt-8 md:pt-12 relative overflow-hidden">
      
      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* Header Reverted to Original Structure but Premium */}
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-[#0a0e17]/80 backdrop-blur-2xl border border-cyan-900/30 p-8 rounded-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
          
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-white tracking-[0.2em] mb-4 uppercase">
              CRYPTIC HUNT
            </h1>
            <div className="space-y-1 text-xs tracking-widest uppercase">
              <p className="text-gray-500">TEAM: <span className="text-white font-bold">{team.teamName}</span></p>
              <p className="text-gray-500">LEADER: <span className="text-gray-300">{team.leaderName}</span></p>
            </div>
          </div>
          
          <div className="text-left md:text-right flex flex-col items-start md:items-end gap-3">
            <p className="text-cyan-400 text-xs tracking-widest font-bold flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              STATUS: ONLINE
            </p>
            <p className="text-[10px] text-gray-500 tracking-widest uppercase mb-1">
              NODE: <span className="text-gray-300">{team.teamId}</span>
            </p>
            <LogoutButton className="px-5 py-2 text-[10px] tracking-widest uppercase text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 transition-colors bg-transparent" />
          </div>
        </header>

        {/* Level Block */}
        <div className="bg-[#0a0e17]/80 backdrop-blur-2xl border border-cyan-900/30 p-8 md:p-10 rounded-sm mb-8 relative overflow-hidden">
          <div className="flex justify-between items-end mb-6 border-b border-cyan-900/30 pb-4">
            <h2 className="text-3xl font-black text-white tracking-widest uppercase">
              LEVEL {team.currentLevel} <span className="text-gray-600">/ 5</span>
            </h2>
            <div className="text-right">
              <span className="text-cyan-400 font-bold text-xl">{progressPercentage}%</span>
              <p className="text-[10px] text-gray-500 tracking-widest uppercase mt-1">COMPLETION</p>
            </div>
          </div>

          {/* Clean Progress Line */}
          <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mt-4">
            <div className="bg-gradient-to-r from-cyan-600 to-cyan-400 h-full transition-all duration-1000" style={{ width: \`\${progressPercentage}%\` }}></div>
          </div>
        </div>

        {/* 4 Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
          <div className="bg-[#0a0e17]/80 backdrop-blur-2xl border border-cyan-900/30 p-6 rounded-sm border-t-2 border-t-cyan-500 flex flex-col justify-between overflow-hidden">
            <p className="text-gray-500 text-[10px] tracking-[0.2em] uppercase mb-4">SCORE</p>
            <p className="text-4xl text-white font-bold">{team.score}</p>
          </div>
          <div className="bg-[#0a0e17]/80 backdrop-blur-2xl border border-cyan-900/30 p-6 rounded-sm border-t-2 border-t-violet-500 flex flex-col justify-between overflow-hidden">
            <p className="text-gray-500 text-[10px] tracking-[0.2em] uppercase mb-4">RANK</p>
            <p className="text-4xl text-white font-bold">#{teamRank}</p>
          </div>
          <div className="bg-[#0a0e17]/80 backdrop-blur-2xl border border-cyan-900/30 p-6 rounded-sm border-t-2 border-t-amber-500 flex flex-col justify-between overflow-hidden">
            <p className="text-gray-500 text-[10px] tracking-[0.2em] uppercase mb-4">HINTS USED</p>
            <p className="text-4xl text-white font-bold">{hintsCount}</p>
          </div>
          <div className="bg-[#0a0e17]/80 backdrop-blur-2xl border border-cyan-900/30 p-6 rounded-sm border-t-2 border-t-gray-500 flex flex-col justify-between overflow-hidden">
            <p className="text-gray-500 text-[10px] tracking-[0.2em] uppercase mb-4">TIME ELAPSED</p>
            <p className="text-2xl md:text-3xl text-white font-bold pt-1">
              {startTime ? <TimeElapsed startTime={startTime} /> : "00:00:00"}
            </p>
          </div>
        </div>

        {/* Big Continue Button */}
        <div className="w-full">
          <Link href={\`/level/\${team.currentLevel}\`} className="block w-full py-4 text-center bg-transparent border border-cyan-500 text-cyan-500 hover:bg-cyan-500 hover:text-black transition-colors">
            <span className="font-bold tracking-[0.2em] uppercase text-sm">
              [ CONTINUE CHALLENGE ]
            </span>
          </Link>
        </div>

        <div className="text-center mt-8">
          <Link href="/leaderboard" className="text-gray-500 hover:text-cyan-400 text-[10px] tracking-[0.2em] uppercase transition-colors">
            ACCESS LEADERBOARD
          </Link>
        </div>

      </div>
    </div>
  );
}
`;

fs.writeFileSync('src/app/dashboard/page.tsx', content);
console.log("Team dashboard reverted and unglitched");
