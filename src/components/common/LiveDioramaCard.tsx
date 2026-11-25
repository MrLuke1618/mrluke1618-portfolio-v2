import React, { useEffect, useRef, useState } from 'react';
import { ExternalLink, Github } from 'lucide-react';

export interface LiveDioramaCardProps {
  indexLabel: string;
  title: string;
  subtitle: string;
  sceneId: string;
  accent: string;
  badge: string;
  liveUrl?: string;
  githubUrl?: string;
  onClick?: () => void;
  heightClass?: string;
}

interface MiniStickmanOpts {
  jersey: string;
  trim?: string;
  facing?: number;
  phase?: number;
  cheer?: boolean;
  headphones?: boolean;
  glasses?: boolean;
  cap?: boolean;
  scale?: number;
}

function drawMiniStickman(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  opts: MiniStickmanOpts
): void {
  const {
    jersey,
    trim = '#FCD34D',
    facing = 1,
    phase = 0,
    cheer = false,
    headphones = false,
    glasses = false,
    cap = false,
    scale = 1,
  } = opts;

  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  // 2.5D floor shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.52)';
  ctx.beginPath();
  ctx.ellipse(0, 1, 9, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  const stride = Math.sin(phase) * 7;
  const armWave = cheer ? -10 - Math.abs(Math.sin(phase * 1.4)) * 5 : Math.sin(phase) * 5;

  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-2, -11);
  ctx.lineTo(-4 + stride * 0.6, 0);
  ctx.moveTo(2, -11);
  ctx.lineTo(4 - stride * 0.6, 0);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(-4, -22);
  ctx.lineTo(-9, cheer ? -22 + armWave : -13 + armWave * 0.5);
  ctx.moveTo(4, -22);
  ctx.lineTo(9, cheer ? -22 + armWave : -13 - armWave * 0.5);
  ctx.stroke();

  ctx.fillStyle = jersey;
  ctx.beginPath();
  ctx.roundRect(-5, -24, 10, 14, 3);
  ctx.fill();
  ctx.fillStyle = trim;
  ctx.fillRect(-1.2, -24, 2.4, 14);

  ctx.fillStyle = '#FCD34D';
  ctx.beginPath();
  ctx.arc(facing * 0.6, -30, 5.2, 0, Math.PI * 2);
  ctx.fill();

  if (glasses) {
    ctx.strokeStyle = '#0B101B';
    ctx.lineWidth = 1.2;
    ctx.strokeRect(facing > 0 ? 0 : -4, -31.5, 4, 2.5);
  }
  if (headphones) {
    ctx.strokeStyle = '#2DD4BF';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(facing * 0.6, -30, 6.4, Math.PI * 1.05, Math.PI * 1.95);
    ctx.stroke();
  }
  if (cap) {
    ctx.fillStyle = trim;
    ctx.fillRect(-5, -35.5, 11, 2.2);
  }

  ctx.restore();
}

/** True 2.5D perspective backdrop: vanishing-point grid floor + overhead spotlight cone + depth stars. */
function draw25DStage(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  accent: string,
  t: number
): number {
  const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
  skyGrad.addColorStop(0, '#050912');
  skyGrad.addColorStop(0.7, '#0B1324');
  skyGrad.addColorStop(1, '#0F192E');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, w, h);

  const horizonY = h - 30;
  const vpX = w / 2;

  // Volumetric overhead spotlight cone
  const coneGrad = ctx.createRadialGradient(vpX, horizonY * 0.55, 6, vpX, horizonY * 0.55, w * 0.55);
  coneGrad.addColorStop(0, `${accent}1E`);
  coneGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = coneGrad;
  ctx.fillRect(0, 0, w, horizonY);

  // Subtle depth parallax motes
  ctx.fillStyle = `${accent}44`;
  for (let i = 0; i < 10; i++) {
    const mx = ((i * 53 + t * (8 + (i % 3) * 4)) % w);
    const my = ((i * 29 + Math.sin(t + i) * 6) % (horizonY - 8));
    ctx.fillRect(mx, Math.max(4, my), 1.6, 1.6);
  }

  // 2.5D perspective floor plane
  ctx.fillStyle = `${accent}1A`;
  ctx.fillRect(0, horizonY, w, h - horizonY);

  // Converging vanishing-point floor grid lines
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, horizonY, w, h - horizonY);
  ctx.clip();

  ctx.strokeStyle = `${accent}40`;
  ctx.lineWidth = 1;
  for (let gx = -w * 0.6; gx <= w * 1.6; gx += 32) {
    ctx.beginPath();
    ctx.moveTo(vpX + (gx - vpX) * 0.25, horizonY);
    ctx.lineTo(gx, h);
    ctx.stroke();
  }
  for (const frac of [0.22, 0.52, 0.82]) {
    const fy = horizonY + (h - horizonY) * frac;
    ctx.beginPath();
    ctx.moveTo(0, fy);
    ctx.lineTo(w, fy);
    ctx.stroke();
  }
  ctx.restore();

  // Glowing 2.5D horizon rim
  ctx.fillStyle = accent;
  ctx.fillRect(0, horizonY, w, 1.8);

  return h - 12; // foreground character standing plane
}

function drawScene(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  sceneId: string,
  accent: string,
  t: number
): void {
  const floorY = draw25DStage(ctx, w, h, accent, t);
  const cx = w / 2;

  switch (sceneId) {
    // === GAMES ===
    case 'football-fantastic-fcs': {
      const p1x = cx - 68;
      const p2x = cx;
      const p3x = cx + 68;
      ctx.save();
      ctx.strokeStyle = '#34D39988';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(p1x, floorY - 4);
      ctx.lineTo(p2x, floorY - 14);
      ctx.lineTo(p3x, floorY - 4);
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
      drawMiniStickman(ctx, p1x, floorY, { jersey: '#DC2626', phase: t * 5 });
      drawMiniStickman(ctx, p2x, floorY - 5, { jersey: '#DC2626', phase: t * 5 + 2, scale: 0.92 });
      drawMiniStickman(ctx, p3x, floorY, { jersey: '#DC2626', facing: -1, phase: t * 5 + 4 });
      const ballT = (Math.sin(t * 2.5) + 1) / 2;
      const bx = p1x + (p3x - p1x) * ballT;
      const by = floorY - 10 - Math.abs(Math.sin(t * 5)) * 18;
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(bx, by, 4, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'midnight-express-trans-siberian': {
      const trainX = ((t * 38) % (w + 180)) - 140;
      ctx.fillStyle = '#1E293B';
      ctx.strokeStyle = accent;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(trainX, floorY - 44, 112, 32, 4);
      ctx.fill();
      ctx.stroke();
      for (let i = 0; i < 4; i++) {
        ctx.fillStyle = '#FCD34D';
        ctx.fillRect(trainX + 12 + i * 24, floorY - 36, 14, 10);
      }
      ctx.fillStyle = 'rgba(248, 250, 252, 0.5)';
      for (let s = 0; s < 14; s++) {
        ctx.fillRect((s * 41 + t * 18) % w, (s * 23 + t * 24) % (floorY - 8), 2, 2);
      }
      drawMiniStickman(ctx, cx - 58, floorY, { jersey: '#1E3A8A', trim: '#E5A93C', cap: true, cheer: true, phase: t * 3 });
      break;
    }

    case 'Major-Project-WebGL': {
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 8) {
        const y = floorY - 14 + Math.sin(x * 0.05 + t * 3) * 4;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      const boatY = floorY - 16 + Math.sin(t * 3) * 4;
      ctx.strokeStyle = accent;
      ctx.beginPath();
      ctx.moveTo(cx - 22, boatY);
      ctx.lineTo(cx + 22, boatY);
      ctx.lineTo(cx + 12, boatY + 9);
      ctx.lineTo(cx - 12, boatY + 9);
      ctx.closePath();
      ctx.moveTo(cx, boatY);
      ctx.lineTo(cx, boatY - 34);
      ctx.lineTo(cx + 18, boatY - 6);
      ctx.lineTo(cx, boatY - 6);
      ctx.stroke();
      drawMiniStickman(ctx, 40, floorY, { jersey: '#0F766E', trim: '#E5A93C', phase: t * 2 });
      break;
    }

    // === CREATOR LAB ===
    case 'storyboard-ai': {
      const activeIdx = Math.floor(t * 1.2) % 3;
      for (let i = 0; i < 3; i++) {
        const px = cx - 72 + i * 52;
        ctx.fillStyle = '#0B101B';
        ctx.strokeStyle = i === activeIdx ? accent : '#334155';
        ctx.lineWidth = i === activeIdx ? 2 : 1;
        ctx.beginPath();
        ctx.roundRect(px, floorY - 64, 44, 32, 4);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = i === activeIdx ? `${accent}44` : '#1E293B';
        ctx.fillRect(px + 6, floorY - 56, 32, 16);
      }
      drawMiniStickman(ctx, 38, floorY, { jersey: '#0F766E', glasses: true, cheer: true, phase: t * 3 });
      break;
    }

    case 'ai-audio-studio': {
      const startX = cx - 64;
      for (let i = 0; i < 11; i++) {
        const bh = 12 + Math.abs(Math.sin(t * 5 + i * 0.65)) * 42;
        ctx.fillStyle = i % 2 === 0 ? accent : '#E5A93C';
        ctx.fillRect(startX + i * 12, floorY - bh, 8, bh);
      }
      drawMiniStickman(ctx, cx - 74, floorY, { jersey: '#0F766E', headphones: true, cheer: true, phase: t * 4 });
      break;
    }

    case 'creator-suite': {
      ctx.strokeStyle = accent;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx - 42, floorY - 42, 11, 0, Math.PI * 2);
      ctx.moveTo(cx - 42, floorY - 31);
      ctx.lineTo(cx - 42, floorY);
      ctx.stroke();
      ctx.fillStyle = '#0B101B';
      ctx.strokeStyle = accent;
      ctx.beginPath();
      ctx.roundRect(cx + 10, floorY - 64, 80, 42, 6);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = Math.sin(t * 6) > 0 ? '#EF4444' : '#991B1B';
      ctx.beginPath();
      ctx.arc(cx + 22, floorY - 52, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#F8FAFC';
      ctx.font = 'bold 9px monospace';
      ctx.fillText('REC', cx + 30, floorY - 49);
      ctx.fillStyle = accent;
      ctx.fillText('SUITE AI', cx + 20, floorY - 32);
      drawMiniStickman(ctx, cx - 12, floorY, { jersey: '#DC2626', phase: t * 3.5 });
      break;
    }

    case 'mrluke1618-creators-toolbox': {
      // Spinning gear + YouTube play stack
      ctx.save();
      ctx.translate(cx + 38, floorY - 40);
      ctx.rotate(t * 1.4);
      ctx.strokeStyle = accent;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, 14, 0, Math.PI * 2);
      for (let g = 0; g < 6; g++) {
        const a = (g * Math.PI) / 3;
        ctx.moveTo(Math.cos(a) * 14, Math.sin(a) * 14);
        ctx.lineTo(Math.cos(a) * 19, Math.sin(a) * 19);
      }
      ctx.stroke();
      ctx.restore();
      ctx.fillStyle = '#EF4444';
      ctx.beginPath();
      ctx.roundRect(cx - 34, floorY - 52, 34, 24, 5);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.moveTo(cx - 21, floorY - 45);
      ctx.lineTo(cx - 21, floorY - 35);
      ctx.lineTo(cx - 11, floorY - 40);
      ctx.closePath();
      ctx.fill();
      drawMiniStickman(ctx, cx - 58, floorY, { jersey: '#0E7490', cap: true, cheer: true, phase: t * 3 });
      break;
    }

    case 'veo3-watermark-remover': {
      ctx.fillStyle = '#0B101B';
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(cx - 50, floorY - 64, 104, 48);
      const scanX = cx - 46 + ((t * 48) % 96);
      ctx.strokeStyle = accent;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(scanX, floorY - 64);
      ctx.lineTo(scanX, floorY - 16);
      ctx.stroke();
      if (scanX < cx + 22) {
        ctx.fillStyle = 'rgba(239, 68, 68, 0.5)';
        ctx.fillRect(cx + 20, floorY - 28, 26, 10);
      }
      drawMiniStickman(ctx, 36, floorY, { jersey: '#0E7490', phase: t * 3 });
      break;
    }

    // === GROWTH OPS ===
    case 'content-compass': {
      // Rotating 360 compass rose
      ctx.save();
      ctx.translate(cx + 22, floorY - 40);
      ctx.strokeStyle = accent;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(0, 0, 20, 0, Math.PI * 2);
      ctx.stroke();
      ctx.rotate(Math.sin(t * 1.5) * 0.9);
      ctx.fillStyle = '#FCD34D';
      ctx.beginPath();
      ctx.moveTo(0, -16);
      ctx.lineTo(4, 0);
      ctx.lineTo(-4, 0);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
      drawMiniStickman(ctx, cx - 36, floorY, { jersey: '#059669', glasses: true, phase: t * 3 });
      break;
    }

    case 'youtube-launchpad': {
      // Ascending launch rocket with exhaust
      const ry = floorY - 24 - ((t * 28) % 44);
      ctx.fillStyle = accent;
      ctx.beginPath();
      ctx.moveTo(cx + 24, ry - 16);
      ctx.lineTo(cx + 32, ry);
      ctx.lineTo(cx + 16, ry);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.arc(cx + 24, ry + 4, 3 + Math.sin(t * 18) * 1.5, 0, Math.PI * 2);
      ctx.fill();
      drawMiniStickman(ctx, cx - 36, floorY, { jersey: '#059669', cheer: true, phase: t * 4 });
      break;
    }

    case 'shopify-growth-video-idea-generator-v2': {
      // Commerce bag + +4K REACH card
      ctx.fillStyle = '#0B101B';
      ctx.strokeStyle = accent;
      ctx.beginPath();
      ctx.roundRect(cx + 4, floorY - 58, 72, 34, 5);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#FCD34D';
      ctx.font = 'bold 10px monospace';
      ctx.fillText('+4K REACH', cx + 12, floorY - 38);
      drawMiniStickman(ctx, cx - 38, floorY, { jersey: '#10B981', cap: true, cheer: true, phase: t * 3 });
      break;
    }

    case 'ai-proofreader': {
      // Document lines turning emerald under scanning bar
      for (let i = 0; i < 4; i++) {
        const y = floorY - 58 + i * 11;
        const fixed = ((t * 1.8) % 4) > i;
        ctx.fillStyle = fixed ? accent : '#EF4444';
        ctx.fillRect(cx - 12, y, 64 - (i % 2) * 14, 4);
      }
      drawMiniStickman(ctx, cx - 44, floorY, { jersey: '#059669', glasses: true, phase: t * 3 });
      break;
    }

    case 'customer-review-summarizer': {
      // Rising sentiment bars + falling gold stars
      for (let i = 0; i < 4; i++) {
        const bh = 16 + i * 9 + Math.sin(t * 3 + i) * 4;
        ctx.fillStyle = accent;
        ctx.fillRect(cx + i * 16, floorY - bh, 10, bh);
      }
      ctx.fillStyle = '#FCD34D';
      for (let s = 0; s < 3; s++) {
        ctx.beginPath();
        ctx.arc(cx + 8 + s * 20, floorY - 62 + Math.sin(t * 4 + s) * 4, 3.2, 0, Math.PI * 2);
        ctx.fill();
      }
      drawMiniStickman(ctx, cx - 44, floorY, { jersey: '#047857', phase: t * 3 });
      break;
    }

    // === LANGUAGE DOJO ===
    case 'aero-speak-english': {
      drawMiniStickman(ctx, cx - 48, floorY, { jersey: '#4F46E5', headphones: true, phase: t * 3 });
      for (let r = 0; r < 3; r++) {
        const rad = 10 + ((t * 22 + r * 14) % 40);
        ctx.strokeStyle = `rgba(129, 140, 248, ${1 - rad / 50})`;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(cx - 12, floorY - 34, rad, -0.7, 0.7);
        ctx.stroke();
      }
      ctx.fillStyle = '#0B101B';
      ctx.strokeStyle = accent;
      ctx.beginPath();
      ctx.roundRect(cx + 28, floorY - 52, 58, 24, 5);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#FCD34D';
      ctx.font = 'bold 10px monospace';
      ctx.fillText('BAND 8.5', cx + 33, floorY - 37);
      break;
    }

    case 'ielts-practice-app': {
      // Circular ticking timer + rubric bars
      ctx.strokeStyle = accent;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx + 26, floorY - 40, 16, -Math.PI / 2, -Math.PI / 2 + ((t * 1.4) % (Math.PI * 2)));
      ctx.stroke();
      drawMiniStickman(ctx, cx - 38, floorY, { jersey: '#4338CA', glasses: true, phase: t * 3 });
      break;
    }

    case 'english-learning-newbie': {
      // Two friendly stickmen tossing HI! / HELLO! bubbles
      drawMiniStickman(ctx, cx - 44, floorY, { jersey: '#6366F1', cheer: true, phase: t * 3 });
      drawMiniStickman(ctx, cx + 44, floorY, { jersey: '#EC4899', facing: -1, cheer: true, phase: t * 3 + 1.5 });
      const leftTurn = Math.sin(t * 2.5) > 0;
      ctx.fillStyle = '#0B101B';
      ctx.strokeStyle = accent;
      ctx.beginPath();
      ctx.roundRect(leftTurn ? cx - 42 : cx + 6, floorY - 64, 42, 18, 5);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#F8FAFC';
      ctx.font = 'bold 9px monospace';
      ctx.fillText(leftTurn ? 'HELLO!' : 'HI!', leftTurn ? cx - 37 : cx + 19, floorY - 52);
      break;
    }

    case 'Kokoro-English-Guide': {
      // Travel signpost EN / VN + strolling stickman
      ctx.strokeStyle = '#94A3B8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx + 26, floorY);
      ctx.lineTo(cx + 26, floorY - 58);
      ctx.stroke();
      ctx.fillStyle = accent;
      ctx.fillRect(cx + 26, floorY - 54, 34, 11);
      ctx.fillStyle = '#0B101B';
      ctx.font = 'bold 8px monospace';
      ctx.fillText('EN ->', cx + 30, floorY - 46);
      drawMiniStickman(ctx, cx - 36 + Math.sin(t * 2) * 10, floorY, { jersey: '#4F46E5', cap: true, phase: t * 4 });
      break;
    }

    case 'ielts-sniper-simulator': {
      // Animated crosshair target reticle
      const tx = cx + 26 + Math.sin(t * 2.5) * 14;
      const ty = floorY - 40 + Math.cos(t * 2) * 6;
      ctx.strokeStyle = '#EF4444';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(tx, ty, 14, 0, Math.PI * 2);
      ctx.moveTo(tx - 19, ty);
      ctx.lineTo(tx + 19, ty);
      ctx.moveTo(tx, ty - 19);
      ctx.lineTo(tx, ty + 19);
      ctx.stroke();
      drawMiniStickman(ctx, cx - 46, floorY, { jersey: '#4338CA', phase: t * 3 });
      break;
    }

    case 'khangs-learning-universe': {
      // Orbiting mini planets around glowing core
      ctx.fillStyle = '#FCD34D';
      ctx.beginPath();
      ctx.arc(cx + 20, floorY - 38, 7, 0, Math.PI * 2);
      ctx.fill();
      for (let p = 0; p < 2; p++) {
        const ang = t * (2 + p) + p * 3;
        const px = cx + 20 + Math.cos(ang) * (18 + p * 10);
        const py = floorY - 38 + Math.sin(ang) * (8 + p * 4);
        ctx.fillStyle = p === 0 ? accent : '#38BDF8';
        ctx.beginPath();
        ctx.arc(px, py, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
      drawMiniStickman(ctx, cx - 46, floorY, { jersey: '#4F46E5', cheer: true, phase: t * 3 });
      break;
    }

    // === VIDEO VAULT ===
    case 'vault-reel': {
      for (const rx of [cx - 12, cx + 18]) {
        ctx.save();
        ctx.translate(rx, floorY - 44);
        ctx.rotate(t * 2.5);
        ctx.strokeStyle = accent;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, 12, 0, Math.PI * 2);
        ctx.moveTo(-12, 0);
        ctx.lineTo(12, 0);
        ctx.moveTo(0, -12);
        ctx.lineTo(0, 12);
        ctx.stroke();
        ctx.restore();
      }
      drawMiniStickman(ctx, cx - 54, floorY, { jersey: '#7C3AED', headphones: true, phase: t * 3 });
      break;
    }

    case 'vault-playlist': {
      for (let i = 0; i < 3; i++) {
        const offset = ((t * 22 + i * 44) % 132) - 44;
        ctx.fillStyle = '#0B101B';
        ctx.strokeStyle = accent;
        ctx.beginPath();
        ctx.roundRect(cx - 18 + offset * 0.5, floorY - 56 + i * 5, 42, 26, 4);
        ctx.fill();
        ctx.stroke();
      }
      drawMiniStickman(ctx, cx - 56, floorY, { jersey: '#6D28D9', cheer: true, phase: t * 3 });
      break;
    }

    case 'vault-drive': {
      ctx.fillStyle = `${accent}33`;
      ctx.strokeStyle = accent;
      ctx.beginPath();
      ctx.roundRect(cx - 22, floorY - 48, 44, 30, 5);
      ctx.fill();
      ctx.stroke();
      for (let f = 0; f < 3; f++) {
        const fy = floorY - 36 - ((t * 24 + f * 14) % 28);
        ctx.fillStyle = '#FCD34D';
        ctx.fillRect(cx - 12 + f * 12, fy, 6, 8);
      }
      drawMiniStickman(ctx, cx - 56, floorY, { jersey: '#7C3AED', phase: t * 3 });
      break;
    }

    case 'vault-script': {
      ctx.fillStyle = '#0B101B';
      ctx.strokeStyle = accent;
      ctx.fillRect(cx - 10, floorY - 62, 56, 46);
      ctx.strokeRect(cx - 10, floorY - 62, 56, 46);
      const lines = Math.floor((t * 3) % 4) + 1;
      ctx.fillStyle = '#E2E8F0';
      for (let l = 0; l < lines; l++) {
        ctx.fillRect(cx - 2, floorY - 52 + l * 9, 36 - (l % 2) * 10, 3);
      }
      drawMiniStickman(ctx, cx - 44, floorY, { jersey: '#5B21B6', glasses: true, phase: t * 3 });
      break;
    }

    // === CERTIFICATES ===
    case 'cert-dcu': {
      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.arc(cx, floorY - 38, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(cx - 7, floorY - 24, 14, 12);
      for (let sp = 0; sp < 6; sp++) {
        ctx.fillStyle = sp % 2 === 0 ? '#FCD34D' : accent;
        ctx.fillRect(cx - 48 + sp * 18, floorY - 22 - ((t * 22 + sp * 15) % 42), 3, 3);
      }
      drawMiniStickman(ctx, cx - 52, floorY, { jersey: '#059669', cap: true, cheer: true, phase: t * 4 });
      drawMiniStickman(ctx, cx + 52, floorY, { jersey: '#DC2626', facing: -1, cheer: true, phase: t * 4 + 2 });
      break;
    }

    case 'cert-ielts': {
      drawMiniStickman(ctx, cx - 46, floorY, { jersey: '#059669', headphones: true, phase: t * 3 });
      ctx.fillStyle = '#0B101B';
      ctx.strokeStyle = accent;
      ctx.beginPath();
      ctx.roundRect(cx + 10, floorY - 52, 66, 26, 5);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#FCD34D';
      ctx.font = 'bold 10px monospace';
      ctx.fillText('IELTS 7.5', cx + 16, floorY - 36);
      break;
    }

    case 'cert-toeic': {
      ctx.fillStyle = '#FCD34D';
      ctx.beginPath();
      ctx.arc(cx + 26, floorY - 40, 14 + Math.sin(t * 4) * 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0B101B';
      ctx.font = 'bold 8px monospace';
      ctx.fillText('960', cx + 18, floorY - 37);
      drawMiniStickman(ctx, cx - 40, floorY, { jersey: '#047857', cheer: true, phase: t * 4 });
      break;
    }

    case 'cert-doc': {
      ctx.fillStyle = '#0B101B';
      ctx.strokeStyle = accent;
      ctx.fillRect(cx, floorY - 60, 48, 44);
      ctx.strokeRect(cx, floorY - 60, 48, 44);
      ctx.strokeStyle = '#34D399';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(cx + 14, floorY - 38);
      ctx.lineTo(cx + 22, floorY - 30);
      ctx.lineTo(cx + 36, floorY - 48);
      ctx.stroke();
      drawMiniStickman(ctx, cx - 40, floorY, { jersey: '#059669', glasses: true, phase: t * 3 });
      break;
    }

    case 'cert-reel': {
      const startX = cx - 50;
      for (let i = 0; i < 8; i++) {
        const bh = 14 + Math.abs(Math.sin(t * 4.5 + i * 0.8)) * 38;
        ctx.fillStyle = i % 2 === 0 ? accent : '#FCD34D';
        ctx.fillRect(startX + i * 14, floorY - bh, 9, bh);
      }
      drawMiniStickman(ctx, cx - 70, floorY, { jersey: '#059669', cheer: true, phase: t * 4 });
      break;
    }

    case 'cert-chuyen': {
      // 3-node glowing AI network triangle
      const nodes = [
        [cx + 22, floorY - 54],
        [cx + 2, floorY - 24],
        [cx + 42, floorY - 24],
      ];
      ctx.strokeStyle = accent;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(nodes[0][0], nodes[0][1]);
      ctx.lineTo(nodes[1][0], nodes[1][1]);
      ctx.lineTo(nodes[2][0], nodes[2][1]);
      ctx.closePath();
      ctx.stroke();
      nodes.forEach(([nx, ny], idx) => {
        ctx.fillStyle = Math.floor(t * 3) % 3 === idx ? '#FCD34D' : accent;
        ctx.beginPath();
        ctx.arc(nx, ny, 5, 0, Math.PI * 2);
        ctx.fill();
      });
      drawMiniStickman(ctx, cx - 44, floorY, { jersey: '#0D9488', phase: t * 3 });
      break;
    }

    // === SHIPYARD ===
    case 'ship-hyperframes': {
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx - 56, floorY - 36);
      ctx.lineTo(cx + 56, floorY - 36);
      ctx.stroke();
      const scrubX = cx - 52 + ((t * 45) % 104);
      ctx.fillStyle = accent;
      ctx.fillRect(scrubX - 2, floorY - 50, 4, 28);
      drawMiniStickman(ctx, cx - 72, floorY, { jersey: '#0284C7', phase: t * 3 });
      break;
    }

    case 'ship-concat': {
      const gap = Math.abs(Math.sin(t * 2)) * 22;
      ctx.fillStyle = accent;
      ctx.fillRect(cx - 38 - gap, floorY - 46, 32, 20);
      ctx.fillStyle = '#FCD34D';
      ctx.fillRect(cx + 6 + gap, floorY - 46, 32, 20);
      drawMiniStickman(ctx, cx - 64, floorY, { jersey: '#0369A1', cheer: gap < 4, phase: t * 3 });
      break;
    }

    case 'ship-portfolio': {
      ctx.save();
      ctx.translate(cx + 22, floorY - 38);
      ctx.rotate(t * 0.9);
      ctx.strokeStyle = accent;
      ctx.lineWidth = 1.8;
      ctx.strokeRect(-14, -14, 28, 28);
      ctx.strokeRect(-8, -8, 16, 16);
      ctx.restore();
      drawMiniStickman(ctx, cx - 44, floorY, { jersey: '#0284C7', glasses: true, phase: t * 3 });
      break;
    }

    // === COMMS & LO-FI ===
    case 'comms-doc': {
      ctx.fillStyle = '#0B101B';
      ctx.strokeStyle = accent;
      ctx.beginPath();
      ctx.roundRect(cx + 4, floorY - 52, 44, 32, 5);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#FCD34D';
      ctx.fillRect(cx + 18, floorY - 58, 16, 6);
      drawMiniStickman(ctx, cx - 42, floorY, { jersey: '#4F46E5', glasses: true, phase: t * 3 });
      break;
    }

    case 'comms-drive': {
      // Clapperboard snapping
      ctx.fillStyle = '#1E293B';
      ctx.strokeStyle = accent;
      ctx.fillRect(cx + 4, floorY - 46, 38, 26);
      ctx.strokeRect(cx + 4, floorY - 46, 38, 26);
      ctx.save();
      ctx.translate(cx + 4, floorY - 46);
      ctx.rotate(-0.15 - Math.abs(Math.sin(t * 3)) * 0.35);
      ctx.fillStyle = accent;
      ctx.fillRect(0, -8, 38, 8);
      ctx.restore();
      drawMiniStickman(ctx, cx - 42, floorY, { jersey: '#6366F1', cap: true, phase: t * 3 });
      break;
    }

    case 'comms-linkedin': {
      drawMiniStickman(ctx, cx - 26, floorY, { jersey: '#2563EB', cheer: true, phase: t * 3 });
      drawMiniStickman(ctx, cx + 26, floorY, { jersey: '#4F46E5', facing: -1, cheer: true, phase: t * 3 + 1.5 });
      ctx.strokeStyle = '#38BDF8';
      ctx.beginPath();
      ctx.moveTo(cx - 26, floorY - 38);
      ctx.lineTo(cx + 26, floorY - 38);
      ctx.stroke();
      break;
    }

    case 'comms-youtube': {
      ctx.fillStyle = '#EF4444';
      ctx.beginPath();
      ctx.roundRect(cx + 2, floorY - 54, 48, 32, 7);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.moveTo(cx + 20, floorY - 46);
      ctx.lineTo(cx + 20, floorY - 30);
      ctx.lineTo(cx + 35, floorY - 38);
      ctx.closePath();
      ctx.fill();
      drawMiniStickman(ctx, cx - 44, floorY, { jersey: '#4F46E5', headphones: true, cheer: true, phase: t * 4 });
      break;
    }

    case 'comms-tiktok': {
      // Vertical 9:16 phone + floating music notes
      ctx.fillStyle = '#0B101B';
      ctx.strokeStyle = accent;
      ctx.beginPath();
      ctx.roundRect(cx + 12, floorY - 62, 28, 48, 5);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#EC4899';
      ctx.beginPath();
      ctx.arc(cx + 26, floorY - 34 - ((t * 20) % 20), 3.5, 0, Math.PI * 2);
      ctx.fill();
      drawMiniStickman(ctx, cx - 40, floorY, { jersey: '#7C3AED', cheer: true, phase: t * 3.5 });
      break;
    }

    case 'comms-email':
    default: {
      // Soaring paper airplane across sky
      const px = cx - 20 + ((t * 48) % 90);
      const py = floorY - 38 - Math.sin(t * 3) * 10;
      ctx.fillStyle = '#FCD34D';
      ctx.beginPath();
      ctx.moveTo(px + 14, py);
      ctx.lineTo(px - 8, py - 7);
      ctx.lineTo(px - 4, py + 6);
      ctx.closePath();
      ctx.fill();
      drawMiniStickman(ctx, cx - 50, floorY, { jersey: '#4F46E5', cheer: true, phase: t * 3 });
      break;
    }
  }
}

export const LiveDioramaCard: React.FC<LiveDioramaCardProps> = ({
  indexLabel,
  title,
  subtitle,
  sceneId,
  accent,
  badge,
  liveUrl,
  githubUrl,
  onClick,
  heightClass = 'h-36',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const hoveredRef = useRef(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const obs = new IntersectionObserver(
      (entries) => setIsVisible(entries[0]?.isIntersecting ?? true),
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;
    const render = (now: number) => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const targetW = Math.max(120, Math.floor(rect.width * dpr));
      const targetH = Math.max(80, Math.floor(rect.height * dpr));
      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const speed = hoveredRef.current ? 1.55 : 1;
      drawScene(ctx, rect.width, rect.height, sceneId, accent, (now / 1000) * speed);
      rafId = requestAnimationFrame(render);
    };
    rafId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafId);
  }, [accent, isVisible, sceneId]);

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => {
        hoveredRef.current = true;
      }}
      onMouseLeave={() => {
        hoveredRef.current = false;
      }}
      onClick={onClick}
      className={`group flex flex-col overflow-hidden rounded-xl border border-[#1E293B] bg-[#0B1120] transition-all hover:border-white/35 ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      {/* 2.5D Perspective Hardware-Rendered Code Stage */}
      <div className={`relative w-full ${heightClass} overflow-hidden`}>
        <canvas ref={canvasRef} className="block h-full w-full" />
        <div
          className="absolute left-2.5 top-2 rounded px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider"
          style={{ backgroundColor: 'rgba(7, 13, 25, 0.85)', color: accent, border: `1px solid ${accent}44` }}
        >
          {badge}
        </div>
        {(liveUrl || githubUrl) && (
          <div className="absolute right-2 top-2 flex items-center gap-1.5 opacity-95">
            {liveUrl && (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 rounded px-2 py-0.5 font-mono text-[10px] font-bold text-[#090D16] transition hover:brightness-110"
                style={{ backgroundColor: accent }}
              >
                <ExternalLink className="h-2.5 w-2.5" /> LIVE
              </a>
            )}
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 rounded border border-white/20 bg-[#070D19]/90 px-2 py-0.5 font-mono text-[10px] font-semibold text-white hover:border-white/50"
              >
                <Github className="h-2.5 w-2.5" /> CODE
              </a>
            )}
          </div>
        )}
      </div>

      {/* Clean Non-Truncated Footer */}
      <div className="flex items-start justify-between gap-2 border-t border-[#1E293B] bg-[#0B1120] px-3 py-2.5">
        <div className="min-w-0">
          <div className="font-mono text-xs font-bold leading-snug text-[#F8FAFC]">
            {indexLabel}. {title.toUpperCase()}
          </div>
          <div className="mt-0.5 text-[11px] leading-snug text-[#94A3B8]">{subtitle}</div>
        </div>
        <span
          className="mt-0.5 shrink-0 rounded border px-1.5 py-0.5 font-mono text-[10px] font-semibold"
          style={{ borderColor: `${accent}44`, color: accent }}
        >
          {liveUrl ? 'TRY ▸' : onClick ? 'VIEW ▸' : 'REPO ▸'}
        </span>
      </div>
    </div>
  );
};
