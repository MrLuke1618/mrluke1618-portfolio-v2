import React, { useState } from 'react';
import { TradingCardItem } from '../../types/game';
import { TRADING_CARDS } from '../../constants/gameData';
import { sound } from '../../constants/soundEffects';
import { Video, Film, Terminal } from 'lucide-react';
import { LiveDioramaCard } from '../common/LiveDioramaCard';
import { KineticTypographyLab } from '../video/KineticTypographyLab';
import { AutomatedWorkflowVisualizer } from '../video/AutomatedWorkflowVisualizer';
import { VideoPipelineSimulator } from '../video/VideoPipelineSimulator';

import { formatReadTime } from '../../utils/readingTime';

interface VideoVaultZoneProps {
  onOpenCard: (card: TradingCardItem) => void;
  onOpenEasterEgg: (snippetId: string) => void;
  language: 'en' | 'vi';
}

export const VideoVaultZone: React.FC<VideoVaultZoneProps> = ({
  onOpenCard,
  onOpenEasterEgg,
  language
}) => {
  const [subTab, setSubTab] = useState<'reels' | 'kinetic' | 'hyperframes' | 'simulator'>('reels');

  const videoCards = TRADING_CARDS.filter(
    (c) =>
      c.categoryEn.includes('Video') ||
      c.type === 'youtube' ||
      c.tags.includes('YouTube') ||
      c.tags.includes('VEO3')
  );

  const subTabs: Array<{ id: 'reels' | 'kinetic' | 'hyperframes' | 'simulator'; en: string; vi: string }> = [
    { id: 'reels', en: 'Reels & Drive', vi: 'Reel & Drive' },
    { id: 'kinetic', en: 'Kinetic Lab', vi: 'Kinetic Lab' },
    { id: 'hyperframes', en: 'Hyperframes', vi: 'Hyperframes' },
    { id: 'simulator', en: 'Simulator', vi: 'Mô phỏng' },
  ];

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      {/* Compact Header & 4-Tab Bar */}
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-[#1E293B] pb-2.5">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/15 px-2.5 py-1 font-mono text-[10px] font-bold text-[#A78BFA]">
            <Film className="h-3 w-3" />
            {language === 'en' ? 'MOTION & VIDEO SUITE' : 'PHÒNG VIDEO & MOTION'}
          </div>
          <h2 className="text-lg font-extrabold text-white">
            {language === 'en' ? 'YouTube Cinema & Video Vault' : 'Rạp YouTube & Kho Video'}
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-xl border border-[#1E293B] bg-[#090D16] p-1">
            {subTabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setSubTab(t.id);
                  sound.playBip(650, 0.04);
                }}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${
                  subTab === t.id ? 'bg-[#8B5CF6] text-white' : 'text-[#94A3B8] hover:text-white'
                }`}
              >
                {language === 'en' ? t.en : t.vi}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              onOpenEasterEgg('python-hyperframes');
              sound.playTeleport();
            }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#8B5CF6] px-3 py-1.5 text-[11px] font-bold text-white transition hover:bg-[#7C3AED]"
          >
            <Terminal className="h-3.5 w-3.5" />
            <span>{language === 'en' ? 'Pipeline Code' : 'Mã Pipeline'}</span>
          </button>
        </div>
      </div>

      {subTab === 'reels' && (
        <div className="flex min-h-0 flex-1 flex-col justify-between gap-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              { id: 'vault-reel', title: 'Video Showcase Reel', sub: 'Google Drive Master Reel', url: 'https://drive.google.com/file/d/1MKrJ9lNwt3Y0gzC2UYbodEIYDmIc0iVa/view?usp=drive_link', badge: 'DRIVE REEL' },
              { id: 'vault-playlist', title: 'AI Video Playlist', sub: 'Veo3 · Kling · Higgsfield', url: 'https://www.youtube.com/playlist?list=PL8l48rFpYhhaFUDxydFt2tTY55rpb9rWi', badge: 'YOUTUBE' },
              { id: 'vault-drive', title: 'Chuyên Drive Archive', sub: 'Multi-Brand AI Assets', url: 'https://drive.google.com/drive/folders/1JLeemFDS4cda0RMqv8Wd-ko_uD3Y57_N', badge: 'DRIVE FOLDER' },
              { id: 'vault-script', title: 'Stillness Before Storm', sub: 'Film Script & Direction', url: 'https://drive.google.com/file/d/1Q2hUgetAZfBgNaouebMADcgBQ1yY1_wD/view?usp=sharing', badge: 'SCRIPT' },
            ].map((item, idx) => (
              <LiveDioramaCard
                key={item.title}
                indexLabel={String(idx + 1).padStart(2, '0')}
                title={item.title}
                subtitle={item.sub}
                sceneId={item.id}
                accent="#8B5CF6"
                badge={item.badge}
                liveUrl={item.url}
                heightClass="h-28"
                onClick={() => window.open(item.url, '_blank', 'noopener,noreferrer')}
              />
            ))}
          </div>

          <div className="grid shrink-0 grid-cols-1 gap-2.5 md:grid-cols-3">
            {videoCards.slice(0, 3).map((card) => (
              <div
                key={card.id}
                onClick={() => {
                  onOpenCard(card);
                  sound.playBip(700, 0.05);
                }}
                className="group flex cursor-pointer flex-col justify-between rounded-xl border border-[#1E293B] bg-[#131B2E] p-3 transition hover:border-[#8B5CF6]"
              >
                <div className="flex items-center justify-between text-[10px] text-[#94A3B8]">
                  <span className="flex items-center gap-1 font-semibold text-[#A78BFA]">
                    <Video className="h-3 w-3" />
                    {language === 'en' ? card.categoryEn : card.categoryVi}
                  </span>
                  <span>{formatReadTime(card.readTimeEstimate, language)}</span>
                </div>
                <h4 className="mt-1 line-clamp-1 text-xs font-bold text-[#F8FAFC] group-hover:text-[#A78BFA]">
                  {card.title}
                </h4>
                <p className="mt-0.5 line-clamp-1 text-[11px] text-[#94A3B8]">
                  {language === 'en' ? card.descriptionEn : card.descriptionVi}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {subTab === 'kinetic' && (
        <div className="min-h-0 flex-1 overflow-hidden">
          <KineticTypographyLab language={language} />
        </div>
      )}

      {subTab === 'hyperframes' && (
        <div className="min-h-0 flex-1 overflow-hidden">
          <AutomatedWorkflowVisualizer language={language} onOpenEasterEgg={onOpenEasterEgg} />
        </div>
      )}

      {subTab === 'simulator' && (
        <div className="min-h-0 flex-1 overflow-hidden">
          <VideoPipelineSimulator language={language} onOpenEasterEgg={onOpenEasterEgg} />
        </div>
      )}
    </div>
  );
};
