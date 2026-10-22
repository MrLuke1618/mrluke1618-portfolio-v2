import React, { useEffect } from 'react';
import { GameZoneId } from '../../types/game';
import { GAME_ZONES } from '../../constants/gameData';
import { sound } from '../../constants/soundEffects';
import { Video, Cpu, Gamepad2, GraduationCap, Radio, Compass, Headphones } from 'lucide-react';

interface FastTravelDockProps {
  activeZone: GameZoneId;
  onSelectZone: (zoneId: GameZoneId) => void;
  language: 'en' | 'vi';
}

export const FastTravelDock: React.FC<FastTravelDockProps> = ({
  activeZone,
  onSelectZone,
  language
}) => {
  // Numeric hotkeys 1-6 for instant zone travel
  useEffect(() => {
    const handleNumberKeys = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      const keyIdx = parseInt(e.key, 10) - 1;
      if (keyIdx >= 0 && keyIdx < GAME_ZONES.length) {
        onSelectZone(GAME_ZONES[keyIdx].id);
        sound.playTeleport();
      }
    };
    window.addEventListener('keydown', handleNumberKeys);
    return () => window.removeEventListener('keydown', handleNumberKeys);
  }, [onSelectZone]);

  const getZoneIcon = (iconName: string) => {
    switch (iconName) {
      case 'Video': return <Video className="w-4 h-4" />;
      case 'Cpu': return <Cpu className="w-4 h-4" />;
      case 'Gamepad2': return <Gamepad2 className="w-4 h-4" />;
      case 'GraduationCap': return <GraduationCap className="w-4 h-4" />;
      case 'Radio': return <Radio className="w-4 h-4" />;
      case 'Headphones': return <Headphones className="w-4 h-4" />;
      default: return <Compass className="w-4 h-4" />;
    }
  };

  return (
    <div className="fixed bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-40 max-w-full px-2 pointer-events-auto">
      <nav 
        className="flex items-center gap-1 sm:gap-2 p-1.5 sm:p-2 rounded-2xl bg-[#131B2E]/95 border border-[#1E293B] backdrop-blur-xl shadow-2xl"
        aria-label="Zone Fast Travel"
      >
        <div className="hidden md:flex items-center gap-1.5 px-2 text-[10px] font-mono text-[#94A3B8] border-r border-[#1E293B] pr-3">
          <Compass className="w-3.5 h-3.5 text-[#8B5CF6]" />
          <span>FAST TRAVEL:</span>
        </div>

        {GAME_ZONES.map((zone, idx) => {
          const isActive = activeZone === zone.id;
          return (
            <button
              key={zone.id}
              onClick={() => {
                onSelectZone(zone.id);
                sound.playTeleport();
              }}
              className={`relative flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-mono transition-all duration-200 ${
                isActive
                  ? 'bg-[#8B5CF6] text-white font-semibold shadow-md shadow-[#8B5CF6]/30'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#090D16] border border-transparent hover:border-[#1E293B]'
              }`}
              title={`${language === 'en' ? zone.titleEn : zone.titleVi} [Press ${idx + 1}]`}
            >
              <span className={isActive ? 'text-white' : 'text-[#94A3B8]'}>
                {getZoneIcon(zone.iconName)}
              </span>
              <span className="hidden sm:inline whitespace-nowrap">
                {language === 'en' ? zone.titleEn.split(' ')[1] || zone.titleEn : zone.titleVi.split(' ')[0] || zone.titleVi}
              </span>
              <span className="text-[9px] opacity-60 hidden lg:inline">
                [{idx + 1}]
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
