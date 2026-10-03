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
    include: { hintUsages: true, progress: { orderBy: { completedAt: 'desc' }, take: 5, include: { level: true } } }
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
    <div className="min-h-screen bg-[#030712] text-slate-300 font-sans p-4 md:p-8 pt-24 md:pt-28 relative selection:bg-cyan-500/30">
      {/* Dynamic Background */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-cyan-900/20 to-transparent pointer-events-none blur-3xl opacity-50"></div>
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
      
      <div className="w-full max-w-6xl mx-auto relative z-10 space-y-6">
        
        {/* Top Navbar Header */}
        <header className="flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-4 px-6 rounded-2xl shadow-2xl">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 p-[1px]">
              <div className="w-full h-full bg-slate-950 rounded-xl flex items-center justify-center">
                <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-blue-500">
                  {team.teamName.charAt(0)}
                </span>
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-wide">{team.teamName}</h1>
              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]"></div> NETWORK_SECURE</span>
                <span>|</span>
                <span>ID: {team.teamId}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center gap-2 text-sm text-slate-400 bg-slate-950/50 px-4 py-2 rounded-lg border border-slate-800">
              <svg className="w-4 h-4 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              <span>{team.leaderName}</span>
            </div>
            <LogoutButton className="text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg transition-all" />
          </div>
        </header>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column (Main Stats & Progress) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Primary Action Card */}
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none transition-opacity group-hover:opacity-100 opacity-50"></div>
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 relative z-10">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                    <p className="text-cyan-400 text-xs font-bold tracking-widest uppercase">Active Protocol</p>
                  </div>
                  <h2 className="text-5xl font-black text-white tracking-tight drop-shadow-sm">
                    LEVEL {team.currentLevel} <span className="text-slate-600 font-light text-4xl">/ 50</span>
                  </h2>
                </div>
                <Link href={\`/level/\${team.currentLevel}\`} className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold tracking-widest uppercase rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] w-full md:w-auto">
                  Execute 
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </Link>
              </div>
              
              <div className="relative z-10">
                <div className="flex justify-between text-xs font-bold text-slate-400 mb-3 tracking-widest uppercase">
                  <span>System Decryption</span>
                  <span className="text-cyan-400">{progressPercentage}%</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-slate-800 shadow-inner">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 relative" 
                    style={{ width: \`\${progressPercentage}%\` }}
                  >
                    <div className="absolute top-0 right-0 bottom-0 w-20 bg-gradient-to-r from-transparent to-white/30"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* 4 Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Rank */}
              <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-5 rounded-2xl flex flex-col justify-between hover:bg-slate-800/50 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center mb-4 border border-amber-500/20">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
                </div>
                <p className="text-slate-500 text-xs font-bold tracking-widest uppercase mb-1">Global Rank</p>
                <p className="text-3xl text-white font-bold font-mono tracking-tight">#{teamRank}</p>
              </div>

              {/* Score */}
              <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-5 rounded-2xl flex flex-col justify-between hover:bg-slate-800/50 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4 border border-emerald-500/20">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                </div>
                <p className="text-slate-500 text-xs font-bold tracking-widest uppercase mb-1">Total Score</p>
                <p className="text-3xl text-white font-bold font-mono tracking-tight">{team.score}</p>
              </div>

              {/* Time */}
              <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-5 rounded-2xl flex flex-col justify-between hover:bg-slate-800/50 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4 border border-blue-500/20">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <p className="text-slate-500 text-xs font-bold tracking-widest uppercase mb-1">Time Elapsed</p>
                <p className="text-2xl text-white font-bold font-mono tracking-tight pt-1">
                  {startTime ? <TimeElapsed startTime={startTime} /> : "00:00:00"}
                </p>
              </div>

              {/* Hints */}
              <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-5 rounded-2xl flex flex-col justify-between hover:bg-slate-800/50 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-violet-500/10 text-violet-500 flex items-center justify-center mb-4 border border-violet-500/20">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
                </div>
                <p className="text-slate-500 text-xs font-bold tracking-widest uppercase mb-1">Hints Used</p>
                <p className="text-3xl text-white font-bold font-mono tracking-tight">{hintsCount}</p>
              </div>
            </div>

          </div>

          {/* Right Column (Activity Log / Secondary Actions) */}
          <div className="lg:col-span-1 space-y-6 flex flex-col">
            
            {/* Leaderboard Quick Access */}
            <Link href="/leaderboard" className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-6 rounded-3xl flex items-center justify-between hover:bg-slate-800 transition-all group">
              <div>
                <h3 className="text-white font-bold text-lg mb-1">Leaderboard</h3>
                <p className="text-slate-500 text-xs">View global rankings</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-black transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
              </div>
            </Link>

            {/* Activity Log */}
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-6 rounded-3xl flex-1 flex flex-col">
              <h3 className="text-slate-400 text-xs font-bold tracking-widest uppercase border-b border-slate-800 pb-4 mb-4">
                Recent Decryptions
              </h3>
              
              <div className="flex-1 space-y-4">
                {team.progress && team.progress.length > 0 ? (
                  team.progress.map((prog, idx) => (
                    <div key={idx} className="flex gap-4 items-start relative">
                      {idx !== team.progress.length - 1 && (
                        <div className="absolute top-6 left-1.5 w-[2px] h-full bg-slate-800"></div>
                      )}
                      <div className="w-3 h-3 rounded-full bg-cyan-500/20 border-2 border-cyan-500 mt-1.5 shrink-0 z-10"></div>
                      <div>
                        <p className="text-white text-sm font-bold">Level {prog.level.levelNumber} Unlocked</p>
                        <p className="text-slate-500 text-xs font-mono mt-1">
                          +{prog.pointsAwarded} PTS • {new Date(prog.completedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-slate-600 text-sm py-8 font-mono">
                    NO_ACTIVITY_DETECTED
                  </div>
                )}
              </div>
            </div>

          </div>
          
        </div>
      </div>
    </div>
  );
}
`;

fs.writeFileSync('src/app/dashboard/page.tsx', content);
console.log("Team dashboard upgraded to ultimate cyber style");
