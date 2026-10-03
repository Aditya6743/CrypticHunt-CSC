const fs = require('fs');

let content = fs.readFileSync('src/app/page.tsx', 'utf8');

// Add LogoutButton import if not there
if (!content.includes('LogoutButton')) {
  content = content.replace(
    'import { authOptions } from "@/lib/auth";',
    'import { authOptions } from "@/lib/auth";\nimport LogoutButton from "@/components/LogoutButton";'
  );
}

// Replace the Return to Dashboard section
const oldAuth = `{session ? (
            <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto items-center justify-center">
              <Link href={session.user.role === "ADMIN" ? "/admin" : "/dashboard"} className="relative group w-full sm:w-auto">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400 to-violet-500 rounded-sm blur opacity-50 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative flex items-center justify-center px-10 py-4 bg-cyan-500 group-hover:bg-cyan-400 rounded-sm transition-all duration-300">
                  <span className="text-black font-black uppercase tracking-[0.2em] text-sm">Return to Dashboard</span>
                </div>
              </Link>
            </div>
          ) :`;

const newAuth = `{session ? (
            <div className="flex flex-col items-center justify-center w-full max-w-sm mx-auto bg-[#020305]/80 backdrop-blur-md border border-cyan-900/50 rounded-sm p-6">
              <p className="text-gray-500 text-xs tracking-widest uppercase mb-1">Authenticated as</p>
              <p className="text-cyan-400 text-lg font-bold tracking-widest mb-6">{session.user.name}</p>
              <div className="flex gap-4 w-full">
                <Link href={session.user.role === "ADMIN" ? "/admin" : "/dashboard"} className="flex-1 text-center py-2 bg-cyan-900/30 border border-cyan-600 hover:bg-cyan-800/50 text-cyan-400 text-xs tracking-widest uppercase transition-colors">
                  Dashboard
                </Link>
                <div className="flex-1 flex">
                  <span className="w-full"><LogoutButton /></span>
                </div>
              </div>
            </div>
          ) :`;

content = content.replace(oldAuth, newAuth);
fs.writeFileSync('src/app/page.tsx', content);
console.log("Landing page auth widget fixed");
