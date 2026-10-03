const fs = require('fs');

let page = fs.readFileSync('src/app/admin/(dashboard)/page.tsx', 'utf8');

// 1. Remove the watermark
const watermarkStr = `      {/* Background Logo (No grid or mesh) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-[0.03] pointer-events-none mix-blend-screen flex items-center justify-center z-0">
        <Image src="/logo.png" alt="" fill className="object-contain" />
      </div>`;
page = page.replace(watermarkStr, '');

// 2. Remove max-w-7xl mx-auto
page = page.replace('<div className="max-w-7xl mx-auto relative z-10">', '<div className="relative z-10">');

fs.writeFileSync('src/app/admin/(dashboard)/page.tsx', page);
console.log("Overview layout fixed");
