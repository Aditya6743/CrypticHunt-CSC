const fs = require('fs');

let layout = fs.readFileSync('src/app/admin/(dashboard)/layout.tsx', 'utf8');

// The nav has `px-6`. Let's change to `px-4`.
layout = layout.replace('<nav className="flex-1 px-6 space-y-2 pt-36">', '<nav className="flex-1 px-4 space-y-2 pt-36">');

// The links have `gap-4 px-4 py-3.5`. Let's change to `gap-3 px-3 py-3.5`.
layout = layout.replace(/className="flex items-center gap-4 px-4 py-3.5/g, 'className="flex items-center gap-3 px-3 py-3.5');

// The text has `text-sm tracking-wide`. Let's reduce text to text-xs to make sure they fit perfectly in a single line.
layout = layout.replace(/<span className="text-sm font-bold tracking-wide">/g, '<span className="text-xs font-bold tracking-widest uppercase">');

// Also update the logout button spacing if needed. `px-4` in `<div className="p-8 pb-10">` can be `p-6 pb-10`
layout = layout.replace('<div className="p-8 pb-10">', '<div className="p-6 pb-10">');

fs.writeFileSync('src/app/admin/(dashboard)/layout.tsx', layout);
console.log("Sidebar text wrapping fixed");
