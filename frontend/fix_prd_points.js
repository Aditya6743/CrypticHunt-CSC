const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Update Level 4 and 5 points to 10 each, based on PRD
  await prisma.level.update({ where: { levelNumber: 4 }, data: { points: 10 } });
  await prisma.level.update({ where: { levelNumber: 5 }, data: { points: 10 } }); // Wait, if the user said "5th is the final boss" and the hunt is now only 5 levels total, does level 5 map to "Level 50 (100 points)"? Let's just make level 5 100 points since it's the final boss.
  
  // Actually, let's make Level 4 -> 10 pts, Level 5 -> 100 pts.
  await prisma.level.update({ where: { levelNumber: 5 }, data: { points: 100 } });
  
  const level4 = await prisma.level.findUnique({ where: { levelNumber: 4 } });
  const hints4 = await prisma.hint.findMany({ where: { levelId: level4.id } });
  for (const h of hints4) {
    if (h.hintNumber === 1) await prisma.hint.update({ where: { id: h.id }, data: { penalty: 1 } }); // 10%
    if (h.hintNumber === 2) await prisma.hint.update({ where: { id: h.id }, data: { penalty: 2 } }); // 20%
  }

  const level5 = await prisma.level.findUnique({ where: { levelNumber: 5 } });
  const hints5 = await prisma.hint.findMany({ where: { levelId: level5.id } });
  for (const h of hints5) {
    if (h.hintNumber === 1) await prisma.hint.update({ where: { id: h.id }, data: { penalty: 10 } }); // 10%
    if (h.hintNumber === 2) await prisma.hint.update({ where: { id: h.id }, data: { penalty: 20 } }); // 20%
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
