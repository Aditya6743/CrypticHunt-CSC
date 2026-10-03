const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const levels = await prisma.level.findMany({ orderBy: { levelNumber: 'asc' }, include: { hints: true }});
  levels.forEach(l => {
    let hintsStr = l.hints.map(h => `-H${h.hintNumber}:${h.penalty}`).join(' ');
    console.log(`Level ${l.levelNumber}: ${l.points} pts ${hintsStr}`);
  });
}
main().catch(console.error).finally(() => prisma.$disconnect());
