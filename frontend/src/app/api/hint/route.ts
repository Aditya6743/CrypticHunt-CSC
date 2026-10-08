import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

const rateLimit = new Map<string, number>();
const RATE_LIMIT_MS = 2000;

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "PARTICIPANT") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const teamIdStr = (session.user as any).id;
    const lastAttempt = rateLimit.get(teamIdStr);
    const now = Date.now();
    if (lastAttempt && now - lastAttempt < RATE_LIMIT_MS) {
      return NextResponse.json({ error: "Too many requests. Wait a moment." }, { status: 429 });
    }
    rateLimit.set(teamIdStr, now);

    const body = await req.json();
    const { levelId } = body;

    const team = await prisma.team.findUnique({ where: { id: (session.user as any).id } });
    const level = await prisma.level.findUnique({ where: { id: levelId }, include: { hints: { orderBy: { hintNumber: 'asc' } } } });

    if (!team || !level) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (level.levelNumber !== team.currentLevel) return NextResponse.json({ error: "Invalid level" }, { status: 403 });

    // Get unlocked hints
    const unlockedHintUsages = await prisma.hintUsage.findMany({ where: { teamId: team.id, levelId: level.id } });
    const unlockedHintIds = unlockedHintUsages.map(hu => hu.hintId);

    // Find next available hint
    const nextHint = level.hints.find(h => !unlockedHintIds.includes(h.id));
    if (!nextHint) return NextResponse.json({ error: "No more hints available." }, { status: 404 });

    // Record usage. We DO NOT deduct from team.score immediately here to avoid negative global scores.
    // The penalty is subtracted from the level's final reward when they submit the correct answer.
    await prisma.hintUsage.create({
      data: {
        teamId: team.id,
        levelId: level.id,
        hintId: nextHint.id,
        penalty: nextHint.penalty
      }
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
