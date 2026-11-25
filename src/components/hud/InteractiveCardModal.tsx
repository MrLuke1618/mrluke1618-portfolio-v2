import React, { useState, useEffect } from 'react';
import { TradingCardItem } from '../../types/game';
import { sound } from '../../constants/soundEffects';
import { ExternalLink, Copy, Check, X, Clock, Youtube, FileText, FolderGit2, Laptop } from 'lucide-react';
import { formatReadTime } from '../../utils/readingTime';

interface InteractiveCardModalProps {
  card: TradingCardItem | null;
  onClose: () => void;
  language: 'en' | 'vi';
}

export const InteractiveCardModal: React.FC<InteractiveCardModalProps> = ({ card, onClose, language }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (card && card.type === 'youtube') {
      window.dispatchEvent(
        new CustomEvent('ai-portfolio:pause-videos', {
          detail: { source: 'card-modal' },
        })
      );
    }

    const handleGlobalPause = (e: Event) => {
      const customEvent = e as CustomEvent<{ source?: string }>;
      if (customEvent.detail?.source && customEvent.detail.source !== 'card-modal') {
        onClose();
      }
    };
    window.addEventListener('ai-portfolio:pause-videos', handleGlobalPause);
    return () => window.removeEventListener('ai-portfolio:pause-videos', handleGlobalPause);
  }, [card, onClose]);

  if (!card) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(card.url);
    setCopied(true);
    sound.playBip(800, 0.05);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCardIcon = (type: TradingCardItem['type']) => {
    switch (type) {
      case 'youtube':
        return <Youtube className="h-5 w-5 text-rose-400" />;
      case 'doc':
      case 'drive':
        return <FileText className="h-5 w-5 text-[#8B5CF6]" />;
      case 'github':
        return <FolderGit2 className="h-5 w-5 text-[#8B5CF6]" />;
      default:
        return <Laptop className="h-5 w-5 text-[#8B5CF6]" />;
    }
  };

  const getYouTubeEmbedInfo = (url: string) => {
    if (!url) return null;
    const shortsMatch = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
    if (shortsMatch) {
      return {
        embedUrl: `https://www.youtube.com/embed/${shortsMatch[1]}?rel=0&modestbranding=1`,
        isShorts: true,
      };
    }
    const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
    if (watchMatch) {
      return {
        embedUrl: `https://www.youtube.com/embed/${watchMatch[1]}?rel=0&modestbranding=1`,
        isShorts: false,
      };
    }
    const playlistMatch = url.match(/[?&]list=([a-zA-Z0-9_-]+)/);
    if (playlistMatch) {
      const listId = playlistMatch[1];
      if (listId === 'PL8l48rFpYhhaFUDxydFt2tTY55rpb9rWi') {
        return {
          embedUrl: `https://www.youtube.com/embed/p_pr8RI3T-c?list=${listId}&rel=0&modestbranding=1`,
          isShorts: false,
        };
      }
      return {
        embedUrl: `https://www.youtube.com/embed/videoseries?list=${listId}&rel=0`,
        isShorts: false,
      };
    }
    return null;
  };

  const ytInfo = getYouTubeEmbedInfo(card.url);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-3 backdrop-blur-md sm:p-5"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative flex max-h-[84vh] w-[92vw] max-w-4xl flex-col overflow-hidden rounded-2xl border border-[#1E293B] bg-[#131B2E] text-[#F8FAFC] shadow-2xl">
        {/* Compact Single-Row Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-[#1E293B] bg-[#090D16]/95 px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="shrink-0 rounded-xl border border-[#1E293B] bg-[#131B2E] p-2">
              {getCardIcon(card.type)}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
                <span className="font-medium text-[#8B5CF6]">
                  {language === 'en' ? card.categoryEn : card.categoryVi}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1 text-[11px]">
                  <Clock className="h-3 w-3 text-[#94A3B8]" />
                  {formatReadTime(card.readTimeEstimate, language)}
                </span>
              </div>
              <h3 className="mt-0.5 truncate text-base font-bold text-[#F8FAFC] sm:text-lg">
                {card.title}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="ml-2 shrink-0 rounded-lg p-1.5 text-[#94A3B8] transition hover:bg-[#1E293B] hover:text-white"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Zero-Scroll Body */}
        {ytInfo ? (
          <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 overflow-hidden p-4 md:grid-cols-12">
            {/* Left: Embedded YouTube Player */}
            <div
              className={`${
                ytInfo.isShorts ? 'md:col-span-5' : 'md:col-span-7'
              } flex items-center justify-center overflow-hidden rounded-xl border border-[#1E293B] bg-[#090D16] p-2`}
            >
              <div
                className={
                  ytInfo.isShorts
                    ? 'aspect-[9/16] h-[56vh] max-h-[460px]'
                    : 'aspect-video max-h-[56vh] w-full'
                }
              >
                <iframe
                  src={ytInfo.embedUrl}
                  title={card.title}
                  className="h-full w-full rounded-lg border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>

            {/* Right: Metadata, Tags, URL & Actions */}
            <div
              className={`${
                ytInfo.isShorts ? 'md:col-span-7' : 'md:col-span-5'
              } flex min-h-0 flex-col justify-between gap-3 overflow-hidden`}
            >
              <div className="space-y-3 overflow-hidden">
                <p className="text-xs leading-relaxed text-[#CBD5E1] sm:text-sm">
                  {language === 'en' ? card.descriptionEn : card.descriptionVi}
                </p>

                <div className="flex flex-wrap items-center gap-1.5 border-t border-[#1E293B] pt-3 text-[11px] text-[#94A3B8]">
                  {card.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-[#1E293B] bg-[#090D16] px-2 py-0.5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between gap-2 rounded-xl border border-[#1E293B] bg-[#090D16] p-2.5 font-mono text-xs">
                  <span className="truncate text-[#94A3B8]">{card.url}</span>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="flex shrink-0 items-center gap-1 rounded border border-[#1E293B] bg-[#131B2E] px-2.5 py-1 text-[11px] text-[#F8FAFC] hover:bg-[#1E293B]"
                  >
                    {copied ? (
                      <Check className="h-3.5 w-3.5 text-[#8B5CF6]" />
                    ) : (
                      <Copy className="h-3.5 w-3.5 text-[#94A3B8]" />
                    )}
                    <span>{copied ? (language === 'en' ? 'COPIED' : 'ĐÃ CHÉP') : (language === 'en' ? 'COPY' : 'CHÉP')}</span>
                  </button>
                </div>
              </div>

              <div className="flex shrink-0 items-center justify-between border-t border-[#1E293B] pt-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-[#1E293B] bg-[#090D16] px-4 py-2 text-xs font-medium text-[#94A3B8] transition hover:text-white"
                >
                  {language === 'en' ? 'Close' : 'Đóng'}
                </button>

                <a
                  href={card.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => sound.playTeleport()}
                  className="flex items-center gap-2 rounded-xl bg-[#8B5CF6] px-5 py-2 text-xs font-bold text-white shadow-md shadow-[#8B5CF6]/30 transition hover:bg-[#7C3AED]"
                >
                  <span>{language === 'en' ? 'Watch on YouTube' : 'Xem trên YouTube'}</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-4 overflow-hidden p-5">
              <p className="text-xs leading-relaxed text-[#CBD5E1] sm:text-sm">
                {language === 'en' ? card.descriptionEn : card.descriptionVi}
              </p>

              <div className="flex flex-wrap items-center gap-1.5 border-t border-[#1E293B] pt-3 text-[11px] text-[#94A3B8]">
                {card.tags.map((tag) => (
                  <span key={tag} className="rounded-md border border-[#1E293B] bg-[#090D16] px-2 py-0.5">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between gap-2 rounded-xl border border-[#1E293B] bg-[#090D16] p-3 font-mono text-xs">
                <span className="truncate text-[#94A3B8]">{card.url}</span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex shrink-0 items-center gap-1.5 rounded border border-[#1E293B] bg-[#131B2E] px-2.5 py-1 text-[#F8FAFC] hover:bg-[#1E293B]"
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-[#8B5CF6]" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 text-[#94A3B8]" />
                  )}
                  <span>{copied ? (language === 'en' ? 'COPIED' : 'ĐÃ CHÉP') : (language === 'en' ? 'COPY' : 'CHÉP')}</span>
                </button>
              </div>
            </div>

            <div className="flex shrink-0 items-center justify-between border-t border-[#1E293B] bg-[#090D16]/60 p-4">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl px-4 py-2 text-xs font-medium text-[#94A3B8] transition hover:text-white"
              >
                {language === 'en' ? 'Close' : 'Đóng'}
              </button>

              <a
                href={card.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sound.playTeleport()}
                className="flex items-center gap-2 rounded-xl bg-[#8B5CF6] px-5 py-2 text-xs font-bold text-white shadow-md shadow-[#8B5CF6]/30 transition hover:bg-[#7C3AED]"
              >
                <span>{language === 'en' ? 'Open Resource' : 'Mở liên kết'}</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
