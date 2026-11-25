import React, { useState } from 'react';
import { TradingCardItem } from '../../types/game';
import { QUEST_LOG_DATA, SKILL_TREE_DATA } from '../../constants/gameData';
import { sound } from '../../constants/soundEffects';
import { GraduationCap, Award, GitBranch, ArrowUpRight, ShieldCheck, X } from 'lucide-react';
import { LiveDioramaCard } from '../common/LiveDioramaCard';
import certificatesData from '../../data/certificates.json';

interface CertificateItem {
  id: string;
  titleEn: string;
  titleVi: string;
  issuer: string;
  date: string;
  category: string;
  highlightEn: string;
  highlightVi: string;
  imagePath?: string;
  verifyUrl?: string;
}

const CERTIFICATES = certificatesData as CertificateItem[];

interface AcademyTowerZoneProps {
  onOpenCard?: (card: TradingCardItem) => void;
  language: 'en' | 'vi';
}

export const AcademyTowerZone: React.FC<AcademyTowerZoneProps> = ({
  onOpenCard: _onOpenCard,
  language
}) => {
  const [tab, setTab] = useState<'questlog' | 'certificates' | 'skilltree' | 'education'>('questlog');
  const [selectedQuestId, setSelectedQuestId] = useState<string>(QUEST_LOG_DATA[0]?.id || 'quest-chuyen');
  const [selectedCert, setSelectedCert] = useState<CertificateItem | null>(null);

  const summaryText = language === 'en'
    ? "Hello, I'm Hoang. With 6+ years in multimedia production, I automate end-to-end content pipelines (programmatic video rendering, AI voice synthesis, and multi-platform workflows) and create playable video games with AI—from narrative engines like Midnight Express and Football: Fantastic FCs to interactive WebGL and Canvas worlds."
    : "Xin chào, tôi là Hoàng. Với hơn 6 năm kinh nghiệm sản xuất đa phương tiện, tôi chuyên tự động hóa quy trình sản xuất nội dung trọn gói (render video lập trình, tổng hợp giọng nói AI, quy trình đa nền tảng) và sáng tạo game bằng AI—từ các tựa game cốt truyện như Midnight Express, Football: Fantastic FCs đến thế giới WebGL và Canvas tương tác.";

  const activeQuest = QUEST_LOG_DATA.find((q) => q.id === selectedQuestId) || QUEST_LOG_DATA[0];

  const tabs: Array<{ id: 'questlog' | 'certificates' | 'skilltree' | 'education'; icon: React.ReactNode; en: string; vi: string }> = [
    { id: 'questlog', icon: <Award className="h-3.5 w-3.5" />, en: 'Career Quests', vi: 'Sự nghiệp' },
    { id: 'certificates', icon: <ShieldCheck className="h-3.5 w-3.5" />, en: `Certificates (${CERTIFICATES.length})`, vi: `Chứng chỉ (${CERTIFICATES.length})` },
    { id: 'skilltree', icon: <GitBranch className="h-3.5 w-3.5" />, en: 'Skill Tree', vi: 'Kỹ năng' },
    { id: 'education', icon: <GraduationCap className="h-3.5 w-3.5" />, en: 'Education', vi: 'Học vấn' },
  ];

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      {/* Compact Header & 4-Tab Bar */}
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-[#1E293B] pb-2.5">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-1 font-mono text-[10px] font-bold text-[#34D399]">
            <GraduationCap className="h-3 w-3" />
            {language === 'en' ? 'MA HONOURS · GRADE 1' : 'THẠC SĨ DCU · LOẠI GIỎI'}
          </div>
          <h2 className="text-lg font-extrabold text-white">
            {language === 'en' ? 'Career, Degrees & Certificates' : 'Sự Nghiệp, Học Vị & Chứng Chỉ'}
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-1 rounded-xl border border-[#1E293B] bg-[#090D16] p-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setTab(t.id);
                sound.playBip(650, 0.04);
              }}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${
                tab === t.id ? 'bg-[#8B5CF6] text-white' : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              {t.icon}
              <span>{language === 'en' ? t.en : t.vi}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Certificates 3x2 Zero-Scroll Bento Grid */}
      {tab === 'certificates' && (
        <div className="grid min-h-0 flex-1 grid-cols-1 content-start gap-3 md:grid-cols-2 lg:grid-cols-3">
          {CERTIFICATES.map((cert, idx) => {
            const sceneMap: Record<string, string> = {
              'dcu-msc': 'cert-dcu',
              'ielts-academic': 'cert-ielts',
              'toeic-960': 'cert-toeic',
              'work-portfolio-doc': 'cert-doc',
              'video-showcase-drive': 'cert-reel',
              'chuyen-ai-media': 'cert-chuyen',
            };
            const sceneId = sceneMap[cert.id] || 'cert-dcu';
            return (
              <LiveDioramaCard
                key={cert.id}
                indexLabel={String(idx + 1).padStart(2, '0')}
                title={language === 'en' ? cert.titleEn : cert.titleVi}
                subtitle={`${cert.issuer} · ${cert.date}`}
                sceneId={sceneId}
                accent="#34D399"
                badge={cert.category}
                liveUrl={cert.verifyUrl}
                heightClass="h-28"
                onClick={() => {
                  sound.playBip(780, 0.05);
                  setSelectedCert(cert);
                }}
              />
            );
          })}
        </div>
      )}

      {/* Tab 1: Career Quest Log (Master-Detail Bento Split, Zero Scroll) */}
      {tab === 'questlog' && activeQuest && (
        <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 overflow-hidden lg:grid-cols-12">
          <div className="flex min-h-0 flex-col justify-between gap-2 overflow-hidden lg:col-span-5">
            {QUEST_LOG_DATA.map((quest) => {
              const selected = quest.id === activeQuest.id;
              return (
                <button
                  key={quest.id}
                  type="button"
                  onClick={() => {
                    setSelectedQuestId(quest.id);
                    sound.playTerminalClick();
                  }}
                  className={`rounded-xl border p-2.5 text-left transition ${
                    selected
                      ? 'border-[#8B5CF6] bg-[#131B2E] shadow-lg'
                      : 'border-[#1E293B] bg-[#0F172A]/70 hover:border-[#8B5CF6]/50'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-[#94A3B8]">
                    <span>{language === 'en' ? quest.period : (quest.periodVi || quest.period)}</span>
                    <span className="font-semibold text-[#A78BFA]">{quest.questRank}</span>
                  </div>
                  <div className="mt-0.5 text-xs font-bold text-[#F8FAFC] line-clamp-1">
                    {language === 'en' ? quest.role : (quest.roleVi || quest.role)}
                  </div>
                  <div className="text-[11px] text-[#94A3B8] line-clamp-1">{quest.company}</div>
                </button>
              );
            })}
          </div>

          <div className="flex min-h-0 flex-col justify-between overflow-hidden rounded-2xl border border-[#1E293B] bg-[#131B2E] p-4 lg:col-span-7">
            <div className="space-y-3">
              <div>
                <div className="flex items-center gap-2 text-xs text-[#A78BFA]">
                  <span>{language === 'en' ? activeQuest.period : (activeQuest.periodVi || activeQuest.period)}</span>
                  <span>·</span>
                  <span>{activeQuest.company}</span>
                </div>
                <h3 className="mt-0.5 text-lg font-bold text-white">
                  {language === 'en' ? activeQuest.role : (activeQuest.roleVi || activeQuest.role)}
                </h3>
              </div>

              <p className="text-xs leading-relaxed text-[#CBD5E1]">
                {language === 'en' ? activeQuest.summaryEn : activeQuest.summaryVi}
              </p>

              <div className="space-y-1.5 border-t border-[#1E293B] pt-2.5">
                {activeQuest.achievements.map((ach, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-[#94A3B8]">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#8B5CF6]" />
                    <span>{language === 'en' ? ach : (activeQuest.achievementsVi?.[idx] || ach)}</span>
                  </div>
                ))}
              </div>
            </div>

            {activeQuest.lootLinks && (
              <div className="mt-3 flex flex-wrap gap-2 border-t border-[#1E293B] pt-3">
                {activeQuest.lootLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#1E293B] bg-[#090D16] px-2.5 py-1 text-[11px] text-[#F8FAFC] transition hover:border-[#8B5CF6]"
                  >
                    <span>{link.name}</span>
                    <ArrowUpRight className="h-3 w-3 text-[#8B5CF6]" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Skill Tree (4x3 Zero-Scroll Bento Grid) */}
      {tab === 'skilltree' && (
        <div className="grid min-h-0 flex-1 grid-cols-2 content-stretch gap-2.5 overflow-hidden lg:grid-cols-4">
          {SKILL_TREE_DATA.map((node) => (
            <div
              key={node.id}
              className="flex min-h-0 flex-col justify-between rounded-2xl border border-[#1E293B] bg-[#131B2E] p-2.5 transition hover:border-[#8B5CF6]"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h4 className="line-clamp-2 text-xs font-bold text-[#F8FAFC]">{node.name}</h4>
                  <span className="shrink-0 font-mono text-xs font-bold text-[#34D399]">{node.masteryPercent}%</span>
                </div>
                <div className="mt-0.5 text-[10px] font-medium text-[#8B5CF6]">
                  {language === 'en' ? node.level : node.levelVi}
                </div>
              </div>

              <div className="my-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[#090D16]">
                <div
                  className="h-1.5 rounded-full bg-[#8B5CF6]"
                  style={{ width: `${node.masteryPercent}%` }}
                />
              </div>

              <p className="line-clamp-2 text-[11px] leading-snug text-[#94A3B8]">
                {language === 'en' ? node.descriptionEn : node.descriptionVi}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Education & Summary Bento Split (Zero Scroll) */}
      {tab === 'education' && (
        <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 overflow-hidden lg:grid-cols-2">
          {/* DCU Master's Degree */}
          <div className="flex flex-col justify-between space-y-3 rounded-2xl border border-[#1E293B] bg-[#131B2E] p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-semibold text-[#F59E0B]">
                  {language === 'en' ? 'FIRST CLASS HONOURS (2:1)' : 'TỐT NGHIỆP LOẠI GIỎI (2:1)'}
                </span>
                <span className="text-[11px] text-[#94A3B8]">Dublin, Ireland</span>
              </div>
              <h3 className="text-base font-bold text-[#F8FAFC]">
                {language === 'en'
                  ? 'Master’s Degree in Communication and Media Studies'
                  : 'Thạc sĩ Truyền thông & Nghiên cứu Đa phương tiện'}
              </h3>
              <p className="text-xs text-[#94A3B8]">
                {language === 'en' ? 'Dublin City University (2024–2025)' : 'Đại học Dublin City, Ireland (2024–2025)'}
              </p>
              <p className="text-xs leading-relaxed text-[#94A3B8]">
                <strong>{language === 'en' ? 'Core Modules: ' : 'Môn học trọng tâm: '}</strong>
                {language === 'en'
                  ? 'Audio & Sonic Design, Moving Image & Video Production, Visual Design, Responsive Media, Screenwriting, Project Planning & Management, Major Project.'
                  : 'Thiết kế Âm thanh & Sonic, Sản xuất Video & Hình ảnh Động, Thiết kế Thị giác, Truyền thông Tương tác, Biên kịch, Quản trị Dự án, Đồ án Tốt nghiệp.'}
              </p>
            </div>

            <div className="border-t border-[#1E293B] pt-2.5">
              <div className="mb-1.5 text-[11px] font-semibold text-[#F8FAFC]">
                {language === 'en' ? 'DCU Master’s Artifacts & Major Project:' : 'Dự án Tốt nghiệp DCU:'}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { name: 'The Sailboat (WebGL)', url: 'https://mrluke1618.github.io/Major-Project-WebGL' },
                  { name: 'Stories Of The Liberties', url: 'https://minhhoangcaodcu.wordpress.com/2024/12/05/stories-of-the-liberties' },
                  { name: 'Visual Asset Archive', url: 'https://drive.google.com/drive/folders/1ongFDTY1WamiKPnmdiLkW2Q-zz_6jQuv' },
                  { name: 'The Post (Unity App)', url: 'https://www.youtube.com/watch?v=M3MkM_OE3Oc' }
                ].map((proj, idx) => (
                  <a
                    key={idx}
                    href={proj.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-lg border border-[#1E293B] bg-[#090D16] px-2.5 py-1 text-[11px] text-[#F8FAFC] transition hover:border-[#8B5CF6]"
                  >
                    <span>{proj.name}</span>
                    <ArrowUpRight className="h-3 w-3 text-[#8B5CF6]" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* PTIT Bachelor's + Summary */}
          <div className="flex flex-col justify-between gap-3">
            <div className="space-y-2 rounded-2xl border border-[#1E293B] bg-[#131B2E] p-4">
              <div className="flex items-center justify-between text-[11px] text-[#94A3B8]">
                <span>{language === 'en' ? 'Final Grade: 8.29 / 10' : 'Điểm tốt nghiệp: 8.29 / 10'}</span>
                <span>Hanoi, Vietnam</span>
              </div>
              <h3 className="text-base font-bold text-[#F8FAFC]">
                {language === 'en'
                  ? 'Bachelor of Technology (Information Technology)'
                  : 'Cử nhân Công nghệ Thông tin'}
              </h3>
              <p className="text-xs text-[#94A3B8]">
                {language === 'en'
                  ? 'Posts and Telecommunications Institute of Technology (2013–2018)'
                  : 'Học viện Công nghệ Bưu chính Viễn thông (2013–2018)'}
              </p>
              <p className="text-xs leading-relaxed text-[#94A3B8]">
                {language === 'en'
                  ? 'Developed interactive English grammar testing platforms with question databases and gamified feedback loops.'
                  : 'Phát triển nền tảng trắc nghiệm ngữ pháp tiếng Anh tương tác với cơ sở dữ liệu câu hỏi và cơ chế gamification.'}
              </p>
            </div>

            <div className="rounded-2xl border border-[#1E293B] bg-[#131B2E] p-4">
              <div className="mb-1.5 text-xs font-bold text-[#A78BFA]">
                {language === 'en' ? 'Professional Summary' : 'Tổng quan Chuyên môn'}
              </div>
              <p className="text-xs leading-relaxed text-[#CBD5E1]">{summaryText}</p>
            </div>
          </div>
        </div>
      )}

      {/* Certificate Zoom Lightbox */}
      {selectedCert && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setSelectedCert(null)}
        >
          <div
            className="relative w-full max-w-lg rounded-2xl border border-[#34D399]/60 bg-[#0B101B] p-6 text-[#F8FAFC] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedCert(null)}
              aria-label="Close certificate"
              className="absolute right-4 top-4 rounded-lg border border-white/10 p-1.5 text-[#94A3B8] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="font-mono text-[11px] uppercase text-[#34D399]">{selectedCert.category} · {selectedCert.date}</div>
            <h4 className="mt-1 text-xl font-extrabold text-white">
              {language === 'en' ? selectedCert.titleEn : selectedCert.titleVi}
            </h4>
            <p className="text-xs text-[#94A3B8]">{selectedCert.issuer}</p>
            {selectedCert.imagePath ? (
              <img
                src={selectedCert.imagePath}
                alt={selectedCert.titleEn}
                className="mt-4 w-full rounded-xl border border-white/10 object-contain max-h-72"
              />
            ) : (
              <div className="mt-4 rounded-xl border border-[#34D399]/30 bg-[#131B2E] p-5 text-center">
                <Award className="mx-auto h-10 w-10 text-[#34D399]" />
                <p className="mt-2 text-xs text-[#CBD5E1]">
                  {language === 'en' ? selectedCert.highlightEn : selectedCert.highlightVi}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
