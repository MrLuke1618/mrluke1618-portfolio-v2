import React, { useState } from 'react';
import { TradingCardItem } from '../../types/game';
import { TRADING_CARDS } from '../../constants/gameData';
import { calculateReadingTime } from '../../utils/readingTime';
import { sound } from '../../constants/soundEffects';
import { Gamepad2, ExternalLink, Filter, Clock } from 'lucide-react';
import { KineticHeading } from '../common/KineticHeading';

interface ArcadeProjectZoneProps {
  onOpenCard: (card: TradingCardItem) => void;
  language: 'en' | 'vi';
}

export const ArcadeProjectZone: React.FC<ArcadeProjectZoneProps> = ({
  onOpenCard,
  language
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'ai' | 'ecommerce' | 'education'>('all');

  const allProjects = TRADING_CARDS.filter(
    c => c.type === 'tool' || c.type === 'demo' || c.categoryEn.includes('App') || c.categoryEn.includes('Tool')
  );

  const filteredProjects = allProjects.filter(p => {
    if (activeFilter === 'ai') return p.tags.includes('AI Prompting') || p.tags.includes('AI Trends') || p.tags.includes('NLP');
    if (activeFilter === 'ecommerce') return p.tags.includes('Shopify') || p.tags.includes('E-commerce');
    if (activeFilter === 'education') return p.tags.includes('ADHD Support') || p.tags.includes('Gamification');
    return true;
  });

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Zone Header Banner */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-[#131B2E] border border-[#1E293B] shadow-2xl overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-[#8B5CF6] text-xs font-medium mb-3">
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'Interactive Web Tools & AI Products' : 'Công cụ Web Tương tác & Sản phẩm AI'}</span>
            </div>
            <KineticHeading
              as="h2"
              text={language === 'en' ? 'Project Showcase & Systems' : 'Kho Dự Án & Kỹ Thuật'}
              className="text-2xl sm:text-3xl font-bold text-[#F8FAFC] tracking-tight"
            />
            <p className="mt-2 text-sm text-[#94A3B8] max-w-2xl leading-relaxed">
              {language === 'en'
                ? 'Interactive suite of deployed web apps, Shopify e-commerce growth tools, trend intelligence engines, and gamified ADHD simulators.'
                : 'Tập hợp các ứng dụng web đã triển khai, công cụ tăng trưởng thương mại điện tử Shopify, bộ phân tích xu hướng và game giả lập giáo dục.'}
            </p>
          </div>

          <div className="px-4 py-2 rounded-xl bg-[#090D16] border border-[#1E293B] text-[#8B5CF6] text-xs font-medium">
            {filteredProjects.length} {language === 'en' ? 'Apps Deployed' : 'Ứng dụng Hoạt động'}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 text-xs text-[#94A3B8] mr-2">
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
              setActiveFilter(tab.id as typeof activeFilter);
              sound.playBip(650, 0.04);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeFilter === tab.id
                ? 'bg-[#8B5CF6] text-white shadow-sm'
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
                <div className="flex items-center justify-between text-xs text-[#94A3B8] mb-2">
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

              <div className="mt-4 pt-3 border-t border-[#1E293B] flex items-center justify-between text-xs">
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
  );
};
