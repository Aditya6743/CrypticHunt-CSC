import { prisma } from "@/lib/db";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Leaderboard() {
  const teams = await prisma.team.findMany({
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

  // Sort by time if scores and levels are equal
  teams.sort((a, b) => {
    if (a.score === b.score && a.currentLevel === b.currentLevel) {
      const aTime = a.progress[0]?.completedAt?.getTime() || 0;
      const bTime = b.progress[0]?.completedAt?.getTime() || 0;
      return aTime - bTime;
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-[#05070B] text-gray-100 font-mono p-4 md:p-8 relative">
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#05070B 2px, transparent 2px), linear-gradient(90deg, #05070B 2px, transparent 2px)', backgroundSize: '40px 40px', backgroundColor: 'rgba(0, 255, 255, 0.05)' }}></div>
      <div className="max-w-4xl mx-auto z-10 relative mt-24">
        <div className="flex justify-between items-end mb-8 border-b border-cyan-900/50 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-cyan-500 tracking-widest uppercase">Leaderboard</h1>
            <p className="text-sm text-gray-500 mt-2 tracking-widest">LIVE RANKINGS // REAL-TIME</p>
          </div>
          <Link href="/dashboard" className="px-4 py-2 border border-cyan-800 text-cyan-400 hover:bg-cyan-900/30 transition-all text-xs tracking-widest">[ DASHBOARD ]</Link>
        </div>

        <div className="bg-[#0a0e17] border border-cyan-900/30 p-1 shadow-[0_0_30px_rgba(6,182,212,0.05)]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-cyan-950/20 text-cyan-500 text-xs tracking-widest">
                <th className="p-4 border-b border-cyan-900/30">RANK</th>
                <th className="p-4 border-b border-cyan-900/30">TEAM</th>
                <th className="p-4 border-b border-cyan-900/30 text-center">LEVEL</th>
                <th className="p-4 border-b border-cyan-900/30 text-right">SCORE</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team, idx) => (
                <tr key={team.id} className="border-b border-gray-900 hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 text-gray-400">
                    {idx === 0 ? <span className="text-yellow-400 font-bold text-lg">#1</span> : 
                     idx === 1 ? <span className="text-gray-300 font-bold text-lg">#2</span> :
                     idx === 2 ? <span className="text-amber-600 font-bold text-lg">#3</span> : 
                     `#${idx + 1}`}
                  </td>
                  <td className="p-4 text-cyan-300 font-bold uppercase tracking-wider">{team.teamName}</td>
                  <td className="p-4 text-gray-400 text-center">{team.currentLevel}</td>
                  <td className="p-4 text-right text-emerald-400 font-bold">{team.score}</td>
                </tr>
              ))}
              {teams.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500 tracking-widest uppercase">NO DATA AVAILABLE</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
