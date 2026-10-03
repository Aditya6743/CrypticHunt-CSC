const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const pointsMap = {
    1: 10,
    2: 15,
    3: 20,
    4: 25,
    5: 100
  };

  for (let i = 1; i <= 5; i++) {
    const pts = pointsMap[i];
    
    // Update level points
    await prisma.level.updateMany({
      where: { levelNumber: i },
      data: { points: pts }
    });

    // Update hints
    const level = await prisma.level.findUnique({ where: { levelNumber: i } });
    if (level) {
      const hints = await prisma.hint.findMany({ where: { levelId: level.id } });
      for (const h of hints) {
        if (h.hintNumber === 1) {
          await prisma.hint.update({ where: { id: h.id }, data: { penalty: Math.round(pts * 0.1) } });
        }
        if (h.hintNumber === 2) {
          await prisma.hint.update({ where: { id: h.id }, data: { penalty: Math.round(pts * 0.2) } });
        }
      }
    }
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
