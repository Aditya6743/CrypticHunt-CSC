"use client";
import { useState, useEffect } from "react";

export default function TimeElapsed({ startTime }: { startTime: Date | null }) {
  const [elapsed, setElapsed] = useState("00:00:00");

  useEffect(() => {
    if (!startTime) return;

    const start = new Date(startTime).getTime();
    
    const update = () => {
      const now = new Date().getTime();
      const diff = now - start;
      if (diff < 0) {
        setElapsed("00:00:00");
        return;
      }

      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      setElapsed(
        `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
      );
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  return <>{elapsed}</>;
}
