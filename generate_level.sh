#!/bin/bash
cd frontend

mkdir -p "src/app/level/[id]"

cat << 'FILE' > src/app/level/[id]/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import ClientLevel from "./client-page";

export default async function LevelPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const team = await prisma.team.findUnique({
    where: { id: (session.user as any).id },
  });

  if (!team) redirect("/login");

  const levelIdParam = parseInt(params.id, 10);
  if (isNaN(levelIdParam)) redirect("/dashboard");

  if (team.currentLevel < levelIdParam) {
    // Unauthorized access to future level
    redirect(`/level/${team.currentLevel}`);
  }

  const level = await prisma.level.findUnique({
    where: { levelNumber: levelIdParam },
  });

  if (!level) {
    // Level doesn't exist yet
    return (
      <div className="min-h-screen bg-[#05070B] text-white flex items-center justify-center font-mono">
        <div className="text-center">
          <h1 className="text-4xl text-red-500 mb-4">404 - LEVEL NOT FOUND</h1>
          <p className="text-gray-400">The requested level does not exist.</p>
        </div>
      </div>
    );
  }

  return <ClientLevel level={level} team={team} />;
}
FILE

cat << 'FILE' > src/app/level/[id]/client-page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ClientLevel({ level, team }: { level: any, team: any }) {
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer) return;
    
    setStatus("loading");
    
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer, levelId: level.id })
      });
      
      const data = await res.json();
      
      if (res.ok && data.correct) {
        setStatus("success");
        setMessage(`ACCESS GRANTED. +${level.points} POINTS`);
        setTimeout(() => {
          router.push(`/level/${team.currentLevel + 1}`);
          router.refresh();
        }, 2000);
      } else {
        setStatus("error");
        setMessage("ACCESS DENIED. Incorrect answer.");
        setTimeout(() => setStatus("idle"), 3000);
      }
    } catch (err) {
      setStatus("error");
      setMessage("CONNECTION ERROR.");
    }
  };

  return (
    <div className="min-h-screen bg-[#05070B] text-gray-100 p-8 font-mono flex flex-col">
      <header className="border-b border-cyan-900/50 pb-6 mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-cyan-400">CRYPTIC HUNT // LEVEL {level.levelNumber}</h1>
        </div>
        <div className="text-violet-400 font-bold">
          SCORE: {team.score}
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-[#0a0e17] border border-cyan-900/50 p-8 rounded-sm min-h-[400px]">
            <h2 className="text-3xl font-bold text-white mb-2">{level.title}</h2>
            <div className="text-cyan-500 text-sm mb-8 tracking-widest uppercase">CATEGORY: {level.category}</div>
            
            <div className="prose prose-invert max-w-none text-gray-300">
              {level.description}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#0a0e17] border border-cyan-900/50 p-6 rounded-sm">
            <h3 className="text-sm text-cyan-500 mb-4 tracking-widest uppercase">Target Intel</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex justify-between border-b border-gray-800 pb-2">
                <span>DIFFICULTY</span>
                <span className="text-white">{level.difficulty}</span>
              </li>
              <li className="flex justify-between border-b border-gray-800 pb-2">
                <span>POINTS</span>
                <span className="text-white">{level.points}</span>
              </li>
            </ul>
          </div>

          <div className="bg-[#0a0e17] border border-cyan-900/50 p-6 rounded-sm">
            <h3 className="text-sm text-cyan-500 mb-4 tracking-widest uppercase">Submit Flag</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="ENTER YOUR ANSWER"
                className="w-full bg-black border border-gray-800 px-4 py-3 text-white focus:outline-none focus:border-cyan-500 font-mono transition-colors"
                disabled={status === "loading" || status === "success"}
              />
              
              <button 
                type="submit" 
                disabled={status === "loading" || status === "success" || !answer}
                className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-black font-bold uppercase tracking-widest transition-colors"
              >
                {status === "loading" ? "Validating..." : "Submit Answer"}
              </button>
            </form>

            {status === "success" && (
              <div className="mt-4 p-3 bg-green-900/30 border border-green-500 text-green-400 text-center text-sm font-bold animate-pulse">
                {message}
              </div>
            )}
            
            {status === "error" && (
              <div className="mt-4 p-3 bg-red-900/30 border border-red-500 text-red-400 text-center text-sm">
                {message}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
FILE

cat << 'FILE' > src/app/api/submit/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { answer, levelId } = body;

    const team = await prisma.team.findUnique({
      where: { id: (session.user as any).id }
    });

    if (!team) return NextResponse.json({ error: "Team not found" }, { status: 404 });

    const level = await prisma.level.findUnique({
      where: { id: levelId },
      include: { answers: true }
    });

    if (!level) return NextResponse.json({ error: "Level not found" }, { status: 404 });

    if (level.levelNumber !== team.currentLevel) {
      return NextResponse.json({ error: "Cannot submit for this level" }, { status: 403 });
    }

    // Validation
    let isCorrect = false;
    
    if (level.answerMatchingMode === "CASE_INSENSITIVE") {
      isCorrect = level.answers.some(a => a.answer.toLowerCase() === answer.toLowerCase().trim());
    } else {
      isCorrect = level.answers.some(a => a.answer === answer.trim());
    }

    // Record submission
    await prisma.submission.create({
      data: {
        teamId: team.id,
        levelId: level.id,
        submittedAnswer: answer,
        correct: isCorrect
      }
    });

    if (isCorrect) {
      await prisma.team.update({
        where: { id: team.id },
        data: {
          currentLevel: team.currentLevel + 1,
          score: team.score + level.points
        }
      });
      
      await prisma.levelProgress.create({
        data: {
          teamId: team.id,
          levelId: level.id,
          completed: true,
          pointsAwarded: level.points
        }
      });
      
      return NextResponse.json({ correct: true, message: "Correct!" });
    } else {
      return NextResponse.json({ correct: false, message: "Incorrect" });
    }
    
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
FILE

