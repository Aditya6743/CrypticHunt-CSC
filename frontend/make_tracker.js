const fs = require('fs');
const path = require('path');

const write = (filePath, content) => {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content.trim() + '\n');
  console.log(`Updated ${filePath}`);
};

// 1. ADMIN RESET API (Auto-generate and store in ticket)
write('src/app/api/admin/reset-password/route.ts', `
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import bcrypt from "bcrypt";
import crypto from "crypto";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { teamId } = await req.json();

    const newPassword = "SYS-" + crypto.randomBytes(3).toString("hex").toUpperCase();
    const passwordHash = await bcrypt.hash(newPassword, 10);

    await prisma.team.update({
      where: { id: teamId },
      data: { passwordHash }
    });

    // Close any open reset requests and save the password inside the report temporarily
    await prisma.report.updateMany({
      where: { teamId, message: "PASSWORD_RESET", status: "OPEN" },
      data: { status: "RESOLVED", message: \`PASSWORD_RESET:\${newPassword}\` }
    });

    return NextResponse.json({ success: true, newPassword });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
`);

// 2. ADMIN RESET BUTTON UI (No prompt)
write('src/app/admin/(dashboard)/teams/ResetButton.tsx', `
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ResetButton({ teamId, teamName, hasRequest }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleReset = async () => {
    if (!confirm(\`Auto-generate new password for \${teamName}?\`)) return;

    setLoading(true);
    try {
      const res = await fetch("/api/admin/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId })
      });
      const data = await res.json();
      if (res.ok) {
        alert(\`Success! New Password for \${teamName} is:\\n\\n\${data.newPassword}\\n\\nThe team can now see this on the Forgot Password page.\`);
        router.refresh();
      } else {
        alert("Failed to reset password.");
      }
    } catch {
      alert("Error resetting password.");
    }
    setLoading(false);
  };

  return (
    <button 
      onClick={handleReset}
      disabled={loading}
      className={\`px-3 py-1 text-xs tracking-widest uppercase transition-colors border \${hasRequest ? 'bg-red-900/40 text-red-400 border-red-500/50 hover:bg-red-900/60 animate-pulse' : 'bg-cyan-900/20 text-cyan-500 border-cyan-800 hover:bg-cyan-900/50'}\`}
    >
      {loading ? "..." : "Reset Pass"}
    </button>
  );
}
`);

// 3. FORGOT PASSWORD API (Check Status)
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

    if (!team) {
      // Return fake pending to prevent brute forcing emails
      return NextResponse.json({ status: "pending" });
    }

    const report = await prisma.report.findFirst({
      where: {
        teamId: team.id,
        message: { startsWith: "PASSWORD_RESET" },
        status: { in: ["OPEN", "RESOLVED"] }
      },
      orderBy: { createdAt: 'desc' }
    });

    if (report) {
      if (report.status === "OPEN") {
        return NextResponse.json({ status: "pending" });
      }
      if (report.status === "RESOLVED") {
        const newPass = report.message.split(":")[1];
        // Mark as closed so it disappears after they view it once
        await prisma.report.update({
          where: { id: report.id },
          data: { status: "CLOSED", message: "PASSWORD_RESET_COMPLETED" }
        });
        return NextResponse.json({ status: "resolved", newPassword: newPass });
      }
    }

    // No existing report found, create a new one
    await prisma.report.create({
      data: {
        teamId: team.id,
        message: "PASSWORD_RESET",
        status: "OPEN"
      }
    });

    return NextResponse.json({ status: "requested" });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
`);

// 4. FORGOT PASSWORD PAGE UI
write('src/app/(auth)/forgot-password/page.tsx', `
"use client";
import Link from "next/link";
import { useState } from "react";

export default function ForgotPassword() {
  const [identifier, setIdentifier] = useState("");
  const [status, setStatus] = useState("idle");
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier })
      });
      const data = await res.json();
      
      if (data.status === "resolved") {
        setNewPassword(data.newPassword);
        setStatus("resolved");
      } else if (data.status === "pending") {
        setStatus("pending");
      } else {
        setStatus("requested");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-[#05070B] flex items-center justify-center p-4 font-mono relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#05070B 2px, transparent 2px), linear-gradient(90deg, #05070B 2px, transparent 2px)', backgroundSize: '40px 40px', backgroundColor: 'rgba(0, 255, 255, 0.05)' }}></div>

      <div className="z-10 w-full max-w-md bg-[#0a0e17] border border-cyan-900/50 p-8 rounded-sm shadow-[0_0_30px_rgba(6,182,212,0.1)]">
        <h1 className="text-2xl font-bold text-center text-cyan-400 mb-2 tracking-widest uppercase">Encryption Reset</h1>
        
        {status === "resolved" ? (
          <div className="bg-[#020305] border border-green-900/50 p-6 my-6 text-center">
            <p className="text-green-400 text-sm font-bold tracking-widest mb-4 uppercase">
              Admin Override Approved
            </p>
            <p className="text-gray-400 text-xs mb-2">Your new system password is:</p>
            <div className="bg-green-950/30 border border-green-500/30 py-3 text-white text-xl tracking-wider font-bold animate-pulse">
              {newPassword}
            </div>
            <p className="text-red-400 text-[10px] mt-4 uppercase tracking-widest">
              Save this immediately. This message will self-destruct upon exit.
            </p>
          </div>
        ) : status === "pending" || status === "requested" ? (
          <div className="bg-[#020305] border border-amber-900/50 p-6 my-6 text-center">
            <p className="text-amber-400 text-sm tracking-widest mb-4 uppercase">
              {status === "requested" ? "Request Transmitted" : "Request Pending"}
            </p>
            <p className="text-gray-400 text-xs leading-relaxed">
              Your request is currently awaiting Admin Approval. 
              Keep checking back here using your Team ID to view your new password once approved.
            </p>
          </div>
        ) : (
          <>
            <p className="text-center text-gray-500 mb-8 text-xs leading-relaxed">
              Submit your Team ID or Email to flag your account for reset, or to check the status of an existing request.
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
                {status === "loading" ? "Scanning..." : "Check / Request Reset"}
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

console.log("Tracker built successfully!");
