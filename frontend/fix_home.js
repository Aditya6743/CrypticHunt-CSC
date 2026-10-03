const fs = require('fs');

let content = fs.readFileSync('src/app/page.tsx', 'utf8');

// Add imports
content = content.replace(
  'import Link from "next/link";\nimport Image from "next/image";',
  'import Link from "next/link";\nimport Image from "next/image";\nimport { getServerSession } from "next-auth";\nimport { authOptions } from "@/lib/auth";'
);

// Add session fetch
content = content.replace(
  'export default function Home() {',
  'export default async function Home() {\n  const session = await getServerSession(authOptions);'
);

// Update buttons block
const oldButtons = `<div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto items-center justify-center">
            
            {/* Register Button */}
            <Link href="/register" className="relative group w-full sm:w-auto">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400 to-violet-500 rounded-sm blur opacity-50 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative flex items-center justify-center px-10 py-4 bg-cyan-500 group-hover:bg-cyan-400 rounded-sm transition-all duration-300">
                <span className="text-black font-black uppercase tracking-[0.2em] text-sm">Initiate Registration</span>
              </div>
            </Link>

            {/* Login Button */}
            <Link href="/login" className="relative group w-full sm:w-auto">
              <div className="absolute -inset-px bg-gradient-to-r from-white/10 to-white/5 rounded-sm group-hover:from-cyan-500/50 group-hover:to-violet-500/50 transition duration-300"></div>
              <div className="relative flex items-center justify-center px-10 py-4 bg-[#020305]/80 backdrop-blur-md rounded-sm border border-transparent transition-all duration-300">
                <span className="text-gray-300 group-hover:text-cyan-300 font-bold uppercase tracking-[0.2em] text-sm transition-colors">Access Terminal</span>
              </div>
            </Link>

          </div>

          {/* Admin Link Underneath Buttons */}
          <Link href="/admin/login" className="mt-8 text-xs md:text-sm font-mono text-gray-500 hover:text-red-500 font-bold transition-colors tracking-[0.2em] uppercase">
            [ Admin Access ]
          </Link>`;

const newButtons = `{session ? (
            <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto items-center justify-center">
              <Link href={session.user.role === "ADMIN" ? "/admin" : "/dashboard"} className="relative group w-full sm:w-auto">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400 to-violet-500 rounded-sm blur opacity-50 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative flex items-center justify-center px-10 py-4 bg-cyan-500 group-hover:bg-cyan-400 rounded-sm transition-all duration-300">
                  <span className="text-black font-black uppercase tracking-[0.2em] text-sm">Return to Dashboard</span>
                </div>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col items-center w-full">
              <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto items-center justify-center">
                <Link href="/register" className="relative group w-full sm:w-auto">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400 to-violet-500 rounded-sm blur opacity-50 group-hover:opacity-100 transition duration-300"></div>
                  <div className="relative flex items-center justify-center px-10 py-4 bg-cyan-500 group-hover:bg-cyan-400 rounded-sm transition-all duration-300">
                    <span className="text-black font-black uppercase tracking-[0.2em] text-sm">Initiate Registration</span>
                  </div>
                </Link>
                <Link href="/login" className="relative group w-full sm:w-auto">
                  <div className="absolute -inset-px bg-gradient-to-r from-white/10 to-white/5 rounded-sm group-hover:from-cyan-500/50 group-hover:to-violet-500/50 transition duration-300"></div>
                  <div className="relative flex items-center justify-center px-10 py-4 bg-[#020305]/80 backdrop-blur-md rounded-sm border border-transparent transition-all duration-300">
                    <span className="text-gray-300 group-hover:text-cyan-300 font-bold uppercase tracking-[0.2em] text-sm transition-colors">Access Terminal</span>
                  </div>
                </Link>
              </div>
              <Link href="/admin/login" className="mt-8 text-xs md:text-sm font-mono text-gray-500 hover:text-red-500 font-bold transition-colors tracking-[0.2em] uppercase">
                [ Admin Access ]
              </Link>
            </div>
          )}`;

content = content.replace(oldButtons, newButtons);
fs.writeFileSync('src/app/page.tsx', content);
console.log("Home fixed");
