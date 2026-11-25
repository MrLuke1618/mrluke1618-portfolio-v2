import React, { useState } from 'react';
import { TradingCardItem } from '../../types/game';
import { TRADING_CARDS } from '../../constants/gameData';
import { calculateReadingTime } from '../../utils/readingTime';
import { sound } from '../../constants/soundEffects';
import { Gamepad2, ExternalLink, Clock, Play, Cpu, ChevronLeft, ChevronRight } from 'lucide-react';
import { ARCADE_GAMES, ArcadeGameInfo } from '../arcade/arcadeGamesData';
import { KineticVideoThumbnail } from '../arcade/KineticVideoThumbnail';
import { ArcadeGameModal } from '../arcade/ArcadeGameModal';

interface ArcadeProjectZoneProps {
  onOpenCard: (card: TradingCardItem) => void;
  language: 'en' | 'vi';
}

const PAGE_SIZE = 6;

export const ArcadeProjectZone: React.FC<ArcadeProjectZoneProps> = ({
  onOpenCard,
  language,
}) => {
  const [hubSection, setHubSection] = useState<'arcade' | 'apps'>('arcade');
  const [activeGameFilter, setActiveGameFilter] = useState<'all' | 'action' | 'puzzle' | 'strategy'>('all');
  const [activeAppFilter, setActiveAppFilter] = useState<'all' | 'ai' | 'ecommerce' | 'education'>('all');
  const [page, setPage] = useState(0);
  const [hoveredGameId, setHoveredGameId] = useState<string | null>(null);
  const [selectedGame, setSelectedGame] = useState<ArcadeGameInfo | null>(null);

  const filteredArcadeGames = ARCADE_GAMES.filter((game) => {
    if (activeGameFilter === 'action') {
      return ['neural-snake', 'cyber-pong', 'pixel-jump', 'grid-racer', 'reactor-core', 'void-breaker'].includes(game.id);
    }
    if (activeGameFilter === 'puzzle') {
      return ['memory-core', 'cipher-break'].includes(game.id);
    }
    if (activeGameFilter === 'strategy') {
      return ['neon-tetris', 'tic-tac-quantum'].includes(game.id);
    }
    return true;
  });

  const allProjects = TRADING_CARDS.filter(
    (c) => c.type === 'tool' || c.type === 'demo' || c.categoryEn.includes('App') || c.categoryEn.includes('Tool')
  );

  const filteredProjects = allProjects.filter((p) => {
    if (activeAppFilter === 'ai') return p.tags.includes('AI Prompting') || p.tags.includes('AI Trends') || p.tags.includes('NLP');
    if (activeAppFilter === 'ecommerce') return p.tags.includes('Shopify') || p.tags.includes('E-commerce');
    if (activeAppFilter === 'education') return p.tags.includes('ADHD Support') || p.tags.includes('Gamification');
    return true;
  });

  const totalItems = hubSection === 'arcade' ? filteredArcadeGames.length : filteredProjects.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const safePage = Math.min(page, totalPages - 1);

  const visibleGames = filteredArcadeGames.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);
  const visibleApps = filteredProjects.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);

  const handleLaunchGame = (game: ArcadeGameInfo) => {
    setSelectedGame(game);
    sound.playLevelUp();
  };

  return (
    <div className="flex h-full min-h-0 flex-col gap-2.5 overflow-hidden font-sans">
      {/* Compact Single-Row Toolbar: Section Switch + Filters + Carousel Pager */}
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-[#1E293B] pb-2">
        <div className="flex items-center gap-1 rounded-xl border border-[#1E293B] bg-[#090D16] p-1">
          <button
            type="button"
            onClick={() => {
              setHubSection('arcade');
              setPage(0);
              sound.playTerminalClick();
            }}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-mono text-[11px] font-bold transition ${
              hubSection === 'arcade' ? 'bg-[#8B5CF6] text-white' : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            <Gamepad2 className="h-3.5 w-3.5" />
            <span>{language === 'en' ? '10 Arcade Games' : '10 Game Retro'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setHubSection('apps');
              setPage(0);
              sound.playTerminalClick();
            }}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-mono text-[11px] font-bold transition ${
              hubSection === 'apps' ? 'bg-[#8B5CF6] text-white' : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            <Cpu className="h-3.5 w-3.5" />
            <span>{language === 'en' ? 'Web Apps' : 'Ứng dụng Web'}</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {hubSection === 'arcade'
            ? [
                { id: 'all', labelEn: 'All (10)', labelVi: 'Tất cả (10)' },
                { id: 'action', labelEn: 'Action', labelVi: 'Hành động' },
                { id: 'puzzle', labelEn: 'Puzzle', labelVi: 'Trí tuệ' },
                { id: 'strategy', labelEn: 'Strategy', labelVi: 'Chiến thuật' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setActiveGameFilter(t.id as typeof activeGameFilter);
                    setPage(0);
                    sound.playBip(600, 0.04);
                  }}
                  className={`rounded-lg border px-2.5 py-1 font-mono text-[11px] transition ${
                    activeGameFilter === t.id
                      ? 'border-[#8B5CF6] bg-[#8B5CF6]/20 font-bold text-white'
                      : 'border-[#1E293B] bg-[#131B2E] text-[#94A3B8] hover:text-white'
                  }`}
                >
                  {language === 'en' ? t.labelEn : t.labelVi}
                </button>
              ))
            : [
                { id: 'all', labelEn: 'All Apps', labelVi: 'Tất cả' },
                { id: 'ecommerce', labelEn: 'Shopify', labelVi: 'Shopify' },
                { id: 'ai', labelEn: 'AI & Trends', labelVi: 'AI & Xu hướng' },
                { id: 'education', labelEn: 'Education', labelVi: 'Giáo dục' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setActiveAppFilter(t.id as typeof activeAppFilter);
                    setPage(0);
                    sound.playBip(650, 0.04);
                  }}
                  className={`rounded-lg border px-2.5 py-1 font-mono text-[11px] transition ${
                    activeAppFilter === t.id
                      ? 'border-[#8B5CF6] bg-[#8B5CF6]/20 font-bold text-white'
                      : 'border-[#1E293B] bg-[#131B2E] text-[#94A3B8] hover:text-white'
                  }`}
                >
                  {language === 'en' ? t.labelEn : t.labelVi}
                </button>
              ))}

          {/* Carousel Pager */}
          <div className="ml-1 flex items-center gap-1 rounded-lg border border-[#1E293B] bg-[#090D16] px-1.5 py-0.5">
            <button
              type="button"
              disabled={safePage === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              aria-label="Previous arcade page"
              className="rounded p-1 text-[#94A3B8] transition hover:bg-white/5 hover:text-white disabled:opacity-30"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <span className="px-1.5 font-mono text-[11px] font-bold text-[#E2E8F0]">
              {safePage + 1} / {totalPages}
            </span>
            <button
              type="button"
              disabled={safePage >= totalPages - 1}
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              aria-label="Next arcade page"
              className="rounded p-1 text-[#94A3B8] transition hover:bg-white/5 hover:text-white disabled:opacity-30"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3x2 Zero-Scroll Bento Grid */}
      {hubSection === 'arcade' ? (
        <div className="grid min-h-0 flex-1 grid-cols-1 content-stretch gap-3 overflow-hidden sm:grid-cols-2 lg:grid-cols-3">
          {visibleGames.map((game) => (
            <div
              key={game.id}
              onMouseEnter={() => {
                setHoveredGameId(game.id);
                sound.playBip(500, 0.02);
              }}
              onMouseLeave={() => setHoveredGameId(null)}
              onClick={() => handleLaunchGame(game)}
              className="group flex min-h-0 cursor-pointer flex-col justify-between rounded-2xl border border-[#1E293B] bg-[#131B2E] p-3 shadow-lg transition hover:border-[#8B5CF6]"
            >
              <div className="min-h-0 flex-1 overflow-hidden">
                <div className="mb-2 h-24 overflow-hidden rounded-xl">
                  <KineticVideoThumbnail
                    gameId={game.id}
                    title={game.title}
                    badge={game.badge}
                    isHovered={hoveredGameId === game.id}
                  />
                </div>

                <div className="flex items-center justify-between font-mono text-[10px]">
                  <span className="font-semibold text-[#8B5CF6]">
                    {language === 'en' ? game.genreEn : game.genreVi}
                  </span>
                  <span className="rounded border border-[#1E293B] bg-[#090D16] px-1.5 py-0.5 text-[#94A3B8]">
                    {game.difficulty}
                  </span>
                </div>

                <h3 className="mt-1 flex items-center justify-between font-mono text-sm font-bold text-[#F8FAFC] group-hover:text-[#8B5CF6]">
                  <span className="truncate">{game.title}</span>
                  <Play className="h-3.5 w-3.5 shrink-0 text-[#8B5CF6] opacity-0 transition-opacity group-hover:opacity-100" />
                </h3>

                <p className="mt-0.5 line-clamp-1 text-[11px] text-[#94A3B8]">
                  {language === 'en' ? game.taglineEn : game.taglineVi}
                </p>
              </div>

              <div className="mt-2 flex shrink-0 items-center justify-between border-t border-[#1E293B] pt-2 font-mono text-[10px]">
                <span className="max-w-[170px] truncate text-[#94A3B8]">
                  {language === 'en' ? game.controlsEn.split('.')[0] : game.controlsVi.split('.')[0]}
                </span>
                <span className="flex items-center gap-1 font-bold text-[#8B5CF6]">
                  <span>{language === 'en' ? 'PLAY' : 'CHƠI'}</span>
                  <span>›</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid min-h-0 flex-1 grid-cols-1 content-start gap-3 overflow-hidden sm:grid-cols-2 lg:grid-cols-3">
          {visibleApps.map((card) => {
            const content = language === 'en' ? card.descriptionEn : card.descriptionVi;
            const readMetrics = calculateReadingTime(content, language);

            return (
              <div
                key={card.id}
                onClick={() => {
                  onOpenCard(card);
                  sound.playBip(700, 0.05);
                }}
                className="group flex cursor-pointer flex-col justify-between rounded-2xl border border-[#1E293B] bg-[#131B2E] p-3.5 shadow-lg transition hover:border-[#8B5CF6]"
              >
                <div>
                  <div className="mb-1.5 flex items-center justify-between font-mono text-[10px] text-[#94A3B8]">
                    <span className="font-medium text-[#8B5CF6]">
                      {language === 'en' ? card.categoryEn : card.categoryVi}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {readMetrics.text}
                    </span>
                  </div>

                  <h4 className="line-clamp-1 text-sm font-bold text-[#F8FAFC] group-hover:text-[#8B5CF6]">
                    {card.title}
                  </h4>

                  <p className="mt-1 line-clamp-2 text-xs leading-snug text-[#94A3B8]">{content}</p>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-[#1E293B] pt-2 font-mono text-[10px]">
                  <span className="truncate text-[#94A3B8]">{card.tags.slice(0, 3).join(' · ')}</span>
                  <span className="flex shrink-0 items-center gap-1 font-bold text-[#8B5CF6]">
                    <span>{language === 'en' ? 'Launch' : 'Chạy thử'}</span>
                    <ExternalLink className="h-3 w-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ArcadeGameModal
        game={selectedGame}
        onClose={() => setSelectedGame(null)}
        language={language}
      />
    </div>
  );
};
