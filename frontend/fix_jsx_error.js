const fs = require('fs');

// Fix layout.tsx
let layout = fs.readFileSync('src/app/admin/(dashboard)/layout.tsx', 'utf8');
layout = layout.replace(/> Overview/g, '&gt; Overview');
layout = layout.replace(/> Manage Levels/g, '&gt; Manage Levels');
layout = layout.replace(/> Manage Teams/g, '&gt; Manage Teams');
fs.writeFileSync('src/app/admin/(dashboard)/layout.tsx', layout);

// Fix page.tsx (Admin overview might have > INITIATE_EVENT)
let page = fs.readFileSync('src/app/admin/(dashboard)/page.tsx', 'utf8');
page = page.replace(/> {isFrozen \? "UNFREEZE_BOARD" : "FREEZE_BOARD"}/g, '&gt; {isFrozen ? "UNFREEZE_BOARD" : "FREEZE_BOARD"}');
page = page.replace(/> {currentStatus === "LIVE" \? "HALT_EVENT" : "INITIATE_EVENT"}/g, '&gt; {currentStatus === "LIVE" ? "HALT_EVENT" : "INITIATE_EVENT"}');
fs.writeFileSync('src/app/admin/(dashboard)/page.tsx', page);

console.log("JSX parsing errors fixed");
