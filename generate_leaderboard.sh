#!/bin/bash
cd frontend

cat << 'FILE' > src/app/(participant)/leaderboard/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Leaderboard() {
  const session = await getServerSession(authOptions);
  
  const teams = await prisma.team.findMany({
    orderBy: [
      { score: 'desc' },
      // To properly sort by time, we'd use the last LevelProgress timestamp. 
      // Simplified here: tie-break by currentLevel then name.
      { currentLevel: 'desc' },
      { teamName: 'asc' }
    ],
    take: 100
  });

  return (
    <div className="min-h-screen bg-[#05070B] text-gray-100 p-8 font-mono">
      <header className="border-b border-cyan-900/50 pb-6 mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-cyan-400">GLOBAL LEADERBOARD</h1>
        </div>
        <div className="text-right">
          {session ? (
            <Link href="/dashboard" className="text-cyan-500 hover:text-white transition-colors">
              RETURN TO DASHBOARD
            </Link>
          ) : (
            <Link href="/" className="text-cyan-500 hover:text-white transition-colors">
              RETURN HOME
            </Link>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto">
        <div className="bg-[#0a0e17] border border-cyan-900/50 rounded-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-cyan-900/20 border-b border-cyan-900/50 text-cyan-500 text-xs tracking-widest uppercase">
              <tr>
                <th className="px-6 py-4 font-normal">RANK</th>
                <th className="px-6 py-4 font-normal">TEAM</th>
                <th className="px-6 py-4 font-normal text-center">LEVEL</th>
                <th className="px-6 py-4 font-normal text-right">SCORE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {teams.map((team, idx) => (
                <tr key={team.id} className="hover:bg-cyan-900/10 transition-colors">
                  <td className="px-6 py-4">
                    <span className={\`font-bold \${idx === 0 ? "text-yellow-400" : idx === 1 ? "text-gray-300" : idx === 2 ? "text-amber-600" : "text-gray-500"}\`}>
                      #{idx + 1}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-white">{team.teamName}</td>
                  <td className="px-6 py-4 text-center text-gray-400">{team.currentLevel}</td>
                  <td className="px-6 py-4 text-right text-violet-400 font-bold">{team.score}</td>
                </tr>
              ))}
              {teams.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    NO ACTIVE TEAMS. THE HUNT HAS NOT BEGUN.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
FILE
