import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import ClientLevel from "./client-page";

export const dynamic = "force-dynamic";

export default async function LevelPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const resolvedParams = await params;
  
  const event = await prisma.event.findFirst();
  if (event?.status !== "LIVE") {
    return (
      <div className="min-h-screen bg-[#05070B] flex items-center justify-center font-mono">
        <div className="text-center p-8 border border-amber-900/50 bg-amber-950/10">
          <h1 className="text-3xl text-amber-500 font-bold mb-4 tracking-widest uppercase shadow-amber-500/50 drop-shadow-md">MISSION ON STANDBY</h1>
          <p className="text-amber-400/70 uppercase tracking-widest mb-8">The event is currently paused or pending initialization.</p>
          <a href="/dashboard" className="inline-block px-8 py-3 border border-amber-800 text-amber-500 hover:bg-amber-900/30 uppercase tracking-widest transition-colors">[ RETURN TO DASHBOARD ]</a>
        </div>
      </div>
    );
  }

  const team = await prisma.team.findUnique({
    where: { id: (session.user as any).id },
  });

  if (!team) redirect("/login");

  const levelIdParam = parseInt(resolvedParams.id, 10);
  if (isNaN(levelIdParam)) redirect("/dashboard");

  if (team.currentLevel < levelIdParam) {
    redirect(`/level/${team.currentLevel}`);
  }

  const level = await prisma.level.findUnique({
    where: { levelNumber: levelIdParam },
  });

  if (!level) {
    // Check if this is because they beat the final level
    const maxLevel = await prisma.level.aggregate({ _max: { levelNumber: true } });
    
    if (maxLevel._max.levelNumber && levelIdParam > maxLevel._max.levelNumber) {
      return (
        <div className="min-h-screen bg-[#05070B] text-white flex items-center justify-center font-mono relative overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#05070B 2px, transparent 2px), linear-gradient(90deg, #05070B 2px, transparent 2px)', backgroundSize: '40px 40px', backgroundColor: 'rgba(0, 255, 255, 0.05)' }}></div>
          <div className="text-center z-10 border border-cyan-900/50 p-16 bg-[#0a0e17] rounded-sm shadow-[0_0_50px_rgba(6,182,212,0.2)] max-w-2xl">
            <h1 className="text-5xl text-cyan-400 mb-6 font-bold tracking-widest uppercase shadow-cyan-500/50 drop-shadow-md animate-pulse">HUNT COMPLETE</h1>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              Congratulations. You have successfully decrypted all available protocols and reached the end of the Cryptic Hunt.
            </p>
            <div className="text-cyan-600 font-bold text-2xl tracking-[0.5em] mb-8">
              {team.score} PTS
            </div>
            <a href="/leaderboard" className="inline-block px-8 py-3 bg-cyan-900/30 border border-cyan-600 hover:bg-cyan-800/60 text-cyan-400 tracking-widest uppercase transition-all">
              VIEW FINAL STANDINGS
            </a>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-[#05070B] text-white flex items-center justify-center font-mono relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#05070B 2px, transparent 2px), linear-gradient(90deg, #05070B 2px, transparent 2px)', backgroundSize: '40px 40px', backgroundColor: 'rgba(255, 0, 0, 0.05)' }}></div>
        <div className="text-center z-10 border border-red-900/50 p-12 bg-[#0a0e17] rounded-sm shadow-[0_0_30px_rgba(255,0,0,0.1)]">
          <h1 className="text-4xl text-red-500 mb-4 font-bold tracking-widest">404 - LEVEL NOT FOUND</h1>
          <p className="text-gray-400">THE REQUESTED CIPHER PROTOCOL DOES NOT EXIST.</p>
        </div>
      </div>
    );
  }

  
  const unlockedHintUsages = await prisma.hintUsage.findMany({
    where: { teamId: team.id, levelId: level.id },
    include: { hint: true },
    orderBy: { hint: { hintNumber: 'asc' } }
  });
  const unlockedHints = unlockedHintUsages.map(hu => hu.hint);

  const allHints = await prisma.hint.findMany({
    where: { levelId: level.id },
    orderBy: { hintNumber: 'asc' }
  });

  const nextHint = allHints.find(h => !unlockedHints.find(uh => uh.id === h.id));
  const nextHintPenalty = nextHint ? nextHint.penalty : null;

  return <ClientLevel level={level} team={team} unlockedHints={unlockedHints} nextHintPenalty={nextHintPenalty} endTime={event?.endTime} haltedAt={event?.haltedAt} isLive={event?.status === "LIVE"} />;

}
