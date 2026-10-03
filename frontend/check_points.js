const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const levels = await prisma.level.findMany({ orderBy: { levelNumber: 'asc' }});
  levels.forEach(l => console.log(`Level ${l.levelNumber}: ${l.points} pts`));
}
main().catch(console.error).finally(() => prisma.$disconnect());
