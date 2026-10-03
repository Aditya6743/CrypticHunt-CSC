const fs = require('fs');

// 1. Update page.tsx
let page = fs.readFileSync('src/app/level/[id]/page.tsx', 'utf8');
page = page.replace(
  'return <ClientLevel level={level} team={team} unlockedHints={unlockedHints} nextHintPenalty={nextHintPenalty} />;',
  'return <ClientLevel level={level} team={team} unlockedHints={unlockedHints} nextHintPenalty={nextHintPenalty} startTime={event?.startTime} />;'
);
fs.writeFileSync('src/app/level/[id]/page.tsx', page);

// 2. Update client-page.tsx
let clientPage = fs.readFileSync('src/app/level/[id]/client-page.tsx', 'utf8');

// Add import if missing (though we'll just inject it)
if (!clientPage.includes('TimeElapsed')) {
  clientPage = clientPage.replace(
    'import Link from "next/link";',
    'import Link from "next/link";\nimport TimeElapsed from "@/components/TimeElapsed";'
  );
}

clientPage = clientPage.replace(
  'export default function ClientLevel({ level, team, unlockedHints, nextHintPenalty }: { level: any, team: any, unlockedHints: any[], nextHintPenalty: number | null }) {',
  'export default function ClientLevel({ level, team, unlockedHints, nextHintPenalty, startTime }: { level: any, team: any, unlockedHints: any[], nextHintPenalty: number | null, startTime: any }) {'
);

const oldHeader = `          <div>
            <h1 className="text-3xl font-black text-cyan-500 tracking-[0.2em] uppercase shadow-cyan-500/50 drop-shadow-md">LEVEL {level.levelNumber}</h1>
            <p className="text-gray-500 mt-2 tracking-widest text-xs md:text-sm">STATUS: ACTIVE // TARGET: {level.title}</p>
          </div>`;

const newHeader = `          <div>
            <h1 className="text-3xl font-black text-cyan-500 tracking-[0.2em] uppercase shadow-cyan-500/50 drop-shadow-md">LEVEL {level.levelNumber}</h1>
            <p className="text-gray-500 mt-2 tracking-widest text-xs md:text-sm flex flex-col md:flex-row md:items-center gap-2">
              <span>STATUS: ACTIVE // TARGET: {level.title}</span>
              <span className="hidden md:inline text-cyan-900/50">|</span>
              <span className="text-cyan-400 font-bold">
                ELAPSED: {startTime ? <TimeElapsed startTime={startTime} /> : "00:00:00"}
              </span>
            </p>
          </div>`;

clientPage = clientPage.replace(oldHeader, newHeader);
fs.writeFileSync('src/app/level/[id]/client-page.tsx', clientPage);

console.log("Time elapsed added to inside level page");
