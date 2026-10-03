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
    <div className="font-mono text-green-500">
      
      {/* Ambient Background */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-[0.03] pointer-events-none mix-blend-screen flex items-center justify-center z-0">
        <Image src="/logo.png" alt="" fill className="object-contain grayscale" />
      </div>
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#003300 1px, transparent 1px), linear-gradient(90deg, #003300 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
      
      <div className="relative z-10">
      <div className="flex items-center gap-4 mb-10 border-b border-green-500/30 pb-6 relative">
        <div>
          <h1 className="text-3xl font-bold text-green-400 tracking-widest uppercase">ROOT_ACCESS // TELEMETRY</h1>
          <p className="text-[10px] text-green-700 tracking-[0.3em] uppercase mt-1">Global Event Command Center</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {/* Teams Metric */}
        <div className="relative bg-black/80 border border-green-500/30 p-6 rounded-none">
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-green-500"></div>
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-green-500"></div>
          
          <h3 className="text-green-700 text-[10px] font-bold tracking-[0.2em] mb-3 uppercase">Registered Teams</h3>
          <p className="text-4xl md:text-5xl text-green-400 font-bold tracking-tighter">{teamsCount}</p>
        </div>

        {/* Levels Metric */}
        <div className="relative bg-black/80 border border-green-500/30 p-6 rounded-none">
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-green-500"></div>
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-green-500"></div>

          <h3 className="text-green-700 text-[10px] font-bold tracking-[0.2em] mb-3 uppercase">Active Levels</h3>
          <p className="text-4xl md:text-5xl text-green-400 font-bold tracking-tighter">{levelsCount} <span className="text-2xl text-green-800">/ 50</span></p>
        </div>

        {/* Leaderboard Control */}
        <div className="relative bg-black/80 border border-green-500/30 p-6 rounded-none flex flex-col justify-between">
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-green-500"></div>
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-green-500"></div>

          <div>
            <h3 className="text-green-700 text-[10px] font-bold tracking-[0.2em] mb-3 uppercase flex justify-between items-center">
              Leaderboard
              <span className={\`w-2 h-2 \${isFrozen ? 'bg-amber-500' : 'bg-green-500 animate-pulse'}\`}></span>
            </h3>
            <p className={\`text-xl md:text-2xl font-bold uppercase tracking-widest mb-4 \${isFrozen ? 'text-amber-400' : 'text-green-400'}\`}>
              {isFrozen ? 'FROZEN' : 'ACTIVE'}
            </p>
          </div>
          <form action={toggleFreezeState} className="mt-auto">
            <input type="hidden" name="freeze" value={isFrozen ? "false" : "true"} />
            <button type="submit" className={\`w-full py-2 text-[10px] font-bold tracking-[0.2em] transition-colors border \${isFrozen ? 'bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-black border-green-500' : 'bg-amber-500/10 text-amber-400 hover:bg-amber-500 hover:text-black border-amber-500'}\`}>
              > {isFrozen ? "UNFREEZE_BOARD" : "FREEZE_BOARD"}
            </button>
          </form>
        </div>

        {/* Global Event Control */}
        <div className="relative bg-black/80 border border-green-500/30 p-6 rounded-none flex flex-col justify-between">
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-green-500"></div>
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-green-500"></div>

          <div>
            <h3 className="text-green-700 text-[10px] font-bold tracking-[0.2em] mb-3 uppercase flex justify-between items-center">
              Event Status
              <span className={\`w-2 h-2 \${currentStatus === 'LIVE' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}\`}></span>
            </h3>
            <p className={\`text-xl md:text-2xl font-bold uppercase tracking-widest mb-4 \${currentStatus === 'LIVE' ? 'text-green-400' : 'text-red-400'}\`}>
              {currentStatus}
            </p>
          </div>
          <form action={toggleEventState} className="mt-auto">
            <input type="hidden" name="status" value={currentStatus === "LIVE" ? "NOT_STARTED" : "LIVE"} />
            <button type="submit" className={\`w-full py-2 text-[10px] font-bold tracking-[0.2em] transition-colors border \${currentStatus === 'LIVE' ? 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-black border-red-500' : 'bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-black border-green-500'}\`}>
              > {currentStatus === "LIVE" ? "HALT_EVENT" : "INITIATE_EVENT"}
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
console.log("Admin dashboard upgraded to raw SecOps terminal style");
