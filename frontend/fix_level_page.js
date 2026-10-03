const fs = require('fs');

let page = fs.readFileSync('src/app/level/[id]/page.tsx', 'utf8');

// Inject the hint fetching logic before rendering ClientLevel
const returnClientLevel = 'return <ClientLevel level={level} team={team} />;';
const newReturn = `
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

  return <ClientLevel level={level} team={team} unlockedHints={unlockedHints} nextHintPenalty={nextHintPenalty} />;
`;

page = page.replace(returnClientLevel, newReturn);
fs.writeFileSync('src/app/level/[id]/page.tsx', page);

console.log("Updated page.tsx to fetch hints");
