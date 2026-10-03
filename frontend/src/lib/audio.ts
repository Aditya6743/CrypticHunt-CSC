"use client";

class CyberAudio {
  private ctx: AudioContext | null = null;

  private init() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public playClick() {
    try {
      this.init();
      if (!this.ctx) return;
      
      const time = this.ctx.currentTime;
      
      // High-tech UI Blip (Sine wave with rapid frequency drop)
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = "sine";
      // Start high, instantly drop low
      osc.frequency.setValueAtTime(2000, time);
      osc.frequency.exponentialRampToValueAtTime(200, time + 0.03);
      
      // Fast attack, fast decay
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.08, time + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(time);
      osc.stop(time + 0.05);
    } catch(e) {}
  }

  public playPreloader() {
    try {
      this.init();
      if (!this.ctx) return;
      const time = this.ctx.currentTime;

      // 1. Sub-bass power-up sweep
      const sub = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      sub.type = "sine";
      sub.frequency.setValueAtTime(30, time);
      sub.frequency.exponentialRampToValueAtTime(80, time + 1.0);
      subGain.gain.setValueAtTime(0, time);
      subGain.gain.linearRampToValueAtTime(0.3, time + 0.5);
      subGain.gain.linearRampToValueAtTime(0, time + 2.0);
      sub.connect(subGain);
      subGain.connect(this.ctx.destination);
      sub.start(time);
      sub.stop(time + 2.0);

      // 2. Sci-Fi Chord Swell (Cm9: C, Eb, G, Bb, D)
      const frequencies = [261.63, 311.13, 392.00, 466.16, 587.33];
      frequencies.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const panner = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;
        
        // Triangle wave for a softer, glassy synth tone
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq * 2, time); // One octave higher
        
        // Swell envelope (fade in and out)
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.02, time + 0.5 + (i * 0.1));
        gain.gain.exponentialRampToValueAtTime(0.001, time + 2.5);

        // Spread chord across stereo field if supported
        if (panner) {
          panner.pan.setValueAtTime(i % 2 === 0 ? -0.3 : 0.3, time);
          osc.connect(gain);
          gain.connect(panner);
          panner.connect(this.ctx.destination);
        } else {
          osc.connect(gain);
          gain.connect(this.ctx.destination);
        }

        osc.start(time);
        osc.stop(time + 2.5);
      });

      // 3. Digital "Data processing" scatter (high frequency random blips)
      for(let i=0; i<8; i++) {
        const blip = this.ctx.createOscillator();
        const blipGain = this.ctx.createGain();
        blip.type = "sine";
        blip.frequency.setValueAtTime(1500 + Math.random() * 2000, time + (i * 0.05));
        blipGain.gain.setValueAtTime(0, time + (i * 0.05));
        blipGain.gain.linearRampToValueAtTime(0.015, time + (i * 0.05) + 0.01);
        blipGain.gain.exponentialRampToValueAtTime(0.001, time + (i * 0.05) + 0.04);
        blip.connect(blipGain);
        blipGain.connect(this.ctx.destination);
        blip.start(time + (i * 0.05));
        blip.stop(time + (i * 0.05) + 0.05);
      }

    } catch(e) {}
  }
}

export const cyberAudio = typeof window !== "undefined" ? new CyberAudio() : null;
