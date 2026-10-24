import React, { useEffect, useRef, useState } from 'react';
import { ArcadeGameId } from './arcadeGamesData';

interface KineticVideoThumbnailProps {
  gameId: ArcadeGameId;
  title: string;
  badge: string;
  isHovered?: boolean;
}

export const KineticVideoThumbnail: React.FC<KineticVideoThumbnailProps> = ({
  gameId,
  title,
  badge,
  isHovered = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const [timecode, setTimecode] = useState('00:00:04:12');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let tick = 0;

    // Simulation states
    const snakeBody = [
      { x: 50, y: 50 },
      { x: 42, y: 50 },
      { x: 34, y: 50 },
      { x: 26, y: 50 }
    ];
    let pongBall = { x: 80, y: 45, vx: 1.8, vy: 1.2 };
    let pongP1Y = 40;
    let pongP2Y = 40;

    let jumperY = 70;
    let jumperVy = -3.5;

    let racerCarX = 80;
    let racerObstacles = [
      { x: 40, y: -20 },
      { x: 120, y: -70 }
    ];

    let dialAngle = 0;

    let breakerBall = { x: 80, y: 65, vx: 1.4, vy: -1.4 };
    let breakerPaddleX = 80;

    const render = () => {
      tick++;
      const w = canvas.width;
      const h = canvas.height;

      // Base background
      ctx.fillStyle = '#090D16';
      ctx.fillRect(0, 0, w, h);

      // Subtle isometric grid lines
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.4)';
      ctx.lineWidth = 0.5;
      for (let x = 0; x < w; x += 16) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 16) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Game-specific animated loop preview
      switch (gameId) {
        case 'neural-snake': {
          // Snake head & body movement
          const headX = 80 + Math.cos(tick * 0.05) * 36;
          const headY = 48 + Math.sin(tick * 0.06) * 22;
          snakeBody.unshift({ x: headX, y: headY });
          if (snakeBody.length > 14) snakeBody.pop();

          // Render food
          const foodPulse = Math.sin(tick * 0.1) * 2 + 5;
          ctx.beginPath();
          ctx.arc(120, 35, foodPulse, 0, Math.PI * 2);
          ctx.fillStyle = '#8B5CF6';
          ctx.shadowColor = '#8B5CF6';
          ctx.shadowBlur = 8;
          ctx.fill();

          // Render snake segments
          snakeBody.forEach((seg, i) => {
            ctx.beginPath();
            ctx.arc(seg.x, seg.y, i === 0 ? 5 : 4 - i * 0.15, 0, Math.PI * 2);
            ctx.fillStyle = i === 0 ? '#F8FAFC' : 'rgba(139, 92, 246, 0.85)';
            ctx.shadowColor = '#8B5CF6';
            ctx.shadowBlur = i === 0 ? 10 : 4;
            ctx.fill();
          });
          break;
        }

        case 'memory-core': {
          // 4x4 matrix card grid
          const rows = 3;
          const cols = 5;
          const cardW = 18;
          const cardH = 22;
          const startX = 36;
          const startY = 14;

          for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
              const x = startX + c * (cardW + 6);
              const y = startY + r * (cardH + 6);
              const isMatch = (r + c + Math.floor(tick / 40)) % 4 === 0;

              ctx.fillStyle = isMatch ? 'rgba(139, 92, 246, 0.35)' : 'rgba(19, 27, 46, 0.9)';
              ctx.strokeStyle = isMatch ? '#8B5CF6' : 'rgba(148, 163, 184, 0.3)';
              ctx.lineWidth = 1;
              ctx.strokeRect(x, y, cardW, cardH);
              ctx.fillRect(x, y, cardW, cardH);

              if (isMatch) {
                ctx.fillStyle = '#F8FAFC';
                ctx.font = '8px monospace';
                ctx.textAlign = 'center';
                ctx.fillText('<>', x + cardW / 2, y + cardH / 2 + 3);
              }
            }
          }
          break;
        }

        case 'cyber-pong': {
          pongBall.x += pongBall.vx;
          pongBall.y += pongBall.vy;
          if (pongBall.y < 8 || pongBall.y > h - 8) pongBall.vy *= -1;
          if (pongBall.x < 24) {
            pongBall.vx *= -1;
            pongP1Y = pongBall.y - 12;
          }
          if (pongBall.x > w - 24) {
            pongBall.vx *= -1;
            pongP2Y = pongBall.y - 12;
          }

          // Left paddle
          ctx.fillStyle = '#8B5CF6';
          ctx.fillRect(16, Math.max(4, Math.min(h - 28, pongP1Y)), 4, 24);
          // Right paddle
          ctx.fillStyle = '#94A3B8';
          ctx.fillRect(w - 20, Math.max(4, Math.min(h - 28, pongP2Y)), 4, 24);
          // Center dashed net
          ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.moveTo(w / 2, 0);
          ctx.lineTo(w / 2, h);
          ctx.stroke();
          ctx.setLineDash([]);

          // Ball with glow
          ctx.beginPath();
          ctx.arc(pongBall.x, pongBall.y, 4, 0, Math.PI * 2);
          ctx.fillStyle = '#F8FAFC';
          ctx.shadowColor = '#8B5CF6';
          ctx.shadowBlur = 10;
          ctx.fill();
          break;
        }

        case 'neon-tetris': {
          // Falling tetromino animation
          const blockY = (tick * 1.2) % (h - 20);
          ctx.fillStyle = 'rgba(139, 92, 246, 0.8)';
          ctx.strokeStyle = '#F8FAFC';
          ctx.lineWidth = 1;

          // T-piece falling
          const tx = w / 2 - 10;
          [
            [0, 0],
            [10, 0],
            [20, 0],
            [10, 10]
          ].forEach(([dx, dy]) => {
            ctx.fillRect(tx + dx, blockY + dy, 9, 9);
            ctx.strokeRect(tx + dx, blockY + dy, 9, 9);
          });

          // Stacked bottom floor
          for (let col = 2; col < 14; col++) {
            if ((col + Math.floor(tick / 50)) % 3 !== 0) {
              ctx.fillStyle = 'rgba(19, 27, 46, 0.9)';
              ctx.strokeStyle = 'rgba(139, 92, 246, 0.5)';
              ctx.fillRect(col * 10, h - 14, 9, 9);
              ctx.strokeRect(col * 10, h - 14, 9, 9);
            }
          }
          break;
        }

        case 'pixel-jump': {
          jumperVy += 0.15;
          jumperY += jumperVy;
          if (jumperY > 68) {
            jumperY = 68;
            jumperVy = -4.2;
          }

          // Platforms
          const platforms = [
            { x: 30, y: 75, w: 32 },
            { x: 75, y: 55, w: 36 },
            { x: 120, y: 35, w: 30 }
          ];
          platforms.forEach((p) => {
            ctx.fillStyle = '#8B5CF6';
            ctx.fillRect(p.x, p.y, p.w, 4);
          });

          // Jumper bot
          ctx.fillStyle = '#F8FAFC';
          ctx.fillRect(86, jumperY, 8, 8);
          // Thruster trail
          if (jumperVy < 0) {
            ctx.fillStyle = 'rgba(139, 92, 246, 0.8)';
            ctx.fillRect(88, jumperY + 9, 4, 6);
          }
          break;
        }

        case 'cipher-break': {
          // Scrolling hex values
          ctx.font = '8px monospace';
          ctx.textAlign = 'left';
          const chars = '0123456789ABCDEF';
          for (let line = 0; line < 6; line++) {
            const isMatch = line === 2;
            ctx.fillStyle = isMatch ? '#8B5CF6' : 'rgba(148, 163, 184, 0.45)';
            let code = `0x${line}F: `;
            for (let c = 0; c < 8; c++) {
              code += chars[(line * 4 + c + tick) % chars.length];
            }
            ctx.fillText(code, 20, 20 + line * 12);
          }
          break;
        }

        case 'grid-racer': {
          // 3-lane racer
          const laneWidth = 36;
          const leftBound = 30;
          ctx.strokeStyle = 'rgba(139, 92, 246, 0.3)';
          ctx.lineWidth = 1;
          for (let l = 0; l <= 3; l++) {
            ctx.beginPath();
            ctx.moveTo(leftBound + l * laneWidth, 0);
            ctx.lineTo(leftBound + l * laneWidth, h);
            ctx.stroke();
          }

          // Moving road dashes
          const dashOffset = (tick * 4) % 20;
          ctx.strokeStyle = 'rgba(248, 250, 252, 0.4)';
          ctx.setLineDash([8, 12]);
          ctx.lineDashOffset = -dashOffset;
          ctx.beginPath();
          ctx.moveTo(leftBound + laneWidth, 0);
          ctx.lineTo(leftBound + laneWidth, h);
          ctx.moveTo(leftBound + laneWidth * 2, 0);
          ctx.lineTo(leftBound + laneWidth * 2, h);
          ctx.stroke();
          ctx.setLineDash([]);

          // Player car
          racerCarX = leftBound + laneWidth + 10 + Math.sin(tick * 0.04) * 20;
          ctx.fillStyle = '#8B5CF6';
          ctx.fillRect(racerCarX, h - 24, 12, 18);
          ctx.fillStyle = '#F8FAFC';
          ctx.fillRect(racerCarX + 2, h - 22, 8, 4);

          // Obstacles
          racerObstacles.forEach((obs) => {
            obs.y = (obs.y + 1.2) % (h + 30);
            ctx.fillStyle = 'rgba(239, 68, 68, 0.8)';
            ctx.fillRect(obs.x, obs.y, 10, 12);
          });
          break;
        }

        case 'reactor-core': {
          // Radial needle & target sector
          const cx = w / 2;
          const cy = h / 2;
          const radius = 28;

          // Outer ring
          ctx.beginPath();
          ctx.arc(cx, cy, radius, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
          ctx.lineWidth = 4;
          ctx.stroke();

          // Green/violet stabilization sector
          ctx.beginPath();
          ctx.arc(cx, cy, radius, -0.4, 0.4);
          ctx.strokeStyle = '#8B5CF6';
          ctx.lineWidth = 4;
          ctx.stroke();

          // Rotating needle
          dialAngle = (tick * 0.06) % (Math.PI * 2);
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx + Math.cos(dialAngle) * radius, cy + Math.sin(dialAngle) * radius);
          ctx.strokeStyle = '#F8FAFC';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Center core
          ctx.beginPath();
          ctx.arc(cx, cy, 6, 0, Math.PI * 2);
          ctx.fillStyle = '#8B5CF6';
          ctx.shadowColor = '#8B5CF6';
          ctx.shadowBlur = 12;
          ctx.fill();
          break;
        }

        case 'void-breaker': {
          // Bricks grid
          const bW = 16;
          const bH = 6;
          for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 7; col++) {
              if ((row * 7 + col + Math.floor(tick / 60)) % 5 !== 0) {
                ctx.fillStyle = row === 0 ? '#8B5CF6' : 'rgba(139, 92, 246, 0.4)';
                ctx.fillRect(26 + col * (bW + 3), 16 + row * (bH + 3), bW, bH);
              }
            }
          }

          // Ball physics
          breakerBall.x += breakerBall.vx;
          breakerBall.y += breakerBall.vy;
          if (breakerBall.x < 15 || breakerBall.x > w - 15) breakerBall.vx *= -1;
          if (breakerBall.y < 10) breakerBall.vy *= -1;
          if (breakerBall.y > h - 20) {
            breakerBall.vy *= -1;
          }

          // Paddle
          breakerPaddleX = Math.sin(tick * 0.04) * 30 + w / 2;
          ctx.fillStyle = '#F8FAFC';
          ctx.fillRect(breakerPaddleX - 16, h - 16, 32, 4);

          // Ball
          ctx.beginPath();
          ctx.arc(breakerBall.x, breakerBall.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = '#8B5CF6';
          ctx.shadowColor = '#8B5CF6';
          ctx.shadowBlur = 8;
          ctx.fill();
          break;
        }

        case 'tic-tac-quantum': {
          const cx = w / 2;
          const cy = h / 2;
          const size = 18;

          // 3x3 grid lines
          ctx.strokeStyle = 'rgba(139, 92, 246, 0.4)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          // Vertical
          ctx.moveTo(cx - size / 2, cy - size * 1.5);
          ctx.lineTo(cx - size / 2, cy + size * 1.5);
          ctx.moveTo(cx + size / 2, cy - size * 1.5);
          ctx.lineTo(cx + size / 2, cy + size * 1.5);
          // Horizontal
          ctx.moveTo(cx - size * 1.5, cy - size / 2);
          ctx.lineTo(cx + size * 1.5, cy - size / 2);
          ctx.moveTo(cx - size * 1.5, cy + size / 2);
          ctx.lineTo(cx + size * 1.5, cy + size / 2);
          ctx.stroke();

          // Render glowing X and O
          ctx.font = 'bold 12px monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = '#8B5CF6';
          ctx.fillText('X', cx - size, cy - size);
          ctx.fillText('X', cx, cy);
          ctx.fillStyle = '#F8FAFC';
          ctx.fillText('O', cx + size, cy - size);
          ctx.fillText('O', cx - size, cy + size);
          break;
        }
      }

      // Luma Glitch Bar (periodic scanline disturbance every few seconds)
      const glitchActive = tick % 90 < 8;
      if (glitchActive) {
        const sliceY = (tick * 13) % (h - 15);
        ctx.fillStyle = 'rgba(139, 92, 246, 0.25)';
        ctx.fillRect(0, sliceY, w, 6);
        ctx.fillStyle = 'rgba(248, 250, 252, 0.15)';
        ctx.fillRect(8, sliceY + 2, w - 16, 2);
      }

      // Audio waveform bar at bottom
      ctx.fillStyle = 'rgba(139, 92, 246, 0.6)';
      const bars = 18;
      const barW = 3;
      for (let b = 0; b < bars; b++) {
        const barH = (Math.sin(tick * 0.12 + b * 0.4) * 0.5 + 0.5) * 8 + 2;
        ctx.fillRect(w - 60 + b * (barW + 1), h - 6 - barH, barW, barH);
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    // Timecode ticker
    const timer = setInterval(() => {
      const s = Math.floor((Date.now() / 1000) % 15);
      const f = Math.floor((Date.now() / 16) % 60);
      setTimecode(`00:00:0${s}:${f < 10 ? '0' : ''}${f}`);
    }, 100);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      clearInterval(timer);
    };
  }, [gameId]);

  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-[#090D16] border border-[#1E293B] group-hover:border-[#8B5CF6] transition-all">
      {/* 2D Preview Canvas */}
      <canvas
        ref={canvasRef}
        width={180}
        height={101}
        className="w-full h-full object-cover block"
      />

      {/* Video Showreel HUD Overlay */}
      <div className="absolute inset-0 pointer-events-none p-2 sm:p-2.5 flex flex-col justify-between">
        {/* Top Header: REC + Timecode */}
        <div className="flex items-center justify-between text-[9px] font-mono">
          <div className="flex items-center gap-1.5 px-1.5 py-0.5 rounded bg-[#090D16]/80 border border-[#1E293B]">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[#F8FAFC] tracking-tight">REC 60FPS</span>
          </div>
          <div className="text-[#94A3B8] font-mono tracking-wider bg-[#090D16]/70 px-1.5 py-0.5 rounded border border-[#1E293B]">
            {timecode}
          </div>
        </div>

        {/* Center / Bottom: Badge & Kinetic Title */}
        <div className="flex items-end justify-between">
          <div className="flex items-center gap-1.5">
            <span className="bg-[#090D16]/85 border border-[#1E293B] px-2 py-0.5 rounded text-[9px] font-mono text-[#8B5CF6]">
              {badge}
            </span>
            <span className="hidden sm:inline bg-[#090D16]/80 border border-[#1E293B] px-1.5 py-0.5 rounded text-[9px] font-mono text-[#F8FAFC]">
              {title}
            </span>
          </div>
          <div className="text-[9px] font-mono text-[#94A3B8] bg-[#090D16]/85 px-1.5 py-0.5 rounded border border-[#1E293B]">
            LUMA_PASS_V2
          </div>
        </div>
      </div>

      {/* Scanline texture */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.3)_50%)] bg-[length:100%_4px] opacity-40" />

      {/* Hover action overlay */}
      <div
        className={`absolute inset-0 bg-[#090D16]/80 backdrop-blur-[2px] flex items-center justify-center transition-opacity duration-200 ${
          isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <span className="px-3 py-1.5 rounded-lg bg-[#8B5CF6] text-white text-xs font-mono font-bold shadow-lg shadow-[#8B5CF6]/40 transform scale-100 animate-pulse">
          PLAY ARCADE
        </span>
      </div>
    </div>
  );
};
