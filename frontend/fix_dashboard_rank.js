const fs = require('fs');

let content = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');

const oldFetch = `  const event = await prisma.event.findFirst();
  const startTime = event?.startTime || null;
  const hintsCount = team.hintUsages.length;`;

const newFetch = `  const event = await prisma.event.findFirst();
  const startTime = event?.startTime || null;
  const hintsCount = team.hintUsages.length;

  // Calculate Rank
  const allTeams = await prisma.team.findMany({
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

  allTeams.sort((a, b) => {
    if (a.score === b.score && a.currentLevel === b.currentLevel) {
      const aTime = a.progress[0]?.completedAt?.getTime() || 0;
      const bTime = b.progress[0]?.completedAt?.getTime() || 0;
      return aTime - bTime;
    }
    return 0;
  });

  const rankIndex = allTeams.findIndex(t => t.id === team.id);
  const teamRank = rankIndex !== -1 ? rankIndex + 1 : "--";
`;

content = content.replace(oldFetch, newFetch);

const oldRank = `<p className="text-gray-500 text-xs tracking-widest mb-1">RANK</p>
              <p className="text-2xl text-white font-bold">--</p>`;
const newRank = `<p className="text-gray-500 text-xs tracking-widest mb-1">RANK</p>
              <p className="text-2xl text-white font-bold">#{teamRank}</p>`;
content = content.replace(oldRank, newRank);

fs.writeFileSync('src/app/dashboard/page.tsx', content);
console.log("Dashboard Rank fixed");
