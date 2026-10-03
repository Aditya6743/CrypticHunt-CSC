#!/bin/bash
cd frontend

mkdir -p src/app/dashboard

cat << 'FILE' > src/app/dashboard/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  const team = await prisma.team.findUnique({
    where: { id: (session.user as any).id },
  });

  if (!team) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#05070B] text-gray-100 p-8 font-mono">
      <header className="border-b border-cyan-900/50 pb-6 mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-cyan-400">CRYPTIC HUNT</h1>
          <p className="text-gray-400">TEAM: <span className="text-white font-semibold">{team.teamName}</span></p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-400">STATUS</div>
          <div className="text-green-400 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> ONLINE
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="col-span-2 space-y-8">
          {/* Main Status Panel */}
          <div className="bg-[#0a0e17] border border-cyan-900/50 p-6 rounded-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-bl-full pointer-events-none"></div>
            
            <h2 className="text-sm text-cyan-500 mb-6 tracking-widest uppercase">Command Center</h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
              <div>
                <div className="text-gray-500 text-xs mb-1">CURRENT LEVEL</div>
                <div className="text-4xl text-white">{team.currentLevel} <span className="text-xl text-gray-600">/ 50</span></div>
              </div>
              <div>
                <div className="text-gray-500 text-xs mb-1">SCORE</div>
                <div className="text-4xl text-violet-400">{team.score}</div>
              </div>
              <div>
                <div className="text-gray-500 text-xs mb-1">RANK</div>
                <div className="text-4xl text-white">#--</div>
              </div>
              <div>
                <div className="text-gray-500 text-xs mb-1">TIME ELAPSED</div>
                <div className="text-4xl text-white">00:00:00</div>
              </div>
            </div>
            
            <Link href={`/level/${team.currentLevel}`} className="block w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-black text-center font-bold tracking-widest uppercase transition-colors">
              CONTINUE CHALLENGE
            </Link>
          </div>
        </div>

        <div className="space-y-8">
          {/* Activity Panel */}
          <div className="bg-[#0a0e17] border border-cyan-900/50 p-6 rounded-sm h-full">
            <h2 className="text-sm text-cyan-500 mb-6 tracking-widest uppercase">System Log</h2>
            <div className="space-y-4 text-sm">
              <div className="text-gray-400">
                <span className="text-green-500">[AUTH]</span> Login successful. Welcome back, {team.teamName}.
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
FILE
