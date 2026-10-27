import React, { useState } from 'react';
import { TradingCardItem } from '../../types/game';
import { QUEST_LOG_DATA, SKILL_TREE_DATA } from '../../constants/gameData';
import { calculateReadingTime } from '../../utils/readingTime';
import { sound } from '../../constants/soundEffects';
import { GraduationCap, Award, Scroll, GitBranch, ArrowUpRight, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { KineticHeading } from '../common/KineticHeading';

interface AcademyTowerZoneProps {
  onOpenCard?: (card: TradingCardItem) => void;
  language: 'en' | 'vi';
}

export const AcademyTowerZone: React.FC<AcademyTowerZoneProps> = ({
  onOpenCard: _onOpenCard,
  language
}) => {
  const [tab, setTab] = useState<'questlog' | 'skilltree' | 'education'>('questlog');
  const [expandedQuest, setExpandedQuest] = useState<string | null>('quest-chuyen');

  const summaryText = language === 'en'
    ? "Hello, I'm Hoang. With over six years of experience as a Video Editor, News Editor, and AI Content Creator, I specialize in enhancing content clarity and engaging readers across multiple platforms. My expertise in next-gen AI prompt engineering, video post-production pipelines, and AI app integrations allows me to deliver exceptional interactive products. I am deeply passionate about merging traditional media storytelling with custom software systems to streamline creative workflows and power learning personalization."
    : "Xin chào, tôi là Hoàng. Với hơn sáu năm kinh nghiệm làm Biên tập viên Video, Biên tập viên Tin tức và Sáng tạo Nội dung AI, tôi chuyên tối ưu hóa độ rõ nét của nội dung và thu hút người đọc trên nhiều nền tảng số. Việc am hiểu thiết lập kỹ xảo quay dựng AI thế hệ mới, tối ưu hóa Prompt và phát triển ứng dụng AI giúp tôi tạo ra những sản phẩm giáo dục cá nhân hóa chất lượng. Tôi đam mê kết hợp kỹ năng kể chuyện truyền thống với sự phát triển của công nghệ để thúc đẩy trải nghiệm tự học và quy trình làm nội dung tự động.";

  const summaryMetrics = calculateReadingTime(summaryText, language);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Zone Header Banner */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-[#131B2E] border border-[#1E293B] shadow-2xl overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-[#8B5CF6] text-xs font-medium mb-3">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'Career Milestones & Academic Honours' : 'Cột mốc Sự nghiệp & Học vị'}</span>
            </div>
            <KineticHeading
              as="h2"
              text={language === 'en' ? 'Career & Education Tower' : 'Tháp Sự Nghiệp & Học Vấn'}
              className="text-2xl sm:text-3xl font-bold text-[#F8FAFC] tracking-tight"
            />
            <p className="mt-2 text-sm text-[#94A3B8] max-w-2xl leading-relaxed">
              {language === 'en'
                ? 'Comprehensive career quest records, Dublin City University Master’s degree honours, and modular skill mastery trees reflecting 6+ years of multimedia production.'
                : 'Nhật ký sự nghiệp, bằng Thạc sĩ DCU loại Giỏi và Cây kỹ năng tổng hợp hơn 6 năm sản xuất truyền thông đa nền tảng.'}
            </p>
          </div>

          <div className="px-4 py-2 rounded-xl bg-[#090D16] border border-[#1E293B] text-[#F59E0B] text-xs font-medium">
            {language === 'en' ? 'MA Honours (Grade 1)' : 'Thạc sĩ DCU Loại Giỏi'}
          </div>
        </div>
      </div>

      {/* Professional Summary Card */}
      <div className="p-6 rounded-2xl bg-[#131B2E] border border-[#1E293B] shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-[#1E293B] text-xs">
          <div className="flex items-center gap-2 text-[#F8FAFC] font-semibold">
            <Scroll className="w-4 h-4 text-[#8B5CF6]" />
            <span>{language === 'en' ? 'Professional Summary' : 'Tổng quan Chuyên môn'}</span>
          </div>
          <div className="flex items-center gap-3 text-[#94A3B8] text-[11px]">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {summaryMetrics.text}
            </span>
            <span>·</span>
            <span>{summaryMetrics.words} {language === 'en' ? 'words' : 'từ'}</span>
          </div>
        </div>
        <p className="text-sm text-[#F8FAFC]/90 leading-relaxed">
          {summaryText}
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#131B2E] border border-[#1E293B] max-w-fit">
        <button
          onClick={() => {
            setTab('questlog');
            sound.playBip(650, 0.04);
          }}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
            tab === 'questlog'
              ? 'bg-[#8B5CF6] text-white shadow-sm'
              : 'text-[#94A3B8] hover:text-[#F8FAFC]'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>{language === 'en' ? 'Career Milestones' : 'Cột mốc Sự nghiệp'}</span>
        </button>

        <button
          onClick={() => {
            setTab('skilltree');
            sound.playBip(650, 0.04);
          }}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
            tab === 'skilltree'
              ? 'bg-[#8B5CF6] text-white shadow-sm'
              : 'text-[#94A3B8] hover:text-[#F8FAFC]'
          }`}
        >
          <GitBranch className="w-4 h-4" />
          <span>{language === 'en' ? 'Skill Tree' : 'Cây Kỹ Năng'}</span>
        </button>

        <button
          onClick={() => {
            setTab('education');
            sound.playBip(650, 0.04);
          }}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
            tab === 'education'
              ? 'bg-[#8B5CF6] text-white shadow-sm'
              : 'text-[#94A3B8] hover:text-[#F8FAFC]'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>{language === 'en' ? 'Degrees & Education' : 'Học vấn & Bằng cấp'}</span>
        </button>
      </div>

      {/* View 1: Quest Log */}
      {tab === 'questlog' && (
        <div className="space-y-4">
          {QUEST_LOG_DATA.map((quest) => {
            const isExpanded = expandedQuest === quest.id;
            return (
              <div
                key={quest.id}
                className="p-5 sm:p-6 rounded-2xl bg-[#131B2E] border border-[#1E293B] hover:border-[#8B5CF6] transition-all duration-200 shadow-lg"
              >
                <div
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer"
                  onClick={() => {
                    setExpandedQuest(isExpanded ? null : quest.id);
                    sound.playTerminalClick();
                  }}
                >
                  <div>
                    <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
                      <span>{language === 'en' ? quest.period : (quest.periodVi || quest.period)}</span>
                      <span>·</span>
                      <span className="text-[#8B5CF6] font-medium">{quest.questRank}</span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-[#F8FAFC] mt-0.5">
                      {language === 'en' ? quest.role : (quest.roleVi || quest.role)}
                    </h3>
                    <p className="text-xs text-[#94A3B8]">{quest.company}</p>
                  </div>

                  <div className="flex items-center gap-1.5 text-[#94A3B8] text-xs">
                    <span>{isExpanded ? (language === 'en' ? 'Collapse' : 'Thu gọn') : (language === 'en' ? 'Details' : 'Chi tiết')}</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-[#1E293B] space-y-3 animate-fadeIn">
                    <p className="text-xs sm:text-sm text-[#94A3B8]">
                      {language === 'en' ? quest.summaryEn : quest.summaryVi}
                    </p>

                    <div className="space-y-2 pt-2">
                      {quest.achievements.map((ach, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs text-[#94A3B8]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] mt-1.5 shrink-0" />
                          <span>{language === 'en' ? ach : (quest.achievementsVi?.[idx] || ach)}</span>
                        </div>
                      ))}
                    </div>

                    {quest.lootLinks && (
                      <div className="pt-3 border-t border-[#1E293B] flex flex-wrap gap-2">
                        {quest.lootLinks.map((link, idx) => (
                          <a
                            key={idx}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#090D16] border border-[#1E293B] hover:border-[#8B5CF6] text-xs text-[#F8FAFC] transition-colors"
                          >
                            <span>{link.name}</span>
                            <ArrowUpRight className="w-3.5 h-3.5 text-[#8B5CF6]" />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* View 2: Skill Tree */}
      {tab === 'skilltree' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SKILL_TREE_DATA.map((node) => (
            <div
              key={node.id}
              className="p-5 rounded-2xl bg-[#131B2E] border border-[#1E293B] hover:border-[#8B5CF6] transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-[#F8FAFC]">{node.name}</h4>
                  <div className="text-xs text-[#8B5CF6] font-medium">{language === 'en' ? node.level : node.levelVi}</div>
                </div>
                <div className="text-xs font-mono text-[#F8FAFC]">{node.masteryPercent}%</div>
              </div>

              <div className="w-full bg-[#090D16] rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-[#8B5CF6] h-1.5 rounded-full"
                  style={{ width: `${node.masteryPercent}%` }}
                />
              </div>

              <p className="text-xs text-[#94A3B8] leading-relaxed">
                {language === 'en' ? node.descriptionEn : node.descriptionVi}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* View 3: Education & Degrees */}
      {tab === 'education' && (
        <div className="space-y-6">
          {/* DCU Master's Degree */}
          <div className="p-6 rounded-2xl bg-[#131B2E] border border-[#1E293B] shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-semibold text-[#F59E0B]">
                  {language === 'en' ? 'FIRST CLASS HONOURS (2:1)' : 'TỐT NGHIỆP LOẠI GIỎI (2:1)'}
                </span>
                <h3 className="text-lg font-bold text-[#F8FAFC] mt-0.5">
                  {language === 'en'
                    ? 'Master’s Degree in Communication and Media Studies'
                    : 'Thạc sĩ Truyền thông & Nghiên cứu Đa phương tiện'}
                </h3>
                <p className="text-xs text-[#94A3B8]">
                  {language === 'en' ? 'Dublin City University (2024–2025)' : 'Đại học Dublin City, Ireland (2024–2025)'}
                </p>
              </div>
              <span className="text-xs text-[#94A3B8]">Dublin, Ireland</span>
            </div>

            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
              <strong>{language === 'en' ? 'Core Modules: ' : 'Môn học trọng tâm: '}</strong>
              {language === 'en'
                ? 'Audio & Sonic Design, Moving Image & Video Production, Visual Design, Responsive Media, Screenwriting, Project Planning & Management, Major Project.'
                : 'Thiết kế Âm thanh & Sonic, Sản xuất Video & Hình ảnh Động, Thiết kế Thị giác, Truyền thông Tương tác, Biên kịch, Quản trị Dự án, Đồ án Tốt nghiệp.'}
            </p>

            <div className="pt-3 border-t border-[#1E293B]">
              <div className="text-xs font-medium text-[#F8FAFC] mb-2">
                {language === 'en' ? 'DCU Master’s Artifacts & Major Project:' : 'Dự án Tốt nghiệp DCU:'}
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: 'The Sailboat (WebGL Major Project)', url: 'https://mrluke1618.github.io/Major-Project-WebGL' },
                  { name: 'Stories Of The Liberties (Editorial)', url: 'https://minhhoangcaodcu.wordpress.com/2024/12/05/stories-of-the-liberties' },
                  { name: 'Visual Design Asset Archive', url: 'https://drive.google.com/drive/folders/1ongFDTY1WamiKPnmdiLkW2Q-zz_6jQuv' },
                  { name: 'The Post (Interactive Unity App)', url: 'https://www.youtube.com/watch?v=M3MkM_OE3Oc' }
                ].map((proj, idx) => (
                  <a
                    key={idx}
                    href={proj.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#090D16] border border-[#1E293B] hover:border-[#8B5CF6] text-xs text-[#F8FAFC] transition-colors"
                  >
                    <span>{proj.name}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#8B5CF6]" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* PTIT Bachelor's Degree */}
          <div className="p-6 rounded-2xl bg-[#131B2E] border border-[#1E293B] shadow-xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs text-[#94A3B8]">
                  {language === 'en' ? 'Final Grade: 8.29 / 10' : 'Điểm tốt nghiệp: 8.29 / 10'}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-[#F8FAFC] mt-0.5">
                  {language === 'en'
                    ? 'Bachelor of Technology (Information Technology)'
                    : 'Cử nhân Công nghệ Thông tin'}
                </h3>
                <p className="text-xs text-[#94A3B8]">
                  {language === 'en'
                    ? 'Posts and Telecommunications Institute of Technology (2013–2018)'
                    : 'Học viện Công nghệ Bưu chính Viễn thông (2013–2018)'}
                </p>
              </div>
              <span className="text-xs text-[#94A3B8]">Hanoi, Vietnam</span>
            </div>
            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
              {language === 'en'
                ? 'Developed interactive English grammar testing platforms with question databases and gamified feedback loops.'
                : 'Phát triển nền tảng trắc nghiệm ngữ pháp tiếng Anh tương tác với cơ sở dữ liệu câu hỏi và cơ chế gamification.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
