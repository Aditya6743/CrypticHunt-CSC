"use client";
import { useEffect, useState } from "react";

export default function LandingCountdown({ startTime, status }: { startTime: Date | null, status: string | undefined }) {
  const [timeLeft, setTimeLeft] = useState<{ d: number, h: number, m: number, s: number } | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [isValidTarget, setIsValidTarget] = useState(true);

  useEffect(() => {
    if (!startTime) {
      setIsValidTarget(false);
      setTimeLeft({ d: 0, h: 0, m: 0, s: 0 });
      return;
    }

    const target = new Date(startTime).getTime();

    const updateTimer = () => {
      const now = Date.now();
      const diff = target - now;

      if (diff <= 0) {
        setIsLive(true);
        setTimeLeft({ d: 0, h: 0, m: 0, s: 0 });
        return;
      }

      setIsLive(false);
      setTimeLeft({
        d: Math.floor(diff / (1000 * 60 * 60 * 24)),
        h: Math.floor((diff / (1000 * 60 * 60)) % 24),
        m: Math.floor((diff / 1000 / 60) % 60),
        s: Math.floor((diff / 1000) % 60)
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [startTime, status]);

  if (isLive) {
    return (
      <div className="w-full max-w-2xl flex flex-col items-center absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 z-20 px-4">
        <h2 className="text-2xl md:text-4xl font-mono font-black text-cyan-400 tracking-[0.5em] uppercase mr-[-0.5em] drop-shadow-[0_0_10px_rgba(6,182,212,0.3)] animate-pulse">
          CHALLENGE LIVE
        </h2>
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent mt-8"></div>
      </div>
    );
  }

  if (!timeLeft) return null;

  const pad = (num: number) => num.toString().padStart(2, '0');
  const displayD = isValidTarget ? pad(timeLeft.d) : "--";
  const displayH = isValidTarget ? pad(timeLeft.h) : "--";
  const displayM = isValidTarget ? pad(timeLeft.m) : "--";
  const displayS = isValidTarget ? pad(timeLeft.s) : "--";

  return (
    <div className="w-full max-w-2xl flex flex-col items-center absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 z-20 px-4">
      
      <h3 className="text-[10px] md:text-xs font-mono text-cyan-400 tracking-[0.4em] uppercase mb-4 mr-[-0.4em]">
        CHALLENGE BEGINS IN
      </h3>

      <div className="flex items-start justify-center gap-1 md:gap-3 w-full">
        <div className="flex flex-col items-center min-w-[60px] md:min-w-[80px]">
          <span className="text-2xl md:text-4xl lg:text-4xl font-black font-mono text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.15)]">{displayD}</span>
          <span className="text-[8px] md:text-[9px] text-cyan-700/80 font-mono tracking-[0.25em] uppercase mt-1 md:mt-2">Days</span>
        </div>
        <span className="text-2xl md:text-4xl lg:text-4xl font-black font-mono text-cyan-900/50 -translate-y-0.5 md:-translate-y-1">:</span>
        <div className="flex flex-col items-center min-w-[60px] md:min-w-[80px]">
          <span className="text-2xl md:text-4xl lg:text-4xl font-black font-mono text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.15)]">{displayH}</span>
          <span className="text-[8px] md:text-[9px] text-cyan-700/80 font-mono tracking-[0.25em] uppercase mt-1 md:mt-2">Hours</span>
        </div>
        <span className="text-2xl md:text-4xl lg:text-4xl font-black font-mono text-cyan-900/50 -translate-y-0.5 md:-translate-y-1">:</span>
        <div className="flex flex-col items-center min-w-[60px] md:min-w-[80px]">
          <span className="text-2xl md:text-4xl lg:text-4xl font-black font-mono text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.15)]">{displayM}</span>
          <span className="text-[8px] md:text-[9px] text-cyan-700/80 font-mono tracking-[0.25em] uppercase mt-1 md:mt-2">Minutes</span>
        </div>
        <span className="text-2xl md:text-4xl lg:text-4xl font-black font-mono text-cyan-900/50 -translate-y-0.5 md:-translate-y-1">:</span>
        <div className="flex flex-col items-center min-w-[60px] md:min-w-[80px]">
          <span className="text-2xl md:text-4xl lg:text-4xl font-black font-mono text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.15)]">{displayS}</span>
          <span className="text-[8px] md:text-[9px] text-cyan-700/80 font-mono tracking-[0.25em] uppercase mt-1 md:mt-2">Seconds</span>
        </div>
      </div>

      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent mt-8"></div>
    </div>
  );
}
