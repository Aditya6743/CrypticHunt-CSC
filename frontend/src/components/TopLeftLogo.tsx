"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export default function TopLeftLogo() {
  const [clicks, setClicks] = useState(0);
  const [isRevealed, setIsRevealed] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    // If it's the absolute first load, hide this static logo until the Preloader finishes sliding it in
    // This prevents the mix-blend-screen from double-brightening the logo while the preloader overlaps it
    const hasVisited = sessionStorage.getItem("ch_visited");
    if (!hasVisited) {
      setIsRevealed(false);
      const revealTimer = setTimeout(() => {
        setIsRevealed(true);
      }, 3400); // Exact duration of preloader unmount
      return () => clearTimeout(revealTimer);
    }
  }, []);

  useEffect(() => {
    if (clicks === 0) return;
    if (clicks >= 3) {
      sessionStorage.removeItem("ch_visited");
      window.location.href = "/"; // Hard reload to trigger preloader
      return;
    }
    const timer = setTimeout(() => setClicks(0), 600); // Reset window
    return () => clearTimeout(timer);
  }, [clicks]);

  const handleClick = (e: React.MouseEvent) => {
    setClicks(c => c + 1);
    if (clicks + 1 >= 3) {
      e.preventDefault();
    }
  };

  if (!isRevealed) return null;

  return (
    <div 
      className="fixed top-6 left-12 lg:left-16 z-50 mix-blend-screen" 
      style={{ filter: 'contrast(1.2)', clipPath: 'inset(0 1.5% 0 0)' }}
    >
      <Link href={pathname === "/leaderboard" || pathname === "/rules" || pathname.startsWith("/level") ? "/dashboard" : (pathname === "/" ? "#" : "/")} onClick={handleClick} className="block w-[72px] h-[72px] relative">
        <Image 
          src="/logo.png" 
          alt="Cryptic Hunt Home" 
          fill
          className="hover:scale-110 transition-transform duration-300 object-contain"
          priority
        />
      </Link>
    </div>
  );
}
