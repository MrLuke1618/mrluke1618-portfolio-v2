import React, { useState } from 'react';
import { TradingCardItem } from '../../types/game';
import { TRADING_CARDS } from '../../constants/gameData';
import { calculateReadingTime } from '../../utils/readingTime';
import { sound } from '../../constants/soundEffects';
import { Gamepad2, ExternalLink, Filter, Clock, Play, Cpu } from 'lucide-react';
import { KineticHeading } from '../common/KineticHeading';
import { ARCADE_GAMES, ArcadeGameInfo } from '../arcade/arcadeGamesData';
import { KineticVideoThumbnail } from '../arcade/KineticVideoThumbnail';
import { ArcadeGameModal } from '../arcade/ArcadeGameModal';

interface ArcadeProjectZoneProps {
  onOpenCard: (card: TradingCardItem) => void;
  language: 'en' | 'vi';
}

export const ArcadeProjectZone: React.FC<ArcadeProjectZoneProps> = ({
  onOpenCard,
  language
}) => {
  // Main view switcher: 10-Game Arcade Planet vs Production Web Apps
  const [hubSection, setHubSection] = useState<'arcade' | 'apps'>('arcade');
  const [activeGameFilter, setActiveGameFilter] = useState<'all' | 'action' | 'puzzle' | 'strategy'>('all');
  const [activeAppFilter, setActiveAppFilter] = useState<'all' | 'ai' | 'ecommerce' | 'education'>('all');
  const [hoveredGameId, setHoveredGameId] = useState<string | null>(null);
  const [selectedGame, setSelectedGame] = useState<ArcadeGameInfo | null>(null);

  // Filter 10 arcade games
  const filteredArcadeGames = ARCADE_GAMES.filter(game => {
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

  // Filter production apps
  const allProjects = TRADING_CARDS.filter(
    c => c.type === 'tool' || c.type === 'demo' || c.categoryEn.includes('App') || c.categoryEn.includes('Tool')
  );

  const filteredProjects = allProjects.filter(p => {
    if (activeAppFilter === 'ai') return p.tags.includes('AI Prompting') || p.tags.includes('AI Trends') || p.tags.includes('NLP');
    if (activeAppFilter === 'ecommerce') return p.tags.includes('Shopify') || p.tags.includes('E-commerce');
    if (activeAppFilter === 'education') return p.tags.includes('ADHD Support') || p.tags.includes('Gamification');
    return true;
  });

  const handleLaunchGame = (game: ArcadeGameInfo) => {
    setSelectedGame(game);
    sound.playLevelUp();
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn font-sans">
      {/* Zone Header Banner with Retro Gaming Persona */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-[#131B2E] border-2 border-[#1E293B] shadow-2xl overflow-hidden">
        {/* Pixel-art border framing accents */}
        <div className="absolute top-2 left-2 w-2 h-2 bg-[#8B5CF6]" />
        <div className="absolute top-2 right-2 w-2 h-2 bg-[#8B5CF6]" />
        <div className="absolute bottom-2 left-2 w-2 h-2 bg-[#8B5CF6]" />
        <div className="absolute bottom-2 right-2 w-2 h-2 bg-[#8B5CF6]" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-[#8B5CF6] text-xs font-mono font-medium mb-2 px-2.5 py-1 rounded-lg bg-[#090D16] border border-[#1E293B]">
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'DISTANT PLANET BETA · ORBITAL ARCADE' : 'HÀNH TINH BETA · TRẠM ARCADE QUỸ ĐẠO'}</span>
              <span className="text-[10px] text-amber-400 font-bold ml-1">● 60 FPS</span>
            </div>
            <KineticHeading
              as="h2"
              text={language === 'en' ? 'Retro Arcade Planet & Systems Hub' : 'Hành Tinh Retro Arcade & Hệ Thống'}
              className="text-2xl sm:text-3xl font-bold text-[#F8FAFC] tracking-tight font-mono"
            />
            <p className="mt-2 text-sm text-[#94A3B8] max-w-2xl leading-relaxed">
              {language === 'en'
                ? 'A retro cyberpunk gaming cosmos featuring 10 browser games with live Kinetic Motion Video Thumbnails, sound design, and playable arcade cabinet emulators—alongside live deployed web production tools.'
                : 'Vũ trụ game retro cyberpunk với 10 trò chơi trình duyệt, thumbnail video kinetic chuyển động trực tiếp, âm thanh 8-bit và các ứng dụng web sản xuất thực tế.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3.5 py-2 rounded-xl bg-[#090D16] border border-[#1E293B] text-center font-mono">
              <div className="text-[10px] text-[#94A3B8] uppercase">{language === 'en' ? 'COIN OP' : 'XU ARCADE'}</div>
              <div className="text-xs text-[#8B5CF6] font-bold">{language === 'en' ? 'FREE PLAY' : 'CHƠI MIỄN PHÍ'}</div>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-[#090D16] border border-[#1E293B] text-center font-mono">
              <div className="text-[10px] text-[#94A3B8] uppercase">{language === 'en' ? 'GAMES' : 'TRÒ CHƠI'}</div>
              <div className="text-xs text-[#F8FAFC] font-bold">{language === 'en' ? '10 / 10 ONLINE' : '10 / 10 SẴN SÀNG'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Section Switcher: 10-Game Arcade vs Production Web Apps */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#131B2E] border border-[#1E293B] max-w-md">
        <button
          onClick={() => {
            setHubSection('arcade');
            sound.playTerminalClick();
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-mono font-bold transition-all ${
            hubSection === 'arcade'
              ? 'bg-[#8B5CF6] text-white shadow-lg shadow-[#8B5CF6]/30'
              : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#090D16]'
          }`}
        >
          <Gamepad2 className="w-4 h-4" />
          <span>{language === 'en' ? '10-Game Arcade Planet' : '10 Game Retro Arcade'}</span>
        </button>

        <button
          onClick={() => {
            setHubSection('apps');
            sound.playTerminalClick();
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-mono font-bold transition-all ${
            hubSection === 'apps'
              ? 'bg-[#8B5CF6] text-white shadow-lg shadow-[#8B5CF6]/30'
              : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#090D16]'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>{language === 'en' ? 'Deployed Web Apps' : 'Ứng Dụng Đã Triển Khai'}</span>
        </button>
      </div>

      {/* SECTION 1: THE 10-GAME ARCADE PLANET */}
      {hubSection === 'arcade' && (
        <div className="space-y-6">
          {/* Genre Filters */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="text-xs font-mono text-[#94A3B8] mr-1">
                {language === 'en' ? 'FILTER GENRE:' : 'THỂ LOẠI:'}
              </span>
              {[
                { id: 'all', labelEn: 'All 10 Games', labelVi: 'Tất Cả 10 Game' },
                { id: 'action', labelEn: 'Reflex & Action', labelVi: 'Phản Xạ & Hành Động' },
                { id: 'puzzle', labelEn: 'Logic & Memory', labelVi: 'Trí Tuệ & Ghép Cặp' },
                { id: 'strategy', labelEn: 'Strategy & Stacker', labelVi: 'Chiến Thuật & Xếp Khối' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveGameFilter(tab.id as typeof activeGameFilter);
                    sound.playBip(600, 0.04);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
                    activeGameFilter === tab.id
                      ? 'bg-[#8B5CF6] text-white font-bold shadow-sm'
                      : 'bg-[#131B2E] border border-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC]'
                  }`}
                >
                  {language === 'en' ? tab.labelEn : tab.labelVi}
                </button>
              ))}
            </div>

            <div className="text-xs font-mono text-[#94A3B8]">
              {language === 'en' ? 'Click any thumbnail to launch playable cabinet' : 'Nhấp thumbnail để mở tủ game tương tác'}
            </div>
          </div>

          {/* 10-Game Grid with Kinetic Motion Video Thumbnails */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArcadeGames.map(game => (
              <div
                key={game.id}
                onMouseEnter={() => {
                  setHoveredGameId(game.id);
                  sound.playBip(500, 0.02);
                }}
                onMouseLeave={() => setHoveredGameId(null)}
                onClick={() => handleLaunchGame(game)}
                className="group relative p-4 rounded-2xl bg-[#131B2E] border border-[#1E293B] hover:border-[#8B5CF6] shadow-xl hover:shadow-2xl hover:shadow-[#8B5CF6]/15 transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Kinetic Motion Video Thumbnail with Live Canvas Showreel */}
                  <div className="mb-4">
                    <KineticVideoThumbnail
                      gameId={game.id}
                      title={game.title}
                      badge={game.badge}
                      isHovered={hoveredGameId === game.id}
                    />
                  </div>

                  {/* Header info */}
                  <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                    <span className="text-[#8B5CF6] font-semibold">
                      {language === 'en' ? game.genreEn : game.genreVi}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-[#090D16] border border-[#1E293B] text-[#94A3B8]">
                      {game.difficulty}
                    </span>
                  </div>

                  <h3 className="font-mono text-base font-bold text-[#F8FAFC] group-hover:text-[#8B5CF6] transition-colors flex items-center justify-between">
                    <span>{game.title}</span>
                    <Play className="w-4 h-4 text-[#8B5CF6] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>

                  <p className="mt-1.5 text-xs text-[#94A3B8] leading-relaxed line-clamp-2">
                    {language === 'en' ? game.taglineEn : game.taglineVi}
                  </p>
                </div>

                {/* Footer Controls Preview */}
                <div className="mt-4 pt-3 border-t border-[#1E293B] flex items-center justify-between text-xs font-mono">
                  <span className="text-[11px] text-[#94A3B8] truncate max-w-[170px]">
                    {language === 'en' ? game.controlsEn.split('.')[0] : game.controlsVi.split('.')[0]}
                  </span>
                  <span className="text-[#8B5CF6] font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>{language === 'en' ? 'PLAY' : 'CHƠI'}</span>
                    <span className="text-sm">›</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 2: PRODUCTION WEB APPS & DEMOS */}
      {hubSection === 'apps' && (
        <div className="space-y-6">
          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-[#94A3B8] mr-2 font-mono">
              <Filter className="w-3.5 h-3.5 text-[#8B5CF6]" />
              <span>{language === 'en' ? 'Category:' : 'Danh mục:'}</span>
            </div>
            {[
              { id: 'all', labelEn: 'All Projects', labelVi: 'Tất cả' },
              { id: 'ecommerce', labelEn: 'Shopify & E-Commerce', labelVi: 'Shopify & TMĐT' },
              { id: 'ai', labelEn: 'AI & Trends', labelVi: 'AI & Xu hướng' },
              { id: 'education', labelEn: 'Education & Gaming', labelVi: 'Giáo dục & Game' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveAppFilter(tab.id as typeof activeAppFilter);
                  sound.playBip(650, 0.04);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeAppFilter === tab.id
                    ? 'bg-[#8B5CF6] text-white shadow-sm font-semibold'
                    : 'bg-[#131B2E] border border-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC]'
                }`}
              >
                {language === 'en' ? tab.labelEn : tab.labelVi}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProjects.map((card) => {
              const content = language === 'en' ? card.descriptionEn : card.descriptionVi;
              const readMetrics = calculateReadingTime(content, language);

              return (
                <div
                  key={card.id}
                  onClick={() => {
                    onOpenCard(card);
                    sound.playBip(700, 0.05);
                  }}
                  className="group p-5 rounded-2xl bg-[#131B2E] border border-[#1E293B] hover:border-[#8B5CF6] shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-[#94A3B8] mb-2 font-mono">
                      <span className="text-[#8B5CF6] font-medium">
                        {language === 'en' ? card.categoryEn : card.categoryVi}
                      </span>
                      <span className="flex items-center gap-1 text-[11px]">
                        <Clock className="w-3 h-3 text-[#94A3B8]" />
                        {readMetrics.text}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm sm:text-base text-[#F8FAFC] group-hover:text-[#8B5CF6] transition-colors leading-snug">
                      {card.title}
                    </h4>

                    <p className="mt-2 text-xs text-[#94A3B8] line-clamp-3 leading-relaxed">
                      {content}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#1E293B] flex items-center justify-between text-xs font-mono">
                    <span className="text-[#94A3B8]">
                      {card.tags.slice(0, 3).join(' · ')}
                    </span>
                    <span className="text-[#8B5CF6] flex items-center gap-1 font-medium">
                      <span>{language === 'en' ? 'Launch' : 'Chạy thử'}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Playable Arcade Game Modal */}
      <ArcadeGameModal
        game={selectedGame}
        onClose={() => setSelectedGame(null)}
        language={language}
      />
    </div>
  );
};
