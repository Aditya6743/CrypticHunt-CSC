const fs = require('fs');

let layout = fs.readFileSync('src/app/admin/(dashboard)/layout.tsx', 'utf8');
const textToRemove = `        <div className="p-8 pt-12 border-b border-white/5">
            <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 tracking-widest">ADMIN_OS</h2>
        </div>`;
layout = layout.replace(textToRemove, '');
fs.writeFileSync('src/app/admin/(dashboard)/layout.tsx', layout);

console.log("Removed ADMIN_OS text");
