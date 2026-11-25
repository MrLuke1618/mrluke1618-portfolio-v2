import { type GameZoneId } from '../types/game';

export interface StickmanDrawOpts {
  x: number;
  y: number;
  facing: number; // +1 right, -1 left
  walkPhase: number;
  speedRatio: number; // 0 = idle, 0..1 = walk/sprint
  accent: string;
  scale?: number;
  isNpc?: boolean;
  zoneId?: GameZoneId;
  label?: string;
  time: number;
}

export function drawStickman(ctx: CanvasRenderingContext2D, opts: StickmanDrawOpts): void {
  const {
    x,
    y,
    facing,
    walkPhase,
    speedRatio,
    accent,
    scale = 1,
    isNpc,
    zoneId,
    label,
    time,
  } = opts;
  const moving = speedRatio > 0.05;
  const bob = moving ? Math.abs(Math.sin(walkPhase * 2)) * 3.2 : Math.sin(time * 2.5) * 1.1;
  const lean = moving ? facing * 0.14 * speedRatio : 0;

  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  // Ground contact shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.beginPath();
  ctx.ellipse(0, 2, 13, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Subtle floor aura under character
  ctx.strokeStyle = accent;
  ctx.globalAlpha = isNpc ? 0.35 : 0.55;
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.ellipse(0, 2, 15, 5.5, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.globalAlpha = 1;

  const hipY = -17 - bob;
  const shoulderY = -34 - bob;
  const headY = -44 - bob;
  const torsoX = lean * 13;

  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = isNpc ? '#E2E8F0' : '#F8FAFC';
  ctx.lineWidth = 3;

  const stride = moving ? Math.sin(walkPhase) * 10 * speedRatio : 0;
  const liftA = moving ? Math.max(0, Math.cos(walkPhase)) * 5.5 * speedRatio : 0;
  const liftB = moving ? Math.max(0, -Math.cos(walkPhase)) * 5.5 * speedRatio : 0;

  // Left leg
  ctx.beginPath();
  ctx.moveTo(0, hipY);
  ctx.lineTo(-4 + stride * 0.5, hipY * 0.5 - liftA * 0.5);
  ctx.lineTo(-5 + stride, -liftA);
  ctx.stroke();

  // Right leg
  ctx.beginPath();
  ctx.moveTo(0, hipY);
  ctx.lineTo(4 - stride * 0.5, hipY * 0.5 - liftB * 0.5);
  ctx.lineTo(5 - stride, -liftB);
  ctx.stroke();

  // Torso
  ctx.beginPath();
  ctx.moveTo(0, hipY);
  ctx.lineTo(torsoX, shoulderY);
  ctx.stroke();

  const armSwing = moving ? Math.sin(walkPhase) * 8.5 * speedRatio : Math.sin(time * 2 + 1) * 1.8;
  const waveY = isNpc ? Math.sin(time * 3.5) * 3.5 : 0;

  // Back arm
  ctx.beginPath();
  ctx.moveTo(torsoX, shoulderY + 2);
  ctx.lineTo(torsoX - facing * 6.5 - armSwing * 0.6, shoulderY + 11);
  ctx.lineTo(torsoX - facing * 8.5 - armSwing, shoulderY + 18);
  ctx.stroke();

  // Front arm
  ctx.beginPath();
  ctx.moveTo(torsoX, shoulderY + 2);
  ctx.lineTo(torsoX + facing * 7.5 + armSwing * 0.6, shoulderY + 10 - waveY * 0.4);
  ctx.lineTo(torsoX + facing * 11 + armSwing, shoulderY + (isNpc ? 5 - waveY : 17));
  ctx.stroke();

  // Head
  ctx.fillStyle = '#090D16';
  ctx.strokeStyle = accent;
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.arc(torsoX + facing * 1.5, headY, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Glowing visor eyes
  ctx.fillStyle = accent;
  const eyeX = torsoX + facing * 4;
  ctx.beginPath();
  ctx.arc(eyeX - 1.5, headY - 1, 1.3, 0, Math.PI * 2);
  ctx.arc(eyeX + 2, headY - 1, 1.3, 0, Math.PI * 2);
  ctx.fill();

  // Zone-specific NPC accessories
  if (isNpc && zoneId) {
    ctx.strokeStyle = accent;
    ctx.fillStyle = accent;
    ctx.lineWidth = 1.8;
    if (zoneId === 'vault' || zoneId === 'lounge') {
      // Studio headphones arc
      ctx.beginPath();
      ctx.arc(torsoX + facing * 1.5, headY, 10, Math.PI * 1.05, Math.PI * 1.95);
      ctx.stroke();
    } else if (zoneId === 'arcade') {
      // Arcade cap visor
      ctx.beginPath();
      ctx.moveTo(torsoX - 5, headY - 7);
      ctx.lineTo(torsoX + 9, headY - 7);
      ctx.stroke();
    } else if (zoneId === 'academy') {
      // Graduation mortarboard
      ctx.fillRect(torsoX - 8, headY - 11, 16, 2.5);
    } else if (zoneId === 'projects') {
      // Glowing holo-tablet in front hand
      ctx.fillRect(torsoX + facing * 10, shoulderY + 3 - waveY, 7, 5);
    } else if (zoneId === 'shipyard') {
      // Orbital antenna
      ctx.beginPath();
      ctx.moveTo(torsoX, headY - 8);
      ctx.lineTo(torsoX, headY - 15);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(torsoX, headY - 16, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  if (label) {
    ctx.font = '600 10px "Plus Jakarta Sans", system-ui, sans-serif';
    const w = ctx.measureText(label).width + 12;
    ctx.fillStyle = 'rgba(9, 13, 22, 0.88)';
    ctx.strokeStyle = accent;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(-w / 2, headY - 27, w, 15, 4);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#F8FAFC';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, 0, headY - 19.5);
  }

  ctx.restore();
}

export function drawSpeechBubble(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  text: string,
  accent: string
): void {
  ctx.save();
  ctx.font = '500 11px "Plus Jakarta Sans", system-ui, sans-serif';
  const maxWidth = 210;
  const words = text.split(' ');
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxWidth - 18) {
      if (line) lines.push(line);
      line = w;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);

  const boxH = lines.length * 14 + 12;
  const boxW = maxWidth;
  const bx = x - boxW / 2;
  const by = y - 76 - boxH;

  ctx.fillStyle = 'rgba(9, 13, 22, 0.94)';
  ctx.strokeStyle = accent;
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.roundRect(bx, by, boxW, boxH, 7);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#F8FAFC';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  lines.forEach((ln, idx) => {
    ctx.fillText(ln, bx + 9, by + 7 + idx * 14);
  });
  ctx.restore();
}

export interface ZoneMonumentOpts {
  x: number;
  y: number;
  zoneId: GameZoneId;
  accent: string;
  scale?: number;
  time: number;
}

/** Animated 2.5D field monument standing on each platform (replaces extra NPC stickmen). */
export function drawZoneMonument(ctx: CanvasRenderingContext2D, opts: ZoneMonumentOpts): void {
  const { x, y, zoneId, accent, scale = 1, time } = opts;
  const hover = Math.sin(time * 2.4 + x * 0.02) * 2.5;

  ctx.save();
  ctx.translate(x, y + hover);
  ctx.scale(scale, scale);

  ctx.strokeStyle = accent;
  ctx.lineWidth = 1.8;

  if (zoneId === 'arcade') {
    // Glowing Upright Arcade Cabinet
    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.roundRect(-13, -34, 26, 32, 4);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = accent;
    ctx.fillRect(-10, -31, 20, 4);
    ctx.fillStyle = `rgba(229, 169, 60, ${0.35 + Math.sin(time * 5) * 0.15})`;
    ctx.fillRect(-9, -24, 18, 12);
    ctx.fillStyle = '#FCD34D';
    ctx.beginPath();
    ctx.arc(-4, -8, 2, 0, Math.PI * 2);
    ctx.arc(4, -8, 2, 0, Math.PI * 2);
    ctx.fill();
  } else if (zoneId === 'projects') {
    // Rotating AI Neural Core Cube + 3 orbiting nodes
    ctx.save();
    ctx.translate(0, -18);
    ctx.rotate(time * 0.9);
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(-10, -10, 20, 20);
    ctx.strokeRect(-10, -10, 20, 20);
    ctx.restore();
    for (let i = 0; i < 3; i++) {
      const a = time * 2.2 + (i * Math.PI * 2) / 3;
      ctx.fillStyle = accent;
      ctx.beginPath();
      ctx.arc(Math.cos(a) * 16, -18 + Math.sin(a) * 7, 2.6, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (zoneId === 'vault') {
    // Twin Spinning Cinema Film Reels
    for (const rx of [-9, 9]) {
      ctx.save();
      ctx.translate(rx, -22);
      ctx.rotate(time * 2.5);
      ctx.fillStyle = '#0F172A';
      ctx.beginPath();
      ctx.arc(0, 0, 8.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-8, 0);
      ctx.lineTo(8, 0);
      ctx.moveTo(0, -8);
      ctx.lineTo(0, 8);
      ctx.stroke();
      ctx.restore();
    }
    ctx.fillStyle = `${accent}44`;
    ctx.fillRect(-10, -12, 20, 9);
    ctx.strokeRect(-10, -12, 20, 9);
  } else if (zoneId === 'academy') {
    // Golden Trophy & Honors Pedestal
    ctx.fillStyle = '#F59E0B';
    ctx.beginPath();
    ctx.arc(0, -24, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(-6, -14, 12, 9);
    ctx.fillStyle = accent;
    ctx.fillRect(-11, -5, 22, 4);
  } else if (zoneId === 'shipyard') {
    // Orbital Launch Rocket + Rotating Halo
    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.moveTo(0, -34);
    ctx.lineTo(8, -12);
    ctx.lineTo(-8, -12);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#F59E0B';
    ctx.beginPath();
    ctx.arc(0, -8, 3 + Math.sin(time * 14) * 1.2, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Lo-Fi Equalizer Bars & Audio Deck
    for (let i = 0; i < 5; i++) {
      const bh = 8 + Math.abs(Math.sin(time * 4.5 + i * 0.9)) * 18;
      ctx.fillStyle = i % 2 === 0 ? accent : '#C084FC';
      ctx.fillRect(-12 + i * 5.5, -4 - bh, 3.8, bh);
    }
  }

  ctx.restore();
}
