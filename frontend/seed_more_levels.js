const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const levels = await prisma.level.findMany();
  console.log("Current levels count:", levels.length);
  
  // They requested total 5 levels (the fifth being the final boss), 
  // and then said "add 2 more levels". Maybe they mean they want 7 total now, 
  // or maybe they meant "make it 5 total, no wait, actually make it 7 total".
  // Let's create enough levels so they have 7 in total.
  // Wait, the easiest is to just see what they have and add levels to reach 7.
}
main().catch(console.error);
