const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding database...")
  
  const levels = []
  for (let i = 1; i <= 50; i++) {
    const points = i <= 10 ? 10 : i <= 20 ? 15 : i <= 30 ? 20 : i <= 40 ? 25 : i < 50 ? 30 : 100;
    const diff = i <= 10 ? "EASY" : i <= 30 ? "MEDIUM" : i < 50 ? "HARD" : "BOSS";
    
    levels.push({
      levelNumber: i,
      title: i === 50 ? "THE FINAL BOSS" : `LEVEL ${i} PROTOCOL`,
      description: `This is challenge level ${i}. You must decrypt the hidden sequence.`,
      category: i % 3 === 0 ? "CRYPTOGRAPHY" : i % 2 === 0 ? "OSINT" : "LOGIC",
      difficulty: diff,
      points: points,
      answerMatchingMode: "CASE_INSENSITIVE"
    })
  }
  
  for (const level of levels) {
    const created = await prisma.level.upsert({
      where: { levelNumber: level.levelNumber },
      update: {},
      create: level,
    })
    
    await prisma.acceptedAnswer.create({
      data: {
        levelId: created.id,
        answer: `answer${level.levelNumber}`
      }
    })
  }

  const hashedPassword = await bcrypt.hash('password123', 10)
  await prisma.team.upsert({
    where: { teamId: 'CH-DEMO' },
    update: {},
    create: {
      teamId: 'CH-DEMO',
      teamName: 'CYBERWOLVES',
      leaderName: 'Alice Hacker',
      leaderEmail: 'alice@example.com',
      contactNumber: '1234567890',
      college: 'Cyber University',
      passwordHash: hashedPassword,
      score: 0,
      currentLevel: 1
    }
  })

  const adminPassword = await bcrypt.hash('admin123', 10)
  await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      passwordHash: adminPassword
    }
  })
  
  console.log("Seeding complete.")
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
