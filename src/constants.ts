import { type LanguageData } from './types';
import { User, Briefcase, Lightbulb, GraduationCap, Star, Link2, Youtube, Linkedin, FileText, Video, FileCode2 } from 'lucide-react';

export const i18n: { en: LanguageData; vi: LanguageData } = {
  en: {
    header: {
      title: 'Hoang Cao Minh',
      subtitle: 'Video Editor & News Editor & AI Content Creator'
    },
    navigation: [
      { type: 'header', title: 'Portfolio' },
      { type: 'link', id: 'summary', title: 'Summary', icon: User },
      { type: 'link', id: 'experience', title: 'Experience', icon: Briefcase },
      { type: 'link', id: 'projects', title: 'AI Projects', icon: Lightbulb },
      { type: 'link', id: 'education', title: 'Education', icon: GraduationCap },
      { type: 'link', id: 'skills', title: 'Skills', icon: Star },
      { type: 'link', id: 'links', title: 'Social & Links', icon: Link2 },
    ],
    viewTitles: {
        summary: 'Professional Summary',
        experience: 'Work Experience',
        projects: 'AI App Projects',
        education: 'Education',
        skills: 'Skills',
        links: 'Social Media & Links',
    },
    summaryText: "Hello, I'm Hoang. With over six years of experience as a Video Editor, News Editor, and AI Content Creator, I specialize in enhancing content clarity and engaging readers across multiple platforms. My expertise in next-gen AI prompt engineering, video post-production pipelines, and AI app integrations allows me to deliver exceptional interactive products. I am deeply passionate about merging traditional media storytelling with custom software systems to streamline creative workflows and power learning personalization.",
    experienceData: [
        {
            role: 'MULTIMEDIA STRATEGIST & AI CONTENT CREATOR',
            company: 'Chuyên Education Center (Hanoi, Vietnam)',
            period: 'May 2026 - Jun 2026',
            achievements: [
                'Brand Strategy: Re-positioned brand model from "single tutor" to a premium educational system. Established content pillars and high-converting video frameworks for 3 core brands (Gia sư Ms. Chuyên, Bean English, Chuyên Education).',
                'AI Technology Application: Integrated AI Voice Cloning and AI Visual Libraries into video production workflows. Researched and optimized prompt engineering across next-gen platforms (Kling AI, Runway ML, Veo3).',
                'AI Video Crafting: Standardized multi-camera setups (multi-shot, drone shot, orbit tracking, logo morphing animations) in AI generation. Developed style-lock pipelines to preserve consistent character faces, attire, synthesized voices, and environmental ambiances.',
                'AI Application Development: Built and upgraded personalized AI Chatbots (Chuyên Education Chatbot, Gem Chatbot English for Gia Sư Ms Chuyên) and deployed 2 learning apps on Google AI Studio for personalized student paths.',
                'Multimedia Production: Produced multimedia content across 5 major brands (Chuyên Education, Gia Sư Ms Chuyên, BEAN English, ASCEND ACADEMY, Future Tech Kids); edited and post-produced AI-driven TVCs and materials for children\'s Speaking competition.',
                'Design & Operations: Standardized brand guidelines (posters, logos), built Canva Master templates for reports/pricing, and successfully recovered business storage assets via Google appeals.',
            ],
            extraLinks: [
                { name: 'Google Drive Folder', url: 'https://drive.google.com/drive/folders/1JLeemFDS4cda0RMqv8Wd-ko_uD3Y57_N' },
                { name: 'YouTube Demo Video', url: 'https://www.youtube.com/watch?v=p_pr8RI3T-c' }
            ]
        },
        {
            role: 'AI CONTENT CREATOR',
            company: 'Deviation Lab (Hanoi, Vietnam)',
            period: 'Mar 2026 - Mar 2026',
            achievements: [
                'Production Optimization: Utilized cutting-edge AI pipelines (Flow AI, Higgsfield, ElevenLabs) to compress video creation lifecycles while maximizing output aesthetic quality.',
                'Style-Lock Synchronization: Conceptualized and integrated "Style-Lock" rules to guarantee continuity across backgrounds, color grades, and characters throughout successive AI generations.',
                'Lean Post-Production: Standardized CapCut editing procedures, blending traditional cinematic pacing with pre-generated AI components to drive viewer interaction and retention.',
            ],
            extraLinks: [
                { name: 'AI Video Playlist (VEO3, Kling, Higgsfield)', url: 'https://www.youtube.com/playlist?list=PL8l48rFpYhhaFUDxydFt2tTY55rpb9rWi' }
            ]
        },
        {
            role: 'COMMUNICATIONS SPECIALIST',
            company: 'Duong Linh Group (Hai Phong, Vietnam)',
            period: 'Dec 2025 - Jan 2026',
            achievements: [
                'Content Creation & Brand Development: Styled entire digital brand layouts and printed collateral (social media grids, recruiting guidelines, infographics) alongside 4K corporate video productions to bolster corporate culture.',
                'Operational & Educational Handbooks: Penned and published comprehensive training packets for the An Lac factory, detailing technical and safety standards, quality inspection logs, monthly bulletins, and pocket-sized handbooks for staff.',
                'Media Production & Event Logistics: Led multimedia coverage and logistics for critical enterprise milestones, creating TVC checklists and coordinating CSR initiatives.',
                'Operation Support: Handled site-monitoring for logistics projects, supervised weighing station operations for international shipping, and administered data for reforestation projects.',
            ],
            extraLinks: [
                { name: 'Google Drive Folder', url: 'https://drive.google.com/drive/folders/1kLUYpGsSFCWE6-R4HZf7keQ5tPZVxef9?usp=drive_link' }
            ]
        },
        {
            role: 'CONTENT CREATOR',
            company: 'Avada Commerce (Hanoi, Vietnam)',
            period: 'Oct 2025 - Oct 2025',
            achievements: [
                'AI Integration & Process Optimization: Spearheaded internal AI product workflows, creating specialized tools like the Shopify Growth Video Idea Generator and Customer Review Summarizer to automate e-commerce loops.',
                'Content Strategy & YouTube: Directed content blueprints on YouTube, structuring agile video production methods to increase channel traction, engagement, and click-through rates.',
            ]
        },
        { 
            role: 'VIDEO EDITOR/NEWS EDITOR',
            company: 'TB Group (Hanoi, Vietnam)',
            period: 'Jul 2023 - Jan 2024',
            achievements: [
                'Edited 400+ articles in 6 months, enhancing content quality and clarity.',
                'Developed strong writing and editing skills through diverse article topics.',
                'Participated in team activities, fostering collaboration and communication.',
                'Improved personal development through extracurricular involvement.',
                'Contributed to team success with effective editing and content strategies.',
            ]
        },
        { 
            role: 'NEWS EDITOR',
            company: 'Cryptoday (Hanoi, Vietnam)',
            period: 'Jun 2022 - May 2023',
            achievements: [
                'Authored 1,000+ articles on cryptocurrency and tech, enhancing reader engagement and knowledge.',
                'Created internal guides on Canva, boosting team collaboration and skill development.',
                'Conducted interviews with industry leaders, enriching content quality and market insight.',
                'Monitored top crypto publications for trend analysis, ensuring up-to-date reporting.',
            ]
        },
        { 
            role: 'VIDEO EDITOR',
            company: 'ECI HOLDINGS JOINT STOCK COMPANY (Hanoi, Vietnam)',
            period: 'Feb 2022 - Apr 2022',
            achievements: [
                'Led media team to produce 52 cryptocurrency videos, enhancing content clarity and delivery.',
                'Managed video production, ensuring timely completion and clear communication.',
                'Directed creation of tutorial videos, improving audience engagement significantly.',
            ]
        },
        { 
            role: 'VIDEO EDITOR (FULL TIME)',
            company: 'Lotus Media (Hanoi, Vietnam)',
            period: 'Oct 2018 - Jan 2022',
            achievements: [
                'Led video editing projects from storyboard to final format.',
                'Increased YouTube subscribers from 1,000 to 72,000.',
                'Managed multiple channels, enhancing audience interaction.',
                'Oversaw post-production, ensuring quality and continuity.',
                'Developed creative concepts and compelling video narratives.',
            ]
        },
        { 
            role: 'VIDEO EDITOR (PART TIME)',
            company: 'Pinetree Securities (Hanoi, Vietnam)',
            period: 'Dec 2020 - Apr 2021',
            achievements: [
                'Applied subtitles and effects to enhance YouTube videos, ensuring timely task completion.',
                'Managed deadlines and communication, contributing to seamless production workflows.',
                'Improved video quality through color correction, resulting in positive viewer feedback.',
            ]
        },
    ],
    projectsData: [
        { name: 'IELTS Sniper Simulator', description: 'An AI-powered gamified application supporting ADHD children during IELTS exam prep with simulated personalized guidance.', link: 'https://ielts-sniper-simulator-111129719916.asia-southeast1.run.app' },
        { name: 'Khang\'s Learning Universe', description: 'A gamified English learning experience built with Remix to personalize educational gameplay paths.', link: 'https://remix-khang-s-learning-universe-111129719916.asia-southeast1.run.app' },
        { name: 'Content Compass', description: 'Summarizes content trends using AI.', link: 'https://mrluke1618.github.io/content-compass' },
        { name: 'Customer Insights AI', description: 'Summarizes customer reviews with AI.', link: 'https://mrluke1618.github.io/customer-review-summarizer' },
        { name: 'Doc QA Assistant', description: 'AI document proofreader.', link: 'https://mrluke1618.github.io/ai-proofreader' },
        { name: 'AI Audio Studio', description: 'Create, edit, and enhance audio with AI.', link: 'https://mrluke1618.github.io/ai-audio-studio' },
        { name: 'IELTS Practice Pod', description: 'AI-powered practice for all 4 IELTS skills.', link: 'https://mrluke1618.github.io/ielts-practice-app' },
        { name: 'Creator’s Toolbox', description: 'Toolkit for creators and editors.', link: 'https://mrluke1618.github.io/mrluke1818-creators-toolbox' },
        { name: 'Shopify Growth Video Idea Generator', description: 'Generates targeted video ideas to boost Shopify store growth.', link: 'https://mrluke1618.github.io/shopify-growth-video-idea-generator-v2/' },
        { name: 'Kokoro English Guide', description: 'Interactive English learning guide.', link: 'https://mrluke1618.github.io/Kokoro-English-Guide/preloader.html' },
    ],
    educationData: [
        {
            degree: 'Master’s Degree in Communication and Media Studies',
            institution: 'Dublin City University',
            period: '2024–2025',
            details: ['Grade: Second Class Honours, Grade I', 'Modules: Imaging, Audio & Sonic Design, Understanding Social Media, Responsive Media, Screenwriting, Visual Design, Moving Image & Video Production, Project Plan & Management, Major Project.'],
            projects: [
                { name: 'The Sailboat (Major Project)', link: 'https://mrluke1618.github.io/Major-Project-WebGL', type: 'WebGL' },
                { name: 'Stories Of The Liberties', link: 'https://minhhoangcaodcu.wordpress.com/2024/12/05/stories-of-the-liberties', type: 'Blog' },
                { name: 'Emerging Media Praxis', link: 'https://www.tiktok.com/@hoangcao2704/video/7468458115822849297', type: 'TikTok' },
                { name: 'Visual Design Module', link: 'https://drive.google.com/drive/folders/1ongFDTY1WamiKPnmdiLkW2Q-zz_6jQuv', type: 'Assets' },
                { name: 'The Stillness Before The Storm', link: 'https://drive.google.com/file/d/1Q2hUgetAZfBgNaouebMADcgBQ1yY1_wD/view?usp=sharing', type: 'Script' },
                { name: 'Pawsitive Nutrition App', link: 'https://www.tiktok.com/@hoangcao2704/video/7480205819913473298', type: 'Figma' },
                { name: 'The Post (Unity 6 App)', link: 'https://www.youtube.com/watch?v=M3MkM_OE3Oc', type: 'Demo' },
            ]
        },
        {
            degree: 'Bachelor of Technology (Information Technology)',
            institution: 'Posts and Telecommunications Institute of Technology, Hanoi',
            period: '2013–2018',
            details: ['Developed interactive English grammar MCQ test in Unity 2017.', 'Final project score: 8.29/10.', 'Skills: Unity, research, and time management.'],
        }
    ],
    skillsData: [
        { name: 'Video Editing', level: 'Experienced' },
        { name: 'News Editing', level: 'Experienced' },
        { name: 'AI Content Creator', level: 'Experienced' },
        { name: 'VEO3 Video Generation', level: 'Experienced' },
        { name: 'AI App Development', level: 'Skillful' },
        { name: 'Figma', level: 'Skillful' },
        { name: 'Canva', level: 'Skillful' },
        { name: 'Flow Omni Workflow', level: 'Skillful' },
        { name: 'Multi-Camera Angle Setup', level: 'Skillful' },
        { name: 'Unity Software Development', level: 'Skillful' },
        { name: 'Social Media Management', level: 'Skillful' },
        { name: 'Graphic Design', level: 'Skillful' },
        { name: 'Acting', level: 'Beginner' },
    ],
    linksData: [
        { name: 'YouTube', url: 'https://www.youtube.com/@luke1618gamer', icon: Youtube },
        { name: 'TikTok', url: 'https://www.tiktok.com/@hoangcao2704', icon: Video },
        { name: 'LinkedIn', url: 'https://www.linkedin.com/in/hoangminhcao', icon: Linkedin },
        { name: 'Video Showcase', url: 'https://drive.google.com/file/d/1MKrJ9lNwt3Y0gzC2UYbodEIYDmIc0iVa/view?usp=drive_link', icon: FileText },
        { name: 'Work Portfolio', url: 'https://docs.google.com/document/d/1ZO9BMG0B3p7g_aXBwxDnV92xEyVCbmjk_HJZeSpGKYk/edit?usp=sharing', icon: FileCode2 },
        { name: 'IELTS 7.5', url: 'https://drive.google.com/file/d/11RWK0L2g-zs440j-dh8ig5RMIpG0KIWY/view?usp=sharing', icon: FileText },
        { name: 'TOEIC 960', url: 'https://drive.google.com/file/d/1vT5oUbCPYPcBTH50dfzlVG-sl9FPvUcV/view?usp=sharing', icon: FileText },
    ],
  },
  vi: {
    header: {
        title: 'Cao Minh Hoàng',
        subtitle: 'Biên tập viên Video & Tin tức & Sáng tạo Nội dung AI'
    },
    navigation: [
        { type: 'header', title: 'Portfolio' },
        { type: 'link', id: 'summary', title: 'Tóm tắt', icon: User },
        { type: 'link', id: 'experience', title: 'Kinh nghiệm', icon: Briefcase },
        { type: 'link', id: 'projects', title: 'Dự án AI', icon: Lightbulb },
        { type: 'link', id: 'education', title: 'Học vấn', icon: GraduationCap },
        { type: 'link', id: 'skills', title: 'Kỹ năng', icon: Star },
        { type: 'link', id: 'links', title: 'Mạng xã hội & Liên kết', icon: Link2 },
    ],
    viewTitles: {
        summary: 'Tóm tắt chuyên môn',
        experience: 'Kinh nghiệm làm việc',
        projects: 'Dự án ứng dụng AI',
        education: 'Học vấn',
        skills: 'Các kỹ năng',
        links: 'Mạng xã hội & Liên kết',
    },
    summaryText: "Xin chào, tôi là Hoàng. Với hơn sáu năm kinh nghiệm làm Biên tập viên Video, Biên tập viên Tin tức và Sáng tạo Nội dung AI, tôi chuyên tối ưu hóa độ rõ nét của nội dung và thu hút người đọc trên nhiều nền tảng số. Việc am hiểu thiết lập kỹ xảo quay dựng AI thế hệ mới, tối ưu hóa Prompt và phát triển ứng dụng AI giúp tôi tạo ra những sản phẩm giáo dục cá nhân hóa chất lượng. Tôi đam mê kết hợp kỹ năng kể chuyện truyền thống với sự phát triển của công nghệ để thúc đẩy trải nghiệm tự học và quy trình làm nội dung tự động.",
    experienceData: [
        { 
            role: 'MULTIMEDIA STRATEGIST & AI CONTENT CREATOR',
            company: 'Chuyên Education Center (Hà Nội, Việt Nam)',
            period: 'Thg 5 2026 - Thg 6 2026',
            achievements: [
                'Chiến lược thương hiệu: Tái định vị mô hình từ "Gia sư đơn lẻ" sang "Hệ thống giáo dục" cao cấp; xây dựng bộ khung Content Pillars và cấu trúc video chuyển đổi cho 3 thương hiệu cốt lõi (Gia sư Ms. Chuyên, Bean English, Chuyên Education).',
                'Ứng dụng công nghệ AI: Tích hợp AI Voice Clone và AI Visual Library vào quy trình sản xuất video AI; nghiên cứu tối ưu hóa prompt trên các nền tảng AI thế hệ mới (Kling AI, Runway ML, Veo3).',
                'Kỹ thuật sản xuất video AI: Làm chủ thiết lập góc quay camera (multi-shot, drone shot, orbit tracking, logo morphing animation etc.) và duy trì sự nhất quán của nhân vật (khuôn mặt, trang phục, giọng nói, tạo không khí và hiệu ứng âm thanh trong các cảnh quay).',
                'Phát triển ứng dụng AI: Thiết lập workflow sinh ảnh và video bằng công cụ trên FlowAI; sản xuất âm nhạc theo kịch bản bằng Suno AI. Xây dựng và nâng cấp các Chatbot AI cá nhân hóa (Chatbot Chuyên Education, Gem Chatbot English cho Gia Sư Ms Chuyên) và xuất bản 2 ứng dụng trên Google AI Studio phục vụ cho định hướng cá nhân hóa học tập cho học sinh.',
                'Sản xuất Multimedia: Sản xuất chuỗi nội dung cho 5 thương hiệu: Chuyên Education, Gia Sư Ms Chuyên, BEAN English, ASCEND ACADEMY, Future Tech Kids; thiết kế video TVC quảng cáo bằng AI, phục vụ cuộc thi Speaking tiếng Anh trẻ em.',
                'Vận hành & Thiết kế: Chuẩn hóa bộ nhận diện thương hiệu (poster, logo), xây dựng Master Template Canva phục vụ báo cáo và khôi phục thành công tài khoản lưu trữ doanh nghiệp qua kháng cáo Google.',
            ],
            extraLinks: [
                { name: 'Thư mục Google Drive', url: 'https://drive.google.com/drive/folders/1JLeemFDS4cda0RMqv8Wd-ko_uD3Y57_N' },
                { name: 'Video Demo trên YouTube', url: 'https://www.youtube.com/watch?v=p_pr8RI3T-c' }
            ]
        },
        { 
            role: 'AI CONTENT CREATOR',
            company: 'Deviation Lab (Hà Nội, Việt Nam)',
            period: 'Thg 3 2026 - Thg 3 2026',
            achievements: [
                'Tối ưu quy trình sản xuất: Ứng dụng hệ thống công cụ AI tiên tiến nhất hiện nay (Flow AI, Higgsfield, ElevenLabs) để rút ngắn thời gian sản xuất video mà vẫn nâng cao vượt trội chất lượng thành phẩm.',
                'Đồng bộ hóa hình ảnh: Xây dựng quy trình "Style-Lock" chuẩn hóa, đảm bảo tính nhất quán về bối cảnh và tạo hình nhân vật trong suốt video khi làm việc với các công cụ AI.',
                'Hậu kỳ tinh gọn: Chuẩn hóa quy trình edit trên CapCut, kết hợp giữa tư duy dựng phim truyền thống và các thành phần AI tạo sẵn để tối đa hóa trải nghiệm và sự tương tác của người xem.',
            ],
            extraLinks: [
                { name: 'Danh sách phát Video AI (VEO3, Kling, Higgsfield)', url: 'https://www.youtube.com/playlist?list=PL8l48rFpYhhaFUDxydFt2tTY55rpb9rWi' }
            ]
        },
        { 
            role: 'CHUYÊN VIÊN TRUYỀN THÔNG',
            company: 'Dương Linh Group (Hải Phòng, Việt Nam)',
            period: 'Thg 12 2025 - Thg 1 2026',
            achievements: [
                'Sáng tạo Nội dung & Phát triển Thương hiệu: Thiết kế bộ nhận diện kỹ thuật số và ấn phẩm in ấn toàn diện, bao gồm: hệ thống nhận diện thương hiệu trên mạng xã hội, mẫu thiết kế tuyển dụng, đồ họa thông tin (infographics) và video doanh nghiệp chất lượng 4K nhằm củng cố văn hóa nội bộ và vị thế thương hiệu trên thị trường.',
                'Xây dựng Tài liệu Đào tạo & Vận hành: Phát triển trọn gói hệ thống học liệu cho Nhà máy An Lạc, bao gồm các học phần đào tạo kỹ thuật (An toàn lao động, Quản lý chất lượng), bản tin nội bộ hàng tháng và các bộ "Sổ tay bỏ túi" chuyên dụng cho nhân viên và cấp quản lý.',
                'Sản xuất Truyền thông & Quản lý Sự kiện: Chịu trách nhiệm chính trong việc tư liệu hóa đa phương tiện và điều phối hậu cần cho các cột mốc quan trọng của doanh nghiệp, bao gồm lập danh mục kiểm soát sản xuất TVC và các sáng kiến trách nhiệm xã hội (CSR).',
                'Hỗ trợ Vận hành & Phối hợp Liên phòng ban: Trực tiếp giám sát hiện trường cho các dự án hậu cần và bền vững, bao gồm quản lý trạm cân trong quá trình xuất hàng quốc tế và quản trị dữ liệu giám sát dự án tái trồng rừng.',
            ],
            extraLinks: [
                { name: 'Thư mục Google Drive', url: 'https://drive.google.com/drive/folders/1kLUYpGsSFCWE6-R4HZf7keQ5tPZVxef9?usp=drive_link' }
            ]
        },
        { 
            role: 'CONTENT CREATOR',
            company: 'Avada Commerce (Hà Nội, Việt Nam)',
            period: 'Thg 10 2025 - Thg 10 2025',
            achievements: [
                'Ứng dụng AI & Tối ưu hóa Quy trình: Trực tiếp phát triển các ứng dụng AI chuyên biệt, bao gồm Công cụ Sáng tạo Ý tưởng Video tăng trưởng cho Shopify và Hệ thống Tóm tắt Đánh giá Khách hàng, nhằm tự động hóa quy trình vận hành thương mại điện tử.',
                'Hoạch định Chiến lược Nội dung: Dẫn dắt kế hoạch nội dung chiến lược trên nền tảng YouTube, tối ưu hóa quá trình sản xuất nhằm thúc đẩy sự tăng trưởng và khả năng tiếp cận của kênh.',
            ]
        },
        { 
            role: 'BIÊN TẬP VIÊN VIDEO/TIN TỨC',
            company: 'TB Group (Hà Nội, Việt Nam)',
            period: 'Thg 7 2023 – Thg 1 2024',
            achievements: [
                'Biên tập hơn 400 bài viết trong 6 tháng, nâng cao chất lượng và độ rõ ràng của nội dung.',
                'Phát triển kỹ năng viết và biên tập vững vàng qua nhiều chủ đề bài viết đa dạng.',
                'Tham gia các hoạt động nhóm, thúc đẩy tinh thần hợp tác và giao tiếp.',
                'Cải thiện phát triển cá nhân thông qua việc tham gia các hoạt động ngoại khóa.',
                'Đóng góp vào thành công của nhóm bằng các chiến lược biên tập và nội dung hiệu quả.',
            ]
        },
        { 
            role: 'BIÊN TẬP VIÊN TIN TỨC',
            company: 'Cryptoday (Hà Nội, Việt Nam)',
            period: 'Thg 6 2022 – Thg 5 2023',
            achievements: [
                'Viết hơn 1.000 bài báo về tiền điện tử và công nghệ, nâng cao sự tương tác và kiến thức của người đọc.',
                'Tạo các hướng dẫn nội bộ trên Canva, thúc đẩy sự hợp tác và phát triển kỹ năng trong nhóm.',
                'Thực hiện các cuộc phỏng vấn với các nhà lãnh đạo ngành, làm phong phú chất lượng nội dung và hiểu biết về thị trường.',
                'Theo dõi các ấn phẩm hàng đầu về tiền điện tử để phân tích xu hướng, đảm bảo báo cáo luôn cập nhật.',
            ]
        },
        { 
            role: 'BIÊN TẬP VIÊN VIDEO',
            company: 'ECI HOLDINGS JOINT STOCK COMPANY (Hà Nội, Việt Nam)',
            period: 'Thg 2 2022 – Thg 4 2022',
            achievements: [
                'Dẫn dắt đội ngũ media sản xuất 52 video về tiền điện tử, nâng cao độ rõ ràng và cách thức truyền tải nội dung.',
                'Quản lý sản xuất video, đảm bảo hoàn thành đúng thời hạn và giao tiếp rõ ràng.',
                'Chỉ đạo việc tạo các video hướng dẫn, cải thiện đáng kể sự tương tác của khán giả.',
            ]
        },
        { 
            role: 'BIÊN TẬP VIÊN VIDEO (TOÀN THỜI GIAN)',
            company: 'Lotus Media (Hà Nội, Việt Nam)',
            period: 'Thg 10 2018 – Thg 1 2022',
            achievements: [
                'Dẫn dắt các dự án chỉnh sửa video từ kịch bản phân cảnh đến định dạng cuối cùng.',
                'Tăng số lượng người đăng ký YouTube từ 1.000 lên 72.000.',
                'Quản lý nhiều kênh, tăng cường tương tác của khán giả.',
                'Giám sát hậu kỳ, đảm bảo chất lượng và tính liên tục.',
                'Phát triển các ý tưởng sáng tạo và câu chuyện video hấp dẫn.',
            ]
        },
        { 
            role: 'BIÊN TẬP VIÊN VIDEO (BÁN THỜI GIAN)',
            company: 'Pinetree Securities (Hà Nội, Việt Nam)',
            period: 'Thg 12 2020 – Thg 4 2021',
            achievements: [
                'Áp dụng phụ đề và hiệu ứng để nâng cao video YouTube, đảm bảo hoàn thành công việc đúng hạn.',
                'Quản lý thời hạn và giao tiếp, góp phần vào quy trình sản xuất liền mạch.',
                'Cải thiện chất lượng video thông qua chỉnh màu, nhận được phản hồi tích cực từ người xem.',
            ]
        },
    ],
    projectsData: [
        { name: 'IELTS Sniper Simulator', description: 'Ứng dụng Demo hỗ trợ trẻ ADHD trong quá trình học và luyện đề thi IELTS hiệu quả thông qua cơ chế game hóa.', link: 'https://ielts-sniper-simulator-111129719916.asia-southeast1.run.app' },
        { name: 'Khang\'s Learning Universe', description: 'Ứng dụng học tiếng Anh theo kiểu gamify tương tác xây dựng trên Remix giúp tối ưu hóa lộ trình học tập cá nhân hóa.', link: 'https://remix-khang-s-learning-universe-111129719916.asia-southeast1.run.app' },
        { name: 'Content Compass', description: 'Tóm tắt xu hướng nội dung bằng AI.', link: 'https://mrluke1618.github.io/content-compass' },
        { name: 'Customer Insights AI', description: 'Tóm tắt đánh giá của khách hàng bằng AI.', link: 'https://mrluke1618.github.io/customer-review-summarizer' },
        { name: 'Doc QA Assistant', description: 'Trợ lý hiệu đính tài liệu bằng AI.', link: 'https://mrluke1618.github.io/ai-proofreader' },
        { name: 'AI Audio Studio', description: 'Tạo, chỉnh sửa và nâng cao âm thanh bằng AI.', link: 'https://mrluke1618.github.io/ai-audio-studio' },
        { name: 'IELTS Practice Pod', description: 'Luyện tập cả 4 kỹ năng IELTS với sự hỗ trợ của AI.', link: 'https://mrluke1618.github.io/ielts-practice-app' },
        { name: 'Creator\'s Toolbox', description: 'Bộ công cụ dành cho người sáng tạo và biên tập viên.', link: 'https://mrluke1618.github.io/mrluke1818-creators-toolbox' },
        { name: 'Shopify Growth Video Idea Generator', description: 'Tạo ý tưởng video mục tiêu để thúc đẩy tăng trưởng cửa hàng Shopify.', link: 'https://mrluke1618.github.io/shopify-growth-video-idea-generator-v2/' },
        { name: 'Kokoro English Guide', description: 'Hướng dẫn học tiếng Anh tương tác.', link: 'https://mrluke1618.github.io/Kokoro-English-Guide/preloader.html' },
    ],
    educationData: [
        {
            degree: 'Thạc sĩ ngành Nghiên cứu Truyền thông và Phương tiện',
            institution: 'Đại học Dublin City',
            period: '2024–2025',
            details: ['Loại: Bằng danh dự hạng hai, loại I', 'Các môn học: Hình ảnh, Thiết kế âm thanh & Âm học, Hiểu về Mạng xã hội, Phương tiện đáp ứng, Viết kịch bản, Thiết kế trực quan, Sản xuất hình ảnh động & Video, Kế hoạch & Quản lý dự án, Dự án lớn.'],
            projects: [
                { name: 'The Sailboat (Dự án lớn)', link: 'https://mrluke1618.github.io/Major-Project-WebGL', type: 'WebGL' },
                { name: 'Stories Of The Liberties', link: 'https://minhhoangcaodcu.wordpress.com/2024/12/05/stories-of-the-liberties', type: 'Blog' },
                { name: 'Emerging Media Praxis', link: 'https://www.tiktok.com/@hoangcao2704/video/7468458115822849297', type: 'TikTok' },
                { name: 'Visual Design Module', link: 'https://drive.google.com/drive/folders/1ongFDTY1WamiKPnmdiLkW2Q-zz_6jQuv', type: 'Tài sản' },
                { name: 'The Stillness Before The Storm', link: 'https://drive.google.com/file/d/1Q2hUgetAZfBgNaouebMADcgBQ1yY1_wD/view?usp=sharing', type: 'Kịch bản' },
                { name: 'Pawsitive Nutrition App', link: 'https://www.tiktok.com/@hoangcao2704/video/7480205819913473298', type: 'Figma' },
                { name: 'The Post (Ứng dụng Unity 6)', link: 'https://www.youtube.com/watch?v=M3MkM_OE3Oc', type: 'Demo' },
            ]
        },
        {
            degree: 'Cử nhân Công nghệ (Công nghệ Thông tin)',
            institution: 'Học viện Công nghệ Bưu chính Viễn thông, Hà Nội',
            period: '2013–2018',
            details: ['Phát triển bài kiểm tra trắc nghiệm ngữ pháp tiếng Anh tương tác trong Unity 2017.', 'Điểm đồ án tốt nghiệp: 8.29/10.', 'Kỹ năng: Unity, nghiên cứu, và quản lý thời gian.'],
        }
    ],
    skillsData: [
        { name: 'Biên tập Video', level: 'Experienced' },
        { name: 'Biên tập Tin tức', level: 'Experienced' },
        { name: 'Sáng tạo nội dung AI', level: 'Experienced' },
        { name: 'Tạo video VEO3', level: 'Experienced' },
        { name: 'Phát triển ứng dụng AI', level: 'Skillful' },
        { name: 'Figma', level: 'Skillful' },
        { name: 'Canva', level: 'Skillful' },
        { name: 'Quy trình Flow Omni', level: 'Skillful' },
        { name: 'Thiết lập Góc quay Đa dạng', level: 'Skillful' },
        { name: 'Phát triển phần mềm Unity', level: 'Skillful' },
        { name: 'Quản lý Mạng xã hội', level: 'Skillful' },
        { name: 'Thiết kế đồ họa', level: 'Skillful' },
        { name: 'Diễn xuất', level: 'Beginner' },
    ],
    linksData: [
        { name: 'YouTube', url: 'https://www.youtube.com/@luke1618gamer', icon: Youtube },
        { name: 'TikTok', url: 'https://www.tiktok.com/@hoangcao2704', icon: Video },
        { name: 'LinkedIn', url: 'https://www.linkedin.com/in/hoangminhcao', icon: Linkedin },
        { name: 'Video Showcase', url: 'https://drive.google.com/file/d/1MKrJ9lNwt3Y0gzC2UYbodEIYDmIc0iVa/view?usp=drive_link', icon: FileText },
        { name: 'Work Portfolio', url: 'https://docs.google.com/document/d/1ZO9BMG0B3p7g_aXBwxDnV92xEyVCbmjk_HJZeSpGKYk/edit?usp=sharing', icon: FileCode2 },
        { name: 'IELTS 7.5', url: 'https://drive.google.com/file/d/11RWK0L2g-zs440j-dh8ig5RMIpG0KIWY/view?usp=sharing', icon: FileText },
        { name: 'TOEIC 960', url: 'https://drive.google.com/file/d/1vT5oUbCPYPcBTH50dfzlVG-sl9FPvUcV/view?usp=sharing', icon: FileText },
    ],
  }
};
