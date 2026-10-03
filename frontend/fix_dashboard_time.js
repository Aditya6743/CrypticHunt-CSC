const fs = require('fs');

let content = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');

content = content.replace(
  'import LogoutButton from "@/components/LogoutButton";',
  'import LogoutButton from "@/components/LogoutButton";\nimport TimeElapsed from "@/components/TimeElapsed";'
);

const oldFetch = `  const team = await prisma.team.findUnique({
    where: { id: session.user.id }
  });

  if (!team) redirect("/login");`;

const newFetch = `  const team = await prisma.team.findUnique({
    where: { id: session.user.id },
    include: { hintUsages: true }
  });

  if (!team) redirect("/login");

  const event = await prisma.event.findFirst();
  const startTime = event?.startTime || null;
  const hintsCount = team.hintUsages.length;`;

content = content.replace(oldFetch, newFetch);

const oldHint = `<p className="text-gray-500 text-xs tracking-widest mb-1">HINTS USED</p>
              <p className="text-2xl text-white font-bold">0</p>`;

const newHint = `<p className="text-gray-500 text-xs tracking-widest mb-1">HINTS USED</p>
              <p className="text-2xl text-white font-bold">{hintsCount}</p>`;
content = content.replace(oldHint, newHint);

const oldTime = `<p className="text-gray-500 text-xs tracking-widest mb-1">TIME ELAPSED</p>
              <p className="text-2xl text-white font-bold">00:00:00</p>`;

const newTime = `<p className="text-gray-500 text-xs tracking-widest mb-1">TIME ELAPSED</p>
              <p className="text-2xl text-white font-bold">
                {startTime ? <TimeElapsed startTime={startTime} /> : "NOT_STARTED"}
              </p>`;
content = content.replace(oldTime, newTime);

fs.writeFileSync('src/app/dashboard/page.tsx', content);
console.log("Dashboard time and hints fixed");
