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
              <p className="text-sm text-gray-500 mt-2 tracking-widest">CRYPTIC HUNT // DIRECTIVES</p>
            </div>
          </div>
        </div>

        {/* Rules Content */}
        <div className="bg-[#0a0e17]/90 backdrop-blur-sm border border-cyan-900/30 p-6 md:p-10 shadow-[0_0_30px_rgba(6,182,212,0.05)] space-y-10 text-sm text-gray-300 leading-relaxed">
          
          <section>
            <h2 className="text-lg font-bold text-white tracking-widest uppercase mb-4 flex items-center gap-3">
              <span className="text-cyan-500">01.</span> THE MISSION
            </h2>
            <p className="mb-2">Cryptic Hunt consists of 50 strictly sequential levels culminating in one Final Boss. You must completely decipher and bypass your current level before gaining access to the next.</p>
            <p>Levels span multiple domains including Cryptography, OSINT, Forensics, and Logic. Collaboration outside your registered team is strictly prohibited.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white tracking-widest uppercase mb-4 flex items-center gap-3">
              <span className="text-cyan-500">02.</span> SCORING & PROGRESSION
            </h2>
            <p className="mb-2">Base points are awarded upon successfully submitting the correct flag or passphrase. Later, more difficult levels yield higher base point rewards.</p>
            <p>In the event of a point tie on the global leaderboard, the team that reached their current score in the shortest amount of time will be ranked higher.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white tracking-widest uppercase mb-4 flex items-center gap-3">
              <span className="text-cyan-500">03.</span> HINT PENALTIES
            </h2>
            <p className="mb-2">If your team is stuck, you may authorize the decryption of available hints. However, this comes at a permanent cost.</p>
            <p className="text-amber-500/80 bg-amber-900/10 p-3 border border-amber-900/30 rounded-sm mt-3">
              <strong>WARNING:</strong> Using a hint will instantly deduct a set percentage (usually 10% or 20%) of the level's total point value from your overall score. Use hints strategically.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white tracking-widest uppercase mb-4 flex items-center gap-3">
              <span className="text-cyan-500">04.</span> RULES OF ENGAGEMENT
            </h2>
            <ul className="space-y-3 list-disc list-outside ml-5 text-gray-400">
              <li><strong className="text-gray-200">No automated attacks:</strong> Brute-forcing flags, scanning tools (e.g., DirBuster, Nmap), or attempting SQL injection against the platform infrastructure is strictly forbidden.</li>
              <li><strong className="text-gray-200">No flag hoarding:</strong> Flags must be submitted as they are found. Holding flags to submit them all at once manipulating the time-based tiebreaker is prohibited.</li>
              <li><strong className="text-gray-200">Format compliance:</strong> Unless specified otherwise, your decrypted answers must match exactly. Pay attention to case sensitivity and spacing.</li>
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
