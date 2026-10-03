const fs = require('fs');

const files = [
  'src/app/admin/(dashboard)/page.tsx',
  'src/app/admin/(dashboard)/levels/LevelClient.tsx',
  'src/app/admin/(dashboard)/teams/page.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');

  // 1. Shift heading up (reduce padding)
  // For page.tsx it was: p-4 md:p-8 pt-24 md:pt-32
  // For others it was: p-4 md:p-8 pt-24 md:pt-32
  content = content.replace(/pt-24 md:pt-32/g, 'pt-8 md:pt-12');

  // 2. Remove the top absolute line
  const topStr = '<div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>';
  content = content.replace(topStr, '');

  // 3. Remove the bottom border
  // For page.tsx: className="flex items-center gap-4 mb-10 border-b border-cyan-900/30 pb-6 relative"
  // For Levels/Teams: className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10 border-b border-cyan-900/30 pb-6 relative"
  content = content.replace(/border-b border-cyan-900\/30 pb-6/g, 'pb-2');

  fs.writeFileSync(file, content);
}

console.log("Headers fixed");
