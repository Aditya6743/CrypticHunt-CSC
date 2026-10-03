"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Register() {
  const [formData, setFormData] = useState({
    teamName: "", leaderName: "", leaderEmail: "", contactNumber: "", college: "", teamMembers: "", password: "", confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      const res = await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setSuccess(`TEAM REGISTERED. ID: ${data.teamId}`);
      } else {
        setError(data.error || "Registration failed");
        setIsLoading(false);
      }
    } catch (err) {
      setError("Connection error");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05070B] py-12 px-4 flex items-center justify-center font-mono relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#05070B 2px, transparent 2px), linear-gradient(90deg, #05070B 2px, transparent 2px)', backgroundSize: '40px 40px', backgroundColor: 'rgba(0, 255, 255, 0.05)' }}></div>

      <div className="z-10 w-full max-w-2xl bg-[#0a0e17] border border-cyan-900/50 p-8 rounded-sm shadow-[0_0_30px_rgba(6,182,212,0.1)]">
        <h1 className="text-3xl font-bold text-center text-cyan-400 mb-2">TEAM REGISTRATION</h1>
        <p className="text-center text-gray-500 mb-8 text-sm">ENLIST FOR CRYPTIC HUNT</p>

        {error && <div className="mb-6 p-3 bg-red-900/30 border border-red-500 text-red-400 text-sm text-center animate-pulse">{error}</div>}
        {success && (
          <div className="mb-6 p-6 bg-green-950/40 border border-green-500/50 text-center">
            <h2 className="text-green-400 text-sm tracking-widest uppercase mb-4 font-bold">Registration Successful</h2>
            <p className="text-gray-300 text-xs mb-2">Save your Team ID below. You will need it to log in.</p>
            <div className="text-3xl font-bold text-white tracking-widest bg-black/50 py-4 border border-green-500/30 selectable animate-pulse mb-6">
              {success.replace('TEAM REGISTERED. ID: ', '')}
            </div>
            <button 
              type="button"
              onClick={() => router.push('/login')}
              className="px-8 py-3 bg-green-600 hover:bg-green-500 text-black font-bold tracking-widest uppercase transition-colors text-xs"
            >
              PROCEED TO TERMINAL
            </button>
          </div>
        )}

        {!success && (<form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-cyan-500 text-xs tracking-widest mb-2">TEAM NAME</label>
            <input type="text" required onChange={(e) => setFormData({...formData, teamName: e.target.value})} className="w-full bg-black border border-gray-800 px-4 py-3 text-white focus:outline-none focus:border-cyan-500" />
          </div>
          <div>
            <label className="block text-cyan-500 text-xs tracking-widest mb-2">LEADER NAME</label>
            <input type="text" required onChange={(e) => setFormData({...formData, leaderName: e.target.value})} className="w-full bg-black border border-gray-800 px-4 py-3 text-white focus:outline-none focus:border-cyan-500" />
          </div>
          <div>
            <label className="block text-cyan-500 text-xs tracking-widest mb-2">LEADER EMAIL</label>
            <input type="email" required onChange={(e) => setFormData({...formData, leaderEmail: e.target.value})} className="w-full bg-black border border-gray-800 px-4 py-3 text-white focus:outline-none focus:border-cyan-500" />
          </div>
          <div>
            <label className="block text-cyan-500 text-xs tracking-widest mb-2">CONTACT NUMBER</label>
            <input 
              type="tel" 
              required 
              pattern="[0-9]{10}" 
              maxLength={10} 
              minLength={10} 
              title="Please enter exactly 10 digits" 
              value={formData.contactNumber}
              onChange={(e) => setFormData({...formData, contactNumber: e.target.value.replace(/\D/g, '').slice(0, 10)})} 
              className="w-full bg-black border border-gray-800 px-4 py-3 text-white focus:outline-none focus:border-cyan-500" 
            />
          </div>
          <div>
            <label className="block text-cyan-500 text-xs tracking-widest mb-2">COLLEGE / UNIVERSITY</label>
            <input type="text" required onChange={(e) => setFormData({...formData, college: e.target.value})} className="w-full bg-black border border-gray-800 px-4 py-3 text-white focus:outline-none focus:border-cyan-500" />
          </div>
          <div className="md:col-span-2">
            <div className="flex justify-between items-end mb-2">
              <label className="block text-cyan-500 text-xs tracking-widest">TEAM MEMBERS (Comma separated)</label>
              <span className="text-gray-600 text-[10px] tracking-widest uppercase">(Optional)</span>
            </div>
            <textarea onChange={(e) => setFormData({...formData, teamMembers: e.target.value})} className="w-full bg-black border border-gray-800 px-4 py-3 text-white focus:outline-none focus:border-cyan-500 min-h-[80px]"></textarea>
          </div>
          <div>
            <label className="block text-cyan-500 text-xs tracking-widest mb-2">PASSWORD</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} required onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full bg-black border border-gray-800 px-4 py-3 text-white focus:outline-none focus:border-cyan-500 pr-12" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-cyan-400 focus:outline-none transition-colors" tabIndex={-1}>
                {showPassword ? <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg> : <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-cyan-500 text-xs tracking-widest mb-2">CONFIRM PASSWORD</label>
            <div className="relative">
              <input type={showConfirmPassword ? "text" : "password"} required onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} className="w-full bg-black border border-gray-800 px-4 py-3 text-white focus:outline-none focus:border-cyan-500 pr-12" />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-cyan-400 focus:outline-none transition-colors" tabIndex={-1}>
                {showConfirmPassword ? <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg> : <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>}
              </button>
            </div>
          </div>
          
          <div className="md:col-span-2 pt-4">
            <button 
              type="submit" 
              disabled={isLoading || !!success}
              className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-black font-bold tracking-widest uppercase transition-all"
            >
              {isLoading ? "Processing..." : "Submit Registration"}
            </button>
          </div>
        </form>)}
        
        <div className="mt-8 text-center text-sm text-gray-500">
          Already enlisted? <Link href="/login" className="text-cyan-400 hover:underline">Access Terminal</Link>
        </div>
      </div>
    </div>
  );
}
