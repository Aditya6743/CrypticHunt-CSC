"use client";
import { useState } from "react";
import ResetButton from "./ResetButton";

export default function TeamRow({ team }: { team: any }) {
  const [expanded, setExpanded] = useState(false);
  const hasResetRequest = team.reports.length > 0;

  return (
    <>
      <tr 
        onClick={() => setExpanded(!expanded)} 
        className={`hover:bg-cyan-900/10 transition-colors cursor-pointer border-b border-gray-900/50 ${expanded ? 'bg-cyan-900/5' : ''}`}
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
          {hasResetRequest ? (
            <ResetButton teamId={team.id} teamName={team.teamName} hasRequest={hasResetRequest} />
          ) : (
            <span className="text-gray-700 text-xs font-mono tracking-widest">[-]</span>
          )}
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
                  {team.members.map((m: any) => (
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
