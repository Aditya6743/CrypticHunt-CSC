import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const event = await prisma.event.findFirst();
  console.log("Event details:", event);
}
main();
