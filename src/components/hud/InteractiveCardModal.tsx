import React, { useState } from 'react';
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

  if (!card) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(card.url);
    setCopied(true);
    sound.playBip(800, 0.05);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCardIcon = (type: TradingCardItem['type']) => {
    switch (type) {
      case 'youtube': return <Youtube className="w-5 h-5 text-[#8B5CF6]" />;
      case 'doc': return <FileText className="w-5 h-5 text-[#8B5CF6]" />;
      case 'drive': return <FileText className="w-5 h-5 text-[#8B5CF6]" />;
      case 'github': return <FolderGit2 className="w-5 h-5 text-[#8B5CF6]" />;
      default: return <Laptop className="w-5 h-5 text-[#8B5CF6]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl max-h-[92vh] flex flex-col rounded-2xl bg-[#131B2E] border border-[#1E293B] shadow-2xl overflow-y-auto text-[#F8FAFC]">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 sm:p-5 bg-[#090D16]/95 backdrop-blur-md border-b border-[#1E293B]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#131B2E] border border-[#1E293B]">
              {getCardIcon(card.type)}
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
                <span className="text-[#8B5CF6] font-medium">
                  {language === 'en' ? card.categoryEn : card.categoryVi}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1 text-[11px]">
                  <Clock className="w-3 h-3 text-[#94A3B8]" />
                  {formatReadTime(card.readTimeEstimate, language)}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#F8FAFC] mt-0.5">
                {card.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E293B] transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Card Body */}
        <div className="p-6 space-y-4">
          <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
            {language === 'en' ? card.descriptionEn : card.descriptionVi}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#1E293B] text-[11px] text-[#94A3B8]">
            {card.tags.map(tag => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-md bg-[#090D16] border border-[#1E293B]"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Direct URL Preview */}
          <div className="p-3 rounded-xl bg-[#090D16] border border-[#1E293B] flex items-center justify-between text-xs font-mono">
            <span className="text-[#94A3B8] truncate max-w-[70%]">
              {card.url}
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#131B2E] hover:bg-[#1E293B] text-[#F8FAFC] border border-[#1E293B] transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#8B5CF6]" /> : <Copy className="w-3.5 h-3.5 text-[#94A3B8]" />}
              <span>{copied ? (language === 'en' ? 'COPIED' : 'ĐÃ CHÉP') : (language === 'en' ? 'COPY' : 'CHÉP')}</span>
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#090D16]/60 border-t border-[#1E293B] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
          >
            {language === 'en' ? 'Close' : 'Đóng'}
          </button>

          <a
            href={card.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sound.playTeleport()}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-medium text-xs shadow-md shadow-[#8B5CF6]/30 transition-colors"
          >
            <span>{language === 'en' ? 'Open Resource' : 'Mở liên kết'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
