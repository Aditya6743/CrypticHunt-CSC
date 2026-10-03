import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('admin@csc', 10);
  
  // Try to find the existing admin
  const existingAdmins = await prisma.admin.findMany();
  
  if (existingAdmins.length > 0) {
    // Update the first admin found
    await prisma.admin.update({
      where: { id: existingAdmins[0].id },
      data: {
        username: 'cscadmin',
        passwordHash: passwordHash
      }
    });
    console.log("Updated existing admin to cscadmin");
  } else {
    // Create new
    await prisma.admin.create({
      data: {
        username: 'cscadmin',
        passwordHash: passwordHash
      }
    });
    console.log("Created new cscadmin");
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
