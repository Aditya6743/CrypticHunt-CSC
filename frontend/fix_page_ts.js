const fs = require('fs');
let root = fs.readFileSync('src/app/page.tsx', 'utf8');

root = root.replace(/\{session\.user\.name\}/g, '{session?.user?.name}');
root = root.replace(/href=\{session\.user\.role === "ADMIN" \? "\/admin" : "\/dashboard"\}/g, 'href={(session?.user as any)?.role === "ADMIN" ? "/admin" : "/dashboard"}');
root = root.replace(/\{session\.user\.role === "ADMIN" \? "ADMIN PANEL" : "MISSION DASHBOARD"\}/g, '{(session?.user as any)?.role === "ADMIN" ? "ADMIN PANEL" : "MISSION DASHBOARD"}');

fs.writeFileSync('src/app/page.tsx', root);
