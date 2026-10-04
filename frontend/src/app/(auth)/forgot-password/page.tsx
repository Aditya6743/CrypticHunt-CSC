"use client";
import Link from "next/link";
import { useState } from "react";

export default function ForgotPassword() {
  const [identifier, setIdentifier] = useState("");
  const [status, setStatus] = useState("idle");
  const [newPassword, setNewPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");
    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier })
      });
      const data = await res.json();
      
      if (!res.ok) {
        setErrorMessage(data.error || "An error occurred");
        setStatus("idle");
        return;
      }
      
      if (data.status === "resolved") {
        setNewPassword(data.newPassword);
        setStatus("resolved");
      } else if (data.status === "pending") {
        setStatus("pending");
      } else {
        setStatus("requested");
      }
    } catch {
      setErrorMessage("Network error occurred");
      setStatus("idle");
    }
  };

  return (
    <div className="min-h-screen bg-[#05070B] flex items-center justify-center p-4 font-mono relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#05070B 2px, transparent 2px), linear-gradient(90deg, #05070B 2px, transparent 2px)', backgroundSize: '40px 40px', backgroundColor: 'rgba(0, 255, 255, 0.05)' }}></div>

      <div className="z-10 w-full max-w-md bg-[#0a0e17] border border-cyan-900/50 p-8 rounded-sm shadow-[0_0_30px_rgba(6,182,212,0.1)]">
        <h1 className="text-2xl font-bold text-center text-cyan-400 mb-2 tracking-widest uppercase">Encryption Reset</h1>
        
        {status === "resolved" ? (
          <div className="bg-[#020305] border border-green-900/50 p-6 my-6 text-center">
            <p className="text-green-400 text-sm font-bold tracking-widest mb-4 uppercase">
              Admin Override Approved
            </p>
            <p className="text-gray-400 text-xs mb-2">Your new system password is:</p>
            <div className="bg-green-950/30 border border-green-500/30 py-3 text-white text-xl tracking-wider font-bold animate-pulse select-all cursor-text">
              {newPassword}
            </div>
            <p className="text-red-400 text-[10px] mt-4 uppercase tracking-widest">
              Save this immediately. This message will self-destruct upon exit.
            </p>
          </div>
        ) : status === "pending" || status === "requested" ? (
          <div className="bg-[#020305] border border-amber-900/50 p-6 my-6 text-center">
            <p className="text-amber-400 text-sm tracking-widest mb-4 uppercase">
              {status === "requested" ? "Request Transmitted" : "Request Pending"}
            </p>
            <p className="text-gray-400 text-xs leading-relaxed">
              Your request is currently awaiting Admin Approval. 
              Keep checking back here using your Team ID to view your new password once approved.
            </p>
          </div>
        ) : (
          <>
            <p className="text-center text-gray-500 mb-6 text-xs leading-relaxed">
              Submit your Team ID or Email to flag your account for reset, or to check the status of an existing request.
            </p>
            {errorMessage && <div className="mb-6 p-3 bg-red-900/30 border border-red-500 text-red-400 text-sm text-center animate-pulse">{errorMessage}</div>}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-cyan-500 text-xs tracking-widest mb-2">TEAM ID / EMAIL</label>
                <input 
                  type="text" 
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full bg-black border border-gray-800 px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  required 
                />
              </div>
              <button 
                type="submit" 
                disabled={status === "loading"}
                className="w-full py-4 bg-cyan-900/40 border border-cyan-600 hover:bg-cyan-800/60 disabled:opacity-50 text-cyan-400 font-bold tracking-widest uppercase transition-all"
              >
                {status === "loading" ? "Scanning..." : "Check / Request Reset"}
              </button>
            </form>
          </>
        )}

        <div className="mt-8 text-center text-sm">
          <Link href="/login" className="text-gray-500 hover:text-cyan-400 tracking-widest uppercase transition-all text-xs">
            [ Return to Login ]
          </Link>
        </div>
      </div>
    </div>
  );
}
