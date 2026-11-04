import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Youtube, 
  ExternalLink, 
  ListVideo, 
  Sparkles, 
  Film, 
  Maximize2, 
  X, 
  Tv, 
  CheckCircle2, 
  Smartphone, 
  Monitor 
} from 'lucide-react';

interface PlaylistVideoPlayerProps {
  language: 'en' | 'vi';
  sound: {
    playBip?: (freq?: number, duration?: number) => void;
    playTeleport?: () => void;
  };
}

export type AspectRatioType = 'auto' | '16:9' | '9:16';
export type FilterType = 'all' | 'playlist1' | 'playlist2' | 'shorts';

export interface PlaylistItem {
  id: string;
  type: 'video' | 'playlist';
  playlistGroup: 'playlist1' | 'playlist2' | 'shorts';
  videoId?: string;
  playlistId?: string;
  titleEn: string;
  titleVi: string;
  categoryEn: string;
  categoryVi: string;
  duration: string;
  isVertical?: boolean;
  tags: string[];
  descriptionEn: string;
  descriptionVi: string;
  theme: 'blue' | 'purple' | 'emerald' | 'amber' | 'rose';
  thumbnailUrl?: string;
  embedUrl: string;
  externalUrl: string;
}

const PLAYLIST_1_ID = 'PL8l48rFpYhhaFUDxydFt2tTY55rpb9rWi';
const PLAYLIST_2_ID = 'PLLjOmcEguDcU';

export const PLAYLIST_ITEMS: PlaylistItem[] = [
  {
    id: 'sfqya6_maw4',
    type: 'video',
    playlistGroup: 'shorts',
    videoId: 'SfQYA6_Maw4',
    titleEn: 'AI HTML Video Creation (Remotion · Hyperframes · Concat)',
    titleVi: 'Sản Xuất Video AI Bằng HTML (Remotion · Hyperframes · Concat)',
    categoryEn: 'Programmatic HTML Video',
    categoryVi: 'Video AI Lập Trình HTML',
    duration: '0:45',
    isVertical: true,
    tags: ['Remotion', 'Hyperframes', 'Concat', 'HTML/CSS Video'],
    descriptionEn: 'Demonstration showing programmatic AI video workflows: HTML/CSS web layer composing, kinetic typography rendering, and automated multi-segment stitching.',
    descriptionVi: 'Minh họa quy trình sản xuất video AI lập trình: render layout web HTML/CSS, hiệu ứng kinetic typography và tự động ghép nối đa phân cảnh.',
    theme: 'blue',
    thumbnailUrl: 'https://img.youtube.com/vi/SfQYA6_Maw4/hqdefault.jpg',
    embedUrl: 'https://www.youtube-nocookie.com/embed/SfQYA6_Maw4?autoplay=1&rel=0&modestbranding=1',
    externalUrl: 'https://www.youtube.com/shorts/SfQYA6_Maw4'
  },
  {
    id: 'full_playlist_1_stream',
    type: 'playlist',
    playlistGroup: 'playlist1',
    playlistId: PLAYLIST_1_ID,
    titleEn: 'AI Video Pipeline & Automation Stream (Playlist #1)',
    titleVi: 'Quy Trình Pipeline & Tự Động Hóa Video AI (Danh Sách #1)',
    categoryEn: 'Full Playlist Stream · Veo 3 & Pipelines',
    categoryVi: 'Phát Trọn Danh Sách · Veo 3 & Pipeline',
    duration: 'Multi-Video',
    isVertical: false,
    tags: ['Google Veo 3', 'Continuous Play', 'YouTube Pipeline', 'Automation'],
    descriptionEn: 'Continuous stream of the complete AI Video Engineering series featuring narrative models, generative cinematography, and automated render queues.',
    descriptionVi: 'Phát liên tục chuỗi video kỹ thuật AI bao gồm các mô hình kịch bản điện ảnh thế hệ mới và hàng đợi render tự động.',
    theme: 'purple',
    embedUrl: `https://www.youtube-nocookie.com/embed/videoseries?list=${PLAYLIST_1_ID}&autoplay=1&rel=0&modestbranding=1`,
    externalUrl: `https://www.youtube.com/playlist?list=${PLAYLIST_1_ID}`
  },
  {
    id: 'veo3_how_we_met',
    type: 'video',
    playlistGroup: 'playlist1',
    videoId: 'AUZIYQFXnDafLJo',
    playlistId: PLAYLIST_1_ID,
    titleEn: 'How We Met? (Google Veo 3 Cinematic Narrative)',
    titleVi: 'How We Met? (Tường Thuật Điện Ảnh Google Veo 3)',
    categoryEn: 'Veo 3 Narrative Engine',
    categoryVi: 'Kể Chuyện Bằng Veo 3',
    duration: '0:40',
    isVertical: true,
    tags: ['Google Veo 3', 'LUKE1618', 'Cinematography', 'Storytelling'],
    descriptionEn: 'Romantic storytelling short exploring cinematic rain atmosphere, character consistency, and atmospheric lighting generated via Google DeepMind Veo 3.',
    descriptionVi: 'Video ngắn tường thuật điện ảnh dưới mưa, nhất quán nhân vật và ánh sáng nghệ thuật thực hiện bởi Google DeepMind Veo 3.',
    theme: 'rose',
    embedUrl: `https://www.youtube-nocookie.com/embed/videoseries?list=${PLAYLIST_1_ID}&autoplay=1&rel=0&modestbranding=1`,
    externalUrl: `https://www.youtube.com/playlist?list=${PLAYLIST_1_ID}`
  },
  {
    id: 'full_playlist_2_stream',
    type: 'playlist',
    playlistGroup: 'playlist2',
    playlistId: PLAYLIST_2_ID,
    titleEn: 'Generative AI Creative Showcase Series (Playlist #2)',
    titleVi: 'Tuyển Tập Sáng Tạo Trí Tuệ Nhân Tạo (Danh Sách #2)',
    categoryEn: 'Full Playlist Stream · Series 2',
    categoryVi: 'Phát Trọn Danh Sách · Tuyển Tập 2',
    duration: 'Series Queue',
    isVertical: false,
    tags: ['Playlist PLLjOmcEguDcU', 'Generative Media', 'Visual FX', 'AI Portfolio'],
    descriptionEn: 'The full creative generative playlist PLLjOmcEguDcU showcasing multi-model AI visual transformations, style transfers, and high-fidelity video renders.',
    descriptionVi: 'Toàn bộ danh sách phát PLLjOmcEguDcU trình diễn biến đổi thị giác AI đa mô hình, truyền tải phong cách và kết xuất video độ phân giải cao.',
    theme: 'emerald',
    embedUrl: `https://www.youtube-nocookie.com/embed/videoseries?list=${PLAYLIST_2_ID}&autoplay=1&rel=0&modestbranding=1`,
    externalUrl: `https://www.youtube.com/playlist?list=${PLAYLIST_2_ID}`
  },
  {
    id: 'veo3_late_goodbye',
    type: 'video',
    playlistGroup: 'playlist1',
    playlistId: PLAYLIST_1_ID,
    titleEn: 'Late Goodbye (Veo 3 Cinematic Noir Tribute)',
    titleVi: 'Late Goodbye (Phim Ngắn Noir Điện Ảnh Veo 3)',
    categoryEn: 'Cinematic Noir AI',
    categoryVi: 'Điện Ảnh Noir AI',
    duration: '0:50',
    isVertical: true,
    tags: ['Veo 3 Noir', 'Atmospheric Lighting', 'Poets of the Fall', 'AI Cinema'],
    descriptionEn: 'Deep atmospheric noir tribute featuring high-contrast shadow composition, wet asphalt reflections, and camera drift generated with Veo 3.',
    descriptionVi: 'Phân cảnh noir tương phản cao, phản chiếu mặt đường ướt và chuyển động máy quay tạo bởi mô hình Veo 3.',
    theme: 'amber',
    embedUrl: `https://www.youtube-nocookie.com/embed/videoseries?list=${PLAYLIST_1_ID}&autoplay=1&rel=0&modestbranding=1`,
    externalUrl: `https://www.youtube.com/playlist?list=${PLAYLIST_1_ID}`
  }
];

// Distinct, high-definition SVG artwork thumbnails for each individual item so they never repeat
const DistinctThumbnail: React.FC<{ item: PlaylistItem; isMini?: boolean }> = ({ item, isMini = false }) => {
  if (item.thumbnailUrl && item.id === 'sfqya6_maw4') {
    return (
      <div className="relative w-full h-full bg-[#090D16] overflow-hidden">
        <img
          src={item.thumbnailUrl}
          alt={item.titleEn}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090D16]/80 via-transparent to-transparent" />
        <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/85 text-[9px] font-mono text-cyan-300 font-bold border border-cyan-500/30">
          HTML AI
        </span>
      </div>
    );
  }

  // Playlist #1: Purple / Violet Cyberpunk Film Strip
  if (item.id === 'full_playlist_1_stream') {
    return (
      <div className="relative w-full h-full bg-gradient-to-br from-[#1E1135] via-[#0D0819] to-[#090D16] flex flex-col items-center justify-center p-2 text-center overflow-hidden border border-purple-500/20">
        <div className="absolute -right-4 -top-4 w-16 h-16 bg-purple-500/20 rounded-full blur-xl pointer-events-none" />
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#8B5CF6_1px,transparent_1px)] [background-size:8px_8px]" />
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-6 h-6 rounded-md bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 mb-1">
            <ListVideo className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] font-mono font-bold text-purple-200 tracking-wider">
            PLAYLIST #1
          </span>
          {!isMini && (
            <span className="text-[9px] font-mono text-purple-300/80 mt-0.5">
              Veo 3 · Pipelines
            </span>
          )}
        </div>
        <span className="absolute bottom-1 right-1 px-1 py-0.2 rounded bg-purple-950/90 text-[8px] font-mono text-purple-200 border border-purple-500/30">
          SERIES 1
        </span>
      </div>
    );
  }

  // Playlist #2: Emerald / Cyan Neural Network Generative AI
  if (item.id === 'full_playlist_2_stream') {
    return (
      <div className="relative w-full h-full bg-gradient-to-br from-[#06241D] via-[#041411] to-[#090D16] flex flex-col items-center justify-center p-2 text-center overflow-hidden border border-emerald-500/20">
        <div className="absolute -left-4 -bottom-4 w-16 h-16 bg-emerald-500/20 rounded-full blur-xl pointer-events-none" />
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#10B981_1px,transparent_1px)] [background-size:8px_8px]" />
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-6 h-6 rounded-md bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] font-mono font-bold text-emerald-300 tracking-wider">
            PLAYLIST #2
          </span>
          {!isMini && (
            <span className="text-[9px] font-mono text-emerald-400/80 mt-0.5">
              PLLjOmcEguDcU
            </span>
          )}
        </div>
        <span className="absolute bottom-1 right-1 px-1 py-0.2 rounded bg-emerald-950/90 text-[8px] font-mono text-emerald-300 border border-emerald-500/30">
          SERIES 2
        </span>
      </div>
    );
  }

  // Veo3 How We Met: Romantic Rain Vignette (Rose / Crimson)
  if (item.id === 'veo3_how_we_met') {
    return (
      <div className="relative w-full h-full bg-gradient-to-br from-[#290E17] via-[#14080D] to-[#090D16] flex flex-col items-center justify-center p-2 text-center overflow-hidden border border-rose-500/20">
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(45deg,#F43F5E_1px,transparent_1px)] [background-size:10px_10px]" />
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-6 h-6 rounded-md bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-300 mb-1">
            <Film className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] font-mono font-bold text-rose-200">
            HOW WE MET?
          </span>
          <span className="text-[8px] font-mono text-rose-300/80">
            Veo 3 · Rain Story
          </span>
        </div>
        <span className="absolute bottom-1 right-1 px-1 py-0.2 rounded bg-rose-950/90 text-[8px] font-mono text-rose-200 border border-rose-500/30">
          0:40
        </span>
      </div>
    );
  }

  // Veo3 Late Goodbye: Noir Midnight Rain (Amber / Gold)
  return (
    <div className="relative w-full h-full bg-gradient-to-br from-[#261B09] via-[#140E04] to-[#090D16] flex flex-col items-center justify-center p-2 text-center overflow-hidden border border-amber-500/20">
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#F59E0B_1px,transparent_1px)] [background-size:8px_8px]" />
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-6 h-6 rounded-md bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 mb-1">
          <Tv className="w-3.5 h-3.5" />
        </div>
        <span className="text-[10px] font-mono font-bold text-amber-200">
          LATE GOODBYE
        </span>
        <span className="text-[8px] font-mono text-amber-300/80">
          Noir Cinema
        </span>
      </div>
      <span className="absolute bottom-1 right-1 px-1 py-0.2 rounded bg-amber-950/90 text-[8px] font-mono text-amber-200 border border-amber-500/30">
        0:50
      </span>
    </div>
  );
};

export const PlaylistVideoPlayer: React.FC<PlaylistVideoPlayerProps> = ({ language, sound }) => {
  const [selectedItemId, setSelectedItemId] = useState<string>(PLAYLIST_ITEMS[0].id);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isCinemaModalOpen, setIsCinemaModalOpen] = useState<boolean>(false);
  const [theaterLayout, setTheaterLayout] = useState<'inline-split' | 'inline-expanded'>('inline-expanded');
  const [aspectRatioMode, setAspectRatioMode] = useState<AspectRatioType>('auto');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const activeItem = PLAYLIST_ITEMS.find((item) => item.id === selectedItemId) || PLAYLIST_ITEMS[0];

  // Auto-detect best aspect ratio if in auto mode
  const currentRatioClass = () => {
    if (aspectRatioMode === '9:16' || (aspectRatioMode === 'auto' && activeItem.isVertical)) {
      return 'aspect-[9/16] max-w-[380px] sm:max-w-[430px] mx-auto';
    }
    return 'aspect-video w-full';
  };

  // Keyboard shortcut for closing cinema mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCinemaModalOpen) {
        setIsCinemaModalOpen(false);
        sound.playBip?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCinemaModalOpen, sound]);

  const handleSelectItem = (item: PlaylistItem) => {
    sound.playBip?.();
    setSelectedItemId(item.id);
    setIsPlaying(false);
  };

  const handleStartPlay = () => {
    sound.playTeleport?.();
    setIsPlaying(true);
  };

  const handleStopPlay = () => {
    sound.playBip?.();
    setIsPlaying(false);
  };

  const handleToggleCinemaModal = () => {
    sound.playTeleport?.();
    setIsCinemaModalOpen((prev) => !prev);
    // If opening cinema modal and not yet playing, auto-start playback
    if (!isCinemaModalOpen && !isPlaying) {
      setIsPlaying(true);
    }
  };

  const filteredItems = PLAYLIST_ITEMS.filter((item) => {
    if (activeFilter === 'all') return true;
    return item.playlistGroup === activeFilter;
  });

  return (
    <div className="rounded-2xl bg-[#090D16] border border-[#1E293B] shadow-2xl overflow-hidden transition-all">
      {/* Top Header & Playlist Navigator */}
      <div className="px-4 sm:px-6 py-3.5 bg-[#131B2E]/95 border-b border-[#1E293B] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
            <Youtube className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#8B5CF6] font-bold">
                {language === 'en' ? 'PRODUCTION PROOF · MINI THEATER' : 'SẢN PHẨM THỰC TẾ · RẠP PHIM THU NHỎ'}
              </span>
              <span className="text-[#94A3B8] text-xs">·</span>
              <span className="text-[11px] text-[#94A3B8] font-mono">
                {PLAYLIST_ITEMS.length} {language === 'en' ? 'Distinct Sources' : 'Nguồn Riêng Biệt'}
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-[#F8FAFC]">
              {language === 'en' ? 'Interactive AI Video Theater & Playlists' : 'Rạp Chiếu Video AI & Danh Sách Tương Tác'}
            </h3>
          </div>
        </div>

        {/* Header Controls: Mini-Theater Fullscreen & YouTube Direct */}
        <div className="flex items-center gap-2">
          {/* Cinema Modal Trigger Button */}
          <button
            onClick={handleToggleCinemaModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-mono font-medium transition-all shadow-md shadow-[#8B5CF6]/30 cursor-pointer"
            title={language === 'en' ? 'Open Fullscreen Mini Theater' : 'Mở Rạp Phim Thu Nhỏ Toàn Màn Hình'}
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {language === 'en' ? 'Mini Theater View' : 'Rạp Phim Thu Nhỏ'}
            </span>
            <span className="sm:hidden">{language === 'en' ? 'Theater' : 'Rạp'}</span>
          </button>

          {/* Toggle inline layout (expanded vs split) */}
          <button
            onClick={() => {
              sound.playBip?.();
              setTheaterLayout((prev) => (prev === 'inline-expanded' ? 'inline-split' : 'inline-expanded'));
            }}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#090D16] border border-[#1E293B] hover:border-[#8B5CF6] text-xs font-mono text-[#94A3B8] hover:text-[#F8FAFC] transition-colors cursor-pointer"
            title={language === 'en' ? 'Toggle Wide Theater Layout' : 'Chuyển Đổi Bố Cục Rộng'}
          >
            <Monitor className="w-3.5 h-3.5 text-[#8B5CF6]" />
            <span>{theaterLayout === 'inline-expanded' ? (language === 'en' ? 'Split View' : 'Chia Đôi') : (language === 'en' ? 'Wide Theater' : 'Mở Rộng')}</span>
          </button>

          {/* External Playlists Menu */}
          <div className="flex items-center gap-1">
            <a
              href={`https://www.youtube.com/playlist?list=${PLAYLIST_1_ID}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sound.playBip?.()}
              className="px-2.5 py-1.5 rounded-lg bg-[#090D16] border border-[#1E293B] hover:border-[#8B5CF6] text-[#94A3B8] hover:text-[#F8FAFC] text-xs font-mono transition-colors flex items-center gap-1"
              title="Playlist 1 (Veo 3 & Pipeline)"
            >
              <ListVideo className="w-3 h-3 text-purple-400" />
              <span className="text-[11px]">List #1</span>
              <ExternalLink className="w-2.5 h-2.5 ml-0.5 text-[#94A3B8]" />
            </a>
            <a
              href={`https://www.youtube.com/playlist?list=${PLAYLIST_2_ID}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sound.playBip?.()}
              className="px-2.5 py-1.5 rounded-lg bg-[#090D16] border border-[#1E293B] hover:border-[#10B981] text-[#94A3B8] hover:text-[#F8FAFC] text-xs font-mono transition-colors flex items-center gap-1"
              title="Playlist 2 (PLLjOmcEguDcU)"
            >
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span className="text-[11px]">List #2</span>
              <ExternalLink className="w-2.5 h-2.5 ml-0.5 text-[#94A3B8]" />
            </a>
          </div>
        </div>
      </div>

      {/* Playlist Filter Filter Tabs */}
      <div className="px-4 sm:px-6 py-2.5 bg-[#090D16] border-b border-[#1E293B] flex items-center justify-between gap-2 overflow-x-auto text-xs font-mono">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[#94A3B8] text-[11px] mr-1">
            {language === 'en' ? 'FILTER:' : 'LỌC:'}
          </span>
          <button
            onClick={() => {
              sound.playBip?.();
              setActiveFilter('all');
            }}
            className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-[#8B5CF6] text-white font-bold'
                : 'bg-[#131B2E] text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            {language === 'en' ? 'All (5)' : 'Tất Cả (5)'}
          </button>
          <button
            onClick={() => {
              sound.playBip?.();
              setActiveFilter('playlist1');
            }}
            className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
              activeFilter === 'playlist1'
                ? 'bg-purple-600 text-white font-bold'
                : 'bg-[#131B2E] text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            {language === 'en' ? 'Playlist #1 (Pipeline)' : 'Playlist #1 (Pipeline)'}
          </button>
          <button
            onClick={() => {
              sound.playBip?.();
              setActiveFilter('playlist2');
            }}
            className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
              activeFilter === 'playlist2'
                ? 'bg-emerald-600 text-white font-bold'
                : 'bg-[#131B2E] text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            {language === 'en' ? 'Playlist #2 (PLLjOmcEguDcU)' : 'Playlist #2 (PLLjOmcEguDcU)'}
          </button>
          <button
            onClick={() => {
              sound.playBip?.();
              setActiveFilter('shorts');
            }}
            className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
              activeFilter === 'shorts'
                ? 'bg-blue-600 text-white font-bold'
                : 'bg-[#131B2E] text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            {language === 'en' ? 'HTML & Shorts' : 'HTML & Shorts'}
          </button>
        </div>

        {/* Aspect Ratio Switcher */}
        <div className="flex items-center gap-1 shrink-0">
          <span className="text-[11px] text-[#94A3B8] mr-1 hidden sm:inline">
            {language === 'en' ? 'FRAME:' : 'KHUNG:'}
          </span>
          <button
            onClick={() => {
              sound.playBip?.();
              setAspectRatioMode('auto');
            }}
            className={`px-2 py-0.5 rounded text-[10px] cursor-pointer ${
              aspectRatioMode === 'auto' ? 'bg-[#1E293B] text-[#8B5CF6] font-bold border border-[#8B5CF6]/40' : 'text-[#94A3B8]'
            }`}
            title="Auto detect ratio based on video"
          >
            Auto
          </button>
          <button
            onClick={() => {
              sound.playBip?.();
              setAspectRatioMode('16:9');
            }}
            className={`px-2 py-0.5 rounded text-[10px] cursor-pointer ${
              aspectRatioMode === '16:9' ? 'bg-[#1E293B] text-[#8B5CF6] font-bold border border-[#8B5CF6]/40' : 'text-[#94A3B8]'
            }`}
            title="16:9 Cinema Widescreen"
          >
            16:9
          </button>
          <button
            onClick={() => {
              sound.playBip?.();
              setAspectRatioMode('9:16');
            }}
            className={`px-2 py-0.5 rounded text-[10px] cursor-pointer ${
              aspectRatioMode === '9:16' ? 'bg-[#1E293B] text-[#8B5CF6] font-bold border border-[#8B5CF6]/40' : 'text-[#94A3B8]'
            }`}
            title="9:16 Shorts/Portrait Mode"
          >
            9:16
          </button>
        </div>
      </div>

      {/* Main Theater View Container (Expanded vs Split) */}
      <div className={theaterLayout === 'inline-expanded' ? 'flex flex-col' : 'grid grid-cols-1 lg:grid-cols-12'}>
        {/* Left / Top Active Theater View */}
        <div className={`${theaterLayout === 'inline-expanded' ? 'w-full' : 'lg:col-span-7'} p-4 sm:p-6 border-b ${theaterLayout === 'inline-split' ? 'lg:border-b-0 lg:border-r' : ''} border-[#1E293B] flex flex-col justify-between`}>
          <div className="space-y-4">
            {/* Viewport Frame with Smart Framing and High-Quality Visuals */}
            <div className="relative w-full rounded-2xl bg-[#03060B] border border-[#1E293B] overflow-hidden shadow-2xl group flex items-center justify-center min-h-[320px] sm:min-h-[460px]">
              {/* Subtle ambient lighting behind video frame */}
              <div className="absolute inset-0 bg-radial from-[#8B5CF6]/10 to-transparent pointer-events-none" />

              {isPlaying ? (
                <div className={`relative w-full h-full flex items-center justify-center ${currentRatioClass()}`}>
                  <iframe
                    src={activeItem.embedUrl}
                    title={language === 'en' ? activeItem.titleEn : activeItem.titleVi}
                    className="w-full h-full border-0 min-h-[300px] sm:min-h-[440px] shadow-2xl"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                  {/* Floating in-app control to stop / return to preview */}
                  <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
                    <button
                      onClick={handleToggleCinemaModal}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#090D16]/90 hover:bg-[#131B2E] border border-[#1E293B] text-xs text-[#F8FAFC] backdrop-blur-md transition-all shadow-lg cursor-pointer"
                      title={language === 'en' ? 'Open in Mini Theater modal' : 'Mở rạp chiếu toàn màn hình'}
                    >
                      <Maximize2 className="w-3 h-3 text-[#8B5CF6]" />
                      <span className="text-[11px] font-mono">{language === 'en' ? 'Fill Screen' : 'Toàn Màn Hình'}</span>
                    </button>
                    <button
                      onClick={handleStopPlay}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#090D16]/90 hover:bg-[#131B2E] border border-[#1E293B] text-xs text-[#94A3B8] hover:text-[#F8FAFC] backdrop-blur-md transition-all shadow-lg cursor-pointer"
                      title={language === 'en' ? 'Close player & return to preview' : 'Đóng player & quay lại xem trước'}
                    >
                      <Pause className="w-3 h-3 text-rose-400" />
                      <span className="text-[11px] font-mono">{language === 'en' ? 'Stop' : 'Dừng'}</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* High-Res Preview Overlay with Play Trigger */
                <div className="relative w-full h-full min-h-[320px] sm:min-h-[460px] flex flex-col justify-between p-5 sm:p-8">
                  {/* Background Artwork */}
                  <div className="absolute inset-0">
                    <DistinctThumbnail item={activeItem} />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#090D16] via-[#090D16]/75 to-transparent" />
                  </div>

                  {/* Top Preview Status */}
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#131B2E]/95 border border-[#1E293B] text-xs font-mono text-[#F8FAFC] shadow-md">
                        <Film className="w-3.5 h-3.5 text-[#8B5CF6]" />
                        <span>{language === 'en' ? activeItem.categoryEn : activeItem.categoryVi}</span>
                      </span>
                      {activeItem.isVertical && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-blue-500/10 border border-blue-500/30 text-[10px] font-mono text-blue-300">
                          <Smartphone className="w-2.5 h-2.5" />
                          <span>9:16 Shorts</span>
                        </span>
                      )}
                    </div>

                    <span className="px-2.5 py-1 rounded-md bg-black/75 border border-white/10 text-xs font-mono text-[#94A3B8] shadow-md">
                      {activeItem.duration}
                    </span>
                  </div>

                  {/* Center Big Play Button & Launch Theater CTA */}
                  <div className="relative z-10 flex flex-col items-center justify-center my-auto py-6">
                    <button
                      onClick={handleStartPlay}
                      className="group/btn relative flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white shadow-2xl shadow-[#8B5CF6]/50 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <Play className="w-9 h-9 sm:w-11 sm:h-11 fill-current ml-1 text-white" />
                      <span className="sr-only">{language === 'en' ? 'Play Video' : 'Phát Video'}</span>
                    </button>
                    <p className="mt-4 text-sm font-mono font-bold text-[#F8FAFC] tracking-wide">
                      {language === 'en' ? 'Click to Start In-App Video' : 'Nhấn Để Bắt Đầu Xem Video'}
                    </p>
                    <p className="text-xs text-[#94A3B8] font-mono mt-1">
                      {language === 'en' ? 'Native 1080p stream · No redirect' : 'Phát trực tiếp 1080p chuẩn · Không chuyển trang'}
                    </p>
                  </div>

                  {/* Bottom Preview Subtitle & Launch Mini Theater */}
                  <div className="relative z-10 flex items-center justify-between text-xs font-mono text-[#94A3B8]">
                    <span>
                      {language === 'en' ? 'Previewing source' : 'Đang xem trước'} · {activeItem.id}
                    </span>
                    <button
                      onClick={handleToggleCinemaModal}
                      className="inline-flex items-center gap-1.5 text-xs text-[#8B5CF6] hover:text-violet-300 transition-colors cursor-pointer"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>{language === 'en' ? 'Open in Mini Theater' : 'Mở Trong Rạp Phim'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Video Details & Meta */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 text-[#8B5CF6] font-bold uppercase">
                  {activeItem.type === 'playlist' ? 'YOUTUBE PLAYLIST' : 'FEATURED VIDEO'}
                </span>
                {activeItem.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#131B2E] border border-[#1E293B] text-[#94A3B8]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <h4 className="text-base sm:text-lg lg:text-xl font-bold text-[#F8FAFC]">
                {language === 'en' ? activeItem.titleEn : activeItem.titleVi}
              </h4>
              <p className="text-xs sm:text-sm text-[#94A3B8] mt-1.5 leading-relaxed max-w-4xl">
                {language === 'en' ? activeItem.descriptionEn : activeItem.descriptionVi}
              </p>
            </div>
          </div>

          {/* Action Row */}
          <div className="mt-5 pt-4 border-t border-[#1E293B] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {!isPlaying ? (
                <button
                  onClick={handleStartPlay}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-medium transition-colors shadow-lg shadow-[#8B5CF6]/30 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{language === 'en' ? 'Play Video in App' : 'Phát Video Trong Ứng Dụng'}</span>
                </button>
              ) : (
                <button
                  onClick={handleStopPlay}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#131B2E] hover:bg-[#1E293B] border border-[#1E293B] text-[#F8FAFC] text-xs font-medium transition-colors cursor-pointer"
                >
                  <Pause className="w-3.5 h-3.5 text-rose-400" />
                  <span>{language === 'en' ? 'Stop & Return to Preview' : 'Dừng & Quay Lại Xem Trước'}</span>
                </button>
              )}

              <button
                onClick={handleToggleCinemaModal}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#131B2E] hover:bg-[#1E293B] border border-[#1E293B] text-[#8B5CF6] text-xs font-mono font-medium transition-colors cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>{language === 'en' ? 'Mini Theater (Cinema)' : 'Rạp Phim Thu Nhỏ'}</span>
              </button>
            </div>

            <a
              href={activeItem.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sound.playBip?.()}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
            >
              <span>{language === 'en' ? 'View Source on YouTube' : 'Mở Nguồn trên YouTube'}</span>
              <ExternalLink className="w-3 h-3 text-[#8B5CF6]" />
            </a>
          </div>
        </div>

        {/* Playlist Video Queue (Side in Split View, or Bottom Grid in Expanded View) */}
        <div className={`${theaterLayout === 'inline-expanded' ? 'w-full' : 'lg:col-span-5'} p-4 sm:p-5 bg-[#090D16]/50 flex flex-col justify-between`}>
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#1E293B]">
              <div className="flex items-center gap-2">
                <ListVideo className="w-4 h-4 text-[#8B5CF6]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC] font-mono">
                  {language === 'en' ? 'Available Playlists & Videos' : 'Danh Sách Phát & Video'}
                </h4>
              </div>
              <span className="text-[11px] font-mono text-[#94A3B8]">
                {language === 'en' ? 'Unique Previews · Select to Load' : 'Xem Trước Riêng Biệt'}
              </span>
            </div>

            {/* List or Grid of Distinct Items */}
            <div className={theaterLayout === 'inline-expanded' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3' : 'space-y-2.5 max-h-[460px] overflow-y-auto pr-1'}>
              {filteredItems.map((item, index) => {
                const isSelected = item.id === selectedItemId;

                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelectItem(item)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer relative group flex ${
                      theaterLayout === 'inline-expanded' ? 'flex-col gap-2.5' : 'items-start gap-3'
                    } ${
                      isSelected
                        ? 'bg-[#131B2E] border-[#8B5CF6] shadow-lg shadow-violet-500/15'
                        : 'bg-[#090D16] border-[#1E293B] hover:border-[#94A3B8]/40 hover:bg-[#131B2E]/50'
                    }`}
                  >
                    {/* Index & Distinct Thumbnail Component */}
                    <div className={`relative ${theaterLayout === 'inline-expanded' ? 'w-full h-24' : 'w-24 h-16'} rounded-lg bg-black/60 border border-[#1E293B] overflow-hidden shrink-0 shadow-inner`}>
                      <DistinctThumbnail item={item} isMini={theaterLayout !== 'inline-expanded'} />
                      {isSelected && (
                        <div className="absolute inset-0 bg-[#8B5CF6]/30 flex items-center justify-center backdrop-blur-[1px]">
                          <Play className="w-5 h-5 text-white fill-current" />
                        </div>
                      )}
                    </div>

                    {/* Meta info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="text-[10px] font-mono text-[#8B5CF6] uppercase font-bold truncate">
                          #{index + 1} · {language === 'en' ? item.categoryEn : item.categoryVi}
                        </span>
                        {isSelected && (
                          <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-[#8B5CF6]/20 text-[#8B5CF6] font-bold shrink-0">
                            {isPlaying ? (language === 'en' ? 'ACTIVE' : 'ĐANG PHÁT') : (language === 'en' ? 'PREVIEW' : 'XEM TRƯỚC')}
                          </span>
                        )}
                      </div>
                      <h5 className="text-xs font-bold text-[#F8FAFC] line-clamp-1 group-hover:text-[#8B5CF6] transition-colors">
                        {language === 'en' ? item.titleEn : item.titleVi}
                      </h5>
                      <p className="text-[11px] text-[#94A3B8] line-clamp-2 mt-1 leading-relaxed">
                        {language === 'en' ? item.descriptionEn : item.descriptionVi}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Playlist Info Footer */}
          <div className="mt-4 pt-3 border-t border-[#1E293B] flex flex-wrap items-center justify-between text-[11px] text-[#94A3B8] font-mono gap-2">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#8B5CF6]" />
              {language === 'en' ? 'Zero thumbnail repetition · All playlists synced' : 'Hình thu nhỏ riêng biệt · Đồng bộ cả 2 playlist'}
            </span>
            <div className="flex items-center gap-3">
              <a
                href={`https://www.youtube.com/playlist?list=${PLAYLIST_1_ID}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-purple-300 transition-colors inline-flex items-center gap-1"
              >
                <span>List #1</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
              <a
                href={`https://www.youtube.com/playlist?list=${PLAYLIST_2_ID}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-300 transition-colors inline-flex items-center gap-1"
              >
                <span>List #2</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* FULLSCREEN MINI THEATER MODAL (Cinema Lightbox) */}
      {isCinemaModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#060910]/95 backdrop-blur-2xl flex flex-col justify-between p-3 sm:p-6 overflow-y-auto animate-fadeIn">
          {/* Cinema Header */}
          <div className="w-full max-w-6xl mx-auto flex items-center justify-between pb-3 mb-2 border-b border-[#1E293B]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 flex items-center justify-center text-[#8B5CF6]">
                <Film className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#8B5CF6] font-bold">
                    {language === 'en' ? 'MINI THEATER · CINEMA VIEW' : 'RẠP PHIM THU NHỎ · CHẾ ĐỘ RẠP'}
                  </span>
                  <span className="text-xs text-[#94A3B8]">·</span>
                  <span className="text-xs font-mono text-[#F8FAFC]">
                    {language === 'en' ? activeItem.titleEn : activeItem.titleVi}
                  </span>
                </div>
              </div>
            </div>

            {/* Cinema Header Actions */}
            <div className="flex items-center gap-3">
              {/* Aspect Ratio Switcher */}
              <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg bg-[#131B2E] border border-[#1E293B] text-xs font-mono">
                <button
                  onClick={() => setAspectRatioMode('auto')}
                  className={`px-2 py-0.5 rounded ${aspectRatioMode === 'auto' ? 'bg-[#8B5CF6] text-white' : 'text-[#94A3B8]'}`}
                >
                  Auto
                </button>
                <button
                  onClick={() => setAspectRatioMode('16:9')}
                  className={`px-2 py-0.5 rounded ${aspectRatioMode === '16:9' ? 'bg-[#8B5CF6] text-white' : 'text-[#94A3B8]'}`}
                >
                  16:9
                </button>
                <button
                  onClick={() => setAspectRatioMode('9:16')}
                  className={`px-2 py-0.5 rounded ${aspectRatioMode === '9:16' ? 'bg-[#8B5CF6] text-white' : 'text-[#94A3B8]'}`}
                >
                  9:16 Shorts
                </button>
              </div>

              <button
                onClick={handleToggleCinemaModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#131B2E] hover:bg-rose-500/20 border border-[#1E293B] hover:border-rose-500/40 text-xs font-mono text-[#F8FAFC] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4 text-rose-400" />
                <span>{language === 'en' ? 'Close Theater (ESC)' : 'Đóng Rạp (ESC)'}</span>
              </button>
            </div>
          </div>

          {/* Cinema Screen Frame: Expands to Fill Viewport */}
          <div className="w-full max-w-6xl mx-auto flex-1 flex flex-col items-center justify-center my-auto py-2">
            <div className="relative w-full rounded-2xl bg-black border border-[#1E293B] shadow-2xl overflow-hidden flex items-center justify-center min-h-[50vh] sm:min-h-[66vh]">
              {isPlaying ? (
                <div className={`relative w-full h-full flex items-center justify-center ${currentRatioClass()}`}>
                  <iframe
                    src={activeItem.embedUrl}
                    title={language === 'en' ? activeItem.titleEn : activeItem.titleVi}
                    className="w-full h-full border-0 min-h-[50vh] sm:min-h-[66vh] shadow-2xl"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="relative w-full h-full min-h-[50vh] sm:min-h-[66vh] flex flex-col items-center justify-center p-6 text-center">
                  <div className="absolute inset-0">
                    <DistinctThumbnail item={activeItem} />
                    <div className="absolute inset-0 bg-[#090D16]/80 backdrop-blur-sm" />
                  </div>
                  <div className="relative z-10 flex flex-col items-center">
                    <button
                      onClick={handleStartPlay}
                      className="flex items-center justify-center w-24 h-24 rounded-3xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white shadow-2xl shadow-[#8B5CF6]/50 transition-all hover:scale-105 active:scale-95 cursor-pointer mb-4"
                    >
                      <Play className="w-12 h-12 fill-current ml-1 text-white" />
                    </button>
                    <h3 className="text-xl font-bold text-[#F8FAFC]">
                      {language === 'en' ? activeItem.titleEn : activeItem.titleVi}
                    </h3>
                    <p className="text-sm text-[#94A3B8] max-w-xl mt-2 font-mono">
                      {language === 'en' ? activeItem.descriptionEn : activeItem.descriptionVi}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Cinema Bottom Queue Strip: Click Any Video to Immediately Watch */}
          <div className="w-full max-w-6xl mx-auto pt-3 border-t border-[#1E293B]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-[#F8FAFC] uppercase tracking-wider">
                {language === 'en' ? 'Cinema Playlist Queue' : 'Hàng Đợi Rạp Chiếu'}
              </span>
              <span className="text-[11px] font-mono text-[#94A3B8]">
                {language === 'en' ? 'Click any card to switch video' : 'Nhấn vào thẻ để chuyển video ngay'}
              </span>
            </div>

            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {PLAYLIST_ITEMS.map((item, index) => {
                const isSelected = item.id === selectedItemId;

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      handleSelectItem(item);
                      setIsPlaying(true); // Auto-start in cinema modal
                    }}
                    className={`min-w-[220px] sm:min-w-[260px] p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-2.5 shrink-0 ${
                      isSelected
                        ? 'bg-[#131B2E] border-[#8B5CF6] shadow-lg shadow-[#8B5CF6]/20'
                        : 'bg-[#090D16] border-[#1E293B] hover:border-[#94A3B8]/50'
                    }`}
                  >
                    <div className="w-16 h-12 rounded-lg bg-black/60 border border-[#1E293B] overflow-hidden shrink-0 relative">
                      <DistinctThumbnail item={item} isMini={true} />
                      {isSelected && (
                        <div className="absolute inset-0 bg-[#8B5CF6]/30 flex items-center justify-center">
                          <Play className="w-3.5 h-3.5 text-white fill-current" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[9px] font-mono text-[#8B5CF6] uppercase font-bold block truncate">
                        #{index + 1} · {item.duration}
                      </span>
                      <h5 className="text-xs font-bold text-[#F8FAFC] truncate">
                        {language === 'en' ? item.titleEn : item.titleVi}
                      </h5>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
