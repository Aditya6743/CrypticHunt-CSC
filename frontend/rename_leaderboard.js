const fs = require('fs');

// 1. Dashboard Link
let dash = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');
dash = dash.replace('[ ACCESS GLOBAL LEADERBOARD ]', '[ ACCESS LEADERBOARD ]');
fs.writeFileSync('src/app/dashboard/page.tsx', dash);

// 2. Leaderboard Page Title
let lb = fs.readFileSync('src/app/leaderboard/page.tsx', 'utf8');
lb = lb.replace('Global Leaderboard', 'Leaderboard');
lb = lb.replace('GLOBAL LEADERBOARD', 'LEADERBOARD');
fs.writeFileSync('src/app/leaderboard/page.tsx', lb);

console.log("Renamed leaderboard text");
