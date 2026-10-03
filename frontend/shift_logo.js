const fs = require('fs');

let layout = fs.readFileSync('src/app/layout.tsx', 'utf8');
layout = layout.replace('absolute top-6 left-7 lg:left-14', 'absolute top-6 left-12 lg:left-16');
fs.writeFileSync('src/app/layout.tsx', layout);

console.log("Logo shifted right");
