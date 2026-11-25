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
  const [logFeed, setLogFeed] = useState<string[]>([]);

  useEffect(() => {
    setLogFeed(
      language === 'en'
        ? [
            '[system] Video Pipeline Engine initialized.',
            '[config] Output Profile: 1080x1920 @ 60fps · Codec: H.264 High-Profile',
            '[ready] Press "Run Pipeline Simulation" to trigger programmatic video render.'
          ]
        : [
            '[hệ thống] Đã khởi tạo Trình dựng Video Tự động.',
            '[cấu hình] Định dạng: 1080x1920 @ 60fps · Bộ giải mã: H.264 High-Profile',
            '[sẵn sàng] Nhấn "Chạy Giả Lập Pipeline" để kích hoạt kết xuất video tự động.'
          ]
    );
  }, [language]);

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
    <div className="flex h-full min-h-0 flex-col gap-2.5 overflow-hidden rounded-2xl border border-[#1E293B] bg-[#131B2E] p-3.5">
      {/* Top Single-Row Control Bar */}
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-[#1E293B] pb-2">
        <div className="flex items-center gap-2">
          <Video className="h-4 w-4 text-[#8B5CF6]" />
          <h3 className="text-sm font-bold text-[#F8FAFC]">
            {language === 'en' ? 'Post-Production Simulator' : 'Trình Giả Lập Hậu Kỳ'}
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <Palette className="h-3.5 w-3.5 text-[#8B5CF6]" />
          {[
            { id: 'cyber_neon', label: 'Cyber Neon' },
            { id: 'teal_orange', label: 'Teal & Orange' },
            { id: 'moody_noir', label: 'Moody Noir' },
            { id: 'clean_neutral', label: 'Rec.709' },
          ].map((lut) => (
            <button
              key={lut.id}
              type="button"
              onClick={() => {
                setColorGrade(lut.id as ColorGradePreset);
                sound.playBip(700, 0.04);
              }}
              className={`rounded-lg px-2 py-1 font-mono text-[10px] transition ${
                colorGrade === lut.id ? 'bg-[#8B5CF6] font-bold text-white' : 'bg-[#090D16] text-[#94A3B8] hover:text-white'
              }`}
            >
              {lut.label}
            </button>
          ))}

          <button
            type="button"
            onClick={() => setEnableFilmGrain(!enableFilmGrain)}
            className={`rounded-lg border px-2 py-1 font-mono text-[10px] ${
              enableFilmGrain ? 'border-[#8B5CF6] bg-[#8B5CF6]/20 text-[#A78BFA]' : 'border-[#1E293B] bg-[#090D16] text-[#94A3B8]'
            }`}
          >
            Grain: {enableFilmGrain ? 'ON' : 'OFF'}
          </button>
          <button
            type="button"
            onClick={() => setEnableVignette(!enableVignette)}
            className={`rounded-lg border px-2 py-1 font-mono text-[10px] ${
              enableVignette ? 'border-[#8B5CF6] bg-[#8B5CF6]/20 text-[#A78BFA]' : 'border-[#1E293B] bg-[#090D16] text-[#94A3B8]'
            }`}
          >
            Vignette: {enableVignette ? 'ON' : 'OFF'}
          </button>

          <button
            type="button"
            onClick={handleToggleRun}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[11px] font-bold transition ${
              isRunning
                ? 'border border-[#8B5CF6] bg-[#090D16] text-[#8B5CF6]'
                : 'bg-[#8B5CF6] text-white hover:bg-[#7C3AED]'
            }`}
          >
            {isRunning ? <Pause className="h-3 w-3 fill-current" /> : <Play className="h-3 w-3 fill-current" />}
            <span>{isRunning ? (language === 'en' ? 'Pause' : 'Dừng') : (language === 'en' ? 'Run Simulation' : 'Chạy Giả Lập')}</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            aria-label="Reset Simulation"
            className="rounded-xl border border-[#1E293B] bg-[#090D16] p-1.5 text-[#94A3B8] hover:border-[#8B5CF6] hover:text-white"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Middle 5-Step Horizontal Strip */}
      <div className="grid shrink-0 grid-cols-5 gap-2">
        {PIPELINE_STEPS_DATA.map((step, idx) => {
          const isDone = completedSteps.includes(step.id);
          const isCurrent = activeStepIdx === idx;
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => handleStepClick(idx)}
              className={`rounded-xl border p-2 text-left transition ${
                isCurrent
                  ? 'border-[#8B5CF6] bg-[#1E293B]'
                  : 'border-[#1E293B] bg-[#090D16]/70 hover:border-[#8B5CF6]/50'
              }`}
            >
              <div className="flex items-center justify-between font-mono text-[9px]">
                <span className={isCurrent ? 'font-bold text-[#8B5CF6]' : 'text-[#94A3B8]'}>
                  STEP {step.stepNumber}
                </span>
                {isDone && <CheckCircle2 className="h-3 w-3 text-[#8B5CF6]" />}
              </div>
              <div className="mt-0.5 truncate text-[11px] font-semibold text-[#F8FAFC]">
                {language === 'en' ? step.titleEn : step.titleVi}
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom 12-Col Bento Split: Timeline + Terminal (8 cols) | 9:16 Vertical Monitor (4 cols) */}
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 overflow-hidden lg:grid-cols-12">
        <div className="flex min-h-0 flex-col justify-between gap-2 overflow-hidden lg:col-span-8">
          {/* Multi-Track Timeline */}
          <div className="shrink-0 space-y-2 rounded-xl border border-[#1E293B] bg-[#090D16] p-3">
            <div className="flex items-center justify-between font-mono text-[10px] text-[#94A3B8]">
              <span className="flex items-center gap-1.5 font-bold text-[#8B5CF6]">
                <FastForward className="h-3 w-3" />
                <span>{language === 'en' ? 'MULTI-TRACK BEAT TIMELINE' : 'DÒNG THỜI GIAN ĐA LUỒNG'}</span>
              </span>
              <span>1080x1920 · 60 FPS</span>
            </div>

            <div className="relative space-y-2 pt-2">
              <div
                className="pointer-events-none absolute bottom-0 top-0 z-20 w-0.5 bg-[#8B5CF6] shadow-[0_0_8px_#8B5CF6]"
                style={{ left: `${progressPercent}%` }}
              />

              <div className="flex h-7 items-center gap-0.5 overflow-hidden rounded-lg border border-[#1E293B] bg-[#131B2E] p-1">
                {Array.from({ length: 48 }).map((_, i) => {
                  const waveHeight = Math.sin(i * 0.45) * 8 + 11;
                  const isPlayed = (i / 48) * 100 <= progressPercent;
                  return (
                    <span
                      key={i}
                      className={`flex-1 rounded-sm ${isPlayed ? 'bg-[#8B5CF6]' : 'bg-[#1E293B]'}`}
                      style={{ height: `${waveHeight}px` }}
                    />
                  );
                })}
              </div>

              <div className="flex h-6 gap-1 rounded-lg border border-[#1E293B] bg-[#131B2E] p-1">
                {['CLIP 01: INTRO', 'CLIP 02: PROBLEM', 'CLIP 03: CODE', 'CLIP 04: OUTRO'].map((clip, cIdx) => (
                  <div
                    key={cIdx}
                    className={`flex flex-1 items-center justify-center truncate rounded px-1 font-mono text-[9px] ${
                      activeStepIdx >= cIdx + 1
                        ? 'border border-[#8B5CF6]/50 bg-[#8B5CF6]/30 text-white'
                        : 'border border-[#1E293B] bg-[#090D16] text-[#94A3B8]'
                    }`}
                  >
                    {clip}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Compact Terminal Log */}
          <div className="flex min-h-0 flex-1 flex-col justify-between overflow-hidden rounded-xl border border-[#1E293B] bg-[#090D16] p-3">
            <div className="flex shrink-0 items-center justify-between border-b border-[#1E293B] pb-1.5 font-mono text-[10px] text-[#94A3B8]">
              <span className="flex items-center gap-1.5 text-[#8B5CF6]">
                <Terminal className="h-3 w-3" />
                <span>{language === 'en' ? 'AUTOMATION LOG' : 'NHẬT KÝ LỆNH'}</span>
              </span>
              {onOpenEasterEgg && (
                <button
                  type="button"
                  onClick={() => onOpenEasterEgg('python-hyperframes')}
                  className="flex items-center gap-1 font-semibold text-[#8B5CF6] hover:underline"
                >
                  <Cpu className="h-3 w-3" />
                  <span>hyperframes.py →</span>
                </button>
              )}
            </div>

            <div ref={terminalLogRef} className="mt-1.5 min-h-0 flex-1 space-y-1 overflow-hidden font-mono text-[10px] text-[#94A3B8]">
              {logFeed.slice(-5).map((line, idx) => (
                <div key={idx} className="flex items-start gap-1.5 truncate">
                  <span className="select-none text-[#8B5CF6]">{'>'}</span>
                  <span className={line.includes('[export]') ? 'font-bold text-violet-300' : 'text-[#F8FAFC]'}>
                    {line}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): 9:16 Vertical Monitor Sized to Fit */}
        <div className="flex min-h-0 items-center justify-center overflow-hidden lg:col-span-4">
          <div className="relative flex aspect-[9/16] h-full max-h-full flex-col justify-between overflow-hidden rounded-2xl border-2 border-[#1E293B] bg-[#090D16] p-2 shadow-2xl">
            <div
              style={{ filter: getColorGradeFilter() }}
              className="relative z-10 flex h-full w-full flex-col justify-between overflow-hidden rounded-xl border border-[#1E293B] bg-gradient-to-b from-[#131B2E] via-[#090D16] to-[#131B2E] p-3"
            >
              <div className="z-20 flex items-center justify-between font-mono text-[9px] text-[#8B5CF6]">
                <span className="rounded border border-[#1E293B] bg-[#090D16]/80 px-1.5 py-0.5">
                  9:16 · {colorGrade.toUpperCase()}
                </span>
                <span className="tabular-nums">{timecode}</span>
              </div>

              <div className="z-20 my-auto space-y-2 text-center">
                <div className="mx-auto flex h-10 w-10 animate-pulse items-center justify-center rounded-xl border border-[#8B5CF6]/40 bg-[#8B5CF6]/10 text-[#8B5CF6]">
                  <Video className="h-5 w-5" />
                </div>
                <div className="font-mono text-[9px] uppercase tracking-wider text-[#8B5CF6]">
                  {language === 'en' ? getSceneLabel().en : getSceneLabel().vi}
                </div>
                <div className="text-xs font-bold leading-snug text-[#F8FAFC]">
                  {language === 'en'
                    ? Number(seconds) < 6
                      ? 'Automate Video Editing'
                      : 'Python + Hyperframes'
                    : Number(seconds) < 6
                      ? 'Tự động hóa Video'
                      : 'Python + Hyperframes'}
                </div>
              </div>

              <div className="z-20 space-y-1.5">
                <div className="rounded-lg border border-[#1E293B] bg-[#090D16]/90 p-1.5 text-center text-[10px] font-extrabold text-[#F8FAFC]">
                  {language === 'en' ? '60 FPS PROGRAMMATIC RENDER' : 'KẾT XUẤT LẬP TRÌNH 60 FPS'}
                </div>
                <div className="h-1 overflow-hidden rounded-full bg-[#1E293B]">
                  <div className="h-full rounded-full bg-[#8B5CF6]" style={{ width: `${progressPercent}%` }} />
                </div>
              </div>

              {enableFilmGrain && (
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] opacity-5 [background-size:4px_4px]" />
              )}
              {enableVignette && (
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.7)_100%)]" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
