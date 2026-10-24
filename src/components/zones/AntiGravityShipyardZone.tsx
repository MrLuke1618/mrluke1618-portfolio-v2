import React, { useState } from 'react';
import { Terminal, GitBranch, Cpu, Play, Copy, Check, Radio, HardDrive, Shield, ExternalLink, Sparkles } from 'lucide-react';
import { sound } from '../../constants/soundEffects';
import { KineticHeading } from '../common/KineticHeading';

interface AntiGravityShipyardZoneProps {
  language: 'en' | 'vi';
  onOpenEasterEgg: (snippetId: string) => void;
}

const SAMPLE_ANTIGRAVITY_YAML = `# ==============================================================================
# AntiGravity Autonomous Video & Code Pipeline Manifest
# Orchestrates Claude Code, Codex, and headless FFmpeg render agents
# ==============================================================================
version: "2.4"
name: "luke-autonomous-creator-pipeline"
runtime: "python3.11-rust1.78-hybrid"

environment:
  gpu_acceleration: "cuda-enabled"
  headless_display: "xvfb-virtual-framebuffer"
  concurrency_limit: 4

github_sync:
  repository: "https://github.com/MrLuke1618/my-interactive-portfolio"
  watch_branch: "main"
  auto_pull_assets: true
  commit_artifacts_on_success: false

tasks:
  - id: "intake-narrative"
    engine: "claude-code"
    action: "parse_structured_beats"
    input_format: "markdown"
    output_schema: "schemas/story_beats.json"

  - id: "synthesize-keyframes"
    engine: "hyperframes-cli"
    source: "https://github.com/heygen-com/hyperframes"
    aspect_ratio: "1080x1920"
    fps: 60
    cache_dir: ".cache/hyperframes"

  - id: "lossless-concat"
    engine: "concat-demuxer"
    source: "https://github.com/jub0t/concat"
    preset: "slow"
    crf: 18
    audio_ducking_db: -12.0
    loudness_lufs: -14.0
    output_destination: "dist/exports/master_shorts.mp4"

watchdog:
  restart_on_crash: true
  max_retries: 3
  alert_webhook: "https://api.telegram.org/bot/alert"`;

const CLI_PRESETS = [
  {
    cmd: 'antigravity run video-pipeline --preset youtube-shorts',
    description: 'Execute full intake, Hyperframes synthesis, and Concat stitch.',
    logs: [
      '[antigravity:core] Initializing autonomous agent pool...',
      '[antigravity:git] Syncing HEAD with origin/main (SHA: 4a9f2c1)',
      '[claude-code] Extracted 6 viral narrative beats from script_input.md',
      '[hyperframes] Compiling 60fps canvas keyframe buffers for 9:16 layout',
      '[concat] Lossless demuxing 4 segments via libx264 (crf 18, -14 LUFS)',
      '[antigravity:pipeline] SUCCESS: master_shorts.mp4 generated in 4.21s (Zero frame drops)'
    ]
  },
  {
    cmd: 'claude-code task "Audit frame-drop latency in concat stitching"',
    description: 'Deep reasoning agent inspection of FFmpeg audio/video demux timing.',
    logs: [
      '[claude-code] Scanning concat demuxer timestamp drift across PTS/DTS streams...',
      '[claude-code] Stream #0:0 (video): 60.00 fps locked, zero jitter detected',
      '[claude-code] Stream #0:1 (audio): AAC 48000Hz stereo, sync deviation < 0.4ms',
      '[claude-code] AUDIT COMPLETE: Audio-video sync is mathematically frame-perfect.'
    ]
  },
  {
    cmd: 'codex sync github --repo MrLuke1618/my-interactive-portfolio',
    description: 'Autonomous Git pull, branch validation, and packaging check.',
    logs: [
      '[codex:git] Connecting to github.com/MrLuke1618/my-interactive-portfolio...',
      '[codex:git] Fetching packfile: 100% (214/214), done.',
      '[codex:deps] Validating package.json dependencies and vercel.json rewrite rules...',
      '[codex:build] Running "npm run build" -> dist/index.html & dist/404.html verified.',
      '[codex:status] Outpost workspace is 100% clean and synchronized with production.'
    ]
  }
];

export const AntiGravityShipyardZone: React.FC<AntiGravityShipyardZoneProps> = ({
  language,
  onOpenEasterEgg
}) => {
  const [selectedCliIdx, setSelectedCliIdx] = useState<number>(0);
  const [terminalLogs, setTerminalLogs] = useState<string[]>(CLI_PRESETS[0].logs);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [copiedYaml, setCopiedYaml] = useState<boolean>(false);

  const activeCli = CLI_PRESETS[selectedCliIdx];

  const handleRunCommand = (idx: number) => {
    setSelectedCliIdx(idx);
    setIsExecuting(true);
    sound.playTerminalClick();
    setTerminalLogs(['[shipyard:kernel] Spawning isolated agent container...']);

    setTimeout(() => {
      setTerminalLogs(CLI_PRESETS[idx].logs);
      setIsExecuting(false);
      sound.playLevelUp();
    }, 450);
  };

  const handleCopyYaml = async () => {
    try {
      await navigator.clipboard.writeText(SAMPLE_ANTIGRAVITY_YAML);
      setCopiedYaml(true);
      sound.playLevelUp();
      setTimeout(() => setCopiedYaml(false), 2000);
    } catch {
      // Handled silently
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Remote Orbital Command Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-[#1E293B] bg-[#131B2E] p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[#8B5CF6] text-xs font-mono flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#8B5CF6]/10 border border-[#8B5CF6]/30">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span>SECTOR: ORBITAL-ALPHA // DIST: 160AU</span>
              </span>
            </div>
            <KineticHeading
              as="h1"
              text={
                language === 'en'
                  ? 'Deep-Space AntiGravity & Code Shipyard'
                  : 'Trạm Vũ Trụ AntiGravity & Lập Trình Hệ Thống'
              }
              className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight"
            />
            <p className="text-sm text-[#94A3B8] max-w-2xl leading-relaxed">
              {language === 'en'
                ? 'Isolated remote orbital outpost hosting autonomous development runtimes. Review GitHub-synced pipelines where AntiGravity, Claude Code, and Codex execute local headless batch rendering.'
                : 'Trạm quỹ đạo biệt lập vận hành các môi trường phát triển tự động. Khám phá quy trình đồng bộ GitHub nơi AntiGravity, Claude Code và Codex thực thi dựng video hàng loạt không cần giao diện.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
            <button
              onClick={() => onOpenEasterEgg('rust-scanner')}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#090D16] border border-[#1E293B] hover:border-[#8B5CF6] text-xs font-mono text-[#F8FAFC] transition-colors"
            >
              <Cpu className="w-4 h-4 text-[#8B5CF6]" />
              <span>{language === 'en' ? 'Inspect Rust Scanner' : 'Xem Code Rust'}</span>
            </button>

            <a
              href="https://github.com/MrLuke1618/my-interactive-portfolio"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-medium transition-colors shadow-lg shadow-violet-500/20"
            >
              <GitBranch className="w-4 h-4" />
              <span>{language === 'en' ? 'Live GitHub Repository' : 'Kho Mã Nguồn GitHub'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* GitHub-Synced Autonomous Architecture Flowchart */}
      <div className="rounded-2xl bg-[#131B2E] border border-[#1E293B] p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-[#8B5CF6]">
            <HardDrive className="w-3.5 h-3.5" />
            <span>ORBITAL AUTONOMOUS PIPELINE ARCHITECTURE</span>
          </div>
          <span className="text-[11px] font-mono text-[#94A3B8]">Headless Execution · Zero GUI Latency</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              phase: '01',
              title: 'GitHub Repo Pull',
              tech: 'Git · SSH Keyring',
              descEn: 'Shallow clones latest commit, pulls video assets, and caches dependencies.',
              descVi: 'Tự động clone commit mới nhất, tải tài nguyên video và nạp bộ nhớ đệm.'
            },
            {
              phase: '02',
              title: 'Sandbox Spin-up',
              tech: 'xvfb · CUDA Sandbox',
              descEn: 'Boots headless virtual framebuffer for hardware-accelerated canvas rendering.',
              descVi: 'Khởi tạo bộ đệm ảo không cần màn hình để dựng đồ họa canvas tăng tốc phần cứng.'
            },
            {
              phase: '03',
              title: 'Agent Batch Render',
              tech: 'Hyperframes + Concat',
              descEn: 'Executes parallel scene stitching and audio-video timing synchronization.',
              descVi: 'Thực thi ghép nối phân cảnh song song và đồng bộ thời gian âm thanh.'
            },
            {
              phase: '04',
              title: 'Release & Deployment',
              tech: 'Vercel CLI · GitHub API',
              descEn: 'Publishes completed master MP4s and triggers instant Vercel SPA build.',
              descVi: 'Xuất bản video thành phẩm và kích hoạt quy trình triển khai Vercel tức thì.'
            }
          ].map((node) => (
            <div key={node.phase} className="p-4 rounded-xl bg-[#090D16] border border-[#1E293B] space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#8B5CF6] font-bold">PHASE {node.phase}</span>
                <Shield className="w-3.5 h-3.5 text-[#94A3B8]" />
              </div>
              <h4 className="text-xs sm:text-sm font-semibold text-[#F8FAFC]">{node.title}</h4>
              <p className="text-[11px] font-mono text-[#8B5CF6]">{node.tech}</p>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                {language === 'en' ? node.descEn : node.descVi}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive antigravity.yaml Execution Manifest Inspector */}
      <div className="rounded-2xl bg-[#131B2E] border border-[#1E293B] p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1E293B] pb-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#8B5CF6]">
              <Terminal className="w-3.5 h-3.5" />
              <span>EXECUTION MANIFEST · antigravity.yaml</span>
            </div>
            <h3 className="text-base font-bold text-[#F8FAFC] mt-0.5">
              {language === 'en'
                ? 'Autonomous Video Orchestration Blueprint'
                : 'Bản Thiết Kế Điều Phối Dựng Video Tự Động'}
            </h3>
          </div>

          <button
            onClick={handleCopyYaml}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#090D16] border border-[#1E293B] hover:border-[#8B5CF6] text-xs font-mono text-[#F8FAFC] transition-colors self-start sm:self-auto"
          >
            {copiedYaml ? <Check className="w-3.5 h-3.5 text-[#8B5CF6]" /> : <Copy className="w-3.5 h-3.5 text-[#8B5CF6]" />}
            <span>{copiedYaml ? 'Copied YAML!' : 'Copy antigravity.yaml'}</span>
          </button>
        </div>

        <div className="rounded-xl bg-[#090D16] border border-[#1E293B] p-4 font-mono text-xs text-[#F8FAFC] overflow-x-auto max-h-[340px] leading-relaxed">
          <pre className="text-violet-300">{SAMPLE_ANTIGRAVITY_YAML}</pre>
        </div>
      </div>

      {/* Interactive CLI Command Simulator */}
      <div className="rounded-2xl bg-[#131B2E] border border-[#1E293B] p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-[#8B5CF6]">
            <Play className="w-3.5 h-3.5" />
            <span>SHIPYARD CLI EMULATOR</span>
          </div>
          <span className="text-[11px] font-mono text-[#94A3B8]">Test Real Terminal Instructions</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {CLI_PRESETS.map((preset, idx) => {
            const isSelected = selectedCliIdx === idx;
            return (
              <button
                key={idx}
                onClick={() => handleRunCommand(idx)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-[#090D16] border-[#8B5CF6] text-[#F8FAFC] shadow-sm'
                    : 'bg-[#090D16]/60 border-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#1E293B]/80'
                }`}
              >
                <div className="text-xs font-mono font-semibold text-[#8B5CF6] truncate mb-1">
                  $ {preset.cmd.split(' ')[0]} {preset.cmd.split(' ')[1]}
                </div>
                <div className="text-[11px] text-[#94A3B8] line-clamp-2">
                  {preset.description}
                </div>
              </button>
            );
          })}
        </div>

        {/* Emulated Terminal Output Window */}
        <div className="rounded-xl bg-[#090D16] border border-[#1E293B] p-4 font-mono text-xs space-y-2">
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-2 text-[11px] text-[#94A3B8]">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block" />
              <span className="ml-2 hidden xs:inline">terminal — bash</span>
            </span>
            <span className="truncate max-w-[150px] sm:max-w-xs md:max-w-none text-right">$ {activeCli.cmd}</span>
          </div>

          <div className="space-y-1.5 pt-1 text-[11px]">
            {isExecuting ? (
              <div className="text-[#8B5CF6] animate-pulse flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>[orbital:kernel] Executing autonomous worker task...</span>
              </div>
            ) : (
              terminalLogs.map((log, lIdx) => (
                <div key={lIdx} className="leading-relaxed">
                  <span className="text-[#8B5CF6]">{log.split(']')[0]}]</span>
                  <span className="text-[#F8FAFC]">{log.substring(log.indexOf(']') + 1)}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
