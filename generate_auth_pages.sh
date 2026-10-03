#!/bin/bash
cd frontend

cat << 'FILE' > src/app/(auth)/login/page.tsx
"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const [teamId, setTeamId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const res = await signIn("credentials", {
      teamId,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid credentials. Access Denied.");
      setIsLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-[#05070B] flex items-center justify-center p-4 font-mono relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#05070B 2px, transparent 2px), linear-gradient(90deg, #05070B 2px, transparent 2px)', backgroundSize: '40px 40px', backgroundColor: 'rgba(0, 255, 255, 0.05)' }}></div>

      <div className="z-10 w-full max-w-md bg-[#0a0e17] border border-cyan-900/50 p-8 rounded-sm shadow-[0_0_30px_rgba(6,182,212,0.1)]">
        <h1 className="text-3xl font-bold text-center text-cyan-400 mb-2">SYSTEM LOGIN</h1>
        <p className="text-center text-gray-500 mb-8 text-sm">AUTHENTICATE TO ACCESS TERMINAL</p>

        {error && <div className="mb-6 p-3 bg-red-900/30 border border-red-500 text-red-400 text-sm text-center animate-pulse">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-cyan-500 text-xs tracking-widest mb-2">TEAM ID / EMAIL</label>
            <input 
              type="text" 
              value={teamId}
              onChange={(e) => setTeamId(e.target.value)}
              className="w-full bg-black border border-gray-800 px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
              required 
            />
          </div>
          <div>
            <label className="block text-cyan-500 text-xs tracking-widest mb-2">PASSWORD</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-gray-800 px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
              required 
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-black font-bold tracking-widest uppercase transition-all mt-4"
          >
            {isLoading ? "Authenticating..." : "Initialize Session"}
          </button>
        </form>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          Unregistered Team? <Link href="/register" className="text-cyan-400 hover:underline">Request Access</Link>
        </div>
      </div>
    </div>
  );
}
FILE

cat << 'FILE' > src/app/(auth)/register/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Register() {
  const [formData, setFormData] = useState({
    teamName: "", leaderName: "", leaderEmail: "", contactNumber: "", college: "", password: "", confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      const res = await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setSuccess(`TEAM REGISTERED. ID: ${data.teamId}`);
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        setError(data.error || "Registration failed");
        setIsLoading(false);
      }
    } catch (err) {
      setError("Connection error");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05070B] py-12 px-4 flex items-center justify-center font-mono relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#05070B 2px, transparent 2px), linear-gradient(90deg, #05070B 2px, transparent 2px)', backgroundSize: '40px 40px', backgroundColor: 'rgba(0, 255, 255, 0.05)' }}></div>

      <div className="z-10 w-full max-w-2xl bg-[#0a0e17] border border-cyan-900/50 p-8 rounded-sm shadow-[0_0_30px_rgba(6,182,212,0.1)]">
        <h1 className="text-3xl font-bold text-center text-cyan-400 mb-2">TEAM REGISTRATION</h1>
        <p className="text-center text-gray-500 mb-8 text-sm">ENLIST FOR CRYPTIC HUNT</p>

        {error && <div className="mb-6 p-3 bg-red-900/30 border border-red-500 text-red-400 text-sm text-center animate-pulse">{error}</div>}
        {success && <div className="mb-6 p-3 bg-green-900/30 border border-green-500 text-green-400 text-sm text-center text-xl font-bold">{success}</div>}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-cyan-500 text-xs tracking-widest mb-2">TEAM NAME</label>
            <input type="text" required onChange={(e) => setFormData({...formData, teamName: e.target.value})} className="w-full bg-black border border-gray-800 px-4 py-3 text-white focus:outline-none focus:border-cyan-500" />
          </div>
          <div>
            <label className="block text-cyan-500 text-xs tracking-widest mb-2">LEADER NAME</label>
            <input type="text" required onChange={(e) => setFormData({...formData, leaderName: e.target.value})} className="w-full bg-black border border-gray-800 px-4 py-3 text-white focus:outline-none focus:border-cyan-500" />
          </div>
          <div>
            <label className="block text-cyan-500 text-xs tracking-widest mb-2">LEADER EMAIL</label>
            <input type="email" required onChange={(e) => setFormData({...formData, leaderEmail: e.target.value})} className="w-full bg-black border border-gray-800 px-4 py-3 text-white focus:outline-none focus:border-cyan-500" />
          </div>
          <div>
            <label className="block text-cyan-500 text-xs tracking-widest mb-2">CONTACT NUMBER</label>
            <input type="text" required onChange={(e) => setFormData({...formData, contactNumber: e.target.value})} className="w-full bg-black border border-gray-800 px-4 py-3 text-white focus:outline-none focus:border-cyan-500" />
          </div>
          <div>
            <label className="block text-cyan-500 text-xs tracking-widest mb-2">COLLEGE / UNIVERSITY</label>
            <input type="text" required onChange={(e) => setFormData({...formData, college: e.target.value})} className="w-full bg-black border border-gray-800 px-4 py-3 text-white focus:outline-none focus:border-cyan-500" />
          </div>
          <div>
            <label className="block text-cyan-500 text-xs tracking-widest mb-2">PASSWORD</label>
            <input type="password" required onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full bg-black border border-gray-800 px-4 py-3 text-white focus:outline-none focus:border-cyan-500" />
          </div>
          <div>
            <label className="block text-cyan-500 text-xs tracking-widest mb-2">CONFIRM PASSWORD</label>
            <input type="password" required onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} className="w-full bg-black border border-gray-800 px-4 py-3 text-white focus:outline-none focus:border-cyan-500" />
          </div>
          
          <div className="md:col-span-2 pt-4">
            <button 
              type="submit" 
              disabled={isLoading || !!success}
              className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-black font-bold tracking-widest uppercase transition-all"
            >
              {isLoading ? "Processing..." : "Submit Registration"}
            </button>
          </div>
        </form>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          Already enlisted? <Link href="/login" className="text-cyan-400 hover:underline">Access Terminal</Link>
        </div>
      </div>
    </div>
  );
}
FILE

cat << 'FILE' > src/app/api/team/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcrypt";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { teamName, leaderName, leaderEmail, contactNumber, college, password } = body;

    const existingTeam = await prisma.team.findFirst({
      where: {
        OR: [{ teamName }, { leaderEmail }]
      }
    });

    if (existingTeam) {
      return NextResponse.json({ error: "Team name or email already exists" }, { status: 400 });
    }

    const teamId = "CH-" + crypto.randomBytes(3).toString("hex").toUpperCase();
    const passwordHash = await bcrypt.hash(password, 10);

    const team = await prisma.team.create({
      data: {
        teamId,
        teamName,
        leaderName,
        leaderEmail,
        contactNumber,
        college,
        passwordHash
      }
    });

    return NextResponse.json({ success: true, teamId: team.teamId });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
FILE

