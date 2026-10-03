const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const teams = await prisma.team.findMany();
  console.log("Teams in DB:");
  teams.forEach(t => console.log(`- Name: "${t.teamName}", Email: "${t.leaderEmail}", ID: "${t.teamId}"`));
}
main().finally(() => prisma.$disconnect());
