import React, { useEffect, useState } from 'react';
import { GameZoneId } from '../../types/game';
import { GAME_ZONES } from '../../constants/gameData';
import { sound } from '../../constants/soundEffects';
import {
  Video,
  Cpu,
  Gamepad2,
  GraduationCap,
  Radio,
  Compass,
  Headphones,
  Orbit,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
} from 'lucide-react';

interface FastTravelDockProps {
  activeZone: GameZoneId;
  onSelectZone: (zoneId: GameZoneId) => void;
  language: 'en' | 'vi';
}

export const FastTravelDock: React.FC<FastTravelDockProps> = ({
  activeZone,
  onSelectZone,
  language,
}) => {
  const [focusedIdx, setFocusedIdx] = useState<number>(() => {
    const idx = GAME_ZONES.findIndex((z) => z.id === activeZone);
    return idx >= 0 ? idx : 0;
  });

  useEffect(() => {
    const idx = GAME_ZONES.findIndex((z) => z.id === activeZone);
    if (idx >= 0) setFocusedIdx(idx);
  }, [activeZone]);

  // Numeric hotkeys 1-6 for instant zone travel
  useEffect(() => {
    const handleNumberKeys = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      const keyIdx = parseInt(e.key, 10) - 1;
      if (keyIdx >= 0 && keyIdx < GAME_ZONES.length) {
        setFocusedIdx(keyIdx);
        onSelectZone(GAME_ZONES[keyIdx].id);
        sound.playTeleport();
      }
    };
    window.addEventListener('keydown', handleNumberKeys);
    return () => window.removeEventListener('keydown', handleNumberKeys);
  }, [onSelectZone]);

  const getZoneIcon = (iconName: string) => {
    switch (iconName) {
      case 'Video':
        return <Video className="h-4 w-4" />;
      case 'Cpu':
        return <Cpu className="h-4 w-4" />;
      case 'Gamepad2':
        return <Gamepad2 className="h-4 w-4" />;
      case 'GraduationCap':
        return <GraduationCap className="h-4 w-4" />;
      case 'Radio':
        return <Radio className="h-4 w-4" />;
      case 'Headphones':
        return <Headphones className="h-4 w-4" />;
      case 'Orbit':
        return <Orbit className="h-4 w-4" />;
      default:
        return <Compass className="h-4 w-4" />;
    }
  };

  const currentZone = GAME_ZONES[focusedIdx] || GAME_ZONES[0];

  const handlePrev = () => {
    sound.playBip(620, 0.04);
    setFocusedIdx((prev) => (prev - 1 + GAME_ZONES.length) % GAME_ZONES.length);
  };

  const handleNext = () => {
    sound.playBip(680, 0.04);
    setFocusedIdx((prev) => (prev + 1) % GAME_ZONES.length);
  };

  return (
    <aside
      aria-label="Zone Fast Travel Carousel"
      className="pointer-events-auto fixed right-4 top-1/2 z-40 hidden w-[224px] -translate-y-1/2 md:block"
    >
      <div
        className="rounded-2xl border bg-[#0D1322]/95 p-3 shadow-2xl backdrop-blur-xl transition-colors"
        style={{
          borderColor: `${currentZone.glowColor}44`,
          boxShadow: `0 12px 32px rgba(0,0,0,0.6), 0 0 28px ${currentZone.glowColor}18`,
        }}
      >
        {/* Carousel Header */}
        <div className="mb-2.5 flex items-center justify-between border-b border-[#1E293B] pb-2">
          <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold tracking-wider text-[#94A3B8]">
            <Compass className="h-3.5 w-3.5 text-[#8B5CF6]" />
            <span>{language === 'en' ? 'FAST TRAVEL' : 'ĐI NHANH'}</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous zone"
              className="rounded-md border border-[#1E293B] bg-[#090D16] p-1 text-[#94A3B8] transition hover:border-white/25 hover:text-white"
            >
              <ChevronLeft className="h-3 w-3" />
            </button>
            <span className="px-1 font-mono text-[10px] font-bold text-[#E2E8F0]">
              {String(focusedIdx + 1).padStart(2, '0')}/{String(GAME_ZONES.length).padStart(2, '0')}
            </span>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next zone"
              className="rounded-md border border-[#1E293B] bg-[#090D16] p-1 text-[#94A3B8] transition hover:border-white/25 hover:text-white"
            >
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Spotlight Zone Card */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-xl border"
              style={{
                borderColor: `${currentZone.glowColor}66`,
                backgroundColor: `${currentZone.glowColor}1F`,
                color: currentZone.glowColor,
              }}
            >
              {getZoneIcon(currentZone.iconName)}
            </div>
            <span className="rounded-md border border-[#1E293B] bg-[#090D16] px-1.5 py-0.5 font-mono text-[10px] text-[#94A3B8]">
              [{focusedIdx + 1}]
            </span>
          </div>

          <div>
            <h3 className="text-xs font-extrabold leading-snug text-[#F8FAFC]">
              {language === 'en' ? currentZone.titleEn : currentZone.titleVi}
            </h3>
            <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-[#94A3B8]">
              {language === 'en' ? currentZone.subtitleEn : currentZone.subtitleVi}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              onSelectZone(currentZone.id);
              sound.playTeleport();
            }}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold text-white shadow-lg transition hover:brightness-110 active:scale-[0.98]"
            style={{
              backgroundColor: currentZone.glowColor,
              boxShadow: `0 6px 18px ${currentZone.glowColor}40`,
            }}
          >
            <span>{language === 'en' ? 'Enter Zone [E]' : 'Vào Khu Vực [E]'}</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* 6-Dot Quick Selector */}
        <div className="mt-3 flex items-center justify-center gap-1.5 border-t border-[#1E293B] pt-2.5">
          {GAME_ZONES.map((zone, idx) => {
            const isSelected = idx === focusedIdx;
            return (
              <button
                key={zone.id}
                type="button"
                onClick={() => {
                  setFocusedIdx(idx);
                  sound.playBip(660 + idx * 30, 0.04);
                }}
                title={`${language === 'en' ? zone.titleEn : zone.titleVi} [${idx + 1}]`}
                aria-label={language === 'en' ? zone.titleEn : zone.titleVi}
                className="h-2 rounded-full transition-all"
                style={{
                  width: isSelected ? '20px' : '8px',
                  backgroundColor: isSelected ? zone.glowColor : '#334155',
                }}
              />
            );
          })}
        </div>
      </div>
    </aside>
  );
};
