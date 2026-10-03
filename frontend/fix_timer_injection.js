const fs = require('fs');

let clientPage = fs.readFileSync('src/app/level/[id]/client-page.tsx', 'utf8');

// Ensure TimeElapsed is imported
if (!clientPage.includes('import TimeElapsed')) {
  clientPage = clientPage.replace(
    'import Link from "next/link";',
    'import Link from "next/link";\nimport TimeElapsed from "@/components/TimeElapsed";'
  );
}

// Ensure the props interface receives startTime
if (!clientPage.includes('startTime: any')) {
  clientPage = clientPage.replace(
    /export default function ClientLevel\({ level, team, unlockedHints, nextHintPenalty }: \{ level: any, team: any, unlockedHints: any\[\], nextHintPenalty: number \| null \}\) \{/,
    'export default function ClientLevel({ level, team, unlockedHints, nextHintPenalty, startTime }: { level: any, team: any, unlockedHints: any[], nextHintPenalty: number | null, startTime?: any }) {'
  );
}

// Replace the line
const oldLine = '<p className="text-gray-500 mt-2 tracking-widest text-xs md:text-sm">STATUS: ACTIVE // TARGET: {level.title}</p>';
const newLine = `<p className="text-gray-500 mt-2 tracking-widest text-[10px] md:text-xs flex flex-col md:flex-row md:items-center gap-2">
              <span>STATUS: ACTIVE // TARGET: {level.title}</span>
              <span className="hidden md:inline text-cyan-900/50">|</span>
              <span className="text-cyan-400 font-bold">
                ELAPSED: {startTime ? <TimeElapsed startTime={startTime} /> : "00:00:00"}
              </span>
            </p>`;

if (clientPage.includes(oldLine)) {
  clientPage = clientPage.replace(oldLine, newLine);
  console.log("Timer injected successfully!");
} else {
  console.log("Could not find the target line to replace.");
}

fs.writeFileSync('src/app/level/[id]/client-page.tsx', clientPage);
