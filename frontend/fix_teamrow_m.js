const fs = require('fs');
let file = fs.readFileSync('src/app/admin/(dashboard)/teams/TeamRow.tsx', 'utf8');
file = file.replace(/members\.map\(m => \(/, 'members.map((m: any) => (');
fs.writeFileSync('src/app/admin/(dashboard)/teams/TeamRow.tsx', file);
