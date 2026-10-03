const fs = require('fs');

let content = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');

// The bloated header I added previously
const bloatedHeader = `<header className="mb-12 border-b border-cyan-900/50 pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
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

// A cleaner version matching the original aesthetic but with a simple Logout button
const cleanHeader = `<header className="mb-12 flex justify-between items-center bg-[#0a0e17] border border-cyan-900/50 p-6 rounded-sm shadow-[0_0_20px_rgba(6,182,212,0.05)]">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-cyan-400 tracking-widest">CRYPTIC HUNT</h1>
            <p className="text-gray-500 mt-1 tracking-widest text-xs md:text-sm">TEAM: <span className="text-white font-bold">{team.teamName}</span></p>
          </div>
          <div className="text-right flex flex-col items-end gap-2">
            <p className="text-cyan-500 text-xs md:text-sm tracking-widest font-bold hidden sm:block">STATUS: ONLINE</p>
            <LogoutButton />
          </div>
        </header>`;

content = content.replace(bloatedHeader, cleanHeader);
fs.writeFileSync('src/app/dashboard/page.tsx', content);

// Now update the LogoutButton component text
let logoutContent = fs.readFileSync('src/components/LogoutButton.tsx', 'utf8');
logoutContent = logoutContent.replace('[ Terminate Session ]', 'LOGOUT');
logoutContent = logoutContent.replace(
  'className="text-red-500 hover:text-red-400 text-xs tracking-widest uppercase transition-colors border border-red-900/50 hover:bg-red-950/30 px-3 py-1 rounded-sm mt-3"',
  'className="text-gray-400 hover:text-white text-xs tracking-widest uppercase transition-colors border border-gray-800 hover:border-gray-600 bg-black/50 hover:bg-gray-900 px-4 py-2 rounded-sm"'
);
fs.writeFileSync('src/components/LogoutButton.tsx', logoutContent);

console.log("Cleaned up dashboard and logout");
