const fs = require('fs');

let content = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');

// I will just replace the mangled line explicitly
content = content.replace(/\\> INITIATE_PROTOCOLgt; INITIATE_PROTOCOL\( \{team\.currentLevel\} \)/g, '{">"} INITIATE_PROTOCOL( {team.currentLevel} )');

fs.writeFileSync('src/app/dashboard/page.tsx', content);
console.log("JSX fixed cleanly");
