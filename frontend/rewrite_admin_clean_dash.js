const fs = require('fs');

const content = `import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

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
    <div className="font-sans text-gray-200 p-4 md:p-8">
      
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Overview</h1>
        <p className="text-sm text-gray-500">Monitor and control the global event telemetry.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {/* Teams Metric */}
        <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-2xl flex flex-col justify-between hover:border-white/20 transition-colors">
          <h3 className="text-gray-500 text-xs font-medium tracking-wider uppercase mb-4">Registered Teams</h3>
          <p className="text-4xl text-white font-semibold font-mono">{teamsCount}</p>
        </div>

        {/* Levels Metric */}
        <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-2xl flex flex-col justify-between hover:border-white/20 transition-colors">
          <h3 className="text-gray-500 text-xs font-medium tracking-wider uppercase mb-4">Active Levels</h3>
          <p className="text-4xl text-white font-semibold font-mono">{levelsCount} <span className="text-2xl text-gray-600 font-light">/ 50</span></p>
        </div>

        {/* Leaderboard Control */}
        <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-2xl flex flex-col justify-between hover:border-white/20 transition-colors">
          <div>
            <h3 className="text-gray-500 text-xs font-medium tracking-wider uppercase mb-2 flex justify-between items-center">
              Leaderboard
              <span className={\`w-2 h-2 rounded-full \${isFrozen ? 'bg-amber-500' : 'bg-emerald-500'}\`}></span>
            </h3>
            <p className="text-2xl text-white font-semibold mb-6">
              {isFrozen ? 'Frozen' : 'Active'}
            </p>
          </div>
          <form action={toggleFreezeState} className="mt-auto">
            <input type="hidden" name="freeze" value={isFrozen ? "false" : "true"} />
            <button type="submit" className="w-full py-2.5 px-4 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-lg transition-colors border border-white/10">
              {isFrozen ? "Unfreeze Board" : "Freeze Board"}
            </button>
          </form>
        </div>

        {/* Global Event Control */}
        <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-2xl flex flex-col justify-between hover:border-white/20 transition-colors">
          <div>
            <h3 className="text-gray-500 text-xs font-medium tracking-wider uppercase mb-2 flex justify-between items-center">
              Event Status
              <span className={\`w-2 h-2 rounded-full \${currentStatus === 'LIVE' ? 'bg-emerald-500' : 'bg-red-500'}\`}></span>
            </h3>
            <p className="text-2xl text-white font-semibold mb-6">
              {currentStatus === "LIVE" ? "Live" : "Stopped"}
            </p>
          </div>
          <form action={toggleEventState} className="mt-auto">
            <input type="hidden" name="status" value={currentStatus === "LIVE" ? "NOT_STARTED" : "LIVE"} />
            <button type="submit" className={\`w-full py-2.5 px-4 text-sm font-medium rounded-lg transition-colors border \${currentStatus === 'LIVE' ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20' : 'bg-white text-black hover:bg-gray-200 border-white'}\`}>
              {currentStatus === "LIVE" ? "Halt Event" : "Initiate Event"}
            </button>
          </form>
        </div>
      </div>
      
    </div>
  );
}
`;

fs.writeFileSync('src/app/admin/(dashboard)/page.tsx', content);
console.log("Admin overview upgraded to modern sleek SaaS style");
