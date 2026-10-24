import React, { useState } from 'react';
import { EasterEggSnippet } from '../../types/game';
import { sound } from '../../constants/soundEffects';
import { Terminal, Copy, Check, X, Code2 } from 'lucide-react';

interface EasterEggModalProps {
  snippet: EasterEggSnippet | null;
  onClose: () => void;
  language: 'en' | 'vi';
}

export const EasterEggModal: React.FC<EasterEggModalProps> = ({ snippet, onClose, language }) => {
  const [copied, setCopied] = useState(false);

  if (!snippet) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    sound.playBip(880, 0.06);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-2xl bg-[#131B2E] border border-[#1E293B] shadow-2xl overflow-hidden font-mono text-xs text-[#F8FAFC]">
        {/* Terminal Title Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#090D16] border-b border-[#1E293B] text-[#94A3B8]">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#8B5CF6]" />
            <span className="font-semibold text-[#F8FAFC]">{snippet.filename}</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#131B2E] text-[#8B5CF6] border border-[#1E293B]">
              {snippet.tag}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#131B2E] hover:bg-[#1E293B] text-[#F8FAFC] border border-[#1E293B] transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#8B5CF6]" /> : <Copy className="w-3.5 h-3.5 text-[#94A3B8]" />}
              <span>{copied ? (language === 'en' ? 'Copied' : 'Đã chép') : (language === 'en' ? 'Copy Code' : 'Sao chép')}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E293B] transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Technical Header & Description */}
        <div className="p-4 bg-[#131B2E] border-b border-[#1E293B] flex items-start gap-3">
          <div className="p-2 rounded-lg bg-[#090D16] border border-[#1E293B] text-[#8B5CF6]">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-[#F8FAFC]">
              {snippet.title}
            </div>
            <p className="text-xs text-[#94A3B8] mt-1 leading-relaxed">
              {language === 'en' ? snippet.descriptionEn : snippet.descriptionVi}
            </p>
          </div>
        </div>

        {/* Code Content */}
        <div className="flex-1 overflow-auto p-4 bg-[#090D16] font-mono text-[#F8FAFC] text-[11px] leading-relaxed select-text">
          <pre className="whitespace-pre overflow-x-auto text-[#8B5CF6]">
            <code>{snippet.code}</code>
          </pre>
        </div>

        {/* Footer status */}
        <div className="px-4 py-2.5 bg-[#090D16] border-t border-[#1E293B] flex items-center justify-between text-[11px] text-[#94A3B8]">
          <span>Source Snippet for Technical Verification</span>
          <span className="font-mono">UTF-8 · Clean Engineering</span>
        </div>
      </div>
    </div>
  );
};
