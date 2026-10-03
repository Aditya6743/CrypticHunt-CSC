#!/bin/bash
cd frontend

# Generate common UI pages

mkdir -p "src/app/(main)"
mkdir -p "src/app/(auth)"
mkdir -p src/app/dashboard

cat << 'FILE' > src/app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#05070B] text-white flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#05070B 2px, transparent 2px), linear-gradient(90deg, #05070B 2px, transparent 2px)', backgroundSize: '30px 30px', backgroundColor: 'rgba(0, 255, 255, 0.05)' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-900/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="z-10 text-center space-y-6 max-w-3xl px-4">
        <h1 className="text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-500 mb-2 font-mono">
          CRYPTIC HUNT
        </h1>
        <p className="text-2xl text-cyan-100/70 tracking-widest font-mono mb-8">
          50 LEVELS. ONE FINAL BOSS.
        </p>
        <p className="text-gray-400 text-lg mb-12 max-w-2xl mx-auto">
          Decode, discover, and dominate. A premier cybersecurity challenge testing your skills in cryptography, OSINT, forensics, and logic.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link href="/register" className="px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-sm transition-all shadow-[0_0_15px_rgba(6,182,212,0.5)] uppercase tracking-wider">
            Register Your Team
          </Link>
          <Link href="/login" className="px-8 py-4 bg-transparent border border-cyan-500/50 hover:bg-cyan-950/30 text-cyan-400 font-bold rounded-sm transition-all uppercase tracking-wider">
            Login to Terminal
          </Link>
        </div>
      </div>
    </div>
  );
}
FILE

cat << 'FILE' > src/app/layout.tsx
import './globals.css'
import type { Metadata } from 'next'
import { Inter, Fira_Code } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const firaCode = Fira_Code({ subsets: ['latin'], variable: '--font-fira-code' })

export const metadata: Metadata = {
  title: 'CRYPTIC HUNT | Cybersecurity Platform',
  description: '50 Levels. One Final Boss. The ultimate CTF experience.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${firaCode.variable} font-sans bg-[#05070B] text-gray-100 min-h-screen antialiased`}>
        {children}
      </body>
    </html>
  )
}
FILE

cat << 'FILE' > src/app/globals.css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: #05070B;
  --foreground: #e2e8f0;
}

body {
  color: var(--foreground);
  background: var(--background);
}
FILE

