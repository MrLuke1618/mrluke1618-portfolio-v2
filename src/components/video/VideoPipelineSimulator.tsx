import React, { useState, useEffect, useRef } from 'react';
import { PIPELINE_STEPS_DATA } from '../../constants/gameData';
import { sound } from '../../constants/soundEffects';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Terminal, 
  Video, 
  CheckCircle2, 
  FastForward, 
  Cpu,
  Palette
} from 'lucide-react';

interface VideoPipelineSimulatorProps {
  language: 'en' | 'vi';
  onOpenEasterEgg?: (snippetId: string) => void;
}

type ColorGradePreset = 'teal_orange' | 'cyber_neon' | 'moody_noir' | 'clean_neutral';

export const VideoPipelineSimulator: React.FC<VideoPipelineSimulatorProps> = ({
  language,
  onOpenEasterEgg
}) => {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [activeStepIdx, setActiveStepIdx] = useState<number>(0);
  const [currentTimeMs, setCurrentTimeMs] = useState<number>(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [colorGrade, setColorGrade] = useState<ColorGradePreset>('cyber_neon');
  const [enableFilmGrain, setEnableFilmGrain] = useState<boolean>(true);
  const [enableVignette, setEnableVignette] = useState<boolean>(true);
  const [logFeed, setLogFeed] = useState<string[]>([
    '[system] Video Pipeline Engine initialized.',
    '[config] Output Profile: 1080x1920 @ 60fps · Codec: H.264 High-Profile',
    '[ready] Press "Run Pipeline Simulation" to trigger programmatic video render.'
  ]);

  const totalDurationMs = 15000; // 15s simulated short
  const terminalLogRef = useRef<HTMLDivElement>(null);

  // Playhead loop
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const loop = (now: number) => {
      const delta = now - lastTime;
      lastTime = now;

      if (isRunning) {
        setCurrentTimeMs((prev) => {
          const next = prev + delta;
          if (next >= totalDurationMs) {
            setIsRunning(false);
            sound.playLevelUp();
            setLogFeed((l) => [
              ...l,
              '[export] Complete! Master 9:16 vertical video rendered in 15.00s.',
              '[metrics] Retention target: 82% · Peak audio LUFS: -14.1 · Size: 34.8 MB'
            ]);
            setCompletedSteps(PIPELINE_STEPS_DATA.map((s) => s.id));
            return totalDurationMs;
          }

          // Step advancement mapping
          const stepIndex = Math.min(
            PIPELINE_STEPS_DATA.length - 1,
            Math.floor((next / totalDurationMs) * PIPELINE_STEPS_DATA.length)
          );

          if (stepIndex !== activeStepIdx) {
            setActiveStepIdx(stepIndex);
            const currentStep = PIPELINE_STEPS_DATA[stepIndex];
            setCompletedSteps((prevCompleted) => {
              const prevStep = PIPELINE_STEPS_DATA[stepIndex - 1];
              if (prevStep && !prevCompleted.includes(prevStep.id)) {
                return [...prevCompleted, prevStep.id];
              }
              return prevCompleted;
            });

            setLogFeed((l) => [...l, currentStep.sampleLog]);
            sound.playBip(550 + stepIndex * 80, 0.04);
          }

          return next;
        });
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isRunning, activeStepIdx]);

  // Auto-scroll terminal log
  useEffect(() => {
    if (terminalLogRef.current) {
      terminalLogRef.current.scrollTop = terminalLogRef.current.scrollHeight;
    }
  }, [logFeed]);

  const handleToggleRun = () => {
    if (!isRunning && currentTimeMs >= totalDurationMs) {
      setCurrentTimeMs(0);
      setActiveStepIdx(0);
      setCompletedSteps([]);
      setLogFeed(['[restart] Resetting timeline playhead to 00:00...']);
    }
    setIsRunning(!isRunning);
    sound.playTerminalClick();
  };

  const handleReset = () => {
    setIsRunning(false);
    setCurrentTimeMs(0);
    setActiveStepIdx(0);
    setCompletedSteps([]);
    setLogFeed(['[reset] Timeline reset to 00:00:00']);
    sound.playBip(440, 0.05);
  };

  const handleStepClick = (idx: number) => {
    setActiveStepIdx(idx);
    const targetMs = (idx / PIPELINE_STEPS_DATA.length) * totalDurationMs;
    setCurrentTimeMs(targetMs);
    sound.playBip(600 + idx * 60, 0.04);
  };

  const progressPercent = Math.min(100, (currentTimeMs / totalDurationMs) * 100);
  const seconds = (currentTimeMs / 1000).toFixed(1);
  const timecode = `00:${String(Math.floor(currentTimeMs / 1000)).padStart(2, '0')}:${String(
    Math.floor((currentTimeMs % 1000) / 16.66)
  ).padStart(2, '0')}`;

  const getSceneLabel = () => {
    const s = Number(seconds);
    if (s < 2) return { en: 'Hook (Visual Anchor)', vi: 'Mở đầu (Giữ chân)' };
    if (s < 6) return { en: 'Problem Agitation', vi: 'Khơi gợi vấn đề' };
    if (s < 11) return { en: 'Automated Solution', vi: 'Giải pháp tự động' };
    return { en: 'Call to Action & Outro', vi: 'Kêu gọi hành động' };
  };

  // Color grade filter calculations
  const getColorGradeFilter = () => {
    switch (colorGrade) {
      case 'teal_orange':
        return 'contrast(1.18) saturate(1.25) hue-rotate(-14deg)';
      case 'cyber_neon':
        return 'contrast(1.12) saturate(1.4) hue-rotate(35deg)';
      case 'moody_noir':
        return 'grayscale(1) contrast(1.45) brightness(0.92)';
      case 'clean_neutral':
      default:
        return 'none';
    }
  };

  return (
    <div className="rounded-3xl bg-[#131B2E] border border-[#1E293B] p-5 sm:p-7 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E293B] pb-5">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#8B5CF6] mb-1">
            <Video className="w-3.5 h-3.5" />
            <span>INTERACTIVE POST-PRODUCTION SIMULATOR & TIMELINE</span>
          </div>
          <h3 className="text-xl font-bold text-[#F8FAFC]">
            {language === 'en'
              ? 'Multi-Track Video Post-Production & Automation Engine'
              : 'Trình Giả Lập Hậu Kỳ & Tự Động Hóa Dựng Phim Đa Luồng'}
          </h3>
          <p className="text-xs text-[#94A3B8] mt-1 max-w-xl">
            {language === 'en'
              ? 'Preview real-time audio sync, color grading LUTs, and programmatic frame rendering in a 9:16 vertical monitor.'
              : 'Mô phỏng đồng bộ âm thanh, bảng màu LUTs điện ảnh và ghép nối phân cảnh tự động trên màn hình dọc 9:16.'}
          </p>
        </div>

        {/* Master Play / Pause Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleToggleRun}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg ${
              isRunning
                ? 'bg-[#090D16] border border-[#8B5CF6] text-[#8B5CF6]'
                : 'bg-[#8B5CF6] hover:bg-[#7C3AED] text-white shadow-violet-500/25'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>{language === 'en' ? 'Pause Simulator' : 'Tạm Dừng'}</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{language === 'en' ? 'Run Pipeline Simulation' : 'Chạy Giả Lập Pipeline'}</span>
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            className="p-2.5 rounded-xl bg-[#090D16] border border-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#8B5CF6] transition-colors"
            title="Reset Simulation"
            aria-label="Reset Simulation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Color Grading LUT Switcher & FX Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-[#090D16] border border-[#1E293B] text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-[#8B5CF6]">
            <Palette className="w-4 h-4 shrink-0" />
            <span className="font-mono text-[11px] text-[#94A3B8]">COLOR GRADE LUT:</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'cyber_neon', label: 'Cyber Neon' },
              { id: 'teal_orange', label: 'Teal & Orange' },
              { id: 'moody_noir', label: 'Moody Noir' },
              { id: 'clean_neutral', label: 'Clean Rec.709' }
            ].map((lut) => (
              <button
                key={lut.id}
                onClick={() => {
                  setColorGrade(lut.id as ColorGradePreset);
                  sound.playBip(700, 0.04);
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all active:scale-95 ${
                  colorGrade === lut.id
                    ? 'bg-[#8B5CF6] text-white font-semibold'
                    : 'bg-[#131B2E] text-[#94A3B8] hover:text-[#F8FAFC]'
                }`}
              >
                {lut.label}
              </button>
            ))}
          </div>
        </div>

        {/* FX Toggles */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
          <button
            onClick={() => setEnableFilmGrain(!enableFilmGrain)}
            className={`px-2.5 py-1 rounded-lg border transition-colors active:scale-95 ${
              enableFilmGrain
                ? 'bg-[#8B5CF6]/20 border-[#8B5CF6] text-[#8B5CF6]'
                : 'bg-[#131B2E] border-[#1E293B] text-[#94A3B8]'
            }`}
          >
            35mm Grain: {enableFilmGrain ? 'ON' : 'OFF'}
          </button>
          <button
            onClick={() => setEnableVignette(!enableVignette)}
            className={`px-2.5 py-1 rounded-lg border transition-colors active:scale-95 ${
              enableVignette
                ? 'bg-[#8B5CF6]/20 border-[#8B5CF6] text-[#8B5CF6]'
                : 'bg-[#131B2E] border-[#1E293B] text-[#94A3B8]'
            }`}
          >
            Vignette: {enableVignette ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* Stepper Milestone Navigator */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {PIPELINE_STEPS_DATA.map((step, idx) => {
          const isDone = completedSteps.includes(step.id);
          const isCurrent = activeStepIdx === idx;

          return (
            <button
              key={step.id}
              onClick={() => handleStepClick(idx)}
              className={`p-3 rounded-xl border text-left transition-all group ${
                isCurrent
                  ? 'bg-[#1E293B] border-[#8B5CF6] shadow-lg shadow-[#8B5CF6]/10'
                  : isDone
                  ? 'bg-[#090D16] border-[#1E293B] text-[#94A3B8] hover:border-[#8B5CF6]/50'
                  : 'bg-[#090D16]/50 border-[#1E293B]/60 text-[#94A3B8]/60 hover:text-[#94A3B8]'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-[10px] font-mono font-bold ${isCurrent ? 'text-[#8B5CF6]' : 'text-[#94A3B8]'}`}>
                  STEP {step.stepNumber}
                </span>
                {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-[#8B5CF6]" />}
              </div>
              <div className={`text-xs font-semibold truncate ${isCurrent ? 'text-[#F8FAFC]' : 'text-[#94A3B8] group-hover:text-[#F8FAFC]'}`}>
                {language === 'en' ? step.titleEn : step.titleVi}
              </div>
              <div className="text-[10px] text-[#94A3B8] mt-0.5 truncate">
                {step.tool}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Simulation Layout: Timeline & Live 9:16 Monitor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column (7 cols): Multi-Track Timeline & Terminal Log */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-5">
          {/* Multi-Track Interactive Timeline Box */}
          <div className="rounded-2xl bg-[#090D16] border border-[#1E293B] p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between text-xs text-[#94A3B8] font-mono">
              <span className="text-[#8B5CF6] font-bold flex items-center gap-1.5">
                <FastForward className="w-3.5 h-3.5" />
                <span>MULTI-TRACK TIMELINE WITH AUDIO-SYNC BEAT MARKERS</span>
              </span>
              <span>1080x1920 · 60 FPS</span>
            </div>

            {/* Timeline Tracks */}
            <div className="space-y-3 relative pt-3">
              {/* Playhead Line */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-[#8B5CF6] shadow-[0_0_8px_#8B5CF6] z-20 pointer-events-none transition-all duration-75"
                style={{ left: `${progressPercent}%` }}
              >
                <div className="w-2.5 h-2.5 -ml-1 -top-1 absolute bg-[#8B5CF6] rounded-full" />
              </div>

              {/* Audio Beat Markers (2.5s, 5.0s, 7.5s, 10.0s, 12.5s) */}
              {[16.6, 33.3, 50.0, 66.6, 83.3].map((pos, pIdx) => (
                <div
                  key={pIdx}
                  className="absolute top-0 bottom-0 w-px border-l border-dashed border-[#8B5CF6]/30 z-10 pointer-events-none"
                  style={{ left: `${pos}%` }}
                >
                  <span className="text-[9px] font-mono text-[#8B5CF6]/60 -ml-2 -top-3 absolute">
                    BEAT
                  </span>
                </div>
              ))}

              {/* Track 1: Audio Narration & Waveform */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-[#94A3B8] font-mono">
                  <span>TRK 1: VOICE MASTER (48kHz)</span>
                  <span className="text-[#8B5CF6]">-14.1 LUFS</span>
                </div>
                <div className="h-8 rounded-lg bg-[#131B2E] border border-[#1E293B] p-1 flex items-center gap-0.5 overflow-hidden">
                  {Array.from({ length: 48 }).map((_, i) => {
                    const waveHeight = Math.sin(i * 0.45) * 12 + 14;
                    const isPlayed = (i / 48) * 100 <= progressPercent;
                    return (
                      <span
                        key={i}
                        className={`flex-1 rounded-sm transition-colors duration-100 ${
                          isPlayed ? 'bg-[#8B5CF6]' : 'bg-[#1E293B]'
                        }`}
                        style={{ height: `${waveHeight}px` }}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Track 2: Video Footage / Hyperframes B-Roll */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-[#94A3B8] font-mono">
                  <span>TRK 2: HYPERFRAMES CANVAS SEGMENTS</span>
                  <span>4 CLIPS</span>
                </div>
                <div className="h-7 rounded-lg bg-[#131B2E] border border-[#1E293B] p-1 flex gap-1">
                  {['CLIP 01: INTRO', 'CLIP 02: PROBLEM', 'CLIP 03: CODE', 'CLIP 04: OUTRO'].map(
                    (clip, cIdx) => (
                      <div
                        key={cIdx}
                        className={`flex-1 rounded text-[9px] font-mono flex items-center justify-center transition-colors truncate px-1 ${
                          activeStepIdx >= cIdx + 1
                            ? 'bg-[#8B5CF6]/30 text-[#F8FAFC] border border-[#8B5CF6]/50'
                            : 'bg-[#090D16] text-[#94A3B8] border border-[#1E293B]'
                        }`}
                      >
                        {clip}
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Track 3: Kinetic Typography Subtitles */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-[#94A3B8] font-mono">
                  <span>TRK 3: KINETIC SUBTITLE BURN-IN</span>
                  <span className="text-violet-300">AUTO-SYNCED</span>
                </div>
                <div className="h-7 rounded-lg bg-[#131B2E] border border-[#1E293B] p-1 flex gap-1">
                  {Array.from({ length: 6 }).map((_, wIdx) => {
                    const isPassed = (wIdx / 6) * 100 <= progressPercent;
                    return (
                      <div
                        key={wIdx}
                        className={`flex-1 rounded text-[9px] font-mono flex items-center justify-center transition-all ${
                          isPassed
                            ? 'bg-[#8B5CF6] text-white font-bold'
                            : 'bg-[#090D16] text-[#94A3B8] border border-[#1E293B]'
                        }`}
                      >
                        TEXT {wIdx + 1}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Automation Terminal Log Box */}
          <div className="rounded-2xl bg-[#090D16] border border-[#1E293B] p-4 flex flex-col justify-between space-y-2 flex-1 min-h-[140px]">
            <div className="flex items-center justify-between text-[11px] font-mono text-[#94A3B8] border-b border-[#1E293B] pb-2">
              <span className="flex items-center gap-2 text-[#8B5CF6]">
                <Terminal className="w-3.5 h-3.5" />
                <span>AUTOMATION TERMINAL LOG</span>
              </span>
              <span>PYTHON 3.12 · CLI RUNNER</span>
            </div>

            <div
              ref={terminalLogRef}
              className="h-28 overflow-y-auto space-y-1 font-mono text-[11px] text-[#94A3B8] pr-2 scrollbar-thin"
            >
              {logFeed.map((line, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-[#8B5CF6] select-none">{'>'}</span>
                  <span className={line.includes('[export]') ? 'text-violet-300 font-bold' : 'text-[#F8FAFC]'}>
                    {line}
                  </span>
                </div>
              ))}
            </div>

            {onOpenEasterEgg && (
              <div className="pt-2 border-t border-[#1E293B] flex items-center justify-between">
                <span className="text-[11px] text-[#94A3B8]">
                  {language === 'en' ? 'Want to inspect the real Python code?' : 'Xem mã nguồn Python thực tế?'}
                </span>
                <button
                  onClick={() => onOpenEasterEgg('python-hyperframes')}
                  className="text-[11px] font-mono text-[#8B5CF6] hover:underline flex items-center gap-1 font-semibold"
                >
                  <Cpu className="w-3 h-3" />
                  <span>hyperframes.py →</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (5 cols): Simulated 9:16 Vertical Video Monitor with Real-Time LUTs */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <div className="w-full max-w-[240px] sm:max-w-[260px] aspect-[9/16] rounded-3xl bg-[#090D16] border-2 border-[#1E293B] p-2.5 shadow-2xl relative flex flex-col justify-between overflow-hidden group">
            {/* Camera / Speaker Notch */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-3 bg-[#131B2E] rounded-full z-30" />

            {/* Video Canvas Simulation Screen with Active LUT Filter */}
            <div
              style={{ filter: getColorGradeFilter() }}
              className="relative w-full h-full rounded-2xl bg-gradient-to-b from-[#131B2E] via-[#090D16] to-[#131B2E] border border-[#1E293B] overflow-hidden flex flex-col justify-between p-4 z-10 transition-all duration-300"
            >
              {/* Dynamic Animated Motion Graphic Elements */}
              <div className="flex items-center justify-between text-[9px] font-mono text-[#8B5CF6] z-20">
                <span className="px-1.5 py-0.5 rounded bg-[#090D16]/80 border border-[#1E293B]">
                  9:16 LIVE · {colorGrade.toUpperCase()}
                </span>
                <span className="tabular-nums">{timecode}</span>
              </div>

              {/* Center Screen: Visual Frame Render Simulation */}
              <div className="space-y-3 text-center my-auto z-20">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/40 flex items-center justify-center text-[#8B5CF6] animate-pulse">
                  <Video className="w-6 h-6" />
                </div>

                <div className="space-y-1">
                  <div className="text-[10px] font-mono text-[#8B5CF6] tracking-wider uppercase">
                    {language === 'en' ? getSceneLabel().en : getSceneLabel().vi}
                  </div>
                  <div className="text-xs font-bold text-[#F8FAFC] leading-snug">
                    {Number(seconds) < 2
                      ? 'Automate Your Video Editing'
                      : Number(seconds) < 6
                      ? 'No More Repetitive Timeline Cuts'
                      : Number(seconds) < 11
                      ? 'Python + Hyperframes Stitcher'
                      : 'Hoang Cao Minh · Video Editor'}
                  </div>
                </div>

                {/* Simulated Audio Beats Pulsing in Frame */}
                <div className="flex items-center justify-center gap-1 h-4">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <span
                      key={i}
                      className={`w-1 rounded-full bg-[#8B5CF6] transition-all duration-150 ${
                        isRunning ? 'animate-pulse' : 'h-1'
                      }`}
                      style={{
                        height: isRunning ? `${Math.sin(currentTimeMs * 0.008 + i) * 8 + 10}px` : '4px'
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Lower Screen: Kinetic Subtitle Burn-In */}
              <div className="space-y-2 z-20">
                <div className="p-2 rounded-xl bg-[#090D16]/90 border border-[#1E293B] text-center">
                  <span className="text-[11px] font-extrabold text-[#F8FAFC] tracking-wide">
                    {Number(seconds) < 2
                      ? 'STOP EDITING BY HAND.'
                      : Number(seconds) < 6
                      ? 'GENERATE WITH CODE.'
                      : Number(seconds) < 11
                      ? '60 FPS PROGRAMMATIC RENDER'
                      : 'BUILD THE FUTURE OF MEDIA.'}
                  </span>
                </div>

                {/* Progress bar inside simulated video */}
                <div className="h-1 rounded-full bg-[#1E293B] overflow-hidden">
                  <div
                    className="h-full bg-[#8B5CF6] rounded-full transition-all duration-75"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Film Grain Simulation Overlay */}
              {enableFilmGrain && (
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:4px_4px] opacity-5 pointer-events-none" />
              )}

              {/* Lens Vignette Simulation Overlay */}
              {enableVignette && (
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.7)_100%)] pointer-events-none" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
