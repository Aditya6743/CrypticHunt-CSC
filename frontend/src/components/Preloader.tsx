"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

let hasCheckedStorage = false;
let initialVisitedState = false;

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

        @media (min-width: 768px) {
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
          clip-path: polygon(50% 0, 98.5% 0, 98.5% 100%, 50% 100%);
          animation: slide-in-right 1s cubic-bezier(0.25, 1, 0.5, 1) 0.2s both;
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
      </div>
    </div>
  );
}
