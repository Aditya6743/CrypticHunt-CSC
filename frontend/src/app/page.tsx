
import Link from "next/link";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import LogoutButton from "@/components/LogoutButton";
import LandingCountdown from "@/components/LandingCountdown";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const totalLevels = await prisma.level.count();
  const displayLevels = totalLevels > 0 ? totalLevels : 50;
  const event = await prisma.event.findFirst();
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
        @keyframes line-flow {
          0% { stroke-dashoffset: 1100; }
          100% { stroke-dashoffset: 0; }
        }
        . {
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
{/* Ambient Lighting Orbs - Faint Edge Bleed (iOS Safe) */}
      <div className="absolute top-[15%] -left-[20vw] w-[45vw] h-[45vw] bg-cyan-600/5 rounded-full blur-[150px] pointer-events-none z-0" style={{ animation: 'float 12s ease-in-out infinite', transform: 'translateZ(0)' }}></div>
      <div className="absolute bottom-[15%] -right-[20vw] w-[45vw] h-[45vw] bg-violet-600/5 rounded-full blur-[150px] pointer-events-none z-0" style={{ animation: 'float 15s ease-in-out infinite reverse', transform: 'translateZ(0)' }}></div>
      
      
      
      
      
      

      {/* Premium Cinematic Perspective Grid (Safe for iOS WebKit) */}
      <div 
        className="absolute bottom-0 left-0 w-full h-[35vh] pointer-events-none z-0 overflow-hidden opacity-30"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 100%)',
          transform: 'translateZ(0)'
        }}
      >
        <div className="w-full h-[200%] absolute bottom-0 left-0" style={{
          backgroundImage: 'linear-gradient(rgba(6, 182, 212, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.4) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          backgroundPosition: 'center bottom',
          transform: 'perspective(500px) rotateX(60deg) scale(2)',
          transformOrigin: 'bottom center',
          willChange: 'transform'
        }}></div>
      </div>


      {/* Falling Data Streams (Subtle) */}
      <div className="absolute top-0 left-[15%] w-[1px] h-32 bg-gradient-to-b from-transparent via-cyan-500/30 to-transparent pointer-events-none z-0 data-fall" style={{ animationDelay: '0s' }}></div>
      <div className="absolute top-0 right-[25%] w-[1px] h-48 bg-gradient-to-b from-transparent via-violet-500/30 to-transparent pointer-events-none z-0 data-fall" style={{ animationDelay: '3s', animationDuration: '12s' }}></div>
      <div className="absolute top-0 left-[85%] w-[1px] h-24 bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent pointer-events-none z-0 data-fall" style={{ animationDelay: '5s', animationDuration: '6s' }}></div>




      

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

      {/* 1. Left Circuit Line SVG (Cyan) */}
      <svg className="absolute top-[15%] left-0 w-96 h-96 opacity-60 pointer-events-none z-0 hidden lg:block" viewBox="0 0 400 400">
        <path d="M 0 50 L 150 50 L 150 250 L 300 250" fill="none" stroke="#06b6d4" strokeWidth="0.5" opacity="0.3" />
        <path d="M 0 50 L 150 50 L 150 250 L 300 250" fill="none" stroke="#06b6d4" strokeWidth="1.5" filter="url(#neonGlowCyan)" className="flow-path-cyan" />
        <circle cx="150" cy="50" r="3" fill="#06b6d4" filter="url(#neonGlowCyan)" />
        <circle cx="300" cy="250" r="3" fill="#06b6d4" className="animate-pulse" filter="url(#neonGlowCyan)" />
      </svg>

      {/* 2. Bottom Right Circuit Line SVG (Violet) */}
      <svg className="absolute bottom-[10%] right-0 w-96 h-96 opacity-60 pointer-events-none z-0 hidden lg:block" viewBox="0 0 400 400">
        <path d="M 400 250 L 250 250 L 250 80 L 100 80" fill="none" stroke="#8b5cf6" strokeWidth="0.5" opacity="0.3" />
        <path d="M 400 250 L 250 250 L 250 80 L 100 80" fill="none" stroke="#8b5cf6" strokeWidth="1.5" filter="url(#neonGlowViolet)" className="flow-path-violet" />
        <circle cx="250" cy="250" r="3" fill="#8b5cf6" filter="url(#neonGlowViolet)" />
        <circle cx="100" cy="80" r="3" fill="#8b5cf6" className="animate-pulse" filter="url(#neonGlowViolet)" />
      </svg>
      
      {/* 3. Top Right Circuit Line SVG (Violet) */}
      <svg className="absolute top-[5%] right-0 w-96 h-96 opacity-50 pointer-events-none z-0 hidden lg:block" viewBox="0 0 400 400">
        <path d="M 400 120 L 280 120 L 280 300 L 80 300" fill="none" stroke="#8b5cf6" strokeWidth="0.5" opacity="0.3" />
        <path d="M 400 120 L 280 120 L 280 300 L 80 300" fill="none" stroke="#8b5cf6" strokeWidth="1.5" filter="url(#neonGlowViolet)" className="flow-path-violet" style={{ animationDelay: '2s' }} />
        <circle cx="280" cy="120" r="3" fill="#8b5cf6" filter="url(#neonGlowViolet)" />
        <circle cx="80" cy="300" r="3" fill="#8b5cf6" className="animate-pulse" filter="url(#neonGlowViolet)" />
      </svg>

      {/* 4. Bottom Left Circuit Line SVG (Cyan) */}
      <svg className="absolute bottom-[20%] left-0 w-96 h-96 opacity-50 pointer-events-none z-0 hidden lg:block" viewBox="0 0 400 400">
        <path d="M 0 320 L 180 320 L 180 150 L 350 150" fill="none" stroke="#06b6d4" strokeWidth="0.5" opacity="0.3" />
        <path d="M 0 320 L 180 320 L 180 150 L 350 150" fill="none" stroke="#06b6d4" strokeWidth="1.5" filter="url(#neonGlowCyan)" className="flow-path-cyan" style={{ animationDelay: '1.5s' }} />
        <circle cx="180" cy="320" r="3" fill="#06b6d4" filter="url(#neonGlowCyan)" />
        <circle cx="350" cy="150" r="3" fill="#06b6d4" className="animate-pulse" filter="url(#neonGlowCyan)" />
      </svg>


      {/* Giant Ethereal Watermark Logo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[900px] md:h-[900px] opacity-10 pointer-events-none flex items-center justify-center">
        <Image src="/logo.png" alt="" width={900} height={900} className="object-contain " />
      </div>





      {/* --- MAIN HERO CONTENT --- */}
      <div className="z-10 w-full max-w-7xl mx-auto px-4 flex flex-col items-center text-center -mt-20 sm:-mt-24 md:-mt-40" style={{ animation: 'float 6s ease-in-out infinite' }}>
        
        {/* Top Status Pill */}
        <div className="hidden md:block relative group cursor-default mb-8">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-violet-500 rounded-full blur opacity-10 group-hover:opacity-20 transition duration-1000 group-hover:duration-200"></div>
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
          <h2 className="text-xs sm:text-sm md:text-xl text-cyan-400 tracking-[0.2em] sm:tracking-[0.4em] font-mono uppercase whitespace-nowrap">
            <span className="tracking-[0.1em] mr-1">30</span> Levels. One Final Boss.
          </h2>
          <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-cyan-500/50 hidden sm:block"></div>
        </div>

        {/* Description Box */}
        <div className="mb-12 md:mb-14 max-w-2xl mx-auto">
          <p className="text-gray-300 text-sm md:text-lg font-light leading-relaxed mb-2">
            The ultimate test of digital supremacy.
          </p>
          <p className="text-gray-500 text-xs md:text-sm font-mono leading-relaxed">
            <span className="whitespace-nowrap">[ CRYPTOGRAPHY ]</span>  //  <span className="whitespace-nowrap">[ OSINT ]</span>  //  <span className="whitespace-nowrap">[ FORENSICS ]</span>  //  <span className="whitespace-nowrap">[ LOGIC ]</span>
          </p>
        </div>
        
        {/* Buttons (Premium Gradient Borders) */}
        <div className="flex flex-col items-center">
          {session ? (
            <div className="relative group w-full max-w-sm mx-auto mt-2 md:mt-8">
              <div className="relative flex flex-col items-center justify-center w-full bg-[#020305]/60 backdrop-blur-md border border-cyan-800/30 p-6 sm:p-8 rounded-md hover:bg-[#030509]/90 hover:border-cyan-500/40 transition-all duration-700 overflow-hidden shadow-[0_0_20px_rgba(6,182,212,0.08)] group/auth">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent group-hover/auth:via-cyan-400/40 transition-all duration-700"></div>
                
                <div className="flex items-center justify-center gap-3 mb-3 w-full">
                  <div className="w-1.5 h-1.5 bg-green-500/80 rounded-full shadow-[0_0_5px_#22c55e]"></div>
                  <p className="text-gray-400/80 text-[10px] tracking-[0.3em] font-mono uppercase text-center">AUTHENTICATED AS</p>
                  <div className="w-1.5 h-1.5 opacity-0"></div>
                </div>
                
                <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-white tracking-[0.2em] uppercase mb-8 drop-shadow-sm text-center break-all">
                  {session?.user?.name}
                </h3>
                
                <div className="flex flex-col sm:flex-row gap-4 w-full">
                  <Link 
                    href={(session?.user as any)?.role === "ADMIN" ? "/admin" : "/dashboard"} 
                    className="flex-1 flex items-center justify-center px-6 py-2.5 bg-cyan-950/30 border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500 hover:text-black hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all duration-300 rounded-sm"
                  >
                    <span className="font-bold uppercase tracking-[0.2em] text-[10px]">DASHBOARD</span>
                  </Link>
                  
                  <div className="flex-1 flex">
                    <LogoutButton className="w-full flex items-center justify-center px-6 py-2.5 bg-[#020305]/40 border border-gray-800 text-gray-500 hover:border-red-500/50 hover:bg-red-950/20 hover:text-red-400 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)] font-bold uppercase tracking-[0.2em] text-[10px] transition-all duration-300 rounded-sm" />
                  </div>
                </div>

                <div className="absolute bottom-2 right-3 opacity-30 text-[8px] font-mono text-cyan-500/50 tracking-[0.2em] uppercase">SECURE_SESSION_ACTIVE</div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center w-full">
              <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto items-center justify-center">
                <Link href="/register" className="relative group w-full sm:w-auto">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400 to-violet-500 rounded-sm blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
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
              <Link href="/admin/login" className="mt-4 md:mt-8 text-xs md:text-sm font-mono text-gray-500 hover:text-red-500 font-bold transition-colors tracking-[0.2em] uppercase">
                [ Admin Access ]
              </Link>
            </div>
          )}
        </div>
      </div>

      
    
      <LandingCountdown startTime={event?.startTime || null} status={event?.status} />

    </div>
  );
}