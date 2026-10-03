const fs = require('fs');
const path = require('path');

const write = (filePath, content) => {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content.trim() + '\n');
  console.log(`Updated ${filePath}`);
};

// 1. ADMIN RESET PASSWORD API
write('src/app/api/admin/reset-password/route.ts', `
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { teamId, newPassword } = await req.json();

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await prisma.team.update({
      where: { id: teamId },
      data: { passwordHash }
    });

    // Close any open reset requests
    await prisma.report.updateMany({
      where: { teamId, message: "PASSWORD_RESET", status: "OPEN" },
      data: { status: "RESOLVED" }
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
`);

// 2. RESET BUTTON CLIENT COMPONENT
write('src/app/admin/(dashboard)/teams/ResetButton.tsx', `
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ResetButton({ teamId, teamName, hasRequest }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleReset = async () => {
    const newPass = prompt(\`Enter new password for \${teamName}:\`);
    if (!newPass) return;

    setLoading(true);
    try {
      const res = await fetch("/api/admin/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId, newPassword: newPass })
      });
      if (res.ok) {
        alert("Password reset successfully!");
        router.refresh();
      } else {
        alert("Failed to reset password.");
      }
    } catch {
      alert("Error resetting password.");
    }
    setLoading(false);
  };

  return (
    <button 
      onClick={handleReset}
      disabled={loading}
      className={\`px-3 py-1 text-xs tracking-widest uppercase transition-colors border \${hasRequest ? 'bg-red-900/40 text-red-400 border-red-500/50 hover:bg-red-900/60 animate-pulse' : 'bg-cyan-900/20 text-cyan-500 border-cyan-800 hover:bg-cyan-900/50'}\`}
    >
      {loading ? "..." : "Reset Pass"}
    </button>
  );
}
`);

// 3. UPDATE TEAMS PAGE
write('src/app/admin/(dashboard)/teams/page.tsx', `
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import ResetButton from "./ResetButton";

export default async function ManageTeams() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") redirect("/admin/login");

  const teams = await prisma.team.findMany({
    orderBy: { score: 'desc' },
    include: {
      reports: {
        where: { message: "PASSWORD_RESET", status: "OPEN" }
      }
    }
  });

  return (
    <div>
      <h1 className="text-2xl text-cyan-500 font-bold tracking-widest mb-6">REGISTERED TEAMS</h1>

      <div className="bg-[#0a0e17] border border-cyan-900/50 rounded-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-sm min-w-[800px]">
          <thead className="bg-[#020305] border-b border-cyan-900/30 text-cyan-500 text-xs tracking-widest">
            <tr>
              <th className="p-4">TEAM ID</th>
              <th className="p-4">NAME</th>
              <th className="p-4">LEADER</th>
              <th className="p-4">LEVEL</th>
              <th className="p-4">SCORE</th>
              <th className="p-4 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {teams.map(team => {
              const hasResetRequest = team.reports.length > 0;
              return (
                <tr key={team.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 text-gray-400 font-mono text-xs">
                    {team.teamId}
                    {hasResetRequest && <span className="ml-2 inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse" title="Password Reset Requested"></span>}
                  </td>
                  <td className="p-4 text-white font-bold">{team.teamName}</td>
                  <td className="p-4 text-gray-400">{team.leaderName}</td>
                  <td className="p-4 text-cyan-400">Lvl {team.currentLevel}</td>
                  <td className="p-4 text-amber-400 font-bold">{team.score}</td>
                  <td className="p-4 text-right">
                    <ResetButton teamId={team.id} teamName={team.teamName} hasRequest={hasResetRequest} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
`);
console.log("Done phase 2");
