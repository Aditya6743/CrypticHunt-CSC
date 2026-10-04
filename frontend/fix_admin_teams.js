const fs = require('fs');
let file = fs.readFileSync('src/app/admin/(dashboard)/teams/page.tsx', 'utf8');

file = file.replace(/if \(!session \|\| session\.user\.role !== "ADMIN"\)/, 'if (!session || (session.user as any).role !== "ADMIN")');

fs.writeFileSync('src/app/admin/(dashboard)/teams/page.tsx', file);
