const fs = require('fs');
const path = require('path');

const write = (filePath, content) => {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content.trim() + '\n');
  console.log(`Updated ${filePath}`);
};

// 1. UPDATE LOGIN PAGE
let loginCode = fs.readFileSync('src/app/(auth)/login/page.tsx', 'utf8');
loginCode = loginCode.replace(
  '<div className="flex justify-between items-end mb-2">\n              <label className="block text-cyan-500 text-xs tracking-widest">PASSWORD</label>\n              <Link href="/forgot-password" className="text-gray-500 hover:text-cyan-400 text-[10px] tracking-widest uppercase transition-colors">\n                (Forgot Password)\n              </Link>\n            </div>',
  '<label className="block text-cyan-500 text-xs tracking-widest mb-2">PASSWORD</label>'
);
loginCode = loginCode.replace(
  '<div className="mt-8 text-center text-sm text-gray-500">\n          Unregistered Team? <Link href="/register" className="text-cyan-400 hover:underline">Request Access</Link>\n        </div>',
  `<div className="mt-8 space-y-3 text-center text-sm text-gray-500">
          <div>Unregistered Team? <Link href="/register" className="text-cyan-400 hover:underline">Request Access</Link></div>
          <div>Lost your keys? <Link href="/forgot-password" className="text-red-400 hover:underline">Reset Password</Link></div>
        </div>`
);
write('src/app/(auth)/login/page.tsx', loginCode);

// 2. FORGOT PASSWORD API
write('src/app/api/forgot-password/route.ts', `
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req) {
  try {
    const { identifier } = await req.json();

    const team = await prisma.team.findFirst({
      where: {
        OR: [
          { teamId: identifier },
          { leaderEmail: identifier }
        ]
      }
    });

    if (team) {
      // Check if open request exists
      const existing = await prisma.report.findFirst({
        where: { teamId: team.id, message: "PASSWORD_RESET", status: "OPEN" }
      });
      if (!existing) {
        await prisma.report.create({
          data: {
            teamId: team.id,
            message: "PASSWORD_RESET",
            status: "OPEN"
          }
        });
      }
    }

    // Always return success to prevent email enumeration
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
`);

// 3. FORGOT PASSWORD PAGE
write('src/app/(auth)/forgot-password/page.tsx', `
"use client";
import Link from "next/link";
import { useState } from "react";

export default function ForgotPassword() {
  const [identifier, setIdentifier] = useState("");
  const [status, setStatus] = useState("idle");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier })
      });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-[#05070B] flex items-center justify-center p-4 font-mono relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#05070B 2px, transparent 2px), linear-gradient(90deg, #05070B 2px, transparent 2px)', backgroundSize: '40px 40px', backgroundColor: 'rgba(0, 255, 255, 0.05)' }}></div>

      <div className="z-10 w-full max-w-md bg-[#0a0e17] border border-cyan-900/50 p-8 rounded-sm shadow-[0_0_30px_rgba(6,182,212,0.1)]">
        <h1 className="text-2xl font-bold text-center text-cyan-400 mb-2 tracking-widest uppercase">Encryption Reset</h1>
        
        {status === "success" ? (
          <div className="bg-[#020305] border border-green-900/50 p-6 my-6 text-center">
            <p className="text-green-400 text-sm leading-relaxed mb-4">
              Reset request transmitted to Admin Node.
            </p>
            <p className="text-gray-500 text-xs">
              Contact the event coordinators directly to receive your new password, as automated email dispatch is disabled.
            </p>
          </div>
        ) : (
          <>
            <p className="text-center text-gray-500 mb-8 text-xs leading-relaxed">
              Submit your Team ID or Email to flag your account for an admin manual override.
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-cyan-500 text-xs tracking-widest mb-2">TEAM ID / EMAIL</label>
                <input 
                  type="text" 
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full bg-black border border-gray-800 px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  required 
                />
              </div>
              <button 
                type="submit" 
                disabled={status === "loading"}
                className="w-full py-4 bg-cyan-900/40 border border-cyan-600 hover:bg-cyan-800/60 disabled:opacity-50 text-cyan-400 font-bold tracking-widest uppercase transition-all"
              >
                {status === "loading" ? "Transmitting..." : "Flag for Reset"}
              </button>
            </form>
          </>
        )}

        <div className="mt-8 text-center text-sm">
          <Link href="/login" className="text-gray-500 hover:text-cyan-400 tracking-widest uppercase transition-all text-xs">
            [ Return to Login ]
          </Link>
        </div>
      </div>
    </div>
  );
}
`);

console.log("Done phase 1");
