const fs = require('fs');

let layout = fs.readFileSync('src/app/admin/(dashboard)/layout.tsx', 'utf8');

const navStart = `<nav className="flex-1 p-4 space-y-2 mt-4">`;
const newNavStart = `<nav className="flex-1 p-4 space-y-2 pt-28">`;

layout = layout.replace(navStart, newNavStart);
fs.writeFileSync('src/app/admin/(dashboard)/layout.tsx', layout);
console.log("Fixed Admin sidebar padding");
