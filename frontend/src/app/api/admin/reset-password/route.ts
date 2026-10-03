import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import bcrypt from "bcrypt";
import crypto from "crypto";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { teamId, customPassword } = await req.json();

    const newPassword = customPassword && customPassword.trim().length > 0 
      ? customPassword.trim() 
      : "SYS-" + crypto.randomBytes(3).toString("hex").toUpperCase();
    const passwordHash = await bcrypt.hash(newPassword, 10);

    await prisma.team.update({
      where: { id: teamId },
      data: { passwordHash }
    });

    // Close any open reset requests and save the password inside the report temporarily
    await prisma.report.updateMany({
      where: { teamId, message: "PASSWORD_RESET", status: "OPEN" },
      data: { status: "RESOLVED", message: `PASSWORD_RESET:${newPassword}` }
    });

    return NextResponse.json({ success: true, newPassword });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
