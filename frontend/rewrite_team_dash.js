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
    <div className="min-h-screen bg-[#020202] text-green-500 font-mono p-4 md:p-8 pt-24 md:pt-32 relative overflow-hidden flex flex-col items-center">
      
      {/* Background Matrix/Grid */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#003300 1px, transparent 1px), linear-gradient(90deg, #003300 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-[0.03] pointer-events-none mix-blend-screen flex items-center justify-center z-0">
        <Image src="/logo.png" alt="" fill className="object-contain grayscale" />
      </div>

      <div className="w-full max-w-4xl relative z-10 space-y-6">
        
        {/* SEC-OPS HEADER */}
        <header className="border border-green-500/30 bg-black/80 p-6 relative">
          {/* Corner Accents */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-green-500"></div>
          <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-green-500"></div>
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-green-500"></div>
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-green-500"></div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-green-500/30 pb-4 mb-4">
            <div>
              <p className="text-green-700 text-[10px] tracking-widest mb-1">IDENTIFICATION // AUTH</p>
              <h1 className="text-3xl font-bold tracking-widest text-green-400">
                {team.teamName}
              </h1>
            </div>
            <div className="text-left md:text-right">
              <p className="text-green-700 text-[10px] tracking-widest mb-1">SYSTEM_NODE_ID</p>
              <p className="text-green-500 text-xs tracking-widest">{team.teamId}</p>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <span className="text-[10px] text-green-700 bg-green-950/30 px-2 py-1 border border-green-900/50">OP: {team.leaderName}</span>
              <span className="text-[10px] text-green-400 bg-green-900/20 px-2 py-1 border border-green-500/30 animate-pulse">STATUS: SECURE_LINK</span>
            </div>
            <LogoutButton className="text-[10px] text-green-500 hover:text-black hover:bg-green-500 px-3 py-1 border border-green-500 transition-colors uppercase tracking-widest" />
          </div>
        </header>

        {/* TELEMETRY GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* LEFT PANEL: STATS */}
          <div className="md:col-span-1 flex flex-col gap-6">
            <div className="border border-green-500/30 bg-black/80 p-5 relative h-full">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-green-500/50"></div>
              <h2 className="text-green-700 text-[10px] tracking-widest border-b border-green-900/50 pb-2 mb-4 uppercase">Telemetry Data</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-xs text-green-600">RANK</span>
                  <span className="text-xl text-green-400 font-bold">#{teamRank}</span>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-xs text-green-600">SCORE</span>
                  <span className="text-xl text-green-400 font-bold">{team.score}</span>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-xs text-green-600">HINTS_USED</span>
                  <span className="text-xl text-green-400 font-bold">{hintsCount}</span>
                </div>
                <div className="flex justify-between items-end border-t border-green-900/30 pt-4 mt-2">
                  <span className="text-xs text-green-600">UPTIME</span>
                  <span className="text-lg text-green-500">
                    {startTime ? <TimeElapsed startTime={startTime} /> : "00:00:00"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: MAIN OBJECTIVE */}
          <div className="md:col-span-2 flex flex-col gap-6">
            <div className="border border-green-500/30 bg-black/80 p-6 relative flex-1 flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-green-500/50"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-green-500/50"></div>

              <div>
                <h2 className="text-green-700 text-[10px] tracking-widest border-b border-green-900/50 pb-2 mb-6 uppercase flex justify-between">
                  <span>Current Objective</span>
                  <span className="text-green-500 animate-pulse">AWAITING_INPUT</span>
                </h2>
                
                <div className="mb-6 flex items-baseline gap-4">
                  <span className="text-5xl font-bold text-green-400">LVL_{team.currentLevel}</span>
                  <span className="text-green-700 text-sm">/ 50</span>
                </div>

                <div className="mb-8">
                  <div className="flex justify-between text-[10px] mb-2 text-green-600">
                    <span>PROGRESS_MATRIX</span>
                    <span>{progressPercentage}%</span>
                  </div>
                  {/* ASCII Progress Bar Segment */}
                  <div className="w-full bg-black border border-green-900 p-1 flex gap-1 h-6">
                    {Array.from({length: 25}).map((_, i) => {
                      const isActive = i < Math.floor((progressPercentage / 100) * 25);
                      return (
                        <div key={i} className={\`flex-1 \${isActive ? 'bg-green-500 shadow-[0_0_5px_#22c55e]' : 'bg-green-950/30'}\`}></div>
                      )
                    })}
                  </div>
                </div>
              </div>

              <Link href={\`/level/\${team.currentLevel}\`} className="block w-full py-4 text-center border border-green-500 bg-green-500/10 hover:bg-green-500 text-green-500 hover:text-black font-bold tracking-widest uppercase transition-all text-xs">
                > EXECUTE_CHALLENGE.sh
              </Link>
            </div>
          </div>
          
        </div>

        <div className="text-center mt-8">
          <Link href="/leaderboard" className="text-green-700 hover:text-green-400 text-[10px] tracking-[0.2em] uppercase transition-colors">
            [ ACCESS GLOBAL LEADERBOARD ]
          </Link>
        </div>

      </div>
    </div>
  );
}
`;

fs.writeFileSync('src/app/dashboard/page.tsx', content);
console.log("Team dashboard upgraded to raw SecOps terminal style");
