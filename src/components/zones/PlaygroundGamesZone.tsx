import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, Gamepad2, GitBranch, Play, Youtube } from 'lucide-react';
import catalogRaw from '../../data/projects.json';
import { TradingCardItem } from '../../types/game';
import { sound } from '../../constants/soundEffects';
import { LiveDioramaCard } from '../common/LiveDioramaCard';
import { ArcadeProjectZone } from './ArcadeProjectZone';

interface PlaygroundGamesZoneProps {
  onOpenCard: (card: TradingCardItem) => void;
  language: 'en' | 'vi';
}

interface CatalogProject {
  id: string;
  wing: string;
  title: string;
  tagline: string;
  status: string;
  featured: boolean;
  tech: string[];
  highlights: string[];
  githubUrl: string;
  liveUrl: string;
}

const ALL_GAMES = (catalogRaw.projects as CatalogProject[]).filter((p) => p.wing === 'ai-games');

export const PlaygroundGamesZone: React.FC<PlaygroundGamesZoneProps> = ({ onOpenCard, language }) => {
  const [tab, setTab] = useState<'playground' | 'videos' | 'retro'>('playground');
  const [activeGameIdx, setActiveGameIdx] = useState<number>(0);

  const activeGame = ALL_GAMES[activeGameIdx] || ALL_GAMES[0];

  const handlePrevGame = () => {
    sound.playBip(640, 0.04);
    setActiveGameIdx((prev) => (prev - 1 + ALL_GAMES.length) % ALL_GAMES.length);
  };

  const handleNextGame = () => {
    sound.playBip(700, 0.04);
    setActiveGameIdx((prev) => (prev + 1) % ALL_GAMES.length);
  };

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 overflow-hidden">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-[#1E293B] pb-2.5">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-2.5 py-1 font-mono text-[10px] font-bold text-[#F59E0B]">
            <Gamepad2 className="h-3 w-3" />
            {language === 'en' ? 'AI GAMES ARENA' : 'ĐẤU TRƯỜNG GAME AI'}
          </div>
          <h2 className="text-lg font-extrabold text-white">
            {language === 'en'
              ? 'Google Playground AI Games & Retro Arcade'
              : 'Game AI Playground & Kho Game Retro'}
          </h2>
        </div>

        <div className="flex rounded-xl border border-[#1E293B] bg-[#090D16] p-1">
          <button
            type="button"
            onClick={() => setTab('playground')}
            className={`rounded-lg px-3 py-1 text-[11px] font-bold transition ${
              tab === 'playground' ? 'bg-[#F59E0B] text-[#090D16]' : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            {language === 'en' ? 'Playground AI Games' : 'Game AI Playground'}
          </button>
          <button
            type="button"
            onClick={() => setTab('videos')}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-[11px] font-bold transition ${
              tab === 'videos' ? 'bg-[#F43F5E] text-white' : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            <Youtube className="h-3.5 w-3.5" />
            <span>{language === 'en' ? 'Gameplay Videos' : 'Video Gameplay'}</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('retro')}
            className={`rounded-lg px-3 py-1 text-[11px] font-bold transition ${
              tab === 'retro' ? 'bg-[#8B5CF6] text-white' : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            {language === 'en' ? '10 Retro Browser Games' : '10 Game Retro'}
          </button>
        </div>
      </div>

      {tab === 'playground' && activeGame ? (
        <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 overflow-hidden lg:grid-cols-12">
          {/* Left (7 cols): Single Large Spotlight Diorama */}
          <div className="flex min-h-0 flex-col justify-center overflow-hidden lg:col-span-7">
            <LiveDioramaCard
              key={activeGame.id}
              indexLabel={String(activeGameIdx + 1).padStart(2, '0')}
              title={activeGame.title}
              subtitle={activeGame.tagline}
              sceneId={activeGame.id}
              accent="#F59E0B"
              badge="PLAYGROUND FLAGSHIP"
              liveUrl={activeGame.liveUrl}
              githubUrl={activeGame.githubUrl}
              heightClass="h-[340px]"
              onClick={() => window.open(activeGame.liveUrl || activeGame.githubUrl, '_blank', 'noopener,noreferrer')}
            />
          </div>

          {/* Right (5 cols): Single-Game Carousel Controls, Highlights, Tech Stack & Actions */}
          <div className="flex min-h-0 flex-col justify-between overflow-hidden rounded-2xl border border-[#1E293B] bg-[#131B2E] p-5 lg:col-span-5">
            {/* Carousel Switcher Bar */}
            <div className="flex shrink-0 items-center justify-between border-b border-[#1E293B] pb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#F59E0B]">
                  GAME {String(activeGameIdx + 1).padStart(2, '0')} / {String(ALL_GAMES.length).padStart(2, '0')}
                </span>
                <div className="flex items-center gap-1">
                  {ALL_GAMES.map((g, idx) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => {
                        setActiveGameIdx(idx);
                        sound.playBip(680 + idx * 40, 0.04);
                      }}
                      className={`rounded-md px-2 py-0.5 font-mono text-[10px] font-bold transition ${
                        idx === activeGameIdx
                          ? 'bg-[#F59E0B] text-[#090D16]'
                          : 'border border-[#1E293B] bg-[#090D16] text-[#94A3B8] hover:text-white'
                      }`}
                    >
                      {String(idx + 1).padStart(2, '0')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handlePrevGame}
                  aria-label="Previous game"
                  className="rounded-lg border border-[#1E293B] bg-[#090D16] p-1.5 text-[#94A3B8] transition hover:border-[#F59E0B] hover:text-white"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNextGame}
                  aria-label="Next game"
                  className="rounded-lg border border-[#1E293B] bg-[#090D16] p-1.5 text-[#94A3B8] transition hover:border-[#F59E0B] hover:text-white"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Game Details */}
            <div className="my-auto space-y-3 overflow-hidden py-2">
              <div>
                <h3 className="text-xl font-extrabold text-white">{activeGame.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-[#CBD5E1]">{activeGame.tagline}</p>
              </div>

              {activeGame.highlights?.length > 0 && (
                <div className="space-y-1.5 border-t border-[#1E293B] pt-2.5">
                  {activeGame.highlights.slice(0, 4).map((hl, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-[#94A3B8]">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#F59E0B]" />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap gap-1.5 border-t border-[#1E293B] pt-2.5">
                {activeGame.tech.map((t) => (
                  <span
                    key={t}
                    className="rounded-md border border-amber-500/25 bg-amber-500/10 px-2 py-0.5 font-mono text-[10px] text-[#FDE68A]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex shrink-0 flex-wrap items-center gap-2 border-t border-[#1E293B] pt-3">
              {activeGame.liveUrl && (
                <a
                  href={activeGame.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#F59E0B] px-3 py-2 text-xs font-bold text-[#090D16] transition hover:brightness-110"
                >
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span>{language === 'en' ? 'Play / Try Live' : 'Chơi Ngay'}</span>
                </a>
              )}
              {activeGame.githubUrl && (
                <a
                  href={activeGame.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-[#1E293B] bg-[#090D16] px-3 py-2 text-xs font-semibold text-[#F8FAFC] transition hover:border-[#F59E0B]"
                >
                  <GitBranch className="h-3.5 w-3.5 text-[#F59E0B]" />
                  <span>GitHub</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
              <button
                type="button"
                onClick={() => setTab('videos')}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-[#FDA4AF] transition hover:bg-rose-500/20"
              >
                <Youtube className="h-3.5 w-3.5 text-[#F43F5E]" />
                <span>{language === 'en' ? 'Gameplay Videos' : 'Video'}</span>
              </button>
            </div>
          </div>
        </div>
      ) : tab === 'videos' ? (
        <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 overflow-hidden lg:grid-cols-12">
          <div className="flex min-h-0 overflow-hidden rounded-2xl border border-[#1E293B] bg-[#090D16] lg:col-span-8">
            <iframe
              src="https://www.youtube.com/embed/videoseries?list=PLFGWt830Li18&rel=0&modestbranding=1"
              title="Google Playground AI Games Showcase Playlist"
              className="h-full w-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          <div className="flex min-h-0 flex-col justify-between overflow-hidden rounded-2xl border border-[#1E293B] bg-[#131B2E] p-4 lg:col-span-4">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/15 px-2.5 py-1 font-mono text-[10px] font-bold text-[#F43F5E]">
                <Youtube className="h-3 w-3" />
                <span>GOOGLE PLAYGROUND · YOUTUBE PLAYLIST</span>
              </div>

              <h3 className="text-base font-extrabold text-[#F8FAFC]">
                {language === 'en' ? 'Published AI Games Showcase' : 'Tuyển Tập Video Game AI Playground'}
              </h3>

              <p className="text-xs leading-relaxed text-[#CBD5E1]">
                {language === 'en'
                  ? 'Official YouTube playlist featuring gameplay showcases and trailers of all AI games published on Google Playground. Currently includes 2 live videos and expands automatically as new titles ship.'
                  : 'Danh sách phát YouTube chính thức giới thiệu video gameplay của tất cả các tựa game AI đã phát hành trên Google Playground. Hiện có 2 video và sẽ liên tục cập nhật thêm các dự án mới.'}
              </p>

              <div className="flex flex-wrap gap-1.5 border-t border-[#1E293B] pt-3">
                {['Midnight Express', 'Football: Fantastic FCs', 'Procedural Engines', 'Ongoing Series'].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md border border-rose-500/25 bg-rose-500/10 px-2 py-0.5 font-mono text-[10px] text-[#FDA4AF]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <a
              href="https://www.youtube.com/playlist?list=PLFGWt830Li18"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#F43F5E] px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-rose-500/25 transition hover:bg-[#E11D48]"
            >
              <Youtube className="h-4 w-4" />
              <span>{language === 'en' ? 'Open Playlist on YouTube' : 'Mở Playlist trên YouTube'}</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      ) : (
        <div className="min-h-0 flex-1 overflow-hidden">
          <ArcadeProjectZone onOpenCard={onOpenCard} language={language} />
        </div>
      )}
    </div>
  );
};
