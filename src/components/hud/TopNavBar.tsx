import React from 'react';
import { PerformanceTier, GameZoneId } from '../../types/game';
import { GAME_ZONES } from '../../constants/gameData';
import { sound } from '../../constants/soundEffects';
import { Volume2, VolumeX, BookOpen, Gamepad2, Sparkles } from 'lucide-react';

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
  onOpenAIDrawer
}) => {
  const currentZoneConfig = GAME_ZONES.find(z => z.id === activeZone) || GAME_ZONES[0];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#090D16]/90 border-b border-[#1E293B] backdrop-blur-md px-4 sm:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Clean single-element) */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-base sm:text-lg font-bold tracking-tight text-[#F8FAFC] hover:text-[#8B5CF6] transition-colors whitespace-nowrap"
          >
            {language === 'vi' ? 'CAO MINH HOÀNG' : 'HOANG CAO MINH'}
          </a>

          {viewMode === 'game' && (
            <span className="hidden lg:inline text-xs font-mono text-[#94A3B8] border-l border-[#1E293B] pl-3">
              {language === 'en' ? currentZoneConfig.titleEn : currentZoneConfig.titleVi}
            </span>
          )}
        </div>

        {/* Zone 2: Navigation Links (Only in Reader Mode on desktop) */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-[#94A3B8]">
          <a href="#about" className="hover:text-[#F8FAFC] transition-colors whitespace-nowrap">
            {language === 'en' ? 'About' : 'Giới thiệu'}
          </a>
          <a href="#featured-works" className="hover:text-[#F8FAFC] transition-colors whitespace-nowrap">
            {language === 'en' ? 'Featured Works' : 'Dự án nổi bật'}
          </a>
          <a href="#experience" className="hover:text-[#F8FAFC] transition-colors whitespace-nowrap">
            {language === 'en' ? 'Career & Milestones' : 'Sự nghiệp & Cột mốc'}
          </a>
          <a href="#superpowers" className="hover:text-[#F8FAFC] transition-colors whitespace-nowrap">
            {language === 'en' ? 'Technical Superpowers' : 'Năng lực cốt lõi'}
          </a>
          <a href="#contact" className="hover:text-[#F8FAFC] transition-colors whitespace-nowrap">
            {language === 'en' ? 'Contact' : 'Liên hệ'}
          </a>
        </nav>

        {/* Zone 3: Mode Switcher & Primary Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Reader vs 2.5D Game Mode Toggle */}
          <div className="flex items-center bg-[#131B2E] border border-[#1E293B] rounded-xl p-1">
            <button
              onClick={() => {
                onSetViewMode('reader');
                sound.playBip(700, 0.04);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'reader'
                  ? 'bg-[#8B5CF6] text-white shadow-sm font-semibold'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="whitespace-nowrap">{language === 'en' ? 'Reader' : 'Bài đọc'}</span>
            </button>

            <button
              onClick={() => {
                onSetViewMode('game');
                sound.playTeleport();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'game'
                  ? 'bg-[#8B5CF6] text-white shadow-sm font-semibold'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              <Gamepad2 className="w-3.5 h-3.5" />
              <span className="whitespace-nowrap">{language === 'en' ? '2.5D Game' : 'Chơi Game'}</span>
            </button>
          </div>

          {/* Ask AI Button */}
          {onOpenAIDrawer && (
            <button
              onClick={onOpenAIDrawer}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#131B2E] hover:bg-[#1E293B] border border-[#1E293B] hover:border-[#8B5CF6]/50 text-xs font-medium text-[#F8FAFC] transition-colors"
              title="Ask AI about Hoang"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6]" />
              <span className="whitespace-nowrap">{language === 'en' ? 'Ask AI' : 'Hỏi AI'}</span>
            </button>
          )}

          {/* Language Toggle */}
          <div className="flex items-center bg-[#131B2E] border border-[#1E293B] rounded-lg p-0.5 text-[11px] font-mono">
            <button
              onClick={() => {
                onSetLanguage('en');
                sound.playBip(650, 0.04);
              }}
              className={`px-2 py-1 rounded transition-colors ${
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
              className={`px-2 py-1 rounded transition-colors ${
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
            className="p-2 rounded-xl bg-[#131B2E] border border-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            aria-label={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </header>
  );
};
