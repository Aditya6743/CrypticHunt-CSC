import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const updated = await prisma.event.update({
    where: { id: '384e5852-cdc7-437d-a62d-ac066de3a5b6' },
    data: { status: 'NOT_STARTED' }
  });
  console.log("Updated to:", updated);
}
main();
