import { GoogleGenAI } from '@google/genai';
import { GameZoneId } from '../types/game';

const LOCAL_STORAGE_KEY = 'byo_gemini_api_key';

// System prompt pre-seeding Hoang Cao Minh's verified background
const PORTFOLIO_SYSTEM_INSTRUCTION = `
You are an intelligent, articulate assistant representing Hoang Cao Minh's 2.5D interactive portfolio.
Vietnamese Name: Cao Minh Hoàng
English Name: Hoang Cao Minh
Email: hoangcaominh27@gmail.com
Answer questions accurately, professionally, and concisely based on Hoang's real background and verified achievements.

Hoang Cao Minh's Profile:
- Professional Identity: Content Automation Engineer, AI Video Game Creator, and Video Editor with 6+ years of multimedia production experience—automating end-to-end content pipelines (Python, Hyperframes, Remotion, Concat, Edge TTS) and creating playable video games with AI (Midnight Express, Football: Fantastic FCs, WebGL/Canvas worlds).
- Education & Verified Credentials:
  - Master's Degree in Communication & Media Studies from Dublin City University (First-Class Honours, Grade 1 / 2:1). Major Project: The Sailboat WebGL.
  - Bachelor of Technology (IT) from PTIT (8.29/10).
  - IELTS 7.5 Academic & TOEIC 960 Official Certificates.
- Key Career Achievements:
  - Lotus Media (Video Editor, Full-Time): Grew YouTube channel from 1,000 to 72,000+ subscribers via high-retention narrative editing, pacing, and dynamic music synchronization.
  - Avada Commerce (Content Creator & AI Tool Builder): Engineered internal AI growth tools, including the Shopify Growth Video Idea Generator, Content Compass, YouTube Launchpad, and AI Proofreader.
  - Chuyên Education Center & TB Group & Cryptoday: Multi-brand AI media pipelines, 400+ editorial articles, 4K TVCs, and 1,000+ tech analyses.
- Upgraded 2.5D Living RPG Overworld & 6 Centered 16:9 Focus Consoles:
  1. YouTube Cinema & Video Vault: 6+ yrs production, live YouTube playlists, Google Drive Master Reel, Kinetic Typography Lab (10 presets), Python + Hyperframes + Concat automated rendering blueprints, and 4-LUT timeline simulator.
  2. AI Games Arena: Google Playground AI Games — Midnight Express: Trans-Siberian (nocturnal detective RPG with procedural art & audio), Football: Fantastic FCs (zero-image procedural stickman football manager & live match engine), The Sailboat WebGL, plus 10 playable Retro Browser Games.
  3. AI Projects Lab: 16 upgraded 2026 GitHub AI applications across Creator Lab, Growth Ops, and Language Dojo with Dual-Mode (Instant Demo + BYOK Gemini API): Storyboard AI, AI Audio Studio, Creator Suite, Creator's Toolbox, Veo3 Watermark Remover, Content Compass, YouTube Launchpad, Shopify Growth Video Idea Gen, AI Proofreader, IELTS Sniper Simulator, and more.
  4. Career & Certificates Tower: Interactive Certificates Vault (DCU MA, IELTS 7.5, TOEIC 960, Master Work Doc, Video Showcase Reel, Chuyên AI Media), Career Quests, Skill Tree, and Education.
  5. AI Workflows & Stack: Autonomous agentic workflows, antigravity.yaml orchestration, CLI emulators, Rust binary scanner, and headless batch rendering pipelines.
  6. Lo-Fi Lounge & Contact Hub: Real-time Web Audio procedural lo-fi vinyl synth (5 moods + live remix sliders), Pomodoro focus timer, and direct links to Google Docs, Drive, LinkedIn, YouTube (@luke1618gamer), TikTok (@hoangcao2704), and email.
- Technical & Agentic AI Toolchain:
  - Google Antigravity IDE, Gemini 2.5/3.x, Claude Code, Codex, Veo3 / Kling / Higgsfield AI video workflows
  - Edge TTS Neural Voice-Over (en-US-BrianNeural & vi-VN-NamMinhNeural), Playwright automated QA
  - Zero-image-asset 2.5D HTML5 Canvas procedural animation (35+ unique live dioramas), React 19, TypeScript, Vite, Tailwind CSS, Three.js, Web Audio API, Python, Rust, Cloudflare Pages & Vercel
- Location & Availability: Hanoi, Vietnam (UTC+7). Open to select video editing, AI automation, and full-stack media projects. Email: hoangcaominh27@gmail.com
`;

const UNIVERSAL_SYSTEM_INSTRUCTION = `
You are an unlocked, versatile AI assistant powered by the user's custom Gemini API key inside Hoang Cao Minh's 2.5D interactive portfolio.
You have two primary capabilities:
1. Complete expert knowledge of Hoang Cao Minh (Cao Minh Hoàng) — his 6+ years video editing career, 72k Lotus Media subscriber scaling, DCU Master's Honours, IELTS 7.5 / TOEIC 960, Google Playground AI games (Midnight Express, Football: Fantastic FCs), 16 Dual-Mode GitHub AI apps, zero-image 2.5D procedural Canvas animations, Python/Hyperframes/Concat automation, Edge TTS voice guide, and contact hoangcaominh27@gmail.com.
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
    en: "The Lo-Fi player uses the browser's Web Audio API for zero-dependency procedural audio synthesis—generating 5 chill genres (Late Night, Retro Elevator, Cyberpunk Rain, Binaural Beats, Chillhop) with live vinyl, BPM, and reverb remix sliders.",
    vi: "Trình phát Lo-Fi sử dụng trực tiếp Web Audio API của trình duyệt với 5 thể loại âm thanh (Late Night, Retro Elevator, Cyberpunk Rain, Binaural Beats, Chillhop) kèm thanh gạt chỉnh tiếng đĩa than, BPM và reverb."
  },
  arcade: {
    en: "Distant Planet Beta hosts our 10-Game Retro Arcade Planet with playable browser games: Neural-Snake, Memory Core, Cyber-Pong, Neon-Tetris, Pixel-Jump, Cipher-Break, Grid-Racer, Reactor-Core, Void-Breaker, and Tic-Tac-Quantum—each with live Kinetic Motion Video Thumbnails.",
    vi: "Hành tinh Beta quy tụ 10 tựa game Retro Arcade: Neural-Snake, Memory Core, Cyber-Pong, Neon-Tetris, Pixel-Jump, Cipher-Break, Grid-Racer, Reactor-Core, Void-Breaker và Tic-Tac-Quantum—mỗi game đều có thumbnail video kinetic chuyển động trực tiếp."
  },
  shipyard: {
    en: "The AntiGravity & Code Shipyard showcases autonomous agentic workflows (AntiGravity IDE, Claude Code, Codex), antigravity.yaml manifests, interactive CLI emulators, and headless video rendering.",
    vi: "Trạm AntiGravity & Code Shipyard trình diễn quy trình agentic tự động (AntiGravity IDE, Claude Code, Codex), file antigravity.yaml, trình giả lập CLI và dựng video không giao diện."
  },
  playground: {
    en: "In AI Games Arena, Hoang showcases Google Playground AI Games built with zero-image procedural animations—including Midnight Express: Trans-Siberian, Football: Fantastic FCs, The Sailboat WebGL, plus 10 playable retro games.",
    vi: "Tại Đấu Trường Game AI, Hoàng giới thiệu các game AI Google Playground tạo hoạt ảnh hoàn toàn bằng mã như Midnight Express: Trans-Siberian, Football: Fantastic FCs, The Sailboat WebGL cùng 10 game retro."
  },
  diorama: {
    en: "This portfolio uses a unified 2.5D Living RPG Overworld with 6 animated field monuments, centered 16:9 Bento/Carousel consoles, and 35+ unique zero-image HTML5 Canvas procedural dioramas.",
    vi: "Danh mục này sử dụng thế giới 2.5D thống nhất với 6 biểu tượng công trình sống động, khung 16:9 Bento/Carousel không cuộn và hơn 35 mô hình Canvas 2.5D lập trình thuần."
  },
  tts: {
    en: "The portfolio includes a neural Edge TTS Voice Guide (en-US-AndrewNeural & vi-VN-NamMinhNeural) for zone narration plus browser speech synthesis to read AI companion answers aloud.",
    vi: "Danh mục tích hợp thuyết minh giọng nói tự nhiên Edge TTS (Andrew & NamMinh) cho từng khu vực và nút nghe câu trả lời của trợ lý AI."
  },
  certs: {
    en: "Hoang's verified credentials include a Dublin City University Master's (First-Class Honours), IELTS 7.5, TOEIC 960, Lotus Media 72k+ subscriber growth reel, and Chuyên Education AI media archives.",
    vi: "Các chứng chỉ xác thực của Hoàng gồm Thạc sĩ Đại học Dublin City loại Giỏi, IELTS 7.5, TOEIC 960, thành tích 72k+ sub tại Lotus Media và kho sản xuất AI tại Chuyên Education."
  },
  creator: {
    en: "AI Projects Lab hosts 16 upgraded 2026 GitHub AI apps across Creator Lab, Growth Ops, and Language Dojo—including Storyboard AI, AI Audio Studio, Veo3 Watermark Remover, Content Compass, and IELTS Sniper—with Dual-Mode (Instant Demo + BYOK Gemini).",
    vi: "Phòng Lab Dự Án AI quy tụ 16 ứng dụng AI chuẩn 2026 (Storyboard AI, AI Audio Studio, Veo3 Watermark Remover, Content Compass, IELTS Sniper...) hỗ trợ chế độ Dual-Mode."
  },
  general: {
    en: "Hello! I can answer any questions about Hoang Cao Minh's end-to-end content automation pipelines, AI video game creation (Midnight Express, Football: Fantastic FCs), 6+ years video editing career (72k Lotus Media subscribers), DCU Master's degree, and 16 AI web apps. You can also connect your own Gemini API key!",
    vi: "Xin chào! Tôi có thể giải đáp mọi thắc mắc về quy trình tự động hóa nội dung, sáng tạo game bằng AI (Midnight Express, Football: Fantastic FCs), kinh nghiệm dựng video 6+ năm (72k sub Lotus Media), bằng Thạc sĩ DCU và 16 ứng dụng AI của Hoàng. Bạn cũng có thể nhập Gemini API Key cá nhân!"
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
  if (queryLower.includes('playground') || queryLower.includes('midnight') || queryLower.includes('football') || queryLower.includes('fantastic')) {
    return language === 'en' ? FALLBACK_KNOWLEDGE.playground.en : FALLBACK_KNOWLEDGE.playground.vi;
  }
  if (queryLower.includes('2.5d') || queryLower.includes('diorama') || queryLower.includes('bento') || queryLower.includes('canvas') || queryLower.includes('16:9')) {
    return language === 'en' ? FALLBACK_KNOWLEDGE.diorama.en : FALLBACK_KNOWLEDGE.diorama.vi;
  }
  if (queryLower.includes('tts') || queryLower.includes('voice') || queryLower.includes('edge') || queryLower.includes('giọng')) {
    return language === 'en' ? FALLBACK_KNOWLEDGE.tts.en : FALLBACK_KNOWLEDGE.tts.vi;
  }
  if (queryLower.includes('cert') || queryLower.includes('ielts') || queryLower.includes('toeic') || queryLower.includes('chứng chỉ')) {
    return language === 'en' ? FALLBACK_KNOWLEDGE.certs.en : FALLBACK_KNOWLEDGE.certs.vi;
  }
  if (queryLower.includes('creator') || queryLower.includes('storyboard') || queryLower.includes('veo3') || queryLower.includes('dual-mode') || queryLower.includes('16')) {
    return language === 'en' ? FALLBACK_KNOWLEDGE.creator.en : FALLBACK_KNOWLEDGE.creator.vi;
  }
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
  if (queryLower.includes('arcade') || queryLower.includes('game') || queryLower.includes('snake') || queryLower.includes('tetris') || queryLower.includes('pong') || queryLower.includes('trò chơi')) {
    return language === 'en' ? FALLBACK_KNOWLEDGE.arcade.en : FALLBACK_KNOWLEDGE.arcade.vi;
  }
  if (queryLower.includes('shipyard') || queryLower.includes('antigravity') || queryLower.includes('claude') || queryLower.includes('codex') || queryLower.includes('yaml') || queryLower.includes('vũ trụ')) {
    return language === 'en' ? FALLBACK_KNOWLEDGE.shipyard.en : FALLBACK_KNOWLEDGE.shipyard.vi;
  }

  return language === 'en' ? FALLBACK_KNOWLEDGE.general.en : FALLBACK_KNOWLEDGE.general.vi;
}
