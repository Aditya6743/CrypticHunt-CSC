const fs = require('fs');

let page = fs.readFileSync('src/app/admin/(dashboard)/page.tsx', 'utf8');

// Restore the brackets and tracking
page = page.replace(/{isFrozen \? "UNFREEZE BOARD" : "FREEZE BOARD"}/g, '[ {isFrozen ? "UNFREEZE BOARD" : "FREEZE BOARD"} ]');
page = page.replace(/{currentStatus === "LIVE" \? "HALT EVENT" : "INITIATE EVENT"}/g, '[ {currentStatus === "LIVE" ? "HALT EVENT" : "INITIATE EVENT"} ]');

// Restore tracking
page = page.replace(/tracking-widest/g, 'tracking-[0.2em]');

// Ensure button doesn't overflow horizontally
page = page.replace(/<button type="submit" className={\`w-full/g, '<button type="submit" className={`w-full overflow-hidden text-ellipsis whitespace-nowrap');

fs.writeFileSync('src/app/admin/(dashboard)/page.tsx', page);
console.log("Buttons restored and fixed");
