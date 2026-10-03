const fs = require('fs');

let content = fs.readFileSync('src/app/page.tsx', 'utf8');

// Revert text: CONNECTION ESTABLISHED -> AUTHENTICATED AS
content = content.replace(
  '<p className="text-gray-400 text-[10px] tracking-[0.3em] font-mono uppercase">CONNECTION ESTABLISHED</p>',
  '<p className="text-gray-400 text-[10px] tracking-[0.3em] font-mono uppercase">AUTHENTICATED AS</p>'
);

// Revert text: ACCESS HUD -> DASHBOARD
content = content.replace(
  '<span className="text-black font-black uppercase tracking-[0.2em] text-xs">ACCESS HUD</span>',
  '<span className="text-black font-black uppercase tracking-[0.2em] text-xs">DASHBOARD</span>'
);

fs.writeFileSync('src/app/page.tsx', content);
console.log("Wording reverted to original");
