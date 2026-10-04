const fs = require('fs');

// Dashboard Page
let dash = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');
dash = dash.replace(/where: \{ id: session\.user\.id \},/, 'where: { id: (session.user as any).id },');
dash = dash.replace(/where: \{ id: session\?.user\?.id \},/, 'where: { id: (session?.user as any)?.id },'); // just in case
fs.writeFileSync('src/app/dashboard/page.tsx', dash);

// Root Page (src/app/page.tsx)
let root = fs.readFileSync('src/app/page.tsx', 'utf8');
root = root.replace(/href={session\.user\.role === 'ADMIN' \? "\/admin" : "\/dashboard"}/, 'href={(session?.user as any)?.role === "ADMIN" ? "/admin" : "/dashboard"}');
root = root.replace(/session\.user\.role === 'ADMIN' \? 'ADMIN PANEL' : 'MISSION DASHBOARD'/, '(session?.user as any)?.role === "ADMIN" ? "ADMIN PANEL" : "MISSION DASHBOARD"');
fs.writeFileSync('src/app/page.tsx', root);

// Participant Navbar
let nav = fs.readFileSync('src/components/ParticipantNavbar.tsx', 'utf8');
nav = nav.replace(/where: \{ id: session\.user\.id \}/, 'where: { id: (session?.user as any)?.id }');
fs.writeFileSync('src/components/ParticipantNavbar.tsx', nav);
