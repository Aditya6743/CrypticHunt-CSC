const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const levels = await prisma.level.findMany();
  console.log("Levels in DB:");
  levels.forEach(l => console.log(`- LevelNumber: ${l.levelNumber}, Title: "${l.title}"`));
}
main().finally(() => prisma.$disconnect());
