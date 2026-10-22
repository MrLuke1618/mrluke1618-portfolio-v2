import { GoogleGenAI } from '@google/genai';
import { GameZoneId } from '../types/game';

const LOCAL_STORAGE_KEY = 'byo_gemini_api_key';

// System prompt pre-seeding Hoang Cao Minh's verified background
const PORTFOLIO_SYSTEM_INSTRUCTION = `
You are an intelligent, articulate assistant representing Hoang Cao Minh's portfolio.
Vietnamese Name: Cao Minh Hoàng
English Name: Hoang Cao Minh
Email: hoangcaominh27@gmail.com
Answer questions accurately, professionally, and concisely based on Hoang's real background and verified achievements.

Hoang Cao Minh's Profile:
- Professional Identity: Video Editor, News Editor, and AI Content Creator with 6+ years of multimedia production experience.
- Education: Master's Degree in Communication & Media Studies from Dublin City University (First-Class Honours, 2:1). Major Project: The Sailboat WebGL.
- Key Career Achievements:
  - Lotus Media (Video Editor, Full-Time): Grew YouTube channel from 1,000 to 72,000+ subscribers via high-retention narrative editing, pacing, and dynamic music synchronization.
  - Avada Commerce (Content Creator & AI Tool Builder): Engineered internal AI growth tools, including the Shopify Growth Video Idea Generator and Customer Review Summarizer.
  - TB Group (Video Editor & News Writer): Edited 400+ articles and directed 4K commercial videos and TVCs.
  - Cryptoday (Content Creator & Tech Writer): Published 1,000+ tech and crypto market analyses.
- Original Works & Deployed Demos:
  1. Shopify Growth Video Idea Generator (AI tool for e-commerce video hooks)
  2. Content Compass (AI trend aggregator & content strategy tool)
  3. IELTS Sniper Simulator (Gamified test-prep simulator on Google Cloud Run for ADHD students)
  4. Cinematic AI Reel (VEO3, Kling, Higgsfield generations with character consistency)
  5. The Sailboat (DCU Major Project WebGL with Three.js & real-time audio)
  6. Official Comprehensive Work Portfolio (Google Doc with deep case studies)
- Technical Toolchain Proficiencies:
  - Python & AntiGravity IDE workflows for video automation
  - Automated video pipelines (leveraging Hyperframes & concat for programmatic rendering)
  - Rust systems programming & binary pattern scanning
  - React 19, TypeScript, Tailwind CSS, Three.js, Web Audio API
- Location & Availability: Hanoi, Vietnam (UTC+7). Open to select video editing, AI automation, and full-stack media projects. Email: hoangcaominh27@gmail.com
`;

const UNIVERSAL_SYSTEM_INSTRUCTION = `
You are an unlocked, versatile AI assistant powered by the user's custom Gemini API key inside Hoang Cao Minh's interactive portfolio.
You have two primary capabilities:
1. Complete expert knowledge of Hoang Cao Minh (Cao Minh Hoàng) — his 6+ years video editing career, 72k Lotus Media subscriber scaling, DCU Master's Honours, Python/Hyperframes/Concat video automation, Rust systems, and contact hoangcaominh27@gmail.com.
2. Full general-purpose AI capabilities: You can answer any questions, write and debug code in any language, draft video scripts, write marketing hooks, brainstorm creative strategies, and assist with general problem solving.
Be articulate, concise, and helpful.
`;

export function getBYOApiKey(): string | null {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return null;
  try {
    return localStorage.getItem(LOCAL_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setBYOApiKey(key: string): void {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, key.trim());
  } catch {
    // Handled silently
  }
}

export function clearBYOApiKey(): void {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  } catch {
    // Handled silently
  }
}

export function isBYOApiKeyActive(): boolean {
  const key = getBYOApiKey();
  return Boolean(key && key.length > 5);
}

// Fallback knowledge for offline or zero-key mode
const FALLBACK_KNOWLEDGE: Record<string, { en: string; vi: string }> = {
  lotus: {
    en: "At Lotus Media, Hoang led end-to-end video post-production, scaling their YouTube channel from 1,000 to over 72,000 subscribers through high-retention pacing, narrative structure, and dynamic sound design.",
    vi: "Tại Lotus Media, Hoàng phụ trách toàn bộ hậu kỳ video, giúp kênh YouTube tăng trưởng từ 1.000 lên hơn 72.000 người đăng ký nhờ kỹ thuật giữ chân người xem và xây dựng cấu trúc kịch bản lôi cuốn."
  },
  shorts: {
    en: "Hoang designs automated video pipelines using Python, AntiGravity IDE, and programmatic rendering tools like Hyperframes and concat to assemble code-generated video assets into daily publishing pipelines.",
    vi: "Hoàng thiết kế quy trình tự động hóa sản xuất video bằng Python, AntiGravity IDE và các công cụ kết xuất lập trình như Hyperframes và concat để tạo luồng xuất bản video hàng ngày."
  },
  rust: {
    en: "Hoang leverages Rust for high-performance systems engineering, CLI toolchains, and memory pattern scanning with zero-allocation byte signature matching.",
    vi: "Hoàng sử dụng ngôn ngữ Rust để phát triển công cụ dòng lệnh (CLI), lập trình hệ thống hiệu năng cao và quét mẫu nhị phân bộ nhớ tối ưu."
  },
  apps: {
    en: "Hoang's original web applications include the Shopify Growth Video Idea Generator, Content Compass trend aggregator, and the IELTS Sniper Simulator deployed on Google Cloud Run for ADHD learners.",
    vi: "Các ứng dụng web do chính Hoàng phát triển gồm Shopify Growth Video Idea Generator, ứng dụng phân tích xu hướng Content Compass và trình giả lập IELTS Sniper Simulator chạy trên Google Cloud Run."
  },
  education: {
    en: "Hoang holds a Master of Arts in Communication & Media Studies from Dublin City University (Honours Grade I, 2:1). His major project, 'The Sailboat', explored interactive WebGL and 3D soundscapes.",
    vi: "Hoàng tốt nghiệp Thạc sĩ Truyền thông & Nghiên cứu Đa phương tiện tại Dublin City University (Loại Giỏi, 2:1). Đồ án tốt nghiệp 'The Sailboat' kết hợp WebGL tương tác và âm thanh 3D."
  },
  contact: {
    en: "You can reach Hoang directly via email at hoangcaominh27@gmail.com, or explore his GitHub (MrLuke1618) and official Google Docs portfolio for deep case studies.",
    vi: "Bạn có thể liên hệ trực tiếp với Hoàng qua email hoangcaominh27@gmail.com, hoặc xem qua GitHub (MrLuke1618) và tài liệu hồ sơ năng lực chi tiết trên Google Docs."
  },
  lofi: {
    en: "The Lo-Fi player uses the browser's Web Audio API for zero-dependency procedural audio synthesis—generating chill chords, vinyl warmth, and reverb paired with a Pomodoro focus timer.",
    vi: "Trình phát Lo-Fi sử dụng trực tiếp Web Audio API của trình duyệt để tổng hợp âm thanh thời gian thực—tạo hợp âm piano thư giãn, tiếng đĩa than và không gian kèm đồng hồ Pomodoro."
  },
  general: {
    en: "Hello! I can answer any questions about Hoang Cao Minh's video editing portfolio (72k Lotus Media subscribers), DCU Master's degree, AI web tools, and technical automation stack. You can also connect your own Gemini API key for general coding & text prompts!",
    vi: "Xin chào! Tôi có thể giải đáp mọi thắc mắc về năng lực dựng video của Hoàng (72k người đăng ký Lotus Media), bằng Thạc sĩ DCU, các công cụ AI và quy trình tự động hóa. Bạn cũng có thể nhập API Key cá nhân để mở khóa toàn bộ tính năng!"
  }
};

export async function askAICompanion(
  userQuery: string,
  currentZone: GameZoneId,
  language: 'en' | 'vi' = 'en'
): Promise<string> {
  const queryLower = userQuery.toLowerCase();
  const byoKey = getBYOApiKey();

  // 1. Try with user's BYO Gemini API Key if present
  if (byoKey) {
    try {
      const client = new GoogleGenAI({ apiKey: byoKey });
      const response = await client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `User Query: "${userQuery}". Language requested: ${language}. Current Zone context: ${currentZone}.`
              }
            ]
          }
        ],
        config: {
          systemInstruction: UNIVERSAL_SYSTEM_INSTRUCTION,
          temperature: 0.7,
          maxOutputTokens: 350
        }
      });

      if (response && response.text) {
        return response.text.trim();
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : '';
      if (errMsg.includes('API_KEY_INVALID') || errMsg.includes('403')) {
        return language === 'en'
          ? "Invalid Gemini API Key provided. Please check or re-enter your key in settings, or clear it to use default portfolio mode."
          : "API Key không hợp lệ. Vui lòng kiểm tra lại key trong phần cài đặt hoặc xóa key để dùng chế độ mặc định.";
      }
    }
  }

  // 2. Try default system Gemini API Key if available
  try {
    const envKey = (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) ||
                   (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_GEMINI_API_KEY;
    if (envKey) {
      const defaultClient = new GoogleGenAI({ apiKey: envKey });
      const response = await defaultClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `Context: Hoang Cao Minh's interactive portfolio. Current zone: ${currentZone}. User Query: "${userQuery}". Language: ${language}.`
              }
            ]
          }
        ],
        config: {
          systemInstruction: PORTFOLIO_SYSTEM_INSTRUCTION,
          temperature: 0.6,
          maxOutputTokens: 250
        }
      });

      if (response && response.text) {
        return response.text.trim();
      }
    }
  } catch {
    // Fallback to offline knowledge base
  }

  // 3. Graceful offline fallback
  if (queryLower.includes('lotus') || queryLower.includes('72') || queryLower.includes('sub')) {
    return language === 'en' ? FALLBACK_KNOWLEDGE.lotus.en : FALLBACK_KNOWLEDGE.lotus.vi;
  }
  if (queryLower.includes('short') || queryLower.includes('video') || queryLower.includes('hyperframe') || queryLower.includes('concat')) {
    return language === 'en' ? FALLBACK_KNOWLEDGE.shorts.en : FALLBACK_KNOWLEDGE.shorts.vi;
  }
  if (queryLower.includes('rust') || queryLower.includes('cli') || queryLower.includes('system') || queryLower.includes('hệ thống')) {
    return language === 'en' ? FALLBACK_KNOWLEDGE.rust.en : FALLBACK_KNOWLEDGE.rust.vi;
  }
  if (queryLower.includes('app') || queryLower.includes('shopify') || queryLower.includes('compass') || queryLower.includes('ielts') || queryLower.includes('dự án')) {
    return language === 'en' ? FALLBACK_KNOWLEDGE.apps.en : FALLBACK_KNOWLEDGE.apps.vi;
  }
  if (queryLower.includes('dcu') || queryLower.includes('master') || queryLower.includes('thạc sĩ') || queryLower.includes('học vấn') || queryLower.includes('education') || queryLower.includes('đại học')) {
    return language === 'en' ? FALLBACK_KNOWLEDGE.education.en : FALLBACK_KNOWLEDGE.education.vi;
  }
  if (queryLower.includes('contact') || queryLower.includes('email') || queryLower.includes('liên hệ') || queryLower.includes('hire') || queryLower.includes('thuê') || queryLower.includes('hoangcaominh27@gmail.com')) {
    return language === 'en' ? FALLBACK_KNOWLEDGE.contact.en : FALLBACK_KNOWLEDGE.contact.vi;
  }
  if (queryLower.includes('lofi') || queryLower.includes('music') || queryLower.includes('audio') || queryLower.includes('âm thanh') || queryLower.includes('nhạc') || queryLower.includes('pomodoro')) {
    return language === 'en' ? FALLBACK_KNOWLEDGE.lofi.en : FALLBACK_KNOWLEDGE.lofi.vi;
  }

  return language === 'en' ? FALLBACK_KNOWLEDGE.general.en : FALLBACK_KNOWLEDGE.general.vi;
}
