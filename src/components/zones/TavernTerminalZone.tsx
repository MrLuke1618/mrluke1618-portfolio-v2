import React, { useState } from 'react';
import { TradingCardItem } from '../../types/game';
import { LiveWorkspaceWidget } from '../hud/LiveWorkspaceWidget';
import { sound } from '../../constants/soundEffects';
import { Radio, Send, CheckCircle2, Youtube, Video, Linkedin, FileText, FileCode2, ExternalLink, Mail, Check } from 'lucide-react';

interface TavernTerminalZoneProps {
  onOpenCard?: (card: TradingCardItem) => void;
  language: 'en' | 'vi';
}

export const TavernTerminalZone: React.FC<TavernTerminalZoneProps> = ({
  onOpenCard: _onOpenCard,
  language
}) => {
  const [emailCopied, setEmailCopied] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const [msgName, setMsgName] = useState('');
  const [msgBody, setMsgBody] = useState('');

  const emailAddress = 'hoangminh1618@gmail.com';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(emailAddress);
    setEmailCopied(true);
    sound.playBip(880, 0.05);
    setTimeout(() => setEmailCopied(false), 2000);
  };

  const handleTransmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgName.trim() || !msgBody.trim()) return;

    sound.playLevelUp();
    setMessageSent(true);
    setTimeout(() => {
      window.location.href = `mailto:${emailAddress}?subject=Transmission from ${encodeURIComponent(msgName)}&body=${encodeURIComponent(msgBody)}`;
    }, 800);
  };

  const socialLinks = [
    { name: 'YouTube Channel', url: 'https://www.youtube.com/@luke1618gamer', icon: Youtube },
    { name: 'TikTok', url: 'https://www.tiktok.com/@hoangcao2704', icon: Video },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/hoangminhcao', icon: Linkedin },
    { name: 'Video Showcase (Drive)', url: 'https://drive.google.com/file/d/1MKrJ9lNwt3Y0gzC2UYbodEIYDmIc0iVa/view?usp=drive_link', icon: FileText },
    { name: 'Work Portfolio (Doc)', url: 'https://docs.google.com/document/d/1ZO9BMG0B3p7g_aXBwxDnV92xEyVCbmjk_HJZeSpGKYk/edit?usp=sharing', icon: FileCode2 },
    { name: 'IELTS 7.5 Certificate', url: 'https://drive.google.com/file/d/11RWK0L2g-zs440j-dh8ig5RMIpG0KIWY/view?usp=sharing', icon: FileText },
    { name: 'TOEIC 960 Certificate', url: 'https://drive.google.com/file/d/1vT5oUbCPYPcBTH50dfzlVG-sl9FPvUcV/view?usp=sharing', icon: FileText },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Zone Header Banner */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-[#131B2E] border border-[#1E293B] shadow-2xl overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-[#8B5CF6] text-xs font-medium mb-3">
              <Radio className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'Direct Comms & Workspace Status' : 'Kênh Liên Lạc & Không Gian Làm Việc'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#F8FAFC] tracking-tight">
              {language === 'en' ? 'Contact & Workspace Hub' : 'Trạm Kết Nối & Thông Tin'}
            </h2>
            <p className="mt-2 text-sm text-[#94A3B8] max-w-2xl leading-relaxed">
              {language === 'en'
                ? 'Direct communication channels, live Hanoi workspace status, official credential documentation, and project inquiries.'
                : 'Kênh liên lạc trực tiếp, trạng thái không gian làm việc Hà Nội, chứng chỉ năng lực chính thức và cơ hội hợp tác.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyEmail}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-medium transition-colors shadow-md shadow-[#8B5CF6]/30"
            >
              {emailCopied ? <Check className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
              <span>{emailCopied ? (language === 'en' ? 'Copied' : 'Đã chép') : emailAddress}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Social Links & Official Dossiers */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl bg-[#131B2E] border border-[#1E293B] shadow-xl">
            <h3 className="font-bold text-sm sm:text-base text-[#F8FAFC] mb-4 flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-[#8B5CF6]" />
              <span>{language === 'en' ? 'Verified Socials & Dossiers' : 'Mạng Xã Hội & Hồ Sơ Chính Thức'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {socialLinks.map((item, idx) => (
                <a
                  key={idx}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => sound.playTeleport()}
                  className="p-3.5 rounded-xl bg-[#090D16] border border-[#1E293B] hover:border-[#8B5CF6] flex items-center justify-between group transition-all"
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-4 h-4 text-[#8B5CF6]" />
                    <span className="text-xs font-medium text-[#F8FAFC] group-hover:text-[#8B5CF6] transition-colors">
                      {item.name}
                    </span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-[#94A3B8] group-hover:text-[#F8FAFC] transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Direct Comms Terminal */}
          <div className="p-6 rounded-2xl bg-[#131B2E] border border-[#1E293B] shadow-xl">
            <h3 className="font-bold text-sm sm:text-base text-[#F8FAFC] mb-1 flex items-center gap-2">
              <Send className="w-4 h-4 text-[#8B5CF6]" />
              <span>{language === 'en' ? 'Send Direct Message' : 'Gửi Tin Nhắn Trực Tiếp'}</span>
            </h3>
            <p className="text-xs text-[#94A3B8] mb-4">
              {language === 'en'
                ? 'Send a collaboration inquiry or project request directly to Hoang Cao Minh.'
                : 'Gửi lời mời hợp tác dự án hoặc trao đổi cơ hội việc làm tới Hoàng.'}
            </p>

            {messageSent ? (
              <div className="p-4 rounded-xl bg-[#090D16] border border-[#8B5CF6] text-[#F8FAFC] text-xs flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-[#8B5CF6] flex-shrink-0" />
                <span>
                  {language === 'en'
                    ? 'Message received! Opening your default email client...'
                    : 'Đã nhận thông điệp! Đang mở ứng dụng email của bạn...'}
                </span>
              </div>
            ) : (
              <form onSubmit={handleTransmit} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="text-[#94A3B8] text-[11px]">
                    {language === 'en' ? 'YOUR NAME / COMPANY' : 'HỌ TÊN / DOANH NGHIỆP'}
                  </label>
                  <input
                    type="text"
                    required
                    value={msgName}
                    onChange={(e) => setMsgName(e.target.value)}
                    placeholder="e.g. Creative Director"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#090D16] border border-[#1E293B] text-[#F8FAFC] placeholder-[#94A3B8]/60 focus:outline-none focus:border-[#8B5CF6] transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[#94A3B8] text-[11px]">
                    {language === 'en' ? 'MESSAGE BODY' : 'NỘI DUNG TRAO ĐỔI'}
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={msgBody}
                    onChange={(e) => setMsgBody(e.target.value)}
                    placeholder={
                      language === 'en'
                        ? 'Describe your project or role (video production, automation, AI tools)...'
                        : 'Mô tả dự án hoặc vị trí công việc cần hợp tác...'
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#090D16] border border-[#1E293B] text-[#F8FAFC] placeholder-[#94A3B8]/60 focus:outline-none focus:border-[#8B5CF6] transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-medium transition-colors shadow-md shadow-[#8B5CF6]/30 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{language === 'en' ? 'Send Message' : 'Gửi tin nhắn'}</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right Column: LiveWorkspaceWidget */}
        <div className="space-y-4">
          <LiveWorkspaceWidget language={language} />
        </div>
      </div>
    </div>
  );
};
