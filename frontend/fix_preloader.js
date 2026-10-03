const fs = require('fs');

let preloader = fs.readFileSync('src/components/Preloader.tsx', 'utf8');

preloader = preloader.replace(
  '100% { top: 24px; left: 28px; width: 72px; height: 72px; margin-top: 0; margin-left: 0; }',
  '100% { top: 24px; left: 48px; width: 72px; height: 72px; margin-top: 0; margin-left: 0; }'
);

preloader = preloader.replace(
  '100% { top: 24px; left: 56px; width: 72px; height: 72px; margin-top: 0; margin-left: 0; }',
  '100% { top: 24px; left: 64px; width: 72px; height: 72px; margin-top: 0; margin-left: 0; }'
);

fs.writeFileSync('src/components/Preloader.tsx', preloader);
console.log("Preloader coordinates fixed");
