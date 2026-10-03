const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const hints = await prisma.hint.findMany({ include: { level: true } });
  hints.forEach(h => console.log(`Level ${h.level.levelNumber} Hint ${h.hintNumber}: -${h.penalty} pts`));
}
main().catch(console.error).finally(() => prisma.$disconnect());
