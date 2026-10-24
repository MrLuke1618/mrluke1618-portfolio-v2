import React, { useState } from 'react';
import { Workflow, CheckCircle2, ChevronRight, Terminal, ExternalLink, Sliders, Copy, Check } from 'lucide-react';
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
    techStack: 'Python 3.11 · Pydantic · JSON Schema',
    descriptionEn: 'Decomposes narrative scripts into timecoded visual markers, sound cues, and visual attention retention targets.',
    descriptionVi: 'Phân rã kịch bản thành các mốc thời gian, điểm nhấn âm thanh và vị trí điều hướng thị giác.',
    codeSnippet: `class StoryBeat(BaseModel):
    timestamp_ms: int
    visual_anchor: str
    typography_motion: Literal["mrbeast_pop", "trailer_slam", "neon_bounce"]
    broll_query: str
    audio_ducking_db: float = -6.0

def parse_retention_script(raw_md: str) -> List[StoryBeat]:
    return [StoryBeat(**item) for item in extract_json_manifest(raw_md)]`,
    benchmark: '0.12s parse latency'
  },
  {
    id: 'step2',
    number: '02',
    titleEn: 'Hyperframes Keyframe Synthesizer',
    titleVi: 'Bộ Tổng Hợp Khung Hình Hyperframes',
    techStack: 'TypeScript · CSS Canvas Matrix',
    repoUrl: 'https://github.com/heygen-com/hyperframes',
    repoName: 'heygen-com/hyperframes',
    descriptionEn: 'Programmatic canvas-based motion keyframing without heavy rendering bloat. Compiles layered visual vectors into exact frame buffers.',
    descriptionVi: 'Khung hình chuyển động dựa trên canvas không bị phình to dung lượng. Biên dịch các vector hình ảnh thành bộ đệm khung hình chuẩn xác.',
    codeSnippet: `import { compose } from '@heygen/hyperframes';

const composition = compose({
  fps: 60,
  dimensions: { width: 1080, height: 1920 },
  tracks: [
    { type: 'typography', motion: 'mrbeast_pop', text: 'REVEAL THE SECRET' },
    { type: 'broll', source: 'cache/segment_01.mp4', blend: 'multiply' },
    { type: 'audio-visualizer', reactive: true, boost: 1.4 }
  ]
});`,
    benchmark: '60fps locked render'
  },
  {
    id: 'step3',
    number: '03',
    titleEn: 'Python Orchestration & Asset Pipeline',
    titleVi: 'Điều Phối Python & Quản Lý Tài Nguyên',
    techStack: 'Python 3.11 · AsyncIO · Watchdog',
    descriptionEn: 'Asynchronously fetches high-bitrate media, validates aspect ratios, and generates optimized FFmpeg filtergraph manifests.',
    descriptionVi: 'Tải và xử lý video bitrate cao bất đồng bộ, kiểm tra tỷ lệ khung hình và biên dịch đồ thị FFmpeg.',
    codeSnippet: `async def build_render_graph(beats: List[StoryBeat], format: str = "9:16"):
    tasks = [render_hyperframe_segment(b, format) for b in beats]
    segments = await asyncio.gather(*tasks)
    manifest = generate_concat_manifest(segments)
    return manifest`,
    benchmark: '8.4x faster than manual'
  },
  {
    id: 'step4',
    number: '04',
    titleEn: 'Lossless Concat & Multi-Format Render',
    titleVi: 'Ghép Nối Lossless Concat & Xuất Bản',
    techStack: 'FFmpeg · Concat Demuxer · LUFS',
    repoUrl: 'https://github.com/jub0t/concat',
    repoName: 'jub0t/concat',
    descriptionEn: 'Stitches finished segments with zero re-encoding loss using the Concat toolchain, -14 LUFS loudness mastering, and automated multi-aspect publishing.',
    descriptionVi: 'Ghép nối phân cảnh chuẩn xác từng khung hình không suy hao chất lượng với công cụ Concat, cân bằng âm thanh chuẩn -14 LUFS.',
    codeSnippet: `# Lossless Concat Demuxing Execution
concat -i render_manifest.txt -o final_master.mp4 \\
  --crf 18 \\
  --audio-duck -12dB \\
  --normalize-lufs -14 \\
  --faststart`,
    benchmark: 'Zero frame dropped sync'
  }
];

export const AutomatedWorkflowVisualizer: React.FC<AutomatedWorkflowVisualizerProps> = ({
  language,
  onOpenEasterEgg
}) => {
  const [selectedStepId, setSelectedStepId] = useState<string>('step2');
  const [targetAspect, setTargetAspect] = useState<'9:16' | '16:9'>('9:16');
  const [crfQuality, setCrfQuality] = useState<number>(18);
  const [audioDucking, setAudioDucking] = useState<number>(-12);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  const activeStep = WORKFLOW_STEPS.find((s) => s.id === selectedStepId) || WORKFLOW_STEPS[1];

  const handleStepClick = (stepId: string) => {
    setSelectedStepId(stepId);
    sound.playBip(720, 0.04);
  };

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
    <div className="rounded-2xl bg-[#131B2E] border border-[#1E293B] p-5 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#8B5CF6] mb-1">
            <Workflow className="w-3.5 h-3.5" />
            <span>
              {language === 'en'
                ? 'PYTHON + HYPERFRAMES + CONCAT ARCHITECTURE'
                : 'KIẾN TRÚC TỰ ĐỘNG HÓA PYTHON + HYPERFRAMES + CONCAT'}
            </span>
          </div>
          <h3 className="text-lg font-bold text-[#F8FAFC]">
            {language === 'en'
              ? 'Automated YouTube Video Stitching & Keyframing Pipeline'
              : 'Quy Trình Tự Động Hóa Dựng Video YouTube với Hyperframes & Concat'}
          </h3>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            {language === 'en'
              ? 'Inspect production code combining Hyperframes programmatic animations with Concat lossless video stitching.'
              : 'Khám phá mã nguồn kết hợp công cụ hoạt họa Hyperframes và công cụ ghép nối video lossless Concat.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              onOpenEasterEgg('python-hyperframes');
              sound.playTeleport();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#090D16] border border-[#1E293B] hover:border-[#8B5CF6] text-xs text-[#8B5CF6] font-mono transition-colors"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'Open Raw Pipeline Script' : 'Mở Mã Nguồn Đầy Đủ'}</span>
          </button>
        </div>
      </div>

      {/* Official Open-Source Blueprint Badges */}
      <div className="flex flex-wrap items-center gap-2.5 p-3 rounded-xl bg-[#090D16] border border-[#1E293B] text-xs">
        <span className="text-[#94A3B8] font-mono text-[11px]">VERIFIED OPEN-SOURCE BLUEPRINTS:</span>
        <a
          href="https://github.com/heygen-com/hyperframes"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#131B2E] border border-[#1E293B] hover:border-[#8B5CF6] text-[#F8FAFC] font-mono text-[11px] transition-colors"
        >
          <span>heygen-com/hyperframes</span>
          <ExternalLink className="w-3 h-3 text-[#8B5CF6]" />
        </a>
        <a
          href="https://github.com/jub0t/concat"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#131B2E] border border-[#1E293B] hover:border-[#8B5CF6] text-[#F8FAFC] font-mono text-[11px] transition-colors"
        >
          <span>jub0t/concat</span>
          <ExternalLink className="w-3 h-3 text-[#8B5CF6]" />
        </a>
      </div>

      {/* Visual Pipeline Node Track */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {WORKFLOW_STEPS.map((step) => {
          const isSelected = step.id === selectedStepId;

          return (
            <div
              key={step.id}
              onClick={() => handleStepClick(step.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#090D16] border-[#8B5CF6] shadow-lg shadow-violet-500/10'
                  : 'bg-[#090D16]/60 border-[#1E293B] hover:border-[#94A3B8]/40'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`font-mono text-xs font-bold ${
                      isSelected ? 'text-[#8B5CF6]' : 'text-[#94A3B8]'
                    }`}
                  >
                    PHASE {step.number}
                  </span>
                  {isSelected ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#8B5CF6]" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
                  )}
                </div>

                <h4 className="text-xs sm:text-sm font-semibold text-[#F8FAFC] leading-snug">
                  {language === 'en' ? step.titleEn : step.titleVi}
                </h4>
                <p className="text-[11px] font-mono text-[#8B5CF6] mt-1 truncate">
                  {step.techStack}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-[#1E293B] flex items-center justify-between text-[10px] text-[#94A3B8]">
                <span>Perf:</span>
                <span className="font-mono text-[#F8FAFC] font-semibold">{step.benchmark}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Stage Inspector & Live Parameter Simulation */}
      <div className="rounded-xl bg-[#090D16] border border-[#1E293B] p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1E293B] pb-3">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#8B5CF6]/20 text-[#8B5CF6]">
              PHASE {activeStep.number}
            </span>
            <h4 className="text-sm font-bold text-[#F8FAFC]">
              {language === 'en' ? activeStep.titleEn : activeStep.titleVi}
            </h4>
            {activeStep.repoUrl && (
              <a
                href={activeStep.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-mono text-[#8B5CF6] hover:underline flex items-center gap-1 ml-2"
              >
                <span>[{activeStep.repoName}]</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-[#94A3B8]">
              Latency: <span className="text-[#8B5CF6]">{activeStep.benchmark}</span>
            </span>
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#131B2E] border border-[#1E293B] text-[11px] font-mono text-[#F8FAFC] hover:border-[#8B5CF6] transition-colors"
            >
              {copiedCode ? <Check className="w-3 h-3 text-[#8B5CF6]" /> : <Copy className="w-3 h-3 text-[#8B5CF6]" />}
              <span>{copiedCode ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        <p className="text-xs text-[#94A3B8] leading-relaxed">
          {language === 'en' ? activeStep.descriptionEn : activeStep.descriptionVi}
        </p>

        {/* Live Parameter Playground */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-lg bg-[#131B2E] border border-[#1E293B]">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-mono text-[#94A3B8]">
              <span>TARGET ASPECT:</span>
              <span className="text-[#8B5CF6]">{targetAspect}</span>
            </div>
            <div className="flex gap-1.5 pt-1">
              <button
                onClick={() => setTargetAspect('9:16')}
                className={`flex-1 py-1 text-xs font-mono rounded ${
                  targetAspect === '9:16' ? 'bg-[#8B5CF6] text-white' : 'bg-[#090D16] text-[#94A3B8]'
                }`}
              >
                9:16 (Shorts)
              </button>
              <button
                onClick={() => setTargetAspect('16:9')}
                className={`flex-1 py-1 text-xs font-mono rounded ${
                  targetAspect === '16:9' ? 'bg-[#8B5CF6] text-white' : 'bg-[#090D16] text-[#94A3B8]'
                }`}
              >
                16:9 (Main)
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-mono text-[#94A3B8]">
              <span>CRF COMPRESSION:</span>
              <span className="text-[#8B5CF6]">{crfQuality}</span>
            </div>
            <input
              type="range"
              min="14"
              max="28"
              value={crfQuality}
              onChange={(e) => setCrfQuality(Number(e.target.value))}
              className="w-full accent-[#8B5CF6] mt-2 cursor-pointer h-3 sm:h-2 touch-none"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-mono text-[#94A3B8]">
              <span>AUDIO DUCKING:</span>
              <span className="text-[#8B5CF6]">{audioDucking} dB</span>
            </div>
            <input
              type="range"
              min="-24"
              max="-6"
              value={audioDucking}
              onChange={(e) => setAudioDucking(Number(e.target.value))}
              className="w-full accent-[#8B5CF6] mt-2 cursor-pointer h-3 sm:h-2 touch-none"
            />
          </div>
        </div>

        {/* Code Snippet Box */}
        <div className="relative rounded-lg bg-[#090D16] border border-[#1E293B] p-3 font-mono text-xs text-[#F8FAFC] overflow-x-auto">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#1E293B] text-[10px] text-[#94A3B8]">
            <span className="flex items-center gap-1.5">
              <Sliders className="w-3 h-3 text-[#8B5CF6]" />
              <span>RUNTIME CODEBLUEPRINT</span>
            </span>
            <span>{activeStep.techStack}</span>
          </div>
          <pre className="text-[11px] leading-relaxed text-violet-300">
            {activeStep.codeSnippet}
          </pre>
        </div>
      </div>
    </div>
  );
};
