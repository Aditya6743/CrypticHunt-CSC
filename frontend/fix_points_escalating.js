const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Update Level 4 -> 100
  await prisma.level.update({ where: { levelNumber: 4 }, data: { points: 100 } });
  
  const level4 = await prisma.level.findUnique({ where: { levelNumber: 4 } });
  const hints4 = await prisma.hint.findMany({ where: { levelId: level4.id } });
  for (const h of hints4) {
    if (h.hintNumber === 1) await prisma.hint.update({ where: { id: h.id }, data: { penalty: 10 } }); // 10%
    if (h.hintNumber === 2) await prisma.hint.update({ where: { id: h.id }, data: { penalty: 20 } }); // 20%
  }

  // Update Level 5 -> 200
  await prisma.level.update({ where: { levelNumber: 5 }, data: { points: 200 } });
  const level5 = await prisma.level.findUnique({ where: { levelNumber: 5 } });
  const hints5 = await prisma.hint.findMany({ where: { levelId: level5.id } });
  for (const h of hints5) {
    if (h.hintNumber === 1) await prisma.hint.update({ where: { id: h.id }, data: { penalty: 20 } }); // 10%
    if (h.hintNumber === 2) await prisma.hint.update({ where: { id: h.id }, data: { penalty: 40 } }); // 20%
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
