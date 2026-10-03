const fs = require('fs');

const content = `import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Image from "next/image";

async function toggleFreezeState(formData: FormData) {
  "use server";
  const newStatus = formData.get("freeze") === "true";
  const event = await prisma.event.findFirst();
  if (event) {
    await prisma.event.update({ where: { id: event.id }, data: { leaderboardFrozen: newStatus } });
  }
  revalidatePath("/admin");
  revalidatePath("/leaderboard");
}

async function toggleEventState(formData: FormData) {
  "use server";
  const newStatus = formData.get("status") as string;
  const event = await prisma.event.findFirst();
  if (event) {
    const updateData = { status: newStatus };
    if (newStatus === "LIVE" && !event.startTime) {
      updateData.startTime = new Date();
    }
    await prisma.event.update({ where: { id: event.id }, data: updateData });
  } else {
    await prisma.event.create({ 
      data: { 
        status: newStatus, 
        startTime: newStatus === "LIVE" ? new Date() : null 
      } 
    });
  }
  revalidatePath("/admin");
}

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") redirect("/admin/login");

  const teamsCount = await prisma.team.count({ where: { status: "ACTIVE" } });
  const levelsCount = await prisma.level.count({ where: { active: true } });
  
  const event = await prisma.event.findFirst();
  const currentStatus = event?.status || "NOT_STARTED";
  const isFrozen = event?.leaderboardFrozen || false;

  return (
    <div className="min-h-screen bg-[#05070B] text-gray-100 font-mono p-4 md:p-8 pt-24 md:pt-32 relative overflow-hidden">
      
      {/* Background Logo (No grid or mesh) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-[0.03] pointer-events-none mix-blend-screen flex items-center justify-center z-0">
        <Image src="/logo.png" alt="" fill className="object-contain" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Original Style Header but Premium */}
        <div className="flex items-center gap-4 mb-10 border-b border-cyan-900/30 pb-6 relative">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
          <div>
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-white tracking-[0.2em] uppercase drop-shadow-md">
              EVENT OVERVIEW
            </h1>
            <p className="text-[10px] text-gray-500 tracking-widest uppercase mt-2">
              Global Command & Control
            </p>
          </div>
        </div>

        {/* 4-Column Grid Layout (Like the very first time) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          
          {/* Teams Metric */}
          <div className="bg-[#0a0e17]/80 backdrop-blur-2xl border border-cyan-900/30 p-6 rounded-sm shadow-[0_0_40px_rgba(6,182,212,0.05)] border-t-2 border-t-cyan-500 hover:bg-cyan-950/10 transition-colors flex flex-col justify-between">
            <h3 className="text-gray-500 text-[10px] tracking-[0.2em] uppercase mb-4">REGISTERED TEAMS</h3>
            <p className="text-4xl text-white font-bold drop-shadow-md">{teamsCount}</p>
          </div>

          {/* Levels Metric */}
          <div className="bg-[#0a0e17]/80 backdrop-blur-2xl border border-cyan-900/30 p-6 rounded-sm shadow-[0_0_40px_rgba(6,182,212,0.05)] border-t-2 border-t-violet-500 hover:bg-violet-950/10 transition-colors flex flex-col justify-between">
            <h3 className="text-gray-500 text-[10px] tracking-[0.2em] uppercase mb-4">ACTIVE LEVELS</h3>
            <p className="text-4xl text-white font-bold drop-shadow-md">{levelsCount} <span className="text-2xl text-gray-700 font-normal">/ 50</span></p>
          </div>

          {/* Leaderboard Control */}
          <div className="bg-[#0a0e17]/80 backdrop-blur-2xl border border-cyan-900/30 p-6 rounded-sm shadow-[0_0_40px_rgba(6,182,212,0.05)] border-t-2 border-t-amber-500 hover:bg-amber-950/10 transition-colors flex flex-col justify-between">
            <div>
              <h3 className="text-gray-500 text-[10px] tracking-[0.2em] uppercase mb-4 flex justify-between items-center">
                LEADERBOARD
                <span className={\`w-2 h-2 rounded-full \${isFrozen ? 'bg-amber-500 shadow-[0_0_8px_#f59e0b]' : 'bg-green-500 shadow-[0_0_8px_#22c55e] animate-pulse'}\`}></span>
              </h3>
              <p className="text-2xl text-white font-bold drop-shadow-md mb-6">
                {isFrozen ? 'FROZEN' : 'ACTIVE'}
              </p>
            </div>
            <form action={toggleFreezeState} className="mt-auto">
              <input type="hidden" name="freeze" value={isFrozen ? "false" : "true"} />
              <button type="submit" className={\`w-full py-2.5 text-[10px] font-bold tracking-[0.2em] uppercase transition-colors border \${isFrozen ? 'bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-black border-amber-500/50' : 'bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-black border-green-500/50'}\`}>
                [ {isFrozen ? "UNFREEZE BOARD" : "FREEZE BOARD"} ]
              </button>
            </form>
          </div>

          {/* Global Event Control */}
          <div className="bg-[#0a0e17]/80 backdrop-blur-2xl border border-cyan-900/30 p-6 rounded-sm shadow-[0_0_40px_rgba(6,182,212,0.05)] border-t-2 border-t-gray-500 hover:bg-gray-900/30 transition-colors flex flex-col justify-between">
            <div>
              <h3 className="text-gray-500 text-[10px] tracking-[0.2em] uppercase mb-4 flex justify-between items-center">
                EVENT STATUS
                <span className={\`w-2 h-2 rounded-full \${currentStatus === 'LIVE' ? 'bg-green-500 shadow-[0_0_8px_#22c55e] animate-pulse' : 'bg-red-500 shadow-[0_0_8px_#ef4444]'}\`}></span>
              </h3>
              <p className="text-2xl text-white font-bold drop-shadow-md mb-6">
                {currentStatus === "LIVE" ? "LIVE" : "STOPPED"}
              </p>
            </div>
            <form action={toggleEventState} className="mt-auto">
              <input type="hidden" name="status" value={currentStatus === "LIVE" ? "NOT_STARTED" : "LIVE"} />
              <button type="submit" className={\`w-full py-2.5 text-[10px] font-bold tracking-[0.2em] uppercase transition-colors border \${currentStatus === 'LIVE' ? 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-black border-red-500/50' : 'bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-black border-green-500/50'}\`}>
                [ {currentStatus === "LIVE" ? "HALT EVENT" : "INITIATE EVENT"} ]
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
`;

fs.writeFileSync('src/app/admin/(dashboard)/page.tsx', content);
console.log("Reverted admin dashboard to original premium structure");
