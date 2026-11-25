import React, { useState } from 'react';
import { Workflow, Terminal, GitBranch, ExternalLink, Layers, CheckCircle2, FileText } from 'lucide-react';
import { sound } from '../../constants/soundEffects';
import { LiveDioramaCard } from '../common/LiveDioramaCard';

interface AntiGravityShipyardZoneProps {
  language: 'en' | 'vi';
  onOpenEasterEgg: (snippetId: string) => void;
}

interface ProductionWorkflow {
  id: string;
  step: string;
  titleEn: string;
  titleVi: string;
  outcomeEn: string;
  outcomeVi: string;
  tools: string[];
  detailEn: string;
  detailVi: string;
}

const WORKFLOWS: ProductionWorkflow[] = [
  {
    id: 'wf-video',
    step: '01',
    titleEn: 'AI Video Factory',
    titleVi: 'Nhà Máy Video AI',
    outcomeEn: 'Lotus Media 1k → 72k+ Subs · 50+ Commercials',
    outcomeVi: 'Lotus Media 1k → 72k+ Sub · 50+ Video Thương Mại',
    tools: ['Veo 3', 'Kling AI', 'Hyperframes', 'Concat', 'Edge TTS'],
    detailEn:
      'Combines AI scene generation, Style-Lock character continuity, neural voice-over, and programmatic Hyperframes + Concat stitching for high-retention YouTube Shorts & 16:9 reels.',
    detailVi:
      'Kết hợp tạo cảnh AI, giữ nhất quán nhân vật Style-Lock, giọng đọc neural và ghép nối tự động Hyperframes + Concat cho video YouTube giữ chân cao.',
  },
  {
    id: 'wf-apps',
    step: '02',
    titleEn: 'Full-Stack AI Apps',
    titleVi: 'Ứng Dụng AI Full-Stack',
    outcomeEn: '16 Upgraded 2026 Dual-Mode GitHub Apps',
    outcomeVi: '16 Ứng Dụng AI Dual-Mode Chuẩn 2026',
    tools: ['Gemini API', 'React 19', 'TypeScript', 'Cloud Run'],
    detailEn:
      'Every creator, growth-ops, and language-dojo app ships with Instant Demo mode + BYOK Gemini API support, zero-friction UX, and production deployment on Vercel / Cloud Run.',
    detailVi:
      'Mỗi ứng dụng Creator Lab, Growth Ops và Language Dojo đều hỗ trợ chế độ Demo tức thì + BYOK Gemini API, triển khai trực tiếp trên Vercel / Cloud Run.',
  },
  {
    id: 'wf-games',
    step: '03',
    titleEn: 'Procedural 2.5D Games',
    titleVi: 'Game 2.5D Lập Trình Thuần',
    outcomeEn: 'Zero-Image Canvas Engines · Midnight Express & FFC',
    outcomeVi: 'Engine Canvas Không Dùng Ảnh · Midnight Express & FFC',
    tools: ['HTML5 Canvas', 'WebGL', 'Web Audio API', 'Procedural Rigging'],
    detailEn:
      'Characters, stadiums, isometric trains, and 35+ portfolio dioramas are synthesized live in code using procedural stickman rigging and native Web Audio — zero static sprite bloat.',
    detailVi:
      'Nhân vật, sân vận động, tàu hỏa 2.5D và hơn 35 mô hình đều được vẽ trực tiếp bằng code Canvas và tổng hợp âm thanh Web Audio theo thời gian thực.',
  },
  {
    id: 'wf-qa',
    step: '04',
    titleEn: 'Automated QA & Deploy',
    titleVi: 'Kiểm Thử & Triển Khai Tự Động',
    outcomeEn: 'Zero Page Errors · Cloudflare Pages & Vercel Ready',
    outcomeVi: '0 Lỗi Trang · Sẵn Sàng Cloudflare Pages & Vercel',
    tools: ['Playwright', 'TypeScript Strict', 'Vite', 'Cloudflare Pages'],
    detailEn:
      'Every build is verified end-to-end with strict tsc --noEmit, bundle budget checks (check_cf_limits.py), and headless Chrome visual + zero-scroll assertions.',
    detailVi:
      'Mỗi bản build đều được kiểm tra bằng TypeScript strict, kiểm soát dung lượng Cloudflare và kiểm thử giao diện tự động qua Playwright Chrome.',
  },
];

const STACK_GROUPS = [
  {
    titleEn: 'AI & Agentic Ops',
    titleVi: 'AI & Tự Động Hóa',
    color: '#38BDF8',
    items: ['Gemini 2.5/3.x', 'Antigravity IDE', 'Veo 3 · Kling', 'Edge TTS Neural'],
  },
  {
    titleEn: 'Video & Audio',
    titleVi: 'Video & Âm Thanh',
    color: '#F43F5E',
    items: ['Hyperframes', 'Concat Stitcher', 'Web Audio Synth', 'Kinetic Subtitles'],
  },
  {
    titleEn: 'Frontend & 2.5D Canvas',
    titleVi: 'Frontend & Canvas 2.5D',
    color: '#14B8A6',
    items: ['React 19', 'TypeScript', 'HTML5 Canvas', 'Three.js / WebGL'],
  },
  {
    titleEn: 'Cloud & QA',
    titleVi: 'Cloud & Kiểm Thử',
    color: '#10B981',
    items: ['Playwright', 'Vercel · Cloud Run', 'Cloudflare Pages', 'Python · Rust'],
  },
];

export const AntiGravityShipyardZone: React.FC<AntiGravityShipyardZoneProps> = ({
  language,
  onOpenEasterEgg,
}) => {
  const [selectedId, setSelectedId] = useState<string>('wf-video');
  const activeWf = WORKFLOWS.find((w) => w.id === selectedId) || WORKFLOWS[0];

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 overflow-hidden">
      {/* Compact Header */}
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-[#1E293B] pb-2">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-400/30 bg-sky-500/15 px-2.5 py-0.5 font-mono text-[10px] font-bold text-[#38BDF8]">
            <Workflow className="h-3 w-3" />
            <span>{language === 'en' ? 'PRODUCTION ARCHITECTURE' : 'KIẾN TRÚC SẢN XUẤT'}</span>
          </span>
          <h2 className="text-lg font-extrabold text-[#F8FAFC]">
            {language === 'en' ? 'AI Workflows & Engineering Stack' : 'Quy Trình AI & Hệ Sinh Thái Công Nghệ'}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onOpenEasterEgg('python-hyperframes')}
            className="flex items-center gap-1.5 rounded-xl border border-[#1E293B] bg-[#090D16] px-3 py-1.5 font-mono text-[11px] text-[#F8FAFC] transition hover:border-[#38BDF8]"
          >
            <Terminal className="h-3.5 w-3.5 text-[#38BDF8]" />
            <span>{language === 'en' ? 'Inspect Pipeline Code' : 'Xem Mã Pipeline'}</span>
          </button>

          <a
            href="https://github.com/MrLuke1618"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-xl bg-[#0284C7] px-3 py-1.5 text-[11px] font-bold text-white transition hover:bg-[#0369A1]"
          >
            <GitBranch className="h-3.5 w-3.5" />
            <span>GitHub @MrLuke1618</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>

      {/* Top Row: 3 Live Diorama Cards */}
      <div className="grid shrink-0 grid-cols-1 gap-3 md:grid-cols-3">
        {[
          {
            id: 'ship-hyperframes',
            title: 'Hyperframes + Concat',
            sub: 'Programmatic Video Pipelines',
            url: 'https://github.com/heygen-com/hyperframes',
            badge: 'VIDEO ENGINE',
          },
          {
            id: 'ship-portfolio',
            title: '2.5D Portfolio Engine',
            sub: 'React 19 · Canvas · Edge TTS',
            url: 'https://github.com/MrLuke1618/mrluke1618-portfolio-v2',
            badge: 'LIVE SOURCE',
          },
          {
            id: 'ship-concat',
            title: 'MrLuke1618 GitHub Hub',
            sub: '16+ Live Dual-Mode AI Apps',
            url: 'https://github.com/MrLuke1618',
            badge: 'GITHUB',
          },
        ].map((item, idx) => (
          <LiveDioramaCard
            key={item.title}
            indexLabel={String(idx + 1).padStart(2, '0')}
            title={item.title}
            subtitle={item.sub}
            sceneId={item.id}
            accent="#38BDF8"
            badge={item.badge}
            githubUrl={item.url}
            heightClass="h-28"
            onClick={() => window.open(item.url, '_blank', 'noopener,noreferrer')}
          />
        ))}
      </div>

      {/* Bottom Row: Zero-Scroll 12-Col Bento Split */}
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 overflow-hidden lg:grid-cols-12">
        {/* Left (7 cols): Interactive "How I Ship" 4-Stage Production Blueprint */}
        <div className="flex min-h-0 flex-col justify-between gap-2.5 overflow-hidden rounded-2xl border border-[#1E293B] bg-[#131B2E] p-3.5 lg:col-span-7">
          <div className="flex shrink-0 items-center justify-between">
            <span className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-[#38BDF8]">
              <Layers className="h-3.5 w-3.5" />
              <span>{language === 'en' ? 'HOW I SHIP · PRODUCTION WORKFLOWS' : 'QUY TRÌNH TRIỂN KHAI THỰC TẾ'}</span>
            </span>
            <span className="font-mono text-[10px] text-[#94A3B8]">
              {language === 'en' ? 'Click stage to inspect' : 'Chọn giai đoạn để xem'}
            </span>
          </div>

          <div className="grid shrink-0 grid-cols-2 gap-2">
            {WORKFLOWS.map((wf) => {
              const isSelected = wf.id === activeWf.id;
              return (
                <button
                  key={wf.id}
                  type="button"
                  onClick={() => {
                    setSelectedId(wf.id);
                    sound.playBip(720, 0.04);
                  }}
                  className={`rounded-xl border p-2.5 text-left transition ${
                    isSelected
                      ? 'border-[#38BDF8] bg-[#090D16] shadow-md shadow-sky-500/10'
                      : 'border-[#1E293B] bg-[#090D16]/60 hover:border-[#38BDF8]/50'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono text-[10px]">
                    <span className={isSelected ? 'font-bold text-[#38BDF8]' : 'text-[#94A3B8]'}>
                      WORKFLOW {wf.step}
                    </span>
                    {isSelected && <CheckCircle2 className="h-3 w-3 text-[#38BDF8]" />}
                  </div>
                  <div className="mt-0.5 truncate text-xs font-bold text-[#F8FAFC]">
                    {language === 'en' ? wf.titleEn : wf.titleVi}
                  </div>
                  <div className="mt-0.5 truncate text-[10px] text-[#38BDF8]/90">
                    {language === 'en' ? wf.outcomeEn : wf.outcomeVi}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex min-h-0 flex-1 flex-col justify-between rounded-xl border border-[#1E293B] bg-[#090D16] p-3">
            <div>
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-xs font-bold text-[#F8FAFC]">
                  {activeWf.step}. {language === 'en' ? activeWf.titleEn : activeWf.titleVi}
                </h4>
                <span className="font-mono text-[10px] text-[#38BDF8]">
                  {language === 'en' ? activeWf.outcomeEn : activeWf.outcomeVi}
                </span>
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-[#CBD5E1]">
                {language === 'en' ? activeWf.detailEn : activeWf.detailVi}
              </p>
            </div>

            <div className="mt-2 flex flex-wrap gap-1.5 border-t border-[#1E293B] pt-2">
              {activeWf.tools.map((t) => (
                <span
                  key={t}
                  className="rounded-md border border-sky-500/25 bg-sky-500/10 px-2 py-0.5 font-mono text-[10px] text-[#BAE6FD]"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right (5 cols): Production Tech Stack Matrix */}
        <div className="flex min-h-0 flex-col justify-between gap-2 overflow-hidden rounded-2xl border border-[#1E293B] bg-[#131B2E] p-3.5 lg:col-span-5">
          <div className="flex shrink-0 items-center justify-between border-b border-[#1E293B] pb-2">
            <span className="font-mono text-[11px] font-bold text-[#F8FAFC]">
              {language === 'en' ? 'PRODUCTION TECH STACK' : 'HỆ SINH THÁI CÔNG NGHỆ'}
            </span>
            <span className="font-mono text-[10px] text-[#38BDF8]">2026 READY</span>
          </div>

          <div className="grid min-h-0 flex-1 grid-cols-1 content-between gap-2">
            {STACK_GROUPS.map((grp) => (
              <div key={grp.titleEn} className="rounded-xl border border-[#1E293B] bg-[#090D16] p-2.5">
                <div className="mb-1.5 flex items-center gap-1.5 font-mono text-[10px] font-bold" style={{ color: grp.color }}>
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: grp.color }} />
                  <span>{language === 'en' ? grp.titleEn : grp.titleVi}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {grp.items.map((item) => (
                    <span
                      key={item}
                      className="rounded border border-[#1E293B] bg-[#131B2E] px-2 py-0.5 text-[10px] text-[#E2E8F0]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex shrink-0 items-center justify-between gap-2 border-t border-[#1E293B] pt-2">
            <a
              href="https://docs.google.com/document/d/1ZO9BMG0B3p7g_aXBwxDnV92xEyVCbmjk_HJZeSpGKYk/edit?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#1E293B] bg-[#090D16] px-2.5 py-1.5 text-[11px] font-semibold text-[#F8FAFC] transition hover:border-[#38BDF8]"
            >
              <FileText className="h-3.5 w-3.5 text-[#38BDF8]" />
              <span>{language === 'en' ? 'Master Portfolio Doc' : 'Hồ sơ Google Docs'}</span>
            </a>
            <a
              href="https://github.com/MrLuke1618"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1 rounded-xl bg-[#38BDF8]/15 px-3 py-1.5 text-[11px] font-bold text-[#38BDF8] transition hover:bg-[#38BDF8]/25"
            >
              <span>Repos</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
