"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TopLeftLogo() {
  const [clicks, setClicks] = useState(0);
  const [isRevealed, setIsRevealed] = useState(true);
  const pathname = usePathname();

  // If the page already has a full-width navbar, we don't render the protective backdrop
  const hasOwnNavbar = pathname === "/dashboard" || pathname === "/leaderboard" || pathname === "/rules";

  useEffect(() => {
    const hasVisited = sessionStorage.getItem("ch_visited");
    if (!hasVisited) {
      setIsRevealed(false);
      const revealTimer = setTimeout(() => {
        setIsRevealed(true);
      }, 3400); 
      return () => clearTimeout(revealTimer);
    }
  }, []);

  useEffect(() => {
    if (clicks === 0) return;
    if (clicks >= 3) {
      sessionStorage.removeItem("ch_visited");
      window.location.href = "/"; 
      return;
    }
    const timer = setTimeout(() => setClicks(0), 600); 
    return () => clearTimeout(timer);
  }, [clicks]);

  const handleClick = (e) => {
    setClicks(c => c + 1);
    if (clicks + 1 >= 3) {
      e.preventDefault();
    }
  };

  if (!isRevealed) return null;

  return (
    <>
      {/* Global Protective Navbar Background (only on pages that need it, like Admin and Levels) */}
      {!hasOwnNavbar && (
        <div className="md:hidden fixed top-0 left-0 w-full h-[80px] bg-[#010204]/90 backdrop-blur-2xl border-b border-cyan-900/30 z-40 pointer-events-none shadow-[0_10px_30px_rgba(0,0,0,0.8)]"></div>
      )}

      {/* The Logo */}
      <div 
        className="fixed top-4 md:top-6 left-4 md:left-12 lg:left-16 z-50 mix-blend-screen" 
        style={{ filter: 'contrast(1.2)', clipPath: 'inset(0 1.5% 0 0)' }}
      >
        <Link href={pathname === "/leaderboard" || pathname === "/rules" || pathname.startsWith("/level") ? "/dashboard" : (pathname === "/" ? "#" : "/")} onClick={handleClick} className="block w-[50px] h-[50px] md:w-[72px] md:h-[72px] relative">
          <Image 
            src="/logo.png" 
            alt="Cryptic Hunt Home" 
            fill
            className="hover:scale-110 transition-transform duration-300 object-contain"
            priority
          />
        </Link>
      </div>
    </>
  );
}
