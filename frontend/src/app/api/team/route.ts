import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcrypt";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { teamName, leaderName, contactNumber, college, password, teamMembers } = body;
    let { leaderEmail } = body;
    leaderEmail = leaderEmail ? leaderEmail.toLowerCase().trim() : "";

    // For SQLite, case-insensitive check requires fetching or comparing
    const allTeams = await prisma.team.findMany({
      select: { teamName: true, leaderEmail: true }
    });
    
    const isDuplicate = allTeams.some(t => 
      t.teamName.toLowerCase() === teamName.toLowerCase().trim() || 
      t.leaderEmail === leaderEmail
    );

    if (isDuplicate) {
      return NextResponse.json({ error: "Team name or email already exists" }, { status: 400 });
    }

    const teamId = "CH-" + crypto.randomBytes(3).toString("hex").toUpperCase();
    const passwordHash = await bcrypt.hash(password, 10);
    const finalTeamName = teamName.trim();

    const team = await prisma.team.create({
      data: {
        teamId,
        teamName: finalTeamName,
        leaderName,
        leaderEmail,
        contactNumber,
        college,
        passwordHash,
        members: {
          create: teamMembers
            ? teamMembers.split(',').map((name: string) => ({ name: name.trim() })).filter((n: any) => n.name.length > 0)
            : []
        }
      }
    });

    return NextResponse.json({ success: true, teamId: team.teamId });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
