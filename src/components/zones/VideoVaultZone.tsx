import React from 'react';
import { TradingCardItem } from '../../types/game';
import { TRADING_CARDS } from '../../constants/gameData';
import { sound } from '../../constants/soundEffects';
import { Video, Film, Terminal } from 'lucide-react';
import { KineticHeading } from '../common/KineticHeading';
import { KineticTypographyLab } from '../video/KineticTypographyLab';
import { AutomatedWorkflowVisualizer } from '../video/AutomatedWorkflowVisualizer';
import { VideoPipelineSimulator } from '../video/VideoPipelineSimulator';

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
  const videoCards = TRADING_CARDS.filter(
    (c) =>
      c.categoryEn.includes('Video') ||
      c.type === 'youtube' ||
      c.tags.includes('YouTube') ||
      c.tags.includes('VEO3')
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Zone 1 Flagship Hero Banner */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-[#131B2E] border border-[#1E293B] shadow-2xl overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-[#8B5CF6] text-xs font-mono mb-3">
              <Film className="w-3.5 h-3.5" />
              <span>
                {language === 'en'
                  ? 'FLAGSHIP STATION · MOTION & VIDEO SUITE'
                  : 'TRẠM CHỦ LỰC · PHÒNG KỸ XẢO MOTION & VIDEO'}
              </span>
            </div>
            <KineticHeading
              as="h2"
              text={language === 'en' ? 'Motion & Video Suite' : 'Phòng Kỹ Xảo Motion & Video'}
              className="text-2xl sm:text-3xl font-bold text-[#F8FAFC] tracking-tight"
            />
            <p className="mt-2 text-sm text-[#94A3B8] max-w-2xl leading-relaxed">
              {language === 'en'
                ? 'High-retention video post-production mastery paired with custom Python + Hyperframes + Concat automated YouTube pipelines. Built with 6+ years of cinematic editing experience.'
                : 'Kỹ năng dựng phim và hậu kỳ video giữ chân người xem cao kết hợp quy trình tự động hóa YouTube với Python + Hyperframes + Concat. Xây dựng trên hơn 6 năm kinh nghiệm thực chiến.'}
            </p>
          </div>

          <button
            onClick={() => {
              onOpenEasterEgg('python-hyperframes');
              sound.playTeleport();
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-medium transition-colors shadow-md shadow-[#8B5CF6]/30 shrink-0"
          >
            <Terminal className="w-4 h-4" />
            <span>{language === 'en' ? 'Inspect Pipeline Code' : 'Xem Mã Nguồn Pipeline'}</span>
          </button>
        </div>
      </div>

      {/* Feature 1: Interactive Kinetic Motion Typography Sandbox */}
      <KineticTypographyLab language={language} />

      {/* Feature 2: Automated Workflow Breakdown (Python + Hyperframes + Concat) */}
      <AutomatedWorkflowVisualizer
        language={language}
        onOpenEasterEgg={onOpenEasterEgg}
      />

      {/* Feature 3: Interactive Video Pipeline Simulator */}
      <VideoPipelineSimulator
        language={language}
        onOpenEasterEgg={onOpenEasterEgg}
      />

      {/* Featured Video Assets & Production Proof Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-base text-[#F8FAFC] flex items-center gap-2">
            <Video className="w-4 h-4 text-[#8B5CF6]" />
            <span>
              {language === 'en'
                ? 'Featured Video Assets & Production Case Studies'
                : 'Tài Liệu Video & Dự Án Tiêu Biểu'}
            </span>
          </h3>
          <span className="text-xs text-[#94A3B8]">
            {language === 'en' ? 'Click card to inspect details' : 'Nhấp thẻ để xem chi tiết'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {videoCards.map((card) => (
            <div
              key={card.id}
              onClick={() => {
                onOpenCard(card);
                sound.playBip(700, 0.05);
              }}
              className="group p-5 rounded-2xl bg-[#131B2E] border border-[#1E293B] hover:border-[#8B5CF6] shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-[#94A3B8] mb-2">
                  <span className="text-[#8B5CF6] font-medium">
                    {language === 'en' ? card.categoryEn : card.categoryVi}
                  </span>
                  <span>{card.readTimeEstimate}</span>
                </div>

                <h4 className="font-bold text-sm sm:text-base text-[#F8FAFC] group-hover:text-[#8B5CF6] transition-colors leading-snug">
                  {card.title}
                </h4>

                <p className="mt-2 text-xs text-[#94A3B8] line-clamp-3 leading-relaxed">
                  {language === 'en' ? card.descriptionEn : card.descriptionVi}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#1E293B] flex items-center justify-between text-xs">
                <div className="flex flex-wrap gap-1.5">
                  {card.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="text-[11px] text-[#94A3B8]">
                      #{tag}
                    </span>
                  ))}
                </div>
                <span className="text-[#8B5CF6] group-hover:translate-x-0.5 transition-transform flex items-center gap-1 font-mono text-[11px]">
                  <span>{language === 'en' ? 'Details' : 'Chi tiết'}</span>
                  <span>→</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
