import React, { useState } from 'react';
import { Type, RotateCcw, Sparkles, Copy, Check } from 'lucide-react';
import { sound } from '../../constants/soundEffects';

interface KineticTypographyLabProps {
  language: 'en' | 'vi';
}

export type MotionStyle =
  | 'mrbeast_pop'
  | 'trailer_slam'
  | 'luma_glitch'
  | 'neon_bounce'
  | 'lower_thirds'
  | 'tiktok_strobe'
  | 'minimal_docu'
  | 'cyber_drift'
  | 'cascade_wave'
  | 'elastic_rubber';

interface StyleConfig {
  id: MotionStyle;
  nameEn: string;
  nameVi: string;
  category: string;
  descriptionEn: string;
  descriptionVi: string;
  cssKeyframes: string;
}

const MOTION_PRESETS: StyleConfig[] = [
  {
    id: 'mrbeast_pop',
    nameEn: 'MrBeast-Style Pop',
    nameVi: 'MrBeast Pop Nảy Nhanh',
    category: 'High-Retention',
    descriptionEn: 'Punchy 1.35x scale overshoot engineered for rapid YouTube attention grabbers.',
    descriptionVi: 'Phóng đại nhanh 1.35x với lực nảy dứt khoát tăng tỷ lệ giữ chân người xem.',
    cssKeyframes: `@keyframes mrbeastPop {
  0% { transform: scale(0.3) rotate(-6deg); opacity: 0; }
  65% { transform: scale(1.35) rotate(2deg); opacity: 1; }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
}`
  },
  {
    id: 'trailer_slam',
    nameEn: 'Cinematic Trailer Slam',
    nameVi: 'Trailer Điện Ảnh Dập Mạnh',
    category: 'Cinematic',
    descriptionEn: 'Heavy impact slam down with atmospheric scale compression and screen shake.',
    descriptionVi: 'Cú đập chữ từ trên cao với độ nén tỷ lệ và dư chấn rung lắc điện ảnh.',
    cssKeyframes: `@keyframes trailerSlam {
  0% { transform: scale(3.2) translateY(-40px); opacity: 0; filter: blur(8px); }
  60% { transform: scale(0.96) translateY(2px); opacity: 1; filter: blur(0); }
  100% { transform: scale(1) translateY(0); opacity: 1; }
}`
  },
  {
    id: 'luma_glitch',
    nameEn: 'Luma Glitch',
    nameVi: 'Nhiễu Kênh Sáng Luma',
    category: 'Experimental',
    descriptionEn: 'High-frequency horizontal slice displacement with chromatic RGB fringing.',
    descriptionVi: 'Dịch chuyển quang sai ngang tần số cao với viền sắc màu RGB.',
    cssKeyframes: `@keyframes lumaGlitch {
  0% { transform: translateX(0); filter: drop-shadow(2px 0 0 #8B5CF6); }
  25% { transform: translateX(-5px) skewX(4deg); }
  50% { transform: translateX(6px) skewX(-3deg); filter: drop-shadow(-2px 0 0 #8B5CF6); }
  75% { transform: translateX(-2px); }
  100% { transform: translateX(0); filter: none; }
}`
  },
  {
    id: 'neon_bounce',
    nameEn: 'Neon Cyber Bounce',
    nameVi: 'Neon Điện Tử Phát Sáng',
    category: 'Cyberpunk',
    descriptionEn: 'Luminous violet luminescence bloom paired with responsive spring recoil.',
    descriptionVi: 'Phát sáng tím rực rỡ với độ nảy lò xo hồi đáp mềm mại.',
    cssKeyframes: `@keyframes neonBounce {
  0% { transform: translateY(28px) scale(0.7); opacity: 0; text-shadow: none; }
  60% { transform: translateY(-6px) scale(1.12); opacity: 1; text-shadow: 0 0 16px #8B5CF6; }
  100% { transform: translateY(0) scale(1); opacity: 1; text-shadow: 0 0 8px rgba(139,92,246,0.6); }
}`
  },
  {
    id: 'lower_thirds',
    nameEn: 'Smooth Lower Thirds',
    nameVi: 'Lower Thirds Truyền Hình',
    category: 'Broadcast',
    descriptionEn: 'Editorial broadcast slide-in with hairline accent bar and tight deceleration.',
    descriptionVi: 'Trượt ngang tiêu chuẩn truyền hình kèm thanh phân cách sắc nét.',
    cssKeyframes: `@keyframes lowerThirds {
  0% { transform: translateX(-60px); opacity: 0; clip-path: inset(0 100% 0 0); }
  100% { transform: translateX(0); opacity: 1; clip-path: inset(0 0 0 0); }
}`
  },
  {
    id: 'tiktok_strobe',
    nameEn: 'TikTok Fast Subtitle',
    nameVi: 'Phụ Đề Nhanh TikTok Shorts',
    category: 'Short-Form',
    descriptionEn: 'Single-word rapid succession strobe designed for 9:16 vertical storytelling.',
    descriptionVi: 'Hiển thị từng từ tốc độ cao tối ưu cho định dạng video dọc 9:16.',
    cssKeyframes: `@keyframes tiktokStrobe {
  0% { transform: scale(0.7) translateY(8px); opacity: 0; }
  50% { transform: scale(1.18) translateY(-2px); opacity: 1; }
  100% { transform: scale(1) translateY(0); opacity: 1; }
}`
  },
  {
    id: 'minimal_docu',
    nameEn: 'Minimalist Docu',
    nameVi: 'Tài Liệu Tối Giản',
    category: 'Editorial',
    descriptionEn: 'Gentle opacity bloom with progressive letter-spacing tracking expansion.',
    descriptionVi: 'Hiện mờ êm dịu kết hợp dãn khoảng cách ký tự chuẩn điện ảnh tài liệu.',
    cssKeyframes: `@keyframes minimalDocu {
  0% { opacity: 0; letter-spacing: -0.05em; transform: translateY(6px); }
  100% { opacity: 1; letter-spacing: 0.08em; transform: translateY(0); }
}`
  },
  {
    id: 'cyber_drift',
    nameEn: 'Cyber Kinetic Drift',
    nameVi: 'Trôi Vát Góc Không Gian',
    category: 'Cyberpunk',
    descriptionEn: 'Velocity-dampened 12-degree angular skew glide across horizontal plane.',
    descriptionVi: 'Trượt nghiêng vát góc 12 độ với lực hãm quán tính mượt mà.',
    cssKeyframes: `@keyframes cyberDrift {
  0% { transform: translateX(-36px) skewX(-14deg); opacity: 0; }
  100% { transform: translateX(0) skewX(0); opacity: 1; }
}`
  },
  {
    id: 'cascade_wave',
    nameEn: 'Cascade Wave',
    nameVi: 'Làn Sóng Chữ Nối Tiếp',
    category: 'Creative',
    descriptionEn: 'Sequential letter oscillation with harmonic vertical sinusoidal offset.',
    descriptionVi: 'Dao động nhịp nhàng từng chữ cái nối tiếp theo đồ thị hình sin.',
    cssKeyframes: `@keyframes cascadeWave {
  0% { transform: translateY(24px) rotate(-6deg); opacity: 0; }
  60% { transform: translateY(-4px) rotate(2deg); opacity: 1; }
  100% { transform: translateY(0) rotate(0deg); opacity: 1; }
}`
  },
  {
    id: 'elastic_rubber',
    nameEn: 'Elastic Rubber',
    nameVi: 'Cao Su Đàn Hồi Cực Đại',
    category: 'Dynamic',
    descriptionEn: 'High-inertia dual-recoil elastic simulation with squash and stretch.',
    descriptionVi: 'Hiệu ứng nén giãn biến dạng cao su đàn hồi với lực co giật kép.',
    cssKeyframes: `@keyframes elasticRubber {
  0% { transform: scale3d(1, 1, 1); opacity: 0; }
  30% { transform: scale3d(1.35, 0.75, 1); opacity: 1; }
  50% { transform: scale3d(0.85, 1.15, 1); }
  75% { transform: scale3d(1.08, 0.95, 1); }
  100% { transform: scale3d(1, 1, 1); opacity: 1; }
}`
  }
];

export const KineticTypographyLab: React.FC<KineticTypographyLabProps> = ({ language }) => {
  const [text, setText] = useState<string>('HIGH-RETENTION CINEMATIC MOTION');
  const [activeStyle, setActiveStyle] = useState<MotionStyle>('mrbeast_pop');
  const [animKey, setAnimKey] = useState<number>(0);
  const [springTension, setSpringTension] = useState<number>(1.2);
  const [copiedCss, setCopiedCss] = useState<boolean>(false);

  const selectedPreset = MOTION_PRESETS.find((p) => p.id === activeStyle) || MOTION_PRESETS[0];

  const handleReplay = () => {
    setAnimKey((prev) => prev + 1);
    sound.playBip(820, 0.05);
  };

  const handleCopyCss = async () => {
    try {
      await navigator.clipboard.writeText(selectedPreset.cssKeyframes);
      setCopiedCss(true);
      sound.playLevelUp();
      setTimeout(() => setCopiedCss(false), 2000);
    } catch {
      // Handled silently
    }
  };

  const words = text.split(' ').filter(Boolean);

  return (
    <div className="rounded-2xl bg-[#131B2E] border border-[#1E293B] p-5 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#8B5CF6] mb-1">
            <Type className="w-3.5 h-3.5" />
            <span>
              {language === 'en'
                ? 'KINETIC MOTION TYPOGRAPHY MASTER ENGINE (10 PRESETS)'
                : 'BỘ ĐIỀU KHIỂN CHUYỂN ĐỘNG CHỮ KINETIC (10 KIỂU MẪU)'}
            </span>
          </div>
          <h3 className="text-lg font-bold text-[#F8FAFC]">
            {language === 'en'
              ? 'Real-Time Physics & Keyframe Sandbox'
              : 'Phòng Thí Nghiệm Vật Lý & Khung Hình Chuyển Động'}
          </h3>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            {language === 'en'
              ? 'Explore 10 production-grade typography animation algorithms. Adjust tension, preview live, and copy CSS keyframes directly.'
              : 'Khám phá 10 thuật toán chuyển động chữ tiêu chuẩn truyền hình. Tùy chỉnh lực lò xo, xem thử trực tiếp và sao chép CSS.'}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCopyCss}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#090D16] border border-[#1E293B] hover:border-[#8B5CF6] text-xs font-mono text-[#F8FAFC] transition-colors active:scale-95"
          >
            {copiedCss ? <Check className="w-3.5 h-3.5 text-[#8B5CF6]" /> : <Copy className="w-3.5 h-3.5 text-[#8B5CF6]" />}
            <span>{copiedCss ? (language === 'en' ? 'Copied CSS!' : 'Đã sao chép!') : (language === 'en' ? 'Copy CSS Keyframes' : 'Sao chép CSS')}</span>
          </button>

          <button
            onClick={handleReplay}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-medium transition-colors shadow-sm shadow-violet-500/20 active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'Replay Physics' : 'Chạy lại'}</span>
          </button>
        </div>
      </div>

      {/* 10 Presets Selector Grid */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-[#94A3B8] font-mono">
          <span>{language === 'en' ? 'SELECT TYPOGRAPHY PRESET:' : 'CHỌN KIỂU CHUYỂN ĐỘNG:'}</span>
          <span className="text-[#8B5CF6]">{selectedPreset.category}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {MOTION_PRESETS.map((preset) => {
            const isSelected = activeStyle === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => {
                  setActiveStyle(preset.id);
                  handleReplay();
                }}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-[#090D16] border-[#8B5CF6] text-[#F8FAFC] shadow-sm shadow-violet-500/10'
                    : 'bg-[#090D16]/60 border-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#1E293B]/80'
                }`}
              >
                <div className="text-xs font-semibold truncate leading-tight">
                  {language === 'en' ? preset.nameEn : preset.nameVi}
                </div>
                <div className="text-[10px] text-[#8B5CF6] font-mono mt-0.5 truncate">
                  {preset.category}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Controls Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 rounded-xl bg-[#090D16] border border-[#1E293B]">
        {/* Custom Text Input */}
        <div className="md:col-span-2 space-y-1">
          <label className="text-[11px] font-mono text-[#94A3B8]">
            {language === 'en' ? 'EDIT TEST HEADLINE:' : 'NỘI DUNG THỬ NGHIỆM:'}
          </label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-[#131B2E] border border-[#1E293B] text-base sm:text-xs text-[#F8FAFC] focus:outline-none focus:border-[#8B5CF6]"
            placeholder="Type custom text..."
          />
        </div>

        {/* Spring Tension Multiplier */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] font-mono text-[#94A3B8]">
            <span>{language === 'en' ? 'SPEED & TENSION:' : 'TỐC ĐỘ & LỰC LÒ XO:'}</span>
            <span className="text-[#8B5CF6] font-semibold">{springTension.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="2.2"
            step="0.1"
            value={springTension}
            onChange={(e) => setSpringTension(parseFloat(e.target.value))}
            className="w-full accent-[#8B5CF6] mt-2 cursor-pointer h-3 sm:h-2 touch-none"
          />
        </div>
      </div>

      {/* Kinetic Typography Stage Viewport */}
      <div
        key={animKey}
        className="relative min-h-[170px] sm:min-h-[210px] rounded-xl bg-[#090D16] border border-[#1E293B] p-6 flex flex-col items-center justify-center overflow-hidden"
      >
        {/* Subtle stage grid backdrop */}
        <div className="absolute inset-0 bg-[radial-gradient(#1E293B_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

        {/* Dynamic Animated Kinetic Word Stack */}
        <div className="relative z-10 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-center max-w-3xl">
          {words.map((word, wIdx) => {
            const delaySec = (wIdx * 0.1) / springTension;
            const animDuration = 0.65 / springTension;

            return (
              <span
                key={wIdx}
                style={{
                  animation: `${getAnimationName(activeStyle)} ${animDuration}s cubic-bezier(0.16, 1, 0.3, 1) ${delaySec}s both`
                }}
                className={`text-2xl sm:text-3xl md:text-4xl font-black tracking-tight inline-block hover:text-[#8B5CF6] transition-colors ${
                  activeStyle === 'neon_bounce' ? 'text-[#F8FAFC]' : 'text-[#F8FAFC]'
                }`}
              >
                {word}
              </span>
            );
          })}
        </div>

        {/* Viewport Meta Indicator */}
        <div className="absolute bottom-2.5 right-3 text-[10px] font-mono text-[#94A3B8] flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-[#8B5CF6]" />
          <span>{selectedPreset.nameEn} · 60fps locked</span>
        </div>
      </div>

      {/* Global Embedded Keyframes for All 10 Presets */}
      <style>{`
        ${MOTION_PRESETS.map((p) => p.cssKeyframes).join('\n')}
      `}</style>
    </div>
  );
};

function getAnimationName(style: MotionStyle): string {
  switch (style) {
    case 'mrbeast_pop': return 'mrbeastPop';
    case 'trailer_slam': return 'trailerSlam';
    case 'luma_glitch': return 'lumaGlitch';
    case 'neon_bounce': return 'neonBounce';
    case 'lower_thirds': return 'lowerThirds';
    case 'tiktok_strobe': return 'tiktokStrobe';
    case 'minimal_docu': return 'minimalDocu';
    case 'cyber_drift': return 'cyberDrift';
    case 'cascade_wave': return 'cascadeWave';
    case 'elastic_rubber': return 'elasticRubber';
    default: return 'mrbeastPop';
  }
}
