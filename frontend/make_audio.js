const fs = require('fs');
const path = require('path');

const write = (filePath, content) => {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content.trim() + '\n');
  console.log(`Updated ${filePath}`);
};

// 1. CREATE AUDIO UTILITY
write('src/lib/audio.ts', `
"use client";

class CyberAudio {
  private ctx: AudioContext | null = null;

  private init() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    // Resume context if browser suspended it
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public playClick() {
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = "square";
      osc.frequency.setValueAtTime(150, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.1);
      
      // Extremely low volume (0.015) so it doesn't annoy
      gain.gain.setValueAtTime(0.015, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.1);
    } catch(e) {} // Silently fail if blocked by browser
  }

  public playPreloader() {
    try {
      this.init();
      if (!this.ctx) return;
      
      // Rapid data-processing beeps
      for (let i = 0; i < 4; i++) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "square";
        osc.frequency.setValueAtTime(600 + Math.random() * 400, this.ctx.currentTime + i * 0.1);
        gain.gain.setValueAtTime(0.01, this.ctx.currentTime + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.1 + 0.05);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + i * 0.1);
        osc.stop(this.ctx.currentTime + i * 0.1 + 0.05);
      }
      
      // Followed by a cinematic low sweep
      const hum = this.ctx.createOscillator();
      const humGain = this.ctx.createGain();
      hum.type = "sine";
      hum.frequency.setValueAtTime(120, this.ctx.currentTime + 0.4);
      hum.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 1.5);
      
      humGain.gain.setValueAtTime(0, this.ctx.currentTime + 0.4);
      humGain.gain.linearRampToValueAtTime(0.02, this.ctx.currentTime + 0.6);
      humGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 1.5);
      
      hum.connect(humGain);
      humGain.connect(this.ctx.destination);
      hum.start(this.ctx.currentTime + 0.4);
      hum.stop(this.ctx.currentTime + 1.5);
    } catch(e) {}
  }
}

export const cyberAudio = typeof window !== "undefined" ? new CyberAudio() : null;
`);

// 2. CREATE GLOBAL AUDIO PROVIDER COMPONENT
write('src/components/AudioProvider.tsx', `
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
`);

console.log("Audio scripts created.");
