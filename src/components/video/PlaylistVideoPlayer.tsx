import React, { useState } from 'react';
import { Play, Pause, Youtube, ExternalLink, ListVideo, Sparkles, Film, ArrowRight } from 'lucide-react';

interface PlaylistVideoPlayerProps {
  language: 'en' | 'vi';
  sound: {
    playBip?: (freq?: number, duration?: number) => void;
    playTeleport?: () => void;
  };
}

interface PlaylistItem {
  id: string;
  type: 'video' | 'playlist';
  videoId?: string;
  playlistId?: string;
  titleEn: string;
  titleVi: string;
  categoryEn: string;
  categoryVi: string;
  duration: string;
  tags: string[];
  descriptionEn: string;
  descriptionVi: string;
  thumbnailUrl: string;
  embedUrl: string;
  externalUrl: string;
}

const PLAYLIST_ID = 'PL8l48rFpYhhaFUDxydFt2tTY55rpb9rWi';

const PLAYLIST_ITEMS: PlaylistItem[] = [
  {
    id: 'sfqya6_maw4',
    type: 'video',
    videoId: 'SfQYA6_Maw4',
    titleEn: 'AI HTML Video Creation (Remotion · Hyperframes · Concat)',
    titleVi: 'Sản Xuất Video AI Bằng HTML (Remotion · Hyperframes · Concat)',
    categoryEn: 'Production Showcase',
    categoryVi: 'Sản Phẩm Mẫu',
    duration: '0:45',
    tags: ['Remotion', 'Hyperframes', 'Concat', 'AI HTML Video'],
    descriptionEn: 'Demonstration showing programmatic AI video workflows: HTML/CSS web layer composing, kinetic typography rendering, and automated multi-segment stitching.',
    descriptionVi: 'Minh họa quy trình sản xuất video AI lập trình: render layout web HTML/CSS, hiệu ứng kinetic typography và tự động ghép nối đa phân cảnh.',
    thumbnailUrl: 'https://img.youtube.com/vi/SfQYA6_Maw4/hqdefault.jpg',
    embedUrl: 'https://www.youtube-nocookie.com/embed/SfQYA6_Maw4?autoplay=1&rel=0&modestbranding=1',
    externalUrl: 'https://www.youtube.com/shorts/SfQYA6_Maw4'
  },
  {
    id: 'full_playlist_stream',
    type: 'playlist',
    playlistId: PLAYLIST_ID,
    titleEn: 'Full AI Video Pipeline Playlist Stream',
    titleVi: 'Phát Trọn Bộ Danh Sách Video AI Pipeline',
    categoryEn: 'Continuous Playlist',
    categoryVi: 'Danh Sách Phát Liên Tục',
    duration: 'Multi-Video',
    tags: ['YouTube Playlist', 'Full Queue', 'Workflow Series'],
    descriptionEn: 'Watch the entire curated AI Video series in continuous playback mode with YouTube in-player next/previous navigation.',
    descriptionVi: 'Xem toàn bộ chuỗi video AI tổng hợp ở chế độ phát liên tục với đầy đủ thanh điều khiển chuyển bài của YouTube.',
    thumbnailUrl: 'https://img.youtube.com/vi/SfQYA6_Maw4/hqdefault.jpg',
    embedUrl: `https://www.youtube-nocookie.com/embed/videoseries?list=${PLAYLIST_ID}&autoplay=1&rel=0&modestbranding=1`,
    externalUrl: `https://www.youtube.com/playlist?list=${PLAYLIST_ID}`
  }
];

export const PlaylistVideoPlayer: React.FC<PlaylistVideoPlayerProps> = ({ language, sound }) => {
  const [selectedItemId, setSelectedItemId] = useState<string>(PLAYLIST_ITEMS[0].id);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const activeItem = PLAYLIST_ITEMS.find((item) => item.id === selectedItemId) || PLAYLIST_ITEMS[0];

  const handleSelectItem = (item: PlaylistItem) => {
    sound.playBip?.();
    setSelectedItemId(item.id);
    setIsPlaying(false); // Reset to preview mode when user picks a different video
  };

  const handleStartPlay = () => {
    sound.playTeleport?.();
    setIsPlaying(true);
  };

  const handleStopPlay = () => {
    sound.playBip?.();
    setIsPlaying(false);
  };

  return (
    <div className="rounded-2xl bg-[#090D16] border border-[#1E293B] shadow-2xl overflow-hidden transition-all">
      {/* Header Bar */}
      <div className="px-4 sm:px-6 py-3.5 bg-[#131B2E]/90 border-b border-[#1E293B] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <Youtube className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#8B5CF6] font-bold">
                {language === 'en' ? 'PRODUCTION PROOF · IN-APP THEATER' : 'SẢN PHẨM THỰC TẾ · RẠP CHIẾU TRONG ỨNG DỤNG'}
              </span>
              <span className="text-[#94A3B8] text-xs">·</span>
              <span className="text-[11px] text-[#94A3B8] font-mono">
                {PLAYLIST_ITEMS.length} {language === 'en' ? 'Video Sources' : 'Nguồn Video'}
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-[#F8FAFC]">
              {language === 'en' ? 'Curated AI Video Showcase Player' : 'Trình Phát Trình Diễn Video AI Chọn Lọc'}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`https://www.youtube.com/playlist?list=${PLAYLIST_ID}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sound.playBip?.()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#090D16] border border-[#1E293B] hover:border-[#8B5CF6] text-[#94A3B8] hover:text-[#F8FAFC] text-xs font-mono transition-colors"
          >
            <ListVideo className="w-3.5 h-3.5 text-[#8B5CF6]" />
            <span className="hidden sm:inline">{language === 'en' ? 'Open Playlist on YouTube' : 'Mở Playlist trên YouTube'}</span>
            <span className="sm:hidden">{language === 'en' ? 'Playlist' : 'Playlist'}</span>
            <ExternalLink className="w-3 h-3 ml-0.5 text-[#94A3B8]" />
          </a>
        </div>
      </div>

      {/* Main Theater & Queue Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Left / Top: Active Theater (7 cols on Desktop) */}
        <div className="lg:col-span-7 p-4 sm:p-6 border-b lg:border-b-0 lg:border-r border-[#1E293B] flex flex-col justify-between">
          <div className="space-y-4">
            {/* Viewport Frame */}
            <div className="relative w-full aspect-video rounded-xl bg-black/80 border border-[#1E293B] overflow-hidden shadow-inner group">
              {isPlaying ? (
                <div className="relative w-full h-full">
                  <iframe
                    src={activeItem.embedUrl}
                    title={language === 'en' ? activeItem.titleEn : activeItem.titleVi}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                  {/* Floating in-app control to stop / return to preview */}
                  <button
                    onClick={handleStopPlay}
                    className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#090D16]/90 hover:bg-[#131B2E] border border-[#1E293B] text-xs text-[#94A3B8] hover:text-[#F8FAFC] backdrop-blur-md transition-all shadow-lg cursor-pointer"
                    title={language === 'en' ? 'Close player & return to preview' : 'Đóng player & quay lại xem trước'}
                  >
                    <Pause className="w-3 h-3 text-[#8B5CF6]" />
                    <span>{language === 'en' ? 'Close Player' : 'Dừng Xem'}</span>
                  </button>
                </div>
              ) : (
                /* High-Res Preview Overlay with Play Trigger */
                <div className="relative w-full h-full flex flex-col justify-between p-4 sm:p-6">
                  {/* Thumbnail Background */}
                  <img
                    src={activeItem.thumbnailUrl}
                    alt={language === 'en' ? activeItem.titleEn : activeItem.titleVi}
                    className="absolute inset-0 w-full h-full object-cover opacity-35 group-hover:opacity-45 transition-opacity duration-500 scale-105 group-hover:scale-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#090D16] via-[#090D16]/60 to-transparent" />

                  {/* Top Preview Status */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#131B2E]/90 border border-[#1E293B] text-[11px] font-mono text-[#F8FAFC]">
                      <Film className="w-3 h-3 text-[#8B5CF6]" />
                      <span>{language === 'en' ? activeItem.categoryEn : activeItem.categoryVi}</span>
                    </span>

                    <span className="px-2 py-0.5 rounded-md bg-black/60 border border-white/10 text-[11px] font-mono text-[#94A3B8]">
                      {activeItem.duration}
                    </span>
                  </div>

                  {/* Center Big Play Button */}
                  <div className="relative z-10 flex flex-col items-center justify-center my-auto py-4">
                    <button
                      onClick={handleStartPlay}
                      className="group/btn relative flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white shadow-xl shadow-[#8B5CF6]/40 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <Play className="w-7 h-7 sm:w-9 sm:h-9 fill-current ml-1 text-white" />
                      <span className="sr-only">{language === 'en' ? 'Play Video' : 'Phát Video'}</span>
                    </button>
                    <p className="mt-3 text-xs font-mono font-medium text-[#F8FAFC] tracking-wide">
                      {language === 'en' ? 'Click to Watch In-App' : 'Nhấn Để Xem Trong Ứng Dụng'}
                    </p>
                  </div>

                  {/* Bottom Preview Subtitle */}
                  <div className="relative z-10">
                    <p className="text-xs text-[#94A3B8] font-mono truncate">
                      {language === 'en' ? 'Preview Mode · Click play to start YouTube stream' : 'Chế độ xem trước · Nhấn play để tải video'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Video Details & Meta */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                {activeItem.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#131B2E] border border-[#1E293B] text-[#94A3B8]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <h4 className="text-base sm:text-lg font-bold text-[#F8FAFC]">
                {language === 'en' ? activeItem.titleEn : activeItem.titleVi}
              </h4>
              <p className="text-xs sm:text-sm text-[#94A3B8] mt-1.5 leading-relaxed">
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
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-medium transition-colors shadow-lg shadow-[#8B5CF6]/30 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{language === 'en' ? 'Play Video in App' : 'Phát Video Trong Ứng Dụng'}</span>
                </button>
              ) : (
                <button
                  onClick={handleStopPlay}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#131B2E] hover:bg-[#1E293B] border border-[#1E293B] text-[#F8FAFC] text-xs font-medium transition-colors cursor-pointer"
                >
                  <Pause className="w-3.5 h-3.5 text-[#8B5CF6]" />
                  <span>{language === 'en' ? 'Stop & Return to Preview' : 'Dừng & Quay Lại Xem Trước'}</span>
                </button>
              )}
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

        {/* Right / Bottom: Playlist Video Queue (5 cols on Desktop) */}
        <div className="lg:col-span-5 p-4 sm:p-5 bg-[#090D16]/50 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#1E293B]">
              <div className="flex items-center gap-2">
                <ListVideo className="w-4 h-4 text-[#8B5CF6]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC] font-mono">
                  {language === 'en' ? 'Playlist Queue' : 'Danh Sách Chờ'}
                </h4>
              </div>
              <span className="text-[11px] font-mono text-[#94A3B8]">
                {language === 'en' ? 'Select to Preview' : 'Chọn Để Xem Trước'}
              </span>
            </div>

            {/* List of items */}
            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {PLAYLIST_ITEMS.map((item, index) => {
                const isSelected = item.id === selectedItemId;

                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelectItem(item)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer relative group flex items-start gap-3 ${
                      isSelected
                        ? 'bg-[#131B2E] border-[#8B5CF6] shadow-md shadow-violet-500/10'
                        : 'bg-[#090D16] border-[#1E293B] hover:border-[#94A3B8]/40 hover:bg-[#131B2E]/40'
                    }`}
                  >
                    {/* Index & Thumbnail */}
                    <div className="relative w-20 h-14 rounded-lg bg-black/60 border border-[#1E293B] overflow-hidden shrink-0">
                      <img
                        src={item.thumbnailUrl}
                        alt={language === 'en' ? item.titleEn : item.titleVi}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1 right-1 px-1 py-0.2 rounded bg-black/80 text-[9px] font-mono text-white">
                        {item.duration}
                      </span>
                      {isSelected && (
                        <div className="absolute inset-0 bg-[#8B5CF6]/20 flex items-center justify-center">
                          <Play className="w-4 h-4 text-white fill-current" />
                        </div>
                      )}
                    </div>

                    {/* Meta info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-mono text-[#8B5CF6] uppercase font-bold">
                          #{index + 1} · {language === 'en' ? item.categoryEn : item.categoryVi}
                        </span>
                        {isSelected && (
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#8B5CF6]/20 text-[#8B5CF6] font-bold">
                            {isPlaying ? (language === 'en' ? 'PLAYING' : 'ĐANG PHÁT') : (language === 'en' ? 'PREVIEW' : 'XEM TRƯỚC')}
                          </span>
                        )}
                      </div>
                      <h5 className="text-xs font-bold text-[#F8FAFC] line-clamp-1 mt-0.5 group-hover:text-[#8B5CF6] transition-colors">
                        {language === 'en' ? item.titleEn : item.titleVi}
                      </h5>
                      <p className="text-[11px] text-[#94A3B8] line-clamp-1 mt-0.5">
                        {language === 'en' ? item.descriptionEn : item.descriptionVi}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Playlist Tip Footer */}
          <div className="mt-4 pt-3 border-t border-[#1E293B] flex items-center justify-between text-[11px] text-[#94A3B8] font-mono">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6]" />
              {language === 'en' ? 'Native 1080p Web Embed' : 'Trình phát Web 1080p chuẩn'}
            </span>
            <a
              href={`https://www.youtube.com/playlist?list=${PLAYLIST_ID}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#F8FAFC] transition-colors inline-flex items-center gap-1"
            >
              <span>{language === 'en' ? 'Open Full List' : 'Mở Cả Danh Sách'}</span>
              <ArrowRight className="w-3 h-3 text-[#8B5CF6]" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
