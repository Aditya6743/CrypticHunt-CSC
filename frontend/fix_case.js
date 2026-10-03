const fs = require('fs');

// 1. Fix Registration (src/app/api/team/route.ts)
let regContent = fs.readFileSync('src/app/api/team/route.ts', 'utf8');
regContent = regContent.replace(
  'const { teamName, leaderName, leaderEmail, contactNumber, college, password, teamMembers } = body;',
  `const { teamName, leaderName, contactNumber, college, password, teamMembers } = body;
    let { leaderEmail } = body;
    leaderEmail = leaderEmail ? leaderEmail.toLowerCase().trim() : "";`
);
fs.writeFileSync('src/app/api/team/route.ts', regContent);
console.log("Registration API updated");

// 2. Fix Forgot Password (src/app/api/forgot-password/route.ts)
let fpContent = fs.readFileSync('src/app/api/forgot-password/route.ts', 'utf8');
fpContent = fpContent.replace(
  'const { identifier } = await req.json();',
  'const { identifier } = await req.json();\n    const identStr = identifier ? identifier.trim() : "";'
);
fpContent = fpContent.replace(
  '{ teamId: identifier },\n          { leaderEmail: identifier }',
  '{ teamId: identStr.toUpperCase() },\n          { leaderEmail: identStr.toLowerCase() }'
);
fs.writeFileSync('src/app/api/forgot-password/route.ts', fpContent);
console.log("Forgot Password API updated");

// 3. Fix Login (src/lib/auth.ts)
let authContent = fs.readFileSync('src/lib/auth.ts', 'utf8');
authContent = authContent.replace(
  '{ teamId: credentials.teamId },\n              { leaderEmail: credentials.teamId }',
  `{ teamId: credentials.teamId.trim().toUpperCase() },\n              { leaderEmail: credentials.teamId.trim().toLowerCase() }`
);
fs.writeFileSync('src/lib/auth.ts', authContent);
console.log("Auth login updated");
