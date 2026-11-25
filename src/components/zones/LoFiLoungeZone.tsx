import React, { useState, useEffect } from 'react';
import { lofiAudioEngine, MOOD_CONFIGS, LoFiMood } from '../../utils/lofiAudioEngine';
import { sound } from '../../constants/soundEffects';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Sliders, 
  Timer, 
  Headphones, 
  SkipForward, 
  Mail,
  Copy
} from 'lucide-react';
import { LiveDioramaCard } from '../common/LiveDioramaCard';

interface LoFiLoungeZoneProps {
  language: 'en' | 'vi';
}

export const LoFiLoungeZone: React.FC<LoFiLoungeZoneProps> = ({ language }) => {
  // Audio state
  const [isPlaying, setIsPlaying] = useState<boolean>(lofiAudioEngine.getIsPlaying());
  const [currentMood, setCurrentMood] = useState<LoFiMood>(lofiAudioEngine.getMood());
  const [bpm, setBpm] = useState<number>(lofiAudioEngine.getBpm());
  const [vinylLevel, setVinylLevel] = useState<number>(Math.round(lofiAudioEngine.getVinylLevel() * 100));
  const [reverbLevel, setReverbLevel] = useState<number>(Math.round(lofiAudioEngine.getReverbLevel() * 100));
  const [volume, setVolume] = useState<number>(Math.round(lofiAudioEngine.getMasterVolume() * 100));
  const [visualizerBars, setVisualizerBars] = useState<number[]>(new Array(16).fill(12));

  // Pomodoro state
  const [pomodoroMode, setPomodoroMode] = useState<'focus' | 'shortBreak' | 'longBreak'>('focus');
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [completedSessions, setCompletedSessions] = useState<number>(0);

  useEffect(() => {
    let mounted = true;
    const attemptAutoPlay = async () => {
      try {
        await lofiAudioEngine.play();
        if (mounted) {
          setIsPlaying(lofiAudioEngine.getIsPlaying());
        }
      } catch {
        // Handled silently
      }
    };
    attemptAutoPlay();

    const unsubscribe = lofiAudioEngine.subscribe(() => {
      if (mounted) {
        setIsPlaying(lofiAudioEngine.getIsPlaying());
        setCurrentMood(lofiAudioEngine.getMood());
        setBpm(lofiAudioEngine.getBpm());
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  // Visualizer loop reading real-time frequency analysis
  useEffect(() => {
    let animId: number;
    const updateVisualizer = () => {
      if (lofiAudioEngine.getIsPlaying()) {
        const freqData = lofiAudioEngine.getFrequencyData();
        const bars: number[] = [];
        const step = Math.floor(freqData.length / 16) || 1;
        for (let i = 0; i < 16; i++) {
          const val = freqData[i * step] || 0;
          bars.push(Math.max(10, Math.min(100, (val / 255) * 100)));
        }
        setVisualizerBars(bars);
      } else {
        setVisualizerBars(new Array(16).fill(12));
      }
      animId = requestAnimationFrame(updateVisualizer);
    };

    animId = requestAnimationFrame(updateVisualizer);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Pomodoro timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      sound.playLevelUp();
      setIsTimerRunning(false);
      setCompletedSessions(prev => prev + 1);
      if (pomodoroMode === 'focus') {
        setPomodoroMode('shortBreak');
        setTimeLeft(5 * 60);
      } else {
        setPomodoroMode('focus');
        setTimeLeft(25 * 60);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timeLeft, pomodoroMode]);

  const handleTogglePlay = async () => {
    if (isPlaying) {
      lofiAudioEngine.pause();
      setIsPlaying(false);
    } else {
      await lofiAudioEngine.play();
      setIsPlaying(true);
    }
    sound.playTerminalClick();
  };

  const handleSelectMood = (mood: LoFiMood) => {
    lofiAudioEngine.setMood(mood);
    setCurrentMood(mood);
    setBpm(MOOD_CONFIGS[mood].defaultBpm);
    if (!isPlaying) {
      lofiAudioEngine.play();
      setIsPlaying(true);
    }
    sound.playBip(740, 0.05);
  };

  const handleCycleMood = () => {
    const moods: LoFiMood[] = ['latenight', 'elevator', 'cyberpunk', 'binaural', 'chillhop'];
    const nextIdx = (moods.indexOf(currentMood) + 1) % moods.length;
    handleSelectMood(moods[nextIdx]);
  };

  const handleBpmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setBpm(val);
    lofiAudioEngine.setBpm(val);
  };

  const handleVinylChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVinylLevel(val);
    lofiAudioEngine.setVinylLevel(val / 100);
  };

  const handleReverbChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setReverbLevel(val);
    lofiAudioEngine.setReverbLevel(val / 100);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    lofiAudioEngine.setMasterVolume(val / 100);
  };

  const handleSetPomodoroPreset = (mode: 'focus' | 'shortBreak' | 'longBreak') => {
    setPomodoroMode(mode);
    setIsTimerRunning(false);
    if (mode === 'focus') setTimeLeft(25 * 60);
    else if (mode === 'shortBreak') setTimeLeft(5 * 60);
    else setTimeLeft(15 * 60);
    sound.playBip(620, 0.04);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const activeMoodConfig = MOOD_CONFIGS[currentMood];

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      {/* Compact Header */}
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-[#1E293B] pb-2">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/15 px-2.5 py-1 font-mono text-[10px] font-bold text-[#818CF8]">
            <Headphones className="h-3 w-3" />
            <span>{language === 'en' ? 'WEB AUDIO · COMMS HUB' : 'WEB AUDIO · LIÊN HỆ'}</span>
          </span>
          <h2 className="text-lg font-extrabold text-[#F8FAFC]">
            {language === 'en' ? 'Lo-Fi Lounge & Contact Hub' : 'Phòng Lo-Fi & Trạm Kết Nối'}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="mailto:hoangcaominh27@gmail.com"
            className="flex items-center gap-1.5 rounded-xl bg-[#8B5CF6] px-3 py-1.5 text-[11px] font-bold text-white transition hover:bg-[#7C3AED]"
          >
            <Mail className="h-3.5 w-3.5" />
            <span>hoangcaominh27@gmail.com</span>
          </a>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText('hoangcaominh27@gmail.com');
              sound.playLevelUp();
            }}
            className="flex items-center gap-1 rounded-xl border border-[#1E293B] bg-[#090D16] px-2.5 py-1.5 text-[11px] font-semibold text-[#F8FAFC] transition hover:border-[#8B5CF6]"
          >
            <Copy className="h-3.5 w-3.5 text-[#8B5CF6]" />
            <span>{language === 'en' ? 'Copy' : 'Sao chép'}</span>
          </button>
        </div>
      </div>

      {/* 16:9 2-Column Bento Split */}
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 lg:grid-cols-12">
        {/* Left: 3x2 Comms, Docs & Social Dioramas */}
        <div className="grid grid-cols-1 content-start gap-2.5 sm:grid-cols-2 lg:col-span-7 lg:grid-cols-3">
          {[
            { id: 'comms-doc', title: 'Work Portfolio (Docs)', sub: 'Official Dossier & Credits', url: 'https://docs.google.com/document/d/1ZO9BMG0B3p7g_aXBwxDnV92xEyVCbmjk_HJZeSpGKYk/edit?usp=sharing', badge: 'GOOGLE DOCS' },
            { id: 'comms-drive', title: 'Video Showcase (Drive)', sub: 'Master Showreel Archive', url: 'https://drive.google.com/file/d/1MKrJ9lNwt3Y0gzC2UYbodEIYDmIc0iVa/view?usp=drive_link', badge: 'GOOGLE DRIVE' },
            { id: 'comms-linkedin', title: 'LinkedIn Profile', sub: 'linkedin.com/in/hoangminhcao', url: 'https://www.linkedin.com/in/hoangminhcao', badge: 'LINKEDIN' },
            { id: 'comms-youtube', title: 'YouTube @luke1618gamer', sub: 'AI Video & Game Devlogs', url: 'https://www.youtube.com/@luke1618gamer', badge: 'YOUTUBE' },
            { id: 'comms-tiktok', title: 'TikTok @hoangcao2704', sub: 'Short-Form AI Visuals', url: 'https://www.tiktok.com/@hoangcao2704', badge: 'TIKTOK' },
            { id: 'comms-email', title: 'Direct Email (Hanoi)', sub: 'hoangcaominh27@gmail.com', url: 'mailto:hoangcaominh27@gmail.com?subject=Transmission', badge: 'EMAIL' },
          ].map((item, idx) => (
            <LiveDioramaCard
              key={item.title}
              indexLabel={String(idx + 1).padStart(2, '0')}
              title={item.title}
              subtitle={item.sub}
              sceneId={item.id}
              accent="#818CF8"
              badge={item.badge}
              liveUrl={item.url}
              heightClass="h-28"
              onClick={() => window.open(item.url, '_blank', 'noopener,noreferrer')}
            />
          ))}
        </div>

        {/* Right: Compact Web Audio Synth + Pomodoro Focus Timer */}
        <div className="flex min-h-0 flex-col justify-between gap-2.5 lg:col-span-5">
          {/* Compact Web Audio Lo-Fi Synth */}
          <div className="flex min-h-0 flex-1 flex-col justify-between rounded-2xl border border-[#1E293B] bg-[#131B2E] p-3.5">
            <div className="flex items-center justify-between gap-2">
              <div>
                <div className="font-mono text-[10px] font-bold text-[#818CF8]">
                  {isPlaying ? 'NOW SYNTHESIZING' : 'SYNTH READY'} · {bpm} BPM
                </div>
                <div className="text-sm font-bold text-[#F8FAFC]">
                  {language === 'en' ? activeMoodConfig.nameEn : activeMoodConfig.nameVi}
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleTogglePlay}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                    isPlaying
                      ? 'bg-[#8B5CF6] text-white'
                      : 'border border-[#1E293B] bg-[#090D16] text-[#F8FAFC] hover:border-[#8B5CF6]'
                  }`}
                >
                  {isPlaying ? <Pause className="h-3.5 w-3.5 fill-current" /> : <Play className="h-3.5 w-3.5 fill-current" />}
                  <span>{isPlaying ? 'Pause' : 'Play'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleCycleMood}
                  aria-label="Next mood"
                  className="rounded-xl border border-[#1E293B] bg-[#090D16] p-1.5 text-[#94A3B8] hover:border-[#8B5CF6] hover:text-white"
                >
                  <SkipForward className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="flex h-10 items-end justify-center gap-1 rounded-lg border border-[#1E293B] bg-[#090D16] px-3 py-1.5">
              {visualizerBars.map((height, i) => (
                <div
                  key={i}
                  className="w-2 rounded-t bg-[#8B5CF6] transition-all duration-75"
                  style={{ height: `${height}%`, opacity: 0.4 + height / 160 }}
                />
              ))}
            </div>

            <div className="grid grid-cols-5 gap-1">
              {(['latenight', 'elevator', 'cyberpunk', 'binaural', 'chillhop'] as LoFiMood[]).map((moodKey) => {
                const cfg = MOOD_CONFIGS[moodKey];
                const isSelected = currentMood === moodKey;
                return (
                  <button
                    key={moodKey}
                    type="button"
                    onClick={() => handleSelectMood(moodKey)}
                    className={`rounded-lg border px-1.5 py-1.5 text-center transition ${
                      isSelected
                        ? 'border-[#8B5CF6] bg-[#1E293B] text-[#F8FAFC]'
                        : 'border-[#1E293B] bg-[#090D16] text-[#94A3B8] hover:text-white'
                    }`}
                  >
                    <div className="truncate text-[10px] font-bold">
                      {language === 'en' ? cfg.nameEn.split(' ')[0] : cfg.nameVi.split(' ')[0]}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="rounded-xl border border-[#1E293B] bg-[#090D16] p-2">
                <div className="flex justify-between text-[#94A3B8]">
                  <span className="flex items-center gap-1"><Sliders className="h-3 w-3 text-[#8B5CF6]" />Vinyl</span>
                  <span className="font-mono text-[#F8FAFC]">{vinylLevel}%</span>
                </div>
                <input type="range" min="0" max="100" value={vinylLevel} onChange={handleVinylChange} className="mt-1 h-1.5 w-full cursor-pointer accent-[#8B5CF6]" />
              </div>
              <div className="rounded-xl border border-[#1E293B] bg-[#090D16] p-2">
                <div className="flex justify-between text-[#94A3B8]">
                  <span>Tempo</span>
                  <span className="font-mono text-[#F8FAFC]">{bpm} BPM</span>
                </div>
                <input type="range" min="50" max="110" value={bpm} onChange={handleBpmChange} className="mt-1 h-1.5 w-full cursor-pointer accent-[#8B5CF6]" />
              </div>
              <div className="rounded-xl border border-[#1E293B] bg-[#090D16] p-2">
                <div className="flex justify-between text-[#94A3B8]">
                  <span>Reverb</span>
                  <span className="font-mono text-[#F8FAFC]">{reverbLevel}%</span>
                </div>
                <input type="range" min="0" max="100" value={reverbLevel} onChange={handleReverbChange} className="mt-1 h-1.5 w-full cursor-pointer accent-[#8B5CF6]" />
              </div>
              <div className="rounded-xl border border-[#1E293B] bg-[#090D16] p-2">
                <div className="flex justify-between text-[#94A3B8]">
                  <span>Volume</span>
                  <span className="font-mono text-[#F8FAFC]">{volume}%</span>
                </div>
                <input type="range" min="0" max="100" value={volume} onChange={handleVolumeChange} className="mt-1 h-1.5 w-full cursor-pointer accent-[#8B5CF6]" />
              </div>
            </div>
          </div>

          {/* Compact Pomodoro Focus Timer */}
          <div className="shrink-0 rounded-2xl border border-[#1E293B] bg-[#131B2E] p-3.5">
            <div className="mb-2 flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1.5 font-semibold text-[#818CF8]">
                <Timer className="h-3.5 w-3.5" />
                {language === 'en' ? 'Pomodoro Focus' : 'Pomodoro Tập trung'}
              </span>
              <span className="font-mono text-[#94A3B8]">{completedSessions} {language === 'en' ? 'Done' : 'Xong'}</span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="font-mono text-3xl font-bold tracking-wider text-[#F8FAFC] tabular-nums">
                {formatTime(timeLeft)}
              </div>

              <div className="flex items-center gap-1">
                {(['focus', 'shortBreak', 'longBreak'] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => handleSetPomodoroPreset(m)}
                    className={`rounded-lg px-2 py-1 text-[10px] font-bold transition ${
                      pomodoroMode === m ? 'bg-[#8B5CF6] text-white' : 'bg-[#090D16] text-[#94A3B8] hover:text-white'
                    }`}
                  >
                    {m === 'focus' ? '25m' : m === 'shortBreak' ? '5m' : '15m'}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsTimerRunning(!isTimerRunning);
                    sound.playTerminalClick();
                    if (!isTimerRunning && !isPlaying) {
                      lofiAudioEngine.play();
                      setIsPlaying(true);
                    }
                  }}
                  className="rounded-xl bg-[#8B5CF6] px-3 py-1.5 text-xs font-bold text-white transition hover:bg-[#7C3AED]"
                >
                  {isTimerRunning ? 'Pause' : 'Start'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleSetPomodoroPreset(pomodoroMode);
                    sound.playBip(500, 0.04);
                  }}
                  aria-label="Reset timer"
                  className="rounded-xl border border-[#1E293B] bg-[#090D16] p-1.5 text-[#94A3B8] hover:text-white"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
