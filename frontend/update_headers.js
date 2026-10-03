const fs = require('fs');

// --- LevelClient.tsx ---
let levelClient = fs.readFileSync('src/app/admin/(dashboard)/levels/LevelClient.tsx', 'utf8');

const levelStart = `    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl text-cyan-500 font-bold tracking-widest">MANAGE LEVELS</h1>
        <button onClick={() => openModal()} className="px-4 py-2 bg-cyan-600 text-black font-bold tracking-widest uppercase text-xs hover:bg-cyan-500 transition-colors">
          + ADD NEW LEVEL
        </button>
      </div>`;

const newLevelStart = `    <div className="p-4 md:p-8 pt-24 md:pt-32 relative font-mono">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10 border-b border-cyan-900/30 pb-6 relative">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
        <div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-white tracking-[0.2em] uppercase drop-shadow-md">
            MANAGE LEVELS
          </h1>
          <p className="text-[10px] text-gray-500 tracking-widest uppercase mt-2">
            Configure Challenges & Validation
          </p>
        </div>
        <button onClick={() => openModal()} className="px-5 py-2.5 bg-[#0a0e17] border border-cyan-500/50 hover:bg-cyan-500 text-cyan-500 hover:text-black font-bold tracking-[0.2em] uppercase text-[10px] transition-all shadow-[0_0_15px_rgba(6,182,212,0.1)]">
          + ADD NEW LEVEL
        </button>
      </div>`;

levelClient = levelClient.replace(levelStart, newLevelStart);
fs.writeFileSync('src/app/admin/(dashboard)/levels/LevelClient.tsx', levelClient);

// --- teams/page.tsx ---
let teamsPage = fs.readFileSync('src/app/admin/(dashboard)/teams/page.tsx', 'utf8');

const teamStart = `    <div>
      <div className="flex justify-between items-end mb-6">
        <h1 className="text-2xl text-cyan-500 font-bold tracking-widest">REGISTERED TEAMS</h1>
        <p className="text-xs text-gray-500 tracking-widest uppercase">Click a row to expand intel</p>
      </div>`;

const newTeamStart = `    <div className="p-4 md:p-8 pt-24 md:pt-32 relative font-mono">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10 border-b border-cyan-900/30 pb-6 relative">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
        <div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-white tracking-[0.2em] uppercase drop-shadow-md">
            REGISTERED TEAMS
          </h1>
          <p className="text-[10px] text-gray-500 tracking-widest uppercase mt-2">
            Click a row to expand intel
          </p>
        </div>
      </div>`;

teamsPage = teamsPage.replace(teamStart, newTeamStart);
fs.writeFileSync('src/app/admin/(dashboard)/teams/page.tsx', teamsPage);

console.log("Updated headers and padding for Levels and Teams pages");
