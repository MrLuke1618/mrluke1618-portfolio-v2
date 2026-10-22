import { type LucideIcon } from 'lucide-react';

export type Language = 'en' | 'vi';

export type NavigationHeader = {
  type: 'header';
  title: string;
};

export type NavigationLink = {
  type: 'link';
  id: string;
  title: string;
  icon: LucideIcon;
};

export type NavigationItem = NavigationHeader | NavigationLink;

export interface Project {
  name: string;
  description: string;
  link: string;
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  achievements: string[];
  extraLinks?: { name: string; url: string }[];
}

export interface EducationProject {
  name: string;
  link: string;
  type: string;
}

export interface EducationItem {
  degree: string;
  institution: string;
  period: string;
  details: string[];
  projects?: EducationProject[];
}

export interface Link {
  name: string;
  url: string;
  icon: LucideIcon;
}

export interface Skill {
  name: string;
  level: 'Experienced' | 'Skillful' | 'Beginner';
}

export interface LanguageData {
    navigation: NavigationItem[];
    summaryText: string;
    experienceData: Experience[];
    projectsData: Project[];
    educationData: EducationItem[];
    skillsData: Skill[];
    linksData: Link[];
    header: {
        title: string;
        subtitle: string;
    };
    viewTitles: {
        summary: string;
        experience: string;
        projects: string;
        education: string;
        skills: string;
        links: string;
    };
}
