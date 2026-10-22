import { Language } from '../types';

export interface ReadingTimeResult {
  text: string;
  minutes: number;
  words: number;
}

export const calculateReadingTime = (content: string, language: Language = 'en'): ReadingTimeResult => {
  if (!content) {
    return {
      text: language === 'en' ? '1 min read' : '1 phút đọc',
      minutes: 1,
      words: 0
    };
  }

  // Count words (handles both English space-separated and Vietnamese words)
  const cleanContent = content.replace(/<[^>]*>/g, ' ').trim();
  const words = cleanContent ? cleanContent.split(/\s+/).filter(Boolean).length : 0;
  
  // Standard reading metric: ~200 words per minute
  const minutes = Math.max(1, Math.ceil(words / 200));

  const text = language === 'en'
    ? `${minutes} min read`
    : `${minutes} phút đọc`;

  return { text, minutes, words };
};
