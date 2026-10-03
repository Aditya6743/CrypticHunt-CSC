const fs = require('fs');
let code = fs.readFileSync('src/app/api/submit/route.ts', 'utf8');

const validationStart = `    const team = await prisma.team.findUnique({`;
const newValidationStart = `    // PRD: Event Status Check
    const event = await prisma.event.findFirst();
    if (!event || event.status !== "LIVE") {
      return NextResponse.json({ error: "Submissions are currently disabled (Event is not LIVE)." }, { status: 403 });
    }

    const team = await prisma.team.findUnique({`;

code = code.replace(validationStart, newValidationStart);
fs.writeFileSync('src/app/api/submit/route.ts', code);
console.log("Added Event status validation");
