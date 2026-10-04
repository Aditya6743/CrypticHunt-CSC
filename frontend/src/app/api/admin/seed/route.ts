import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    // Clear existing levels just in case
    await prisma.submission.deleteMany();
    await prisma.levelProgress.deleteMany();
    await prisma.hintUsage.deleteMany();
    await prisma.acceptedAnswer.deleteMany();
    await prisma.hint.deleteMany();
    await prisma.level.deleteMany();

    const levels = [
      {
        levelNumber: 1,
        title: "The Awakening",
        description: "Decrypt this basic substitution cipher: **FBEVI** (Hint: Shift backwards by 3)",
        category: "Cryptography",
        difficulty: "EASY",
        points: 100,
        answerMatchingMode: "EXACT",
        answer: { create: { answerText: "CYBER" } },
        active: true
      },
      {
        levelNumber: 2,
        title: "Digital Footprints",
        description: "We intercepted a communication encoded in Base64: **U0VDVVJF**\nDecode it to proceed.",
        category: "Encoding",
        difficulty: "EASY",
        points: 150,
        answerMatchingMode: "EXACT",
        answer: { create: { answerText: "SECURE" } },
        active: true
      },
      {
        levelNumber: 3,
        title: "Hidden in Plain Sight",
        description: "Look closely at this string. The secret is capitalized: hELLO i aM a DDC ENgineer.",
        category: "Steganography",
        difficulty: "MEDIUM",
        points: 200,
        answerMatchingMode: "CONTAINS",
        answer: { create: { answerText: "HIDDEN" } },
        active: true
      },
      {
        levelNumber: 4,
        title: "The Administrator",
        description: "We found this MD5 hash on the server: **0192023a7bbd73250516f069df18b500**\nCrack it to gain system access.",
        category: "Hash Cracking",
        difficulty: "HARD",
        points: 300,
        answerMatchingMode: "EXACT",
        answer: { create: { answerText: "admin123" } },
        active: true
      },
      {
        levelNumber: 5,
        title: "FINAL PROTOCOL",
        description: "This is the final test. The answer is literally **FLAG{CRYPTIC_MASTER}**.",
        category: "Master",
        difficulty: "HARD",
        points: 500,
        answerMatchingMode: "EXACT",
        answer: { create: { answerText: "FLAG{CRYPTIC_MASTER}" } },
        active: true
      }
    ];

    for (const lvl of levels) {
      await prisma.level.create({ data: lvl });
    }

    return NextResponse.json({ message: "5 Levels successfully seeded!" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
