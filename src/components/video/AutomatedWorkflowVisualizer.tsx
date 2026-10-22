import React, { useState } from 'react';
import { Workflow, CheckCircle2, ChevronRight, Terminal } from 'lucide-react';
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
    techStack: 'Python · Pydantic · JSON Schema',
    descriptionEn: 'Decomposes narrative scripts into timecoded visual markers, sound cues, and visual attention targets.',
    descriptionVi: 'Phân rã kịch bản thành các mốc thời gian, điểm nhấn âm thanh và vị trí điều hướng thị giác.',
    codeSnippet: `class StoryBeat(BaseModel):
    timestamp_ms: int
    visual_anchor: str
    typography_motion: Literal["spring", "drift", "shimmer"]
    broll_query: str
    audio_ducking_db: float = -6.0`,
    benchmark: '0.12s parse latency'
  },
  {
    id: 'step2',
    number: '02',
    titleEn: 'Hyperframes Keyframe Synthesizer',
    titleVi: 'Bộ Tổng Hợp Khung Hình Hyperframes',
    techStack: 'TypeScript · CSS Canvas Matrix',
    descriptionEn: 'Generates programmatic motion vector states, spring bezier curves, and dynamic multi-layer visual cards.',
    descriptionVi: 'Sinh ra các trạng thái chuyển động vector, đường cong bezier và bố cục trực quan đa tầng.',
    codeSnippet: `const keyframeSequence = hyperframes.compose({
  fps: 60,
  resolution: [1080, 1920],
  motionTension: 1.4,
  tracks: [titleTrack, kineticBg, beatPulsar]
});`,
    benchmark: '60fps locked render'
  },
  {
    id: 'step3',
    number: '03',
    titleEn: 'Python Orchestration & Asset Pipeline',
    titleVi: 'Điều Phối Python & Quản Lý Tài Nguyên',
    techStack: 'Python 3.11 · AsyncIO · Watchdog',
    descriptionEn: 'Asynchronously downloads high-bitrate clips, executes image transformations, and compiles optimized FFmpeg graph jobs.',
    descriptionVi: 'Tải và xử lý video bitrate cao bất đồng bộ, tối ưu hoá bộ nhớ đệm và biên dịch đồ thị FFmpeg.',
    codeSnippet: `async def build_render_graph(beats: List[StoryBeat]):
    tasks = [render_segment(b) for b in beats]
    segments = await asyncio.gather(*tasks)
    return compile_filter_complex(segments)`,
    benchmark: '8.4x faster than manual'
  },
  {
    id: 'step4',
    number: '04',
    titleEn: 'Lossless Concat & Multi-Format Render',
    titleVi: 'Ghép Nối Lossless & Xuất Đa Định Dạng',
    techStack: 'FFmpeg · Concat Demuxer · LUFS',
    descriptionEn: 'Stitches final cut with lossless concat demuxing, -14 LUFS loudness audio mastering, and dual 9:16 + 16:9 packaging.',
    descriptionVi: 'Ghép nối phân cảnh chuẩn xác từng khung hình, cân bằng âm thanh chuẩn -14 LUFS và xuất 9:16 Shorts lẫn 16:9 dài.',
    codeSnippet: `ffmpeg -f concat -safe 0 -i render_manifest.txt \\
  -c:v libx264 -preset slow -crf 18 \\
  -af "loudnorm=I=-14:LRA=7:tp=-1.5" \\
  -movflags +faststart export_master.mp4`,
    benchmark: 'Zero frame dropped sync'
  }
];

export const AutomatedWorkflowVisualizer: React.FC<AutomatedWorkflowVisualizerProps> = ({
  language,
  onOpenEasterEgg
}) => {
  const [selectedStepId, setSelectedStepId] = useState<string>('step1');

  const activeStep = WORKFLOW_STEPS.find((s) => s.id === selectedStepId) || WORKFLOW_STEPS[0];

  const handleStepClick = (stepId: string) => {
    setSelectedStepId(stepId);
    sound.playBip(720, 0.04);
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
                ? 'END-TO-END AUTOMATION ARCHITECTURE'
                : 'KIẾN TRÚC TỰ ĐỘNG HÓA TOÀN TRÌNH'}
            </span>
          </div>
          <h3 className="text-lg font-bold text-[#F8FAFC]">
            {language === 'en'
              ? 'Python + Hyperframes + Concat Automated YouTube Workflow'
              : 'Quy Trình Tự Động Hóa YouTube với Python, Hyperframes & Concat'}
          </h3>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            {language === 'en'
              ? 'Click each node along the pipeline to inspect execution code, orchestration logic, and benchmarks.'
              : 'Nhấp từng bước trong quy trình để xem mã thực thi, logic điều phối và hiệu năng vận hành.'}
          </p>
        </div>

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
                <span>Perf Metric:</span>
                <span className="font-mono text-[#F8FAFC] font-semibold">{step.benchmark}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Stage Inspector Modal / Detail Tray */}
      <div className="rounded-xl bg-[#090D16] border border-[#1E293B] p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1E293B] pb-3">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#8B5CF6]/20 text-[#8B5CF6]">
              PHASE {activeStep.number}
            </span>
            <h4 className="text-sm font-bold text-[#F8FAFC]">
              {language === 'en' ? activeStep.titleEn : activeStep.titleVi}
            </h4>
          </div>
          <span className="text-xs font-mono text-[#94A3B8]">
            Benchmark: <span className="text-[#8B5CF6]">{activeStep.benchmark}</span>
          </span>
        </div>

        <p className="text-xs text-[#94A3B8] leading-relaxed">
          {language === 'en' ? activeStep.descriptionEn : activeStep.descriptionVi}
        </p>

        {/* Code Snippet Box */}
        <div className="relative rounded-lg bg-[#090D16] border border-[#1E293B] p-3 font-mono text-xs text-[#F8FAFC] overflow-x-auto">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#1E293B] text-[10px] text-[#94A3B8]">
            <span>IMPLEMENTATION LOGIC</span>
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
