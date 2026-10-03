const fs = require('fs');

let content = fs.readFileSync('src/app/admin/(dashboard)/page.tsx', 'utf8');

const actionStr = `async function toggleEventState(formData: FormData) {`;
const newActionStr = `async function toggleFreezeState(formData: FormData) {
  "use server";
  const newStatus = formData.get("freeze") === "true";
  const event = await prisma.event.findFirst();
  if (event) {
    await prisma.event.update({ where: { id: event.id }, data: { leaderboardFrozen: newStatus } });
  }
  revalidatePath("/admin");
  revalidatePath("/leaderboard");
}

async function toggleEventState(formData: FormData) {`;

content = content.replace(actionStr, newActionStr);

const currentStatusStr = `const currentStatus = event?.status || "NOT_STARTED";`;
const newCurrentStatusStr = `const currentStatus = event?.status || "NOT_STARTED";\n  const isFrozen = event?.leaderboardFrozen || false;`;

content = content.replace(currentStatusStr, newCurrentStatusStr);

const gridStr = `<div className="bg-[#0a0e17] border border-cyan-900/50 p-6 rounded-sm">
          <h3 className="text-gray-500 text-xs tracking-widest mb-2">EVENT STATUS</h3>`;

const newGridStr = `<div className="bg-[#0a0e17] border border-cyan-900/50 p-6 rounded-sm">
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
          <h3 className="text-gray-500 text-xs tracking-widest mb-2">EVENT STATUS</h3>`;

content = content.replace(gridStr, newGridStr);

// Change grid to 4 cols instead of 3
content = content.replace('grid-cols-1 md:grid-cols-3', 'grid-cols-1 md:grid-cols-4');

fs.writeFileSync('src/app/admin/(dashboard)/page.tsx', content);
console.log("Admin freeze logic added");
