import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const l3 = await prisma.level.findUnique({ where: { levelNumber: 3 } });
    if (!l3) return NextResponse.json({ error: "Level 3 not found" });

    // Delete existing answers
    await prisma.acceptedAnswer.deleteMany({ where: { levelId: l3.id } });
    
    // Create 'decodethis'
    await prisma.acceptedAnswer.create({
      data: {
        levelId: l3.id,
        answer: "decodethis"
      }
    });

    return NextResponse.json({ success: true, message: "Level 3 fixed successfully!" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
