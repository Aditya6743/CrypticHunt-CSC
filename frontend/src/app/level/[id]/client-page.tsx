"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import TimeRemaining from "@/components/TimeRemaining";

export default function ClientLevel({ level, team, unlockedHints, nextHintPenalty, endTime, haltedAt, isLive }: { level: any, team: any, unlockedHints: any[], nextHintPenalty: number | null, endTime: any, haltedAt: any, isLive: boolean }) {
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [message, setMessage] = useState("");
  const [typewriter, setTypewriter] = useState("");
  const router = useRouter();

  // Typewriter effect for the description
  useEffect(() => {
    let i = 0;
    setTypewriter("");
    const interval = setInterval(() => {
      setTypewriter(level.description.slice(0, i));
      i++;
      if (i > level.description.length) {
        clearInterval(interval);
      }
    }, 15);
    return () => clearInterval(interval);
  }, [level.description]);

  const [hints, setHints] = useState(unlockedHints || []);
  const [hintLoading, setHintLoading] = useState(false);

  const requestHint = async () => {
    if (nextHintPenalty === null) return;
    if(!confirm(`Requesting this hint will deduct ${nextHintPenalty} points. Proceed?`)) return;
    setHintLoading(true);
    try {
      const res = await fetch("/api/hint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ levelId: level.id })
      });
      const data = await res.json();
      if (res.ok) {
        // Refresh page to show new hint and updated penalty
        router.refresh();
      } else {
        alert(data.error || "No hints available");
      }
    } catch(err) {
      alert("Error requesting hint");
    }
    setHintLoading(false);
  };

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
        setMessage(`[+] ENCRYPTION BROKEN. ACCESS GRANTED. +${level.points} POINTS`);
        setTimeout(() => {
          router.push(`/level/${team.currentLevel + 1}`);
          router.refresh();
        }, 2500);
      } else {
        setStatus("error");
        setMessage("[-] ACCESS DENIED. INVALID CIPHER.");
        setTimeout(() => setStatus("idle"), 3000);
      }
    } catch (err) {
      setStatus("error");
      setMessage("[-] CONNECTION ERROR.");
    }
  };

  return (
    <div className="min-h-screen bg-[#05070B] text-gray-100 p-4 md:p-8 font-mono flex flex-col relative overflow-hidden pt-28 md:pt-32">
      {/* Premium Background Effects */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#05070B 2px, transparent 2px), linear-gradient(90deg, #05070B 2px, transparent 2px)', backgroundSize: '40px 40px', backgroundColor: 'rgba(0, 255, 255, 0.05)' }}></div>

      <div className="z-10 w-full max-w-6xl mx-auto flex-1 flex flex-col">
        <header className="border-b border-cyan-900/50 pb-6 mb-8">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-xs font-mono text-cyan-500 hover:text-cyan-400 mb-6 transition-colors tracking-widest">
            <span className="text-lg leading-none">&larr;</span> BACK TO DASHBOARD
          </Link>
          <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-end gap-6 sm:gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-cyan-400 tracking-widest text-glow">PROTOCOL {level.levelNumber}</h1>
              <p className="text-gray-500 mt-3 tracking-widest text-[10px] md:text-xs flex flex-col md:flex-row md:items-center gap-2 md:gap-2 leading-relaxed">
                <span>STATUS: ACTIVE // TARGET: {level.title}</span>
                <span className="hidden md:inline text-cyan-900/50">|</span>
                <span className="text-cyan-400 font-bold">
                  REMAINING: {endTime ? <TimeRemaining endTime={endTime} haltedAt={haltedAt} isLive={isLive} /> : "--:--:--"}
                </span>
              </p>
            </div>
            <div className="text-left sm:text-right flex flex-col items-start sm:items-end">
              <div className="px-4 py-2 bg-violet-900/20 border border-violet-500/30 text-violet-400 text-xs md:text-sm tracking-widest font-bold">
                SYS.SCORE: {team.score}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#0a0e17]/80 backdrop-blur-md border border-cyan-900/50 p-6 md:p-10 rounded-sm min-h-[500px] shadow-[0_0_30px_rgba(6,182,212,0.05)] relative overflow-hidden group">
              {/* Scanline overlay for content box */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-20 pointer-events-none"></div>
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0 mb-8 border-b border-white/5 pb-4">
                <h2 className="text-xl md:text-2xl font-bold text-white tracking-widest uppercase">{level.title}</h2>
                <div className="text-cyan-500 text-xs tracking-widest uppercase bg-cyan-900/20 px-3 py-1 border border-cyan-500/30">
                  {level.category}
                </div>
              </div>
              
              <div className="prose prose-invert max-w-none text-gray-300 font-mono text-sm leading-relaxed whitespace-pre-wrap relative z-10 select-text">
                {typewriter}<span className="animate-pulse text-cyan-400">_</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-[#0a0e17]/80 backdrop-blur-md border border-cyan-900/50 p-6 rounded-sm">
              <h3 className="text-xs text-gray-500 mb-4 tracking-widest uppercase border-b border-gray-800 pb-2">Target Intel</h3>
              <ul className="space-y-4 text-xs md:text-sm text-gray-400">
                <li className="flex justify-between items-center">
                  <span className="tracking-widest">DIFFICULTY</span>
                  <span className={`px-2 py-1 ${level.difficulty === 'EASY' ? 'text-green-400 bg-green-900/20' : level.difficulty === 'MEDIUM' ? 'text-amber-400 bg-amber-900/20' : 'text-red-400 bg-red-900/20'} border border-current/30`}>{level.difficulty}</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="tracking-widest">BOUNTY</span>
                  <span className="text-cyan-400">{level.points} PTS</span>
                </li>
              </ul>
            </div>

            <div className="bg-[#0a0e17]/80 backdrop-blur-md border border-cyan-900/50 p-6 rounded-sm relative">
              <h3 className="text-xs text-gray-500 mb-4 tracking-widest uppercase border-b border-gray-800 pb-2">Inject Payload</h3>
              
              <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                <input
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="ENTER DECRYPTED FLAG..."
                  className="w-full bg-black/50 border border-gray-800 px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500 focus:bg-black font-mono transition-colors placeholder:text-gray-700"
                  disabled={status === "loading" || status === "success"}
                />
                
                <button 
                  type="submit" 
                  disabled={status === "loading" || status === "success" || !answer}
                  className={`w-full py-4 text-black font-bold uppercase tracking-widest transition-all ${status === "success" ? "bg-green-500" : status === "error" ? "bg-red-500" : "bg-cyan-600 hover:bg-cyan-500 hover:shadow-[0_0_15px_cyan]"} disabled:opacity-50`}
                >
                  {status === "loading" ? "UPLOADING..." : status === "success" ? "OVERRIDDEN" : "EXECUTE"}
                </button>
              </form>

              {status === "success" && (
                <div className="mt-4 p-3 bg-green-900/30 border border-green-500 text-green-400 text-center text-xs tracking-widest font-bold">
                  {message}
                </div>
              )}
              
              {status === "error" && (
                <div className="mt-4 p-3 bg-red-900/30 border border-red-500 text-red-400 text-center text-xs tracking-widest animate-pulse">
                  {message}
                </div>
              )}
            </div>
            
            <div className="text-center pt-4 space-y-4">
              {hints.map((h: any, i: number) => (
                <div key={h.id} className="p-4 border border-amber-900/30 bg-amber-900/10 text-amber-500/80 text-xs text-left font-mono">
                  <span className="text-amber-500 font-bold tracking-widest block mb-2">SYSTEM.HINT_0{i+1}_DECRYPTED:</span>
                  {h.content}
                </div>
              ))}
              
              {nextHintPenalty !== null && (
                <button 
                  onClick={requestHint}
                  disabled={hintLoading}
                  className="text-[10px] text-gray-600 hover:text-amber-500 disabled:opacity-50 uppercase tracking-widest transition-colors mt-4 block mx-auto"
                >
                  [ {hintLoading ? "DECRYPTING..." : `Request Next Hint (-${nextHintPenalty} PTS)`} ]
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
