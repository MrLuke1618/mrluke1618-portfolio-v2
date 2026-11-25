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

const getCategoryLabel = (category: string, lang: 'en' | 'vi'): string => {
  if (lang === 'en') return category;
  switch (category) {
    case 'High-Retention': return 'Giữ Chân Cao';
    case 'Cinematic': return 'Điện Ảnh';
    case 'Experimental': return 'Đột Phá';
    case 'Cyberpunk': return 'Cyberpunk';
    case 'Creative': return 'Sáng Tạo';
    case 'Dynamic': return 'Năng Động';
    case 'Minimalist': return 'Tối Giản';
    default: return category;
  }
};

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
    <div className="grid h-full min-h-0 grid-cols-1 gap-3 overflow-hidden rounded-2xl border border-[#1E293B] bg-[#131B2E] p-3.5 lg:grid-cols-12">
      {/* Left Column (5 cols): 2x5 Preset Grid + Headline + Tension */}
      <div className="flex min-h-0 flex-col justify-between gap-2.5 lg:col-span-5">
        <div>
          <div className="mb-1 flex items-center justify-between font-mono text-[10px] text-[#8B5CF6]">
            <span className="flex items-center gap-1.5">
              <Type className="h-3 w-3" />
              <span>{language === 'en' ? '10 KINETIC PRESETS' : '10 KIỂU CHỮ KINETIC'}</span>
            </span>
            <span>{getCategoryLabel(selectedPreset.category, language)}</span>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {MOTION_PRESETS.map((preset) => {
              const isSelected = activeStyle === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    setActiveStyle(preset.id);
                    handleReplay();
                  }}
                  className={`rounded-xl border p-2 text-left transition ${
                    isSelected
                      ? 'border-[#8B5CF6] bg-[#090D16] text-[#F8FAFC]'
                      : 'border-[#1E293B] bg-[#090D16]/60 text-[#94A3B8] hover:text-white'
                  }`}
                >
                  <div className="truncate text-[11px] font-semibold leading-tight">
                    {language === 'en' ? preset.nameEn : preset.nameVi}
                  </div>
                  <div className="mt-0.5 truncate font-mono text-[9px] text-[#8B5CF6]">
                    {getCategoryLabel(preset.category, language)}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-2 rounded-xl border border-[#1E293B] bg-[#090D16] p-2.5">
          <div>
            <label className="font-mono text-[10px] text-[#94A3B8]">
              {language === 'en' ? 'TEST HEADLINE:' : 'NỘI DUNG THỬ NGHIỆM:'}
            </label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#1E293B] bg-[#131B2E] px-2.5 py-1.5 text-xs text-[#F8FAFC] focus:border-[#8B5CF6] focus:outline-none"
              placeholder={language === 'en' ? 'Type custom text...' : 'Nhập văn bản...'}
            />
          </div>

          <div>
            <div className="flex justify-between font-mono text-[10px] text-[#94A3B8]">
              <span>{language === 'en' ? 'SPEED & TENSION:' : 'TỐC ĐỘ & LỰC LÒ XO:'}</span>
              <span className="font-semibold text-[#8B5CF6]">{springTension.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.2"
              step="0.1"
              value={springTension}
              onChange={(e) => setSpringTension(parseFloat(e.target.value))}
              className="mt-1 h-1.5 w-full cursor-pointer accent-[#8B5CF6]"
            />
          </div>
        </div>
      </div>

      {/* Right Column (7 cols): Controls Header + Full-Height Live Preview Stage */}
      <div className="flex min-h-0 flex-col gap-2.5 lg:col-span-7">
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-[#1E293B] pb-2">
          <div>
            <h3 className="text-sm font-bold text-[#F8FAFC]">
              {language === 'en' ? selectedPreset.nameEn : selectedPreset.nameVi}
            </h3>
            <p className="line-clamp-1 text-[11px] text-[#94A3B8]">
              {language === 'en' ? selectedPreset.descriptionEn : selectedPreset.descriptionVi}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyCss}
              className="flex items-center gap-1.5 rounded-lg border border-[#1E293B] bg-[#090D16] px-2.5 py-1.5 font-mono text-[11px] text-[#F8FAFC] transition hover:border-[#8B5CF6]"
            >
              {copiedCss ? <Check className="h-3.5 w-3.5 text-[#8B5CF6]" /> : <Copy className="h-3.5 w-3.5 text-[#8B5CF6]" />}
              <span>{copiedCss ? (language === 'en' ? 'Copied CSS!' : 'Đã chép!') : (language === 'en' ? 'Copy CSS' : 'Chép CSS')}</span>
            </button>

            <button
              type="button"
              onClick={handleReplay}
              className="flex items-center gap-1.5 rounded-lg bg-[#8B5CF6] px-2.5 py-1.5 text-[11px] font-bold text-white transition hover:bg-[#7C3AED]"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>{language === 'en' ? 'Replay Physics' : 'Chạy lại'}</span>
            </button>
          </div>
        </div>

        <div
          key={animKey}
          className="relative flex min-h-0 flex-1 flex-col items-center justify-center overflow-hidden rounded-xl border border-[#1E293B] bg-[#090D16] p-6"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#1E293B_1px,transparent_1px)] opacity-40 [background-size:16px_16px]" />

          <div className="relative z-10 flex max-w-3xl flex-wrap items-center justify-center gap-x-3 gap-y-2 text-center">
            {words.map((word, wIdx) => {
              const delaySec = (wIdx * 0.1) / springTension;
              const animDuration = 0.65 / springTension;

              return (
                <span
                  key={wIdx}
                  style={{
                    animation: `${getAnimationName(activeStyle)} ${animDuration}s cubic-bezier(0.16, 1, 0.3, 1) ${delaySec}s both`,
                  }}
                  className="inline-block text-2xl font-black tracking-tight text-[#F8FAFC] transition-colors hover:text-[#8B5CF6] sm:text-3xl md:text-4xl"
                >
                  {word}
                </span>
              );
            })}
          </div>

          <div className="absolute bottom-2.5 right-3 flex items-center gap-1.5 font-mono text-[10px] text-[#94A3B8]">
            <Sparkles className="h-3 w-3 text-[#8B5CF6]" />
            <span>{selectedPreset.nameEn} · 60fps locked</span>
          </div>
        </div>
      </div>

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
