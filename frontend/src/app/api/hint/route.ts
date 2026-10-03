import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "PARTICIPANT") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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

    // Record usage and deduct penalty from team score immediately
    await prisma.$transaction([
      prisma.hintUsage.create({
        data: {
          teamId: team.id,
          levelId: level.id,
          hintId: nextHint.id,
          penalty: nextHint.penalty
        }
      }),
      prisma.team.update({
        where: { id: team.id },
        data: { score: { decrement: nextHint.penalty } }
      })
    ]);

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
