import React, { useState } from 'react';
import { Type, RotateCcw, Sparkles } from 'lucide-react';
import { sound } from '../../constants/soundEffects';

interface KineticTypographyLabProps {
  language: 'en' | 'vi';
}

type MotionStyle = 'spring' | 'drift' | 'glitch' | 'wave';

export const KineticTypographyLab: React.FC<KineticTypographyLabProps> = ({ language }) => {
  const [text, setText] = useState<string>('HIGH-RETENTION CINEMATIC MOTION');
  const [activeStyle, setActiveStyle] = useState<MotionStyle>('spring');
  const [animKey, setAnimKey] = useState<number>(0);
  const [springTension, setSpringTension] = useState<number>(1.2);

  const handleReplay = () => {
    setAnimKey((prev) => prev + 1);
    sound.playBip(820, 0.05);
  };

  const words = text.split(' ').filter(Boolean);

  return (
    <div className="rounded-2xl bg-[#131B2E] border border-[#1E293B] p-5 sm:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#8B5CF6] mb-1">
            <Type className="w-3.5 h-3.5" />
            <span>
              {language === 'en'
                ? 'KINETIC MOTION TYPOGRAPHY LAB'
                : 'PHÒNG THÍ NGHIỆM CHUYỂN ĐỘNG CHỮ'}
            </span>
          </div>
          <h3 className="text-lg font-bold text-[#F8FAFC]">
            {language === 'en'
              ? 'Real-Time Kinetic Motion Engine'
              : 'Bộ Tạo Hiệu Ứng Chữ Động Trực Tiếp'}
          </h3>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            {language === 'en'
              ? 'Test spring-physics typography algorithms engineered for viral social retention and dynamic title cards.'
              : 'Thử nghiệm thuật toán vật lý lò xo được tối ưu hoá cho tỷ lệ giữ chân người xem video.'}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleReplay}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-medium transition-colors shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'Trigger Physics' : 'Chạy lại Hiệu ứng'}</span>
          </button>
        </div>
      </div>

      {/* Interactive Controls Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 rounded-xl bg-[#090D16] border border-[#1E293B]">
        {/* Style Presets */}
        <div className="space-y-1">
          <label className="text-[11px] font-mono text-[#94A3B8]">
            {language === 'en' ? 'MOTION PRESET' : 'KIỂU CHUYỂN ĐỘNG'}
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {(
              [
                { id: 'spring', label: 'Elastic Spring' },
                { id: 'drift', label: 'Kinetic Drift' },
                { id: 'glitch', label: 'Luma Glitch' },
                { id: 'wave', label: 'Cascade Wave' }
              ] as const
            ).map((style) => (
              <button
                key={style.id}
                onClick={() => {
                  setActiveStyle(style.id);
                  handleReplay();
                }}
                className={`px-2.5 py-1.5 text-xs rounded-lg font-medium transition-all text-center ${
                  activeStyle === style.id
                    ? 'bg-[#8B5CF6] text-white shadow-sm'
                    : 'bg-[#131B2E] text-[#94A3B8] hover:text-[#F8FAFC]'
                }`}
              >
                {style.label}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Text Input */}
        <div className="space-y-1">
          <label className="text-[11px] font-mono text-[#94A3B8]">
            {language === 'en' ? 'SAMPLE HEADLINE' : 'TIÊU ĐỀ THỬ NGHIỆM'}
          </label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full px-3 py-1.5 rounded-lg bg-[#131B2E] border border-[#1E293B] text-xs text-[#F8FAFC] focus:outline-none focus:border-[#8B5CF6]"
            placeholder="Enter custom text..."
          />
        </div>

        {/* Spring Tension Multiplier */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] font-mono text-[#94A3B8]">
            <span>{language === 'en' ? 'SPRING TENSION' : 'ĐỘ CĂNG LÒ XO'}</span>
            <span className="text-[#8B5CF6]">{springTension.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="2.0"
            step="0.1"
            value={springTension}
            onChange={(e) => setSpringTension(parseFloat(e.target.value))}
            className="w-full accent-[#8B5CF6] mt-2 cursor-pointer"
          />
        </div>
      </div>

      {/* Kinetic Typography Stage Viewport */}
      <div
        key={animKey}
        className="relative min-h-[160px] sm:min-h-[190px] rounded-xl bg-[#090D16] border border-[#1E293B] p-6 flex flex-col items-center justify-center overflow-hidden"
      >
        {/* Subtle stage grid backdrop */}
        <div className="absolute inset-0 bg-[radial-gradient(#1E293B_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

        {/* Dynamic Animated Kinetic Word Stack */}
        <div className="relative z-10 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-center max-w-3xl">
          {words.map((word, wIdx) => {
            const delaySec = (wIdx * 0.12) / springTension;

            if (activeStyle === 'spring') {
              return (
                <span
                  key={wIdx}
                  style={{
                    animation: `springPop ${0.65 / springTension}s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${delaySec}s both`
                  }}
                  className="text-2xl sm:text-3xl md:text-4xl font-black text-[#F8FAFC] tracking-tight inline-block hover:text-[#8B5CF6] transition-colors"
                >
                  {word}
                </span>
              );
            }

            if (activeStyle === 'drift') {
              return (
                <span
                  key={wIdx}
                  style={{
                    animation: `kineticDrift ${0.8 / springTension}s cubic-bezier(0.16, 1, 0.3, 1) ${delaySec}s both`
                  }}
                  className="text-2xl sm:text-3xl md:text-4xl font-black text-[#F8FAFC] tracking-tight inline-block"
                >
                  {word}
                </span>
              );
            }

            if (activeStyle === 'glitch') {
              return (
                <span
                  key={wIdx}
                  style={{
                    animation: `glitchShimmer ${0.5 / springTension}s ease-in-out ${delaySec}s both`
                  }}
                  className="text-2xl sm:text-3xl md:text-4xl font-black text-[#8B5CF6] tracking-tight inline-block"
                >
                  {word}
                </span>
              );
            }

            // 'wave'
            return (
              <span
                key={wIdx}
                style={{
                  animation: `cascadeWave ${0.9 / springTension}s ease-in-out ${delaySec}s both`
                }}
                className="text-2xl sm:text-3xl md:text-4xl font-black text-[#F8FAFC] tracking-tight inline-block"
              >
                {word}
              </span>
            );
          })}
        </div>

        {/* Viewport Meta Indicator */}
        <div className="absolute bottom-2.5 right-3 text-[10px] font-mono text-[#94A3B8] flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-[#8B5CF6]" />
          <span>Physics: CSS Spring Curve · 60fps</span>
        </div>
      </div>

      {/* Global CSS Keyframes for Spring & Drift */}
      <style>{`
        @keyframes springPop {
          0% {
            opacity: 0;
            transform: translateY(30px) scale(0.85);
          }
          70% {
            transform: translateY(-4px) scale(1.04);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes kineticDrift {
          0% {
            opacity: 0;
            transform: translateX(-24px) skewX(-12deg);
          }
          100% {
            opacity: 1;
            transform: translateX(0) skewX(0);
          }
        }
        @keyframes glitchShimmer {
          0% {
            opacity: 0;
            transform: translateX(4px);
            filter: blur(4px);
          }
          50% {
            transform: translateX(-3px);
            filter: blur(1px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
            filter: blur(0);
          }
        }
        @keyframes cascadeWave {
          0% {
            opacity: 0;
            transform: translateY(20px) rotate(-4deg);
          }
          100% {
            opacity: 1;
            transform: translateY(0) rotate(0deg);
          }
        }
      `}</style>
    </div>
  );
};
