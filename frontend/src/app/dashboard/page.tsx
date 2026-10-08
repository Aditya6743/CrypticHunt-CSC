import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import TimeRemaining from "@/components/TimeRemaining";
import LiveRefresh from "@/components/LiveRefresh";
import ParticipantNavbar from "@/components/ParticipantNavbar";

export const dynamic = "force-dynamic";

function timeAgo(date: Date) {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
}

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const team = await prisma.team.findUnique({
    where: { id: (session?.user as any)?.id },
    include: { 
      hintUsages: { include: { level: true } },
      progress: { include: { level: true } }
    }
  });
  if (!team) redirect("/login");

  const event = await prisma.event.findFirst();
  const endTime = event?.endTime || null;

  const allLevels = await prisma.level.findMany({
    where: { active: true },
    orderBy: { levelNumber: 'asc' }
  });
  const maxLevels = allLevels.length > 0 ? allLevels[allLevels.length - 1].levelNumber : 1;
  const currentLevelData = allLevels.find(l => l.levelNumber === team.currentLevel) || allLevels[allLevels.length - 1];

  const allTeams = await prisma.team.findMany({
    where: { status: "ACTIVE" },
    orderBy: [
      { score: "desc" },
      { currentLevel: "desc" }
    ],
    include: {
      progress: { orderBy: { completedAt: 'desc' }, take: 1 }
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
  const teamRank = rankIndex !== -1 ? rankIndex + 1 : 0;
  const teamsAhead = rankIndex > 0 ? rankIndex : 0;
  const pointsToNextRank = rankIndex > 0 ? (allTeams[rankIndex - 1].score - team.score) + 1 : 0;

  const progressPercentage = Math.round((Math.min(team.currentLevel - 1, maxLevels) / (maxLevels || 1)) * 100);

  // Compile Recent Activity
  const activities = [
    ...team.progress.map(p => ({
      id: p.id,
      type: 'level',
      text: `Level ${p.level.levelNumber} completed`,
      points: `+${p.pointsAwarded}`,
      date: p.completedAt
    })),
    ...team.hintUsages.map(h => ({
      id: h.id,
      type: 'hint',
      text: `Hint used on Level ${h.level.levelNumber}`,
      points: `-${h.penalty}`,
      date: h.usedAt
    }))
  ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 5);

  // Calculate score graph points
  let runningScore = 0;
  const graphPoints = team.progress.sort((a,b) => a.completedAt.getTime() - b.completedAt.getTime()).map((p, i) => {
    runningScore += p.pointsAwarded;
    return runningScore;
  });
  if (graphPoints.length === 0) graphPoints.push(0);
  const maxGraphScore = Math.max(...graphPoints, 10); // avoid div by 0

  return (
    <>
      <LiveRefresh interval={15000} />
      <div className="min-h-screen bg-[#030407] text-gray-200 font-sans selection:bg-cyan-500/30 pb-20 relative">
      
      {/* Background Ambience (Subtle) */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'radial-gradient(rgba(6, 182, 212, 0.15) 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }}></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-cyan-900/10 rounded-full blur-[150px]"></div>
      </div>

      {/* Top Navbar */}
            <ParticipantNavbar activePage="dashboard" />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        
        {/* Welcome Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-light text-white mb-2 tracking-tight">Welcome back, <span className="font-bold text-cyan-400">{team.teamName}</span></h1>
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase">
              <span className="flex items-center justify-center w-2 h-2 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_8px_#06b6d4]"></span>
              <span className="text-cyan-500">LIVE EVENT</span>
            </div>
          </div>
          <div className="w-full sm:w-auto text-center sm:text-right bg-white/5 border border-white/10 px-6 py-3 rounded-sm flex flex-col items-center sm:items-end">
            <span className="text-2xl font-mono font-light text-white tracking-tight">
              {endTime ? <TimeRemaining endTime={endTime} haltedAt={event?.haltedAt} isLive={event?.status === "LIVE"} /> : "--:--:--"}
            </span>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">TIME REMAINING</span>
          </div>
        </header>

        {/* Current Mission Card */}
        <div className="bg-gradient-to-br from-[#0a0e17] to-[#05070b] border border-cyan-900/40 rounded-lg p-6 sm:p-10 shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-center md:items-stretch gap-8">
          {/* Background subtle glow */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
          
          <div className="flex-1 relative z-10 flex flex-col justify-between">
            {team.currentLevel > maxLevels ? (
              <>
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-2 py-1 bg-green-950/50 border border-green-900 text-green-400 text-[10px] font-mono tracking-widest uppercase rounded-sm">MISSION ACCOMPLISHED</span>
                  </div>
                  <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-2 uppercase">ALL PROTOCOLS DECRYPTED</h2>
                  <div className="flex items-center gap-4 text-sm font-mono text-gray-400">
                    <span>AWAIT FINAL RESULTS</span>
                  </div>
                </div>
                <div className="mt-8">
                  <div className="inline-flex items-center justify-center px-10 py-4 bg-gray-800 text-gray-500 font-black uppercase tracking-[0.2em] text-sm rounded-sm cursor-not-allowed">
                    HUNT COMPLETED
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-2 py-1 bg-cyan-950/50 border border-cyan-900 text-cyan-400 text-[10px] font-mono tracking-widest uppercase rounded-sm">CURRENT MISSION</span>
                    <span className="px-2 py-1 bg-white/5 border border-white/10 text-gray-300 text-[10px] font-mono tracking-widest uppercase rounded-sm">LEVEL {team.currentLevel} / {maxLevels}</span>
                  </div>
                  <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-2 uppercase">{currentLevelData?.title || "UNKNOWN PROTOCOL"}</h2>
                  <div className="flex items-center gap-4 text-sm font-mono text-gray-400">
                    <span>{currentLevelData?.category || "CLASSIFIED"}</span>
                    <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                    <span className="text-cyan-500 font-bold">+{currentLevelData?.points || 0} PTS</span>
                  </div>
                </div>
                
                <div className="mt-8">
                  <Link href={`/level/${team.currentLevel}`} className="inline-flex items-center justify-center px-10 py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase tracking-[0.2em] text-sm transition-all rounded-sm shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] hover:-translate-y-0.5">
                    CONTINUE CHALLENGE &rarr;
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* Right side progress visualization */}
          <div className="w-full md:w-64 flex flex-col items-center justify-center relative z-10 bg-black/20 p-6 rounded-lg border border-white/5">
            <div className="relative flex items-center justify-center w-32 h-32 mb-4">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                <circle cx="50" cy="50" r="45" fill="none" stroke="#06b6d4" strokeWidth="6" strokeDasharray="283" strokeDashoffset={283 - (283 * progressPercentage) / 100} className="transition-all duration-1000 ease-out" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-light text-white">{progressPercentage}%</span>
              </div>
            </div>
            <div className="text-center font-mono text-xs text-gray-500">
              <p className="text-gray-300 font-bold">{team.currentLevel - 1} COMPLETED</p>
              <p>{maxLevels - (team.currentLevel - 1)} REMAINING</p>
            </div>
          </div>
        </div>

        {/* Level Progression Map */}
        <div className="bg-white/[0.02] border border-white/5 rounded-lg p-6 overflow-hidden">
          <h3 className="text-xs font-bold text-gray-500 tracking-[0.2em] uppercase mb-6 font-mono">MISSION MAP</h3>
          <div className="flex items-center gap-2 overflow-x-auto pt-4 pb-8 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent px-4 -mx-4">
            {allLevels.map((l, idx) => {
              const isCompleted = l.levelNumber < team.currentLevel;
              const isCurrent = l.levelNumber === team.currentLevel;
              const isBoss = idx === allLevels.length - 1;

              let stateClasses = "bg-white/5 border-white/10 text-gray-600"; // Locked
              if (isCompleted) stateClasses = "bg-cyan-900/30 border-cyan-700 text-cyan-400";
              if (isCurrent) stateClasses = "bg-cyan-500 border-cyan-400 text-black shadow-[0_0_15px_rgba(6,182,212,0.5)]";
              if (isBoss && !isCompleted && !isCurrent) stateClasses = "bg-red-900/20 border-red-900/50 text-red-500/50";

              return (
                <div key={l.id} className="flex items-center flex-shrink-0">
                  <div className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg border ${stateClasses} transition-all relative group`}>
                    <span className="font-mono text-sm font-bold">{l.levelNumber}</span>
                    {isCompleted && <span className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-500 rounded-full border border-black"></span>}
                    {isCurrent && <span className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full border border-cyan-500 animate-ping"></span>}
                    {isBoss && <span className="absolute -bottom-4 text-[8px] font-bold text-red-500 uppercase tracking-widest whitespace-nowrap">FINAL BOSS</span>}
                  </div>
                  {idx < allLevels.length - 1 && (
                    <div className={`w-6 h-[2px] mx-1 ${isCompleted ? 'bg-cyan-700' : 'bg-white/5'}`}></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Grid Layout for Stats and Details */}
        <div className="space-y-6">
          
          {/* Statistics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div className="bg-[#0a0e17] border border-white/5 p-5 rounded-lg flex flex-col justify-between">
              <span className="text-[10px] font-bold text-cyan-600 tracking-[0.2em] uppercase font-mono mb-2 flex items-center gap-2">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                SCORE
              </span>
              <span className="text-3xl font-light text-white tracking-tight">{team.score}</span>
            </div>
            <div className="bg-[#0a0e17] border border-white/5 p-5 rounded-lg flex flex-col justify-between">
              <span className="text-[10px] font-bold text-purple-500 tracking-[0.2em] uppercase font-mono mb-2 flex items-center gap-2">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                RANK
              </span>
              <span className="text-3xl font-light text-white tracking-tight">#{teamRank}</span>
            </div>
            <div className="bg-[#0a0e17] border border-white/5 p-5 rounded-lg flex flex-col justify-between">
              <span className="text-[10px] font-bold text-green-500 tracking-[0.2em] uppercase font-mono mb-2 flex items-center gap-2">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                SOLVED
              </span>
              <span className="text-3xl font-light text-white tracking-tight">{team.currentLevel - 1}</span>
            </div>
            <div className="bg-[#0a0e17] border border-white/5 p-5 rounded-lg flex flex-col justify-between">
              <span className="text-[10px] font-bold text-amber-500 tracking-[0.2em] uppercase font-mono mb-2 flex items-center gap-2">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                HINTS
              </span>
              <span className="text-3xl font-light text-white tracking-tight">{team.hintUsages.length}</span>
            </div>
          </div>

          {/* Performance and Activity Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            
            {/* Performance Section */}
            <div className="bg-[#0a0e17] border border-white/5 rounded-lg p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-gray-500 tracking-[0.2em] uppercase mb-6 font-mono">PERFORMANCE METRICS</h3>
                
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Score Graph (CSS Bar approximation) */}
                  <div className="flex-1">
                    <p className="text-[10px] text-gray-500 mb-4 font-mono tracking-widest">SCORE PROGRESSION</p>
                    <div className="h-24 flex items-end gap-1 overflow-hidden border-b border-white/10 pb-1">
                      {graphPoints.map((score, idx) => {
                        const heightPct = (score / maxGraphScore) * 100;
                        return (
                          <div key={idx} className="flex-1 bg-cyan-900/40 rounded-t-sm relative group hover:bg-cyan-500 transition-colors" style={{ height: `${Math.max(5, heightPct)}%` }}>
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-black text-xs font-mono px-1 rounded transition-opacity">{score}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Rank Details */}
                  <div className="w-full md:w-48 flex flex-col gap-4 justify-center">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span className="text-xs font-mono text-gray-500">TEAMS AHEAD</span>
                      <span className="text-sm font-bold text-white">{teamsAhead}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span className="text-xs font-mono text-gray-500">NEXT RANK</span>
                      <span className="text-sm font-bold text-cyan-400">#{teamRank > 1 ? teamRank - 1 : 1}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span className="text-xs font-mono text-gray-500">PTS NEEDED</span>
                      <span className="text-sm font-bold text-white">+{pointsToNextRank}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Recent Activity */}
            <div className="bg-[#0a0e17] border border-white/5 rounded-lg p-6 flex flex-col">
              <h3 className="text-xs font-bold text-gray-500 tracking-[0.2em] uppercase mb-4 font-mono">RECENT ACTIVITY</h3>
              {activities.length === 0 ? (
                <p className="text-xs font-mono text-gray-600 py-4">NO RECENT ACTIVITY</p>
              ) : (
                <div className="space-y-4 flex-1">
                  {activities.map((act, i) => (
                    <div key={i} className="flex justify-between items-start text-xs font-mono border-b border-white/5 last:border-0 pb-3 last:pb-0">
                      <div>
                        <p className={act.type === 'level' ? 'text-green-400' : 'text-amber-500'}>{act.text}</p>
                        <p className="text-[9px] text-gray-600 mt-1">{timeAgo(act.date)}</p>
                      </div>
                      <span className={act.type === 'level' ? 'text-green-400 font-bold' : 'text-red-400 font-bold'}>{act.points}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Full Leaderboard Button */}
          <Link href="/leaderboard" className="block w-full text-center py-5 bg-[#0a0e17] hover:bg-cyan-900/20 border border-white/5 hover:border-cyan-500/50 text-sm font-bold font-mono text-gray-400 hover:text-cyan-400 transition-all duration-300 rounded-lg uppercase tracking-[0.2em] shadow-lg hover:shadow-[0_0_20px_rgba(6,182,212,0.2)]">
            ACCESS LEADERBOARD &rarr;
          </Link>
          
        </div>
      </main>
    </div>
    </>
  );
}
