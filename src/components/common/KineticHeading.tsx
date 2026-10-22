import React, { useState, useEffect } from 'react';

interface KineticHeadingProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'span';
  className?: string;
  staggerMs?: number;
  preset?: 'spring-roll' | 'timeline-scrub' | 'digital-snap';
}

export const KineticHeading: React.FC<KineticHeadingProps> = ({
  text,
  as: Component = 'h2',
  className = '',
  staggerMs = 28,
  preset: _preset = 'spring-roll'
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsRevealed(true), 60);
    return () => clearTimeout(timer);
  }, [text]);

  if (prefersReducedMotion) {
    return <Component className={className}>{text}</Component>;
  }

  const characters = Array.from(text);

  return (
    <Component
      className={`inline-block select-none ${className}`}
      aria-label={text}
      onMouseLeave={() => setHoveredIdx(null)}
    >
      <span className="sr-only">{text}</span>
      <span className="inline-flex flex-wrap items-baseline" aria-hidden="true">
        {characters.map((char, index) => {
          if (char === ' ') {
            return (
              <span key={index} className="inline-block w-[0.28em]">
                &nbsp;
              </span>
            );
          }

          // Compute distance from active hovered character for ripple effect
          const distFromHover = hoveredIdx !== null ? Math.abs(index - hoveredIdx) : 999;
          const isNearHover = distFromHover <= 2;
          const springLift = isNearHover ? -Math.max(0, 7 - distFromHover * 3) : 0;
          const springRotate = isNearHover && hoveredIdx !== null ? (index - hoveredIdx) * 3.5 : 0;

          // Reveal stagger
          const revealDelay = index * staggerMs;

          return (
            <span
              key={index}
              onMouseEnter={() => setHoveredIdx(index)}
              style={{
                transitionDelay: hoveredIdx === null ? `${revealDelay}ms` : '0ms',
                transform: isRevealed
                  ? `translate3d(0, ${springLift}px, 0) rotate(${springRotate}deg)`
                  : 'translate3d(0, 18px, 0) rotate(4deg)',
                opacity: isRevealed ? 1 : 0,
                transition: 'transform 420ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 320ms ease-out',
                willChange: 'transform, opacity'
              }}
              className="inline-block transition-colors duration-200 cursor-default hover:text-[#8B5CF6]"
            >
              {char}
            </span>
          );
        })}
      </span>
    </Component>
  );
};
