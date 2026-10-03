const fs = require('fs');
const path = require('path');

const write = (filePath, content) => {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content.trim() + '\n');
  console.log(`Updated ${filePath}`);
};

// 1. CREATE TeamRow.tsx
write('src/app/admin/(dashboard)/teams/TeamRow.tsx', `
"use client";
import { useState } from "react";
import ResetButton from "./ResetButton";

export default function TeamRow({ team }) {
  const [expanded, setExpanded] = useState(false);
  const hasResetRequest = team.reports.length > 0;

  return (
    <>
      <tr 
        onClick={() => setExpanded(!expanded)} 
        className={\`hover:bg-cyan-900/10 transition-colors cursor-pointer border-b border-gray-900/50 \${expanded ? 'bg-cyan-900/5' : ''}\`}
      >
        <td className="p-4 text-gray-400 font-mono text-xs">
          <span className="text-cyan-600 mr-2">{expanded ? '▼' : '▶'}</span>
          {team.teamId}
          {hasResetRequest && <span className="ml-2 inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse" title="Password Reset Requested"></span>}
        </td>
        <td className="p-4 text-white font-bold">{team.teamName}</td>
        <td className="p-4 text-gray-400">{team.leaderName}</td>
        <td className="p-4 text-cyan-400">Lvl {team.currentLevel}</td>
        <td className="p-4 text-amber-400 font-bold">{team.score}</td>
        <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
          <ResetButton teamId={team.id} teamName={team.teamName} hasRequest={hasResetRequest} />
        </td>
      </tr>
      {expanded && (
        <tr className="bg-[#020305]">
          <td colSpan={6} className="p-6 border-b border-cyan-900/30 shadow-inner">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm font-mono max-w-4xl">
              <div className="bg-[#0a0e17] border border-cyan-900/30 p-4 rounded-sm">
                <h4 className="text-cyan-500 text-xs tracking-widest mb-3 border-b border-cyan-900/30 pb-2">CONTACT INTEL</h4>
                <p className="text-gray-400 mb-2"><span className="text-gray-600 w-24 inline-block">EMAIL:</span> <span className="text-white">{team.leaderEmail}</span></p>
                <p className="text-gray-400 mb-2"><span className="text-gray-600 w-24 inline-block">PHONE:</span> <span className="text-white">{team.contactNumber}</span></p>
                <p className="text-gray-400 mb-2"><span className="text-gray-600 w-24 inline-block">INSTITUTE:</span> <span className="text-white">{team.college}</span></p>
                <p className="text-gray-400"><span className="text-gray-600 w-24 inline-block">JOINED:</span> <span className="text-white">{new Date(team.createdAt).toLocaleString()}</span></p>
              </div>
              <div className="bg-[#0a0e17] border border-cyan-900/30 p-4 rounded-sm">
                <h4 className="text-cyan-500 text-xs tracking-widest mb-3 border-b border-cyan-900/30 pb-2">SQUAD ROSTER ({team.members.length + 1})</h4>
                <ul className="text-gray-300 space-y-2 list-none">
                  <li className="flex items-center gap-2 text-cyan-300"><span className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></span> {team.leaderName} (Leader)</li>
                  {team.members.map(m => (
                    <li key={m.id} className="flex items-center gap-2"><span className="w-1 h-1 bg-gray-600 rounded-full ml-0.5"></span> {m.name}</li>
                  ))}
                </ul>
                {team.members.length === 0 && (
                  <p className="text-gray-600 italic text-xs mt-2">No additional members.</p>
                )}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
`);

// 2. UPDATE TEAMS PAGE
write('src/app/admin/(dashboard)/teams/page.tsx', `
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import TeamRow from "./TeamRow";

export default async function ManageTeams() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") redirect("/admin/login");

  const teams = await prisma.team.findMany({
    orderBy: { score: 'desc' },
    include: {
      reports: {
        where: { message: "PASSWORD_RESET", status: "OPEN" }
      },
      members: true
    }
  });

  return (
    <div>
      <div className="flex justify-between items-end mb-6">
        <h1 className="text-2xl text-cyan-500 font-bold tracking-widest">REGISTERED TEAMS</h1>
        <p className="text-xs text-gray-500 tracking-widest uppercase">Click a row to expand intel</p>
      </div>

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
            {teams.map(team => (
              <TeamRow key={team.id} team={team} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
`);

console.log("Team details expandable row built successfully!");
