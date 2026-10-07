"use client";
import { useEffect, useState } from "react";
import { setTimerAction, resetTimerAction, toggleHaltAction } from "@/app/admin/(dashboard)/timerActions";

export default function AdminLiveTimer({ event }: { event: any }) {
  const [timeLeft, setTimeLeft] = useState<string>("--:--:--");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const updateCountdown = () => {
      if (!event?.endTime) {
        setTimeLeft("--:--:--");
        return;
      }

      let diff = 0;
      if (event.status === "HALTED" && event.haltedAt) {
        diff = new Date(event.endTime).getTime() - new Date(event.haltedAt).getTime();
      } else {
        diff = new Date(event.endTime).getTime() - Date.now();
      }

      if (diff <= 0) {
        setTimeLeft("00:00:00");
        return;
      }

      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);

      setTimeLeft(
        `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
      );
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [event]);

  const handleSetTimer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const h = parseInt(formData.get("hours") as string) || 0;
    const m = parseInt(formData.get("minutes") as string) || 0;
    await setTimerAction(h, m);
    setLoading(false);
  };

  const handleReset = async () => {
    if (!confirm("Are you sure you want to clear the deadline?")) return;
    setLoading(true);
    await resetTimerAction();
    setLoading(false);
  };

  const handleHaltToggle = async () => {
    setLoading(true);
    await toggleHaltAction();
    setLoading(false);
  };

  const isHalted = event?.status === "HALTED";
  const hasTimer = !!event?.endTime;

  return (
    <div className="relative overflow-hidden bg-[#030407]/90 backdrop-blur-3xl border border-cyan-950 p-8 rounded-lg shadow-[0_0_40px_rgba(0,0,0,0.8)] w-full mb-12 group">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 group-hover:via-cyan-400/60 to-transparent transition-all duration-700"></div>
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-cyan-600/10 rounded-full blur-[80px] pointer-events-none"></div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative z-10">
        
        {/* LIVE COUNTDOWN DISPLAY */}
        <div className="flex-1">
          <h3 className="text-gray-500 text-[10px] tracking-[0.2em] uppercase mb-4 flex items-center gap-3">
            GLOBAL DEADLINE CLOCK
            {hasTimer && (
              <span className={`w-2 h-2 rounded-full ${isHalted ? 'bg-amber-500' : 'bg-green-500 animate-pulse'}`}></span>
            )}
          </h3>
          
          <div className="flex items-end gap-4 mb-2">
            <div className={`text-5xl md:text-7xl font-black font-mono tracking-widest ${isHalted ? 'text-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.4)]' : 'text-cyan-400 drop-shadow-[0_0_15px_rgba(6,182,212,0.4)]'}`}>
              {timeLeft}
            </div>
            {isHalted && <span className="text-amber-500 text-sm font-bold tracking-widest uppercase mb-2 animate-pulse">[ PAUSED ]</span>}
          </div>
          <p className="text-xs text-gray-500">
            {hasTimer ? "Time remaining for all teams. Halting the event freezes the clock AND locks all participants out." : "No active deadline set."}
          </p>
        </div>

        {/* CONTROLS */}
        <div className="flex flex-col gap-4 w-full md:w-auto bg-[#010103]/80 p-6 border border-white/[0.03] shadow-inner rounded-md">
          <form onSubmit={handleSetTimer} className="flex gap-2 items-center">
            <div className="flex items-center bg-[#05070B] border border-white/[0.05] rounded-sm focus-within:border-cyan-500/50 focus-within:shadow-[0_0_15px_rgba(6,182,212,0.15)] transition-all duration-300">
              <input type="number" name="hours" defaultValue="1" min="0" max="999" className="w-12 bg-transparent p-2 text-xs font-mono text-white text-center focus:outline-none" />
              <span className="text-[9px] text-gray-500 pr-2 font-bold tracking-widest">HR</span>
            </div>
            <div className="flex items-center bg-[#05070B] border border-white/[0.05] rounded-sm focus-within:border-cyan-500/50 focus-within:shadow-[0_0_15px_rgba(6,182,212,0.15)] transition-all duration-300">
              <input type="number" name="minutes" defaultValue="30" min="0" max="59" className="w-12 bg-transparent p-2 text-xs font-mono text-white text-center focus:outline-none" />
              <span className="text-[9px] text-gray-500 pr-2 font-bold tracking-widest">MIN</span>
            </div>
            <button disabled={loading} type="submit" className="px-6 py-2.5 bg-cyan-950/30 border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500 hover:text-black hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-300 disabled:opacity-50 rounded-sm">
              Set New
            </button>
          </form>

          <div className="flex gap-2">
            <button 
              disabled={loading}
              onClick={handleHaltToggle}
              className={`flex-1 py-2.5 border text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-300 disabled:opacity-30 rounded-sm ${isHalted ? 'bg-green-950/20 border-green-500/50 text-green-400 hover:bg-green-500 hover:text-black hover:shadow-[0_0_15px_rgba(34,197,94,0.4)]' : 'bg-amber-950/20 border-amber-500/50 text-amber-400 hover:bg-amber-500 hover:text-black hover:shadow-[0_0_15px_rgba(245,158,11,0.4)]'}`}
            >
              {isHalted ? "Resume Event" : "Halt Event"}
            </button>
            <button 
              disabled={loading || !hasTimer} 
              onClick={handleReset}
              className="flex-1 py-2.5 bg-red-950/20 border border-red-500/40 text-red-400 hover:bg-red-500 hover:text-black hover:shadow-[0_0_15px_rgba(239,68,68,0.4)] text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-300 disabled:opacity-30 rounded-sm"
            >
              Clear
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
