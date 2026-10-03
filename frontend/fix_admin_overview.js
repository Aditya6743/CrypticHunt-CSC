const fs = require('fs');

let content = fs.readFileSync('src/app/admin/(dashboard)/page.tsx', 'utf8');

const oldHeader = `<h1 className="text-2xl text-cyan-500 font-bold tracking-widest mb-6">EVENT OVERVIEW</h1>`;
const newHeader = `<div className="flex items-center gap-4 mb-10 border-b border-white/5 pb-6">
        <div className="w-12 h-12 bg-cyan-950/30 border border-cyan-500/30 flex items-center justify-center rounded-sm">
          <div className="w-6 h-6 border-2 border-cyan-400 rounded-sm border-t-transparent animate-spin"></div>
        </div>
        <div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 tracking-widest uppercase">COMMAND CENTER</h1>
          <p className="text-[10px] font-mono text-cyan-500 tracking-[0.3em] uppercase mt-1">Global Event Telemetry</p>
        </div>
      </div>`;
content = content.replace(oldHeader, newHeader);


// The 4 boxes currently look like this:
// <div className="bg-[#0a0e17] border border-cyan-900/50 p-6 rounded-sm">...
// We'll replace the entire grid

const oldGrid = `<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#0a0e17] border border-cyan-900/50 p-6 rounded-sm">
          <h3 className="text-gray-500 text-xs tracking-widest mb-2">REGISTERED TEAMS</h3>
          <p className="text-4xl text-white font-bold">{teamsCount}</p>
        </div>
        <div className="bg-[#0a0e17] border border-cyan-900/50 p-6 rounded-sm">
          <h3 className="text-gray-500 text-xs tracking-widest mb-2">ACTIVE LEVELS</h3>
          <p className="text-4xl text-white font-bold">{levelsCount} / 50</p>
        </div>
        <div className="bg-[#0a0e17] border border-cyan-900/50 p-6 rounded-sm">
          <h3 className="text-gray-500 text-xs tracking-widest mb-2 flex justify-between">
            LEADERBOARD
            <span className={isFrozen ? 'text-blue-500' : 'text-green-500'}>{isFrozen ? 'FROZEN' : 'LIVE'}</span>
          </h3>
          <p className="text-2xl text-white font-bold mb-4">{isFrozen ? 'FROZEN' : 'ACTIVE'}</p>
          <form action={toggleFreezeState}>
            <input type="hidden" name="freeze" value={isFrozen ? "false" : "true"} />
            <button type="submit" className={\`px-4 py-2 text-xs font-bold tracking-widest transition-colors \${isFrozen ? 'bg-green-900/40 text-green-400 hover:bg-green-900/60 border border-green-500/50' : 'bg-blue-900/40 text-blue-400 hover:bg-blue-900/60 border border-blue-500/50'}\`}>
              {isFrozen ? "UNFREEZE" : "FREEZE LEADERBOARD"}
            </button>
          </form>
        </div>

        <div className="bg-[#0a0e17] border border-cyan-900/50 p-6 rounded-sm">
          <h3 className="text-gray-500 text-xs tracking-widest mb-2">EVENT STATUS</h3>
          <p className={\`text-2xl font-bold uppercase tracking-widest mb-4 \${currentStatus === 'LIVE' ? 'text-green-500' : 'text-red-500'}\`}>
            {currentStatus}
          </p>
          <form action={toggleEventState}>
            <input type="hidden" name="status" value={currentStatus === "LIVE" ? "NOT_STARTED" : "LIVE"} />
            <button type="submit" className={\`px-4 py-2 text-xs font-bold tracking-widest transition-colors \${currentStatus === 'LIVE' ? 'bg-red-900/40 text-red-400 hover:bg-red-900/60 border border-red-500/50' : 'bg-green-900/40 text-green-400 hover:bg-green-900/60 border border-green-500/50'}\`}>
              {currentStatus === "LIVE" ? "HALT EVENT" : "INITIATE EVENT"}
            </button>
          </form>
        </div>
      </div>`;

const newGrid = `<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {/* Teams Metric */}
        <div className="relative bg-[#020305]/60 backdrop-blur-md border border-white/5 p-6 rounded-sm overflow-hidden group hover:border-cyan-500/30 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          </div>
          <h3 className="text-gray-500 text-[10px] font-bold tracking-[0.2em] mb-3 uppercase">Registered Teams</h3>
          <p className="text-4xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-500 font-black tracking-tighter drop-shadow-sm">{teamsCount}</p>
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-cyan-500 to-transparent"></div>
        </div>

        {/* Levels Metric */}
        <div className="relative bg-[#020305]/60 backdrop-blur-md border border-white/5 p-6 rounded-sm overflow-hidden group hover:border-violet-500/30 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
          </div>
          <h3 className="text-gray-500 text-[10px] font-bold tracking-[0.2em] mb-3 uppercase">Active Levels</h3>
          <p className="text-4xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-500 font-black tracking-tighter drop-shadow-sm">{levelsCount} <span className="text-2xl text-gray-700">/ 50</span></p>
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-violet-500 to-transparent"></div>
        </div>

        {/* Leaderboard Control */}
        <div className="relative bg-[#020305]/60 backdrop-blur-md border border-white/5 p-6 rounded-sm overflow-hidden flex flex-col justify-between">
          <div>
            <h3 className="text-gray-500 text-[10px] font-bold tracking-[0.2em] mb-3 uppercase flex justify-between items-center">
              Leaderboard
              <span className={\`w-2 h-2 rounded-full \${isFrozen ? 'bg-blue-500 shadow-[0_0_8px_#3b82f6]' : 'bg-green-500 shadow-[0_0_8px_#22c55e] animate-pulse'}\`}></span>
            </h3>
            <p className={\`text-xl md:text-2xl font-black uppercase tracking-widest mb-4 \${isFrozen ? 'text-blue-400' : 'text-gray-300'}\`}>
              {isFrozen ? 'FROZEN' : 'ACTIVE'}
            </p>
          </div>
          <form action={toggleFreezeState} className="mt-auto">
            <input type="hidden" name="freeze" value={isFrozen ? "false" : "true"} />
            <button type="submit" className={\`w-full py-3 text-[10px] font-black tracking-[0.2em] transition-all \${isFrozen ? 'bg-green-900/20 text-green-400 hover:bg-green-500 hover:text-black border border-green-500/50' : 'bg-blue-900/20 text-blue-400 hover:bg-blue-500 hover:text-black border border-blue-500/50'}\`}>
              {isFrozen ? "UNFREEZE BOARD" : "FREEZE BOARD"}
            </button>
          </form>
        </div>

        {/* Global Event Control */}
        <div className="relative bg-[#020305]/60 backdrop-blur-md border border-white/5 p-6 rounded-sm overflow-hidden flex flex-col justify-between">
          <div>
            <h3 className="text-gray-500 text-[10px] font-bold tracking-[0.2em] mb-3 uppercase flex justify-between items-center">
              Event Status
              <span className={\`w-2 h-2 rounded-full \${currentStatus === 'LIVE' ? 'bg-green-500 shadow-[0_0_8px_#22c55e] animate-pulse' : 'bg-red-500 shadow-[0_0_8px_#ef4444]'}\`}></span>
            </h3>
            <p className={\`text-xl md:text-2xl font-black uppercase tracking-widest mb-4 \${currentStatus === 'LIVE' ? 'text-green-400' : 'text-red-400'}\`}>
              {currentStatus}
            </p>
          </div>
          <form action={toggleEventState} className="mt-auto">
            <input type="hidden" name="status" value={currentStatus === "LIVE" ? "NOT_STARTED" : "LIVE"} />
            <button type="submit" className={\`w-full py-3 text-[10px] font-black tracking-[0.2em] transition-all \${currentStatus === 'LIVE' ? 'bg-red-900/20 text-red-500 hover:bg-red-500 hover:text-black border border-red-500/50' : 'bg-green-900/20 text-green-400 hover:bg-green-500 hover:text-black border border-green-500/50'}\`}>
              {currentStatus === "LIVE" ? "HALT EVENT" : "INITIATE EVENT"}
            </button>
          </form>
        </div>
      </div>`;

content = content.replace(oldGrid, newGrid);

fs.writeFileSync('src/app/admin/(dashboard)/page.tsx', content);
console.log("Admin overview upgraded");
