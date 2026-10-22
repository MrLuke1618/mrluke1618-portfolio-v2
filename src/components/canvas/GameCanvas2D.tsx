import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameZoneId } from '../../types/game';
import { GAME_ZONES } from '../../constants/gameData';
import { sound } from '../../constants/soundEffects';
import { Video, Gamepad2, GraduationCap, Headphones, Crosshair } from 'lucide-react';

interface GameCanvas2DProps {
  activeZone: GameZoneId;
  onSelectZone: (zoneId: GameZoneId) => void;
  onOpenEasterEgg: (snippetId: string) => void;
  language: 'en' | 'vi';
}

interface WorldPoint {
  wx: number;
  wy: number;
}

interface TrailPoint {
  wx: number;
  wy: number;
  time: number;
}

// 4 Core Zones in Isometric World Space (centered around origin)
const ZONE_WORLD_COORDS: Record<GameZoneId, { wx: number; wy: number }> = {
  vault: { wx: -60, wy: -60 },   // Top-Left: Motion & Video Suite
  arcade: { wx: 60, wy: -60 },   // Top-Right: Project Showcase & Systems
  academy: { wx: -60, wy: 60 },  // Bottom-Left: Career & Education Tower
  lounge: { wx: 60, wy: 60 }     // Bottom-Right: Lo-Fi Lounge & Contact Hub
};

export const GameCanvas2D: React.FC<GameCanvas2DProps> = ({
  activeZone,
  onSelectZone,
  language
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Avatar physics state in World Coordinates
  const playerRef = useRef<{ wx: number; wy: number; vx: number; vy: number; angle: number }>({
    wx: -60,
    wy: -60,
    vx: 0,
    vy: 0,
    angle: 0
  });

  const targetRef = useRef<WorldPoint | null>(null);
  const trailRef = useRef<TrailPoint[]>([]);
  const cameraRef = useRef<{ cx: number; cy: number; zoom: number; targetZoom: number }>({
    cx: -60,
    cy: -60,
    zoom: 1.0,
    targetZoom: 1.0
  });

  const keysPressed = useRef<{ [key: string]: boolean }>({});
  const [nearZone, setNearZone] = useState<GameZoneId | null>('vault');
  const [travelMessage, setTravelMessage] = useState<string>('');

  // Isometric Projection Math (30-degree isometric plane)
  const ISO_COS = Math.cos(Math.PI / 6); // ~0.866
  const ISO_SIN = Math.sin(Math.PI / 6); // 0.5

  const projectIso = useCallback((wx: number, wy: number) => {
    return {
      isoX: (wx - wy) * ISO_COS,
      isoY: (wx + wy) * ISO_SIN
    };
  }, [ISO_COS, ISO_SIN]);

  const unprojectIso = useCallback((isoX: number, isoY: number) => {
    const wx = (isoX / ISO_COS + isoY / ISO_SIN) / 2;
    const wy = (isoY / ISO_SIN - isoX / ISO_COS) / 2;
    return { wx, wy };
  }, [ISO_COS, ISO_SIN]);

  // Sync when activeZone is selected from external docks
  useEffect(() => {
    const coords = ZONE_WORLD_COORDS[activeZone];
    if (coords) {
      targetRef.current = { wx: coords.wx, wy: coords.wy };
      cameraRef.current.targetZoom = 1.15;
      setNearZone(activeZone);
    }
  }, [activeZone]);

  // Keyboard navigation listener (WASD + Arrow Keys + Space/E to enter)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore typing in input/textarea
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;

      const key = e.key.toLowerCase();
      keysPressed.current[key] = true;

      // Interaction key [E] or Spacebar to enter near zone
      if ((key === 'e' || key === ' ') && nearZone) {
        e.preventDefault();
        onSelectZone(nearZone);
        sound.playBip(880, 0.08);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      keysPressed.current[key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [nearZone, onSelectZone]);

  // Canvas Click / Tap to Travel
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickScreenX = e.clientX - rect.left;
    const clickScreenY = e.clientY - rect.top;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const zoom = cameraRef.current.zoom;

    // Convert Screen to Isometric offset
    const isoOffsetX = (clickScreenX - centerX) / zoom + projectIso(cameraRef.current.cx, cameraRef.current.cy).isoX;
    const isoOffsetY = (clickScreenY - centerY) / zoom + projectIso(cameraRef.current.cx, cameraRef.current.cy).isoY;

    const world = unprojectIso(isoOffsetX, isoOffsetY);

    // Clamp to map bounds
    const clampedWx = Math.max(-110, Math.min(110, world.wx));
    const clampedWy = Math.max(-110, Math.min(110, world.wy));

    targetRef.current = { wx: clampedWx, wy: clampedWy };
    sound.playBip(620, 0.04);

    // Check if clicked close to a station footprint
    for (const zone of GAME_ZONES) {
      const coords = ZONE_WORLD_COORDS[zone.id];
      const dist = Math.hypot(clampedWx - coords.wx, clampedWy - coords.wy);
      if (dist < 22) {
        onSelectZone(zone.id);
        break;
      }
    }
  };

  // Main Render & Physics Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const resizeCanvas = () => {
      if (!canvas || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.resetTransform();
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      const player = playerRef.current;
      const camera = cameraRef.current;
      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);
      const centerX = width / 2;
      const centerY = height / 2;

      // 1. Process Keyboard Input (WASD / Arrows)
      let inputWx = 0;
      let inputWy = 0;
      const k = keysPressed.current;

      if (k['w'] || k['arrowup']) {
        inputWx -= 1;
        inputWy -= 1;
      }
      if (k['s'] || k['arrowdown']) {
        inputWx += 1;
        inputWy += 1;
      }
      if (k['a'] || k['arrowleft']) {
        inputWx -= 1;
        inputWy += 1;
      }
      if (k['d'] || k['arrowright']) {
        inputWx += 1;
        inputWy -= 1;
      }

      if (inputWx !== 0 || inputWy !== 0) {
        targetRef.current = null; // Keyboard overrides click target
        const len = Math.hypot(inputWx, inputWy);
        const speed = 75; // world units per sec
        player.vx = (inputWx / len) * speed;
        player.vy = (inputWy / len) * speed;
      } else if (targetRef.current) {
        // Navigate toward target
        const dx = targetRef.current.wx - player.wx;
        const dy = targetRef.current.wy - player.wy;
        const dist = Math.hypot(dx, dy);

        if (dist < 1.5) {
          player.wx = targetRef.current.wx;
          player.wy = targetRef.current.wy;
          player.vx = 0;
          player.vy = 0;
          targetRef.current = null;
        } else {
          const speed = Math.min(90, Math.max(25, dist * 2.8));
          player.vx = (dx / dist) * speed;
          player.vy = (dy / dist) * speed;
        }
      } else {
        // Friction dampening
        player.vx *= Math.pow(0.005, dt);
        player.vy *= Math.pow(0.005, dt);
      }

      // Update Player World Position with bounds clamping
      player.wx = Math.max(-105, Math.min(105, player.wx + player.vx * dt));
      player.wy = Math.max(-105, Math.min(105, player.wy + player.vy * dt));

      const isMoving = Math.hypot(player.vx, player.vy) > 1.0;

      if (isMoving) {
        player.angle = Math.atan2(player.vy, player.vx);
        // Add trail point
        trailRef.current.push({
          wx: player.wx,
          wy: player.wy,
          time: currentTime
        });
      }

      // 2. Exact 1-Second Dash Decay: Filter points older than 1000ms
      trailRef.current = trailRef.current.filter((p) => currentTime - p.time <= 1000);

      // 3. Proximity Check to 4 Core Zones
      let detectedZone: GameZoneId | null = null;
      for (const zone of GAME_ZONES) {
        const coords = ZONE_WORLD_COORDS[zone.id];
        const dist = Math.hypot(player.wx - coords.wx, player.wy - coords.wy);
        if (dist <= 26) {
          detectedZone = zone.id;
          break;
        }
      }

      if (detectedZone !== nearZone) {
        setNearZone(detectedZone);
        if (detectedZone) {
          camera.targetZoom = 1.15;
          const found = GAME_ZONES.find((z) => z.id === detectedZone);
          if (found) {
            setTravelMessage(
              language === 'en'
                ? `Approaching ${found.titleEn}`
                : `Đang đến gần ${found.titleVi}`
            );
          }
        } else {
          camera.targetZoom = 1.0;
          setTravelMessage('');
        }
      }

      // 4. Smooth Camera Tracking
      const camLerp = 0.08;
      camera.cx += (player.wx - camera.cx) * camLerp;
      camera.cy += (player.wy - camera.cy) * camLerp;
      camera.zoom += (camera.targetZoom - camera.zoom) * 0.06;

      const camIso = projectIso(camera.cx, camera.cy);

      // Helper function: Convert world coord to screen pixel
      const toScreen = (wx: number, wy: number, zOffset = 0) => {
        const iso = projectIso(wx, wy);
        return {
          x: centerX + (iso.isoX - camIso.isoX) * camera.zoom,
          y: centerY + (iso.isoY - camIso.isoY) * camera.zoom - zOffset * camera.zoom
        };
      };

      // Helper function: Draw isometric diamond
      const drawIsoDiamond = (
        wx: number,
        wy: number,
        radius: number,
        z = 0,
        fillColor?: string,
        strokeColor?: string,
        lineWidth = 1
      ) => {
        const pTop = toScreen(wx - radius, wy - radius, z);
        const pRight = toScreen(wx + radius, wy - radius, z);
        const pBottom = toScreen(wx + radius, wy + radius, z);
        const pLeft = toScreen(wx - radius, wy + radius, z);

        ctx.beginPath();
        ctx.moveTo(pTop.x, pTop.y);
        ctx.lineTo(pRight.x, pRight.y);
        ctx.lineTo(pBottom.x, pBottom.y);
        ctx.lineTo(pLeft.x, pLeft.y);
        ctx.closePath();

        if (fillColor) {
          ctx.fillStyle = fillColor;
          ctx.fill();
        }
        if (strokeColor) {
          ctx.strokeStyle = strokeColor;
          ctx.lineWidth = lineWidth;
          ctx.stroke();
        }
      };

      // ------------------------------------------------------------------------
      // RENDER PASS 1: Clear & Background Surface
      // ------------------------------------------------------------------------
      ctx.clearRect(0, 0, width, height);

      // Deep Obsidian background with subtle radial gradient
      const bgGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        40,
        centerX,
        centerY,
        Math.max(width, height) * 0.7
      );
      bgGrad.addColorStop(0, '#131B2E'); // Muted Navy
      bgGrad.addColorStop(1, '#090D16'); // Obsidian Black
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // ------------------------------------------------------------------------
      // RENDER PASS 2: Parallax Isometric Tile Grid Plane
      // ------------------------------------------------------------------------
      const tileSize = 20;
      const gridExtent = 5;

      ctx.save();
      for (let gx = -gridExtent; gx <= gridExtent; gx++) {
        for (let gy = -gridExtent; gy <= gridExtent; gy++) {
          const twx = gx * tileSize;
          const twy = gy * tileSize;
          const isCenter = Math.abs(gx) <= 1 && Math.abs(gy) <= 1;

          drawIsoDiamond(
            twx,
            twy,
            tileSize * 0.48,
            0,
            isCenter ? 'rgba(19, 27, 46, 0.65)' : 'rgba(19, 27, 46, 0.35)',
            'rgba(30, 41, 59, 0.4)',
            1
          );
        }
      }
      ctx.restore();

      // ------------------------------------------------------------------------
      // RENDER PASS 3: Glowing Circuit Pathways Linking Zones
      // ------------------------------------------------------------------------
      ctx.save();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.25)';
      ctx.setLineDash([6, 6]);

      // Connect 4 zones via central nexus
      const connections: [GameZoneId, GameZoneId][] = [
        ['vault', 'arcade'],
        ['arcade', 'lounge'],
        ['lounge', 'academy'],
        ['academy', 'vault'],
        ['vault', 'lounge'],
        ['arcade', 'academy']
      ];

      for (const [z1, z2] of connections) {
        const c1 = ZONE_WORLD_COORDS[z1];
        const c2 = ZONE_WORLD_COORDS[z2];
        const s1 = toScreen(c1.wx, c1.wy);
        const s2 = toScreen(c2.wx, c2.wy);

        ctx.beginPath();
        ctx.moveTo(s1.x, s1.y);
        ctx.lineTo(s2.x, s2.y);
        ctx.stroke();
      }
      ctx.setLineDash([]);
      ctx.restore();

      // Central Nexus Diamond
      drawIsoDiamond(0, 0, 16, 0, 'rgba(139, 92, 246, 0.08)', '#8B5CF6', 1.5);
      const nexusScreen = toScreen(0, 0);
      ctx.save();
      ctx.font = '9px monospace';
      ctx.fillStyle = '#94A3B8';
      ctx.textAlign = 'center';
      ctx.fillText('NEXUS CORE', nexusScreen.x, nexusScreen.y + 4);
      ctx.restore();

      // ------------------------------------------------------------------------
      // RENDER PASS 4: Architectural Station Platforms & Footprints
      // ------------------------------------------------------------------------
      for (const zone of GAME_ZONES) {
        const coords = ZONE_WORLD_COORDS[zone.id];
        const isHovered = nearZone === zone.id;
        const pulse = Math.sin(currentTime * 0.003 + coords.wx) * 0.15 + 0.85;

        // Base Plinth Shadow
        drawIsoDiamond(coords.wx, coords.wy, 24, 0, 'rgba(9, 13, 22, 0.8)', undefined);

        // Lower Plinth Tier
        drawIsoDiamond(
          coords.wx,
          coords.wy,
          23,
          4,
          'rgba(19, 27, 46, 0.9)',
          'rgba(30, 41, 59, 0.8)',
          1
        );

        // Raised Glassmorphic Tier
        const plinthFill = isHovered
          ? 'rgba(139, 92, 246, 0.22)'
          : 'rgba(19, 27, 46, 0.85)';
        const plinthBorder = isHovered ? '#8B5CF6' : 'rgba(139, 92, 246, 0.4)';

        drawIsoDiamond(coords.wx, coords.wy, 21, 10, plinthFill, plinthBorder, isHovered ? 2 : 1);

        // Glowing Concentric Ring on Platform
        const topScreen = toScreen(coords.wx, coords.wy, 10);
        ctx.save();
        ctx.beginPath();
        ctx.arc(topScreen.x, topScreen.y, 16 * camera.zoom * pulse, 0, Math.PI * 2);
        ctx.strokeStyle = isHovered ? 'rgba(139, 92, 246, 0.8)' : 'rgba(139, 92, 246, 0.25)';
        ctx.lineWidth = isHovered ? 2 : 1;
        ctx.stroke();

        // Corner HUD Brackets
        const bracketSize = 14 * camera.zoom;
        ctx.strokeStyle = isHovered ? '#8B5CF6' : '#94A3B8';
        ctx.lineWidth = 1.5;

        // Top-left bracket
        ctx.beginPath();
        ctx.moveTo(topScreen.x - bracketSize, topScreen.y - bracketSize + 4);
        ctx.lineTo(topScreen.x - bracketSize, topScreen.y - bracketSize);
        ctx.lineTo(topScreen.x - bracketSize + 4, topScreen.y - bracketSize);
        ctx.stroke();

        // Top-right bracket
        ctx.beginPath();
        ctx.moveTo(topScreen.x + bracketSize - 4, topScreen.y - bracketSize);
        ctx.lineTo(topScreen.x + bracketSize, topScreen.y - bracketSize);
        ctx.lineTo(topScreen.x + bracketSize, topScreen.y - bracketSize + 4);
        ctx.stroke();

        // Bottom-left bracket
        ctx.beginPath();
        ctx.moveTo(topScreen.x - bracketSize, topScreen.y + bracketSize - 4);
        ctx.lineTo(topScreen.x - bracketSize, topScreen.y + bracketSize);
        ctx.lineTo(topScreen.x - bracketSize + 4, topScreen.y + bracketSize);
        ctx.stroke();

        // Bottom-right bracket
        ctx.beginPath();
        ctx.moveTo(topScreen.x + bracketSize - 4, topScreen.y + bracketSize);
        ctx.lineTo(topScreen.x + bracketSize, topScreen.y + bracketSize);
        ctx.lineTo(topScreen.x + bracketSize, topScreen.y + bracketSize - 4);
        ctx.stroke();

        // Station Typography Label
        ctx.font = isHovered ? 'bold 12px sans-serif' : '11px sans-serif';
        ctx.fillStyle = isHovered ? '#F8FAFC' : '#94A3B8';
        ctx.textAlign = 'center';
        ctx.fillText(
          language === 'en' ? zone.titleEn : zone.titleVi,
          topScreen.x,
          topScreen.y + 28 * camera.zoom
        );

        // Proximity Activation HUD Banner
        if (isHovered) {
          ctx.save();
          const badgeY = topScreen.y - 32 * camera.zoom;
          ctx.fillStyle = '#8B5CF6';
          ctx.font = 'bold 10px monospace';
          ctx.shadowColor = '#8B5CF6';
          ctx.shadowBlur = 8;
          ctx.fillText(
            language === 'en' ? '▶ PRESS [E] OR CLICK' : '▶ NHẤN [E] HOẶC CLICK',
            topScreen.x,
            badgeY
          );
          ctx.restore();
        }
        ctx.restore();
      }

      // ------------------------------------------------------------------------
      // RENDER PASS 5: Destination Waypoint Marker (If moving by click)
      // ------------------------------------------------------------------------
      if (targetRef.current) {
        const destScreen = toScreen(targetRef.current.wx, targetRef.current.wy);
        const wave = (currentTime * 0.005) % 1;
        ctx.save();
        ctx.beginPath();
        ctx.arc(destScreen.x, destScreen.y, 6 + wave * 14, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(139, 92, 246, ${1 - wave})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(destScreen.x, destScreen.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#8B5CF6';
        ctx.fill();
        ctx.restore();
      }

      // ------------------------------------------------------------------------
      // RENDER PASS 6: Clean 1.0-Second Glowing Energy Dash Trail
      // ------------------------------------------------------------------------
      const trail = trailRef.current;
      if (trail.length >= 2) {
        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        for (let i = 0; i < trail.length - 1; i++) {
          const p1 = trail[i];
          const p2 = trail[i + 1];
          const age = currentTime - p1.time;

          // Strictly disappears at 1000ms
          const lifeProgress = Math.max(0, Math.min(1, 1 - age / 1000));
          if (lifeProgress <= 0) continue;

          const s1 = toScreen(p1.wx, p1.wy, 6);
          const s2 = toScreen(p2.wx, p2.wy, 6);

          ctx.beginPath();
          ctx.moveTo(s1.x, s1.y);
          ctx.lineTo(s2.x, s2.y);
          ctx.lineWidth = 3.5 * lifeProgress;
          ctx.strokeStyle = `rgba(139, 92, 246, ${lifeProgress * 0.85})`;
          ctx.shadowColor = '#8B5CF6';
          ctx.shadowBlur = 10 * lifeProgress;
          ctx.stroke();
        }
        ctx.restore();
      }

      // ------------------------------------------------------------------------
      // RENDER PASS 7: Cyberpunk Nano-Drone Avatar
      // ------------------------------------------------------------------------
      const bobbing = Math.sin(currentTime * 0.006) * 3;
      const droneScreen = toScreen(player.wx, player.wy, 14 + bobbing);
      const shadowScreen = toScreen(player.wx, player.wy, 0);

      ctx.save();
      // Drop Shadow on Floor Grid
      ctx.beginPath();
      ctx.ellipse(
        shadowScreen.x,
        shadowScreen.y,
        12 * camera.zoom,
        6 * camera.zoom,
        0,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = 'rgba(9, 13, 22, 0.65)';
      ctx.fill();

      // Drone Sprite (Vector Illustration)
      ctx.translate(droneScreen.x, droneScreen.y);

      // Thruster Exhaust Flare (Electric Violet)
      if (isMoving) {
        ctx.beginPath();
        ctx.arc(0, 8, 4 + Math.random() * 3, 0, Math.PI * 2);
        ctx.fillStyle = '#8B5CF6';
        ctx.shadowColor = '#8B5CF6';
        ctx.shadowBlur = 12;
        ctx.fill();
      }

      // Drone Outer Ring / Hexagon Shell
      ctx.beginPath();
      const droneRadius = 11 * camera.zoom;
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI) / 3;
        const x = Math.cos(a) * droneRadius;
        const y = Math.sin(a) * (droneRadius * 0.7);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fillStyle = '#131B2E';
      ctx.fill();
      ctx.strokeStyle = '#8B5CF6';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Inner Luminous Core
      ctx.beginPath();
      ctx.arc(0, 0, 4 * camera.zoom, 0, Math.PI * 2);
      ctx.fillStyle = '#F8FAFC';
      ctx.shadowColor = '#8B5CF6';
      ctx.shadowBlur = 10;
      ctx.fill();

      // Thruster Wing Fins
      ctx.fillStyle = '#94A3B8';
      ctx.fillRect(-droneRadius - 2, -2, 3, 4);
      ctx.fillRect(droneRadius - 1, -2, 3, 4);

      ctx.restore();

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animId);
    };
  }, [language, nearZone, onSelectZone, projectIso, unprojectIso]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[480px] sm:h-[540px] md:h-[600px] rounded-2xl overflow-hidden border border-[#1E293B] bg-[#090D16] select-none"
    >
      {/* Interactive 2.5D Layered Canvas */}
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="w-full h-full cursor-crosshair block"
        aria-label="2.5D Isometric World Canvas"
      />

      {/* Top HUD Overlay: Controls & Coordinate readout */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#131B2E]/90 border border-[#1E293B] backdrop-blur text-xs font-mono text-[#F8FAFC]">
          <Crosshair className="w-3.5 h-3.5 text-[#8B5CF6]" />
          <span>
            {language === 'en'
              ? 'CONTROLS: WASD / ARROWS / CLICK TO TRAVEL'
              : 'ĐIỀU KHIỂN: WASD / PHÍM MŨI TÊN / CHẠM ĐỂ DI CHUYỂN'}
          </span>
        </div>

        {nearZone && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#8B5CF6]/20 border border-[#8B5CF6]/50 text-xs font-mono text-[#F8FAFC] backdrop-blur animate-pulse">
            <span className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
            <span>
              {language === 'en'
                ? 'PRESS [E] TO INSPECT STATION'
                : 'NHẤN [E] ĐỂ VÀO TRẠM'}
            </span>
          </div>
        )}
      </div>

      {/* Dynamic Travel Notification */}
      {travelMessage && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 pointer-events-none px-3 py-1 rounded bg-[#131B2E]/90 border border-[#8B5CF6]/40 text-xs text-[#8B5CF6] font-mono shadow-lg">
          {travelMessage}
        </div>
      )}

      {/* Bottom Fast-Travel Station Bar */}
      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-center gap-2 pointer-events-auto">
        {GAME_ZONES.map((zone) => {
          const isCurrent = activeZone === zone.id;
          const isClose = nearZone === zone.id;

          return (
            <button
              key={zone.id}
              onClick={() => {
                onSelectZone(zone.id);
                sound.playBip(740, 0.05);
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                isCurrent || isClose
                  ? 'bg-[#8B5CF6] text-white shadow-lg shadow-violet-500/20 border border-violet-400'
                  : 'bg-[#131B2E]/90 text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E293B] border border-[#1E293B]'
              }`}
            >
              {zone.id === 'vault' && <Video className="w-3.5 h-3.5" />}
              {zone.id === 'arcade' && <Gamepad2 className="w-3.5 h-3.5" />}
              {zone.id === 'academy' && <GraduationCap className="w-3.5 h-3.5" />}
              {zone.id === 'lounge' && <Headphones className="w-3.5 h-3.5" />}
              <span className="whitespace-nowrap">
                {language === 'en' ? zone.titleEn : zone.titleVi}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
