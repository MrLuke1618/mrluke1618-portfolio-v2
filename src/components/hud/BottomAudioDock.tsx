import React, { useState, useEffect } from 'react';
import { lofiAudioEngine, LoFiMood, MOOD_CONFIGS } from '../../utils/lofiAudioEngine';
import { sound } from '../../constants/soundEffects';
import { Play, Pause, Volume2, VolumeX, ChevronDown, ChevronUp, Timer } from 'lucide-react';

interface BottomAudioDockProps {
  language: 'en' | 'vi';
}

export const BottomAudioDock: React.FC<BottomAudioDockProps> = ({ language }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(lofiAudioEngine.getIsPlaying());
  const [currentMood, setCurrentMood] = useState<LoFiMood>(lofiAudioEngine.getMood());
  const [volume, setVolume] = useState<number>(lofiAudioEngine.getMasterVolume());
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [showPomodoro, setShowPomodoro] = useState<boolean>(false);

  // Pomodoro state: 25 minutes default
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

  // Pomodoro countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPomodoroRunning && pomodoroSeconds > 0) {
      interval = setInterval(() => {
        setPomodoroSeconds(prev => prev - 1);
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

  // Collapsed Minimalist Pill State
  if (isCollapsed) {
    return (
      <div className="fixed bottom-4 left-6 z-40">
        <button
          onClick={() => {
            setIsCollapsed(false);
            sound.playTerminalClick();
          }}
          className="flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-[#131B2E] border border-[#1E293B] hover:border-[#8B5CF6] text-[#F8FAFC] shadow-lg transition-all text-xs font-medium"
        >
          <div className="flex items-end gap-0.5 h-3">
            <span className={`w-0.5 bg-[#8B5CF6] rounded-full transition-all ${isPlaying ? 'h-3 animate-pulse' : 'h-1'}`} />
            <span className={`w-0.5 bg-[#8B5CF6] rounded-full transition-all ${isPlaying ? 'h-2 animate-bounce' : 'h-1'}`} />
            <span className={`w-0.5 bg-[#8B5CF6] rounded-full transition-all ${isPlaying ? 'h-3.5 animate-pulse' : 'h-1'}`} />
          </div>
          <span className="text-[11px] text-[#94A3B8]">
            {isPlaying ? (language === 'en' ? 'Playing Lo-Fi' : 'Đang phát Lo-Fi') : 'Lo-Fi Player'}
          </span>
          <ChevronUp className="w-3.5 h-3.5 text-[#94A3B8]" />
        </button>
      </div>
    );
  }

  return (
    <aside
      aria-label="Lo-Fi Audio Player"
      className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-xl z-40 bg-[#131B2E]/95 backdrop-blur-md border border-[#1E293B] rounded-2xl p-3 sm:px-4 sm:py-3 shadow-2xl transition-all"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left: Play Button & Track Info */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleTogglePlay}
            aria-label={isPlaying ? 'Pause music' : 'Play chill lo-fi music'}
            className="w-9 h-9 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white flex items-center justify-center transition-transform hover:scale-105 shadow-md shadow-[#8B5CF6]/30 shrink-0"
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#F8FAFC] tracking-tight">
                {language === 'en' ? activeMoodConfig.nameEn : activeMoodConfig.nameVi}
              </span>
              {/* Subtle animated equalizer bars */}
              {isPlaying && (
                <div className="flex items-end gap-0.5 h-3" aria-hidden="true">
                  <span className="w-0.5 h-2.5 bg-[#8B5CF6] rounded-full animate-pulse" />
                  <span className="w-0.5 h-3.5 bg-[#8B5CF6] rounded-full animate-bounce" />
                  <span className="w-0.5 h-2 bg-[#8B5CF6] rounded-full animate-pulse" />
                </div>
              )}
            </div>
            <div className="text-[11px] text-[#94A3B8] flex items-center gap-1.5">
              <span>Web Audio Synth</span>
              <span>·</span>
              <span>{activeMoodConfig.defaultBpm} BPM</span>
            </div>
          </div>
        </div>

        {/* Center / Right: Mood Chips & Controls */}
        <div className="flex items-center gap-2 text-xs">
          {/* Mood Selector Buttons */}
          <div className="hidden md:flex items-center gap-1 p-0.5 bg-[#090D16] border border-[#1E293B] rounded-lg">
            {(['latenight', 'elevator', 'cyberpunk'] as LoFiMood[]).map((m) => (
              <button
                key={m}
                onClick={() => handleSelectMood(m)}
                className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  currentMood === m
                    ? 'bg-[#1E293B] text-[#F8FAFC]'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                }`}
              >
                {m === 'latenight' ? 'Lo-Fi' : m === 'elevator' ? 'Elevator' : 'Ambient'}
              </button>
            ))}
          </div>

          {/* Pomodoro Focus Toggle */}
          <button
            onClick={() => setShowPomodoro(!showPomodoro)}
            className={`p-1.5 rounded-lg border text-[11px] transition-colors flex items-center gap-1 ${
              showPomodoro || isPomodoroRunning
                ? 'bg-[#1E293B] border-[#8B5CF6] text-[#F8FAFC]'
                : 'bg-[#090D16] border-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
            title="Pomodoro Focus Timer"
          >
            <Timer className="w-3.5 h-3.5" />
            {isPomodoroRunning && <span className="tabular-nums font-mono text-[10px]">{formatPomodoroTime(pomodoroSeconds)}</span>}
          </button>

          {/* Volume Slider */}
          <div className="hidden sm:flex items-center gap-1.5 pl-1">
            <button
              onClick={() => lofiAudioEngine.setMasterVolume(volume > 0 ? 0 : 0.6)}
              className="text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
              aria-label={volume === 0 ? 'Unmute' : 'Mute'}
            >
              {volume === 0 ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={handleVolumeChange}
              className="w-14 h-1 bg-[#1E293B] accent-[#8B5CF6] rounded cursor-pointer"
              aria-label="Volume slider"
            />
          </div>

          {/* Minimize / Collapse Button */}
          <button
            onClick={() => {
              setIsCollapsed(true);
              sound.playBip(650, 0.04);
            }}
            className="p-1 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E293B] transition-colors"
            title="Collapse Player"
            aria-label="Collapse Player"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Expanded Pomodoro Focus Bar (if toggled) */}
      {showPomodoro && (
        <div className="mt-2.5 pt-2 border-t border-[#1E293B] flex items-center justify-between text-xs font-mono text-[#94A3B8]">
          <div className="flex items-center gap-2">
            <span className="text-[#F8FAFC] font-semibold">Pomodoro Focus:</span>
            <span className="text-[#F8FAFC] text-sm tabular-nums">{formatPomodoroTime(pomodoroSeconds)}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPomodoroRunning(!isPomodoroRunning)}
              className="px-2.5 py-1 rounded bg-[#8B5CF6] text-white font-medium hover:bg-[#7C3AED] text-[11px] transition-colors"
            >
              {isPomodoroRunning ? 'Pause' : 'Start'}
            </button>
            <button
              onClick={() => {
                setIsPomodoroRunning(false);
                setPomodoroSeconds(25 * 60);
              }}
              className="px-2 py-1 rounded bg-[#090D16] border border-[#1E293B] hover:text-[#F8FAFC] text-[11px] transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};
