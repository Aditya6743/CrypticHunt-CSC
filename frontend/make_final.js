const fs = require('fs');
const path = require('path');

const write = (filePath, content) => {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content.trim() + '\n');
  console.log(`Updated ${filePath}`);
};

// 1. LEADERBOARD
write('src/app/leaderboard/page.tsx', `
import { prisma } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";

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
            <h1 className="text-3xl font-bold text-cyan-500 tracking-widest uppercase">Global Leaderboard</h1>
            <p className="text-sm text-gray-500 mt-2 tracking-widest">LIVE RANKINGS // REAL-TIME</p>
          </div>
          <Link href="/dashboard" className="px-4 py-2 border border-cyan-800 text-cyan-400 hover:bg-cyan-900/30 transition-all text-xs tracking-widest">[ DASHBOARD ]</Link>
        </div>

        <div className="bg-[#0a0e17] border border-cyan-900/30 p-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-cyan-950/20 text-cyan-500 text-xs tracking-widest">
                <th className="p-4 border-b border-cyan-900/30">RANK</th>
                <th className="p-4 border-b border-cyan-900/30">TEAM</th>
                <th className="p-4 border-b border-cyan-900/30">LEVEL</th>
                <th className="p-4 border-b border-cyan-900/30 text-right">SCORE</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team, idx) => (
                <tr key={team.id} className="border-b border-gray-900 hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 text-gray-400">
                    {idx === 0 ? <span className="text-yellow-400 font-bold">#1</span> : 
                     idx === 1 ? <span className="text-gray-300 font-bold">#2</span> :
                     idx === 2 ? <span className="text-amber-600 font-bold">#3</span> : 
                     \`#\${idx + 1}\`}
                  </td>
                  <td className="p-4 text-cyan-300 font-bold">{team.teamName}</td>
                  <td className="p-4 text-gray-400">{team.currentLevel}</td>
                  <td className="p-4 text-right text-emerald-400 font-bold">{team.score}</td>
                </tr>
              ))}
              {teams.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">NO TEAMS FOUND</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
`);

// 2. HINT API
write('src/app/api/hint/route.ts', `
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "PARTICIPANT") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { levelId } = body;

    const team = await prisma.team.findUnique({ where: { id: (session.user as any).id } });
    const level = await prisma.level.findUnique({ where: { id: levelId }, include: { hints: { orderBy: { hintNumber: 'asc' } } } });

    if (!team || !level) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (level.levelNumber !== team.currentLevel) return NextResponse.json({ error: "Invalid level" }, { status: 403 });

    // Find first hint
    const hint = level.hints[0];
    if (!hint) return NextResponse.json({ error: "No hints available" }, { status: 404 });

    // Check if already used
    const existing = await prisma.hintUsage.findFirst({ where: { teamId: team.id, hintId: hint.id } });
    if (existing) {
      return NextResponse.json({ content: hint.content, penalty: hint.penalty, alreadyUsed: true });
    }

    // Record usage
    await prisma.hintUsage.create({
      data: {
        teamId: team.id,
        levelId: level.id,
        hintId: hint.id,
        penalty: hint.penalty
      }
    });

    return NextResponse.json({ content: hint.content, penalty: hint.penalty, alreadyUsed: false });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
`);

// 3. UPDATE SUBMIT API (Deduct penalties)
const submitCode = fs.readFileSync('src/app/api/submit/route.ts', 'utf8');
const updatedSubmitCode = submitCode.replace(
  'const isCorrect = level.answers.some(a => a.answer === answer.trim());\n    }',
  \`const isCorrect = level.answers.some(a => a.answer === answer.trim());
    }\`
).replace(
  'score: team.score + level.points',
  \`score: team.score + (level.points - (await prisma.hintUsage.aggregate({ where: { teamId: team.id, levelId: level.id }, _sum: { penalty: true } }))._sum.penalty || 0)\`
).replace(
  'pointsAwarded: level.points',
  \`pointsAwarded: (level.points - (await prisma.hintUsage.aggregate({ where: { teamId: team.id, levelId: level.id }, _sum: { penalty: true } }))._sum.penalty || 0)\`
);
write('src/app/api/submit/route.ts', updatedSubmitCode);

// 4. EVENT STATUS LOCK IN LEVEL PAGE
const levelPageCode = fs.readFileSync('src/app/level/[id]/page.tsx', 'utf8');
if (!levelPageCode.includes('const event = await prisma.event.findFirst();')) {
    const newLevelPageCode = levelPageCode.replace(
      'const resolvedParams = await params;',
      \`const resolvedParams = await params;
  
  const event = await prisma.event.findFirst();
  if (event?.status === "NOT_STARTED") {
    return (
      <div className="min-h-screen bg-[#05070B] flex items-center justify-center font-mono">
        <div className="text-center p-8 border border-red-900/50 bg-red-950/10">
          <h1 className="text-3xl text-red-500 font-bold mb-4 tracking-widest">SYSTEM OFFLINE</h1>
          <p className="text-red-400/70">The event has not started yet. Please await admin initialization.</p>
          <a href="/dashboard" className="mt-8 inline-block px-4 py-2 border border-red-800 text-red-500 hover:bg-red-900/30">RETURN</a>
        </div>
      </div>
    );
  }
  \`
    );
    write('src/app/level/[id]/page.tsx', newLevelPageCode);
}

// 5. UPDATE HINT BUTTON IN CLIENT-PAGE TO USE API
const clientPageCode = fs.readFileSync('src/app/level/[id]/client-page.tsx', 'utf8');
if (!clientPageCode.includes('await fetch("/api/hint"')) {
  const newClientPageCode = clientPageCode.replace(
    'const [isSubmitting, setIsSubmitting] = useState(false);',
    \`const [isSubmitting, setIsSubmitting] = useState(false);
  const [hintContent, setHintContent] = useState("");
  const [hintLoading, setHintLoading] = useState(false);
  
  const requestHint = async () => {
    if(!confirm("Requesting a hint will deduct 10 points. Proceed?")) return;
    setHintLoading(true);
    try {
      const res = await fetch("/api/hint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ levelId: level.id })
      });
      const data = await res.json();
      if (res.ok) {
        setHintContent(data.content);
      } else {
        alert(data.error || "No hints available");
      }
    } catch(err) {
      alert("Error requesting hint");
    }
    setHintLoading(false);
  };\n\`
  ).replace(
    '<button className="text-xs text-cyan-600 hover:text-cyan-400 transition-colors tracking-widest">\n              [ Request Hint (-10 PTS) ]\n            </button>',
    \`<button 
              onClick={requestHint}
              disabled={hintLoading}
              className="text-xs text-cyan-600 hover:text-cyan-400 disabled:opacity-50 transition-colors tracking-widest">
              [ {hintLoading ? "DECRYPTING..." : "Request Hint (-10 PTS)"} ]
            </button>
            {hintContent && (
              <div className="mt-4 p-3 bg-cyan-900/20 border border-cyan-800 text-cyan-300 text-sm font-mono animate-pulse">
                > {hintContent}
              </div>
            )}\`
  );
  write('src/app/level/[id]/client-page.tsx', newClientPageCode);
}

console.log("All fixes applied successfully.");
