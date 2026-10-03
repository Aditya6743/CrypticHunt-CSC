const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log("Starting Dry Run Seed...");

  // 1. Clear existing generic data (Careful not to break schema)
  await prisma.levelProgress.deleteMany({});
  await prisma.submission.deleteMany({});
  await prisma.hintUsage.deleteMany({});
  await prisma.report.deleteMany({});
  await prisma.teamMember.deleteMany({});
  await prisma.team.deleteMany({});
  await prisma.hint.deleteMany({});
  await prisma.acceptedAnswer.deleteMany({});
  await prisma.level.deleteMany({});
  await prisma.event.deleteMany({});
  
  // Keep admin if exists, or recreate
  await prisma.admin.deleteMany({});
  const adminPass = await bcrypt.hash("admin@csc", 10);
  await prisma.admin.create({
    data: { username: "cscadmin", passwordHash: adminPass }
  });
  console.log("✅ Admin created (cscadmin / admin@csc)");

  // 2. Set Event to LIVE for the dry run, or NOT_STARTED? Let's do NOT_STARTED so they can test the admin toggle.
  await prisma.event.create({
    data: { status: "NOT_STARTED" }
  });
  console.log("✅ Event created (Status: NOT_STARTED)");

  // 3. Create Levels
  const level1 = await prisma.level.create({
    data: {
      levelNumber: 1,
      title: "Operation: Genesis",
      description: "Welcome to Cryptic Hunt. Your first task is simple: prove you have terminal access by typing the word 'INITIATE'.",
      category: "WARMUP",
      difficulty: "EASY",
      points: 10,
      answerMatchingMode: "CASE_INSENSITIVE",
      answers: { create: [{ answer: "INITIATE" }] },
      hints: { create: [{ hintNumber: 1, content: "Literally just type INITIATE.", penalty: 5 }] }
    }
  });

  const level2 = await prisma.level.create({
    data: {
      levelNumber: 2,
      title: "The Caesar Shift",
      description: "We intercepted this string: 'KHOOR'. It seems to be shifted by 3. What is the original word?",
      category: "CRYPTOGRAPHY",
      difficulty: "MEDIUM",
      points: 20,
      answerMatchingMode: "CASE_INSENSITIVE",
      answers: { create: [{ answer: "HELLO" }] },
      hints: { create: [{ hintNumber: 1, content: "Look up Caesar Cipher decoder.", penalty: 10 }] }
    }
  });

  const level3 = await prisma.level.create({
    data: {
      levelNumber: 3,
      title: "End of the Line",
      description: "You've reached the end of the dry run. The final passcode is 'ROOT'.",
      category: "LOGIC",
      difficulty: "HARD",
      points: 50,
      answerMatchingMode: "EXACT",
      answers: { create: [{ answer: "ROOT" }] },
      hints: { create: [{ hintNumber: 1, content: "It must be uppercase ROOT.", penalty: 20 }] }
    }
  });
  console.log("✅ 3 Test Levels created");

  console.log("\\n🎉 DRY RUN SEED COMPLETE! \\nGo ahead and register a team to play!");
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
