import React, { useState, useEffect } from 'react';
import { i18n } from './constants';
import { type Language, type NavigationItem, type Project, type Experience, type EducationItem, type Skill, type Link as LinkType, NavigationLink } from './types';
import { ArrowUpRight, ArrowUp, Clock, MapPin, Compass, Loader2, Sun, Cloud, CloudRain, CloudSnow, CloudLightning, Thermometer, Youtube, Music, Tv, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';

// --- Reusable Components ---

const LanguageSwitcher: React.FC<{ language: Language; setLanguage: (lang: Language) => void }> = ({ language, setLanguage }) => (
    <div className="flex items-center bg-card-bg border border-border-color rounded-full p-1 shadow-md">
        <button 
            onClick={() => setLanguage('en')}
            className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${language === 'en' ? 'bg-brand-purple text-white' : 'text-text-secondary hover:text-text-primary'}`}
            aria-pressed={language === 'en'}
        >
            EN
        </button>
        <button 
            onClick={() => setLanguage('vi')}
            className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${language === 'vi' ? 'bg-brand-purple text-white' : 'text-text-secondary hover:text-text-primary'}`}
            aria-pressed={language === 'vi'}
        >
            VI
        </button>
    </div>
);

const CenteredHeader: React.FC<{ 
    title: string; 
    subtitle: string; 
    language: Language; 
    setLanguage: (lang: Language) => void;
}> = ({ title, subtitle, language, setLanguage }) => (
    <header className="py-8 text-center relative">
        <h1 className="text-4xl font-bold text-text-primary tracking-tight sm:text-5xl">{title}</h1>
        <p className="mt-3 text-lg text-text-secondary sm:text-xl">{subtitle}</p>
        <div className="mt-6 flex justify-center items-center gap-4">
            <LanguageSwitcher language={language} setLanguage={setLanguage} />
        </div>
    </header>
);

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h2 className="text-2xl font-bold text-text-primary mb-8">{children}</h2>
);

const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
    <div className={`bg-card-bg border border-border-color rounded-xl p-6 transition-all hover:border-brand-purple/50 hover:shadow-lg hover:shadow-brand-purple/10 ${className}`}>
        {children}
    </div>
);

const Sidebar: React.FC<{ navigationItems: NavigationItem[]; activeSection: string; setActiveSection: (id: string) => void }> = ({ navigationItems, activeSection, setActiveSection }) => (
    <div className="p-2 bg-card-bg/50 border border-border-color rounded-xl">
        <nav className="flex flex-col gap-1">
            {navigationItems.map((item, index) => {
                if (item.type === 'header') {
                    return <h2 key={index} className="text-sm font-semibold text-text-secondary px-3 pt-4 pb-2 uppercase tracking-wider">{item.title}</h2>;
                }
                return (
                    <button
                        key={item.id}
                        onClick={() => setActiveSection(item.id)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors text-left ${
                            activeSection === item.id
                                ? 'bg-brand-purple text-white'
                                : 'text-text-secondary hover:bg-border-color hover:text-text-primary'
                        }`}
                    >
                        <item.icon className="w-4 h-4 flex-shrink-0" />
                        <span>{item.title}</span>
                    </button>
                );
            })}
        </nav>
    </div>
);

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();
    const yearString = currentYear === 2025 ? '2025' : `2025-${currentYear}`;
    return (
        <footer className="text-center text-xs text-text-secondary py-6 mt-auto border-t border-border-color">
            © {yearString} Developed by MrLuke1618. All rights reserved.
        </footer>
    );
};

const BackToTopButton: React.FC<{ show: boolean; onClick: () => void; }> = ({ show, onClick }) => {
    if (!show) return null;
    return (
        <button
            onClick={onClick}
            className="fixed bottom-6 right-6 bg-brand-purple text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-purple-700 transition-all duration-300 transform hover:-translate-y-1 z-50"
            aria-label="Go to top"
        >
            <ArrowUp className="w-6 h-6" />
        </button>
    );
};


// --- Animation Variants ---

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
        },
    },
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: 'spring' as const,
            stiffness: 100,
            damping: 15,
        },
    },
};

// --- Section Views ---

const calculateReadingTime = (text: string, language: Language) => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const wpm = 200; // Standard reading speed
    const totalSeconds = Math.max(1, Math.ceil((words / wpm) * 60));
    
    if (totalSeconds < 60) {
        return language === 'en' 
            ? { text: `~${totalSeconds}s read`, words }
            : { text: `~${totalSeconds} giây đọc`, words };
    } else {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const timeStr = seconds > 0 
            ? (language === 'en' ? `${minutes}m ${seconds}s read` : `${minutes} phút ${seconds} giây đọc`)
            : (language === 'en' ? `${minutes}m read` : `${minutes} phút đọc`);
        return { text: `~${timeStr}`, words };
    }
};

const SummaryView: React.FC<{ 
    title: string; 
    summaryText: string; 
    dashboardItems: NavigationLink[]; 
    setActiveSection: (id: string) => void; 
    language: Language;
}> = ({ title, summaryText, dashboardItems, setActiveSection, language }) => {
    const readingTime = calculateReadingTime(summaryText, language);
    return (
        <>
            <SectionTitle>{title}</SectionTitle>
            <div className="space-y-8">
                <Card>
                    <div className="flex items-center gap-2 text-xs text-text-secondary mb-4 pb-2 border-b border-border-color/40 font-mono">
                        <BookOpen className="w-4 h-4 text-brand-purple" />
                        <span className="font-semibold text-text-primary">{readingTime.text}</span>
                        <span className="opacity-40">•</span>
                        <span>{readingTime.words} {language === 'en' ? 'words' : 'từ'}</span>
                    </div>
                    <p className="text-text-secondary leading-relaxed whitespace-pre-line">{summaryText}</p>
                </Card>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {dashboardItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveSection(item.id)}
                            className="group bg-card-bg border border-border-color rounded-lg p-4 text-center transition-all hover:border-brand-purple hover:shadow-md hover:shadow-brand-purple/10"
                        >
                            <item.icon className="w-8 h-8 mx-auto text-text-secondary group-hover:text-brand-purple transition-colors mb-2" />
                            <p className="text-sm font-semibold text-text-primary">{item.title}</p>
                        </button>
                    ))}
                </div>
            </div>
        </>
    );
};

const ExperienceView: React.FC<{ title: string; experienceData: Experience[] }> = ({ title, experienceData }) => (
    <>
        <SectionTitle>{title}</SectionTitle>
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
        >
            {experienceData.map((job) => (
                <motion.div key={job.company} variants={itemVariants}>
                    <Card>
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-text-primary">{job.role}</h3>
                                <p className="text-sm text-text-secondary">{job.company}</p>
                            </div>
                            <p className="text-xs text-text-secondary flex-shrink-0 ml-4 text-right">{job.period}</p>
                        </div>
                        <ul className="mt-4 list-disc list-inside text-text-secondary text-sm space-y-2">
                            {job.achievements.map((ach, index) => <li key={index}>{ach}</li>)}
                        </ul>
                        {job.extraLinks && job.extraLinks.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-border-color">
                                <h4 className="text-xs font-semibold text-text-primary mb-2">Attachments & Links / Tài liệu tham khảo:</h4>
                                <div className="flex flex-wrap gap-2">
                                    {job.extraLinks.map((link, idx) => (
                                        <a
                                            key={idx}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 text-xs text-brand-purple hover:underline bg-brand-purple/10 border border-brand-purple/20 px-2.5 py-1 rounded-md transition-all hover:bg-brand-purple/20"
                                        >
                                            <span>{link.name}</span>
                                            <ArrowUpRight className="w-3.5 h-3.5" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </Card>
                </motion.div>
            ))}
        </motion.div>
    </>
);

const ProjectsView: React.FC<{ title: string; projectsData: Project[]; language: Language }> = ({ title, projectsData, language }) => (
    <>
        <SectionTitle>{title}</SectionTitle>
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
            {projectsData.map((project) => {
                const readingTime = calculateReadingTime(project.description, language);
                return (
                    <motion.div key={project.name} variants={itemVariants} className="h-full">
                        <a href={project.link} target="_blank" rel="noopener noreferrer" className="block h-full">
                            <Card className="h-full group flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start gap-4">
                                        <h3 className="font-bold text-text-primary group-hover:text-brand-purple transition-colors">{project.name}</h3>
                                        <div className="flex items-center gap-1.5 text-[10px] text-text-secondary font-mono flex-shrink-0 bg-brand-purple/5 border border-brand-purple/10 px-2 py-0.5 rounded-md">
                                            <BookOpen className="w-3.5 h-3.5 text-brand-purple" />
                                            <span className="font-semibold text-text-primary">{readingTime.text}</span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-text-secondary mt-2 mb-4">{project.description}</p>
                                </div>
                                <div className="text-sm font-semibold text-brand-purple flex items-center gap-1 mt-auto pt-2 border-t border-border-color/30">
                                    {language === 'en' ? 'View Project' : 'Xem dự án'} <ArrowUpRight className="w-4 h-4 transform group-hover:-translate-y-px group-hover:translate-x-px transition-transform" />
                                </div>
                            </Card>
                        </a>
                    </motion.div>
                );
            })}
        </motion.div>
    </>
);

const EducationView: React.FC<{ title: string; educationData: EducationItem[] }> = ({ title, educationData }) => (
    <>
        <SectionTitle>{title}</SectionTitle>
        <div className="space-y-6">
            {educationData.map((edu) => (
                <Card key={edu.institution}>
                    <h3 className="font-bold text-text-primary">{edu.degree}</h3>
                    <p className="text-sm text-text-secondary">{edu.institution}</p>
                    <p className="text-xs text-text-secondary mt-1">{edu.period}</p>
                    <ul className="mt-4 text-sm text-text-secondary space-y-1">
                       {edu.details.map((detail, i) => <li key={i}>- {detail}</li>)}
                    </ul>
                     {edu.projects && (
                        <div className="mt-4 pt-4 border-t border-border-color">
                            <h4 className="text-sm font-semibold text-text-primary mb-2">Key Projects:</h4>
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {edu.projects.map(p => (
                                    <a href={p.link} key={p.name} target="_blank" rel="noopener noreferrer" className="text-sm text-brand-purple hover:underline p-2 rounded-md hover:bg-border-color flex items-center justify-between">
                                        <span>{p.name} <span className="text-text-secondary text-xs">({p.type})</span></span>
                                        <ArrowUpRight className="w-4 h-4" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </Card>
            ))}
        </div>
    </>
);

const SkillsView: React.FC<{ title: string; skillsData: Skill[] }> = ({ title, skillsData }) => (
    <>
        <SectionTitle>{title}</SectionTitle>
        <Card>
            {['Experienced', 'Skillful', 'Beginner'].map(level => (
                <div key={level} className="mb-4 last:mb-0">
                    <h3 className="text-sm font-semibold text-brand-purple mb-2 capitalize">{level}</h3>
                    <div className="flex flex-wrap gap-2">
                        {skillsData.filter(s => s.level.toLowerCase() === level.toLowerCase()).map(skill => (
                            <span key={skill.name} className="bg-border-color text-text-primary text-sm px-3 py-1 rounded-full">
                                {skill.name}
                            </span>
                        ))}
                    </div>
                </div>
            ))}
        </Card>
    </>
);

const LinksView: React.FC<{ title: string; linksData: LinkType[] }> = ({ title, linksData }) => (
    <>
        <SectionTitle>{title}</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {linksData.map((link) => (
                <a href={link.url} target="_blank" rel="noopener noreferrer" key={link.name} className="block group">
                     <Card>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <link.icon className="w-5 h-5 text-text-secondary group-hover:text-brand-purple transition-colors" />
                                <span className="font-semibold text-text-primary">{link.name}</span>
                            </div>
                            <ArrowUpRight className="w-5 h-5 text-text-secondary transform transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        </div>
                    </Card>
                </a>
            ))}
        </div>
    </>
);

// --- Live Tracker & Monitor Component ---

const cityHotspots: { [key: string]: Array<{ nameEn: string; nameVi: string; query: string }> } = {
    'Hanoi': [
        { nameEn: 'Hoan Kiem Lake', nameVi: 'Hồ Hoàn Kiếm', query: 'Hoan Kiem Lake, Hanoi' },
        { nameEn: 'West Lake', nameVi: 'Hồ Tây', query: 'West Lake, Hanoi' },
        { nameEn: 'Temple of Literature', nameVi: 'Văn Miếu Quốc Tử Giám', query: 'Temple of Literature, Hanoi' },
        { nameEn: 'St. Joseph\'s Cathedral', nameVi: 'Nhà thờ Lớn Hà Nội', query: 'St. Joseph\'s Cathedral, Hanoi' },
        { nameEn: 'Hanoi Opera House', nameVi: 'Nhà hát Lớn Hà Nội', query: 'Hanoi Opera House' },
        { nameEn: 'Imperial Citadel of Thang Long', nameVi: 'Hoàng thành Thăng Long', query: 'Imperial Citadel of Thang Long' }
    ],
    'Ho Chi Minh City': [
        { nameEn: 'Ben Thanh Market', nameVi: 'Chợ Bến Thành', query: 'Ben Thanh Market, Ho Chi Minh City' },
        { nameEn: 'Independence Palace', nameVi: 'Dinh Độc Lập', query: 'Independence Palace, Ho Chi Minh City' },
        { nameEn: 'Notre-Dame Cathedral', nameVi: 'Nhà thờ Đức Bà Sài Gòn', query: 'Notre-Dame Cathedral, Ho Chi Minh City' },
        { nameEn: 'Saigon Opera House', nameVi: 'Nhà hát Thành phố Hồ Chí Minh', query: 'Saigon Opera House' },
        { nameEn: 'Landmark 81', nameVi: 'Tòa nhà Landmark 81', query: 'Landmark 81, Ho Chi Minh City' }
    ],
    'Hai Phong': [
        { nameEn: 'Do Son Beach', nameVi: 'Bãi biển Đồ Sơn', query: 'Do Son Beach, Hai Phong' },
        { nameEn: 'Cat Ba National Park', nameVi: 'Vườn quốc gia Cát Bà', query: 'Cat Ba National Park, Hai Phong' },
        { nameEn: 'Hai Phong Opera House', nameVi: 'Nhà hát Lớn Hải Phòng', query: 'Hai Phong Opera House' },
        { nameEn: 'Tam Bac Lake', nameVi: 'Hồ Tam Bạc', query: 'Tam Bac Lake, Hai Phong' }
    ],
    'Da Nang': [
        { nameEn: 'Dragon Bridge', nameVi: 'Cầu Rồng', query: 'Dragon Bridge, Da Nang' },
        { nameEn: 'My Khe Beach', nameVi: 'Bãi biển Mỹ Khê', query: 'My Khe Beach, Da Nang' },
        { nameEn: 'Marble Mountains', nameVi: 'Ngũ Hành Sơn', query: 'Marble Mountains, Da Nang' },
        { nameEn: 'Ba Na Hills', nameVi: 'Bà Nà Hills', query: 'Sun World Ba Na Hills, Da Nang' }
    ]
};

const selectHotspot = (city: string) => {
    const normalized = city.toLowerCase();
    let key = 'Hanoi'; // default
    if (normalized.includes('hanoi') || normalized.includes('hà nội')) {
        key = 'Hanoi';
    } else if (normalized.includes('ho chi minh') || normalized.includes('saigon') || normalized.includes('sài gòn') || normalized.includes('hồ chí minh')) {
        key = 'Ho Chi Minh City';
    } else if (normalized.includes('hai phong') || normalized.includes('hải phòng')) {
        key = 'Hai Phong';
    } else if (normalized.includes('da nang') || normalized.includes('đà nẵng')) {
        key = 'Da Nang';
    } else {
        const genericHotspots = [
            { nameEn: 'City Center', nameVi: 'Trung tâm Thành phố', query: `${city} City Center` },
            { nameEn: 'Local Landmark', nameVi: 'Địa danh địa phương', query: `${city} landmark` },
            { nameEn: 'Public Park', nameVi: 'Công viên công cộng', query: `${city} park` },
            { nameEn: 'Cultural Square', nameVi: 'Quảng trường văn hóa', query: `${city} square` }
        ];
        const randomIndex = Math.floor(Math.random() * genericHotspots.length);
        return genericHotspots[randomIndex];
    }
    
    const list = cityHotspots[key];
    const randomIndex = Math.floor(Math.random() * list.length);
    return list[randomIndex];
};

const LiveTracker: React.FC<{ language: Language }> = ({ language }) => {
    const [time, setTime] = useState<Date>(new Date());
    const [locationInfo, setLocationInfo] = useState({
        city: 'Hanoi',
        country: 'Vietnam',
        latitude: 21.0285,
        longitude: 105.8542
    });
    const [weather, setWeather] = useState<{ temp: number; code: number } | null>(null);
    const [loadingWeather, setLoadingWeather] = useState(false);
    const [featuredHotspot, setFeaturedHotspot] = useState<{ nameEn: string; nameVi: string; query: string } | null>(null);

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const fetchIPLocation = async () => {
            try {
                const res = await fetch('https://ipapi.co/json/');
                if (res.ok) {
                    const data = await res.json();
                    if (data.city && data.country_name) {
                        setLocationInfo({
                            city: data.city,
                            country: data.country_name,
                            latitude: data.latitude || 21.0285,
                            longitude: data.longitude || 105.8542
                        });
                    }
                }
            } catch (e) {
                // Silently fallback to Hanoi
            }
        };
        fetchIPLocation();
    }, []);

    useEffect(() => {
        if (locationInfo.city) {
            setFeaturedHotspot(selectHotspot(locationInfo.city));
        }
    }, [locationInfo.city]);

    useEffect(() => {
        const fetchWeather = async () => {
            setLoadingWeather(true);
            try {
                const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${locationInfo.latitude}&longitude=${locationInfo.longitude}&current=temperature_2m,weather_code`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.current) {
                        setWeather({
                            temp: Math.round(data.current.temperature_2m),
                            code: data.current.weather_code
                        });
                    }
                }
            } catch (err) {
                console.error('Failed to fetch weather', err);
            } finally {
                setLoadingWeather(false);
            }
        };
        fetchWeather();
    }, [locationInfo.latitude, locationInfo.longitude]);

    const getWeatherDetails = (code: number, lang: Language) => {
        if (code === 0) return { icon: Sun, text: lang === 'en' ? 'Clear Sky' : 'Trời quang' };
        if (code >= 1 && code <= 3) return { icon: Cloud, text: lang === 'en' ? 'Partly Cloudy' : 'Nhiều mây' };
        if (code === 45 || code === 48) return { icon: Cloud, text: lang === 'en' ? 'Foggy' : 'Có sương mù' };
        if ((code >= 51 && code <= 55) || (code >= 61 && code <= 65) || (code >= 80 && code <= 82)) return { icon: CloudRain, text: lang === 'en' ? 'Rainy' : 'Có mưa' };
        if (code >= 71 && code <= 75) return { icon: CloudSnow, text: lang === 'en' ? 'Snowy' : 'Có tuyết' };
        if (code >= 95 && code <= 99) return { icon: CloudLightning, text: lang === 'en' ? 'Thunderstorm' : 'Có dông bão' };
        return { icon: Cloud, text: lang === 'en' ? 'Cloudy' : 'Nhiều mây' };
    };

    const formattedTime = time.toLocaleTimeString(language === 'en' ? 'en-US' : 'vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });

    const formattedDate = time.toLocaleDateString(language === 'en' ? 'en-US' : 'vi-VN', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    return (
        <div className="bg-card-bg/40 border border-border-color rounded-xl p-4 shadow-md text-sm space-y-3.5 relative overflow-hidden transition-all duration-300 hover:border-brand-purple/40">
            <div className="flex items-center justify-between border-b border-border-color/60 pb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-brand-purple" />
                    {language === 'en' ? 'Live Workspace' : 'Không gian làm việc'}
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-brand-purple animate-pulse" />
                    <span className="text-[10px] font-mono text-text-secondary">
                        UTC+7
                    </span>
                </span>
            </div>

            <div className="space-y-0.5">
                <div className="text-xl font-bold font-mono tracking-tight text-text-primary">{formattedTime}</div>
                <div className="text-xs text-text-secondary">{formattedDate}</div>
                <div className="text-[10px] text-text-secondary font-mono mt-1 opacity-70">TZ: {timezone}</div>
            </div>

            {/* Weather Widget */}
            <div className="border-t border-border-color/40 pt-2.5">
                <div className="text-xs text-text-secondary flex items-center gap-1 mb-1.5">
                    <Thermometer className="w-3.5 h-3.5 text-brand-purple" />
                    <span>{language === 'en' ? 'Local Weather' : 'Thời tiết địa phương'}</span>
                </div>
                {loadingWeather ? (
                    <div className="flex items-center gap-2 text-xs text-text-secondary animate-pulse py-1">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-purple" />
                        <span>{language === 'en' ? 'Fetching weather...' : 'Đang lấy thời tiết...'}</span>
                    </div>
                ) : weather ? (
                    <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-brand-purple/5 border border-brand-purple/10 text-xs text-text-primary font-medium">
                        {React.createElement(getWeatherDetails(weather.code, language).icon, { className: "w-4 h-4 text-brand-purple" })}
                        <span>{getWeatherDetails(weather.code, language).text}</span>
                        <span className="ml-auto flex items-center gap-0.5 text-brand-purple font-mono font-bold">
                            {weather.temp}°C
                        </span>
                    </div>
                ) : (
                    <span className="text-xs text-text-secondary italic">{language === 'en' ? 'Unavailable' : 'Không có thông tin'}</span>
                )}
            </div>

            <div className="border-t border-border-color/40 pt-2.5 space-y-1">
                <div className="text-xs text-text-secondary flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-brand-purple" />
                    <span>{language === 'en' ? 'Current City' : 'Thành phố hiện tại'}</span>
                </div>
                <div className="text-sm font-semibold text-text-primary pl-4">
                    {locationInfo.city}, {locationInfo.country}
                </div>
                {featuredHotspot && (
                    <>
                        <div className="text-xs text-text-secondary flex items-center gap-1 pt-1.5">
                            <Compass className="w-3 h-3 text-brand-purple" />
                            <span>{language === 'en' ? 'Featured Hotspot' : 'Địa danh nổi bật'}</span>
                        </div>
                        <div className="text-sm font-bold text-brand-purple pl-4">
                            {language === 'en' ? featuredHotspot.nameEn : featuredHotspot.nameVi}
                        </div>
                    </>
                )}
                <div className="mt-2 overflow-hidden rounded-lg border border-border-color/60 shadow-inner">
                    <iframe
                        title="Google Map Location"
                        src={`https://maps.google.com/maps?q=${encodeURIComponent(featuredHotspot ? featuredHotspot.query : (locationInfo.city + ', ' + locationInfo.country))}&z=13&output=embed`}
                        className="w-full h-32 opacity-85 hover:opacity-100 transition-opacity"
                        style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) grayscale(30%)' }}
                        allowFullScreen={false}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                </div>
            </div>

            {/* Quick Shortcuts */}
            <div className="pt-2.5 border-t border-border-color/40 space-y-2">
                <div className="text-xs text-text-secondary flex items-center gap-1">
                    <Compass className="w-3.5 h-3.5 text-brand-purple" />
                    <span>{language === 'en' ? 'Shortcuts' : 'Lối tắt truy cập'}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                    <a 
                        href="https://youtube.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex flex-col items-center gap-1 p-2 rounded-lg bg-card-bg/50 border border-border-color hover:border-brand-purple/40 hover:bg-brand-purple/5 transition-all text-center group"
                    >
                        <Youtube className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform" />
                        <span className="text-[9px] font-medium text-text-secondary group-hover:text-text-primary">YouTube</span>
                    </a>
                    <a 
                        href="https://open.spotify.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex flex-col items-center gap-1 p-2 rounded-lg bg-card-bg/50 border border-border-color hover:border-brand-purple/40 hover:bg-brand-purple/5 transition-all text-center group"
                    >
                        <Music className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition-transform" />
                        <span className="text-[9px] font-medium text-text-secondary group-hover:text-text-primary">Spotify</span>
                    </a>
                    <a 
                        href="https://netflix.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex flex-col items-center gap-1 p-2 rounded-lg bg-card-bg/50 border border-border-color hover:border-brand-purple/40 hover:bg-brand-purple/5 transition-all text-center group"
                    >
                        <Tv className="w-5 h-5 text-rose-500 group-hover:scale-110 transition-transform" />
                        <span className="text-[9px] font-medium text-text-secondary group-hover:text-text-primary">Netflix</span>
                    </a>
                </div>
            </div>
        </div>
    );
};

// --- Main App Component ---

const App: React.FC = () => {
    const [language, setLanguage] = useState<Language>('en');
    const [showScroll, setShowScroll] = useState(false);
    
    const data = i18n[language];
    
    const getFirstSectionId = (navItems: NavigationItem[]) => {
        const firstLink = navItems.find(item => item.type === 'link');
        return firstLink && 'id' in firstLink ? firstLink.id : '';
    };

    const [activeSection, setActiveSection] = useState<string>(getFirstSectionId(data.navigation));

    useEffect(() => {
        const sectionExists = data.navigation.some(item => item.type === 'link' && item.id === activeSection);
        if (!sectionExists) {
            setActiveSection(getFirstSectionId(data.navigation));
        }
    }, [language, activeSection, data.navigation]);

    const checkScrollTop = () => {
        if (!showScroll && window.pageYOffset > 400) {
            setShowScroll(true);
        } else if (showScroll && window.pageYOffset <= 400) {
            setShowScroll(false);
        }
    };

    const scrollTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        window.addEventListener('scroll', checkScrollTop);
        return () => window.removeEventListener('scroll', checkScrollTop);
    }, [showScroll]);

    const renderContent = () => {
        switch (activeSection) {
            case 'summary': {
                const dashboardItems = data.navigation.filter(
                    item => item.type === 'link' && ['experience', 'projects', 'education', 'skills', 'links'].includes(item.id)
                ) as NavigationLink[];
                return <SummaryView 
                    title={data.viewTitles.summary} 
                    summaryText={data.summaryText} 
                    dashboardItems={dashboardItems} 
                    setActiveSection={setActiveSection}
                    language={language}
                />;
            }
            case 'experience': return <ExperienceView title={data.viewTitles.experience} experienceData={data.experienceData} />;
            case 'projects': return <ProjectsView title={data.viewTitles.projects} projectsData={data.projectsData} language={language} />;
            case 'education': return <EducationView title={data.viewTitles.education} educationData={data.educationData} />;
            case 'skills': return <SkillsView title={data.viewTitles.skills} skillsData={data.skillsData} />;
            case 'links': return <LinksView title={data.viewTitles.links} linksData={data.linksData} />;
            default: return null;
        }
    };

    return (
        <div className="min-h-screen font-sans flex flex-col">
            <div className="flex-grow w-full">
                <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                    <CenteredHeader 
                        title={data.header.title} 
                        subtitle={data.header.subtitle}
                        language={language}
                        setLanguage={setLanguage}
                    />
                    <div className="flex flex-col md:flex-row gap-8 mt-8">
                        <aside className="md:w-1/4 lg:w-1/5 md:sticky md:top-8 self-start space-y-4">
                            <Sidebar navigationItems={data.navigation} activeSection={activeSection} setActiveSection={setActiveSection} />
                            <LiveTracker language={language} />
                        </aside>
                        <main className="flex-1">
                            <div key={activeSection} className="fade-in">
                                {renderContent()}
                            </div>
                        </main>
                    </div>
                </div>
            </div>
            <div className="mt-auto">
                <Footer />
            </div>
            <div>
                <BackToTopButton show={showScroll} onClick={scrollTop} />
            </div>
        </div>
    );
};

export default App;
