const fs = require('fs');

// 1. Team Dashboard Colors
let dash = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');

// Fix Header Color (Make it blue)
dash = dash.replace(
  /text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-white/,
  'text-cyan-500'
);

// Fix Boxes to all be Cyan/Blue
dash = dash.replace(/border-t-violet-500/g, 'border-t-cyan-500');
dash = dash.replace(/border-t-amber-500/g, 'border-t-cyan-500');
dash = dash.replace(/border-t-gray-500/g, 'border-t-cyan-500');

fs.writeFileSync('src/app/dashboard/page.tsx', dash);
console.log("Team dashboard colors unified to blue/cyan");

// 2. Fix Submit Double Penalty
let submit = fs.readFileSync('src/app/api/submit/route.ts', 'utf8');

const oldPenaltyLogic = `      const hintUsages = await prisma.hintUsage.aggregate({
        where: { teamId: team.id, levelId: level.id },
        _sum: { penalty: true }
      });
      const totalPenalty = hintUsages._sum.penalty || 0;
      const pointsAwarded = Math.max(0, level.points - totalPenalty); // Don't let score drop below 0 for a level

      await prisma.team.update({
        where: { id: team.id },
        data: {
          currentLevel: { increment: 1 },
          score: { increment: pointsAwarded }
        }
      });`;

const newPenaltyLogic = `      // Hint penalties are already deducted instantly when requested in /api/hint
      const pointsAwarded = level.points;

      await prisma.team.update({
        where: { id: team.id },
        data: {
          currentLevel: { increment: 1 },
          score: { increment: pointsAwarded }
        }
      });`;

submit = submit.replace(oldPenaltyLogic, newPenaltyLogic);
fs.writeFileSync('src/app/api/submit/route.ts', submit);
console.log("Submit API double-penalty fixed");

