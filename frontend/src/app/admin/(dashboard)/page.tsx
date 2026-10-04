import { prisma } from "@/lib/db";
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

async function setEndTime(formData: FormData) {
  "use server";
  const hours = parseInt(formData.get("hours") as string) || 0;
  const minutes = parseInt(formData.get("minutes") as string) || 0;
  
  if (hours === 0 && minutes === 0) return;
  
  const durationMs = (hours * 3600 + minutes * 60) * 1000;
  const endTime = new Date(Date.now() + durationMs);

  const event = await prisma.event.findFirst();
  if (event) {
    await prisma.event.update({ where: { id: event.id }, data: { endTime } });
  }
  revalidatePath("/admin");
}

async function toggleEventState(formData: FormData) {
  "use server";
  const newStatus = formData.get("status") as string;
  const event = await prisma.event.findFirst();
  if (event) {
    const updateData: any = { status: newStatus };
    
    if (newStatus === "LIVE") {
      if (!event.startTime) {
        updateData.startTime = new Date();
      } else if (event.haltedAt && event.endTime) {
        // Event was halted! Shift the endTime forward to compensate for lost time.
        const pauseDurationMs = Date.now() - event.haltedAt.getTime();
        updateData.endTime = new Date(event.endTime.getTime() + pauseDurationMs);
        updateData.haltedAt = null;
      } else if (event.haltedAt) {
        // No end time, but clear halted state
        updateData.haltedAt = null;
      }
    } else if (newStatus === "NOT_STARTED" && event.status === "LIVE") {
      // Halting the event!
      updateData.haltedAt = new Date();
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
 if ((session?.user as any)?.role !== "ADMIN") redirect("/admin/login");

 const teamsCount = await prisma.team.count({ where: { status: "ACTIVE" } });
 const levelsCount = await prisma.level.count({ where: { active: true } });
 const totalLevels = await prisma.level.count();
 
 const event = await prisma.event.findFirst();
 const currentStatus = event?.status || "NOT_STARTED";
 const isFrozen = event?.leaderboardFrozen || false;

 return (
 <div className="min-h-screen bg-[#05070B] text-gray-100 font-mono p-4 md:p-8 pt-4 md:pt-12 relative overflow-hidden">
 <div className="relative z-10">
 
 <div className="flex items-center gap-4 mb-10 pb-2 relative">
 <div>
 <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-white tracking-[0.2em] uppercase ">
 EVENT OVERVIEW
 </h1>
 <p className="text-[10px] text-gray-500 tracking-[0.2em] uppercase mt-2">
 Global Command & Control
 </p>
 </div>
 </div>

 {/* Top Row Metrics */}
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
 
 {/* Teams Metric */}
 <div className="bg-[#0a0e17]/80 backdrop-blur-2xl border border-cyan-900/30 p-6 rounded-sm border-t-2 border-t-cyan-500 flex flex-col justify-between overflow-hidden min-h-[160px]">
 <div className="flex flex-col h-full"><h3 className="text-gray-500 text-[10px] tracking-[0.2em] uppercase mb-auto">REGISTERED TEAMS</h3><div className="flex items-end justify-between mt-8"><p className="text-6xl text-white font-bold leading-none">{teamsCount}</p><div className="text-[10px] text-cyan-500 tracking-widest uppercase mb-1">TEAMS</div></div></div>
 </div>

 {/* Levels Metric */}
 <div className="bg-[#0a0e17]/80 backdrop-blur-2xl border border-cyan-900/30 p-6 rounded-sm border-t-2 border-t-cyan-500 flex flex-col justify-between overflow-hidden min-h-[160px]">
 <div className="flex flex-col h-full"><h3 className="text-gray-500 text-[10px] tracking-[0.2em] uppercase mb-auto">ACTIVE LEVELS</h3><div className="flex items-end justify-between mt-8"><p className="text-6xl text-white font-bold leading-none">{levelsCount} <span className="text-3xl text-gray-700 font-normal">/ {totalLevels}</span></p><div className="text-[10px] text-cyan-500 tracking-widest uppercase mb-1">STAGES</div></div></div>
 </div>

 {/* Leaderboard Control */}
 <div className="bg-[#0a0e17]/80 backdrop-blur-2xl border border-cyan-900/30 p-6 rounded-sm border-t-2 border-t-cyan-500 flex flex-col justify-between overflow-hidden min-h-[160px]">
 <div>
 <h3 className="text-gray-500 text-[10px] tracking-[0.2em] uppercase mb-4 flex justify-between items-center">
 LEADERBOARD
 <span className={`w-2 h-2 rounded-full ${isFrozen ? 'bg-amber-500 ' : 'bg-green-500 animate-pulse'}`}></span>
 </h3>
 <p className="text-3xl text-white font-bold mb-6">
 {isFrozen ? 'FROZEN' : 'ACTIVE'}
 </p>
 </div>
 <form action={toggleFreezeState} className="mt-auto w-full">
 <input type="hidden" name="freeze" value={isFrozen ? "false" : "true"} />
 <button type="submit" className={`w-full overflow-hidden text-ellipsis whitespace-nowrap py-2.5 text-[10px] font-bold tracking-[0.2em] uppercase transition-colors border ${isFrozen ? "bg-transparent text-amber-500 hover:bg-amber-500 hover:text-black border-amber-500" : "bg-transparent text-green-500 hover:bg-green-500 hover:text-black border-green-500"}`}>
 [ {isFrozen ? "UNFREEZE BOARD" : "FREEZE BOARD"} ]
 </button>
 </form>
 </div>

 {/* Global Event Control */}
 <div className="bg-[#0a0e17]/80 backdrop-blur-2xl border border-cyan-900/30 p-6 rounded-sm border-t-2 border-t-cyan-500 flex flex-col justify-between overflow-hidden min-h-[160px]">
 <div>
 <h3 className="text-gray-500 text-[10px] tracking-[0.2em] uppercase mb-4 flex justify-between items-center">
 EVENT STATUS
 <span className={`w-2 h-2 rounded-full ${currentStatus === 'LIVE' ? 'bg-green-500 animate-pulse' : 'bg-red-500 '}`}></span>
 </h3>
 <p className="text-3xl text-white font-bold mb-6">
 {currentStatus === "LIVE" ? "LIVE" : "STOPPED"}
 </p>
 </div>
 <form action={toggleEventState} className="mt-auto w-full">
 <input type="hidden" name="status" value={currentStatus === "LIVE" ? "NOT_STARTED" : "LIVE"} />
 <button type="submit" className={`w-full overflow-hidden text-ellipsis whitespace-nowrap py-2.5 text-[10px] font-bold tracking-[0.2em] uppercase transition-colors border ${currentStatus === "LIVE" ? "bg-transparent text-red-500 hover:bg-red-500 hover:text-black border-red-500" : "bg-transparent text-green-500 hover:bg-green-500 hover:text-black border-green-500"}`}>
 [ {currentStatus === "LIVE" ? "HALT EVENT" : "INITIATE EVENT"} ]
 </button>
 </form>
 </div>
 
 </div>

 {/* Bottom Row Controls */}
 <div className="grid grid-cols-1 gap-6 mb-12">
   {/* Timer Control */}
   <div className="bg-[#0a0e17]/80 backdrop-blur-2xl border border-cyan-900/30 p-6 rounded-sm border-t-2 border-t-cyan-500 flex flex-col md:flex-row justify-between items-start md:items-center overflow-hidden">
     <div className="mb-6 md:mb-0">
       <h3 className="text-gray-500 text-[10px] tracking-[0.2em] uppercase mb-2">GLOBAL DEADLINE TIMER</h3>
       <p className="text-xs text-gray-400">Configure countdown for all teams. Reaching zero triggers auto-freeze.</p>
       {event?.endTime && <p className="text-[10px] text-cyan-500 mt-2 font-mono">Current Ends: {event.endTime.toLocaleString()}</p>}
     </div>
     <form action={setEndTime} className="flex flex-wrap gap-3 items-center">
       <div className="flex items-center bg-black/50 border border-white/10 rounded-sm focus-within:border-cyan-500/50">
         <input type="number" name="hours" placeholder="0" min="0" max="999" className="w-16 bg-transparent p-3 text-sm font-mono text-white text-center focus:outline-none" />
         <span className="text-[10px] text-gray-500 pr-4 font-bold tracking-widest">HRS</span>
       </div>
       <div className="flex items-center bg-black/50 border border-white/10 rounded-sm focus-within:border-cyan-500/50">
         <input type="number" name="minutes" placeholder="0" min="0" max="59" className="w-16 bg-transparent p-3 text-sm font-mono text-white text-center focus:outline-none" />
         <span className="text-[10px] text-gray-500 pr-4 font-bold tracking-widest">MIN</span>
       </div>
       <button type="submit" className="px-6 py-3 border border-cyan-500/50 text-cyan-500 hover:bg-cyan-500 hover:text-black text-xs font-bold tracking-widest transition-colors uppercase">Set Timer</button>
     </form>
   </div>
 </div>

 </div>
 </div>
 );
}
