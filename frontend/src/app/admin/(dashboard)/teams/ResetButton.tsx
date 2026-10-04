"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ResetButton({ teamId, teamName, hasRequest }: { teamId: string, teamName: string, hasRequest: boolean }) {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState("select"); // select | custom
  const [customPassword, setCustomPassword] = useState("");
  const router = useRouter();
  const menuRef = useRef<any>(null);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleReset = async (passwordOverride = "") => {
    if (!passwordOverride && !confirm(`Auto-generate new password for ${teamName}?`)) return;

    setLoading(true);
    try {
      const res = await fetch("/api/admin/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId, customPassword: passwordOverride })
      });
      const data = await res.json();
      if (res.ok) {
        alert(`Success! New Password for ${teamName} is:\n\n${data.newPassword}\n\nThe team can now see this on the Forgot Password page.`);
        setIsOpen(false);
        router.refresh();
      } else {
        alert("Failed to reset password.");
      }
    } catch {
      alert("Error resetting password.");
    }
    setLoading(false);
  };

  const handleCustomSubmit = (e: any) => {
    e.preventDefault();
    if (customPassword.trim().length < 4) {
      alert("Password must be at least 4 characters long.");
      return;
    }
    handleReset(customPassword);
  };

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button 
        onClick={(e) => { 
          e.stopPropagation(); 
          setIsOpen(!isOpen); 
          setMode("select"); 
          setCustomPassword(""); 
        }}
        className={`px-3 py-1 text-xs tracking-widest uppercase transition-colors border ${hasRequest ? 'bg-red-900/40 text-red-400 border-red-500/50 hover:bg-red-900/60 animate-pulse' : 'bg-cyan-900/20 text-cyan-500 border-cyan-800 hover:bg-cyan-900/50'}`}
      >
        Reset Pass
      </button>

      {isOpen && (
        <div 
          onClick={(e) => e.stopPropagation()} 
          className="absolute right-0 top-full mt-2 w-56 bg-[#020305] border border-cyan-900/80 shadow-[0_0_30px_rgba(0,0,0,0.9)] z-[100] flex flex-col p-2 gap-1 rounded-sm backdrop-blur-md"
        >
          {mode === "select" ? (
            <>
              <div className="text-gray-500 text-[9px] tracking-widest uppercase border-b border-gray-800 pb-2 mb-1 mt-1 px-2 flex items-center justify-between">
                <span>Select Method</span>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">✕</button>
              </div>
              <button 
                onClick={() => handleReset("")}
                disabled={loading}
                className="w-full text-left px-3 py-3 text-xs font-bold tracking-widest uppercase bg-cyan-900/10 text-cyan-400 hover:bg-cyan-900/40 border border-transparent transition-colors"
              >
                ▶ Auto-Generate
              </button>
              <button 
                onClick={() => setMode("custom")}
                disabled={loading}
                className="w-full text-left px-3 py-3 text-xs font-bold tracking-widest uppercase bg-violet-900/10 text-violet-400 hover:bg-violet-900/40 border border-transparent transition-colors"
              >
                ▶ Custom Input
              </button>
            </>
          ) : (
            <form onSubmit={handleCustomSubmit} className="flex flex-col gap-2 p-1">
               <div className="text-gray-500 text-[9px] tracking-widest uppercase border-b border-gray-800 pb-2 mb-1 flex justify-between items-center">
                 <span>Enter Password</span>
                 <button type="button" onClick={() => setMode("select")} className="text-gray-400 hover:text-white font-bold">← BACK</button>
               </div>
               <input 
                 type="text" 
                 value={customPassword}
                 onChange={(e) => setCustomPassword(e.target.value)}
                 placeholder="Type here..." 
                 className="w-full bg-black border border-violet-500/50 px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-400 transition-colors"
                 autoFocus
               />
               <button type="submit" disabled={loading} className="w-full py-3 mt-1 bg-violet-900/60 text-white font-bold text-xs tracking-widest uppercase border border-violet-500 hover:bg-violet-800 transition-colors">
                 {loading ? "Saving..." : "Confirm & Set"}
               </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
