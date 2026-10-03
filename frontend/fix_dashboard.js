const fs = require('fs');

let content = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');

// Add import
content = content.replace(
  'import Link from "next/link";',
  'import Link from "next/link";\nimport LogoutButton from "@/components/LogoutButton";'
);

// Update header
const oldHeader = `        <header className="mb-12 border-b border-cyan-900/50 pb-6 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-cyan-400 tracking-widest">CRYPTIC HUNT</h1>
            <p className="text-gray-500 mt-2 tracking-widest">Team: <span className="text-white">{team.teamName}</span></p>
          </div>
          <div className="text-right">
            <p className="text-cyan-500 text-sm">STATUS: ONLINE</p>
            <p className="text-xs text-gray-600 mt-1">NODE: {team.teamId}</p>
          </div>
        </header>`;

const newHeader = `        <header className="mb-12 border-b border-cyan-900/50 pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-3xl font-bold text-cyan-400 tracking-widest">CRYPTIC HUNT</h1>
            <div className="mt-4 space-y-1">
              <p className="text-gray-500 text-sm tracking-widest">TEAM: <span className="text-white font-bold">{team.teamName}</span></p>
              <p className="text-gray-600 text-xs tracking-widest uppercase">LEADER: <span className="text-gray-300">{team.leaderName}</span></p>
              <p className="text-gray-600 text-xs tracking-widest uppercase">EMAIL: <span className="text-gray-300">{team.leaderEmail}</span></p>
            </div>
          </div>
          <div className="text-left md:text-right flex flex-col items-start md:items-end">
            <p className="text-cyan-500 text-sm tracking-widest font-bold">STATUS: ONLINE</p>
            <p className="text-xs text-gray-500 mt-1 tracking-widest">NODE ID: <span className="text-gray-300">{team.teamId}</span></p>
            <LogoutButton />
          </div>
        </header>`;

content = content.replace(oldHeader, newHeader);
fs.writeFileSync('src/app/dashboard/page.tsx', content);
console.log("Dashboard fixed");
