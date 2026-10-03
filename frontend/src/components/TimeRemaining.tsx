"use client";
import { useState, useEffect } from "react";

export default function TimeRemaining({ endTime, haltedAt, isLive = true }: { endTime: Date | null, haltedAt?: Date | null, isLive?: boolean }) {
  const [remaining, setRemaining] = useState("--:--:--");

  useEffect(() => {
    if (!endTime) return;

    const end = new Date(endTime).getTime();
    
    // If the event is halted, freeze the visual countdown at the exact millisecond it was stopped.
    if (!isLive && haltedAt) {
      const haltTime = new Date(haltedAt).getTime();
      const diff = end - haltTime;
      
      if (diff <= 0) {
        setRemaining("00:00:00");
        return;
      }

      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      setRemaining(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
      return; // Do not set interval! Time is frozen.
    }

    const update = () => {
      const now = new Date().getTime();
      const diff = end - now;
      
      if (diff <= 0) {
        setRemaining("00:00:00");
        return;
      }

      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      setRemaining(
        `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
      );
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [endTime, haltedAt, isLive]);

  if (!isLive && haltedAt) {
    return <span className="text-amber-500 flex items-center gap-2">{remaining} <span className="text-[10px] bg-amber-900/30 border border-amber-500/50 px-2 py-0.5 rounded-sm animate-pulse">PAUSED</span></span>;
  }

  return <>{remaining}</>;
}
