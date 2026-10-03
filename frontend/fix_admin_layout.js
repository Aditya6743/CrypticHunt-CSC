const fs = require('fs');

let content = fs.readFileSync('src/app/admin/(dashboard)/layout.tsx', 'utf8');

// Add import
content = content.replace(
  "import Link from 'next/link';",
  "import Link from 'next/link';\nimport LogoutButton from '@/components/LogoutButton';"
);

// Add Logout button at the bottom of the sidebar
content = content.replace(
  '</nav>\n      </aside>',
  `</nav>\n        <div className="p-4 border-t border-cyan-900/30">\n          <LogoutButton />\n        </div>\n      </aside>`
);

fs.writeFileSync('src/app/admin/(dashboard)/layout.tsx', content);
console.log("Admin layout fixed");
