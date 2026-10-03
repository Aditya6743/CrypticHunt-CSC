"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const res = await signIn("credentials", {
      teamId: username, // Overloading teamId field for admin username
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("UNAUTHORIZED. ACCESS DENIED.");
      setIsLoading(false);
    } else {
      router.push("/admin");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-[#020305] flex items-center justify-center p-4 font-mono relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#05070B 2px, transparent 2px), linear-gradient(90deg, #05070B 2px, transparent 2px)', backgroundSize: '40px 40px', backgroundColor: 'rgba(255, 0, 0, 0.02)' }}></div>

      <div className="z-10 w-full max-w-md bg-[#0a0e17] border border-red-900/50 p-8 rounded-sm shadow-[0_0_30px_rgba(255,0,0,0.05)]">
        <h1 className="text-3xl font-bold text-center text-red-500 mb-2">ADMIN CORE</h1>
        <p className="text-center text-gray-500 mb-8 text-sm tracking-widest">RESTRICTED ACCESS</p>

        {error && <div className="mb-6 p-3 bg-red-900/30 border border-red-500 text-red-400 text-sm text-center animate-pulse">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-red-500 text-xs tracking-widest mb-2">ADMIN ID</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-black border border-gray-800 px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
              required 
            />
          </div>
          <div>
            <label className="block text-red-500 text-xs tracking-widest mb-2">ACCESS KEY</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black border border-gray-800 px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors pr-12"
                required 
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-400 focus:outline-none transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </button>
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-4 bg-red-900/50 border border-red-500 hover:bg-red-800 disabled:opacity-50 text-white font-bold tracking-widest uppercase transition-all mt-4"
          >
            {isLoading ? "Verifying..." : "Override Protocol"}
          </button>
        </form>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <Link href="/" className="hover:text-red-400 transition-colors">Return to Surface</Link>
        </div>
      </div>
    </div>
  );
}
