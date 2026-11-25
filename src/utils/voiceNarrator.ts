import { GameZoneId } from '../types/game';

export type VoiceClipId = 'intro' | GameZoneId;

export const CLIP_SCRIPTS: Record<VoiceClipId, { en: string; vi: string }> = {
  intro: {
    en: "Welcome to Hoang Cao Minh's 2.5D interactive portfolio.",
    vi: 'Chào mừng đến với thế giới danh mục 2.5D của Hoàng Cao Minh.',
  },
  vault: {
    en: 'YouTube Cinema and Video Vault: seventy-two thousand subscriber growth and Hyperframes pipelines.',
    vi: 'Rạp YouTube và Kho Video với thành tích bảy mươi hai nghìn người đăng ký.',
  },
  arcade: {
    en: 'AI Games Arena: Midnight Express, Football Fantastic FCs, and ten retro games.',
    vi: 'Đấu Trường Game AI với Midnight Express, Football Fantastic FCs và mười game retro.',
  },
  projects: {
    en: 'AI Projects Lab: sixteen upgraded 2026 GitHub AI apps with live demos.',
    vi: 'Phòng Lab Dự Án AI với mười sáu ứng dụng AI nâng cấp chuẩn 2026.',
  },
  academy: {
    en: "Career and Certificates Tower: DCU Master's Honours, IELTS 7.5, and TOEIC 960.",
    vi: 'Tháp Sự Nghiệp và Chứng Chỉ: Thạc sĩ DCU loại Giỏi, IELTS 7.5 và TOEIC 960.',
  },
  shipyard: {
    en: 'AntiGravity and Code Shipyard: autonomous agentic workflows and CLI emulators.',
    vi: 'Trạm AntiGravity và Code Shipyard với quy trình tự động hóa và CLI.',
  },
  lounge: {
    en: 'Lo-Fi Lounge and Contact Hub: live Web Audio synth, Pomodoro, and direct links.',
    vi: 'Phòng Lo-Fi và Trạm Kết Nối với bộ tổng hợp Web Audio và liên kết trực tiếp.',
  },
};

type Listener = () => void;

function computeWordWeights(words: string[]): number[] {
  const weights: number[] = [];
  let total = 0;
  for (const w of words) {
    const weight = Math.max(2, w.length) + (/[.,:;!?]$/.test(w) ? 3 : 0);
    total += weight;
    weights.push(total);
  }
  return weights;
}

class VoiceNarrator {
  private audio: HTMLAudioElement | null = null;
  private enabled = true;
  private speaking = false;
  private currentClip: string | null = null;
  private activeText: string | null = null;
  private activeWordIndex = -1;
  private rafId: number | null = null;
  private fallbackTimer: ReturnType<typeof setInterval> | null = null;
  private listeners = new Set<Listener>();

  private emit() {
    this.listeners.forEach((fn) => fn());
  }

  private clearTimers() {
    if (this.rafId !== null && typeof cancelAnimationFrame !== 'undefined') {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    if (this.fallbackTimer !== null) {
      clearInterval(this.fallbackTimer);
      this.fallbackTimer = null;
    }
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    if (!enabled) {
      this.stop();
    } else {
      this.emit();
    }
  }

  public isSpeaking(): boolean {
    return this.speaking;
  }

  public getCurrentClip(): string | null {
    return this.currentClip;
  }

  public getActiveText(): string | null {
    return this.activeText;
  }

  public getActiveWordIndex(): number {
    return this.activeWordIndex;
  }

  public stop(): void {
    this.clearTimers();
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.audio = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.speaking = false;
    this.currentClip = null;
    this.activeText = null;
    this.activeWordIndex = -1;
    this.emit();
  }

  private startAudioWordSync(audio: HTMLAudioElement, text: string) {
    this.clearTimers();
    const words = text.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) return;

    const cumWeights = computeWordWeights(words);
    const totalWeight = cumWeights[cumWeights.length - 1] || 1;
    const estimatedSeconds = Math.max(2.5, words.length * 0.36);

    const tick = () => {
      if (this.audio !== audio || audio.paused || audio.ended) return;
      const duration = Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : estimatedSeconds;
      const progress = Math.min(0.999, Math.max(0, audio.currentTime / duration));
      const targetWeight = progress * totalWeight;

      let nextIdx = cumWeights.findIndex((cw) => cw >= targetWeight);
      if (nextIdx < 0) nextIdx = words.length - 1;

      if (nextIdx !== this.activeWordIndex) {
        this.activeWordIndex = nextIdx;
        this.emit();
      }
      this.rafId = requestAnimationFrame(tick);
    };

    this.rafId = requestAnimationFrame(tick);
  }

  public async playClip(clipId: VoiceClipId, language: 'en' | 'vi'): Promise<void> {
    if (!this.enabled) return;
    this.stop();

    const text = CLIP_SCRIPTS[clipId][language];
    const url = `/audio/tts/${clipId}_${language}.mp3`;
    this.currentClip = `${clipId}_${language}`;
    this.activeText = text;
    this.activeWordIndex = 0;

    if (typeof Audio === 'undefined') {
      this.speakDynamic(text, language);
      return;
    }

    const audio = new Audio(url);
    audio.volume = 0.9;
    this.audio = audio;

    audio.onplay = () => {
      this.speaking = true;
      this.activeText = text;
      this.activeWordIndex = 0;
      this.emit();
      this.startAudioWordSync(audio, text);
    };
    audio.onended = () => {
      if (this.audio === audio) {
        this.clearTimers();
        this.speaking = false;
        this.currentClip = null;
        this.activeText = null;
        this.activeWordIndex = -1;
        this.audio = null;
        this.emit();
      }
    };
    audio.onpause = () => {
      if (this.audio === audio && !audio.ended) {
        this.clearTimers();
        this.speaking = false;
        this.emit();
      }
    };
    audio.onerror = () => {
      if (this.audio === audio) {
        this.audio = null;
        this.speakDynamic(text, language);
      }
    };

    try {
      await audio.play();
    } catch {
      if (this.audio === audio) {
        this.audio = null;
        this.speakDynamic(text, language);
      }
    }
  }

  public async playChatReply(text: string, language: 'en' | 'vi'): Promise<void> {
    const lower = text.toLowerCase();
    let clipKey: string | null = null;
    if (lower.includes('portfolio assistant') || lower.includes('trợ lý danh mục')) clipKey = 'chat_greeting';
    else if (lower.includes('midnight express') || lower.includes('football')) clipKey = 'chat_playground';
    else if (lower.includes('2.5d') || lower.includes('diorama') || lower.includes('mô hình canvas')) clipKey = 'chat_diorama';
    else if (lower.includes('16 upgraded') || lower.includes('16 ứng dụng') || lower.includes('storyboard')) clipKey = 'chat_creator';
    else if (lower.includes('hyperframes') || lower.includes('concat')) clipKey = 'chat_shorts';
    else if (lower.includes('ielts') || lower.includes('toeic') || lower.includes('dublin city')) clipKey = 'chat_certs';
    else if (lower.includes('hoangcaominh27@gmail.com')) clipKey = 'chat_contact';

    if (!clipKey || typeof Audio === 'undefined') {
      this.speakDynamic(text, language);
      return;
    }

    this.stop();
    const url = `/audio/tts/${clipKey}_${language}.mp3`;
    this.currentClip = `${clipKey}_${language}`;
    this.activeText = text;
    this.activeWordIndex = 0;

    const audio = new Audio(url);
    audio.volume = 0.92;
    this.audio = audio;

    audio.onplay = () => {
      this.speaking = true;
      this.emit();
      this.startAudioWordSync(audio, text);
    };
    audio.onended = () => {
      if (this.audio === audio) {
        this.clearTimers();
        this.speaking = false;
        this.currentClip = null;
        this.activeText = null;
        this.activeWordIndex = -1;
        this.audio = null;
        this.emit();
      }
    };
    audio.onerror = () => {
      if (this.audio === audio) {
        this.audio = null;
        this.speakDynamic(text, language);
      }
    };

    try {
      await audio.play();
    } catch {
      if (this.audio === audio) {
        this.audio = null;
        this.speakDynamic(text, language);
      }
    }
  }

  public speakDynamic(text: string, language: 'en' | 'vi'): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    this.stop();

    const words = text.trim().split(/\s+/).filter(Boolean);
    this.activeText = text;
    this.activeWordIndex = 0;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'vi' ? 'vi-VN' : 'en-US';
    utterance.rate = 1.02;

    const voices = window.speechSynthesis.getVoices();
    const preferredPatterns =
      language === 'vi'
        ? ['NamMinh', 'Natural', 'Google', 'vi-VN']
        : ['Brian', 'Andrew', 'Online (Natural)', 'Google US English', 'Aria', 'Natural'];

    const match = preferredPatterns
      .map((pat) => voices.find((v) => v.name.includes(pat) || v.lang.includes(pat)))
      .find(Boolean);

    if (match) utterance.voice = match;

    let boundaryFired = false;

    utterance.onstart = () => {
      this.speaking = true;
      this.currentClip = 'dynamic';
      this.activeText = text;
      this.activeWordIndex = 0;
      this.emit();

      setTimeout(() => {
        if (!boundaryFired && this.speaking && this.currentClip === 'dynamic') {
          this.fallbackTimer = setInterval(() => {
            if (!this.speaking) {
              this.clearTimers();
              return;
            }
            if (this.activeWordIndex < words.length - 1) {
              this.activeWordIndex += 1;
              this.emit();
            }
          }, 260);
        }
      }, 400);
    };

    utterance.onboundary = (e) => {
      if (e.name === 'word' || e.charIndex >= 0) {
        boundaryFired = true;
        if (this.fallbackTimer !== null) {
          clearInterval(this.fallbackTimer);
          this.fallbackTimer = null;
        }
        const prefix = text.slice(0, e.charIndex).trim();
        const idx = prefix ? prefix.split(/\s+/).length : 0;
        const clamped = Math.min(Math.max(0, idx), Math.max(0, words.length - 1));
        if (clamped !== this.activeWordIndex) {
          this.activeWordIndex = clamped;
          this.emit();
        }
      }
    };

    utterance.onend = () => {
      this.clearTimers();
      this.speaking = false;
      this.currentClip = null;
      this.activeText = null;
      this.activeWordIndex = -1;
      this.emit();
    };
    utterance.onerror = () => {
      this.clearTimers();
      this.speaking = false;
      this.currentClip = null;
      this.activeText = null;
      this.activeWordIndex = -1;
      this.emit();
    };

    window.speechSynthesis.speak(utterance);
  }
}

export const voiceNarrator = new VoiceNarrator();
