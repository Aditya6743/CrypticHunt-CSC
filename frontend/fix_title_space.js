const fs = require('fs');

let page = fs.readFileSync('src/app/page.tsx', 'utf8');

page = page.replace(
  '            CRYPTIC HUNT\n          </h1>',
  '            <span className="mr-3 md:mr-6">CRYPTIC</span><span>HUNT</span>\n          </h1>'
);

// If it's on one line, try another replace
page = page.replace(
  '>CRYPTIC HUNT</h1>',
  '><span className="mr-3 md:mr-6">CRYPTIC</span><span>HUNT</span></h1>'
);

fs.writeFileSync('src/app/page.tsx', page);
console.log("Added space to title");
