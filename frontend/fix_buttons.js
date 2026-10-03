const fs = require('fs');

let page = fs.readFileSync('src/app/admin/(dashboard)/page.tsx', 'utf8');

const freezeButton = `              <button type="submit" className={\`w-full py-2.5 text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-300 border \${isFrozen ? "bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-black border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]" : "bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-black border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.2)]"}\`}>
                [ {isFrozen ? "UNFREEZE BOARD" : "FREEZE BOARD"} ]
              </button>`;

const newFreezeButton = `              <button type="submit" className={\`w-full py-2.5 text-[10px] font-bold tracking-[0.2em] uppercase transition-colors border \${isFrozen ? "bg-transparent text-amber-500 hover:bg-amber-500 hover:text-black border-amber-500" : "bg-transparent text-green-500 hover:bg-green-500 hover:text-black border-green-500"}\`}>
                [ {isFrozen ? "UNFREEZE BOARD" : "FREEZE BOARD"} ]
              </button>`;

const eventButton = `              <button type="submit" className={\`w-full py-2.5 text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-300 border \${currentStatus === "LIVE" ? "bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-black border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]" : "bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-black border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.2)]"}\`}>
                [ {currentStatus === "LIVE" ? "HALT EVENT" : "INITIATE EVENT"} ]
              </button>`;

const newEventButton = `              <button type="submit" className={\`w-full py-2.5 text-[10px] font-bold tracking-[0.2em] uppercase transition-colors border \${currentStatus === "LIVE" ? "bg-transparent text-red-500 hover:bg-red-500 hover:text-black border-red-500" : "bg-transparent text-green-500 hover:bg-green-500 hover:text-black border-green-500"}\`}>
                [ {currentStatus === "LIVE" ? "HALT EVENT" : "INITIATE EVENT"} ]
              </button>`;

page = page.replace(freezeButton, newFreezeButton);
page = page.replace(eventButton, newEventButton);

// Also add w-full to the forms just in case flexbox is doing something weird
page = page.replace(/<form action={toggleFreezeState} className="mt-auto">/g, '<form action={toggleFreezeState} className="mt-auto w-full">');
page = page.replace(/<form action={toggleEventState} className="mt-auto">/g, '<form action={toggleEventState} className="mt-auto w-full">');

fs.writeFileSync('src/app/admin/(dashboard)/page.tsx', page);
console.log("Buttons simplified to fix visual flicker");
