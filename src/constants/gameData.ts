import { GameZone, SkillTreeNode, QuestItem, TradingCardItem, PipelineStep } from '../types/game';

export const GAME_ZONES: GameZone[] = [
  {
    id: 'vault',
    titleEn: 'Motion & Video Suite',
    titleVi: 'Phòng Kỹ Xảo Motion & Video',
    subtitleEn: 'Kinetic Typography, Hyperframes & Automated Video Toolchains',
    subtitleVi: 'Kinetic Typography, Hyperframes & Quy trình Dựng Video Tự Động',
    iconName: 'Video',
    color: 'from-violet-600 to-purple-700',
    glowColor: '#8B5CF6',
    mapX: 24,
    mapY: 34,
    dialogueIntroEn: 'Welcome to the Motion & Video Suite. Test kinetic motion typography physics, inspect the Python + Hyperframes + Concat automation pipeline, and explore the multi-track simulator.',
    dialogueIntroVi: 'Chào mừng tới Phòng Kỹ Xảo Motion & Video. Thử nghiệm hiệu ứng kinetic typography, khám phá pipeline tự động Python + Hyperframes + Concat và trình giả lập dựng phim đa luồng.',
    recommendedQueriesEn: [
      'Tell me about your Python + Hyperframes + Concat automated video pipeline',
      'How do you design kinetic motion typography for high-retention video?',
      'Tell me about your 72k subscriber growth at Lotus Media'
    ],
    recommendedQueriesVi: [
      'Quy trình tự động hóa Python + Hyperframes + Concat hoạt động như thế nào?',
      'Cách bạn thiết kế kinetic motion typography để tăng tỷ lệ giữ chân người xem?',
      'Chia sẻ về thành tích phát triển 72k người đăng ký tại Lotus Media'
    ]
  },
  {
    id: 'arcade',
    titleEn: 'Project Showcase & Systems',
    titleVi: 'Kho Dự Án & Kỹ Thuật',
    subtitleEn: 'AI Web Apps, Shopify Tools & Rust Systems Engineering',
    subtitleVi: 'Ứng dụng AI, Công cụ Shopify & Lập trình Hệ thống Rust',
    iconName: 'Gamepad2',
    color: 'from-violet-600 to-slate-900',
    glowColor: '#8B5CF6',
    mapX: 76,
    mapY: 34,
    dialogueIntroEn: 'Explore live deployed apps (Shopify Generator, Content Compass, IELTS Sniper) alongside high-performance Rust CLI tooling.',
    dialogueIntroVi: 'Khám phá các ứng dụng thực tế (Shopify Generator, Content Compass, IELTS Sniper) cùng các công cụ dòng lệnh Rust hiệu năng cao.',
    recommendedQueriesEn: [
      'Tell me about the Shopify Growth Video Idea Generator',
      'What is Content Compass and how does it analyze trends?',
      'What is your experience with Rust systems and CLI tools?'
    ],
    recommendedQueriesVi: [
      'Giới thiệu công cụ Shopify Growth Video Idea Generator',
      'Ứng dụng Content Compass phân tích xu hướng thế nào?',
      'Kinh nghiệm của bạn với ngôn ngữ lập trình Rust và công cụ CLI?'
    ]
  },
  {
    id: 'academy',
    titleEn: 'Career & Education Tower',
    titleVi: 'Tháp Sự Nghiệp & Học Vấn',
    subtitleEn: 'DCU Master’s Honours, Lotus Media 72K Subs & Skill Trees',
    subtitleVi: 'Thạc sĩ DCU Loại Giỏi, 72K Subs Lotus Media & Cây Kỹ Năng',
    iconName: 'GraduationCap',
    color: 'from-violet-900 to-slate-900',
    glowColor: '#8B5CF6',
    mapX: 24,
    mapY: 76,
    dialogueIntroEn: 'Career Tower. Review 6+ years of multimedia production, DCU Master’s degree honours, and verified milestones.',
    dialogueIntroVi: 'Tháp Sự Nghiệp. Khám phá hơn 6 năm sản xuất truyền thông, bằng Thạc sĩ DCU loại Giỏi và các thành tích đã chứng thực.',
    recommendedQueriesEn: [
      'Summarize your career journey in 3 bullet points',
      'Tell me about your Master degree at Dublin City University',
      'What are your verified achievements and credentials?'
    ],
    recommendedQueriesVi: [
      'Tóm tắt hành trình sự nghiệp của bạn qua 3 điểm chính',
      'Chia sẻ về bằng Thạc sĩ tại Dublin City University',
      'Các chứng chỉ và thành tích đã được chứng thực của bạn là gì?'
    ]
  },
  {
    id: 'lounge',
    titleEn: 'Lo-Fi Lounge & Contact Hub',
    titleVi: 'Phòng Lo-Fi & Trạm Liên Hệ',
    subtitleEn: 'Procedural Web Audio Synth & Direct Hanoi Comms',
    subtitleVi: 'Bộ tổng hợp âm thanh Web Audio & Kênh liên hệ trực tiếp',
    iconName: 'Headphones',
    color: 'from-violet-700 to-indigo-800',
    glowColor: '#8B5CF6',
    mapX: 76,
    mapY: 76,
    dialogueIntroEn: 'Relax with generative Web Audio chill beats, focus Pomodoro timer, or connect directly via hoangcaominh27@gmail.com.',
    dialogueIntroVi: 'Thư giãn với âm thanh Web Audio tự sinh, đồng hồ Pomodoro hoặc kết nối trực tiếp qua hoangcaominh27@gmail.com.',
    recommendedQueriesEn: [
      'What is the best way to contact Hoang for collaboration?',
      'How does this procedural Web Audio synthesizer work?',
      'What is your availability for freelance or full-time roles?'
    ],
    recommendedQueriesVi: [
      'Cách thuận tiện nhất để liên hệ và hợp tác với Hoàng?',
      'Bộ tổng hợp âm thanh Web Audio API này được lập trình thế nào?',
      'Khả năng nhận dự án hoặc làm việc toàn thời gian của bạn?'
    ]
  },
  {
    id: 'shipyard',
    titleEn: 'AntiGravity & Code Shipyard',
    titleVi: 'Trạm Vũ Trụ AntiGravity & Code',
    subtitleEn: 'Remote Orbital Outpost: Autonomous Git Pipelines, Claude Code & Codex',
    subtitleVi: 'Trạm Quỹ Đạo Xa: Quy trình Git Tự Động, Claude Code & Codex',
    iconName: 'Orbit',
    color: 'from-violet-500 to-indigo-950',
    glowColor: '#8B5CF6',
    mapX: 50,
    mapY: 10,
    dialogueIntroEn: 'Docked at the Remote Orbital Shipyard. Review autonomous GitHub synchronization, antigravity.yaml execution manifests, and automated batch video pipelines.',
    dialogueIntroVi: 'Đã cập bến Trạm Vũ Trụ Quỹ Đạo. Khám phá quy trình đồng bộ hóa GitHub tự động, manifest antigravity.yaml và pipeline dựng video hàng loạt.',
    recommendedQueriesEn: [
      'Explain the AntiGravity, Claude Code, and Codex orchestration architecture',
      'What is antigravity.yaml and how does it automate video rendering?',
      'How do you run local headless video stitching via CLI?'
    ],
    recommendedQueriesVi: [
      'Giải thích kiến trúc điều phối AntiGravity, Claude Code và Codex',
      'antigravity.yaml là gì và nó tự động hoá dựng video ra sao?',
      'Cách bạn chạy render video tự động không cần giao diện qua CLI?'
    ]
  }
];

export const PIPELINE_STEPS_DATA: PipelineStep[] = [
  {
    id: 'step-nlp',
    stepNumber: '01',
    titleEn: 'Script & NLP Outline',
    titleVi: 'Kịch bản & Phân tích NLP',
    tool: 'AntiGravity IDE + LLM',
    descriptionEn: 'Generates structured scene JSON, hook text, voice cues, and viral retention timing.',
    descriptionVi: 'Tạo JSON phân cảnh, câu hook mở đầu, thời điểm giữ chân người xem và gợi ý giọng nói.',
    sampleLog: '[nlp] Parsed 6 scene beats: Hook (0-2s) -> Core Problem (2-6s) -> Solution (6-11s) -> CTA (11-15s)',
    durationMs: 1200
  },
  {
    id: 'step-voice',
    stepNumber: '02',
    titleEn: 'Voice Narration Synthesis',
    titleVi: 'Tổng hợp Giọng đọc AI',
    tool: 'ElevenLabs Voice Engine',
    descriptionEn: 'Synthesizes neural audio narration with natural inflection, generating timestamped word sync.',
    descriptionVi: 'Tổng hợp giọng đọc AI tự nhiên, trích xuất mốc thời gian từng từ để đồng bộ phụ đề chính xác.',
    sampleLog: '[voice] Rendered 15.2s audio stream at 48kHz stereo with dynamic waveform peaks',
    durationMs: 1400
  },
  {
    id: 'step-hyperframes',
    stepNumber: '03',
    titleEn: 'Hyperframes Code-to-Video',
    titleVi: 'Render Video từ Code (Hyperframes)',
    tool: 'Hyperframes CLI Renderer',
    descriptionEn: 'Compiles programmatic React/Canvas components into pristine 60 FPS 9:16 vertical motion frames.',
    descriptionVi: 'Biên dịch component động thành khung hình chuyển động 60 FPS chuẩn dọc 9:16 sắc nét.',
    sampleLog: '[hyperframes] Compiling 912 frames @ 1080x1920 60fps via headless Chromium buffer...',
    durationMs: 2000
  },
  {
    id: 'step-concat',
    stepNumber: '04',
    titleEn: 'Concat Lossless Assembly',
    titleVi: 'Ghép nối Lossless Concat',
    tool: 'Concat Stitching Pipeline',
    descriptionEn: 'Executes zero-re-encoding scene splicing, sound effects ducking, and burn-in kinetic subtitles.',
    descriptionVi: 'Ghép nối các phân cảnh không giảm chất lượng, tự động hạ nhạc nền theo giọng đọc và dập phụ đề.',
    sampleLog: '[concat] Lossless splicing 4 video streams with cross-dissolve & subtitle overlay',
    durationMs: 1600
  },
  {
    id: 'step-export',
    stepNumber: '05',
    titleEn: 'Master Output & Multi-Platform Dispatch',
    titleVi: 'Xuất bản & Phân phối Tự động',
    tool: 'Automated YouTube Shorts Dispatcher',
    descriptionEn: 'Validates bitrates, creates automated thumbnails, and dispatches to YouTube Shorts.',
    descriptionVi: 'Kiểm tra chuẩn bitrate, tự động sinh thumbnail và xuất bản lên YouTube Shorts & TikTok.',
    sampleLog: '[export] Output shorts_pipeline_v3.mp4 [34.8 MB] ready for broadcast dispatch.',
    durationMs: 1000
  }
];

export const SKILL_TREE_DATA: SkillTreeNode[] = [
  // Branch 1: Systems & Automation
  {
    id: 'rust-dev',
    name: 'Rust Systems Programming',
    branch: 'systems',
    level: 'Advanced',
    levelVi: 'Nâng cao',
    masteryPercent: 88,
    descriptionEn: 'High-performance memory-safe systems programming, CLI tooling, memory scanning, and performance optimization.',
    descriptionVi: 'Lập trình hệ thống hiệu năng cao, an toàn bộ nhớ, phát triển công cụ CLI, quét bộ nhớ nhị phân.',
    highlightProjects: ['Universal Modder Engine', 'CLI Automated Toolchains'],
    iconName: 'Terminal'
  },
  {
    id: 'rev-eng',
    name: 'Reverse Engineering & Universal Modder',
    branch: 'systems',
    level: 'Advanced',
    levelVi: 'Nâng cao',
    masteryPercent: 85,
    descriptionEn: 'Reverse Engineer Anything paradigms, binary inspection, pattern scanning, and dynamic runtime instrumentation.',
    descriptionVi: 'Kỹ thuật dịch ngược mã nguồn, phân tích binary, quét pattern và hook can thiệp thời gian chạy.',
    highlightProjects: ['Universal Modder', 'Binary Memory Inspector'],
    iconName: 'Binary'
  },
  {
    id: 'antigravity-ops',
    name: 'AntiGravity IDE & Automation Workflows',
    branch: 'systems',
    level: 'Expert',
    levelVi: 'Chuyên gia',
    masteryPercent: 95,
    descriptionEn: 'Automated rapid content toolchains, YAML pipelines, task dispatchers, and Python orchestration.',
    descriptionVi: 'Thiết kế pipeline tự động hóa trong AntiGravity IDE, điều phối kịch bản Python và dispatchers.',
    highlightProjects: ['YouTube Shorts Factory', 'Automated Post-Production Pipeline'],
    iconName: 'Workflow'
  },
  {
    id: 'python-automation',
    name: 'Python Scripting & System Automation',
    branch: 'systems',
    level: 'Expert',
    levelVi: 'Chuyên gia',
    masteryPercent: 92,
    descriptionEn: 'Batch file processors, headless browser scraping, API integrations, and asset manipulation.',
    descriptionVi: 'Kịch bản xử lý hàng loạt, tích hợp API, tự động hóa tác vụ hệ thống và xử lý tài nguyên.',
    highlightProjects: ['Shorts Stitcher', 'Customer Review Summarizer'],
    iconName: 'FileCode'
  },

  // Branch 2: Video Production & Generative AI
  {
    id: 'hyperframes-concat',
    name: 'Hyperframes & Concat Infrastructure',
    branch: 'video_ai',
    level: 'Expert',
    levelVi: 'Chuyên gia',
    masteryPercent: 94,
    descriptionEn: 'Programmatic code-to-video rendering via Hyperframes and automated multi-clip stitching using Concat.',
    descriptionVi: 'Dựng video tự động từ mã lập trình bằng Hyperframes và ghép video đa phân đoạn bằng Concat.',
    highlightProjects: ['Automated Shorts Pipeline', 'Dynamic TVC Generator'],
    iconName: 'Video'
  },
  {
    id: 'video-editing-cinematic',
    name: 'Cinematic Video Editing (6+ Years)',
    branch: 'video_ai',
    level: 'Expert',
    levelVi: 'Chuyên gia',
    masteryPercent: 96,
    descriptionEn: 'Storyboarding, sound design, color grading, multi-camera setups, retention pacing, and viral editing.',
    descriptionVi: 'Biên tập video điện ảnh, kịch bản phân cảnh, thiết kế âm thanh, chỉnh màu, nhịp điệu giữ chân người xem.',
    highlightProjects: ['Lotus Media (72k Subs)', 'Chuyên Education TVCs', 'ECI Holdings (52 Videos)'],
    iconName: 'Film'
  },
  {
    id: 'ai-gen-models',
    name: 'VEO3, Kling AI, Runway & Voice Cloning',
    branch: 'video_ai',
    level: 'Expert',
    levelVi: 'Chuyên gia',
    masteryPercent: 93,
    descriptionEn: 'Advanced prompt engineering, style-lock character persistence, camera motions, and ElevenLabs voice cloning.',
    descriptionVi: 'Làm chủ prompt AI video thế hệ mới, kỹ thuật Style-Lock giữ mặt nhân vật, và sao chép giọng nói ElevenLabs.',
    highlightProjects: ['Deviation Lab Style-Lock', 'AI Speaking Competition TVC'],
    iconName: 'Sparkles'
  },

  // Branch 3: Frontend & Interactive 3D
  {
    id: 'react-threejs',
    name: 'React, TypeScript & Three.js 3D',
    branch: 'frontend_3d',
    level: 'Advanced',
    levelVi: 'Nâng cao',
    masteryPercent: 87,
    descriptionEn: 'Modern React SPA architecture, interactive 3D WebGL particle canvases, Tailwind styling, and game physics.',
    descriptionVi: 'Kiến trúc React SPA hiện đại, đồ họa 3D Three.js/WebGL tương tác, Tailwind CSS và cơ chế game 2.5D.',
    highlightProjects: ['2.5D Game Portfolio', 'Major Project WebGL (DCU)', 'Interactive Dashboards'],
    iconName: 'Box'
  },
  {
    id: 'unity-engine',
    name: 'Unity 3D / 2D Engine',
    branch: 'frontend_3d',
    level: 'Advanced',
    levelVi: 'Nâng cao',
    masteryPercent: 82,
    descriptionEn: 'C# scripting, gameplay loops, UI Canvas, physics, WebGL export, and educational gamification.',
    descriptionVi: 'Lập trình C# trong Unity, vòng lặp gameplay, giao diện UI, xuất bản WebGL và trò chơi giáo dục.',
    highlightProjects: ['The Post (Unity 6)', 'Grammar MCQ Test (PTIT)'],
    iconName: 'Gamepad'
  },

  // Branch 4: Growth & Strategy
  {
    id: 'brand-strategy',
    name: 'Brand Strategy & Content Architecture',
    branch: 'growth',
    level: 'Expert',
    levelVi: 'Chuyên gia',
    masteryPercent: 91,
    descriptionEn: 'Repositioning brand models, content pillar frameworks, and high-converting video formats across 5+ brands.',
    descriptionVi: 'Tái định vị thương hiệu, xây dựng Content Pillars và mô hình video chuyển đổi doanh thu cho hơn 5 thương hiệu.',
    highlightProjects: ['Chuyên Education Rebrand', 'Avada Commerce E-commerce Funnel'],
    iconName: 'TrendingUp'
  },
  {
    id: 'bilingual-mastery',
    name: 'Bilingual Mastery (IELTS 7.5 / TOEIC 960)',
    branch: 'growth',
    level: 'Expert',
    levelVi: 'Chuyên gia',
    masteryPercent: 95,
    descriptionEn: 'Professional bilingual English & Vietnamese technical writing, localization, and international media research.',
    descriptionVi: 'Viết nội dung kỹ thuật song ngữ Anh - Việt chuyên nghiệp, bản địa hóa và nghiên cứu truyền thông quốc tế.',
    highlightProjects: ['DCU Master Thesis Honours', 'Cryptoday 1,000+ Articles'],
    iconName: 'Globe'
  }
];

export const QUEST_LOG_DATA: QuestItem[] = [
  {
    id: 'quest-chuyen',
    role: 'MULTIMEDIA STRATEGIST & AI CONTENT CREATOR',
    company: 'Chuyên Education Center (Hanoi, Vietnam)',
    period: 'May 2026 - Jun 2026',
    status: 'Completed',
    xpReward: 2500,
    questRank: 'S-Rank',
    summaryEn: 'Repositioned educational brand model from single tutor to premium multi-brand educational system. Standardized AI voice cloning & style-lock video pipelines.',
    summaryVi: 'Tái định vị mô hình giáo dục sang hệ thống đa thương hiệu cao cấp. Chuẩn hóa quy trình AI Voice Cloning & Style-Lock video.',
    achievements: [
      'Repositioned brand model into a premium educational system across 3 core brands (Gia sư Ms. Chuyên, Bean English, Chuyên Education).',
      'Integrated AI Voice Cloning and AI Visual Libraries into video production workflows with Kling AI, Runway ML, and Veo3.',
      'Standardized multi-camera setups (multi-shot, drone shot, orbit tracking, logo morphing) and Style-Lock character continuity.',
      'Built and upgraded personalized AI Chatbots and published 2 educational apps on Google AI Studio.',
      'Produced multimedia TVCs across 5 major brands and recovered business storage assets via Google appeals.'
    ],
    lootLinks: [
      { name: 'Google Drive Asset Vault', url: 'https://drive.google.com/drive/folders/1JLeemFDS4cda0RMqv8Wd-ko_uD3Y57_N', type: 'drive' },
      { name: 'YouTube Demo Showcase', url: 'https://www.youtube.com/watch?v=p_pr8RI3T-c', type: 'youtube' }
    ]
  },
  {
    id: 'quest-deviation',
    role: 'AI CONTENT CREATOR',
    company: 'Deviation Lab (Hanoi, Vietnam)',
    period: 'Mar 2026 - Mar 2026',
    status: 'Completed',
    xpReward: 1800,
    questRank: 'A-Rank',
    summaryEn: 'Pioneered Style-Lock generation frameworks across Flow AI, Higgsfield, and ElevenLabs to compress production cycles while enhancing aesthetic consistency.',
    summaryVi: 'Tiên phong thiết lập khung Style-Lock trên Flow AI, Higgsfield và ElevenLabs, rút ngắn chu kỳ sản xuất và đảm bảo tính nhất quán.',
    achievements: [
      'Utilized cutting-edge AI pipelines (Flow AI, Higgsfield, ElevenLabs) to compress video creation lifecycles.',
      'Conceptualized and integrated "Style-Lock" rules guaranteeing continuity across backgrounds, color grades, and characters.',
      'Standardized lean post-production procedures blending cinematic pacing with AI components.'
    ],
    lootLinks: [
      { name: 'AI Video Playlist (VEO3, Kling, Higgsfield)', url: 'https://www.youtube.com/playlist?list=PL8l48rFpYhhaFUDxydFt2tTY55rpb9rWi', type: 'youtube' }
    ]
  },
  {
    id: 'quest-duonglinh',
    role: 'COMMUNICATIONS SPECIALIST',
    company: 'Duong Linh Group (Hai Phong, Vietnam)',
    period: 'Dec 2025 - Jan 2026',
    status: 'Completed',
    xpReward: 2000,
    questRank: 'A-Rank',
    summaryEn: 'Led 4K corporate video productions, authored technical factory training handbooks, and managed digital brand layouts.',
    summaryVi: 'Chỉ đạo sản xuất video doanh nghiệp 4K, biên soạn sổ tay đào tạo kỹ thuật an toàn nhà máy và quản lý bộ nhận diện số.',
    achievements: [
      'Styled entire digital brand layouts and printed collateral alongside 4K corporate video productions.',
      'Penned and published comprehensive training packets for the An Lac factory, detailing technical and safety standards.',
      'Led multimedia coverage for critical enterprise milestones and coordinated CSR initiatives.'
    ],
    lootLinks: [
      { name: 'Google Drive Enterprise Folder', url: 'https://drive.google.com/drive/folders/1kLUYpGsSFCWE6-R4HZf7keQ5tPZVxef9?usp=drive_link', type: 'drive' }
    ]
  },
  {
    id: 'quest-avada',
    role: 'CONTENT CREATOR & AI TOOL BUILDER',
    company: 'Avada Commerce (Hanoi, Vietnam)',
    period: 'Oct 2025 - Oct 2025',
    status: 'Completed',
    xpReward: 1600,
    questRank: 'A-Rank',
    summaryEn: 'Built internal AI tools including Shopify Growth Video Idea Generator and Customer Review Summarizer to automate e-commerce growth loops.',
    summaryVi: 'Xây dựng công cụ AI nội bộ gồm Shopify Growth Video Idea Generator và Customer Review Summarizer để tự động hóa phễu tăng trưởng.',
    achievements: [
      'Spearheaded internal AI product workflows, creating specialized tools like Shopify Growth Video Idea Generator.',
      'Directed content blueprints on YouTube, structuring agile video production methods to increase channel traction.'
    ]
  },
  {
    id: 'quest-lotus',
    role: 'VIDEO EDITOR (FULL TIME)',
    company: 'Lotus Media (Hanoi, Vietnam)',
    period: 'Oct 2018 - Jan 2022',
    status: 'Completed',
    xpReward: 3500,
    questRank: 'S-Rank',
    summaryEn: 'Grew YouTube channel from 1,000 to 72,000 subscribers through viral narrative editing, high-retention pacing, and end-to-end post-production.',
    summaryVi: 'Tăng trưởng kênh YouTube từ 1.000 lên 72.000 người đăng ký nhờ kỹ thuật dựng video giữ chân người xem và quản lý hậu kỳ chuyên nghiệp.',
    achievements: [
      'Led video editing projects from storyboard to final format.',
      'Increased YouTube subscribers from 1,000 to 72,000.',
      'Managed multiple channels, enhancing audience interaction and engagement.'
    ]
  }
];

export const TRADING_CARDS: TradingCardItem[] = [
  {
    id: 'card-shopify-generator',
    title: 'Shopify Growth Video Idea Generator',
    categoryEn: 'AI Growth Tool',
    categoryVi: 'Công cụ Tăng Trưởng AI',
    type: 'demo',
    url: 'https://mrluke1618.github.io/shopify-growth-video-idea-generator-v2/',
    readTimeEstimate: '2 min read',
    tags: ['AI Prompting', 'Shopify', 'E-commerce', 'Video Hooks', 'React'],
    descriptionEn: 'Interactive AI-powered ideation web app that generates targeted, high-converting video concepts and TikTok/Reels hooks tailored to Shopify niches.',
    descriptionVi: 'Ứng dụng AI tương tác giúp chủ cửa hàng Shopify tự động tạo ý tưởng video quảng cáo và hook TikTok/Reels có tỷ lệ chuyển đổi cao.',
    featured: true
  },
  {
    id: 'card-content-compass',
    title: 'Content Compass',
    categoryEn: 'AI Intelligence App',
    categoryVi: 'Ứng dụng AI Phân Tích',
    type: 'demo',
    url: 'https://mrluke1618.github.io/content-compass',
    readTimeEstimate: '2 min read',
    tags: ['AI Trends', 'NLP', 'Content Strategy', 'Automation'],
    descriptionEn: 'Smart trend aggregator that extracts high-velocity topics across global media platforms to inform content creation calendars.',
    descriptionVi: 'Bộ tổng hợp xu hướng thông minh giúp trích xuất các chủ đề thảo luận sôi động trên mạng xã hội để định hướng kịch bản nội dung.',
    featured: true
  },
  {
    id: 'card-ielts-sniper',
    title: 'IELTS Sniper Simulator (ADHD Learning)',
    categoryEn: 'Educational Gaming',
    categoryVi: 'Game Giáo Dục',
    type: 'demo',
    url: 'https://ielts-sniper-simulator-111129719916.asia-southeast1.run.app',
    readTimeEstimate: '3 min read',
    tags: ['AI Simulation', 'Gamification', 'Google Cloud Run', 'ADHD Support'],
    descriptionEn: 'Gamified test-prep simulator engineered with pacing and reward loops specifically tuned for neurodiverse and ADHD students preparing for IELTS.',
    descriptionVi: 'Trình giả lập luyện thi IELTS được thiết kế đặc biệt với vòng lặp khen thưởng kích thích phản hồi cho học sinh ADHD.',
    featured: false
  },
  {
    id: 'card-ai-video-playlist',
    title: 'VEO3, Kling & Higgsfield AI Showcase',
    categoryEn: 'Cinematic AI Reel',
    categoryVi: 'Showcase Video AI',
    type: 'youtube',
    url: 'https://www.youtube.com/playlist?list=PL8l48rFpYhhaFUDxydFt2tTY55rpb9rWi',
    readTimeEstimate: '15 min watch',
    tags: ['VEO3', 'Kling AI', 'Higgsfield', 'Style-Lock', 'ElevenLabs'],
    descriptionEn: 'Curated YouTube playlist exhibiting cinematic generations with consistent character identity and camera motion control.',
    descriptionVi: 'Danh sách phát YouTube tuyển tập các video AI điện ảnh với kỹ thuật giữ nhất quán khuôn mặt nhân vật và điều khiển góc quay.',
    featured: true
  },
  {
    id: 'card-major-project-webgl',
    title: 'The Sailboat (DCU Major Project WebGL)',
    categoryEn: 'Academic & 3D WebGL',
    categoryVi: 'Dự án Thạc sĩ WebGL',
    type: 'demo',
    url: 'https://mrluke1618.github.io/Major-Project-WebGL',
    readTimeEstimate: '5 min explore',
    tags: ['WebGL', 'Three.js', 'Dublin City University', 'Honours'],
    descriptionEn: 'Master’s degree major project examining atmospheric soundscapes, interactive WebGL physics, and real-time shader lighting.',
    descriptionVi: 'Dự án tốt nghiệp Thạc sĩ tại Đại học Dublin City kết hợp cảnh quan âm thanh đa chiều và vật lý WebGL tương tác thời gian thực.',
    featured: false
  },
  {
    id: 'card-work-portfolio-doc',
    title: 'Official Comprehensive Work Portfolio',
    categoryEn: 'Document & Case Studies',
    categoryVi: 'Tài liệu Hồ sơ năng lực',
    type: 'doc',
    url: 'https://docs.google.com/document/d/1ZO9BMG0B3p7g_aXBwxDnV92xEyVCbmjk_HJZeSpGKYk/edit?usp=sharing',
    readTimeEstimate: '8 min read',
    tags: ['Google Docs', 'Deep Case Studies', 'Strategy Briefs'],
    descriptionEn: 'Exhaustive written dossiers documenting campaign metrics, brand positioning frameworks, and post-production workflows.',
    descriptionVi: 'Tài liệu chi tiết phân tích số liệu các chiến dịch, cấu trúc định vị thương hiệu và các quy trình hậu kỳ thực tế.',
    featured: false
  },
  {
    id: 'card-google-drive-chuyen',
    title: 'Chuyên Education Media Asset Vault',
    categoryEn: 'Cloud Asset Repository',
    categoryVi: 'Kho Dữ liệu Đám mây',
    type: 'drive',
    url: 'https://drive.google.com/drive/folders/1JLeemFDS4cda0RMqv8Wd-ko_uD3Y57_N',
    readTimeEstimate: '10 min browse',
    tags: ['Google Drive', 'Brand Assets', 'Video Exports', 'Canva Master'],
    descriptionEn: 'Cloud archive containing final 4K renders, brand book guidelines, and Canva Master templates developed for Chuyên Education.',
    descriptionVi: 'Kho lưu trữ đám mây chứa các bản xuất 4K hoàn chỉnh, cẩm nang thương hiệu và các bản mẫu báo cáo Canva Master.',
    featured: false
  }
];
