import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Cpu } from 'lucide-react';
import catalogRaw from '../../data/projects.json';
import { LiveDioramaCard } from '../common/LiveDioramaCard';

interface AIProjectsLabZoneProps {
  language: 'en' | 'vi';
}

interface CatalogProject {
  id: string;
  wing: string;
  title: string;
  tagline: string;
  status: string;
  featured: boolean;
  tech: string[];
  highlights: string[];
  githubUrl: string;
  liveUrl: string;
}

const APP_WINGS = [
  { id: 'all', labelEn: 'All AI Apps', labelVi: 'Tất cả App AI', accent: '#2DD4BF' },
  { id: 'creator-lab', labelEn: 'Creator Lab', labelVi: 'Creator Lab', accent: '#2DD4BF' },
  { id: 'growth-ops', labelEn: 'Growth Ops', labelVi: 'Growth Ops', accent: '#34D399' },
  { id: 'language-dojo', labelEn: 'Language Dojo', labelVi: 'Language Dojo', accent: '#818CF8' },
] as const;

const LAB_PROJECTS = (catalogRaw.projects as CatalogProject[]).filter((p) => p.wing !== 'ai-games');

const PAGE_SIZE = 6;

export const AIProjectsLabZone: React.FC<AIProjectsLabZoneProps> = ({ language }) => {
  const [filter, setFilter] = useState<'all' | 'creator-lab' | 'growth-ops' | 'language-dojo'>('all');
  const [page, setPage] = useState(0);
  const shown = filter === 'all' ? LAB_PROJECTS : LAB_PROJECTS.filter((p) => p.wing === filter);
  const totalPages = Math.max(1, Math.ceil(shown.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages - 1);
  const visibleProjects = shown.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-[#1E293B] pb-2.5">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/15 px-2.5 py-1 font-mono text-[10px] font-bold text-[#2DD4BF]">
            <Cpu className="h-3 w-3" />
            {language === 'en' ? 'AI PROJECTS LAB' : 'PHÒNG LAB AI'}
          </div>
          <h2 className="text-lg font-extrabold text-white">
            {language === 'en'
              ? `GitHub AI Apps (${shown.length})`
              : `Kho App AI (${shown.length})`}
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap gap-1">
            {APP_WINGS.map((w) => (
              <button
                key={w.id}
                type="button"
                onClick={() => {
                  setFilter(w.id);
                  setPage(0);
                }}
                className="rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition"
                style={{
                  borderColor: filter === w.id ? w.accent : '#1E293B',
                  backgroundColor: filter === w.id ? `${w.accent}22` : '#090D16',
                  color: filter === w.id ? '#FFFFFF' : '#94A3B8',
                }}
              >
                {language === 'en' ? w.labelEn : w.labelVi}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 rounded-lg border border-[#1E293B] bg-[#090D16] px-1.5 py-0.5">
            <button
              type="button"
              disabled={safePage === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              aria-label="Previous projects page"
              className="rounded p-1 text-[#94A3B8] transition hover:bg-white/5 hover:text-white disabled:opacity-30"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <span className="px-1.5 font-mono text-[11px] font-bold text-[#E2E8F0]">
              {safePage + 1} / {totalPages}
            </span>
            <button
              type="button"
              disabled={safePage >= totalPages - 1}
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              aria-label="Next projects page"
              className="rounded p-1 text-[#94A3B8] transition hover:bg-white/5 hover:text-white disabled:opacity-30"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 content-start gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {visibleProjects.map((proj, idx) => {
          const accent =
            proj.wing === 'creator-lab' ? '#2DD4BF' : proj.wing === 'growth-ops' ? '#34D399' : '#818CF8';
          const globalIndex = safePage * PAGE_SIZE + idx + 1;
          return (
            <LiveDioramaCard
              key={proj.id}
              indexLabel={String(globalIndex).padStart(2, '0')}
              title={proj.title}
              subtitle={proj.tagline}
              sceneId={proj.id}
              accent={accent}
              badge={proj.wing}
              liveUrl={proj.liveUrl}
              githubUrl={proj.githubUrl}
              heightClass="h-28"
              onClick={() => window.open(proj.liveUrl || proj.githubUrl, '_blank', 'noopener,noreferrer')}
            />
          );
        })}
      </div>
    </div>
  );
};
