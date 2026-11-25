import React, { useState, useEffect } from 'react';
import { PerformanceTier, GameZoneId, TradingCardItem, EasterEggSnippet } from './types/game';
import { GAME_ZONES } from './constants/gameData';
import { EASTER_EGGS } from './constants/easterEggs';
import { sound } from './constants/soundEffects';
import { voiceNarrator } from './utils/voiceNarrator';

// Canvas & Ambient Components
import { LayeredAmbientBackground } from './components/canvas/LayeredAmbientBackground';
import { GameCanvas2D } from './components/canvas/GameCanvas2D';

// HUD Components
import { TopNavBar } from './components/hud/TopNavBar';
import { FastTravelDock } from './components/hud/FastTravelDock';
import { ZoneOverlayModal } from './components/hud/ZoneOverlayModal';
import { InteractiveCardModal } from './components/hud/InteractiveCardModal';
import { EasterEggModal } from './components/hud/EasterEggModal';
import { BottomAudioDock } from './components/hud/BottomAudioDock';

// AI Assistant Drawer
import { AICompanionModal } from './components/companion/AICompanionModal';

// Zone Views
import { VideoVaultZone } from './components/zones/VideoVaultZone';
import { PlaygroundGamesZone } from './components/zones/PlaygroundGamesZone';
import { AIProjectsLabZone } from './components/zones/AIProjectsLabZone';
import { AcademyTowerZone } from './components/zones/AcademyTowerZone';
import { LoFiLoungeZone } from './components/zones/LoFiLoungeZone';
import { AntiGravityShipyardZone } from './components/zones/AntiGravityShipyardZone';

export const App: React.FC = () => {
  const [language, setLanguage] = useState<'en' | 'vi'>('en');
  const [activeZone, setActiveZone] = useState<GameZoneId>('arcade');
  const [openBuildingZone, setOpenBuildingZone] = useState<GameZoneId | null>(null);
  const [performanceTier, setPerformanceTier] = useState<PerformanceTier>('ultra');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState<boolean>(voiceNarrator.isEnabled());
  const [isVoiceSpeaking, setIsVoiceSpeaking] = useState<boolean>(voiceNarrator.isSpeaking());
  const [isAIDrawerOpen, setIsAIDrawerOpen] = useState<boolean>(false);
  const [activeModalCard, setActiveModalCard] = useState<TradingCardItem | null>(null);
  const [activeEasterEgg, setActiveEasterEgg] = useState<EasterEggSnippet | null>(null);

  useEffect(() => {
    return voiceNarrator.subscribe(() => {
      setIsVoiceEnabled(voiceNarrator.isEnabled());
      setIsVoiceSpeaking(voiceNarrator.isSpeaking());
    });
  }, []);

  // Dynamic Performance Tier Auto-Detection on Mount
  useEffect(() => {
    try {
      const isMobile = window.innerWidth < 768;
      const isLowMemory =
        (navigator as unknown as { deviceMemory?: number }).deviceMemory !== undefined &&
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

  // Escape closes open building overlay
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeModalCard) setActiveModalCard(null);
        else if (activeEasterEgg) setActiveEasterEgg(null);
        else if (openBuildingZone) {
          setOpenBuildingZone(null);
          voiceNarrator.stop();
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeModalCard, activeEasterEgg, openBuildingZone]);

  const handleToggleMute = () => {
    const newMuteState = sound.toggleMute();
    setIsMuted(newMuteState);
  };

  const handleToggleVoice = () => {
    const next = !isVoiceEnabled;
    voiceNarrator.setEnabled(next);
    setIsVoiceEnabled(next);
    if (next) {
      voiceNarrator.playClip(openBuildingZone || 'intro', language);
    }
    sound.playBip(700, 0.04);
  };

  const handleSelectZone = (zoneId: GameZoneId, shouldEnter = false) => {
    setActiveZone(zoneId);
    if (shouldEnter) {
      setOpenBuildingZone(zoneId);
      if (isVoiceEnabled) {
        voiceNarrator.playClip(zoneId, language);
      }
    }
  };

  const handleOpenCard = (card: TradingCardItem) => {
    setActiveModalCard(card);
    sound.playBip(820, 0.05);
  };

  const handleOpenEasterEgg = (snippetId: string) => {
    const found = EASTER_EGGS.find((e) => e.id === snippetId);
    if (found) {
      setActiveEasterEgg(found);
      sound.playLevelUp();
    }
  };

  const activeZoneConfig = GAME_ZONES.find((z) => z.id === activeZone) || GAME_ZONES[0];

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#090D16] text-[#F8FAFC] flex flex-col font-sans selection:bg-[#8B5CF6] selection:text-white antialiased">
      {/* Living 2.5D Layered Ambient Background */}
      <LayeredAmbientBackground tier={performanceTier} activeZoneColor={activeZoneConfig.glowColor} />

      {/* Top Navigation Bar */}
      <TopNavBar
        performanceTier={performanceTier}
        onSetTier={setPerformanceTier}
        language={language}
        onSetLanguage={setLanguage}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        isVoiceEnabled={isVoiceEnabled}
        isVoiceSpeaking={isVoiceSpeaking}
        onToggleVoice={handleToggleVoice}
        activeZone={activeZone}
        onSelectZone={(z) => handleSelectZone(z, true)}
        onOpenAIDrawer={() => setIsAIDrawerOpen(true)}
      />

      {/* Unified Full-Screen 2.5D RPG Overworld */}
      <main className="relative flex-1 w-full overflow-hidden z-10">
        <GameCanvas2D
          activeZone={activeZone}
          onSelectZone={handleSelectZone}
          onOpenEasterEgg={handleOpenEasterEgg}
          language={language}
        />
      </main>

      {/* Building Interior Overlay Modal */}
      <ZoneOverlayModal
        zoneId={openBuildingZone}
        language={language}
        isVoiceSpeaking={isVoiceSpeaking}
        onPlayZoneVoice={() => {
          if (openBuildingZone) {
            voiceNarrator.setEnabled(true);
            voiceNarrator.playClip(openBuildingZone, language);
          }
        }}
        onStopZoneVoice={() => voiceNarrator.stop()}
        onClose={() => {
          setOpenBuildingZone(null);
          voiceNarrator.stop();
        }}
        onSwitchZone={(z) => {
          setActiveZone(z);
          setOpenBuildingZone(z);
          if (isVoiceEnabled) {
            voiceNarrator.playClip(z, language);
          }
        }}
      >
        {openBuildingZone === 'arcade' && (
          <PlaygroundGamesZone onOpenCard={handleOpenCard} language={language} />
        )}
        {openBuildingZone === 'projects' && <AIProjectsLabZone language={language} />}
        {openBuildingZone === 'vault' && (
          <VideoVaultZone
            onOpenCard={handleOpenCard}
            onOpenEasterEgg={handleOpenEasterEgg}
            language={language}
          />
        )}
        {openBuildingZone === 'academy' && (
          <AcademyTowerZone onOpenCard={handleOpenCard} language={language} />
        )}
        {openBuildingZone === 'shipyard' && (
          <AntiGravityShipyardZone language={language} onOpenEasterEgg={handleOpenEasterEgg} />
        )}
        {openBuildingZone === 'lounge' && <LoFiLoungeZone language={language} />}
      </ZoneOverlayModal>

      {/* Persistent Bottom Lo-Fi Audio Player Dock (hidden when 16:9 focus console is open) */}
      {!openBuildingZone && <BottomAudioDock language={language} />}

      {/* Fast Travel Dock (hidden while inside a building modal) */}
      {!openBuildingZone && (
        <FastTravelDock
          activeZone={activeZone}
          onSelectZone={(z) => handleSelectZone(z, true)}
          language={language}
        />
      )}

      {/* AI Assistant Drawer ("Ask AI about Hoang") */}
      {!openBuildingZone && (
        <AICompanionModal
          currentZone={activeZone}
          language={language}
          isOpen={isAIDrawerOpen}
          onClose={() => setIsAIDrawerOpen(false)}
          onOpen={() => setIsAIDrawerOpen(true)}
        />
      )}

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
    </div>
  );
};

export default App;
