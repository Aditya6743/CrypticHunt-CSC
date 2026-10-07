require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const event = await prisma.event.findFirst();
  console.log("Event in DB:", event);
}
main().catch(console.error).finally(() => prisma.$disconnect());
