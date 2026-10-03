const fs = require('fs');

let content = fs.readFileSync('src/app/api/admin/reset-password/route.ts', 'utf8');

// Update to accept customPassword
const oldDestructure = 'const { teamId } = await req.json();';
const newDestructure = 'const { teamId, customPassword } = await req.json();';
content = content.replace(oldDestructure, newDestructure);

const oldPassGen = 'const newPassword = `SYS-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;';
const newPassGen = 'const newPassword = customPassword && customPassword.trim().length > 0 ? customPassword.trim() : `SYS-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;';
content = content.replace(oldPassGen, newPassGen);

fs.writeFileSync('src/app/api/admin/reset-password/route.ts', content);
console.log("Reset API updated");
