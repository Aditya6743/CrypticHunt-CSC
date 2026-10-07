"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

let hasCheckedStorage = false;
let initialVisitedState = false;





const playMagneticSyncSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    if (ctx.state === 'suspended') ctx.resume();

    const now = ctx.currentTime;

    // 1. The Magnetic Pull (0.2s to 1.2s) - Ultra smooth
    const pullOsc = ctx.createOscillator();
    pullOsc.type = 'sine';
    pullOsc.frequency.setValueAtTime(150, now + 0.2);
    pullOsc.frequency.exponentialRampToValueAtTime(400, now + 1.2);
    const pullGain = ctx.createGain();
    pullGain.gain.setValueAtTime(0, now + 0.2);
    pullGain.gain.linearRampToValueAtTime(0.1, now + 0.8);
    pullGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
    pullOsc.connect(pullGain);
    pullGain.connect(ctx.destination);
    pullOsc.start(now + 0.2);
    pullOsc.stop(now + 1.2);

    // 1.5 The Connection (1.2s) - Soft metallic impact instead of harsh click
    const joinClick = ctx.createOscillator();
    joinClick.type = 'triangle';
    joinClick.frequency.setValueAtTime(600, now + 1.2);
    joinClick.frequency.exponentialRampToValueAtTime(100, now + 1.28);
    const joinGain = ctx.createGain();
    joinGain.gain.setValueAtTime(0.15, now + 1.2);
    joinGain.gain.exponentialRampToValueAtTime(0.001, now + 1.28);
    joinClick.connect(joinGain);
    joinGain.connect(ctx.destination);
    joinClick.start(now + 1.2);
    joinClick.stop(now + 1.3);

    // 2. The Revolve (1.2s to 2.4s) - Deep cinematic resonance
    const revolveOsc = ctx.createOscillator();
    revolveOsc.type = 'sine'; // Sine is softer than triangle
    revolveOsc.frequency.setValueAtTime(50.0, now + 1.2); // Extremely low sub
    revolveOsc.frequency.linearRampToValueAtTime(40.0, now + 2.4); // Pitch drops
    const revolveGain = ctx.createGain();
    revolveGain.gain.setValueAtTime(0, now + 1.2);
    revolveGain.gain.linearRampToValueAtTime(0.3, now + 1.5);
    revolveGain.gain.linearRampToValueAtTime(0, now + 2.4);
    revolveOsc.connect(revolveGain);
    revolveGain.connect(ctx.destination);
    revolveOsc.start(now + 1.2);
    revolveOsc.stop(now + 2.4);

    // 3. The Slide to Corner (2.5s to 3.3s) - Airy swoop
    const slideOsc = ctx.createOscillator();
    slideOsc.type = 'sine';
    slideOsc.frequency.setValueAtTime(200, now + 2.5);
    slideOsc.frequency.exponentialRampToValueAtTime(1200, now + 3.2);
    const slideGain = ctx.createGain();
    slideGain.gain.setValueAtTime(0, now + 2.5);
    slideGain.gain.linearRampToValueAtTime(0.08, now + 2.8);
    slideGain.gain.linearRampToValueAtTime(0, now + 3.3);
    slideOsc.connect(slideGain);
    slideGain.connect(ctx.destination);
    slideOsc.start(now + 2.5);
    slideOsc.stop(now + 3.3);

    // 4. The Final Magnetic Lock (3.3s) - Premium thick thud
    const lockHigh = ctx.createOscillator();
    lockHigh.type = 'triangle';
    lockHigh.frequency.setValueAtTime(1000, now + 3.3);
    lockHigh.frequency.exponentialRampToValueAtTime(50, now + 3.4);
    const lockHighGain = ctx.createGain();
    lockHighGain.gain.setValueAtTime(0.2, now + 3.3);
    lockHighGain.gain.exponentialRampToValueAtTime(0.001, now + 3.4);
    lockHigh.connect(lockHighGain);
    lockHighGain.connect(ctx.destination);
    lockHigh.start(now + 3.3);
    lockHigh.stop(now + 3.45);

    const lockSub = ctx.createOscillator();
    lockSub.type = 'sine';
    lockSub.frequency.setValueAtTime(100, now + 3.3);
    lockSub.frequency.exponentialRampToValueAtTime(20, now + 3.45);
    const lockSubGain = ctx.createGain();
    lockSubGain.gain.setValueAtTime(0.4, now + 3.3);
    lockSubGain.gain.exponentialRampToValueAtTime(0.001, now + 3.5);
    lockSub.connect(lockSubGain);
    lockSubGain.connect(ctx.destination);
    lockSub.start(now + 3.3);
    lockSub.stop(now + 3.5);

  } catch (err) {
    console.error("Audio playback blocked or failed:", err);
  }
};

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Prevent React 18 Strict Mode from ruining the sessionStorage check on its double-pass
    if (!hasCheckedStorage) {
      initialVisitedState = !!sessionStorage.getItem("ch_visited");
      hasCheckedStorage = true;
    }

    if (initialVisitedState) {
      setIsLoading(false);
      return;
    }
    
    sessionStorage.setItem("ch_visited", "true");
    
    // Play cinematic boot sound
    playMagneticSyncSound();

    // Unmount exactly after the move animation finishes so it seamlessly swaps with layout logo
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3400);
    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      
      {/* Background overlay that fades out independently */}
      <div className="absolute inset-0 bg-[#010204] preloader-bg"></div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .preloader-bg {
          animation: fade-bg 0.8s cubic-bezier(0.7, 0, 0.3, 1) 2.5s forwards;
        }
        @keyframes fade-bg {
          0% { opacity: 1; backdrop-filter: blur(0px); }
          100% { opacity: 0; backdrop-filter: blur(10px); visibility: hidden; }
        }
        
        .logo-wrapper {
          position: absolute;
          transform-style: preserve-3d;
          perspective: 1000px;
          /* Base starting position (Mobile) */
          top: 50%;
          left: 50%;
          width: 128px;
          height: 128px;
          margin-top: -64px;
          margin-left: -64px;
          
          animation:
            revolve 1.2s cubic-bezier(0.4, 0, 0.2, 1) 1.2s forwards,
            moveToCorner-mobile 0.8s cubic-bezier(0.7, 0, 0.3, 1) 2.5s forwards;
        }

        @media (min-width: 768px) and (max-width: 1023px) {
          .logo-wrapper {
            animation:
              revolve 1.2s cubic-bezier(0.4, 0, 0.2, 1) 1.2s forwards,
              moveToCorner-tablet 0.8s cubic-bezier(0.7, 0, 0.3, 1) 2.5s forwards;
          }
        }
        
        @media (min-width: 1024px) {
          .logo-wrapper {
            /* Base starting position (Desktop) */
            width: 192px;
            height: 192px;
            margin-top: -96px;
            margin-left: -96px;
            
            animation:
              revolve 1.2s cubic-bezier(0.4, 0, 0.2, 1) 1.2s forwards,
              moveToCorner-desktop 0.8s cubic-bezier(0.7, 0, 0.3, 1) 2.5s forwards;
          }
        }

        .logo-left {
          clip-path: polygon(0 0, 50% 0, 50% 100%, 0 100%);
          animation: slide-in-left 1s cubic-bezier(0.25, 1, 0.5, 1) 0.2s both;
        }
        .logo-right {
          clip-path: polygon(50% 0, 100% 0, 100% 100%, 50% 100%);
          animation: slide-in-right 1s cubic-bezier(0.25, 1, 0.5, 1) 0.2s both;
        }
        .logo-solid {
          animation: show-solid 0.1s forwards 1.2s;
        }
        @keyframes show-solid {
          100% { opacity: 1; }
        }
        
        @keyframes slide-in-left {
          0% { transform: translateX(-40px) scale(0.9); opacity: 0; filter: blur(10px); }
          100% { transform: translateX(0) scale(1); opacity: 1; filter: blur(0); }
        }
        
        @keyframes slide-in-right {
          0% { transform: translateX(40px) scale(0.9); opacity: 0; filter: blur(10px); }
          100% { transform: translateX(0) scale(1); opacity: 1; filter: blur(0); }
        }
        
        @keyframes revolve {
          0% { transform: rotateY(0deg) scale(1); }
          50% { transform: rotateY(180deg) scale(1.15); }
          100% { transform: rotateY(360deg) scale(1); }
        }

        /* 
          Move animations calculate exact distance to match layout.tsx logo 
          which is positioned at "top-6 left-6" (24px, 24px) with width 72px 
        */
        @keyframes moveToCorner-mobile {
          0% { top: 50%; left: 50%; width: 128px; height: 128px; margin-top: -64px; margin-left: -64px; }
          100% { top: 16px; left: 16px; width: 50px; height: 50px; margin-top: 0; margin-left: 0; }
        }
        
        @keyframes moveToCorner-tablet {
          0% { top: 50%; left: 50%; width: 128px; height: 128px; margin-top: -64px; margin-left: -64px; }
          100% { top: 24px; left: 48px; width: 72px; height: 72px; margin-top: 0; margin-left: 0; }
        }
        
        @keyframes moveToCorner-desktop {
          0% { top: 50%; left: 50%; width: 192px; height: 192px; margin-top: -96px; margin-left: -96px; }
          100% { top: 24px; left: 64px; width: 72px; height: 72px; margin-top: 0; margin-left: 0; }
        }
      `}} />

      <div className="logo-wrapper mix-blend-screen" style={{ filter: 'contrast(1.2)' }}>
        
        {/* Left Half */}
        <div className="absolute inset-0 logo-left">
          <Image src="/logo.png" alt="Cryptic Hunt" fill className="object-contain" priority />
        </div>
        {/* Right Half */}
        <div className="absolute inset-0 logo-right">
          <Image src="/logo.png" alt="Cryptic Hunt" fill className="object-contain" priority />
        </div>
        
        {/* Solid Logo: instantly appears exactly when halves connect to hide any sub-pixel seam during movement */}
        <div className="absolute inset-0 logo-solid opacity-0">
          <Image src="/logo.png" alt="Cryptic Hunt" fill className="object-contain" priority />
        </div>
      </div>
    </div>
  );
}
