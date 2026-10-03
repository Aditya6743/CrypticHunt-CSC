const fs = require('fs');

let page = fs.readFileSync('src/app/admin/(dashboard)/page.tsx', 'utf8');
page = page.replace(/\/ 50/g, '/ 5');
fs.writeFileSync('src/app/admin/(dashboard)/page.tsx', page);

let dash = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');
dash = dash.replace(/\/ 50/g, '/ 5');
dash = dash.replace(/50\)/g, '5)'); // Math.round(((team.currentLevel - 1) / 50) * 100) -> 5
fs.writeFileSync('src/app/dashboard/page.tsx', dash);

console.log("Updated total level count to 5");
