const fs = require('fs');

let layout = fs.readFileSync('src/app/admin/(dashboard)/layout.tsx', 'utf8');
layout = layout.replace(/w-56/g, 'w-52');
fs.writeFileSync('src/app/admin/(dashboard)/layout.tsx', layout);

console.log("Sidebar width reduced to w-52");
