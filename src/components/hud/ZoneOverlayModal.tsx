import React, { useEffect, useState } from 'react';
import { ArrowLeft, AudioLines, VolumeX, X } from 'lucide-react';
import { GAME_ZONES } from '../../constants/gameData';
import { GameZoneId } from '../../types/game';
import { CLIP_SCRIPTS, voiceNarrator } from '../../utils/voiceNarrator';

interface ZoneOverlayModalProps {
  zoneId: GameZoneId | null;
  language: 'en' | 'vi';
  onClose: () => void;
  onSwitchZone: (zoneId: GameZoneId) => void;
  isVoiceSpeaking?: boolean;
  onPlayZoneVoice?: () => void;
  onStopZoneVoice?: () => void;
  children: React.ReactNode;
}

export const ZoneOverlayModal: React.FC<ZoneOverlayModalProps> = ({
  zoneId,
  language,
  onClose,
  onSwitchZone,
  isVoiceSpeaking = false,
  onPlayZoneVoice,
  onStopZoneVoice,
  children,
}) => {
  const [activeText, setActiveText] = useState<string | null>(voiceNarrator.getActiveText());
  const [activeWordIndex, setActiveWordIndex] = useState<number>(voiceNarrator.getActiveWordIndex());

  useEffect(() => {
    return voiceNarrator.subscribe(() => {
      setActiveText(voiceNarrator.getActiveText());
      setActiveWordIndex(voiceNarrator.getActiveWordIndex());
    });
  }, []);

  if (!zoneId) return null;
  const current = GAME_ZONES.find((z) => z.id === zoneId) || GAME_ZONES[0];
  const subtitleLine = (isVoiceSpeaking && activeText) || CLIP_SCRIPTS[zoneId][language];
  const subtitleWords = subtitleLine.trim().split(/\s+/).filter(Boolean);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-2 bg-[#04070E]/85 p-2 sm:p-3 backdrop-blur-xl transition-opacity duration-300"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <style>{`
        @keyframes zonePanelEnter {
          from { opacity: 0; transform: scale(0.97) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .zone-panel-enter {
          animation: zonePanelEnter 240ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes wordBounce {
          0% { transform: translateY(0) scale(1); }
          45% { transform: translateY(-4px) scale(1.18); }
          100% { transform: translateY(-2px) scale(1.14); }
        }
        .word-bounce-active {
          animation: wordBounce 180ms ease-out forwards;
        }
      `}</style>

      {/* Near Edge-to-Edge Focus Console */}
      <div
        className="zone-panel-enter flex h-[calc(100vh-5.5rem)] w-[96vw] max-w-[1680px] flex-col overflow-hidden rounded-2xl border bg-[#0A0F1D]/95 shadow-2xl"
        style={{
          borderColor: `${current.glowColor}55`,
          boxShadow: `0 0 60px ${current.glowColor}22, 0 25px 50px -12px rgba(0, 0, 0, 0.85)`,
        }}
      >
        {/* Strictly Single-Row Building Header */}
        <div className="flex shrink-0 flex-nowrap items-center justify-between gap-2 overflow-hidden border-b border-[#1E293B] bg-[#0B101B]/95 px-3 py-2">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl border border-white/15 bg-[#131B2E] px-2.5 py-1 text-xs font-bold text-[#F8FAFC] transition hover:border-white/35"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {language === 'en' ? '2.5D World (Esc)' : 'Thế giới 2.5D (Esc)'}
          </button>

          <div className="flex min-w-0 flex-nowrap items-center justify-end gap-1 overflow-x-auto no-scrollbar">
            {GAME_ZONES.map((z) => {
              const active = z.id === current.id;
              return (
                <button
                  key={z.id}
                  type="button"
                  onClick={() => onSwitchZone(z.id)}
                  className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg border px-2 py-1 text-[11px] font-semibold transition"
                  style={{
                    borderColor: active ? z.glowColor : `${z.glowColor}45`,
                    backgroundColor: active ? `${z.glowColor}33` : `${z.glowColor}14`,
                    color: active ? '#FFFFFF' : '#E2E8F0',
                    boxShadow: active ? `0 0 14px ${z.glowColor}40` : 'none',
                  }}
                >
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: z.glowColor }}
                  />
                  <span>{language === 'en' ? z.titleEn : z.titleVi}</span>
                </button>
              );
            })}
            {(onPlayZoneVoice || onStopZoneVoice) && (
              <button
                type="button"
                onClick={isVoiceSpeaking ? onStopZoneVoice : onPlayZoneVoice}
                className={`ml-1 inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-lg border px-2 py-1 text-[11px] font-semibold transition ${
                  isVoiceSpeaking
                    ? 'border-emerald-400/50 bg-emerald-500/15 text-[#34D399]'
                    : 'border-white/10 bg-[#131B2E] text-[#CBD5E1] hover:border-[#8B5CF6] hover:text-white'
                }`}
                title={language === 'en' ? 'Play / Stop Edge TTS Voice Guide' : 'Nghe / Dừng thuyết minh'}
              >
                {isVoiceSpeaking ? (
                  <>
                    <VolumeX className="h-3.5 w-3.5" />
                    <span>{language === 'en' ? 'Stop' : 'Dừng'}</span>
                  </>
                ) : (
                  <>
                    <AudioLines className="h-3.5 w-3.5 text-[#8B5CF6]" />
                    <span>{language === 'en' ? 'Voice' : 'Nghe'}</span>
                  </>
                )}
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close building overlay"
              className="ml-1 shrink-0 rounded-lg border border-white/10 p-1 text-[#94A3B8] transition hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Non-Scrolling Bento / Carousel Interior */}
        <div key={zoneId} className="zone-panel-enter flex min-h-0 flex-1 flex-col overflow-hidden p-3.5">
          {children}
        </div>
      </div>

      {/* Live Bouncing-Word Karaoke Subtitle Bar Beneath Window Panel */}
      <div
        aria-live="polite"
        className="flex min-h-[44px] w-[96vw] max-w-[1360px] shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#070B16]/95 px-4 py-2 text-center shadow-2xl backdrop-blur-md"
      >
        <div className="flex flex-wrap items-center justify-center text-xs sm:text-sm leading-relaxed">
          {subtitleWords.map((word, idx) => {
            const isActive = isVoiceSpeaking && idx === activeWordIndex;
            return (
              <span
                key={`${idx}-${word}`}
                className={`mx-[3px] inline-block transition-all duration-150 ${
                  isActive
                    ? 'word-bounce-active font-extrabold text-[#FACC15] drop-shadow-[0_0_10px_rgba(250,204,21,0.55)]'
                    : isVoiceSpeaking
                      ? 'font-medium text-[#E2E8F0]'
                      : 'font-normal text-[#94A3B8]'
                }`}
              >
                {word}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};
