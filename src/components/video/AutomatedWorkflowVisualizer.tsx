import React, { useState } from 'react';
import { Workflow, CheckCircle2, ChevronRight, Terminal, ExternalLink, Copy, Check, Youtube } from 'lucide-react';
import { sound } from '../../constants/soundEffects';

interface AutomatedWorkflowVisualizerProps {
  language: 'en' | 'vi';
  onOpenEasterEgg: (snippetId: string) => void;
}

interface WorkflowStep {
  id: string;
  number: string;
  titleEn: string;
  titleVi: string;
  techStack: string;
  repoUrl?: string;
  repoName?: string;
  descriptionEn: string;
  descriptionVi: string;
  codeSnippet: string;
  benchmark: string;
}

const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    id: 'step1',
    number: '01',
    titleEn: 'Structured Script & Beat Engine',
    titleVi: 'Cấu Trúc Kịch Bản & Điểm Nhịp',
    techStack: 'Python 3.11 · Pydantic · JSON',
    descriptionEn: 'Decomposes scripts into timecoded visual markers, sound cues, and retention targets.',
    descriptionVi: 'Phân rã kịch bản thành các mốc thời gian, điểm nhấn âm thanh và vị trí giữ chân.',
    codeSnippet: `class StoryBeat(BaseModel):
    timestamp_ms: int
    visual_anchor: str
    typography_motion: Literal["mrbeast_pop", "trailer_slam"]
    audio_ducking_db: float = -6.0`,
    benchmark: '0.12s parse',
  },
  {
    id: 'step2',
    number: '02',
    titleEn: 'Hyperframes Keyframe Synth',
    titleVi: 'Tổng Hợp Khung Hình Hyperframes',
    techStack: 'TypeScript · CSS Canvas Matrix',
    repoUrl: 'https://github.com/heygen-com/hyperframes',
    repoName: 'heygen-com/hyperframes',
    descriptionEn: 'Programmatic canvas-based motion keyframing compiled into exact 60fps frame buffers.',
    descriptionVi: 'Khung hình chuyển động trên canvas biên dịch thành bộ đệm 60fps chuẩn xác.',
    codeSnippet: `import { compose } from '@heygen/hyperframes';
const comp = compose({
  fps: 60,
  dimensions: { width: 1080, height: 1920 },
  tracks: [{ type: 'typography', motion: 'mrbeast_pop' }]
});`,
    benchmark: '60fps locked',
  },
  {
    id: 'step3',
    number: '03',
    titleEn: 'Python Asset Orchestrator',
    titleVi: 'Điều Phối Tài Nguyên Python',
    techStack: 'Python 3.11 · AsyncIO · Watchdog',
    descriptionEn: 'Asynchronously fetches high-bitrate media and compiles optimized FFmpeg filtergraphs.',
    descriptionVi: 'Tải media bitrate cao bất đồng bộ và biên dịch đồ thị FFmpeg tối ưu.',
    codeSnippet: `async def build_render_graph(beats: List[StoryBeat]):
    tasks = [render_segment(b) for b in beats]
    segments = await asyncio.gather(*tasks)
    return generate_concat_manifest(segments)`,
    benchmark: '8.4x faster',
  },
  {
    id: 'step4',
    number: '04',
    titleEn: 'Lossless Concat & Mastering',
    titleVi: 'Ghép Nối Lossless Concat',
    techStack: 'FFmpeg · Concat · -14 LUFS',
    repoUrl: 'https://github.com/jub0t/concat',
    repoName: 'jub0t/concat',
    descriptionEn: 'Stitches finished segments with zero re-encoding loss and -14 LUFS loudness mastering.',
    descriptionVi: 'Ghép nối phân cảnh không suy hao với cân bằng âm lượng -14 LUFS.',
    codeSnippet: `concat -i render_manifest.txt -o final_master.mp4 \\
  --crf 18 --audio-duck -12dB --normalize-lufs -14`,
    benchmark: 'Zero drop',
  },
];

const PLAYLISTS = [
  {
    id: 'pl1',
    labelEn: 'AI Video Playlist #1',
    labelVi: 'Playlist Video AI #1',
    embedUrl: 'https://www.youtube.com/embed/p_pr8RI3T-c?list=PL8l48rFpYhhaFUDxydFt2tTY55rpb9rWi&rel=0&modestbranding=1',
    url: 'https://www.youtube.com/playlist?list=PL8l48rFpYhhaFUDxydFt2tTY55rpb9rWi',
  },
  {
    id: 'pl2',
    labelEn: 'HTML Video Short #2',
    labelVi: 'Video Ngắn HTML #2',
    embedUrl: 'https://www.youtube.com/embed/SfQYA6_Maw4?rel=0&modestbranding=1',
    url: 'https://www.youtube.com/shorts/SfQYA6_Maw4',
  },
  {
    id: 'pl3',
    labelEn: 'Playground Games',
    labelVi: 'Game Playground',
    embedUrl: 'https://www.youtube.com/embed/videoseries?list=PLFGWt830Li18&rel=0&modestbranding=1',
    url: 'https://www.youtube.com/playlist?list=PLFGWt830Li18',
  },
];

export const AutomatedWorkflowVisualizer: React.FC<AutomatedWorkflowVisualizerProps> = ({
  language,
  onOpenEasterEgg,
}) => {
  const [selectedStepId, setSelectedStepId] = useState<string>('step2');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [activePlaylistIdx, setActivePlaylistIdx] = useState<number>(0);

  const activeStep = WORKFLOW_STEPS.find((s) => s.id === selectedStepId) || WORKFLOW_STEPS[1];
  const activePlaylist = PLAYLISTS[activePlaylistIdx] || PLAYLISTS[0];

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(activeStep.codeSnippet);
      setCopiedCode(true);
      sound.playLevelUp();
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      // Handled silently
    }
  };

  return (
    <div className="grid h-full min-h-0 grid-cols-1 gap-3 overflow-hidden lg:grid-cols-12">
      {/* Left Column (5 cols): Blueprints + 2x2 Steps + Code Inspector */}
      <div className="flex min-h-0 flex-col justify-between gap-2.5 overflow-hidden rounded-2xl border border-[#1E293B] bg-[#131B2E] p-3.5 lg:col-span-5">
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold text-[#8B5CF6]">
              <Workflow className="h-3 w-3" />
              <span>PYTHON + HYPERFRAMES + CONCAT</span>
            </div>
            <h3 className="text-sm font-bold text-[#F8FAFC]">
              {language === 'en' ? 'Automated Video Pipeline' : 'Quy Trình Video Tự Động'}
            </h3>
          </div>

          <button
            type="button"
            onClick={() => {
              onOpenEasterEgg('python-hyperframes');
              sound.playTeleport();
            }}
            className="flex items-center gap-1 rounded-lg border border-[#1E293B] bg-[#090D16] px-2.5 py-1 font-mono text-[10px] text-[#A78BFA] transition hover:border-[#8B5CF6]"
          >
            <Terminal className="h-3 w-3" />
            <span>{language === 'en' ? 'Full Script' : 'Mã nguồn'}</span>
          </button>
        </div>

        {/* Open-Source Blueprint Links */}
        <div className="flex shrink-0 flex-wrap items-center gap-2 text-[10px] font-mono">
          <a
            href="https://github.com/heygen-com/hyperframes"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-lg border border-[#1E293B] bg-[#090D16] px-2 py-1 text-[#F8FAFC] hover:border-[#8B5CF6]"
          >
            <span>heygen-com/hyperframes</span>
            <ExternalLink className="h-2.5 w-2.5 text-[#8B5CF6]" />
          </a>
          <a
            href="https://github.com/jub0t/concat"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-lg border border-[#1E293B] bg-[#090D16] px-2 py-1 text-[#F8FAFC] hover:border-[#8B5CF6]"
          >
            <span>jub0t/concat</span>
            <ExternalLink className="h-2.5 w-2.5 text-[#8B5CF6]" />
          </a>
        </div>

        {/* 2x2 Workflow Steps */}
        <div className="grid shrink-0 grid-cols-2 gap-2">
          {WORKFLOW_STEPS.map((step) => {
            const isSelected = step.id === selectedStepId;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => {
                  setSelectedStepId(step.id);
                  sound.playBip(720, 0.04);
                }}
                className={`flex flex-col justify-between rounded-xl border p-2.5 text-left transition ${
                  isSelected
                    ? 'border-[#8B5CF6] bg-[#090D16]'
                    : 'border-[#1E293B] bg-[#090D16]/60 hover:border-[#94A3B8]/40'
                }`}
              >
                <div className="flex w-full items-center justify-between font-mono text-[10px]">
                  <span className={isSelected ? 'font-bold text-[#8B5CF6]' : 'text-[#94A3B8]'}>
                    PHASE {step.number}
                  </span>
                  {isSelected ? (
                    <CheckCircle2 className="h-3 w-3 text-[#8B5CF6]" />
                  ) : (
                    <ChevronRight className="h-3 w-3 text-[#94A3B8]" />
                  )}
                </div>
                <div className="mt-1 line-clamp-1 text-[11px] font-bold text-[#F8FAFC]">
                  {language === 'en' ? step.titleEn : step.titleVi}
                </div>
                <div className="mt-0.5 truncate font-mono text-[9px] text-[#A78BFA]">
                  {step.benchmark} · {step.techStack}
                </div>
              </button>
            );
          })}
        </div>

        {/* Compact Code Snippet Box */}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-[#1E293B] bg-[#090D16] p-2.5 font-mono text-[10px]">
          <div className="mb-1.5 flex shrink-0 items-center justify-between border-b border-[#1E293B] pb-1.5">
            <span className="truncate text-[#94A3B8]">
              {language === 'en' ? activeStep.descriptionEn : activeStep.descriptionVi}
            </span>
            <button
              type="button"
              onClick={handleCopyCode}
              className="ml-2 flex shrink-0 items-center gap-1 rounded border border-[#1E293B] bg-[#131B2E] px-2 py-0.5 text-[10px] text-[#F8FAFC] hover:border-[#8B5CF6]"
            >
              {copiedCode ? <Check className="h-3 w-3 text-[#8B5CF6]" /> : <Copy className="h-3 w-3 text-[#8B5CF6]" />}
              <span>{copiedCode ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <pre className="min-h-0 flex-1 overflow-hidden whitespace-pre-wrap text-[10px] leading-relaxed text-violet-300">
            {activeStep.codeSnippet}
          </pre>
        </div>
      </div>

      {/* Right Column (7 cols): Live Embedded YouTube AI Video Theater */}
      <div className="flex min-h-0 flex-col gap-2.5 overflow-hidden rounded-2xl border border-[#1E293B] bg-[#131B2E] p-3.5 lg:col-span-7">
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Youtube className="h-4 w-4 text-rose-400" />
            <h3 className="text-sm font-bold text-[#F8FAFC]">
              {language === 'en' ? 'Live AI Video Theater & Playlists' : 'Rạp Video AI & Playlist Trực Tiếp'}
            </h3>
          </div>

          <div className="flex items-center gap-1.5">
            {PLAYLISTS.map((pl, idx) => (
              <button
                key={pl.id}
                type="button"
                onClick={() => {
                  setActivePlaylistIdx(idx);
                  sound.playBip(700, 0.04);
                }}
                className={`rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition ${
                  activePlaylistIdx === idx
                    ? 'border-[#8B5CF6] bg-[#8B5CF6] text-white'
                    : 'border-[#1E293B] bg-[#090D16] text-[#94A3B8] hover:text-white'
                }`}
              >
                {language === 'en' ? pl.labelEn : pl.labelVi}
              </button>
            ))}
            <a
              href={activePlaylist.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-lg border border-[#1E293B] bg-[#090D16] px-2.5 py-1 text-[11px] text-[#CBD5E1] hover:border-[#8B5CF6]"
            >
              <span>YouTube</span>
              <ExternalLink className="h-3 w-3 text-[#8B5CF6]" />
            </a>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-hidden rounded-xl border border-[#1E293B] bg-[#090D16]">
          <iframe
            key={activePlaylist.id}
            src={activePlaylist.embedUrl}
            title={activePlaylist.labelEn}
            className="h-full w-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
};
