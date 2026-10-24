import React, { useState } from 'react';
import { PerformanceTier, GameZoneId } from '../../types/game';
import { GAME_ZONES } from '../../constants/gameData';
import { sound } from '../../constants/soundEffects';
import { Volume2, VolumeX, BookOpen, Gamepad2, Sparkles, Menu, X } from 'lucide-react';

interface TopNavBarProps {
  viewMode: 'reader' | 'game';
  onSetViewMode: (mode: 'reader' | 'game') => void;
  performanceTier: PerformanceTier;
  onSetTier: (tier: PerformanceTier) => void;
  language: 'en' | 'vi';
  onSetLanguage: (lang: 'en' | 'vi') => void;
  isMuted: boolean;
  onToggleMute: () => void;
  activeZone: GameZoneId;
  onSelectZone?: (zone: GameZoneId) => void;
  onOpenAIDrawer?: () => void;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({
  viewMode,
  onSetViewMode,
  language,
  onSetLanguage,
  isMuted,
  onToggleMute,
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
    zoneId?: GameZoneId;
  }[] = [
    { id: 'about', labelEn: 'About', labelVi: 'Giới thiệu' },
    { id: 'featured-works', labelEn: 'Featured Works', labelVi: 'Dự án nổi bật', zoneId: 'vault' },
    { id: 'experience', labelEn: 'Career & Milestones', labelVi: 'Sự nghiệp & Cột mốc', zoneId: 'academy' },
    { id: 'superpowers', labelEn: 'Technical Superpowers', labelVi: 'Năng lực cốt lõi', zoneId: 'arcade' },
    { id: 'contact', labelEn: 'Contact', labelVi: 'Liên hệ', zoneId: 'lounge' }
  ];

  const handleNavClick = (e: React.MouseEvent, item: typeof navItems[0]) => {
    e.preventDefault();
    sound.playBip(740, 0.04);
    setMobileMenuOpen(false);

    if (viewMode === 'game') {
      if (item.zoneId) {
        onSelectZone?.(item.zoneId);
        setTimeout(() => {
          const zoneEl = document.getElementById('active-zone-view');
          if (zoneEl) {
            zoneEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 80);
      } else {
        onSetViewMode('reader');
        setTimeout(() => {
          const el = document.getElementById('about');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 120);
      }
    } else {
      const el = document.getElementById(item.id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
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

          {viewMode === 'game' && (
            <span className="hidden xl:inline text-xs font-mono text-[#94A3B8] border-l border-[#1E293B] pl-3">
              {language === 'en' ? currentZoneConfig.titleEn : currentZoneConfig.titleVi}
            </span>
          )}
        </div>

        {/* Zone 2: Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-6 text-xs font-medium text-[#94A3B8]">
          {navItems.map((item) => {
            const isCurrent = viewMode === 'game' && item.zoneId === activeZone;

            return (
              <button
                key={item.id}
                onClick={(e) => handleNavClick(e, item)}
                className={`transition-colors whitespace-nowrap py-1 relative cursor-pointer ${
                  isCurrent
                    ? 'text-[#8B5CF6] font-semibold'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                }`}
              >
                <span>{language === 'en' ? item.labelEn : item.labelVi}</span>
                {isCurrent && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#8B5CF6] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Mode Switcher & Primary Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Reader vs 2.5D Game Mode Toggle */}
          <div className="flex items-center bg-[#131B2E] border border-[#1E293B] rounded-xl p-0.5 sm:p-1">
            <button
              onClick={() => {
                onSetViewMode('reader');
                sound.playBip(700, 0.04);
              }}
              className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-medium transition-all ${
                viewMode === 'reader'
                  ? 'bg-[#8B5CF6] text-white shadow-sm font-semibold'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              <BookOpen className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="whitespace-nowrap">{language === 'en' ? 'Reader' : 'Bài đọc'}</span>
            </button>

            <button
              onClick={() => {
                onSetViewMode('game');
                sound.playTeleport();
              }}
              className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-medium transition-all ${
                viewMode === 'game'
                  ? 'bg-[#8B5CF6] text-white shadow-sm font-semibold'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              <Gamepad2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="whitespace-nowrap">{language === 'en' ? '2.5D Game' : 'Chơi Game'}</span>
            </button>
          </div>

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
              const isCurrent = viewMode === 'game' && item.zoneId === activeZone;

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
                    {viewMode === 'game' ? 'GOTO STATION ›' : 'SECTION ›'}
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
