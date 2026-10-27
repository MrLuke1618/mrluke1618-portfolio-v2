import React, { useState } from 'react';
import { TradingCardItem } from '../../types/game';
import { TRADING_CARDS } from '../../constants/gameData';
import { sound } from '../../constants/soundEffects';
import { Cpu, Terminal, ShieldCheck, Binary, Eye } from 'lucide-react';

import { formatReadTime } from '../../utils/readingTime';

interface AILabZoneProps {
  onOpenCard: (card: TradingCardItem) => void;
  onOpenEasterEgg: (snippetId: string) => void;
  language: 'en' | 'vi';
}

export const AILabZone: React.FC<AILabZoneProps> = ({
  onOpenCard,
  onOpenEasterEgg,
  language
}) => {
  const [terminalOutput, setTerminalOutput] = useState<string[]>(() =>
    language === 'en'
      ? [
          'Systems Automation diagnostic environment initialized.',
          'Ready for diagnostic command execution...'
        ]
      : [
          'Môi trường chẩn đoán Tự động hóa Hệ thống đã khởi tạo.',
          'Sẵn sàng thực thi lệnh kiểm tra...'
        ]
  );
  const [isExecuting, setIsExecuting] = useState(false);

  // Sync initial log on language switch if unmodified
  React.useEffect(() => {
    setTerminalOutput(
      language === 'en'
        ? [
            'Systems Automation diagnostic environment initialized.',
            'Ready for diagnostic command execution...'
          ]
        : [
            'Môi trường chẩn đoán Tự động hóa Hệ thống đã khởi tạo.',
            'Sẵn sàng thực thi lệnh kiểm tra...'
          ]
    );
  }, [language]);

  const runCommand = (cmd: string) => {
    sound.playTerminalClick();
    setIsExecuting(true);
    setTerminalOutput(prev => [...prev, `$ ${cmd}`]);

    setTimeout(() => {
      let outputLine = '';
      if (cmd.includes('cargo test')) {
        outputLine = language === 'en'
          ? 'test tests::test_signature_resolution ... ok (0.001s). 1 passed; 0 failed.'
          : 'test tests::test_signature_resolution ... thành công (0.001s). 1 đạt; 0 lỗi.';
      } else if (cmd.includes('modder inspect')) {
        outputLine = language === 'en'
          ? 'Pattern match found at memory address 0x7FFF0042 [Hook verified].'
          : 'Tìm thấy mẫu khớp tại địa chỉ bộ nhớ 0x7FFF0042 [Đã xác thực hook].';
      } else if (cmd.includes('antigravity')) {
        outputLine = language === 'en'
          ? 'Workflow pipeline dispatch completed: 3 video artifacts generated.'
          : 'Hoàn tất điều phối quy trình tự động: Đã tạo 3 tệp video.';
      } else {
        outputLine = language === 'en'
          ? 'Process finished with exit code 0.'
          : 'Tiến trình kết thúc với mã trạng thái 0.';
      }
      setTerminalOutput(prev => [...prev, outputLine]);
      setIsExecuting(false);
      sound.playBip(900, 0.05);
    }, 600);
  };

  const aiCards = TRADING_CARDS.filter(
    c => c.categoryEn.includes('Systems') || c.tags.includes('Rust') || c.tags.includes('AI')
  );

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Zone Header Banner */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-[#131B2E] border border-[#1E293B] shadow-2xl overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-[#8B5CF6] text-xs font-medium mb-3">
              <Cpu className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'Rust Systems & Automation Engineering' : 'Lập trình Hệ thống Rust & Tự động hóa'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#F8FAFC] tracking-tight">
              {language === 'en' ? 'Systems & Engineering Lab' : 'Phòng Kỹ Thuật & Hệ Thống'}
            </h2>
            <p className="mt-2 text-sm text-[#94A3B8] max-w-2xl leading-relaxed">
              {language === 'en'
                ? 'Engineering high-throughput systems, zero-cost memory abstractions in Rust, CLI toolchains, and automated continuous asset rendering.'
                : 'Lập trình hệ thống hiệu năng cao với Rust, xây dựng công cụ dòng lệnh (CLI), và tự động hóa quy trình kết xuất tài nguyên.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                onOpenEasterEgg('rust-modder');
                sound.playTeleport();
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-medium transition-colors shadow-md shadow-[#8B5CF6]/30"
            >
              <Binary className="w-4 h-4" />
              <span>{language === 'en' ? 'Inspect Rust Crate' : 'Xem Code Rust'}</span>
            </button>
            <button
              onClick={() => {
                onOpenEasterEgg('antigravity-workflow');
                sound.playTeleport();
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#090D16] hover:bg-[#1E293B] text-[#F8FAFC] border border-[#1E293B] text-xs font-medium transition-colors"
            >
              <Terminal className="w-4 h-4 text-[#8B5CF6]" />
              <span>AntiGravity YAML</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Command Terminal Simulator */}
      <div className="rounded-2xl bg-[#090D16] border border-[#1E293B] shadow-xl overflow-hidden font-mono text-xs">
        {/* Terminal Header */}
        <div className="px-4 py-2.5 bg-[#131B2E] border-b border-[#1E293B] flex items-center justify-between text-[#94A3B8]">
          <div className="flex items-center gap-2">
            <span className="text-[#F8FAFC] font-semibold">
              {language === 'en' ? 'Terminal: Rust Toolchain & Workflow Engine' : 'Dòng lệnh: Bộ công cụ Rust & Động cơ Quy trình'}
            </span>
          </div>
          <span className="text-[10px] text-[#8B5CF6] flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            {language === 'en' ? 'READY' : 'SẴN SÀNG'}
          </span>
        </div>

        {/* Command Buttons */}
        <div className="p-3 bg-[#131B2E]/60 border-b border-[#1E293B] flex flex-wrap items-center gap-2">
          <span className="text-[10px] text-[#94A3B8] mr-2">
            {language === 'en' ? 'EXECUTE:' : 'THỰC THI:'}
          </span>
          <button
            onClick={() => runCommand('cargo test --lib -- --nocapture')}
            disabled={isExecuting}
            className="px-2.5 py-1 rounded bg-[#090D16] hover:bg-[#1E293B] text-[#F8FAFC] border border-[#1E293B] transition-colors"
          >
            cargo test (PatternSig)
          </button>
          <button
            onClick={() => runCommand('modder inspect --target ./binary.exe')}
            disabled={isExecuting}
            className="px-2.5 py-1 rounded bg-[#090D16] hover:bg-[#1E293B] text-[#F8FAFC] border border-[#1E293B] transition-colors"
          >
            modder inspect
          </button>
          <button
            onClick={() => runCommand('antigravity run workflows/video_factory.yaml')}
            disabled={isExecuting}
            className="px-2.5 py-1 rounded bg-[#090D16] hover:bg-[#1E293B] text-[#F8FAFC] border border-[#1E293B] transition-colors"
          >
            antigravity run
          </button>
        </div>

        {/* Terminal Screen */}
        <div className="p-4 bg-[#090D16] min-h-[140px] max-h-[220px] overflow-y-auto space-y-1.5 text-[#F8FAFC]">
          {terminalOutput.map((line, idx) => (
            <div key={idx} className={line.startsWith('$') ? 'text-[#8B5CF6] font-bold' : 'text-[#94A3B8]'}>
              {line}
            </div>
          ))}
          {isExecuting && (
            <div className="text-[#94A3B8] animate-pulse">
              {language === 'en' ? 'Executing routine...' : 'Đang xử lý quy trình...'}
            </div>
          )}
        </div>
      </div>

      {/* Lab Trading Cards */}
      {aiCards.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-base text-[#F8FAFC] flex items-center gap-2">
              <Binary className="w-4 h-4 text-[#8B5CF6]" />
              <span>{language === 'en' ? 'Original Systems & Web Apps' : 'Ứng dụng Web & Hệ thống'}</span>
            </h3>
            <span className="text-xs text-[#94A3B8]">
              {language === 'en' ? 'Click card to inspect details' : 'Nhấp thẻ để xem chi tiết'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {aiCards.map((card) => (
              <div
                key={card.id}
                onClick={() => {
                  onOpenCard(card);
                  sound.playBip(700, 0.05);
                }}
                className="group p-5 rounded-2xl bg-[#131B2E] border border-[#1E293B] hover:border-[#8B5CF6] shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-[#94A3B8] mb-2">
                    <span className="text-[#8B5CF6] font-medium">
                      {language === 'en' ? card.categoryEn : card.categoryVi}
                    </span>
                    <span>{formatReadTime(card.readTimeEstimate, language)}</span>
                  </div>

                  <h4 className="font-bold text-sm sm:text-base text-[#F8FAFC] group-hover:text-[#8B5CF6] transition-colors leading-snug">
                    {card.title}
                  </h4>

                  <p className="mt-2 text-xs text-[#94A3B8] line-clamp-3 leading-relaxed">
                    {language === 'en' ? card.descriptionEn : card.descriptionVi}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#1E293B] flex items-center justify-between text-xs">
                  <span className="text-[#94A3B8]">
                    {card.tags.slice(0, 3).join(' · ')}
                  </span>
                  <span className="text-[#8B5CF6] flex items-center gap-1 font-medium">
                    <span>{language === 'en' ? 'Inspect' : 'Xem'}</span>
                    <Eye className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
