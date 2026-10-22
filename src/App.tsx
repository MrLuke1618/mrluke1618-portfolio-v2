import React, { useState, useEffect } from 'react';
import { PerformanceTier, GameZoneId, TradingCardItem, EasterEggSnippet } from './types/game';
import { GAME_ZONES } from './constants/gameData';
import { EASTER_EGGS } from './constants/easterEggs';
import { sound } from './constants/soundEffects';

// Canvas & Ambient Components
import { LayeredAmbientBackground } from './components/canvas/LayeredAmbientBackground';
import { GameCanvas2D } from './components/canvas/GameCanvas2D';

// HUD Components
import { TopNavBar } from './components/hud/TopNavBar';
import { FastTravelDock } from './components/hud/FastTravelDock';
import { InteractiveCardModal } from './components/hud/InteractiveCardModal';
import { EasterEggModal } from './components/hud/EasterEggModal';
import { BottomAudioDock } from './components/hud/BottomAudioDock';

// Clean Reader View
import { CleanReaderView } from './components/reader/CleanReaderView';

// AI Assistant Drawer
import { AICompanionModal } from './components/companion/AICompanionModal';

// Zone Views
import { VideoVaultZone } from './components/zones/VideoVaultZone';
import { ArcadeProjectZone } from './components/zones/ArcadeProjectZone';
import { AcademyTowerZone } from './components/zones/AcademyTowerZone';
import { LoFiLoungeZone } from './components/zones/LoFiLoungeZone';

import { ArrowUp } from 'lucide-react';

export const App: React.FC = () => {
  // Default view: Clean Reader Mode
  const [viewMode, setViewMode] = useState<'reader' | 'game'>('reader');
  const [language, setLanguage] = useState<'en' | 'vi'>('en');
  const [activeZone, setActiveZone] = useState<GameZoneId>('vault');
  const [performanceTier, setPerformanceTier] = useState<PerformanceTier>('ultra');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isAIDrawerOpen, setIsAIDrawerOpen] = useState<boolean>(false);
  const [activeModalCard, setActiveModalCard] = useState<TradingCardItem | null>(null);
  const [activeEasterEgg, setActiveEasterEgg] = useState<EasterEggSnippet | null>(null);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const [showMapHub, setShowMapHub] = useState<boolean>(true);

  // Dynamic Performance Tier Auto-Detection on Mount
  useEffect(() => {
    try {
      const isMobile = window.innerWidth < 768;
      const isLowMemory = (navigator as unknown as { deviceMemory?: number }).deviceMemory !== undefined &&
                          (navigator as unknown as { deviceMemory?: number }).deviceMemory! <= 4;
      const isLowCpu = navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency <= 4;

      if (isMobile || isLowMemory || isLowCpu) {
        setPerformanceTier('balanced');
      } else {
        setPerformanceTier('ultra');
      }
    } catch {
      setPerformanceTier('balanced');
    }
  }, []);

  // Back to top scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleToggleMute = () => {
    const newMuteState = sound.toggleMute();
    setIsMuted(newMuteState);
  };

  const handleSelectZone = (zoneId: GameZoneId) => {
    setActiveZone(zoneId);
  };

  const handleOpenCard = (card: TradingCardItem) => {
    setActiveModalCard(card);
    sound.playBip(820, 0.05);
  };

  const handleOpenEasterEgg = (snippetId: string) => {
    const found = EASTER_EGGS.find(e => e.id === snippetId);
    if (found) {
      setActiveEasterEgg(found);
      sound.playLevelUp();
    }
  };

  const activeZoneConfig = GAME_ZONES.find(z => z.id === activeZone) || GAME_ZONES[0];

  return (
    <div className="relative min-h-screen bg-[#090D16] text-[#F8FAFC] flex flex-col font-sans selection:bg-[#8B5CF6] selection:text-white antialiased">
      {/* Living 2.5D Layered Ambient Background (Zero heavy 3D meshes, 60fps locked) */}
      <LayeredAmbientBackground tier={performanceTier} activeZoneColor={activeZoneConfig.glowColor} />

      {/* Top Navigation Bar adhering to 3-zone contract */}
      <TopNavBar
        viewMode={viewMode}
        onSetViewMode={setViewMode}
        performanceTier={performanceTier}
        onSetTier={setPerformanceTier}
        language={language}
        onSetLanguage={setLanguage}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        activeZone={activeZone}
        onOpenAIDrawer={() => setIsAIDrawerOpen(true)}
      />

      {/* Main Content Container */}
      <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-36">
        {/* VIEW MODE 1: Clean Editorial Reader Mode (Default View) */}
        {viewMode === 'reader' && (
          <CleanReaderView
            language={language}
            onOpenCard={handleOpenCard}
            onOpenEasterEgg={handleOpenEasterEgg}
            onSwitchToGameMode={() => {
              setViewMode('game');
              sound.playTeleport();
            }}
          />
        )}

        {/* VIEW MODE 2: 2.5D Interactive Game Mode */}
        {viewMode === 'game' && (
          <div className="space-y-8 animate-fadeIn">
            {/* 2.5D World Map Hub */}
            <section aria-label="2.5D World Map Navigator" className="rounded-2xl border border-[#1E293B] bg-[#131B2E] p-4 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-[#F8FAFC] uppercase tracking-wider font-mono">
                    {language === 'en' ? 'Living 2.5D Layered Isometric Map' : 'Bản Đồ Không Gian 2.5D'}
                  </h2>
                  <p className="text-xs text-[#94A3B8] mt-0.5">
                    {language === 'en'
                      ? 'Pilot your nano-drone across the isometric studio grid or click stations to travel'
                      : 'Điều khiển nano-drone trên lưới không gian 2.5D hoặc nhấp trạm để di chuyển'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowMapHub(!showMapHub);
                    sound.playTerminalClick();
                  }}
                  className="text-xs font-mono text-[#94A3B8] hover:text-[#F8FAFC] px-3 py-1.5 rounded-lg bg-[#090D16] border border-[#1E293B] transition-colors"
                >
                  {showMapHub
                    ? (language === 'en' ? 'Collapse Map [-]' : 'Thu nhỏ [-]')
                    : (language === 'en' ? 'Expand Map [+]' : 'Mở rộng [+]')}
                </button>
              </div>

              {showMapHub && (
                <div className="rounded-xl overflow-hidden border border-[#1E293B]">
                  <GameCanvas2D
                    activeZone={activeZone}
                    onSelectZone={handleSelectZone}
                    onOpenEasterEgg={handleOpenEasterEgg}
                    language={language}
                  />
                </div>
              )}
            </section>

            {/* Active Exploration Zone View */}
            <section aria-label="Active Exploration Zone" className="scroll-mt-20">
              {activeZone === 'vault' && (
                <VideoVaultZone
                  onOpenCard={handleOpenCard}
                  onOpenEasterEgg={handleOpenEasterEgg}
                  language={language}
                />
              )}
              {activeZone === 'arcade' && (
                <ArcadeProjectZone
                  onOpenCard={handleOpenCard}
                  language={language}
                />
              )}
              {activeZone === 'academy' && (
                <AcademyTowerZone
                  onOpenCard={handleOpenCard}
                  language={language}
                />
              )}
              {activeZone === 'lounge' && (
                <LoFiLoungeZone
                  language={language}
                />
              )}
            </section>
          </div>
        )}
      </main>

      {/* Persistent Bottom Lo-Fi Audio Player Dock */}
      <BottomAudioDock language={language} />

      {/* Fast Travel Dock (Available in Game Mode) */}
      {viewMode === 'game' && (
        <FastTravelDock
          activeZone={activeZone}
          onSelectZone={handleSelectZone}
          language={language}
        />
      )}

      {/* AI Assistant Drawer ("Ask AI about Hoang") */}
      <AICompanionModal
        currentZone={activeZone}
        language={language}
        isOpen={isAIDrawerOpen}
        onClose={() => setIsAIDrawerOpen(false)}
        onOpen={() => setIsAIDrawerOpen(true)}
      />

      {/* Modal 1: Interactive Project / Work Card Preview */}
      {activeModalCard && (
        <InteractiveCardModal
          card={activeModalCard}
          onClose={() => setActiveModalCard(null)}
          language={language}
        />
      )}

      {/* Modal 2: Easter Egg Code Terminal for Recruiters */}
      {activeEasterEgg && (
        <EasterEggModal
          snippet={activeEasterEgg}
          onClose={() => setActiveEasterEgg(null)}
          language={language}
        />
      )}

      {/* Back to Top Smooth Scroll */}
      {showScrollTop && (
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            sound.playBip(900, 0.05);
          }}
          className="fixed bottom-24 right-6 z-30 p-2.5 rounded-full bg-[#131B2E] border border-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#8B5CF6] shadow-xl transition-all"
          title="Scroll to Top"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}

      {/* Editorial Clean Footer */}
      <footer className="relative z-10 py-8 border-t border-[#1E293B] bg-[#090D16] text-xs text-[#94A3B8]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            © {new Date().getFullYear()} Hoang Cao Minh. Video Editor · News Editor · AI Content Creator.
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <span>Hanoi, Vietnam</span>
            <span aria-hidden="true">·</span>
            <a href="mailto:hoangcaominh27@gmail.com" className="hover:text-[#F8FAFC] transition-colors">
              hoangcaominh27@gmail.com
            </a>
            <span aria-hidden="true">·</span>
            <span className="text-[#8B5CF6]">Deployed on Vercel</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
