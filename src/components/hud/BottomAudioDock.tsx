import React, { useState, useEffect } from 'react';
import { lofiAudioEngine, LoFiMood, MOOD_CONFIGS } from '../../utils/lofiAudioEngine';
import { sound } from '../../constants/soundEffects';
import { Play, Pause, Volume2, VolumeX, ChevronDown, ChevronUp, Timer, SkipForward } from 'lucide-react';

interface BottomAudioDockProps {
  language: 'en' | 'vi';
}

const QUICK_MOODS: Array<{ id: LoFiMood; labelEn: string; labelVi: string }> = [
  { id: 'latenight', labelEn: 'Lo-Fi', labelVi: 'Lo-Fi' },
  { id: 'elevator', labelEn: 'Elevator', labelVi: 'Thang máy' },
  { id: 'cyberpunk', labelEn: 'Cyber', labelVi: 'Cyber' },
];

export const BottomAudioDock: React.FC<BottomAudioDockProps> = ({ language }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(lofiAudioEngine.getIsPlaying());
  const [currentMood, setCurrentMood] = useState<LoFiMood>(lofiAudioEngine.getMood());
  const [volume, setVolume] = useState<number>(lofiAudioEngine.getMasterVolume());
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });
  const [showPomodoro, setShowPomodoro] = useState<boolean>(false);
  const [pomodoroSeconds, setPomodoroSeconds] = useState<number>(25 * 60);
  const [isPomodoroRunning, setIsPomodoroRunning] = useState<boolean>(false);

  useEffect(() => {
    const unsub = lofiAudioEngine.subscribe(() => {
      setIsPlaying(lofiAudioEngine.getIsPlaying());
      setCurrentMood(lofiAudioEngine.getMood());
      setVolume(lofiAudioEngine.getMasterVolume());
    });
    return unsub;
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isPomodoroRunning && pomodoroSeconds > 0) {
      interval = setInterval(() => {
        setPomodoroSeconds((prev) => prev - 1);
      }, 1000);
    } else if (pomodoroSeconds === 0) {
      setIsPomodoroRunning(false);
      sound.playLevelUp();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPomodoroRunning, pomodoroSeconds]);

  const handleTogglePlay = async () => {
    if (isPlaying) {
      lofiAudioEngine.pause();
    } else {
      await lofiAudioEngine.play();
    }
    sound.playTerminalClick();
  };

  const handleSelectMood = (mood: LoFiMood) => {
    lofiAudioEngine.setMood(mood);
    sound.playBip(720, 0.04);
  };

  const handleCycleMood = () => {
    const order: LoFiMood[] = ['latenight', 'elevator', 'cyberpunk', 'binaural', 'chillhop'];
    const next = order[(order.indexOf(currentMood) + 1) % order.length];
    handleSelectMood(next);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    lofiAudioEngine.setMasterVolume(val);
  };

  const formatPomodoroTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const activeMoodConfig = MOOD_CONFIGS[currentMood];

  if (isCollapsed) {
    return (
      <div className="fixed bottom-4 left-4 z-40">
        <button
          type="button"
          onClick={() => {
            setIsCollapsed(false);
            sound.playTerminalClick();
          }}
          className="flex items-center gap-2.5 rounded-full border border-[#1E293B] bg-[#0D1322]/95 px-3.5 py-2 text-xs font-semibold text-[#F8FAFC] shadow-2xl backdrop-blur-xl transition hover:border-[#8B5CF6]"
        >
          <span
            className={`h-3.5 w-3.5 rounded-full border-2 border-[#8B5CF6] bg-[#090D16] ${
              isPlaying ? 'animate-spin' : ''
            }`}
            style={{ animationDuration: '3s' }}
          />
          <span className="text-[11px] text-[#E2E8F0]">
            {isPlaying
              ? language === 'en'
                ? 'Late Night Lo-Fi'
                : 'Đang phát Lo-Fi'
              : language === 'en'
                ? 'Vinyl Synth'
                : 'Lo-Fi Synth'}
          </span>
          <ChevronUp className="h-3.5 w-3.5 text-[#94A3B8]" />
        </button>
      </div>
    );
  }

  return (
    <aside
      aria-label="Late-Night Coding Lo-Fi Vinyl Console"
      className="fixed bottom-4 left-4 z-40 w-[368px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-[#1E293B] bg-[#0D1322]/95 p-3 shadow-2xl backdrop-blur-xl"
    >
      {/* Top Row: Mini Spinning Vinyl + Track Info + Equalizer + Pomodoro + Collapse */}
      <div className="flex items-center justify-between gap-2.5">
        <div className="flex min-w-0 items-center gap-2.5">
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-[#8B5CF6]/50 bg-gradient-to-tr from-[#090D16] via-[#1E293B] to-[#090D16] shadow-inner ${
              isPlaying ? 'animate-spin' : ''
            }`}
            style={{ animationDuration: '4s' }}
          >
            <div className="h-2.5 w-2.5 rounded-full bg-[#8B5CF6]" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="truncate text-xs font-bold text-[#F8FAFC]">
                {language === 'en' ? activeMoodConfig.nameEn : activeMoodConfig.nameVi}
              </span>
              {isPlaying && (
                <div className="flex h-3 items-end gap-0.5" aria-hidden="true">
                  <span className="h-2.5 w-0.5 animate-pulse rounded-full bg-[#8B5CF6]" />
                  <span className="h-3.5 w-0.5 animate-bounce rounded-full bg-[#2DD4BF]" />
                  <span className="h-2 w-0.5 animate-pulse rounded-full bg-[#8B5CF6]" />
                  <span className="h-3 w-0.5 animate-bounce rounded-full bg-[#A78BFA]" />
                </div>
              )}
            </div>
            <div className="font-mono text-[10px] text-[#94A3B8]">
              VINYL SYNTH · {activeMoodConfig.defaultBpm} BPM
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => setShowPomodoro(!showPomodoro)}
            className={`rounded-lg border p-1.5 text-[10px] transition ${
              showPomodoro || isPomodoroRunning
                ? 'border-[#8B5CF6] bg-[#1E293B] text-[#F8FAFC]'
                : 'border-[#1E293B] bg-[#090D16] text-[#94A3B8] hover:text-white'
            }`}
            title={language === 'en' ? 'Pomodoro Timer' : 'Đồng hồ Pomodoro'}
          >
            <Timer className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => {
              setIsCollapsed(true);
              sound.playBip(650, 0.04);
            }}
            aria-label={language === 'en' ? 'Collapse Player' : 'Thu gọn trình phát'}
            className="rounded-lg p-1.5 text-[#94A3B8] transition hover:bg-[#1E293B] hover:text-white"
          >
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Bottom Row: Play/Pause + Mood Pills + Next Mood + Volume */}
      <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-[#1E293B] pt-2.5">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleTogglePlay}
            aria-label={isPlaying ? 'Pause music' : 'Play chill lo-fi music'}
            className="flex h-7 items-center gap-1 rounded-lg bg-[#8B5CF6] px-2.5 text-[11px] font-bold text-white shadow-md shadow-[#8B5CF6]/30 transition hover:bg-[#7C3AED]"
          >
            {isPlaying ? <Pause className="h-3 w-3 fill-current" /> : <Play className="h-3 w-3 fill-current" />}
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </button>

          <div className="flex items-center rounded-lg border border-[#1E293B] bg-[#090D16] p-0.5">
            {QUICK_MOODS.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => handleSelectMood(m.id)}
                className={`whitespace-nowrap rounded-md px-1.5 py-0.5 text-[10px] font-semibold transition ${
                  currentMood === m.id ? 'bg-[#1E293B] text-white' : 'text-[#94A3B8] hover:text-white'
                }`}
              >
                {language === 'en' ? m.labelEn : m.labelVi}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleCycleMood}
            aria-label="Next mood"
            className="rounded-lg border border-[#1E293B] bg-[#090D16] p-1 text-[#94A3B8] transition hover:border-[#8B5CF6] hover:text-white"
          >
            <SkipForward className="h-3 w-3" />
          </button>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={() => lofiAudioEngine.setMasterVolume(volume > 0 ? 0 : 0.6)}
            aria-label={volume === 0 ? 'Unmute' : 'Mute'}
            className="text-[#94A3B8] transition hover:text-white"
          >
            {volume === 0 ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={handleVolumeChange}
            aria-label="Volume slider"
            className="h-1.5 w-14 cursor-pointer rounded bg-[#1E293B] accent-[#8B5CF6]"
          />
        </div>
      </div>

      {/* Collapsible Pomodoro Focus Strip */}
      {showPomodoro && (
        <div className="mt-2.5 flex items-center justify-between border-t border-[#1E293B] pt-2 font-mono text-xs text-[#94A3B8]">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-[#F8FAFC]">Pomodoro</span>
            <span className="text-sm font-bold tabular-nums text-[#F8FAFC]">
              {formatPomodoroTime(pomodoroSeconds)}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsPomodoroRunning(!isPomodoroRunning)}
              className="rounded-md bg-[#8B5CF6] px-2 py-1 text-[10px] font-bold text-white hover:bg-[#7C3AED]"
            >
              {isPomodoroRunning ? (language === 'en' ? 'Pause' : 'Dừng') : language === 'en' ? 'Start' : 'Chạy'}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsPomodoroRunning(false);
                setPomodoroSeconds(25 * 60);
              }}
              className="rounded-md border border-[#1E293B] bg-[#090D16] px-2 py-1 text-[10px] hover:text-white"
            >
              {language === 'en' ? 'Reset' : 'Đặt lại'}
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};
