const fs = require('fs');

let page = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');

page = page.replace(
  '<div className="min-h-screen bg-[#05070B] text-gray-100 font-mono p-8 relative overflow-hidden">',
  '<div className="min-h-screen bg-[#05070B] text-gray-100 font-mono p-4 md:p-8 pt-28 md:pt-32 relative overflow-hidden">'
);

fs.writeFileSync('src/app/dashboard/page.tsx', page);
console.log("Fixed Team Dashboard spacing");
