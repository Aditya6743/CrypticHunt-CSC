"use client";

import Link from "next/link";

export default function LandingCountdown({
  startTime,
  status,
}: {
  startTime?: Date | null;
  status?: string | undefined;
}) {
  return (
    <div className="w-full max-w-2xl flex flex-col items-center absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-20 px-4">
      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/20 text-cyan-400 text-[10px] md:text-xs font-mono tracking-[0.3em] uppercase mb-2">
        <span className="w-2 h-2 rounded-full bg-cyan-400/80 shadow-[0_0_8px_rgba(6,182,212,0.8)]"></span>
        TRANSMISSION TERMINATED
      </div>

      <h2 className="text-2xl md:text-4xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-cyan-400 tracking-[0.4em] uppercase mr-[-0.4em] drop-shadow-[0_0_20px_rgba(6,182,212,0.3)]">
        EVENT CONCLUDED
      </h2>

      <p className="mt-2 text-[10px] md:text-xs font-mono text-gray-400 tracking-[0.25em] uppercase text-center">
        Thank you for participating
      </p>

      <div className="mt-3.5">
        <Link
          href="/leaderboard"
          prefetch={true}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-sm border border-cyan-500/40 bg-cyan-950/30 text-cyan-400 hover:bg-cyan-500 hover:text-black font-mono text-[10px] md:text-xs tracking-[0.2em] uppercase transition-all duration-300 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)]"
        >
          <span>View Final Leaderboard</span>
          <span>→</span>
        </Link>
      </div>

      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent mt-5"></div>
    </div>
  );
}
