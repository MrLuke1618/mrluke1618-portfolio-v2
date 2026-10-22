import React, { useEffect, useRef } from 'react';
import { PerformanceTier } from '../../types/game';
import { lofiAudioEngine } from '../../utils/lofiAudioEngine';

interface LayeredAmbientBackgroundProps {
  tier: PerformanceTier;
  activeZoneColor?: string;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  alpha: number;
  baseAlpha: number;
  pulsePhase: number;
}

export const LayeredAmbientBackground: React.FC<LayeredAmbientBackgroundProps> = ({
  tier,
  activeZoneColor = '#8B5CF6'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (tier === 'lite') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle setup
    const particleCount = tier === 'ultra' ? 60 : 30;
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.8 + 0.8,
        speedX: (Math.random() - 0.5) * 0.25,
        speedY: -Math.random() * 0.35 - 0.05, // gentle upward drift
        alpha: Math.random() * 0.4 + 0.1,
        baseAlpha: Math.random() * 0.4 + 0.1,
        pulsePhase: Math.random() * Math.PI * 2
      });
    }

    let time = 0;

    const render = () => {
      time += 0.015;

      // Check audio reactivity if audio engine active
      let audioBoost = 1.0;
      if (lofiAudioEngine.getIsPlaying()) {
        const freqData = lofiAudioEngine.getFrequencyData();
        if (freqData && freqData.length > 0) {
          // Average bass frequencies
          let bassSum = 0;
          const bassCount = Math.min(8, freqData.length);
          for (let i = 0; i < bassCount; i++) {
            bassSum += freqData[i];
          }
          const bassAvg = bassSum / (bassCount * 255);
          audioBoost = 1.0 + bassAvg * 0.45;
        }
      }

      ctx.clearRect(0, 0, width, height);

      // 1. Multi-layer Parallax Isometric Grid Lines (Faint, non-intrusive)
      ctx.save();
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.22)'; // Slate-800 subtle hairline

      const isoAngle = Math.PI / 6; // 30 deg isometric
      const cosA = Math.cos(isoAngle);
      const sinA = Math.sin(isoAngle);
      const gridSpacing = 90;
      const driftOffset = (time * 8) % gridSpacing;

      // Draw subtle angled isometric grid lines
      ctx.beginPath();
      for (let x = -width; x < width * 2; x += gridSpacing) {
        const xOffset = x + driftOffset;
        ctx.moveTo(xOffset, 0);
        ctx.lineTo(xOffset + height * (cosA / sinA), height);

        ctx.moveTo(xOffset, 0);
        ctx.lineTo(xOffset - height * (cosA / sinA), height);
      }
      ctx.stroke();
      ctx.restore();

      // 2. Subtle Soft Ambient Vignette / Spotlight
      const centerX = width * 0.5;
      const centerY = height * 0.4;
      const spotGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        width * 0.65
      );
      spotGradient.addColorStop(0, `rgba(139, 92, 246, ${0.045 * audioBoost})`);
      spotGradient.addColorStop(0.5, 'rgba(19, 27, 46, 0.08)');
      spotGradient.addColorStop(1, 'rgba(9, 13, 22, 0)');

      ctx.fillStyle = spotGradient;
      ctx.fillRect(0, 0, width, height);

      // 3. Ambient Floating Particles (Drifting & Breathing)
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap around boundaries
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        const currentAlpha = (p.baseAlpha + Math.sin(time + p.pulsePhase) * 0.15) * audioBoost;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (audioBoost > 1.1 ? 1.2 : 1), 0, Math.PI * 2);
        ctx.fillStyle = p.pulsePhase > Math.PI ? activeZoneColor : '#94A3B8';
        ctx.globalAlpha = Math.max(0.05, Math.min(0.65, currentAlpha));
        ctx.fill();
      }
      ctx.globalAlpha = 1.0;

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [tier, activeZoneColor]);

  if (tier === 'lite') {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
};
