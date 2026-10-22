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
  Sparkles, 
  Disc, 
  Waves, 
  SkipForward, 
  Coffee,
  CheckCircle2,
  Mail,
  Copy
} from 'lucide-react';
import { KineticHeading } from '../common/KineticHeading';

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
    <div className="space-y-8 animate-fadeIn">
      {/* Zone Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-[#1E293B] bg-[#131B2E] p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[#8B5CF6] text-xs font-medium flex items-center gap-1.5">
                <Disc className="w-3.5 h-3.5" />
                <span>Web Audio Procedural Synthesis</span>
              </span>
            </div>
            <KineticHeading
              as="h1"
              text={language === 'en' ? 'The Lo-Fi Lounge & Contact Hub' : 'Phòng Lo-Fi & Trạm Kết Nối'}
              className="text-2xl sm:text-3xl font-bold text-[#F8FAFC] tracking-tight"
            />
            <p className="text-sm sm:text-base text-[#94A3B8] max-w-3xl leading-relaxed">
              {language === 'en'
                ? 'Synthesized in real-time inside your browser using the native Web Audio API. Explore warm Rhodes chords, analog vinyl crackle, and acoustic space reverb engineered for deep creative flow.'
                : 'Được tổng hợp âm thanh thời gian thực ngay trên trình duyệt qua Web Audio API. Khám phá hợp âm Rhodes ấm áp, tiếng đĩa than cổ điển và không gian vang giúp tối đa hóa khả năng tập trung.'}
            </p>
          </div>

          {/* Quick Play Action Button */}
          <button
            onClick={handleTogglePlay}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-xs transition-all shadow-md ${
              isPlaying
                ? 'bg-[#8B5CF6] text-white shadow-[#8B5CF6]/30'
                : 'bg-[#090D16] border border-[#1E293B] text-[#F8FAFC] hover:border-[#8B5CF6]'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>{language === 'en' ? 'Pause Lounge' : 'Tạm dừng'}</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>{language === 'en' ? 'Play Lounge' : 'Bật nhạc'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Left Column: Deck & Sliders (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-2xl border border-[#1E293B] bg-[#131B2E] p-6 shadow-xl">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#1E293B] text-xs">
              <div className="flex items-center gap-2 text-[#8B5CF6]">
                <Headphones className="w-4 h-4" />
                <span className="font-semibold">Synthesizer Deck · Hi-Fi Stereo</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#94A3B8] text-[11px]">
                <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-[#8B5CF6] animate-pulse' : 'bg-[#1E293B]'}`} />
                <span>{isPlaying ? 'Synthesizing Audio' : 'Standby'}</span>
              </div>
            </div>

            {/* Deck Shell */}
            <div className="rounded-xl border border-[#1E293B] bg-[#090D16] p-5 space-y-4">
              <div className="flex items-center justify-between text-xs text-[#94A3B8]">
                <span className="font-medium text-[#F8FAFC]">
                  {language === 'en' ? activeMoodConfig.nameEn : activeMoodConfig.nameVi}
                </span>
                <span>{bpm} BPM · {activeMoodConfig.filterCutoff}Hz Low-pass</span>
              </div>

              {/* Visualizer Meter */}
              <div className="h-20 rounded-lg bg-[#131B2E] border border-[#1E293B] flex items-end justify-center gap-1.5 px-4 py-2">
                {visualizerBars.map((height, i) => (
                  <div
                    key={i}
                    className="w-2.5 rounded-t transition-all duration-75 bg-[#8B5CF6]"
                    style={{ height: `${height}%`, opacity: 0.4 + (height / 160) }}
                  />
                ))}
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleTogglePlay}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-colors ${
                      isPlaying
                        ? 'bg-[#8B5CF6] text-white'
                        : 'bg-[#131B2E] border border-[#1E293B] text-[#F8FAFC] hover:border-[#8B5CF6]'
                    }`}
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                    <span>{isPlaying ? 'Pause' : 'Play'}</span>
                  </button>

                  <button
                    onClick={handleCycleMood}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#131B2E] border border-[#1E293B] hover:border-[#8B5CF6] text-[#94A3B8] hover:text-[#F8FAFC] text-xs transition-colors"
                  >
                    <SkipForward className="w-3.5 h-3.5" />
                    <span>Next Mood</span>
                  </button>
                </div>

                <div className="text-[11px] text-[#94A3B8] flex items-center gap-1.5">
                  <Waves className="w-3.5 h-3.5 text-[#8B5CF6]" />
                  <span>Real-time Synthesis</span>
                </div>
              </div>
            </div>

            {/* Mood Selector Buttons */}
            <div className="mt-6 space-y-2">
              <label className="text-xs text-[#94A3B8] block font-medium">
                {language === 'en' ? 'Select Ambient Mood:' : 'Chọn không gian âm thanh:'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
                {(['latenight', 'elevator', 'cyberpunk', 'binaural', 'chillhop'] as LoFiMood[]).map((moodKey) => {
                  const cfg = MOOD_CONFIGS[moodKey];
                  const isSelected = currentMood === moodKey;
                  return (
                    <button
                      key={moodKey}
                      onClick={() => handleSelectMood(moodKey)}
                      className={`text-left p-3 rounded-xl border transition-all ${
                        isSelected
                          ? 'bg-[#1E293B] border-[#8B5CF6] text-[#F8FAFC] shadow-sm shadow-[#8B5CF6]/20'
                          : 'bg-[#090D16] border-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#1E293B]/80'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-semibold mb-1">
                        <span className="truncate">{language === 'en' ? cfg.nameEn.split(' ')[0] : cfg.nameVi.split(' ')[0]}</span>
                        <span className="text-[10px] text-[#8B5CF6] font-mono shrink-0">{cfg.defaultBpm} BPM</span>
                      </div>
                      <div className="text-[11px] text-[#94A3B8] line-clamp-1">
                        {language === 'en' ? cfg.nameEn : cfg.nameVi}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live Remix Sliders */}
            <div className="mt-6 pt-5 border-t border-[#1E293B] space-y-4">
              <div className="flex items-center gap-2 text-xs text-[#F8FAFC] font-semibold">
                <Sliders className="w-4 h-4 text-[#8B5CF6]" />
                <span>{language === 'en' ? 'Audio Synthesis Effects' : 'Bộ điều chỉnh hiệu ứng'}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Vinyl Crackle */}
                <div className="space-y-1.5 bg-[#090D16] p-3 rounded-xl border border-[#1E293B]">
                  <div className="flex items-center justify-between text-[#94A3B8]">
                    <span>{language === 'en' ? 'Vinyl Crackle' : 'Tiếng đĩa than'}</span>
                    <span className="text-[#F8FAFC] font-mono">{vinylLevel}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={vinylLevel}
                    onChange={handleVinylChange}
                    className="w-full accent-[#8B5CF6] cursor-pointer h-1.5 bg-[#1E293B] rounded-lg"
                  />
                </div>

                {/* BPM / Tempo */}
                <div className="space-y-1.5 bg-[#090D16] p-3 rounded-xl border border-[#1E293B]">
                  <div className="flex items-center justify-between text-[#94A3B8]">
                    <span>{language === 'en' ? 'Tempo / BPM' : 'Tốc độ nhịp'}</span>
                    <span className="text-[#F8FAFC] font-mono">{bpm} BPM</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="110"
                    value={bpm}
                    onChange={handleBpmChange}
                    className="w-full accent-[#8B5CF6] cursor-pointer h-1.5 bg-[#1E293B] rounded-lg"
                  />
                </div>

                {/* Reverb */}
                <div className="space-y-1.5 bg-[#090D16] p-3 rounded-xl border border-[#1E293B]">
                  <div className="flex items-center justify-between text-[#94A3B8]">
                    <span>{language === 'en' ? 'Reverb / Space' : 'Độ vang không gian'}</span>
                    <span className="text-[#F8FAFC] font-mono">{reverbLevel}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={reverbLevel}
                    onChange={handleReverbChange}
                    className="w-full accent-[#8B5CF6] cursor-pointer h-1.5 bg-[#1E293B] rounded-lg"
                  />
                </div>

                {/* Master Volume */}
                <div className="space-y-1.5 bg-[#090D16] p-3 rounded-xl border border-[#1E293B]">
                  <div className="flex items-center justify-between text-[#94A3B8]">
                    <span>{language === 'en' ? 'Master Volume' : 'Âm lượng tổng'}</span>
                    <span className="text-[#F8FAFC] font-mono">{volume}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-full accent-[#8B5CF6] cursor-pointer h-1.5 bg-[#1E293B] rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Pomodoro & Philosophy (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl border border-[#1E293B] bg-[#131B2E] p-6 shadow-xl">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#1E293B] text-xs">
              <div className="flex items-center gap-2 text-[#8B5CF6] font-semibold">
                <Timer className="w-4 h-4" />
                <span>Pomodoro Focus Timer</span>
              </div>
              <div className="text-[11px] text-[#94A3B8] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#8B5CF6]" />
                <span>{completedSessions} Done</span>
              </div>
            </div>

            {/* Presets */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <button
                onClick={() => handleSetPomodoroPreset('focus')}
                className={`py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                  pomodoroMode === 'focus'
                    ? 'bg-[#8B5CF6] text-white shadow-sm'
                    : 'bg-[#090D16] text-[#94A3B8] hover:text-[#F8FAFC]'
                }`}
              >
                25m Focus
              </button>
              <button
                onClick={() => handleSetPomodoroPreset('shortBreak')}
                className={`py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                  pomodoroMode === 'shortBreak'
                    ? 'bg-[#8B5CF6] text-white shadow-sm'
                    : 'bg-[#090D16] text-[#94A3B8] hover:text-[#F8FAFC]'
                }`}
              >
                5m Short
              </button>
              <button
                onClick={() => handleSetPomodoroPreset('longBreak')}
                className={`py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                  pomodoroMode === 'longBreak'
                    ? 'bg-[#8B5CF6] text-white shadow-sm'
                    : 'bg-[#090D16] text-[#94A3B8] hover:text-[#F8FAFC]'
                }`}
              >
                15m Long
              </button>
            </div>

            {/* Countdown Face */}
            <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-[#090D16] border border-[#1E293B] my-2">
              <div className="text-4xl sm:text-5xl font-mono font-bold text-[#F8FAFC] tracking-wider tabular-nums">
                {formatTime(timeLeft)}
              </div>
              <div className="mt-2 text-xs text-[#94A3B8] flex items-center gap-1.5">
                <Coffee className="w-3.5 h-3.5 text-[#8B5CF6]" />
                <span>
                  {pomodoroMode === 'focus'
                    ? (language === 'en' ? 'Deep Work Session' : 'Phiên làm việc tập trung')
                    : (language === 'en' ? 'Rest & Refresh' : 'Nghỉ ngơi')}
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={() => {
                  setIsTimerRunning(!isTimerRunning);
                  sound.playTerminalClick();
                  if (!isTimerRunning && !isPlaying) {
                    lofiAudioEngine.play();
                    setIsPlaying(true);
                  }
                }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-2 ${
                  isTimerRunning
                    ? 'bg-[#1E293B] text-[#F8FAFC] border border-[#1E293B]'
                    : 'bg-[#8B5CF6] hover:bg-[#7C3AED] text-white shadow-md shadow-[#8B5CF6]/30'
                }`}
              >
                {isTimerRunning ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    <span>Pause Timer</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Start Session</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  handleSetPomodoroPreset(pomodoroMode);
                  sound.playBip(500, 0.04);
                }}
                className="p-2.5 rounded-xl bg-[#090D16] border border-[#1E293B] hover:border-[#8B5CF6] text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
                title="Reset Timer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Audio Philosophy Card */}
          <div className="rounded-2xl border border-[#1E293B] bg-[#131B2E] p-6 text-xs text-[#94A3B8] space-y-3">
            <div className="flex items-center gap-2 text-[#8B5CF6] font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>{language === 'en' ? 'Sound Design & Retention Pacing' : 'Thiết kế Âm thanh & Giữ chân'}</span>
            </div>
            <p className="leading-relaxed">
              {language === 'en'
                ? 'In video editing, sound accounts for more than 50% of audience retention. During my time scaling Lotus Media from 1k to 72k subscribers and producing 50+ commercial videos, matching rhythmic musical cadences with micro-cuts and dynamic filtering was fundamental to maximizing audience watch-time.'
                : 'Trong biên tập video, âm thanh quyết định hơn 50% khả năng giữ chân người xem. Trong quá trình phát triển Lotus Media từ 1k lên 72k người đăng ký và sản xuất 50+ video thương mại, việc đồng bộ nhịp điệu âm nhạc với nhát cắt cảnh là chìa khóa tối ưu tỷ lệ xem hết.'}
            </p>
          </div>

          {/* Direct Comms & Contact Card */}
          <div className="rounded-2xl border border-[#1E293B] bg-[#090D16] p-6 text-xs space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
              <span className="font-semibold text-[#F8FAFC] flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#8B5CF6]" />
                <span>{language === 'en' ? 'Direct Hanoi Transmission' : 'Kênh Liên Hệ Trực Tiếp'}</span>
              </span>
              <span className="text-[10px] font-mono text-[#8B5CF6]">UTC+7 · HANOI</span>
            </div>

            <p className="text-[#94A3B8] leading-relaxed">
              {language === 'en'
                ? 'Open for video editing direction, AI content pipelines, and creative media commissions. Reach out directly:'
                : 'Sẵn sàng hợp tác cho các dự án định hướng video, quy trình sản xuất AI và sản phẩm truyền thông:'}
            </p>

            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <a
                href="mailto:hoangcaominh27@gmail.com"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-medium text-xs transition-colors shadow-md shadow-[#8B5CF6]/20"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>hoangcaominh27@gmail.com</span>
              </a>

              <button
                onClick={() => {
                  navigator.clipboard.writeText('hoangcaominh27@gmail.com');
                  sound.playLevelUp();
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#131B2E] border border-[#1E293B] hover:border-[#8B5CF6] text-[#F8FAFC] font-medium text-xs transition-colors"
              >
                <Copy className="w-3.5 h-3.5 text-[#8B5CF6]" />
                <span>{language === 'en' ? 'Copy Address' : 'Sao chép'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
