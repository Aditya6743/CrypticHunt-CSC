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
    <div className="p-8 md:p-14 pt-24 md:pt-32 relative min-h-screen">
      
      {/* Absolute Minimalist Background Watermark */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] opacity-[0.02] pointer-events-none mix-blend-screen flex items-center justify-center z-0">
        <Image src="/logo.png" alt="" fill className="object-contain" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10 space-y-12">
        
        {/* Streamlined Header */}
        <header className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-2.5 h-2.5 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_12px_#06b6d4]"></span>
            <span className="text-gray-400 text-xs tracking-[0.2em] uppercase font-mono">Global Telemetry // Secure Admin</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight">
            Overview
          </h1>
        </header>

        {/* 2x2 Grid Layout for Airy Premium Feel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Teams Metric */}
          <div className="bg-[#0a0c14] border border-white/5 p-10 md:p-14 rounded-3xl flex flex-col justify-between hover:border-cyan-500/20 transition-all duration-500 group">
            <h3 className="text-gray-500 text-sm font-bold tracking-widest uppercase mb-6 font-mono">Registered Teams</h3>
            <p className="text-7xl text-white font-black tracking-tighter">{teamsCount}</p>
          </div>

          {/* Levels Metric */}
          <div className="bg-[#0a0c14] border border-white/5 p-10 md:p-14 rounded-3xl flex flex-col justify-between hover:border-cyan-500/20 transition-all duration-500 group">
            <h3 className="text-gray-500 text-sm font-bold tracking-widest uppercase mb-6 font-mono">Active Levels</h3>
            <p className="text-7xl text-white font-black tracking-tighter">{levelsCount} <span className="text-4xl text-gray-700 font-light">/ 50</span></p>
          </div>

          {/* Leaderboard Control */}
          <div className="bg-[#0a0c14] border border-white/5 p-10 md:p-14 rounded-3xl flex flex-col justify-between hover:border-cyan-500/20 transition-all duration-500 group">
            <div>
              <h3 className="text-gray-500 text-sm font-bold tracking-widest uppercase mb-6 font-mono flex justify-between items-center">
                Leaderboard
                <span className={\`w-2.5 h-2.5 rounded-full \${isFrozen ? 'bg-amber-500 shadow-[0_0_12px_#f59e0b]' : 'bg-emerald-500 shadow-[0_0_12px_#10b981] animate-pulse'}\`}></span>
              </h3>
              <p className="text-5xl text-white font-black tracking-tighter mb-10">
                {isFrozen ? 'Frozen' : 'Active'}
              </p>
            </div>
            <form action={toggleFreezeState} className="mt-auto">
              <input type="hidden" name="freeze" value={isFrozen ? "false" : "true"} />
              <button type="submit" className="w-full py-5 px-6 bg-white text-black hover:bg-gray-200 text-sm font-black tracking-[0.2em] uppercase rounded-xl transition-all duration-300">
                {isFrozen ? "Unfreeze Board" : "Freeze Board"}
              </button>
            </form>
          </div>

          {/* Global Event Control */}
          <div className="bg-[#0a0c14] border border-white/5 p-10 md:p-14 rounded-3xl flex flex-col justify-between hover:border-cyan-500/20 transition-all duration-500 group">
            <div>
              <h3 className="text-gray-500 text-sm font-bold tracking-widest uppercase mb-6 font-mono flex justify-between items-center">
                Event Status
                <span className={\`w-2.5 h-2.5 rounded-full \${currentStatus === 'LIVE' ? 'bg-emerald-500 shadow-[0_0_12px_#10b981] animate-pulse' : 'bg-red-500 shadow-[0_0_12px_#ef4444]'}\`}></span>
              </h3>
              <p className="text-5xl text-white font-black tracking-tighter mb-10">
                {currentStatus === "LIVE" ? "Live" : "Stopped"}
              </p>
            </div>
            <form action={toggleEventState} className="mt-auto">
              <input type="hidden" name="status" value={currentStatus === "LIVE" ? "NOT_STARTED" : "LIVE"} />
              <button type="submit" className={\`w-full py-5 px-6 text-sm font-black tracking-[0.2em] uppercase rounded-xl transition-all duration-300 \${currentStatus === 'LIVE' ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-white text-black hover:bg-gray-200'}\`}>
                {currentStatus === "LIVE" ? "Halt Event" : "Initiate Event"}
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
console.log("Admin dashboard incredibly airy, spaced, and premium");
