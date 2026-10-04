const fs = require('fs');
let file = fs.readFileSync('src/app/admin/(dashboard)/teams/TeamRow.tsx', 'utf8');

file = file.replace(/export default function TeamRow\(\{ team \}\) \{/, 'export default function TeamRow({ team }: { team: any }) {');
file = file.replace(/members\.map\(\(m, i\) =>/, 'members.map((m: any, i: number) =>');
file = file.replace(/members\.map\(\(m\) =>/, 'members.map((m: any) =>');

fs.writeFileSync('src/app/admin/(dashboard)/teams/TeamRow.tsx', file);
console.log("TeamRow fixed!");
