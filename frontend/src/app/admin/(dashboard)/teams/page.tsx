import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import TeamRow from "./TeamRow";
import ExportButtons from "./ExportButtons";

export default async function ManageTeams() {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "ADMIN") redirect("/admin/login");

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
    <div className="p-4 md:p-8 pt-8 md:pt-12 relative font-mono">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10 pb-2 relative">
        
        <div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-white tracking-[0.2em] uppercase drop-shadow-md">
            REGISTERED TEAMS
          </h1>
          <p className="text-[10px] text-gray-500 tracking-widest uppercase mt-2">
            Click a row to expand intel
          </p>
        </div>

        <ExportButtons teams={teams} />
      </div>

      <div className="bg-[#0a0e17] border border-cyan-900/50 rounded-sm overflow-x-auto min-h-[50vh] pb-48">
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
