import React, { useState } from 'react';
import { TradingCardItem } from '../../types/game';
import { TRADING_CARDS, QUEST_LOG_DATA } from '../../constants/gameData';
import { sound } from '../../constants/soundEffects';
import { KineticHeading } from '../common/KineticHeading';
import { 
  ExternalLink, 
  Compass, 
  Mail, 
  FileText, 
  Github, 
  Youtube, 
  ArrowUpRight,
  Layers,
  Cpu,
  Video,
  Code2,
  Terminal,
  Copy,
  Check
} from 'lucide-react';

interface CleanReaderViewProps {
  language: 'en' | 'vi';
  onOpenCard: (card: TradingCardItem) => void;
  onOpenEasterEgg: (snippetId: string) => void;
  onSwitchToGameMode: () => void;
}

export const CleanReaderView: React.FC<CleanReaderViewProps> = ({
  language,
  onOpenCard,
  onOpenEasterEgg,
  onSwitchToGameMode
}) => {
  const [filter, setFilter] = useState<'all' | 'video' | 'apps' | 'docs'>('all');
  const [copiedEmail, setCopiedEmail] = useState(false);

  const officialEmail = 'hoangcaominh27@gmail.com';

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(officialEmail);
      setCopiedEmail(true);
      sound.playLevelUp();
      setTimeout(() => setCopiedEmail(false), 2400);
    } catch {
      // Fallback
    }
  };

  const filteredCards = TRADING_CARDS.filter(card => {
    if (filter === 'all') return true;
    if (filter === 'video') return card.type === 'youtube';
    if (filter === 'apps') return card.type === 'demo';
    if (filter === 'docs') return card.type === 'doc' || card.type === 'drive';
    return true;
  });

  return (
    <div className="space-y-24">
      {/* 1. Human-First Hero Section */}
      <section id="about" className="relative pt-6 scroll-mt-24">
        <div className="rounded-3xl border border-[#1E293B] bg-[#131B2E] p-8 sm:p-12 lg:p-14 shadow-2xl">
          <div className="space-y-8">
            {/* Top Status & Fast Travel to Game Mode */}
            <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-[#94A3B8]">
              <div className="flex items-center gap-2">
                <span>{language === 'en' ? 'Available for Video, AI & Automation Projects' : 'Sẵn sàng hợp tác dự án Video, AI & Tự động hóa'}</span>
                <span aria-hidden="true">·</span>
                <span>Hanoi, Vietnam (UTC+7)</span>
              </div>

              <button
                onClick={onSwitchToGameMode}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#090D16] border border-[#1E293B] text-[#F8FAFC] hover:border-[#8B5CF6] transition-colors text-xs font-medium group"
              >
                <Compass className="w-3.5 h-3.5 text-[#8B5CF6] group-hover:rotate-45 transition-transform" />
                <span>{language === 'en' ? 'Launch 2.5D Game Mode' : 'Khám phá thế giới 2.5D'}</span>
                <span aria-hidden="true">→</span>
              </button>
            </div>

            {/* Main Editorial Headline with Kinetic Typography */}
            <div className="space-y-3">
              <div>
                <KineticHeading
                  as="h1"
                  text={language === 'en' ? 'Hoang Cao Minh' : 'Cao Minh Hoàng'}
                  className="text-4xl sm:text-6xl font-extrabold text-[#F8FAFC] tracking-tight"
                />
              </div>
              <p className="text-xl sm:text-2xl font-medium text-[#8B5CF6]">
                Video Editor <span className="text-[#1E293B]">/</span> News Editor <span className="text-[#1E293B]">/</span> AI Content Creator
              </p>
            </div>

            {/* Editorial Biography */}
            <p className="text-base sm:text-lg text-[#94A3B8] max-w-4xl leading-relaxed">
              {language === 'en' ? (
                <>
                  6+ years orchestrating digital storytelling and post-production, holding a Master’s Degree from{' '}
                  <span className="text-[#F8FAFC] font-semibold">Dublin City University (First-Class Honours, 2:1)</span>. 
                  Scaled YouTube audience from 1,000 to <span className="text-[#F59E0B] font-semibold">72,000 subscribers</span> at Lotus Media, 
                  directed corporate 4K videos, and engineered high-velocity automation pipelines combining{' '}
                  <span className="text-[#F8FAFC] font-semibold">Python</span>, video rendering tools, and high-performance{' '}
                  <span className="text-[#F8FAFC] font-semibold">Rust systems</span>.
                </>
              ) : (
                <>
                  Hơn 6 năm kinh nghiệm trong biên tập video đa phương tiện và sản xuất nội dung số, sở hữu bằng Thạc sĩ từ{' '}
                  <span className="text-[#F8FAFC] font-semibold">Đại học Dublin City (Loại Giỏi, 2:1)</span>. 
                  Từng tăng trưởng kênh YouTube từ 1.000 lên <span className="text-[#F59E0B] font-semibold">72.000 người đăng ký</span> tại Lotus Media, 
                  sản xuất video doanh nghiệp 4K và xây dựng các quy trình tự động hóa sản xuất video kết hợp{' '}
                  <span className="text-[#F8FAFC] font-semibold">Python</span> cùng hệ thống{' '}
                  <span className="text-[#F8FAFC] font-semibold">Rust</span>.
                </>
              )}
            </p>

            {/* Verified Metrics Strip - Accent Gold Reserved Strictly for Verified Milestones */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-6 border-t border-[#1E293B]">
              <div>
                <div className="text-3xl sm:text-4xl font-extrabold text-[#F59E0B] tabular-nums">72,000+</div>
                <div className="text-xs text-[#94A3B8] mt-1">Lotus Media Subscribers</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-extrabold text-[#F59E0B]">MA Honours</div>
                <div className="text-xs text-[#94A3B8] mt-1">Dublin City University</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-extrabold text-[#F8FAFC] tabular-nums">6+ Years</div>
                <div className="text-xs text-[#94A3B8] mt-1">Video Post-Production</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-extrabold text-[#F8FAFC] tabular-nums">1,000+</div>
                <div className="text-xs text-[#94A3B8] mt-1">Published Tech & Crypto Articles</div>
              </div>
            </div>

            {/* Action Bar with Real Email Dispatch & Sandbox Bypass Copy */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href={`mailto:${officialEmail}`}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-medium text-xs sm:text-sm transition-colors shadow-md shadow-[#8B5CF6]/20"
              >
                <Mail className="w-4 h-4" />
                <span>{language === 'en' ? 'Get In Touch' : 'Gửi Email Hợp Tác'}</span>
              </a>

              <button
                onClick={handleCopyEmail}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#090D16] hover:bg-[#1A243D] text-[#F8FAFC] font-medium text-xs sm:text-sm transition-colors border border-[#1E293B]"
                title="Copy email to clipboard"
              >
                {copiedEmail ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-[#8B5CF6]" />}
                <span>{copiedEmail ? (language === 'en' ? 'Email Copied!' : 'Đã sao chép email!') : officialEmail}</span>
              </button>

              <a
                href="https://docs.google.com/document/d/1ZO9BMG0B3p7g_aXBwxDnV92xEyVCbmjk_HJZeSpGKYk/edit?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#090D16] hover:bg-[#1A243D] text-[#F8FAFC] font-medium text-xs sm:text-sm transition-colors border border-[#1E293B]"
              >
                <FileText className="w-4 h-4 text-[#8B5CF6]" />
                <span>{language === 'en' ? 'Portfolio Dossier' : 'Hồ sơ năng lực (Doc)'}</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#94A3B8]" />
              </a>

              <a
                href="https://github.com/MrLuke1618"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#090D16] hover:bg-[#1A243D] text-[#94A3B8] hover:text-[#F8FAFC] font-medium text-xs sm:text-sm transition-colors border border-[#1E293B]"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>

              <a
                href="https://www.youtube.com/playlist?list=PL8l48rFpYhhaFUDxydFt2tTY55rpb9rWi"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#090D16] hover:bg-[#1A243D] text-[#94A3B8] hover:text-[#F8FAFC] font-medium text-xs sm:text-sm transition-colors border border-[#1E293B]"
              >
                <Youtube className="w-4 h-4" />
                <span>YouTube Reel</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Works Bento Grid */}
      <section id="featured-works" className="space-y-8 scroll-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <KineticHeading
              as="h2"
              text={language === 'en' ? 'Featured Works & Original Creations' : 'Dự án & Sản phẩm Tiêu biểu'}
              className="text-2xl sm:text-3xl font-bold text-[#F8FAFC] tracking-tight"
            />
            <p className="text-sm text-[#94A3B8] mt-1.5">
              {language === 'en'
                ? 'Curated interactive applications, video showreels, and verified case studies.'
                : 'Các ứng dụng tương tác, video showcase và hồ sơ nghiên cứu thực tế.'}
            </p>
          </div>

          {/* Interactive Category Filter Tabs */}
          <div className="flex items-center gap-1 p-1 bg-[#131B2E] border border-[#1E293B] rounded-xl self-start sm:self-auto">
            <button
              onClick={() => {
                setFilter('all');
                sound.playBip(700, 0.03);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === 'all' ? 'bg-[#8B5CF6] text-white' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              {language === 'en' ? 'All Works' : 'Tất cả'}
            </button>
            <button
              onClick={() => {
                setFilter('apps');
                sound.playBip(700, 0.03);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === 'apps' ? 'bg-[#8B5CF6] text-white' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              {language === 'en' ? 'Web & AI Apps' : 'Ứng dụng AI'}
            </button>
            <button
              onClick={() => {
                setFilter('video');
                sound.playBip(700, 0.03);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === 'video' ? 'bg-[#8B5CF6] text-white' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              {language === 'en' ? 'Cinematic Video' : 'Video điện ảnh'}
            </button>
            <button
              onClick={() => {
                setFilter('docs');
                sound.playBip(700, 0.03);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === 'docs' ? 'bg-[#8B5CF6] text-white' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              {language === 'en' ? 'Documents & Vaults' : 'Tài liệu & Hồ sơ'}
            </button>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCards.map((card) => (
            <div
              key={card.id}
              onClick={() => onOpenCard(card)}
              className="group cursor-pointer rounded-2xl border border-[#1E293B] bg-[#131B2E] hover:border-[#8B5CF6] p-6 transition-all duration-200 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-[#94A3B8]">
                  <span className="text-[#8B5CF6] font-medium">
                    {language === 'en' ? card.categoryEn : card.categoryVi}
                  </span>
                  <span>{card.readTimeEstimate}</span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-[#F8FAFC] group-hover:text-[#8B5CF6] transition-colors flex items-center justify-between gap-2">
                    <span>{card.title}</span>
                    <ArrowUpRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#8B5CF6] transition-colors shrink-0" />
                  </h3>
                  <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed line-clamp-3">
                    {language === 'en' ? card.descriptionEn : card.descriptionVi}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-[#1E293B] flex flex-wrap items-center gap-2 text-[11px] text-[#94A3B8]">
                {card.tags.slice(0, 3).map((tag, idx) => (
                  <span key={idx} className="after:content-['·'] after:ml-2 last:after:content-none">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Career Timeline & Milestones */}
      <section id="experience" className="space-y-8 scroll-mt-20">
        <div>
          <KineticHeading
            as="h2"
            text={language === 'en' ? 'Career & Professional Milestones' : 'Kinh nghiệm & Dấu ấn Sự nghiệp'}
            className="text-2xl sm:text-3xl font-bold text-[#F8FAFC] tracking-tight"
          />
          <p className="text-sm text-[#94A3B8] mt-1.5">
            {language === 'en'
              ? 'Proven track record in high-retention video post-production, digital media growth, and AI tooling.'
              : 'Thành tích đã được chứng thực trong sản xuất video giữ chân người xem, tăng trưởng kênh và xây dựng công cụ AI.'}
          </p>
        </div>

        <div className="space-y-4">
          {QUEST_LOG_DATA.map((quest) => (
            <div
              key={quest.id}
              className="rounded-2xl border border-[#1E293B] bg-[#131B2E] p-6 sm:p-8 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1E293B] pb-4">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#F8FAFC]">
                    {quest.role}
                  </h3>
                  <div className="text-xs sm:text-sm text-[#94A3B8] mt-0.5">
                    {quest.company}
                  </div>
                </div>

                <div className="text-xs text-[#94A3B8] font-mono">
                  {quest.period}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                {language === 'en' ? quest.summaryEn : quest.summaryVi}
              </p>

              <div className="space-y-2 pt-2">
                {quest.achievements.map((ach, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#94A3B8]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] mt-2 shrink-0" />
                    <span>{ach}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Technical Superpowers */}
      <section id="superpowers" className="space-y-8 scroll-mt-20">
        <div>
          <KineticHeading
            as="h2"
            text={language === 'en' ? 'Core Technical Superpowers' : 'Năng lực Kỹ thuật Cốt lõi'}
            className="text-2xl sm:text-3xl font-bold text-[#F8FAFC] tracking-tight"
          />
          <p className="text-sm text-[#94A3B8] mt-1.5">
            {language === 'en'
              ? 'Cross-disciplinary expertise bridging cinematic video production with software engineering.'
              : 'Sự kết hợp đa ngành giữa nghệ thuật hậu kỳ điện ảnh và kỹ thuật phần mềm hiện đại.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-[#1E293B] bg-[#131B2E] p-6 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-[#090D16] border border-[#1E293B] flex items-center justify-center text-[#8B5CF6]">
              <Video className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-[#F8FAFC]">
                {language === 'en' ? 'Automated Video Pipelines' : 'Quy trình Sản xuất Video Tự động'}
              </h3>
              <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                {language === 'en'
                  ? 'Python toolchains orchestrating code-rendered 9:16 scenes via Hyperframes and seamless multi-scene stitching via concat for automated daily publishing pipelines.'
                  : 'Xây dựng toolchain Python tự động hóa kết xuất các cảnh 9:16 lập trình được qua Hyperframes và tự động ghép nối mượt mà qua concat cho luồng xuất bản hàng ngày.'}
              </p>
              <div className="flex items-center gap-4 pt-2">
                <button
                  onClick={() => {
                    onOpenEasterEgg('python-hyperframes');
                    sound.playTeleport();
                  }}
                  className="inline-flex items-center gap-1.5 text-xs text-[#8B5CF6] hover:underline font-mono"
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>{language === 'en' ? 'Inspect Pipeline Script' : 'Xem mã pipeline'} →</span>
                </button>
                <button
                  onClick={onSwitchToGameMode}
                  className="inline-flex items-center gap-1 text-xs text-[#94A3B8] hover:text-[#F8FAFC]"
                >
                  <span>{language === 'en' ? 'Launch Simulator in Vault' : 'Mở Trình Giả Lập'} →</span>
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#1E293B] bg-[#131B2E] p-6 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-[#090D16] border border-[#1E293B] flex items-center justify-center text-[#8B5CF6]">
              <Cpu className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-[#F8FAFC]">
                {language === 'en' ? 'Rust Systems & Reverse Engineering' : 'Lập trình Hệ thống Rust & Dịch ngược Mã'}
              </h3>
              <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                {language === 'en'
                  ? 'Memory-safe binary pattern scanning, zero-allocation byte signature matching, CLI toolchain development, and low-level performance profiling.'
                  : 'Quét mẫu nhị phân an toàn bộ nhớ trong Rust, bắt chữ ký byte không cấp phát thêm bộ nhớ, xây dựng công cụ dòng lệnh (CLI) và tối ưu hiệu năng chuyên sâu.'}
              </p>
              <button
                onClick={() => {
                  onOpenEasterEgg('rust-modder');
                  sound.playTeleport();
                }}
                className="inline-flex items-center gap-1.5 pt-2 text-xs text-[#8B5CF6] hover:underline font-mono"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>{language === 'en' ? 'Inspect Rust Crate' : 'Xem mã nguồn Rust'} →</span>
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-[#1E293B] bg-[#131B2E] p-6 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-[#090D16] border border-[#1E293B] flex items-center justify-center text-[#8B5CF6]">
              <Code2 className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-[#F8FAFC]">
                {language === 'en' ? 'Full-Stack Web & 3D Graphics' : 'Phát triển Web Toàn diện & Đồ họa 3D'}
              </h3>
              <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                {language === 'en'
                  ? 'Production React 19, TypeScript, Tailwind CSS, Three.js hardware-accelerated shaders, and Web Audio API procedural synthesis.'
                  : 'Phát triển ứng dụng hiện đại với React 19, TypeScript, Three.js tăng tốc phần cứng, shader và tổng hợp âm thanh bằng Web Audio API.'}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-[#1E293B] bg-[#131B2E] p-6 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-[#090D16] border border-[#1E293B] flex items-center justify-center text-[#8B5CF6]">
              <Layers className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-[#F8FAFC]">
                {language === 'en' ? 'Audience Growth & E-Commerce Loops' : 'Tăng trưởng Khán giả & Vòng lặp E-Commerce'}
              </h3>
              <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                {language === 'en'
                  ? 'Data-informed creative direction, viral retention curves, algorithmic hooks, and automated review analysis for Shopify growth.'
                  : 'Định hướng sáng tạo dựa trên dữ liệu, đường cong giữ chân người xem, tối ưu hook thuật toán và tự động phân tích đánh giá khách hàng Shopify.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Contact & Collaboration */}
      <section id="contact" className="rounded-3xl border border-[#1E293B] bg-[#131B2E] p-8 sm:p-12 scroll-mt-20 shadow-2xl">
        <div className="max-w-2xl space-y-4">
          <KineticHeading
            as="h2"
            text={language === 'en' ? 'Let’s Build Together' : 'Bắt đầu Hợp tác Dự án'}
            className="text-2xl sm:text-3xl font-bold text-[#F8FAFC] tracking-tight"
          />
          <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed">
            {language === 'en'
              ? 'Available for video editing direction, AI content automation toolchains, and bespoke creative projects. Reach out directly for collaboration.'
              : 'Sẵn sàng tham gia các dự án biên tập video chiến lược, xây dựng công cụ tự động hóa nội dung AI và các sản phẩm sáng tạo độc đáo.'}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <a
              href={`mailto:${officialEmail}`}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-medium text-xs sm:text-sm transition-colors shadow-md shadow-[#8B5CF6]/20"
            >
              <Mail className="w-4 h-4" />
              <span>{officialEmail}</span>
            </a>

            <button
              onClick={handleCopyEmail}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#090D16] border border-[#1E293B] hover:border-[#8B5CF6] text-[#F8FAFC] font-medium text-xs sm:text-sm transition-colors"
            >
              {copiedEmail ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-[#8B5CF6]" />}
              <span>{copiedEmail ? (language === 'en' ? 'Copied!' : 'Đã sao chép!') : (language === 'en' ? 'Copy Address' : 'Sao chép')}</span>
            </button>

            <a
              href="https://docs.google.com/document/d/1ZO9BMG0B3p7g_aXBwxDnV92xEyVCbmjk_HJZeSpGKYk/edit?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#090D16] border border-[#1E293B] hover:border-[#8B5CF6] text-[#F8FAFC] font-medium text-xs sm:text-sm transition-colors"
            >
              <FileText className="w-4 h-4 text-[#8B5CF6]" />
              <span>{language === 'en' ? 'Open Portfolio Document' : 'Mở Hồ sơ Năng lực'}</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
