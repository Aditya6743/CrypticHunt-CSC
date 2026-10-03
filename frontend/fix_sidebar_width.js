const fs = require('fs');

let layout = fs.readFileSync('src/app/admin/(dashboard)/layout.tsx', 'utf8');
layout = layout.replace(/w-72/g, 'w-56');
fs.writeFileSync('src/app/admin/(dashboard)/layout.tsx', layout);

console.log("Sidebar width reduced");
