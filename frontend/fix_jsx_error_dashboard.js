const fs = require('fs');

// Fix dashboard page
let dash = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');
dash = dash.replace(/> EXECUTE_CHALLENGE.sh/g, '&gt; EXECUTE_CHALLENGE.sh');
fs.writeFileSync('src/app/dashboard/page.tsx', dash);

console.log("JSX parsing errors in dashboard fixed");
