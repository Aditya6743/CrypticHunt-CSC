"use client";
import { useEffect } from "react";
import { cyberAudio } from "@/lib/audio";

export default function AudioProvider() {
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      // Find if we clicked a button, a link, or anything with role="button"
      const target = (e.target as HTMLElement).closest("button, a, input[type='submit'], [role='button']");
      if (target) {
        cyberAudio?.playClick();
      }
    };
    
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, []);

  return null;
}
