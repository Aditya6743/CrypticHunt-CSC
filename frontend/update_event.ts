import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  await prisma.event.updateMany({
    data: {
      status: "NOT_STARTED"
    }
  });
  console.log("Event status reset to NOT_STARTED");
}
main();
