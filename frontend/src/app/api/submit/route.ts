import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// Simple in-memory rate limiter (teamId -> timestamp)
const rateLimit = new Map<string, number>();
const RATE_LIMIT_MS = 2000; // 2 seconds between attempts

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { answer, levelId } = body;

    // Rate Limiting Check
    const lastAttempt = rateLimit.get((session.user as any).id);
    const now = Date.now();
    if (lastAttempt && now - lastAttempt < RATE_LIMIT_MS) {
      return NextResponse.json({ error: "Too many attempts. Wait a moment." }, { status: 429 });
    }
    rateLimit.set((session.user as any).id, now);

    // PRD: Event Status Check
    const event = await prisma.event.findFirst();
    if (!event || event.status !== "LIVE") {
      return NextResponse.json({ error: "Submissions are currently disabled (Event is not LIVE)." }, { status: 403 });
    }

    const team = await prisma.team.findUnique({
      where: { id: (session.user as any).id }
    });

    if (!team) return NextResponse.json({ error: "Team not found" }, { status: 404 });

    const level = await prisma.level.findUnique({
      where: { id: levelId },
      include: { answers: true }
    });

    if (!level) return NextResponse.json({ error: "Level not found" }, { status: 404 });

    if (level.levelNumber !== team.currentLevel) {
      return NextResponse.json({ error: "Cannot submit for this level" }, { status: 403 });
    }

    // Validation
    let isCorrect = false;
    
    if (level.answerMatchingMode === "CASE_INSENSITIVE") {
      isCorrect = level.answers.some(a => a.answer.toLowerCase() === answer.toLowerCase().trim());
    } else {
      isCorrect = level.answers.some(a => a.answer === answer.trim());
    }

    // Record submission
    await prisma.submission.create({
      data: {
        teamId: team.id,
        levelId: level.id,
        submittedAnswer: answer,
        correct: isCorrect
      }
    });

    if (isCorrect) {
      // Calculate hint penalties
      const hintUsages = await prisma.hintUsage.aggregate({
        where: { teamId: team.id, levelId: level.id },
        _sum: { penalty: true }
      });
      const totalPenalty = hintUsages._sum.penalty || 0;
      const pointsAwarded = Math.max(0, level.points - totalPenalty); // Don't let score drop below 0 for a level

      await prisma.team.update({
        where: { id: team.id },
        data: {
          currentLevel: team.currentLevel + 1,
          score: team.score + pointsAwarded
        }
      });
      
      await prisma.levelProgress.create({
        data: {
          teamId: team.id,
          levelId: level.id,
          completed: true,
          pointsAwarded: pointsAwarded
        }
      });
      
      return NextResponse.json({ correct: true, message: "Correct!" });
    } else {
      return NextResponse.json({ correct: false, message: "Incorrect" });
    }
    
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
