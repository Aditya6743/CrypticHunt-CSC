const fs = require('fs');

let content = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');

// Enhance Header
const oldHeader = `<header className="mb-12 flex justify-between items-center bg-[#0a0e17] border border-cyan-900/50 p-6 rounded-sm shadow-[0_0_20px_rgba(6,182,212,0.05)]">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-cyan-400 tracking-widest">CRYPTIC HUNT</h1>
            <p className="text-gray-500 mt-1 tracking-widest text-xs md:text-sm">TEAM: <span className="text-white font-bold">{team.teamName}</span></p>
          </div>
          <div className="text-right flex flex-col items-end gap-2">
            <p className="text-cyan-500 text-xs md:text-sm tracking-widest font-bold hidden sm:block">STATUS: ONLINE</p>
            <LogoutButton />
          </div>
        </header>`;

const newHeader = `<header className="relative mb-12 flex justify-between items-center bg-[#020305]/80 backdrop-blur-xl border border-white/5 p-6 md:p-8 rounded-sm shadow-2xl overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-violet-500 to-transparent opacity-50"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row w-full justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-6">
              <div className="hidden md:flex flex-col items-center justify-center w-16 h-16 border border-cyan-500/30 bg-cyan-950/20 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                <div className="w-8 h-8 border-2 border-cyan-400 rounded-full border-t-transparent animate-spin"></div>
              </div>
              <div>
                <h1 className="text-2xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-white tracking-widest uppercase mb-1">
                  {team.teamName}
                </h1>
                <p className="text-gray-500 tracking-[0.2em] text-[10px] md:text-xs flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]"></span>
                  NODE ID: {team.teamId}
                </p>
              </div>
            </div>
            
            <div className="flex flex-col items-start md:items-end gap-3 w-full md:w-auto mt-4 md:mt-0">
              <div className="flex items-center gap-3 px-4 py-1.5 bg-black/50 border border-white/5 rounded-sm">
                <span className="text-[10px] tracking-widest text-gray-500">OPERATOR</span>
                <span className="text-xs font-bold text-gray-300 uppercase">{team.leaderName}</span>
              </div>
              <div className="w-full sm:w-auto"><LogoutButton /></div>
            </div>
          </div>
        </header>`;

content = content.replace(oldHeader, newHeader);


// Enhance Main Box
const oldBox = `<div className="bg-[#0a0e17] border border-cyan-900/50 p-8 rounded-sm shadow-[0_0_30px_rgba(6,182,212,0.1)] mb-8">
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-2xl font-bold text-white tracking-widest">LEVEL {team.currentLevel} / 50</h2>
            <span className="text-cyan-500 text-sm">{progressPercentage}% COMPLETION</span>
          </div>`;

const newBox = `<div className="relative bg-[#030509]/80 backdrop-blur-2xl border border-white/10 p-8 md:p-10 rounded-sm shadow-[0_0_50px_rgba(0,0,0,0.8)] mb-8 overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute top-[-50%] left-[-10%] w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute bottom-[-50%] right-[-10%] w-96 h-96 bg-violet-500/10 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="relative z-10 flex justify-between items-end mb-4 border-b border-white/5 pb-4">
            <div>
              <p className="text-gray-500 text-[10px] tracking-[0.3em] uppercase mb-1">Current Protocol</p>
              <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-500 tracking-widest">
                LEVEL {team.currentLevel} <span className="text-gray-700">/ 50</span>
              </h2>
            </div>
            <div className="text-right">
              <span className="text-cyan-400 font-mono font-bold text-lg md:text-xl text-glow">{progressPercentage}%</span>
              <p className="text-gray-600 text-[9px] tracking-widest uppercase mt-1">COMPLETION</p>
            </div>
          </div>`;

content = content.replace(oldBox, newBox);


// Enhance Stats Grid
const oldGrid = `<div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <div className="border-l-2 border-cyan-500 pl-4">
              <p className="text-gray-500 text-xs tracking-widest mb-1">SCORE</p>
              <p className="text-2xl text-white font-bold">{team.score}</p>
            </div>
            <div className="border-l-2 border-violet-500 pl-4">
              <p className="text-gray-500 text-xs tracking-widest mb-1">RANK</p>
              <p className="text-2xl text-white font-bold">#{teamRank}</p>
            </div>
            <div className="border-l-2 border-gray-700 pl-4">
              <p className="text-gray-500 text-xs tracking-widest mb-1">HINTS USED</p>
              <p className="text-2xl text-white font-bold">{hintsCount}</p>
            </div>
            <div className="border-l-2 border-gray-700 pl-4">
              <p className="text-gray-500 text-xs tracking-widest mb-1">TIME ELAPSED</p>
              <p className="text-2xl text-white font-bold">
                {startTime ? <TimeElapsed startTime={startTime} /> : "NOT_STARTED"}
              </p>
            </div>
          </div>`;

const newGrid = `<div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
            <div className="bg-black/40 border border-white/5 p-4 rounded-sm border-t-2 border-t-cyan-500">
              <p className="text-gray-500 text-[10px] tracking-[0.2em] mb-2 uppercase">Score</p>
              <p className="text-3xl text-white font-black tracking-wider text-glow">{team.score}</p>
            </div>
            <div className="bg-black/40 border border-white/5 p-4 rounded-sm border-t-2 border-t-violet-500">
              <p className="text-gray-500 text-[10px] tracking-[0.2em] mb-2 uppercase">Rank</p>
              <p className="text-3xl text-white font-black tracking-wider drop-shadow-[0_0_10px_rgba(139,92,246,0.5)]">#{teamRank}</p>
            </div>
            <div className="bg-black/40 border border-white/5 p-4 rounded-sm border-t-2 border-t-amber-500/50">
              <p className="text-gray-500 text-[10px] tracking-[0.2em] mb-2 uppercase">Hints Used</p>
              <p className="text-3xl text-gray-300 font-bold tracking-wider">{hintsCount}</p>
            </div>
            <div className="bg-black/40 border border-white/5 p-4 rounded-sm border-t-2 border-t-gray-500/50">
              <p className="text-gray-500 text-[10px] tracking-[0.2em] mb-2 uppercase">Time Elapsed</p>
              <p className="text-2xl md:text-3xl text-gray-300 font-mono font-bold tracking-wider">
                {startTime ? <TimeElapsed startTime={startTime} /> : "00:00:00"}
              </p>
            </div>
          </div>`;
content = content.replace(oldGrid, newGrid);

// Enhance Button
const oldButton = `<Link href={\`/level/\${team.currentLevel}\`} className="block w-full py-4 text-center bg-cyan-600 hover:bg-cyan-500 text-black font-bold tracking-widest uppercase transition-all duration-300">
            [ CONTINUE CHALLENGE ]
          </Link>`;

const newButton = `<div className="relative z-10 mt-8 group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400 to-violet-500 rounded-sm blur opacity-40 group-hover:opacity-75 transition duration-300"></div>
            <Link href={\`/level/\${team.currentLevel}\`} className="relative block w-full py-5 text-center bg-[#020305] border border-cyan-500/30 group-hover:bg-cyan-500 transition-all duration-300">
              <span className="text-cyan-400 group-hover:text-black font-black tracking-[0.3em] uppercase text-sm drop-shadow-md">
                INITIATE PROTOCOL // CONTINUE
              </span>
            </Link>
          </div>`;
content = content.replace(oldButton, newButton);


fs.writeFileSync('src/app/dashboard/page.tsx', content);
console.log("Team dashboard upgraded");
