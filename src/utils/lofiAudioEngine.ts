/**
 * Procedural Web Audio API Lo-Fi & Ambient Sound Engine
 * Zero external MP3 / audio assets required.
 * Generates warm Rhodes-like 7th/9th chord progressions, 
 * procedural analog vinyl crackle, gentle room reverb, and rhythmic pulses.
 */

export type LoFiMood = 'latenight' | 'elevator' | 'cyberpunk';

interface MoodConfig {
  id: LoFiMood;
  nameEn: string;
  nameVi: string;
  defaultBpm: number;
  descriptionEn: string;
  descriptionVi: string;
  filterCutoff: number; // Hz
  chords: number[][]; // MIDI note frequencies
}

// Frequencies (Hz) for musical notes
const NOTE_FREQ: Record<string, number> = {
  C3: 130.81, D3: 146.83, Eb3: 155.56, E3: 164.81, F3: 174.61, G3: 196.00, Ab3: 207.65, A3: 220.00, Bb3: 233.08, B3: 246.94,
  C4: 261.63, D4: 293.66, Eb4: 311.13, E4: 329.63, F4: 349.23, G4: 392.00, Ab4: 415.30, A4: 440.00, Bb4: 466.16, B4: 493.88,
  C5: 523.25, D5: 587.33, Eb5: 622.25, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00
};

export const MOOD_CONFIGS: Record<LoFiMood, MoodConfig> = {
  latenight: {
    id: 'latenight',
    nameEn: 'Late Night Coding Lo-Fi',
    nameVi: 'Lo-Fi Đêm Khuya Lập Trình',
    defaultBpm: 68,
    descriptionEn: 'Mellow Rhodes electric piano chords, soft low-pass filter, and cozy vinyl warmth.',
    descriptionVi: 'Hợp âm piano điện Rhodes ấm áp, lọc âm êm dịu và tiếng nổ đĩa than mộc mạc.',
    filterCutoff: 650,
    // Dm9 -> G13 -> Cmaj9 -> Am9
    chords: [
      [NOTE_FREQ.D3, NOTE_FREQ.F3, NOTE_FREQ.A3, NOTE_FREQ.C4, NOTE_FREQ.E4],
      [NOTE_FREQ.G3, NOTE_FREQ.F4, NOTE_FREQ.B3, NOTE_FREQ.E4],
      [NOTE_FREQ.C3, NOTE_FREQ.E3, NOTE_FREQ.G3, NOTE_FREQ.B3, NOTE_FREQ.D4],
      [NOTE_FREQ.A3, NOTE_FREQ.C4, NOTE_FREQ.E4, NOTE_FREQ.G4, NOTE_FREQ.B4]
    ]
  },
  elevator: {
    id: 'elevator',
    nameEn: 'Retro Elevator Synth',
    nameVi: 'Thang Máy Retro Bossa',
    defaultBpm: 82,
    descriptionEn: 'Smooth jazzy elevator progression with shimmering high bells and warm bass groove.',
    descriptionVi: 'Giai điệu thang máy bossa jazz mượt mà, tiếng chuông lấp lánh và âm trầm ấm áp.',
    filterCutoff: 1100,
    // Fmaj7 -> Em7 -> Dm7 -> Cmaj7
    chords: [
      [NOTE_FREQ.F3, NOTE_FREQ.A3, NOTE_FREQ.C4, NOTE_FREQ.E4],
      [NOTE_FREQ.E3, NOTE_FREQ.G3, NOTE_FREQ.B3, NOTE_FREQ.D4],
      [NOTE_FREQ.D3, NOTE_FREQ.F3, NOTE_FREQ.A3, NOTE_FREQ.C4],
      [NOTE_FREQ.C3, NOTE_FREQ.E3, NOTE_FREQ.G3, NOTE_FREQ.B3, NOTE_FREQ.D4]
    ]
  },
  cyberpunk: {
    id: 'cyberpunk',
    nameEn: 'Cyberpunk Ambient Drift',
    nameVi: 'Không Gian Số Cyberpunk',
    defaultBpm: 58,
    descriptionEn: 'Deep atmospheric sub-bass drones, minor suspended chords, and cavernous space reverb.',
    descriptionVi: 'Tiếng drone âm trầm sâu thẳm, hợp âm thứ huyền ảo và không gian hồi âm rộng lớn.',
    filterCutoff: 500,
    // Cm9 -> Abmaj7#11 -> Fm9 -> Gsus4
    chords: [
      [NOTE_FREQ.C3 * 0.5, NOTE_FREQ.C3, NOTE_FREQ.Eb3, NOTE_FREQ.G3, NOTE_FREQ.Bb3, NOTE_FREQ.D4],
      [NOTE_FREQ.Ab3 * 0.5, NOTE_FREQ.Ab3, NOTE_FREQ.C4, NOTE_FREQ.Eb4, NOTE_FREQ.G4, NOTE_FREQ.D4],
      [NOTE_FREQ.F3 * 0.5, NOTE_FREQ.F3, NOTE_FREQ.Ab3, NOTE_FREQ.C4, NOTE_FREQ.Eb4, NOTE_FREQ.G4],
      [NOTE_FREQ.G3 * 0.5, NOTE_FREQ.G3, NOTE_FREQ.C4, NOTE_FREQ.D4, NOTE_FREQ.F4]
    ]
  }
};

class LoFiAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private currentMood: LoFiMood = 'latenight';
  private bpm: number = 68;
  private vinylLevel: number = 0.45; // 0 to 1
  private reverbLevel: number = 0.40; // 0 to 1
  private masterVolume: number = 0.65; // 0 to 1

  // Nodes
  private masterGain: GainNode | null = null;
  private vinylGain: GainNode | null = null;
  private vinylSource: AudioBufferSourceNode | null = null;
  private mainFilter: BiquadFilterNode | null = null;
  private delayNode: DelayNode | null = null;
  private delayFeedbackGain: GainNode | null = null;
  private delayWetGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;

  // Sequencer loop timer
  private loopTimer: number | null = null;
  private currentChordIndex: number = 0;
  private listeners: Set<() => void> = new Set();

  private initContext() {
    if (this.ctx) return;
    if (typeof window === 'undefined') return;

    try {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtxClass) return;
      this.ctx = new AudioCtxClass();

      // Master Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);

      // Analyser Node for visualizer and audio reactivity
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;
      this.analyser.smoothingTimeConstant = 0.8;

    // Filter Node (Warm Lowpass)
    this.mainFilter = this.ctx.createBiquadFilter();
    this.mainFilter.type = 'lowpass';
    this.mainFilter.frequency.setValueAtTime(MOOD_CONFIGS[this.currentMood].filterCutoff, this.ctx.currentTime);
    this.mainFilter.Q.setValueAtTime(1.2, this.ctx.currentTime);

    // Space / Delay Reverb Simulation
    this.delayNode = this.ctx.createDelay();
    this.delayNode.delayTime.setValueAtTime(0.38, this.ctx.currentTime);
    this.delayFeedbackGain = this.ctx.createGain();
    this.delayFeedbackGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
    this.delayWetGain = this.ctx.createGain();
    this.delayWetGain.gain.setValueAtTime(this.reverbLevel * 0.6, this.ctx.currentTime);

    // Wire Delay feedback loop
    this.delayNode.connect(this.delayFeedbackGain);
    this.delayFeedbackGain.connect(this.delayNode);
    this.delayNode.connect(this.delayWetGain);

    // Master Routing: Filter -> MasterGain -> Analyser -> Destination
    this.mainFilter.connect(this.masterGain);
    this.delayWetGain.connect(this.masterGain);
    this.masterGain.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);

    // Setup Vinyl Crackle Loop
    this.setupVinylLoop();
    } catch {
      this.ctx = null;
    }
  }

  // Create procedural analog vinyl crackle buffer
  private setupVinylLoop() {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 4; // 4 second loop
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      // Gentle brown/pink noise floor
      const noise = (Math.random() * 2 - 1) * 0.04;
      // Random sporadic vinyl pops and crackles
      const isPop = Math.random() < 0.0007;
      const pop = isPop ? (Math.random() * 2 - 1) * 0.45 : 0;
      output[i] = noise + pop;
    }

    this.vinylGain = this.ctx.createGain();
    this.vinylGain.gain.setValueAtTime(this.vinylLevel * 0.25, this.ctx.currentTime);

    // Highpass filter for vinyl to eliminate muddy rumble
    const vinylFilter = this.ctx.createBiquadFilter();
    vinylFilter.type = 'highpass';
    vinylFilter.frequency.setValueAtTime(800, this.ctx.currentTime);

    this.vinylSource = this.ctx.createBufferSource();
    this.vinylSource.buffer = noiseBuffer;
    this.vinylSource.loop = true;
    this.vinylSource.connect(vinylFilter);
    vinylFilter.connect(this.vinylGain);
    this.vinylGain.connect(this.analyser!);
  }

  // Play a single procedural warm Rhodes/electric chord
  private playChord(freqs: number[], duration: number) {
    if (!this.ctx || !this.mainFilter || !this.delayNode) return;
    const now = this.ctx.currentTime;

    freqs.forEach((freq, idx) => {
      if (!this.ctx) return;
      // Primary mellow sine/triangle oscillator
      const osc = this.ctx.createOscillator();
      osc.type = this.currentMood === 'cyberpunk' ? 'sawtooth' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      // Subtle vibrato/tape wow & flutter LFO
      const vibrato = this.ctx.createOscillator();
      const vibratoGain = this.ctx.createGain();
      vibrato.frequency.setValueAtTime(4.2 + (idx * 0.2), now);
      vibratoGain.gain.setValueAtTime(1.8, now); // slight detune
      vibrato.connect(osc.frequency);
      vibrato.start(now);
      vibrato.stop(now + duration);

      // Note Gain Envelope (Soft attack, warm sustain, gentle release)
      const noteGain = this.ctx.createGain();
      const noteVolume = 0.08 / Math.sqrt(freqs.length);
      noteGain.gain.setValueAtTime(0.001, now);
      noteGain.gain.exponentialRampToValueAtTime(noteVolume, now + 0.12);
      noteGain.gain.exponentialRampToValueAtTime(noteVolume * 0.7, now + duration * 0.6);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(noteGain);
      noteGain.connect(this.mainFilter!);
      noteGain.connect(this.delayNode!);

      osc.start(now + idx * 0.015); // gentle strumming offset
      osc.stop(now + duration + 0.1);
    });

    // Gentle sub bass thump on chord transition
    if (this.currentMood !== 'elevator') {
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(freqs[0] * 0.5, now);
      subGain.gain.setValueAtTime(0.09, now);
      subGain.gain.exponentialRampToValueAtTime(0.0001, now + duration * 0.7);
      subOsc.connect(subGain);
      subGain.connect(this.masterGain!);
      subOsc.start(now);
      subOsc.stop(now + duration * 0.8);
    }
  }

  // Start the procedural playback scheduler
  public async play(): Promise<void> {
    this.initContext();
    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }

    if (this.isPlaying) return;
    this.isPlaying = true;

    // Start vinyl loop
    try {
      if (this.vinylSource) {
        this.vinylSource.start(0);
      }
    } catch {
      // Re-setup if previously stopped
      this.setupVinylLoop();
      this.vinylSource?.start(0);
    }

    // Step scheduler loop
    this.step();
    this.notify();
  }

  public pause(): void {
    this.isPlaying = false;
    if (this.loopTimer) {
      clearTimeout(this.loopTimer);
      this.loopTimer = null;
    }
    try {
      this.vinylSource?.stop();
    } catch {
      // Ignore if not started
    }
    this.notify();
  }

  public toggle(): void {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  private step = () => {
    if (!this.isPlaying || !this.ctx) return;

    const moodConfig = MOOD_CONFIGS[this.currentMood];
    const chords = moodConfig.chords;
    const currentChord = chords[this.currentChordIndex];

    // Beat duration in seconds based on BPM
    // Each chord lasts 4 beats (1 measure)
    const beatDuration = 60 / this.bpm;
    const chordDuration = beatDuration * 4;

    this.playChord(currentChord, chordDuration);

    this.currentChordIndex = (this.currentChordIndex + 1) % chords.length;

    // Schedule next measure
    this.loopTimer = window.setTimeout(this.step, chordDuration * 1000 - 40);
  };

  // State Getters & Setters
  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getMood(): LoFiMood {
    return this.currentMood;
  }

  public setMood(mood: LoFiMood): void {
    this.currentMood = mood;
    this.currentChordIndex = 0;
    this.bpm = MOOD_CONFIGS[mood].defaultBpm;
    if (this.mainFilter && this.ctx) {
      this.mainFilter.frequency.setTargetAtTime(MOOD_CONFIGS[mood].filterCutoff, this.ctx.currentTime, 0.2);
    }
    this.notify();
  }

  public getBpm(): number {
    return this.bpm;
  }

  public setBpm(newBpm: number): void {
    this.bpm = Math.max(45, Math.min(120, newBpm));
    this.notify();
  }

  public getVinylLevel(): number {
    return this.vinylLevel;
  }

  public setVinylLevel(level: number): void {
    this.vinylLevel = Math.max(0, Math.min(1, level));
    if (this.vinylGain && this.ctx) {
      this.vinylGain.gain.setTargetAtTime(this.vinylLevel * 0.25, this.ctx.currentTime, 0.05);
    }
    this.notify();
  }

  public getReverbLevel(): number {
    return this.reverbLevel;
  }

  public setReverbLevel(level: number): void {
    this.reverbLevel = Math.max(0, Math.min(1, level));
    if (this.delayWetGain && this.ctx) {
      this.delayWetGain.gain.setTargetAtTime(this.reverbLevel * 0.6, this.ctx.currentTime, 0.05);
    }
    this.notify();
  }

  public getMasterVolume(): number {
    return this.masterVolume;
  }

  public setMasterVolume(vol: number): void {
    this.masterVolume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.masterVolume, this.ctx.currentTime, 0.05);
    }
    this.notify();
  }

  // Get real-time audio frequency data for visualizers / Three.js
  public getFrequencyData(): Uint8Array {
    if (!this.analyser) {
      return new Uint8Array(32);
    }
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(data);
    return data;
  }

  // Subscribe to changes
  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach(fn => fn());
  }
}

export const lofiAudioEngine = new LoFiAudioEngine();
