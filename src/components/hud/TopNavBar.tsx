import React, { useState, useEffect, useRef } from 'react';
import { PerformanceTier, GameZoneId } from '../../types/game';
import { GAME_ZONES } from '../../constants/gameData';
import { sound } from '../../constants/soundEffects';
import { Volume2, VolumeX, Sparkles, Menu, X, AudioLines } from 'lucide-react';

interface TopNavBarProps {
  performanceTier: PerformanceTier;
  onSetTier: (tier: PerformanceTier) => void;
  language: 'en' | 'vi';
  onSetLanguage: (lang: 'en' | 'vi') => void;
  isMuted: boolean;
  onToggleMute: () => void;
  isVoiceEnabled?: boolean;
  isVoiceSpeaking?: boolean;
  onToggleVoice?: () => void;
  activeZone: GameZoneId;
  onSelectZone?: (zone: GameZoneId, shouldOpen?: boolean) => void;
  onOpenAIDrawer?: () => void;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({
  language,
  onSetLanguage,
  isMuted,
  onToggleMute,
  isVoiceEnabled = true,
  isVoiceSpeaking = false,
  onToggleVoice,
  activeZone,
  onSelectZone,
  onOpenAIDrawer
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const currentZoneConfig = GAME_ZONES.find(z => z.id === activeZone) || GAME_ZONES[0];

  const navItems: {
    id: string;
    labelEn: string;
    labelVi: string;
    zoneId: GameZoneId;
  }[] = [
    { id: 'arcade', labelEn: 'AI Games', labelVi: 'Game AI', zoneId: 'arcade' },
    { id: 'projects', labelEn: 'AI Projects', labelVi: 'Dự án AI', zoneId: 'projects' },
    { id: 'vault', labelEn: 'YouTube Cinema', labelVi: 'Rạp YouTube', zoneId: 'vault' },
    { id: 'academy', labelEn: 'Career & Certs', labelVi: 'Sự nghiệp & Chứng chỉ', zoneId: 'academy' },
    { id: 'shipyard', labelEn: 'AI Workflows', labelVi: 'Quy Trình AI', zoneId: 'shipyard' },
    { id: 'lounge', labelEn: 'Lo-Fi & Contact', labelVi: 'Lo-Fi & Liên hệ', zoneId: 'lounge' }
  ];

  const [cycleIdx, setCycleIdx] = useState<number>(() => {
    const idx = navItems.findIndex((item) => item.zoneId === activeZone);
    return idx >= 0 ? idx : 0;
  });
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [isNavHovered, setIsNavHovered] = useState<boolean>(false);
  const [underlineStyle, setUnderlineStyle] = useState<{ left: number; width: number }>({ left: 0, width: 0 });
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const idx = navItems.findIndex((item) => item.zoneId === activeZone);
    if (idx >= 0) setCycleIdx(idx);
  }, [activeZone]);

  useEffect(() => {
    if (isNavHovered) return;
    const timer = setInterval(() => {
      setCycleIdx((prev) => (prev + 1) % navItems.length);
    }, 2600);
    return () => clearInterval(timer);
  }, [isNavHovered, navItems.length]);

  const displayIdx = hoveredIdx !== null ? hoveredIdx : cycleIdx;

  useEffect(() => {
    const updateUnderline = () => {
      const btn = buttonRefs.current[displayIdx];
      if (btn) {
        setUnderlineStyle({ left: btn.offsetLeft, width: btn.offsetWidth });
      }
    };
    updateUnderline();
    window.addEventListener('resize', updateUnderline);
    return () => window.removeEventListener('resize', updateUnderline);
  }, [displayIdx, language]);

  const handleNavClick = (e: React.MouseEvent, item: typeof navItems[0]) => {
    e.preventDefault();
    sound.playBip(740, 0.04);
    setMobileMenuOpen(false);
    onSelectZone?.(item.zoneId, true);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#090D16]/95 border-b border-[#1E293B] backdrop-blur-md px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-6">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-sm sm:text-base md:text-lg font-bold tracking-tight text-[#F8FAFC] hover:text-[#8B5CF6] transition-colors whitespace-nowrap font-mono"
          >
            {language === 'vi' ? 'CAO MINH HOÀNG' : 'HOANG CAO MINH'}
          </a>

          <span className="hidden xl:inline text-xs font-mono text-[#94A3B8] border-l border-[#1E293B] pl-3">
            {language === 'en' ? currentZoneConfig.titleEn : currentZoneConfig.titleVi}
          </span>
        </div>

        {/* Zone 2: Navigation Links (Desktop) with Sliding White Auto-Cycle Underline */}
        <nav
          onMouseEnter={() => setIsNavHovered(true)}
          onMouseLeave={() => {
            setIsNavHovered(false);
            setHoveredIdx(null);
          }}
          className="relative hidden lg:flex items-center gap-4 xl:gap-5 text-xs font-medium text-[#94A3B8]"
        >
          {navItems.map((item, idx) => {
            const isHighlighted = idx === displayIdx;

            return (
              <button
                key={item.id}
                ref={(el) => {
                  buttonRefs.current[idx] = el;
                }}
                onMouseEnter={() => setHoveredIdx(idx)}
                onClick={(e) => handleNavClick(e, item)}
                className={`relative whitespace-nowrap py-1.5 cursor-pointer transition-colors duration-300 ${
                  isHighlighted
                    ? 'text-white font-semibold'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                }`}
              >
                <span>{language === 'en' ? item.labelEn : item.labelVi}</span>
              </button>
            );
          })}

          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 h-[2px] rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.85)] transition-all duration-500 ease-out"
            style={{ left: underlineStyle.left, width: underlineStyle.width }}
          />
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">

          {/* Edge TTS Voice Guide Button */}
          {onToggleVoice && (
            <button
              type="button"
              onClick={onToggleVoice}
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 sm:py-1.5 rounded-xl border text-xs font-medium transition-colors ${
                isVoiceEnabled
                  ? 'bg-[#8B5CF6]/15 border-[#8B5CF6]/50 text-[#F8FAFC] hover:bg-[#8B5CF6]/25'
                  : 'bg-[#131B2E] border-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
              title={language === 'en' ? 'Edge TTS Neural Voice Guide' : 'Thuyết minh giọng nói Edge TTS'}
            >
              <AudioLines className={`w-3.5 h-3.5 ${isVoiceSpeaking ? 'text-[#34D399] animate-pulse' : isVoiceEnabled ? 'text-[#8B5CF6]' : 'text-[#94A3B8]'}`} />
              <span className="whitespace-nowrap">
                {language === 'en' ? (isVoiceSpeaking ? 'Speaking' : 'Voice') : (isVoiceSpeaking ? 'Đang đọc' : 'Giọng đọc')}
              </span>
            </button>
          )}

          {/* Ask AI Button (Desktop / Tablet) */}
          {onOpenAIDrawer && (
            <button
              onClick={onOpenAIDrawer}
              className="hidden sm:flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-[#131B2E] hover:bg-[#1E293B] border border-[#1E293B] hover:border-[#8B5CF6]/50 text-xs font-medium text-[#F8FAFC] transition-colors"
              title="Ask AI about Hoang"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6]" />
              <span className="whitespace-nowrap">{language === 'en' ? 'Ask AI' : 'Hỏi AI'}</span>
            </button>
          )}

          {/* Language Toggle */}
          <div className="flex items-center bg-[#131B2E] border border-[#1E293B] rounded-lg p-0.5 text-[10px] sm:text-[11px] font-mono">
            <button
              onClick={() => {
                onSetLanguage('en');
                sound.playBip(650, 0.04);
              }}
              className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded transition-colors ${
                language === 'en'
                  ? 'bg-[#8B5CF6] text-white font-semibold'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => {
                onSetLanguage('vi');
                sound.playBip(650, 0.04);
              }}
              className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded transition-colors ${
                language === 'vi'
                  ? 'bg-[#8B5CF6] text-white font-semibold'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              VI
            </button>
          </div>

          {/* Audio Mute */}
          <button
            onClick={onToggleMute}
            className="p-1.5 sm:p-2 rounded-xl bg-[#131B2E] border border-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC] transition-colors shrink-0"
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            aria-label={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          {/* Mobile Hamburger Menu Button (<lg screens) */}
          <button
            onClick={() => {
              setMobileMenuOpen(!mobileMenuOpen);
              sound.playTerminalClick();
            }}
            className="lg:hidden p-1.5 sm:p-2 rounded-xl bg-[#131B2E] border border-[#1E293B] text-[#F8FAFC] hover:border-[#8B5CF6] transition-colors"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {mobileMenuOpen ? <X className="w-4 h-4 text-[#8B5CF6]" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown (<lg screens) */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 pt-3 border-t border-[#1E293B] space-y-2 animate-fadeIn bg-[#090D16]/98 rounded-2xl p-4 border border-[#1E293B] shadow-2xl">
          <div className="text-[10px] font-mono text-[#94A3B8] uppercase tracking-wider mb-2">
            {language === 'en' ? 'NAVIGATION DIRECTIVES' : 'DANH MỤC ĐIỀU HƯỚNG'}
          </div>

          <div className="grid grid-cols-1 gap-1">
            {navItems.map((item) => {
              const isCurrent = item.zoneId === activeZone;

              return (
                <button
                  key={item.id}
                  onClick={(e) => handleNavClick(e, item)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs font-mono transition-colors ${
                    isCurrent
                      ? 'bg-[#8B5CF6] text-white font-bold'
                      : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#131B2E]'
                  }`}
                >
                  <span>{language === 'en' ? item.labelEn : item.labelVi}</span>
                  <span className="text-[10px] opacity-70">
                    {language === 'en' ? 'ENTER BUILDING ›' : 'VÀO TRẠM ›'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Mobile Ask AI Button */}
          {onOpenAIDrawer && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAIDrawer();
              }}
              className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#131B2E] border border-[#8B5CF6]/50 text-xs font-mono text-[#8B5CF6] font-bold"
            >
              <Sparkles className="w-4 h-4" />
              <span>{language === 'en' ? 'Ask AI About Hoang Cao Minh' : 'Hỏi AI Về Hoàng Cao Minh'}</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};
