const fs = require('fs');

// 1. Update client-page.tsx
let clientPage = fs.readFileSync('src/app/level/[id]/client-page.tsx', 'utf8');

clientPage = clientPage.replace(
  'export default function ClientLevel({ level, team }: { level: any, team: any }) {',
  'export default function ClientLevel({ level, team, unlockedHints, nextHintPenalty }: { level: any, team: any, unlockedHints: any[], nextHintPenalty: number | null }) {'
);

const oldHintLogic = `  const [hintContent, setHintContent] = useState("");
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
  };`;

const newHintLogic = `  const [hints, setHints] = useState(unlockedHints || []);
  const [hintLoading, setHintLoading] = useState(false);

  const requestHint = async () => {
    if (nextHintPenalty === null) return;
    if(!confirm(\`Requesting this hint will deduct \${nextHintPenalty} points. Proceed?\`)) return;
    setHintLoading(true);
    try {
      const res = await fetch("/api/hint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ levelId: level.id })
      });
      const data = await res.json();
      if (res.ok) {
        // Refresh page to show new hint and updated penalty
        router.refresh();
      } else {
        alert(data.error || "No hints available");
      }
    } catch(err) {
      alert("Error requesting hint");
    }
    setHintLoading(false);
  };`;

clientPage = clientPage.replace(oldHintLogic, newHintLogic);

const oldHintUI = `            <div className="text-center pt-4">
              <button 
                onClick={requestHint}
                disabled={hintLoading}
                className="text-[10px] text-gray-600 hover:text-amber-500 disabled:opacity-50 uppercase tracking-widest transition-colors"
              >
                [ {hintLoading ? "DECRYPTING..." : "Request Hint (-10 PTS)"} ]
              </button>
              {hintContent && (
                <div className="mt-4 p-4 border border-amber-900/30 bg-amber-900/10 text-amber-500/80 text-xs text-left font-mono">
                  <span className="text-amber-500 font-bold tracking-widest block mb-2">SYSTEM.HINT_DECRYPTED:</span>
                  {hintContent}
                </div>
              )}
            </div>`;

const newHintUI = `            <div className="text-center pt-4 space-y-4">
              {hints.map((h: any, i: number) => (
                <div key={h.id} className="p-4 border border-amber-900/30 bg-amber-900/10 text-amber-500/80 text-xs text-left font-mono">
                  <span className="text-amber-500 font-bold tracking-widest block mb-2">SYSTEM.HINT_0{i+1}_DECRYPTED:</span>
                  {h.content}
                </div>
              ))}
              
              {nextHintPenalty !== null && (
                <button 
                  onClick={requestHint}
                  disabled={hintLoading}
                  className="text-[10px] text-gray-600 hover:text-amber-500 disabled:opacity-50 uppercase tracking-widest transition-colors mt-4 block mx-auto"
                >
                  [ {hintLoading ? "DECRYPTING..." : \`Request Next Hint (-\${nextHintPenalty} PTS)\`} ]
                </button>
              )}
            </div>`;

clientPage = clientPage.replace(oldHintUI, newHintUI);

fs.writeFileSync('src/app/level/[id]/client-page.tsx', clientPage);


// 2. Update /api/hint/route.ts
let apiHint = fs.readFileSync('src/app/api/hint/route.ts', 'utf8');

const oldApiLogic = `    // Find first hint
    const hint = level.hints[0];
    if (!hint) return NextResponse.json({ error: "No hints available for this level." }, { status: 404 });

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

    return NextResponse.json({ content: hint.content, penalty: hint.penalty, alreadyUsed: false });`;

const newApiLogic = `    // Get unlocked hints
    const unlockedHintUsages = await prisma.hintUsage.findMany({ where: { teamId: team.id, levelId: level.id } });
    const unlockedHintIds = unlockedHintUsages.map(hu => hu.hintId);

    // Find next available hint
    const nextHint = level.hints.find(h => !unlockedHintIds.includes(h.id));
    if (!nextHint) return NextResponse.json({ error: "No more hints available." }, { status: 404 });

    // Record usage and deduct penalty from team score immediately
    await prisma.$transaction([
      prisma.hintUsage.create({
        data: {
          teamId: team.id,
          levelId: level.id,
          hintId: nextHint.id,
          penalty: nextHint.penalty
        }
      }),
      prisma.team.update({
        where: { id: team.id },
        data: { score: { decrement: nextHint.penalty } }
      })
    ]);

    return NextResponse.json({ success: true });`;

apiHint = apiHint.replace(oldApiLogic, newApiLogic);
fs.writeFileSync('src/app/api/hint/route.ts', apiHint);

console.log("Hint system fully implemented!");
