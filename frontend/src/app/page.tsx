
import Link from "next/link";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import LogoutButton from "@/components/LogoutButton";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const totalLevels = await prisma.level.count();
  const displayLevels = totalLevels > 0 ? totalLevels : 50;
  return (
    <div className="min-h-screen bg-[#010204] text-white flex flex-col items-center justify-center relative overflow-hidden font-sans selection:bg-cyan-500/30">
      
      {/* --- CUSTOM CSS ANIMATIONS --- */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scanline {
          0% { transform: translateY(-100vh); }
          100% { transform: translateY(100vh); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes data-stream {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 0.5; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        @keyframes spin {
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
        .mask-image-gradient {
          mask-image: linear-gradient(to bottom, transparent, black);
          -webkit-mask-image: linear-gradient(to bottom, transparent, black);
        }
        @keyframes line-flow {
          0% { stroke-dashoffset: 1100; }
          100% { stroke-dashoffset: 0; }
        }
        .text-glow {
          text-shadow: 0 0 20px rgba(6, 182, 212, 0.4), 0 0 40px rgba(6, 182, 212, 0.2);
        }
        .data-fall { animation: data-stream 8s linear infinite; }
        .flow-path-cyan {
          stroke-dasharray: 100 1000;
          animation: line-flow 4s linear infinite;
        }
        .flow-path-violet {
          stroke-dasharray: 100 1000;
          animation: line-flow 4s linear infinite;
        }
      `}} />

      {/* --- BACKGROUND & LIGHTING --- */}
      {/* Uploaded Background Image */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image 
          src="/bg-hero.png" 
          alt="Cyber Background" 
          fill 
          className="object-cover object-bottom"
          priority
        />
      </div>

      {/* CRT / Hologram Dot Matrix Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-30 mix-blend-overlay" style={{
        backgroundImage: 'radial-gradient(rgba(255,255,255,0.3) 1px, transparent 1px)',
        backgroundSize: '3px 3px'
      }}></div>

      {/* Dark Overlays to tone down the glow and create depth */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-[#010204]/70 mix-blend-multiply"></div>
      <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-t from-[#010204] via-transparent to-[#010204]/70"></div>
      
      
      {/* Cinematic Vignette */}
      <div className="absolute inset-0 z-0 pointer-events-none" style={{ boxShadow: 'inset 0 0 150px rgba(1, 2, 4, 0.9)' }}></div>

      {/* --- PREMIUM AMBIENT ENHANCEMENTS --- */}
      
      {/* Ambient Lighting Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-cyan-600/5 rounded-full blur-[160px] pointer-events-none z-0 mix-blend-screen" style={{ animation: 'float 12s ease-in-out infinite' }}></div>
      <div className="absolute bottom-1/4 right-1/4 w-[50vw] h-[50vw] bg-blue-600/5 rounded-full blur-[200px] pointer-events-none z-0 mix-blend-screen" style={{ animation: 'float 15s ease-in-out infinite reverse' }}></div>
      
      
      
      

      {/* Futuristic Perspective Grid */}
      <div className="absolute bottom-0 left-0 w-full h-[40vh] pointer-events-none z-0 overflow-hidden opacity-30 mask-image-gradient">
        <div className="w-full h-[200%] absolute bottom-0" style={{
          backgroundImage: 'linear-gradient(rgba(6, 182, 212, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.2) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          transform: 'perspective(1000px) rotateX(75deg) translateY(100px)',
          transformOrigin: 'bottom'
        }}></div>
      </div>


      {/* Falling Data Streams (Subtle) */}
      <div className="absolute top-0 left-[15%] w-[1px] h-32 bg-gradient-to-b from-transparent via-cyan-500/30 to-transparent pointer-events-none z-0 data-fall" style={{ animationDelay: '0s' }}></div>
      <div className="absolute top-0 right-[25%] w-[1px] h-48 bg-gradient-to-b from-transparent via-violet-500/30 to-transparent pointer-events-none z-0 data-fall" style={{ animationDelay: '3s', animationDuration: '12s' }}></div>
      <div className="absolute top-0 left-[85%] w-[1px] h-24 bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent pointer-events-none z-0 data-fall" style={{ animationDelay: '5s', animationDuration: '6s' }}></div>


      {/* --- CYBER DECORATIONS (LINES & DATA) --- */}
      {/* Top Left Terminal Log (No Flicker) */}
      <div className="absolute top-32 left-8 lg:left-16 font-mono text-[10px] md:text-xs text-cyan-400 leading-relaxed pointer-events-none z-0 hidden md:block">
        <p className="mb-1 text-cyan-200">INITIATING_</p>
        <p className="mb-1">SECURE CONNECTION...</p>
        <p className="text-cyan-300">OK [200]</p>
      </div>

      {/* Bottom Left Binary (No Flicker) */}
      <div className="absolute bottom-40 left-8 lg:left-16 font-mono text-[10px] md:text-xs text-cyan-500 leading-relaxed pointer-events-none z-0 hidden md:block opacity-60">
        <p>01001011</p>
        <p>01010010</p>
        <p>01011011</p>
        <p>01010000</p>
      </div>

      {/* Top Right System Data (No Flicker) */}
      <div className="absolute top-48 right-8 lg:right-16 font-mono text-[10px] md:text-xs text-violet-400 text-right pointer-events-none z-0 hidden md:block opacity-70">
        <p className="text-violet-200">SYS.REQ: 0x99A</p>
        <p>PACKETS: 4,091</p>
        <p>LATENCY: 12ms</p>
      </div>

      {/* Shared SVG Filters for true glowing lines */}
      <svg width="0" height="0" className="hidden">
        <defs>
          <filter id="neonGlowCyan">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="neonGlowViolet">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* Left Circuit Line SVG (Live Flowing) */}
      <svg className="absolute top-[15%] left-0 w-96 h-96 opacity-60 pointer-events-none z-0 hidden lg:block" viewBox="0 0 400 400">
        {/* Base faint line */}
        <path d="M 0 50 L 150 50 L 150 250 L 300 250" fill="none" stroke="#06b6d4" strokeWidth="0.5" opacity="0.3" />
        {/* Animated glowing pulse */}
        <path d="M 0 50 L 150 50 L 150 250 L 300 250" fill="none" stroke="#06b6d4" strokeWidth="1.5" filter="url(#neonGlowCyan)" className="flow-path-cyan" />
        
        <circle cx="150" cy="50" r="3" fill="#06b6d4" filter="url(#neonGlowCyan)" />
        <circle cx="300" cy="250" r="3" fill="#06b6d4" className="animate-pulse" filter="url(#neonGlowCyan)" />
      </svg>

      {/* Right Circuit Line SVG (Live Flowing) */}
      <svg className="absolute bottom-[15%] right-0 w-96 h-96 opacity-60 pointer-events-none z-0 hidden lg:block" viewBox="0 0 400 400">
        {/* Base faint line */}
        <path d="M 400 250 L 250 250 L 250 80 L 100 80" fill="none" stroke="#8b5cf6" strokeWidth="0.5" opacity="0.3" />
        {/* Animated glowing pulse */}
        <path d="M 400 250 L 250 250 L 250 80 L 100 80" fill="none" stroke="#8b5cf6" strokeWidth="1.5" filter="url(#neonGlowViolet)" className="flow-path-violet" />
        
        <circle cx="250" cy="250" r="3" fill="#8b5cf6" filter="url(#neonGlowViolet)" />
        <circle cx="100" cy="80" r="3" fill="#8b5cf6" className="animate-pulse" filter="url(#neonGlowViolet)" />
      </svg>


      {/* Giant Ethereal Watermark Logo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[900px] md:h-[900px] opacity-[0.03] pointer-events-none mix-blend-screen flex items-center justify-center">
        <Image src="/logo.png" alt="" width={900} height={900} className="object-contain" />
      </div>


      {/* --- HUD (HEADS UP DISPLAY) BORDERS --- */}
      <div className="absolute top-6 right-6 text-[10px] font-mono text-violet-500/40 hidden md:block">ENCRYPTION: ACTIVE</div>
      <div className="absolute bottom-6 left-6 text-[10px] font-mono text-cyan-500/40 hidden md:block">LAT: 04.992 // LNG: 12.001</div>
      <div className="absolute bottom-6 right-6 text-[10px] font-mono text-violet-500/40 hidden md:block animate-pulse">AWAITING_INPUT...</div>


      {/* --- MAIN HERO CONTENT --- */}
      <div className="z-10 w-full max-w-7xl mx-auto px-4 flex flex-col items-center text-center -mt-28 md:-mt-40" style={{ animation: 'float 6s ease-in-out infinite' }}>
        
        {/* Top Status Pill */}
        <div className="relative group cursor-default mb-8">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-violet-500 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative flex items-center gap-3 px-6 py-2 bg-[#020305]/80 backdrop-blur-xl border border-white/10 rounded-full">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </div>
            <span className="text-cyan-50 text-[10px] md:text-xs font-mono tracking-[0.2em] uppercase">Global Network Online</span>
          </div>
        </div>

        {/* Massive Title */}
        <div className="relative mb-4">
          <h1 className="text-5xl md:text-7xl lg:text-[6.5rem] font-black tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-br from-white via-cyan-100 to-[#1a2f4c] pb-2">
            <span className="mr-3 md:mr-6">CRYPTIC</span><span>HUNT</span>
          </h1>
        </div>
        
        {/* Subtitle */}
        <div className="flex items-center gap-4 mb-8">
          <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-cyan-500/50 hidden sm:block"></div>
          <h2 className="text-sm md:text-xl text-cyan-400 tracking-[0.4em] font-mono uppercase text-glow">
            50 Levels. One Final Boss.
          </h2>
          <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-cyan-500/50 hidden sm:block"></div>
        </div>

        {/* Description Box */}
        <div className="mb-14 max-w-2xl mx-auto">
          <p className="text-gray-300 text-sm md:text-lg font-light leading-relaxed mb-2">
            The ultimate test of digital supremacy.
          </p>
          <p className="text-gray-500 text-xs md:text-sm font-mono leading-relaxed">
            [ CRYPTOGRAPHY ]  //  [ OSINT ]  //  [ FORENSICS ]  //  [ LOGIC ]
          </p>
        </div>
        
        {/* Buttons (Premium Gradient Borders) */}
        <div className="flex flex-col items-center">
          {session ? (
            <div className="relative group w-full max-w-sm mx-auto mt-4">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-violet-500 to-cyan-500 rounded-sm blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 animate-gradient-x"></div>
              <div className="relative flex flex-col items-center justify-center w-full bg-[#020305]/90 backdrop-blur-xl border border-white/10 rounded-sm p-8 shadow-2xl">
                
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-violet-500"></div>
                
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_10px_#4ade80]"></div>
                  <p className="text-gray-400 text-[10px] tracking-[0.3em] font-mono uppercase">AUTHENTICATED AS</p>
                </div>
                
                <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-white tracking-widest uppercase mb-8 drop-shadow-md text-center break-all">
                  {session.user.name}
                </h3>
                
                <div className="flex flex-col sm:flex-row gap-4 w-full">
                  <Link 
                    href={session.user.role === "ADMIN" ? "/admin" : "/dashboard"} 
                    className="flex-1 relative flex items-center justify-center px-6 py-3 bg-cyan-500 hover:bg-cyan-400 transition-colors rounded-sm"
                  >
                    <span className="text-black font-black uppercase tracking-[0.2em] text-xs">DASHBOARD</span>
                  </Link>
                  
                  <div className="flex-1 relative flex">
                    <LogoutButton className="w-full flex items-center justify-center px-6 py-3 bg-transparent border border-gray-700 hover:border-red-500 hover:bg-red-950/30 text-gray-400 hover:text-red-400 font-bold uppercase tracking-[0.2em] text-xs transition-all rounded-sm" />
                  </div>
                </div>

                <div className="absolute bottom-2 right-3 opacity-20 text-[8px] font-mono text-cyan-500 tracking-widest">SECURE_SESSION_ACTIVE</div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center w-full">
              <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto items-center justify-center">
                <Link href="/register" className="relative group w-full sm:w-auto">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400 to-violet-500 rounded-sm blur opacity-50 group-hover:opacity-100 transition duration-300"></div>
                  <div className="relative flex items-center justify-center px-10 py-4 bg-cyan-500 group-hover:bg-cyan-400 rounded-sm transition-all duration-300">
                    <span className="text-black font-black uppercase tracking-[0.2em] text-sm">Initiate Registration</span>
                  </div>
                </Link>
                <Link href="/login" className="relative group w-full sm:w-auto">
                  <div className="absolute -inset-px bg-gradient-to-r from-white/10 to-white/5 rounded-sm group-hover:from-cyan-500/50 group-hover:to-violet-500/50 transition duration-300"></div>
                  <div className="relative flex items-center justify-center px-10 py-4 bg-[#020305]/80 backdrop-blur-md rounded-sm border border-transparent transition-all duration-300">
                    <span className="text-gray-300 group-hover:text-cyan-300 font-bold uppercase tracking-[0.2em] text-sm transition-colors">Access Terminal</span>
                  </div>
                </Link>
              </div>
              <Link href="/admin/login" className="mt-8 text-xs md:text-sm font-mono text-gray-500 hover:text-red-500 font-bold transition-colors tracking-[0.2em] uppercase">
                [ Admin Access ]
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* --- FLOATING PREMIUM TERMINAL WIDGET --- */}
      <div className="absolute bottom-8 lg:bottom-12 z-20 w-[90%] max-w-3xl hidden md:block">
        <div className="relative rounded-lg overflow-hidden border border-white/5 bg-[#030509]/60 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)]">
          {/* Glass highlight */}
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>
          
          <div className="flex justify-between items-center px-6 py-3 border-b border-white/5 bg-white/[0.02]">
            <div className="flex gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/40"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/40"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/40"></div>
            </div>
            <div className="text-[10px] font-mono text-gray-500 tracking-widest uppercase">Target.Acquired // CH_Core_Node</div>
          </div>
          
          <div className="p-6 font-mono text-[11px] md:text-sm text-cyan-500/70 grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="flex justify-between border-b border-white/5 pb-1">
                <span className="text-gray-500">SYSTEM.STATUS</span>
                <span className="text-green-400 text-glow">ONLINE</span>
              </p>
              <p className="flex justify-between border-b border-white/5 pb-1">
                <span className="text-gray-500">LEVELS.LOCKED</span>
                <span className="text-cyan-400 text-glow">50</span>
              </p>
            </div>
            <div className="space-y-2">
              <p className="flex justify-between border-b border-white/5 pb-1">
                <span className="text-gray-500">ENCRYPTION</span>
                <span className="text-violet-400">AES-256</span>
              </p>
              <p className="flex justify-between border-b border-white/5 pb-1">
                <span className="text-gray-500">NODE.ENTRY</span>
                <span className="text-cyan-400 animate-pulse">AWAITING_INPUT_</span>
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
