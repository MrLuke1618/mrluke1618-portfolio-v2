import React, { useState, useEffect, useRef } from 'react';
import { PIPELINE_STEPS_DATA } from '../../constants/gameData';
import { sound } from '../../constants/soundEffects';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Terminal, 
  Layers, 
  Video, 
  CheckCircle2, 
  FastForward, 
  Clock, 
  Cpu 
} from 'lucide-react';

interface VideoPipelineSimulatorProps {
  language: 'en' | 'vi';
  onOpenEasterEgg?: (snippetId: string) => void;
}

export const VideoPipelineSimulator: React.FC<VideoPipelineSimulatorProps> = ({
  language,
  onOpenEasterEgg
}) => {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [activeStepIdx, setActiveStepIdx] = useState<number>(0);
  const [currentTimeMs, setCurrentTimeMs] = useState<number>(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
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

  const handleTogglePlay = () => {
    if (currentTimeMs >= totalDurationMs) {
      handleReset();
      setIsRunning(true);
    } else {
      setIsRunning(!isRunning);
    }
    sound.playTerminalClick();
  };

  const handleReset = () => {
    setIsRunning(false);
    setCurrentTimeMs(0);
    setActiveStepIdx(0);
    setCompletedSteps([]);
    setLogFeed([
      '[reset] Pipeline buffer flushed.',
      '[ready] Ready for fresh compilation sequence.'
    ]);
    sound.playBip(440, 0.05);
  };

  const handleStepClick = (index: number) => {
    setIsRunning(false);
    const targetMs = (index / PIPELINE_STEPS_DATA.length) * totalDurationMs + 100;
    setCurrentTimeMs(targetMs);
    setActiveStepIdx(index);
    setCompletedSteps(PIPELINE_STEPS_DATA.slice(0, index).map((s) => s.id));
    setLogFeed((l) => [...l, `[jump] Scrubbed playhead to Step ${index + 1}: ${PIPELINE_STEPS_DATA[index].titleEn}`]);
    sound.playBip(620, 0.04);
  };

  // Format time (00:04.12)
  const seconds = Math.floor(currentTimeMs / 1000);
  const hundredths = Math.floor((currentTimeMs % 1000) / 10);
  const timecode = `00:${seconds.toString().padStart(2, '0')}.${hundredths.toString().padStart(2, '0')}`;
  const progressPercent = Math.min(100, (currentTimeMs / totalDurationMs) * 100);

  // Dynamic preview scene title based on timestamp
  const getSceneLabel = () => {
    if (seconds < 2) return { en: 'Scene 1: 3-Second Viral Hook', vi: 'Cảnh 1: Hook Giữ Chân 3 Giây' };
    if (seconds < 6) return { en: 'Scene 2: Problem Stacking', vi: 'Cảnh 2: Đặt Vấn Đề Thực Tế' };
    if (seconds < 11) return { en: 'Scene 3: Programmatic Solution', vi: 'Cảnh 3: Giải Pháp Tự Động Hóa' };
    return { en: 'Scene 4: Retention CTA & Subscribe', vi: 'Cảnh 4: Kêu Gọi Hành Động' };
  };

  return (
    <div className="rounded-3xl border border-[#1E293B] bg-[#131B2E] p-6 sm:p-8 space-y-6 shadow-2xl">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E293B] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-[#8B5CF6] text-xs font-medium mb-1.5">
            <Layers className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'Interactive Video Pipeline Simulator' : 'Trình Giả Lập Pipeline Video Tương Tác'}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-[#F8FAFC] tracking-tight">
            {language === 'en' ? 'Automated Python & Hyperframes Stitcher' : 'Quy Trình Ghép Video Tự Động Hóa'}
          </h3>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
            {language === 'en'
              ? 'Simulate programmatic 60 FPS video generation from code outline to master YouTube Shorts export.'
              : 'Trực quan hóa luồng biên dịch video tự động 60 FPS từ mã kịch bản tới bản xuất YouTube Shorts hoàn chỉnh.'}
          </p>
        </div>

        {/* Global Controls & Status */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-[#090D16] border border-[#1E293B] text-xs font-mono text-[#F8FAFC] flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-[#8B5CF6]" />
            <span className="tabular-nums font-bold">{timecode}</span>
            <span className="text-[#94A3B8]">/ 00:15.00</span>
          </div>

          <button
            onClick={handleTogglePlay}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-md ${
              isRunning
                ? 'bg-[#1E293B] text-[#F8FAFC] hover:bg-[#2A374F]'
                : 'bg-[#8B5CF6] hover:bg-[#7C3AED] text-white shadow-[#8B5CF6]/30'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>{language === 'en' ? 'Pause Pipeline' : 'Tạm dừng'}</span>
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
            className="p-2 rounded-xl bg-[#090D16] border border-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#8B5CF6] transition-colors"
            title="Reset Simulation"
            aria-label="Reset Simulation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stepper Milestone Navigator */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
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
        {/* Left Column (8 cols): Multi-Track Timeline & Terminal Log */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-5">
          {/* Multi-Track Interactive Timeline Box */}
          <div className="rounded-2xl bg-[#090D16] border border-[#1E293B] p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between text-xs text-[#94A3B8] font-mono">
              <span className="text-[#8B5CF6] font-bold flex items-center gap-1.5">
                <FastForward className="w-3.5 h-3.5" />
                <span>MULTI-TRACK TIMELINE</span>
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

              {/* Track 2: Hyperframes Code-to-Video Scenes */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-[#94A3B8] font-mono">
                  <span>TRK 2: HYPERFRAMES SCENE STITCH</span>
                  <span>4 CLIPS</span>
                </div>
                <div className="h-9 rounded-lg bg-[#131B2E] border border-[#1E293B] p-1 grid grid-cols-12 gap-1 text-[10px] font-mono font-medium">
                  <div className="col-span-2 rounded bg-violet-950/80 border border-violet-800/60 flex items-center justify-center text-[#F8FAFC] truncate px-1">
                    01 HOOK
                  </div>
                  <div className="col-span-3 rounded bg-purple-950/80 border border-purple-800/60 flex items-center justify-center text-[#F8FAFC] truncate px-1">
                    02 PROBLEM
                  </div>
                  <div className="col-span-4 rounded bg-indigo-950/80 border border-indigo-800/60 flex items-center justify-center text-[#F8FAFC] truncate px-1">
                    03 CODE RENDER
                  </div>
                  <div className="col-span-3 rounded bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-[#F8FAFC] truncate px-1">
                    04 CTA
                  </div>
                </div>
              </div>

              {/* Track 3: Subtitles / Kinetic Typography Overlay */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-[#94A3B8] font-mono">
                  <span>TRK 3: KINETIC SUBTITLES</span>
                  <span className="text-[#8B5CF6]">SYNCED</span>
                </div>
                <div className="h-6 rounded-lg bg-[#131B2E] border border-[#1E293B] p-0.5 flex items-center gap-1 overflow-hidden px-2">
                  <span className="text-[10px] text-[#8B5CF6] font-mono truncate">
                    {seconds < 2
                      ? '"Stop manually cutting videos."'
                      : seconds < 6
                      ? '"Write Python scripts that stitch frames."'
                      : seconds < 11
                      ? '"Hyperframes compiles code directly into 60fps."'
                      : '"Subscribe for automated video pipelines."'}
                  </span>
                </div>
              </div>
            </div>

            {/* Timeline Progress Scrubber Bar */}
            <div
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const pct = Math.max(0, Math.min(1, clickX / rect.width));
                setCurrentTimeMs(pct * totalDurationMs);
                sound.playBip(650, 0.03);
              }}
              className="h-2 rounded-full bg-[#1E293B] cursor-pointer relative overflow-hidden group"
            >
              <div
                className="h-full bg-[#8B5CF6] transition-all duration-75 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Real-Time Terminal Execution Feed */}
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
                  <span className={line.includes('[export]') ? 'text-[#F59E0B] font-bold' : 'text-[#F8FAFC]'}>
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

        {/* Right Column (5 cols): Simulated 9:16 Vertical Video Monitor */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <div className="w-full max-w-[240px] sm:max-w-[260px] aspect-[9/16] rounded-3xl bg-[#090D16] border-2 border-[#1E293B] p-2.5 shadow-2xl relative flex flex-col justify-between overflow-hidden group">
            {/* Camera / Speaker Notch */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-3 bg-[#131B2E] rounded-full z-30" />

            {/* Video Canvas Simulation Screen */}
            <div className="relative w-full h-full rounded-2xl bg-gradient-to-b from-[#131B2E] via-[#090D16] to-[#131B2E] border border-[#1E293B] overflow-hidden flex flex-col justify-between p-4 z-10">
              {/* Dynamic Animated Motion Graphic Elements */}
              <div className="flex items-center justify-between text-[9px] font-mono text-[#8B5CF6] z-20">
                <span className="px-1.5 py-0.5 rounded bg-[#090D16]/80 border border-[#1E293B]">
                  9:16 LIVE
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
                    {seconds < 2
                      ? 'Automate Your Video Editing'
                      : seconds < 6
                      ? 'No More Repetitive Timeline Cuts'
                      : seconds < 11
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
                    {seconds < 2
                      ? 'STOP EDITING BY HAND.'
                      : seconds < 6
                      ? 'GENERATE WITH CODE.'
                      : seconds < 11
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

              {/* Ambient Grid overlay inside screen */}
              <div 
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, rgba(139, 92, 246, 0.2) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(139, 92, 246, 0.2) 1px, transparent 1px)
                  `,
                  backgroundSize: '16px 16px'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
