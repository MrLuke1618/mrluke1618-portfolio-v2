export type PerformanceTier = 'ultra' | 'balanced' | 'lite';

export type GameZoneId = 'vault' | 'arcade' | 'academy' | 'lounge' | 'shipyard';

export interface GameZone {
  id: GameZoneId;
  titleEn: string;
  titleVi: string;
  subtitleEn: string;
  subtitleVi: string;
  iconName: string;
  color: string;
  glowColor: string;
  mapX: number; // Percentage on 2.5D map (0-100)
  mapY: number; // Percentage on 2.5D map (0-100)
  dialogueIntroEn: string;
  dialogueIntroVi: string;
  recommendedQueriesEn: string[];
  recommendedQueriesVi: string[];
}

export type SkillBranch = 'systems' | 'video_ai' | 'frontend_3d' | 'growth';

export interface SkillTreeNode {
  id: string;
  name: string;
  branch: SkillBranch;
  level: 'Expert' | 'Advanced' | 'Proficient';
  levelVi: 'Chuyên gia' | 'Nâng cao' | 'Thành thạo';
  masteryPercent: number;
  descriptionEn: string;
  descriptionVi: string;
  highlightProjects: string[];
  iconName: string;
}

export interface QuestItem {
  id: string;
  role: string;
  roleVi?: string;
  company: string;
  period: string;
  periodVi?: string;
  status: 'Completed' | 'Active';
  xpReward: number;
  questRank: 'S-Rank' | 'A-Rank' | 'B-Rank';
  summaryEn: string;
  summaryVi: string;
  achievements: string[];
  achievementsVi?: string[];
  lootLinks?: {
    name: string;
    url: string;
    type: 'drive' | 'youtube' | 'doc' | 'github';
  }[];
}

export interface EasterEggSnippet {
  id: string;
  title: string;
  filename: string;
  language: 'rust' | 'python' | 'yaml';
  tag: string;
  descriptionEn: string;
  descriptionVi: string;
  code: string;
}

export interface TradingCardItem {
  id: string;
  title: string;
  categoryEn: string;
  categoryVi: string;
  type: 'youtube' | 'doc' | 'drive' | 'github' | 'tool' | 'demo';
  url: string;
  readTimeEstimate: string;
  wordCount?: number;
  tags: string[];
  descriptionEn: string;
  descriptionVi: string;
  deepDiveEn?: string;
  deepDiveVi?: string;
  featured?: boolean;
}

export interface AICompanionMessage {
  id: string;
  sender: 'npc' | 'user' | 'system';
  text: string;
  timestamp: string;
  zoneContext?: GameZoneId;
}

export interface PipelineStep {
  id: string;
  stepNumber: string;
  titleEn: string;
  titleVi: string;
  tool: string;
  descriptionEn: string;
  descriptionVi: string;
  sampleLog: string;
  durationMs: number;
}
