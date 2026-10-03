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
    <div className="min-h-screen bg-[#030408] text-gray-100 font-sans p-6 md:p-12 pt-28 md:pt-36 relative overflow-hidden">
      
      {/* Absolute Minimalist Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] opacity-[0.02] pointer-events-none mix-blend-screen flex items-center justify-center z-0">
        <Image src="/logo.png" alt="" fill className="object-contain" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10 space-y-8">
        
        {/* Streamlined Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_12px_#22c55e]"></span>
              <span className="text-gray-400 text-xs tracking-[0.2em] uppercase font-mono">System Online // Node: {team.teamId}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">
              {team.teamName}
            </h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right hidden md:block">
              <p className="text-gray-500 text-xs tracking-widest uppercase mb-1">Operator</p>
              <p className="text-gray-300 font-mono text-sm">{team.leaderName}</p>
            </div>
            <div className="h-10 w-[1px] bg-white/10 hidden md:block"></div>
            <LogoutButton className="px-6 py-2.5 text-xs font-bold tracking-widest uppercase text-gray-400 hover:text-white border border-gray-800 hover:border-gray-500 rounded-full transition-colors bg-black" />
          </div>
        </header>

        {/* 2-Column Layout for Breathing Room */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Objective (Takes 2/3 width) */}
          <div className="lg:col-span-2 bg-[#0a0c14] border border-white/5 rounded-3xl p-10 md:p-14 flex flex-col justify-between relative group hover:border-cyan-500/20 transition-all duration-500">
            {/* Soft internal glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none transition-opacity duration-500 opacity-50 group-hover:opacity-100"></div>

            <div>
              <p className="text-cyan-500 text-sm font-bold tracking-widest uppercase mb-4 font-mono">Current Objective</p>
              <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-4">
                Level {team.currentLevel}
                <span className="text-gray-700 font-light text-5xl"> / 50</span>
              </h2>
            </div>

            <div className="mt-16 space-y-12">
              {/* Clean Progress Line */}
              <div>
                <div className="flex justify-between items-end mb-3">
                  <span className="text-gray-500 text-xs tracking-widest uppercase font-bold">Mission Progress</span>
                  <span className="text-cyan-400 font-mono text-lg font-bold">{progressPercentage}%</span>
                </div>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-cyan-600 to-cyan-400 h-full rounded-full transition-all duration-1000" style={{ width: \`\${progressPercentage}%\` }}></div>
                </div>
              </div>

              {/* Action Button */}
              <Link href={\`/level/\${team.currentLevel}\`} className="inline-flex items-center justify-center gap-3 w-full py-5 bg-white text-black hover:bg-cyan-400 font-black tracking-[0.2em] uppercase text-sm rounded-xl transition-all duration-300">
                Proceed to Terminal
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </Link>
            </div>
          </div>

          {/* Telemetry (Takes 1/3 width) */}
          <div className="lg:col-span-1 grid grid-cols-2 lg:grid-cols-1 gap-4 md:gap-6">
            
            <div className="bg-[#0a0c14] border border-white/5 rounded-3xl p-8 hover:bg-[#0c0e18] transition-colors flex flex-col justify-center">
              <p className="text-gray-500 text-xs font-bold tracking-widest uppercase mb-2 font-mono">Total Score</p>
              <p className="text-4xl text-white font-black tracking-tight">{team.score}</p>
            </div>

            <div className="bg-[#0a0c14] border border-white/5 rounded-3xl p-8 hover:bg-[#0c0e18] transition-colors flex flex-col justify-center">
              <p className="text-gray-500 text-xs font-bold tracking-widest uppercase mb-2 font-mono">Global Rank</p>
              <p className="text-4xl text-white font-black tracking-tight">#{teamRank}</p>
            </div>

            <div className="bg-[#0a0c14] border border-white/5 rounded-3xl p-8 hover:bg-[#0c0e18] transition-colors flex flex-col justify-center">
              <p className="text-gray-500 text-xs font-bold tracking-widest uppercase mb-2 font-mono">Hints Deployed</p>
              <p className="text-4xl text-white font-black tracking-tight">{hintsCount}</p>
            </div>

            <div className="bg-[#0a0c14] border border-white/5 rounded-3xl p-8 hover:bg-[#0c0e18] transition-colors flex flex-col justify-center">
              <p className="text-gray-500 text-xs font-bold tracking-widest uppercase mb-2 font-mono">Time Elapsed</p>
              <p className="text-3xl text-white font-black tracking-tight font-mono">
                {startTime ? <TimeElapsed startTime={startTime} /> : "00:00:00"}
              </p>
            </div>

          </div>
        </div>
        
        {/* Footer Link */}
        <div className="text-center pt-8">
          <Link href="/leaderboard" className="text-gray-600 hover:text-white text-xs font-bold tracking-widest uppercase transition-colors">
            [ Access Global Leaderboard ]
          </Link>
        </div>

      </div>
    </div>
  );
}
`;

fs.writeFileSync('src/app/dashboard/page.tsx', content);
console.log("Team dashboard completely un-cluttered and massively improved");
