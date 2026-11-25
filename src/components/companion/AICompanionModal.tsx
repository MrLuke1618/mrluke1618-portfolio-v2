import React, { useState, useEffect, useRef } from 'react';
import { GameZoneId, AICompanionMessage } from '../../types/game';
import { 
  askAICompanion, 
  getBYOApiKey, 
  setBYOApiKey, 
  clearBYOApiKey, 
  isBYOApiKeyActive 
} from '../../utils/gemini';
import { sound } from '../../constants/soundEffects';
import { voiceNarrator } from '../../utils/voiceNarrator';
import { Send, X, Loader2, Bot, Key, Check, Trash2, Volume2, VolumeX, ChevronLeft, ChevronRight, AudioLines } from 'lucide-react';

interface AICompanionModalProps {
  currentZone: GameZoneId;
  language: 'en' | 'vi';
  isOpen?: boolean;
  onClose?: () => void;
  onOpen?: () => void;
}

export const AICompanionModal: React.FC<AICompanionModalProps> = ({
  currentZone,
  language,
  isOpen: controlledIsOpen,
  onClose: controlledOnClose,
  onOpen: controlledOnOpen
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  const handleOpen = () => {
    if (controlledOnOpen) controlledOnOpen();
    else setInternalIsOpen(true);
    sound.playTerminalClick();
  };

  const handleClose = () => {
    if (controlledOnClose) controlledOnClose();
    else setInternalIsOpen(false);
    sound.playBip(600, 0.04);
  };

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<AICompanionMessage[]>([]);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // BYO API Key settings state
  const [showKeySettings, setShowKeySettings] = useState(false);
  const [inputKey, setInputKey] = useState(getBYOApiKey() || '');
  const [isKeyUnlocked, setIsKeyUnlocked] = useState(isBYOApiKeyActive());
  const [keySaveToast, setKeySaveToast] = useState(false);
  const [templatePage, setTemplatePage] = useState(0);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [isVoiceSpeaking, setIsVoiceSpeaking] = useState(voiceNarrator.isSpeaking());

  useEffect(() => {
    return voiceNarrator.subscribe(() => {
      const speaking = voiceNarrator.isSpeaking();
      setIsVoiceSpeaking(speaking);
      if (!speaking) setSpeakingMsgId(null);
    });
  }, []);

  const suggestedQueries = language === 'en' ? [
    'Tell me about Midnight Express & Football: Fantastic FCs',
    'How were the 2.5D zero-image dioramas & 16:9 Bento UI built?',
    'What are the 16 upgraded 2026 GitHub AI apps?',
    'How does your Python + Hyperframes + Concat pipeline work?',
    'What are Hoang’s verified credentials (DCU, IELTS, Lotus 72k)?',
    'How can I contact Hoang for AI or video projects?'
  ] : [
    'Giới thiệu game Midnight Express & Football: Fantastic FCs',
    'Hệ thống 2.5D không dùng ảnh & giao diện 16:9 Bento hoạt động sao?',
    '16 ứng dụng AI GitHub nâng cấp 2026 gồm những gì?',
    'Quy trình dựng video Python + Hyperframes + Concat ra sao?',
    'Các chứng chỉ (DCU, IELTS, TOEIC) & thành tích 72k Lotus Media?',
    'Làm thế nào để liên hệ hợp tác với Hoàng?'
  ];

  // Initialize greeting on first load or language switch
  useEffect(() => {
    const greetingText = language === 'en'
      ? isKeyUnlocked
        ? "Universal Assistant unlocked with your custom Gemini API key! Ask me anything about Hoang's portfolio, video automation pipelines, or any custom coding & content prompts."
        : "Hello! I am Hoang's interactive portfolio assistant. Ask me anything about his video editing career, 72k Lotus Media growth, AI tools, or technical workflows."
      : isKeyUnlocked
        ? "Đã mở khóa trợ lý đa năng với Gemini API Key cá nhân! Bạn có thể hỏi về hồ sơ của Hoàng, quy trình video, hoặc bất kỳ prompt lập trình & sáng tạo nội dung nào."
        : "Xin chào! Tôi là trợ lý danh mục của Hoàng Cao Minh. Hãy hỏi tôi về kinh nghiệm dựng video, tăng trưởng 72k subscriber tại Lotus Media, các công cụ AI hay quy trình kỹ thuật.";

    if (messages.length === 0) {
      setMessages([
        {
          id: 'msg-init',
          sender: 'npc',
          text: greetingText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          zoneContext: currentZone
        }
      ]);
    }
  }, [language, isKeyUnlocked]);

  useEffect(() => {
    if (isOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSaveKey = () => {
    if (inputKey.trim()) {
      setBYOApiKey(inputKey.trim());
      setIsKeyUnlocked(true);
      setKeySaveToast(true);
      setTimeout(() => setKeySaveToast(false), 2200);
      sound.playLevelUp();
    }
  };

  const handleClearKey = () => {
    clearBYOApiKey();
    setInputKey('');
    setIsKeyUnlocked(false);
    sound.playBip(440, 0.05);
  };

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = (queryText || inputText).trim();
    if (!textToSend || isLoading) return;

    sound.playTerminalClick();
    const userMsg: AICompanionMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const reply = await askAICompanion(textToSend, currentZone, language);
      sound.playBip(780, 0.05);

      const npcMsg: AICompanionMessage = {
        id: `npc-${Date.now()}`,
        sender: 'npc',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        zoneContext: currentZone
      };

      setMessages(prev => [...prev, npcMsg]);
    } catch {
      const errorMsg: AICompanionMessage = {
        id: `error-${Date.now()}`,
        sender: 'system',
        text: language === 'en'
          ? "Connection interrupted. Please try again or inspect portfolio links directly."
          : "Kết nối bị gián đoạn. Vui lòng thử lại hoặc xem trực tiếp các tài liệu danh mục.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button (Bottom Right) */}
      {!isOpen && (
        <button
          onClick={handleOpen}
          aria-label="Open AI Assistant"
          className="fixed bottom-20 right-3 sm:bottom-6 sm:right-6 z-40 flex items-center gap-2 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-2xl bg-[#131B2E] border border-[#1E293B] hover:border-[#8B5CF6] text-[#F8FAFC] shadow-2xl transition-all duration-200 group active:scale-95"
        >
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-[#8B5CF6]/15 flex items-center justify-center text-[#8B5CF6] group-hover:scale-110 transition-transform">
            <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <span className="text-[11px] sm:text-xs font-semibold tracking-tight">
            {language === 'en' ? 'Ask AI about Hoang' : 'Hỏi AI về Hoàng'}
          </span>
          {isKeyUnlocked && (
            <span className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-pulse" title="Universal AI Unlocked" />
          )}
        </button>
      )}

      {/* Slide-over Drawer / Embedded Modal */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="AI Assistant Drawer"
          className="fixed inset-x-2 bottom-2 sm:inset-auto sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-1rem)] sm:w-[440px] h-[82vh] sm:h-[600px] max-h-[92vh] flex flex-col rounded-2xl sm:rounded-3xl bg-[#0B101D]/96 border border-[#8B5CF6]/40 shadow-[0_0_50px_rgba(139,92,246,0.22)] backdrop-blur-2xl overflow-hidden animate-fadeIn"
        >
          <style>{`
            .chat-no-scrollbar {
              scrollbar-width: none;
              -ms-overflow-style: none;
            }
            .chat-no-scrollbar::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#1E293B] bg-[#070B14]/90 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#8B5CF6]/15 border border-[#8B5CF6]/40 flex items-center justify-center text-[#8B5CF6]">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#F8FAFC] flex items-center gap-1.5">
                  <span>{language === 'en' ? 'AI Companion' : 'Trợ lý AI'}</span>
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-mono bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 text-[#C4B5FD]">
                    <AudioLines className="w-2.5 h-2.5" />
                    {language === 'en' ? 'Brian Neural' : 'NamMinh'}
                  </span>
                  {isKeyUnlocked && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-[#8B5CF6] text-white">
                      BYOK
                    </span>
                  )}
                </h3>
                <p className="text-[11px] text-[#94A3B8]">
                  {isKeyUnlocked
                    ? (language === 'en' ? 'Universal Gemini Assistant' : 'Trợ lý Gemini Toàn Năng')
                    : (language === 'en' ? 'Portfolio Context · 2026 Upgraded' : 'Dữ liệu Danh mục · Chuẩn 2026')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* BYO Key Settings Toggle */}
              <button
                onClick={() => {
                  setShowKeySettings(!showKeySettings);
                  sound.playTerminalClick();
                }}
                className={`p-1.5 rounded-lg transition-colors ${
                  showKeySettings || isKeyUnlocked
                    ? 'text-[#8B5CF6] bg-[#1E293B]'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E293B]'
                }`}
                title={language === 'en' ? 'Gemini API Key Settings' : 'Cài đặt API Key Gemini'}
              >
                <Key className="w-4 h-4" />
              </button>

              <button
                onClick={handleClose}
                aria-label="Close Assistant"
                className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E293B] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* BYO API Key Settings Panel (Collapsible) */}
          {showKeySettings && (
            <div className="p-4 bg-[#090D16] border-b border-[#1E293B] space-y-3 animate-fadeIn text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#F8FAFC] flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-[#8B5CF6]" />
                  <span>{language === 'en' ? 'Bring Your Own (BYO) API Key' : 'Sử dụng Gemini API Key cá nhân'}</span>
                </span>
                <span className="text-[10px] text-[#94A3B8]">localStorage</span>
              </div>

              <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                {language === 'en'
                  ? 'Input your Google Gemini API key to unlock general-purpose AI coding, scriptwriting, and custom reasoning.'
                  : 'Nhập API key Google Gemini để mở khóa khả năng viết code, soạn kịch bản video và hỏi đáp tự do.'}
              </p>

              <div className="flex items-center gap-2">
                <input
                  type="password"
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="flex-1 px-3 py-1.5 rounded-lg bg-[#131B2E] border border-[#1E293B] focus:border-[#8B5CF6] text-[#F8FAFC] text-base sm:text-xs font-mono outline-none"
                />
                <button
                  onClick={handleSaveKey}
                  className="px-3 py-1.5 rounded-lg bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-medium text-xs transition-colors flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{language === 'en' ? 'Save' : 'Lưu'}</span>
                </button>
                {isKeyUnlocked && (
                  <button
                    onClick={handleClearKey}
                    className="p-1.5 rounded-lg bg-[#1E293B] text-[#94A3B8] hover:text-rose-400 transition-colors"
                    title="Clear Key"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {keySaveToast && (
                <div className="text-[10px] text-emerald-400 font-mono">
                  ✓ {language === 'en' ? 'Key saved! Universal mode unlocked.' : 'Đã lưu key! Chế độ toàn năng đã mở.'}
                </div>
              )}
            </div>
          )}

          {/* Messages Body (Zero Visible Scrollbar) */}
          <div className="chat-no-scrollbar flex-1 overflow-y-auto p-4 space-y-3 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[86%] rounded-2xl p-3.5 leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] text-white rounded-br-xs shadow-lg shadow-[#8B5CF6]/20'
                      : msg.sender === 'system'
                      ? 'bg-rose-950/40 border border-rose-900/60 text-rose-200'
                      : 'bg-[#111829] border border-[#1E293B] text-[#F8FAFC] rounded-bl-xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    {msg.sender === 'npc' ? (
                      <button
                        type="button"
                        onClick={() => {
                          if (isVoiceSpeaking && speakingMsgId === msg.id) {
                            voiceNarrator.stop();
                            setSpeakingMsgId(null);
                          } else {
                            setSpeakingMsgId(msg.id);
                            voiceNarrator.playChatReply(msg.text, language);
                          }
                        }}
                        className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-semibold transition ${
                          isVoiceSpeaking && speakingMsgId === msg.id
                            ? 'border-emerald-400/50 bg-emerald-500/15 text-[#34D399]'
                            : 'border-[#1E293B] bg-[#0B101D] text-[#A78BFA] hover:border-[#8B5CF6] hover:text-white'
                        }`}
                        title={language === 'en' ? 'Listen with Edge TTS' : 'Nghe giọng đọc Edge TTS'}
                      >
                        {isVoiceSpeaking && speakingMsgId === msg.id ? (
                          <>
                            <VolumeX className="h-2.5 w-2.5" />
                            <span>{language === 'en' ? 'Stop' : 'Dừng'}</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="h-2.5 w-2.5" />
                            <span>{language === 'en' ? 'Listen' : 'Nghe'}</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <span />
                    )}
                    <span className="font-mono text-[9px] opacity-60">
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 p-3 rounded-2xl bg-[#111829] border border-[#1E293B] text-[#94A3B8]">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#8B5CF6]" />
                  <span>{language === 'en' ? 'Synthesizing response...' : 'Đang xử lý câu trả lời...'}</span>
                </div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Prepared Template Questions Carousel (Zero Scrollbar) */}
          <div className="shrink-0 px-3.5 py-2 border-t border-[#1E293B] bg-[#070B14]/80 overflow-hidden">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-mono text-[9px] uppercase tracking-wider text-[#94A3B8]">
                {language === 'en' ? 'Prepared Templates' : 'Câu hỏi gợi ý'}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setTemplatePage((p) => (p === 0 ? 1 : 0))}
                  aria-label="Previous templates"
                  className="rounded border border-[#1E293B] bg-[#111829] p-0.5 text-[#94A3B8] hover:text-white"
                >
                  <ChevronLeft className="h-3 w-3" />
                </button>
                <span className="font-mono text-[9px] text-[#CBD5E1] px-1">
                  {templatePage + 1} / 2
                </span>
                <button
                  type="button"
                  onClick={() => setTemplatePage((p) => (p === 0 ? 1 : 0))}
                  aria-label="Next templates"
                  className="rounded border border-[#1E293B] bg-[#111829] p-0.5 text-[#94A3B8] hover:text-white"
                >
                  <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-1 overflow-hidden">
              {suggestedQueries.slice(templatePage * 3, templatePage * 3 + 3).map((query, idx) => (
                <button
                  key={`${templatePage}-${idx}`}
                  type="button"
                  onClick={() => handleSendMessage(query)}
                  className="truncate px-2.5 py-1 rounded-lg bg-[#111829] border border-[#1E293B] hover:border-[#8B5CF6] text-[#CBD5E1] hover:text-white text-[10px] transition-colors text-left"
                >
                  {query}
                </button>
              ))}
            </div>
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 border-t border-[#1E293B] bg-[#090D16] flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                isKeyUnlocked
                  ? (language === 'en' ? 'Ask anything (code, scripts, prompts)...' : 'Hỏi bất kỳ điều gì (code, kịch bản, prompt)...')
                  : (language === 'en' ? 'Ask about Hoang’s background...' : 'Hỏi về kinh nghiệm của Hoàng...')
              }
              className="flex-1 bg-[#131B2E] border border-[#1E293B] focus:border-[#8B5CF6] text-[#F8FAFC] placeholder-[#94A3B8]/60 text-base sm:text-xs rounded-xl px-3.5 py-2.5 outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              aria-label="Send query"
              className="p-2.5 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] disabled:opacity-40 text-white transition-colors shrink-0 shadow-md shadow-[#8B5CF6]/20"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
