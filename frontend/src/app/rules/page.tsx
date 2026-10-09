import Link from "next/link";
import ParticipantNavbar from "@/components/ParticipantNavbar";

export const metadata = {
  title: 'Rules | CRYPTIC HUNT',
};

export default function RulesPage() {
  return (
    <div className="min-h-screen bg-[#030407] text-gray-200 font-sans selection:bg-cyan-500/30 pb-20 relative">
      {/* Ambient Grid Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#05070B 2px, transparent 2px), linear-gradient(90deg, #05070B 2px, transparent 2px)', backgroundSize: '40px 40px', backgroundColor: 'rgba(0, 255, 255, 0.05)' }}></div>
      </div>
      
      <ParticipantNavbar activePage="rules" />
      <div className="max-w-4xl mx-auto z-10 relative mt-8 pb-20 px-4 sm:px-6">
        
        {/* Header */}
        <div className="mb-8 border-b border-cyan-900/50 pb-4">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold text-cyan-500 tracking-widest uppercase text-glow">Official Rules</h1>
              <p className="text-sm text-gray-500 mt-2 tracking-widest">CRYPTIC HUNT // DIRECTIVES & POINT SYSTEM</p>
            </div>
          </div>
        </div>

        {/* Rules Content */}
        <div className="bg-[#0a0e17]/90 backdrop-blur-sm border border-cyan-900/30 p-6 md:p-10 shadow-[0_0_30px_rgba(6,182,212,0.05)] space-y-10 text-sm text-gray-300 leading-relaxed">
          
          <section>
            <h2 className="text-lg font-bold text-white tracking-widest uppercase mb-4 flex items-center gap-3">
              <span className="text-cyan-500">01.</span> THE MISSION
            </h2>
            <p className="mb-2">Cryptic Hunt consists of exactly <strong>30 strictly sequential levels</strong> culminating in the Final Boss. You must completely decipher and bypass your current level before gaining access to the next.</p>
            <p>Levels span multiple domains including Cryptography, OSINT, Forensics, and Logic. Collaboration outside your registered team is strictly prohibited.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white tracking-widest uppercase mb-4 flex items-center gap-3">
              <span className="text-cyan-500">02.</span> POINT SYSTEM & PROGRESSION
            </h2>
            <p className="mb-4">Points are awarded upon successfully submitting the correct flag or passphrase. The difficulty and point values scale as you progress deeper into the system:</p>
            <ul className="space-y-2 list-disc list-outside ml-5 text-gray-400 mb-4">
              <li><strong className="text-cyan-400">Levels 01 - 20 (Easy):</strong> 10 Points each</li>
              <li><strong className="text-cyan-400">Levels 21 - 29 (Hard):</strong> 20 Points each</li>
              <li><strong className="text-cyan-400">Level 30 (Final Boss):</strong> 50 Points</li>
            </ul>
            <p>In the event of a point tie on the global leaderboard, the team that reached their current score in the shortest amount of time will be ranked higher.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white tracking-widest uppercase mb-4 flex items-center gap-3">
              <span className="text-cyan-500">03.</span> HINT PENALTIES
            </h2>
            <p className="mb-2">If your team is stuck, you may authorize the decryption of available hints. However, this comes at a permanent cost deducted directly from your total score.</p>
            <div className="bg-[#05070B] border border-cyan-900/30 p-4 rounded-sm mt-3 mb-3">
              <ul className="space-y-2 text-gray-400 font-mono text-xs">
                <li><span className="text-amber-500">LEVELS 01-20:</span> 10% Penalty (-1 Point per hint)</li>
                <li><span className="text-amber-500">LEVELS 21-29:</span> 20% Penalty (-4 Points per hint)</li>
                <li><span className="text-amber-500">LEVEL 30 (BOSS):</span> 20% Penalty (-10 Points per hint)</li>
              </ul>
            </div>
            <p className="text-amber-500/80 bg-amber-900/10 p-3 border border-amber-900/30 rounded-sm">
              <strong>WARNING:</strong> Hints will instantly deduct the penalty from your overall score. Use hints strategically.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white tracking-widest uppercase mb-4 flex items-center gap-3">
              <span className="text-cyan-500">04.</span> RULES OF ENGAGEMENT
            </h2>
            <ul className="space-y-3 list-disc list-outside ml-5 text-gray-400">
              <li><strong className="text-gray-200">No automated attacks:</strong> Brute-forcing flags, scanning tools (e.g., DirBuster, Nmap), or attempting SQL injection against the platform infrastructure is strictly forbidden.</li>
              <li><strong className="text-gray-200">No flag hoarding:</strong> Flags must be submitted as they are found. Holding flags to submit them all at once manipulating the time-based tiebreaker is prohibited.</li>
              <li><strong className="text-gray-200">Format compliance:</strong> For levels 1-29, answers are generally case-insensitive. However, <strong className="text-red-400">Level 30 is strictly case-sensitive</strong>. Always pay attention to spacing and special characters.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white tracking-widest uppercase mb-4 flex items-center gap-3">
              <span className="text-red-500">05.</span> VIOLATIONS
            </h2>
            <p className="text-red-400/80">Any attempt to disrupt the platform, exploit vulnerabilities in the dashboard, or share flags with other teams will result in immediate disqualification and a permanent ban for the entire team.</p>
          </section>

        </div>
      </div>
    </div>
  );
}
