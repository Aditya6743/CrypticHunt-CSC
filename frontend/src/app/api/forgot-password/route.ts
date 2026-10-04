import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

import { NextRequest } from "next/server";
export async function POST(req: NextRequest) {
  try {
    const { identifier } = await req.json();
    const identStr = identifier ? identifier.trim() : "";

    const team = await prisma.team.findFirst({
      where: {
        OR: [
          { teamId: identStr.toUpperCase() },
          { leaderEmail: identStr.toLowerCase() }
        ]
      }
    });

    if (!team) {
      return NextResponse.json({ error: "Team ID or Email not found in the system." }, { status: 404 });
    }

    const report = await prisma.report.findFirst({
      where: {
        teamId: team.id,
        message: { startsWith: "PASSWORD_RESET" },
        status: { in: ["OPEN", "RESOLVED"] }
      },
      orderBy: { createdAt: 'desc' }
    });

    if (report) {
      if (report.status === "OPEN") {
        return NextResponse.json({ status: "pending" });
      }
      if (report.status === "RESOLVED") {
        const newPass = report.message.split(":")[1];
        // Mark as closed so it disappears after they view it once
        await prisma.report.update({
          where: { id: report.id },
          data: { status: "CLOSED", message: "PASSWORD_RESET_COMPLETED" }
        });
        return NextResponse.json({ status: "resolved", newPassword: newPass });
      }
    }

    // No existing report found, create a new one
    await prisma.report.create({
      data: {
        teamId: team.id,
        message: "PASSWORD_RESET",
        status: "OPEN"
      }
    });

    return NextResponse.json({ status: "requested" });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
