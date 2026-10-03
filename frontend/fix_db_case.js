const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const teams = await prisma.team.findMany();
  for (const t of teams) {
    if (t.leaderEmail !== t.leaderEmail.toLowerCase()) {
      await prisma.team.update({
        where: { id: t.id },
        data: { leaderEmail: t.leaderEmail.toLowerCase() }
      });
      console.log(`Updated email for ${t.teamName} to ${t.leaderEmail.toLowerCase()}`);
    }
  }
}
main().finally(() => prisma.$disconnect());
