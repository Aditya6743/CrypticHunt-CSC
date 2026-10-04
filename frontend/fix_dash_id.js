const fs = require('fs');
let dash = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');
dash = dash.replace(/where: \{ id: \(session\.user as any\)\.id \},/, 'where: { id: (session?.user as any)?.id },');
fs.writeFileSync('src/app/dashboard/page.tsx', dash);
