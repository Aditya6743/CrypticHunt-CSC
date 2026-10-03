const fs = require('fs');

let content = fs.readFileSync('src/app/page.tsx', 'utf8');

const oldAuth = `{session ? (
            <div className="flex flex-col items-center justify-center w-full max-w-sm mx-auto bg-[#020305]/80 backdrop-blur-md border border-cyan-900/50 rounded-sm p-6">
              <p className="text-gray-500 text-xs tracking-widest uppercase mb-1">Authenticated as</p>
              <p className="text-cyan-400 text-lg font-bold tracking-widest mb-6">{session.user.name}</p>
              <div className="flex gap-4 w-full">
                <Link href={session.user.role === "ADMIN" ? "/admin" : "/dashboard"} className="flex-1 text-center py-2 bg-cyan-900/30 border border-cyan-600 hover:bg-cyan-800/50 text-cyan-400 text-xs tracking-widest uppercase transition-colors">
                  Dashboard
                </Link>
                <div className="flex-1 flex">
                  <span className="w-full"><LogoutButton /></span>
                </div>
              </div>
            </div>
          ) :`;

const newAuth = `{session ? (
            <div className="relative group w-full max-w-sm mx-auto mt-4">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-violet-500 to-cyan-500 rounded-sm blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 animate-gradient-x"></div>
              <div className="relative flex flex-col items-center justify-center w-full bg-[#020305]/90 backdrop-blur-xl border border-white/10 rounded-sm p-8 shadow-2xl">
                
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-violet-500"></div>
                
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_10px_#4ade80]"></div>
                  <p className="text-gray-400 text-[10px] tracking-[0.3em] font-mono uppercase">CONNECTION ESTABLISHED</p>
                </div>
                
                <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-white tracking-widest uppercase mb-8 drop-shadow-md text-center break-all">
                  {session.user.name}
                </h3>
                
                <div className="flex flex-col sm:flex-row gap-4 w-full">
                  <Link 
                    href={session.user.role === "ADMIN" ? "/admin" : "/dashboard"} 
                    className="flex-1 relative flex items-center justify-center px-6 py-3 bg-cyan-500 hover:bg-cyan-400 transition-colors rounded-sm"
                  >
                    <span className="text-black font-black uppercase tracking-[0.2em] text-xs">ACCESS HUD</span>
                  </Link>
                  
                  <div className="flex-1 relative flex">
                    <LogoutButton className="w-full flex items-center justify-center px-6 py-3 bg-transparent border border-gray-700 hover:border-red-500 hover:bg-red-950/30 text-gray-400 hover:text-red-400 font-bold uppercase tracking-[0.2em] text-xs transition-all rounded-sm" />
                  </div>
                </div>

                <div className="absolute bottom-2 right-3 opacity-20 text-[8px] font-mono text-cyan-500 tracking-widest">SECURE_SESSION_ACTIVE</div>
              </div>
            </div>
          ) :`;

content = content.replace(oldAuth, newAuth);
fs.writeFileSync('src/app/page.tsx', content);
console.log("Premium widget applied");
