const fs = require('fs');

let content = fs.readFileSync('src/app/level/[id]/page.tsx', 'utf8');

const old404 = `  if (!level) {
    return (
      <div className="min-h-screen bg-[#05070B] text-white flex items-center justify-center font-mono relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#05070B 2px, transparent 2px), linear-gradient(90deg, #05070B 2px, transparent 2px)', backgroundSize: '40px 40px', backgroundColor: 'rgba(255, 0, 0, 0.05)' }}></div>
        <div className="text-center z-10 border border-red-900/50 p-12 bg-[#0a0e17] rounded-sm shadow-[0_0_30px_rgba(255,0,0,0.1)]">
          <h1 className="text-4xl text-red-500 mb-4 font-bold tracking-widest">404 - LEVEL NOT FOUND</h1>
          <p className="text-gray-400">THE REQUESTED CIPHER PROTOCOL DOES NOT EXIST.</p>
        </div>
      </div>
    );
  }`;

const new404 = `  if (!level) {
    // Check if this is because they beat the final level
    const maxLevel = await prisma.level.aggregate({ _max: { levelNumber: true } });
    
    if (maxLevel._max.levelNumber && levelIdParam > maxLevel._max.levelNumber) {
      return (
        <div className="min-h-screen bg-[#05070B] text-white flex items-center justify-center font-mono relative overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#05070B 2px, transparent 2px), linear-gradient(90deg, #05070B 2px, transparent 2px)', backgroundSize: '40px 40px', backgroundColor: 'rgba(0, 255, 255, 0.05)' }}></div>
          <div className="text-center z-10 border border-cyan-900/50 p-16 bg-[#0a0e17] rounded-sm shadow-[0_0_50px_rgba(6,182,212,0.2)] max-w-2xl">
            <h1 className="text-5xl text-cyan-400 mb-6 font-bold tracking-widest uppercase shadow-cyan-500/50 drop-shadow-md animate-pulse">HUNT COMPLETE</h1>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              Congratulations. You have successfully decrypted all available protocols and reached the end of the Cryptic Hunt.
            </p>
            <div className="text-cyan-600 font-bold text-2xl tracking-[0.5em] mb-8">
              {team.score} PTS
            </div>
            <a href="/leaderboard" className="inline-block px-8 py-3 bg-cyan-900/30 border border-cyan-600 hover:bg-cyan-800/60 text-cyan-400 tracking-widest uppercase transition-all">
              VIEW FINAL STANDINGS
            </a>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-[#05070B] text-white flex items-center justify-center font-mono relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#05070B 2px, transparent 2px), linear-gradient(90deg, #05070B 2px, transparent 2px)', backgroundSize: '40px 40px', backgroundColor: 'rgba(255, 0, 0, 0.05)' }}></div>
        <div className="text-center z-10 border border-red-900/50 p-12 bg-[#0a0e17] rounded-sm shadow-[0_0_30px_rgba(255,0,0,0.1)]">
          <h1 className="text-4xl text-red-500 mb-4 font-bold tracking-widest">404 - LEVEL NOT FOUND</h1>
          <p className="text-gray-400">THE REQUESTED CIPHER PROTOCOL DOES NOT EXIST.</p>
        </div>
      </div>
    );
  }`;

content = content.replace(old404, new404);
fs.writeFileSync('src/app/level/[id]/page.tsx', content);
console.log("404 handled");
