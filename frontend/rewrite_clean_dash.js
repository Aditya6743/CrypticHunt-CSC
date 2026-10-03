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

  const progressPercentage = Math.round(((team.currentLevel - 1) / 50) * 100);

  return (
    <div className="min-h-screen bg-[#050505] text-gray-200 font-sans p-4 md:p-8 pt-24 md:pt-32 relative">
      {/* Very subtle dotted background */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
      
      <div className="w-full max-w-5xl mx-auto relative z-10 space-y-8">
        
        {/* Header section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-[#0a0a0a] border border-white/10 p-8 rounded-2xl shadow-xl">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-cyan-950/30 border border-cyan-500/20 flex items-center justify-center">
              <span className="text-2xl font-black text-cyan-500 tracking-tighter">{team.teamName.charAt(0)}</span>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-1">
                {team.teamName}
              </h1>
              <div className="flex items-center gap-3 text-sm text-gray-500 font-mono">
                <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div> ONLINE</span>
                <span>•</span>
                <span>ID: {team.teamId}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-start md:items-end gap-3 w-full md:w-auto">
            <div className="text-sm text-gray-400 bg-white/5 px-4 py-2 rounded-full border border-white/5">
              Operator: <span className="text-white font-medium">{team.leaderName}</span>
            </div>
            <LogoutButton className="text-xs font-semibold text-gray-400 hover:text-white transition-colors" />
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-2xl flex flex-col justify-between hover:border-cyan-500/30 transition-colors">
            <p className="text-gray-500 text-xs font-medium tracking-wider uppercase mb-4">Rank</p>
            <p className="text-4xl text-white font-semibold font-mono">#{teamRank}</p>
          </div>
          <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-2xl flex flex-col justify-between hover:border-cyan-500/30 transition-colors">
            <p className="text-gray-500 text-xs font-medium tracking-wider uppercase mb-4">Score</p>
            <p className="text-4xl text-white font-semibold font-mono">{team.score}</p>
          </div>
          <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-2xl flex flex-col justify-between hover:border-cyan-500/30 transition-colors">
            <p className="text-gray-500 text-xs font-medium tracking-wider uppercase mb-4">Hints Used</p>
            <p className="text-4xl text-white font-semibold font-mono">{hintsCount}</p>
          </div>
          <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-2xl flex flex-col justify-between hover:border-cyan-500/30 transition-colors">
            <p className="text-gray-500 text-xs font-medium tracking-wider uppercase mb-4">Time Elapsed</p>
            <p className="text-2xl md:text-3xl text-white font-semibold font-mono">
              {startTime ? <TimeElapsed startTime={startTime} /> : "00:00:00"}
            </p>
          </div>
        </div>

        {/* Level Progress */}
        <div className="bg-[#0a0a0a] border border-white/10 p-8 md:p-10 rounded-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
            <div>
              <p className="text-cyan-500 text-sm font-medium tracking-widest uppercase mb-2">Current Challenge</p>
              <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                Level {team.currentLevel} <span className="text-gray-600 font-light">/ 50</span>
              </h2>
            </div>
            <div className="text-left md:text-right">
              <span className="text-2xl font-mono font-medium text-white">{progressPercentage}%</span>
              <p className="text-gray-500 text-xs font-medium tracking-widest uppercase mt-1">COMPLETED</p>
            </div>
          </div>
          
          <div className="w-full bg-white/5 rounded-full h-3 mb-10 overflow-hidden border border-white/5">
            <div 
              className="bg-cyan-500 h-full rounded-full transition-all duration-1000 ease-out" 
              style={{ width: \`\${progressPercentage}%\` }}
            ></div>
          </div>

          <Link href={\`/level/\${team.currentLevel}\`} className="flex items-center justify-center w-full py-5 bg-white text-black hover:bg-gray-200 font-bold tracking-widest uppercase rounded-xl transition-all duration-200">
            Continue Challenge →
          </Link>
        </div>

        <div className="text-center mt-8">
          <Link href="/leaderboard" className="text-gray-500 hover:text-white text-sm font-medium transition-colors">
            View Leaderboard
          </Link>
        </div>

      </div>
    </div>
  );
}
`;

fs.writeFileSync('src/app/dashboard/page.tsx', content);
console.log("Team dashboard upgraded to modern sleek SaaS style");
