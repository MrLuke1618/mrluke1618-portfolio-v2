import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameZoneId } from '../../types/game';
import { GAME_ZONES } from '../../constants/gameData';
import { sound } from '../../constants/soundEffects';
import { lofiAudioEngine } from '../../utils/lofiAudioEngine';
import { Crosshair, Zap, Sparkles } from 'lucide-react';
import { drawStickman, drawSpeechBubble, drawZoneMonument } from '../../engine/stickmanRenderer';

const SKILL_ORBS: { id: string; labelEn: string; labelVi: string; wx: number; wy: number; color: string }[] = [
  { id: 'ai-games', labelEn: 'AI Game Direction', labelVi: 'Đạo diễn Game AI', wx: -72, wy: -57, color: '#F59E0B' },
  { id: 'gemini', labelEn: 'Gemini Multimodal AI', labelVi: 'Gemini Đa Phương Thức', wx: 72, wy: -57, color: '#14B8A6' },
  { id: 'hyperframes', labelEn: 'Hyperframes Video Pipeline', labelVi: 'Pipeline Video Hyperframes', wx: -98, wy: 15, color: '#F43F5E' },
  { id: 'react-ts', labelEn: 'React 19 & TypeScript', labelVi: 'React 19 & TypeScript', wx: 98, wy: 15, color: '#10B981' },
  { id: 'cloudflare', labelEn: 'Cloudflare CI/CD', labelVi: 'Triển khai Cloudflare', wx: -57, wy: 87, color: '#38BDF8' },
  { id: 'webgl-canvas', labelEn: 'WebGL & Procedural Audio', labelVi: 'WebGL & Âm Thanh Số', wx: 57, wy: 87, color: '#A855F7' },
];

interface GameCanvas2DProps {
  activeZone: GameZoneId;
  onSelectZone: (zoneId: GameZoneId, shouldScroll?: boolean) => void;
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

interface StarParticle {
  wx: number;
  wy: number;
  z: number;
  speed: number;
  size: number;
  alpha: number;
}

// Hexagonal 6-Building Living World Coordinates around NEXUS CORE (0, 0)
const ZONE_WORLD_COORDS: Record<GameZoneId, { wx: number; wy: number }> = {
  arcade: { wx: -120, wy: -95 },   // NW: AI Games Arena
  projects: { wx: 120, wy: -95 },  // NE: AI Projects Lab
  vault: { wx: -165, wy: 25 },     // W: YouTube Cinema & Video Vault
  academy: { wx: 165, wy: 25 },    // E: Career & Certificates Tower
  shipyard: { wx: -95, wy: 145 },  // SW: AntiGravity & Code Shipyard
  lounge: { wx: 95, wy: 145 }      // SE: Lo-Fi Lounge & Contact Cafe
};

export const GameCanvas2D: React.FC<GameCanvas2DProps> = ({
  activeZone,
  onSelectZone,
  language
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const joystickBaseRef = useRef<HTMLDivElement>(null);

  // Avatar physics state in World Coordinates (spawn in Central Nexus Plaza)
  const playerRef = useRef<{ wx: number; wy: number; vx: number; vy: number; angle: number }>({
    wx: 0,
    wy: 14,
    vx: 0,
    vy: 0,
    angle: 0
  });

  const targetRef = useRef<WorldPoint | null>(null);
  const trailRef = useRef<TrailPoint[]>([]);
  const cameraRef = useRef<{ cx: number; cy: number; zoom: number; targetZoom: number }>({
    cx: 0,
    cy: 14,
    zoom: 1.0,
    targetZoom: 1.0
  });

  // Long-range warp jump state
  const warpRef = useRef<{ isWarping: boolean; warpProgress: number; warpStartTime: number }>({
    isWarping: false,
    warpProgress: 0,
    warpStartTime: 0
  });

  const keysPressed = useRef<{ [key: string]: boolean }>({});
  const walkPhaseRef = useRef<number>(0);
  const [collectedOrbs, setCollectedOrbs] = useState<string[]>([]);
  const collectedOrbsRef = useRef<string[]>([]);
  collectedOrbsRef.current = collectedOrbs;
  const [nearZone, setNearZone] = useState<GameZoneId | null>(null);
  const [travelMessage, setTravelMessage] = useState<string>('');
  const [isWarpingUi, setIsWarpingUi] = useState<boolean>(false);

  // Mobile / Tablet Touch Controls State
  const [controlMode, setControlMode] = useState<'touch' | 'keyboard'>('keyboard');
  const joystickActive = useRef<boolean>(false);
  const joystickTouchId = useRef<number | null>(null);
  const joystickVector = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [knobOffset, setKnobOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const isBoostActive = useRef<boolean>(false);

  // Auto-detect touch capable device on mount
  useEffect(() => {
    const isTouch =
      typeof window !== 'undefined' &&
      ('ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth < 1024);
    if (isTouch) {
      setControlMode('touch');
    }
  }, []);

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

  // Initiate long-range hyperspace warp transition
  const triggerWarpJump = useCallback((destWx: number, destWy: number, zoneId: GameZoneId) => {
    const player = playerRef.current;
    const dist = Math.hypot(destWx - player.wx, destWy - player.wy);

    // If long range travel (especially to/from distant shipyard or arcade)
    if (dist > 85) {
      warpRef.current.isWarping = true;
      warpRef.current.warpProgress = 0;
      warpRef.current.warpStartTime = performance.now();
      setIsWarpingUi(true);
      sound.playTeleport();

      // Camera zooms out to show the expansive Star System flight corridor
      cameraRef.current.targetZoom = 0.72;

      setTravelMessage(
        language === 'en'
          ? `Initiating Hyperspace Warp Jump to ${GAME_ZONES.find(z => z.id === zoneId)?.titleEn}...`
          : `Kích hoạt bước nhảy không gian tới ${GAME_ZONES.find(z => z.id === zoneId)?.titleVi}...`
      );

      setTimeout(() => {
        warpRef.current.isWarping = false;
        setIsWarpingUi(false);
        cameraRef.current.targetZoom = 1.15;
      }, 1000);
    }
  }, [language]);

  const hasMountedRef = useRef<boolean>(false);

  // Sync when activeZone is selected from external docks (skip initial mount so Explorer spawns at NEXUS CORE)
  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }
    const coords = ZONE_WORLD_COORDS[activeZone];
    if (coords) {
      triggerWarpJump(coords.wx, coords.wy, activeZone);
      targetRef.current = { wx: coords.wx, wy: coords.wy };
      setNearZone(activeZone);
    }
  }, [activeZone, triggerWarpJump]);

  // Keyboard navigation listener (WASD + Arrow Keys + Space/E to enter station)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;

      const key = e.key.toLowerCase();
      keysPressed.current[key] = true;

      // Interaction key [E] or Spacebar to enter near zone and smoothly scroll to hub
      if ((key === 'e' || key === ' ') && nearZone) {
        e.preventDefault();
        onSelectZone(nearZone, true);
        sound.playLevelUp();
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

  // Touch analog stick coordinate processing
  const updateJoystick = useCallback((clientX: number, clientY: number) => {
    const base = joystickBaseRef.current;
    if (!base) return;
    const rect = base.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rawDx = clientX - centerX;
    const rawDy = clientY - centerY;
    const maxRadius = 36;
    const dist = Math.hypot(rawDx, rawDy);
    const clampedDist = Math.min(maxRadius, dist);
    const angle = Math.atan2(rawDy, rawDx);
    const clampedX = Math.cos(angle) * clampedDist;
    const clampedY = Math.sin(angle) * clampedDist;

    setKnobOffset({ x: clampedX, y: clampedY });
    joystickVector.current = {
      x: clampedX / maxRadius,
      y: clampedY / maxRadius
    };
  }, []);

  const handleJoystickTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (e.targetTouches.length > 0 && joystickTouchId.current === null) {
      const touch = e.targetTouches[0];
      joystickTouchId.current = touch.identifier;
      joystickActive.current = true;
      updateJoystick(touch.clientX, touch.clientY);
    }
  };

  const handleJoystickTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation();
    for (let i = 0; i < e.targetTouches.length; i++) {
      if (e.targetTouches[i].identifier === joystickTouchId.current) {
        updateJoystick(e.targetTouches[i].clientX, e.targetTouches[i].clientY);
        break;
      }
    }
  };

  const handleJoystickTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation();
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === joystickTouchId.current) {
        joystickTouchId.current = null;
        joystickActive.current = false;
        joystickVector.current = { x: 0, y: 0 };
        setKnobOffset({ x: 0, y: 0 });
        break;
      }
    }
  };

  const handleJoystickMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    joystickActive.current = true;
    updateJoystick(e.clientX, e.clientY);

    const onMouseMove = (moveEvent: MouseEvent) => {
      updateJoystick(moveEvent.clientX, moveEvent.clientY);
    };

    const onMouseUp = () => {
      joystickActive.current = false;
      joystickVector.current = { x: 0, y: 0 };
      setKnobOffset({ x: 0, y: 0 });
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  // Right-hand action button trigger (Enter station or Boost)
  const handleActionButton = (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (nearZone) {
      onSelectZone(nearZone, true);
      sound.playLevelUp();
    } else {
      // Warp Boost in open space
      isBoostActive.current = true;
      sound.playTeleport();
      setTimeout(() => {
        isBoostActive.current = false;
      }, 600);
    }
  };

  const processScreenTap = useCallback((clickScreenX: number, clickScreenY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const zoom = cameraRef.current.zoom;

    // Convert Screen to Isometric offset
    const isoOffsetX = (clickScreenX - centerX) / zoom + projectIso(cameraRef.current.cx, cameraRef.current.cy).isoX;
    const isoOffsetY = (clickScreenY - centerY) / zoom + projectIso(cameraRef.current.cx, cameraRef.current.cy).isoY;

    const world = unprojectIso(isoOffsetX, isoOffsetY);

    // Clamp to spacious 6-building overworld bounds
    const clampedWx = Math.max(-225, Math.min(225, world.wx));
    const clampedWy = Math.max(-155, Math.min(200, world.wy));

    // Check if clicked close to a station footprint
    let targetZone: GameZoneId | null = null;
    for (const zone of GAME_ZONES) {
      const coords = ZONE_WORLD_COORDS[zone.id];
      const dist = Math.hypot(clampedWx - coords.wx, clampedWy - coords.wy);
      if (dist < 28) {
        targetZone = zone.id;
        break;
      }
    }

    if (targetZone) {
      const coords = ZONE_WORLD_COORDS[targetZone];
      triggerWarpJump(coords.wx, coords.wy, targetZone);
      targetRef.current = { wx: coords.wx, wy: coords.wy };
      onSelectZone(targetZone, true);
    } else {
      targetRef.current = { wx: clampedWx, wy: clampedWy };
      sound.playBip(620, 0.04);
    }
  }, [onSelectZone, projectIso, triggerWarpJump, unprojectIso]);

  // Canvas Click / Tap to Travel
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    processScreenTap(e.clientX - rect.left, e.clientY - rect.top);
  };

  // Canvas Touch to Travel
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length > 0) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      processScreenTap(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top);
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

    // Generate deep-space starfield particles
    const starCount = 80;
    const stars: StarParticle[] = [];
    for (let i = 0; i < starCount; i++) {
      stars.push({
        wx: (Math.random() - 0.5) * 320,
        wy: (Math.random() - 0.5) * 440 - 50,
        z: Math.random() * 20,
        speed: Math.random() * 0.4 + 0.1,
        size: Math.random() * 1.6 + 0.6,
        alpha: Math.random() * 0.5 + 0.2
      });
    }

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

      // Audio reactivity analysis
      let audioPulse = 1.0;
      if (lofiAudioEngine.getIsPlaying()) {
        const freq = lofiAudioEngine.getFrequencyData();
        if (freq && freq.length > 0) {
          const bass = (freq[0] + freq[1] + freq[2] + freq[3]) / (4 * 255);
          audioPulse = 1.0 + bass * 0.35;
        }
      }

      // Check long-range warp status
      const isWarping = warpRef.current.isWarping;
      const warpSpeedMult = isWarping ? 3.8 : 1.0;

      // 1. Process Directional Input (WASD / Arrows + Virtual Joystick)
      let screenDx = 0;
      let screenDy = 0;
      const k = keysPressed.current;

      if (k['w'] || k['arrowup']) screenDy -= 1;
      if (k['s'] || k['arrowdown']) screenDy += 1;
      if (k['a'] || k['arrowleft']) screenDx -= 1;
      if (k['d'] || k['arrowright']) screenDx += 1;

      // Add touch joystick vector
      if (joystickActive.current) {
        screenDx += joystickVector.current.x;
        screenDy += joystickVector.current.y;
      }

      const hasDirectionInput = Math.hypot(screenDx, screenDy) > 0.05;

      if (hasDirectionInput) {
        targetRef.current = null;
        const len = Math.hypot(screenDx, screenDy);
        const normScreenX = screenDx / Math.max(1, len);
        const normScreenY = screenDy / Math.max(1, len);

        // Invert 30-degree isometric projection to convert screen direction to world isometric delta:
        // isoX = (wx - wy) * ISO_COS  =>  (wx - wy) = normScreenX / ISO_COS
        // isoY = (wx + wy) * ISO_SIN  =>  (wx + wy) = normScreenY / ISO_SIN
        const inputWx = (normScreenX / ISO_COS + normScreenY / ISO_SIN) / 2;
        const inputWy = (normScreenY / ISO_SIN - normScreenX / ISO_COS) / 2;

        const boostMult = isBoostActive.current ? 2.2 : 1.0;
        const speed = 90 * warpSpeedMult * boostMult;
        player.vx = inputWx * speed;
        player.vy = inputWy * speed;
      } else if (targetRef.current) {
        // Navigate toward target
        const dx = targetRef.current.wx - player.wx;
        const dy = targetRef.current.wy - player.wy;
        const dist = Math.hypot(dx, dy);

        if (dist < 2.0) {
          player.wx = targetRef.current.wx;
          player.wy = targetRef.current.wy;
          player.vx = 0;
          player.vy = 0;
          targetRef.current = null;
        } else {
          const baseSpeed = Math.min(180, Math.max(30, dist * 3.2));
          const speed = baseSpeed * warpSpeedMult;
          player.vx = (dx / dist) * speed;
          player.vy = (dy / dist) * speed;
        }
      } else {
        // Friction dampening
        player.vx *= Math.pow(0.005, dt);
        player.vy *= Math.pow(0.005, dt);
      }

      // Update Player World Position within 6-building overworld
      player.wx = Math.max(-225, Math.min(225, player.wx + player.vx * dt));
      player.wy = Math.max(-155, Math.min(200, player.wy + player.vy * dt));

      const isMoving = Math.hypot(player.vx, player.vy) > 1.0;

      if (isMoving) {
        player.angle = Math.atan2(player.vy, player.vx);
        walkPhaseRef.current += dt * (Math.hypot(player.vx, player.vy) / 7.5);
        // Add trail point
        trailRef.current.push({
          wx: player.wx,
          wy: player.wy,
          time: currentTime
        });
      }

      // Check Skill Orb collection
      for (const orb of SKILL_ORBS) {
        if (collectedOrbsRef.current.includes(orb.id)) continue;
        if (Math.hypot(player.wx - orb.wx, player.wy - orb.wy) <= 16) {
          const next = [...collectedOrbsRef.current, orb.id];
          collectedOrbsRef.current = next;
          setCollectedOrbs(next);
          sound.playLevelUp();
          setTravelMessage(
            language === 'en'
              ? `+100 XP • Discovered: ${orb.labelEn}`
              : `+100 XP • Đã khám phá: ${orb.labelVi}`
          );
          window.setTimeout(() => setTravelMessage(''), 2400);
        }
      }

      // Exact 1.0-Second Dash Decay: Filter points older than 1000ms
      trailRef.current = trailRef.current.filter((p) => currentTime - p.time <= 1000);

      // Proximity Check to All Zones
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
                ? `Docking at ${found.titleEn}`
                : `Đang cập bến ${found.titleVi}`
            );
          }
        } else if (!isWarping) {
          camera.targetZoom = 1.0;
          setTravelMessage('');
        }
      }

      // Smooth Camera Tracking
      const camLerp = isWarping ? 0.12 : 0.08;
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
      // RENDER PASS 1: Clear & Volumetric Atmospheric Lighting
      // ------------------------------------------------------------------------
      ctx.clearRect(0, 0, width, height);

      // Deep Obsidian base
      ctx.fillStyle = '#090D16';
      ctx.fillRect(0, 0, width, height);

      // Volumetric Core Sector Light Cone
      const coreScreen = toScreen(0, 0);
      const coreGrad = ctx.createRadialGradient(
        coreScreen.x,
        coreScreen.y,
        30,
        coreScreen.x,
        coreScreen.y,
        Math.max(width, height) * 0.65
      );
      coreGrad.addColorStop(0, `rgba(139, 92, 246, ${0.08 * audioPulse})`);
      coreGrad.addColorStop(0.5, 'rgba(19, 27, 46, 0.55)');
      coreGrad.addColorStop(1, 'rgba(9, 13, 22, 0)');
      ctx.fillStyle = coreGrad;
      ctx.fillRect(0, 0, width, height);

      // Volumetric Shipyard Orbital Light Cone
      const shipyardCoords = ZONE_WORLD_COORDS.shipyard;
      const shipyardScreen = toScreen(shipyardCoords.wx, shipyardCoords.wy);
      const shipGrad = ctx.createRadialGradient(
        shipyardScreen.x,
        shipyardScreen.y,
        20,
        shipyardScreen.x,
        shipyardScreen.y,
        220 * camera.zoom
      );
      shipGrad.addColorStop(0, `rgba(139, 92, 246, ${0.12 * audioPulse})`);
      shipGrad.addColorStop(0.6, 'rgba(19, 27, 46, 0.4)');
      shipGrad.addColorStop(1, 'rgba(9, 13, 22, 0)');
      ctx.fillStyle = shipGrad;
      ctx.fillRect(0, 0, width, height);

      // ------------------------------------------------------------------------
      // RENDER PASS 2: Starfield & Hyperspace Warp Streaks
      // ------------------------------------------------------------------------
      ctx.save();
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        const sScreen = toScreen(s.wx, s.wy, s.z);

        if (sScreen.x < -20 || sScreen.x > width + 20 || sScreen.y < -20 || sScreen.y > height + 20) {
          continue;
        }

        if (isWarping) {
          // Elongated warp streaks
          const streakLen = 25 * camera.zoom;
          ctx.beginPath();
          ctx.moveTo(sScreen.x, sScreen.y);
          ctx.lineTo(sScreen.x - (player.vx || 2) * streakLen * 0.08, sScreen.y - (player.vy || 2) * streakLen * 0.08);
          ctx.strokeStyle = 'rgba(139, 92, 246, 0.7)';
          ctx.lineWidth = 1.8;
          ctx.stroke();
        } else {
          // Ambient twinkling star mote
          ctx.beginPath();
          ctx.arc(sScreen.x, sScreen.y, s.size * (audioPulse > 1.1 ? 1.2 : 1), 0, Math.PI * 2);
          ctx.fillStyle = i % 3 === 0 ? '#8B5CF6' : '#94A3B8';
          ctx.globalAlpha = Math.max(0.15, Math.min(0.8, s.alpha * audioPulse));
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1.0;
      ctx.restore();

      // ------------------------------------------------------------------------
      // RENDER PASS 3: Core Sector Glowing Isometric Tile Grid
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
            'rgba(30, 41, 59, 0.45)',
            1
          );
        }
      }
      ctx.restore();

      // ------------------------------------------------------------------------
      // RENDER PASS 4 & 5: 6 Radial Energy Conduits & Live Data Packets
      // ------------------------------------------------------------------------
      const nexusScreen = toScreen(0, 0);
      ctx.save();
      for (let zi = 0; zi < GAME_ZONES.length; zi++) {
        const z = GAME_ZONES[zi];
        const coords = ZONE_WORLD_COORDS[z.id];
        const zScreen = toScreen(coords.wx, coords.wy);
        const accent = z.glowColor || '#8B5CF6';

        ctx.strokeStyle = `${accent}44`;
        ctx.lineWidth = 1.6;
        ctx.setLineDash([7, 7]);
        ctx.beginPath();
        ctx.moveTo(nexusScreen.x, nexusScreen.y);
        ctx.lineTo(zScreen.x, zScreen.y);
        ctx.stroke();
        ctx.setLineDash([]);

        // Animated glowing data packet traveling along each conduit
        const pulseT = ((currentTime * 0.00038 + zi * 0.17) % 1);
        const px = coords.wx * pulseT;
        const py = coords.wy * pulseT;
        const pScreen = toScreen(px, py, 3);
        ctx.fillStyle = accent;
        ctx.shadowColor = accent;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(pScreen.x, pScreen.y, 3.2 * camera.zoom, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      ctx.restore();

      // Central Nexus Core
      drawIsoDiamond(0, 0, 18, 0, 'rgba(229, 169, 60, 0.09)', '#E5A93C', 1.6);
      ctx.save();
      ctx.font = 'bold 10px monospace';
      ctx.fillStyle = '#E5A93C';
      ctx.textAlign = 'center';
      ctx.fillText('NEXUS CORE', nexusScreen.x, nexusScreen.y + 4);
      ctx.restore();

      // ------------------------------------------------------------------------
      // RENDER PASS 6: Architectural Hubs & Outposts
      // ------------------------------------------------------------------------
      for (const zone of GAME_ZONES) {
        const coords = ZONE_WORLD_COORDS[zone.id];
        const accent = zone.glowColor || '#8B5CF6';
        const isHovered = nearZone === zone.id;
        const isPlanetAlpha = zone.id === 'shipyard';
        const isPlanetBeta = zone.id === 'arcade';
        const isDistantPlanet = isPlanetAlpha || isPlanetBeta;
        const pulse = Math.sin(currentTime * 0.003 + coords.wx) * 0.15 + 0.85;

        // Base Plinth Shadow
        const baseRadius = isDistantPlanet ? 32 : 24;
        drawIsoDiamond(coords.wx, coords.wy, baseRadius, 0, 'rgba(9, 13, 22, 0.8)', undefined);

        // Lower Plinth Tier
        drawIsoDiamond(
          coords.wx,
          coords.wy,
          baseRadius - 1,
          4,
          'rgba(19, 27, 46, 0.9)',
          `${accent}55`,
          1
        );

        // Raised Glassmorphic Tier
        const plinthFill = isHovered ? `${accent}40` : `${accent}18`;
        const plinthBorder = isHovered ? accent : `${accent}88`;

        drawIsoDiamond(coords.wx, coords.wy, baseRadius - 3, 10, plinthFill, plinthBorder, isHovered ? 2 : 1);

        // Glowing Concentric Ring on Platform
        const topScreen = toScreen(coords.wx, coords.wy, 10);
        ctx.save();
        ctx.beginPath();
        ctx.arc(topScreen.x, topScreen.y, (isDistantPlanet ? 22 : 16) * camera.zoom * pulse, 0, Math.PI * 2);
        ctx.strokeStyle = isHovered ? `${accent}DD` : `${accent}55`;
        ctx.lineWidth = isHovered ? 2 : 1;
        ctx.stroke();

        // Planet Alpha: Rotating Orbital Defense Ring
        if (isPlanetAlpha) {
          const orbitAngle = currentTime * 0.002;
          ctx.beginPath();
          ctx.ellipse(topScreen.x, topScreen.y, 34 * camera.zoom, 14 * camera.zoom, orbitAngle, 0, Math.PI * 2);
          ctx.strokeStyle = `${accent}88`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Planet Beta: Retro Arcade Planetary Halo Ring
        if (isPlanetBeta) {
          const orbitAngle = -currentTime * 0.0018;
          ctx.beginPath();
          ctx.ellipse(topScreen.x, topScreen.y, 36 * camera.zoom, 15 * camera.zoom, orbitAngle, 0, Math.PI * 2);
          ctx.strokeStyle = `${accent}99`;
          ctx.lineWidth = 1.5;
          ctx.setLineDash([4, 4]);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // Corner HUD Brackets
        const bracketSize = (isDistantPlanet ? 18 : 14) * camera.zoom;
        ctx.strokeStyle = isHovered ? accent : `${accent}AA`;
        ctx.lineWidth = 1.5;

        // Top-left
        ctx.beginPath();
        ctx.moveTo(topScreen.x - bracketSize, topScreen.y - bracketSize + 4);
        ctx.lineTo(topScreen.x - bracketSize, topScreen.y - bracketSize);
        ctx.lineTo(topScreen.x - bracketSize + 4, topScreen.y - bracketSize);
        ctx.stroke();

        // Top-right
        ctx.beginPath();
        ctx.moveTo(topScreen.x + bracketSize - 4, topScreen.y - bracketSize);
        ctx.lineTo(topScreen.x + bracketSize, topScreen.y - bracketSize);
        ctx.lineTo(topScreen.x + bracketSize, topScreen.y - bracketSize + 4);
        ctx.stroke();

        // Bottom-left
        ctx.beginPath();
        ctx.moveTo(topScreen.x - bracketSize, topScreen.y + bracketSize - 4);
        ctx.lineTo(topScreen.x - bracketSize, topScreen.y + bracketSize);
        ctx.lineTo(topScreen.x - bracketSize + 4, topScreen.y + bracketSize);
        ctx.stroke();

        // Bottom-right
        ctx.beginPath();
        ctx.moveTo(topScreen.x + bracketSize - 4, topScreen.y + bracketSize);
        ctx.lineTo(topScreen.x + bracketSize, topScreen.y + bracketSize);
        ctx.lineTo(topScreen.x + bracketSize, topScreen.y + bracketSize - 4);
        ctx.stroke();

        // Station Typography Label
        ctx.font = isHovered ? 'bold 12px sans-serif' : '11px sans-serif';
        ctx.fillStyle = isHovered ? '#F8FAFC' : '#CBD5E1';
        ctx.textAlign = 'center';
        ctx.fillText(
          language === 'en' ? zone.titleEn : zone.titleVi,
          topScreen.x,
          topScreen.y + (isDistantPlanet ? 34 : 28) * camera.zoom
        );

        // Proximity Activation HUD Prompt
        if (isHovered) {
          ctx.save();
          const badgeY = topScreen.y - 36 * camera.zoom;
          ctx.fillStyle = accent;
          ctx.font = 'bold 10px monospace';
          ctx.shadowColor = accent;
          ctx.shadowBlur = 8;
          ctx.fillText(
            language === 'en' ? '▶ PRESS [E] OR CLICK TO DOCK' : '▶ NHẤN [E] HOẶC CLICK ĐỂ CẬP BẾN',
            topScreen.x,
            badgeY
          );
          ctx.restore();
        }
        ctx.restore();
      }

      // ------------------------------------------------------------------------
      // RENDER PASS 7: Clean 1.0-Second Decaying Glowing Energy Dash Trail
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

          // Strictly vanishes at 1000ms
          const lifeProgress = Math.max(0, Math.min(1, 1 - age / 1000));
          if (lifeProgress <= 0) continue;

          const s1 = toScreen(p1.wx, p1.wy, 6);
          const s2 = toScreen(p2.wx, p2.wy, 6);

          ctx.beginPath();
          ctx.moveTo(s1.x, s1.y);
          ctx.lineTo(s2.x, s2.y);
          ctx.lineWidth = 3.5 * lifeProgress;
          ctx.strokeStyle = `rgba(139, 92, 246, ${lifeProgress * 0.9})`;
          ctx.shadowColor = '#8B5CF6';
          ctx.shadowBlur = 10 * lifeProgress;
          ctx.stroke();
        }
        ctx.restore();
      }

      // ------------------------------------------------------------------------
      // RENDER PASS 7.5: Collectible Skill Orbs & 5 Animated NPC Zone Guides
      // ------------------------------------------------------------------------
      const tSec = currentTime * 0.001;
      for (const orb of SKILL_ORBS) {
        if (collectedOrbsRef.current.includes(orb.id)) continue;
        const bob = Math.sin(tSec * 3.5 + orb.wx * 0.1) * 3;
        const orbPos = toScreen(orb.wx, orb.wy, 10 + bob);
        ctx.save();
        ctx.fillStyle = orb.color;
        ctx.shadowColor = orb.color;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(orbPos.x, orbPos.y, 6.5 * camera.zoom, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#F8FAFC';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.font = '600 10px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = '#E2E8F0';
        ctx.textAlign = 'center';
        ctx.fillText(language === 'en' ? orb.labelEn : orb.labelVi, orbPos.x, orbPos.y + 15 * camera.zoom);
        ctx.restore();
      }

      for (const zone of GAME_ZONES) {
        const coords = ZONE_WORLD_COORDS[zone.id];
        const monumentPos = toScreen(coords.wx, coords.wy, 10);
        drawZoneMonument(ctx, {
          x: monumentPos.x,
          y: monumentPos.y,
          zoneId: zone.id,
          accent: zone.glowColor || '#8B5CF6',
          scale: Math.max(0.8, camera.zoom * 0.95),
          time: tSec,
        });
        if (nearZone === zone.id) {
          drawSpeechBubble(
            ctx,
            monumentPos.x,
            monumentPos.y,
            language === 'en' ? zone.subtitleEn : zone.subtitleVi,
            zone.glowColor || '#8B5CF6'
          );
        }
      }

      // ------------------------------------------------------------------------
      // RENDER PASS 8: Animated Stickman Explorer Avatar
      // ------------------------------------------------------------------------
      const playerScreen = toScreen(player.wx, player.wy, 0);
      const speedVal = Math.hypot(player.vx, player.vy);
      const playerSpeedRatio = isWarping ? 1 : Math.min(1, speedVal / 140);
      const playerFacing = Math.cos(player.angle) >= 0 ? 1 : -1;

      drawStickman(ctx, {
        x: playerScreen.x,
        y: playerScreen.y,
        facing: playerFacing,
        walkPhase: walkPhaseRef.current,
        speedRatio: playerSpeedRatio,
        accent: '#E5A93C',
        scale: Math.max(0.85, camera.zoom * 0.95),
        label: language === 'en' ? 'Explorer (You)' : 'Bạn',
        time: tSec,
      });

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
      className="relative w-full h-[calc(100vh-56px)] bg-[#090D16] select-none touch-none overflow-hidden"
    >
      {/* Interactive 2.5D Star System Canvas */}
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        onTouchStart={handleTouchStart}
        className="w-full h-full cursor-crosshair block"
        aria-label="2.5D Star System Map Canvas"
      />

      {/* Top HUD Overlay: Controls & Warp Status */}
      <div className="absolute top-2 sm:top-4 left-2 right-2 sm:left-4 sm:right-4 flex flex-wrap items-center justify-between pointer-events-none gap-2 z-30">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-[#131B2E]/90 border border-[#1E293B] backdrop-blur text-[11px] sm:text-xs font-mono text-[#F8FAFC]">
            <Crosshair className="w-3.5 h-3.5 text-[#8B5CF6] shrink-0" />
            {controlMode === 'touch' ? (
              <span>
                {language === 'en'
                  ? 'TOUCH FLIGHT: DRAG JOYSTICK TO FLY'
                  : 'ĐIỀU KHIỂN CHẠM: KÉO CẦN ĐỂ BAY'}
              </span>
            ) : (
            <span className="hidden sm:inline">
              {language === 'en'
                ? 'BROWSER MODE: WASD / ARROWS TO FLY · [E] ENTER'
                : 'CHẾ ĐỘ TRÌNH DUYỆT: WASD ĐỂ BAY · [E] VÀO TRẠM'}
            </span>
          )}
          {controlMode === 'keyboard' && (
            <span className="sm:hidden">
              {language === 'en' ? 'WASD / ARROWS' : 'PHÍM WASD'}
            </span>
          )}
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 sm:py-1.5 rounded-lg bg-[#131B2E]/90 border border-[#E5A93C]/40 backdrop-blur text-[11px] sm:text-xs font-mono text-[#E5A93C]">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>
              {language === 'en'
                ? `Skills ${collectedOrbs.length}/${SKILL_ORBS.length} · ${collectedOrbs.length * 100} XP`
                : `Kỹ năng ${collectedOrbs.length}/${SKILL_ORBS.length} · ${collectedOrbs.length * 100} XP`}
            </span>
          </div>
        </div>

        {/* Controls Switcher Badge (Auto-Detected with Manual Override) */}
        <div className="flex items-center gap-1 bg-[#131B2E]/90 border border-[#1E293B] rounded-lg p-0.5 pointer-events-auto">
          <button
            onClick={() => {
              setControlMode('touch');
              sound.playTerminalClick();
            }}
            className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
              controlMode === 'touch'
                ? 'bg-[#8B5CF6] text-white font-bold shadow-sm'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
            title={language === 'en' ? 'Switch to Mobile/Tablet Touch Flight Controls' : 'Chuyển sang điều khiển cảm ứng'}
          >
            {language === 'en' ? 'Touch Stick' : 'Cần Ảo'}
          </button>
          <button
            onClick={() => {
              setControlMode('keyboard');
              sound.playTerminalClick();
            }}
            className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
              controlMode === 'keyboard'
                ? 'bg-[#8B5CF6] text-white font-bold shadow-sm'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
            title={language === 'en' ? 'Switch to Keyboard WASD Flight Controls' : 'Chuyển sang phím WASD'}
          >
            WASD
          </button>
        </div>

        {isWarpingUi ? (
          <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg bg-[#8B5CF6] text-white text-[11px] sm:text-xs font-mono font-bold backdrop-blur animate-pulse shadow-lg shadow-violet-500/40 shrink-0">
            <Zap className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">{language === 'en' ? 'WARP JUMP ENGAGED' : 'ĐANG NHẢY BƯỚC KHÔNG GIAN'}</span>
            <span className="sm:hidden">WARP...</span>
          </div>
        ) : nearZone ? (
          <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-[#8B5CF6]/20 border border-[#8B5CF6]/50 text-[11px] sm:text-xs font-mono text-[#F8FAFC] backdrop-blur animate-pulse shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#8B5CF6] shrink-0" />
            <span>
              {language === 'en'
                ? (controlMode === 'touch' ? 'TAP ACTION TO ENTER' : 'PRESS [E] TO ENTER')
                : (controlMode === 'touch' ? 'CHẠM NÚT ĐỂ VÀO' : 'NHẤN [E] ĐỂ VÀO')}
            </span>
          </div>
        ) : null}
      </div>

      {/* Dynamic Travel Notification */}
      {travelMessage && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 pointer-events-none px-3.5 py-1 rounded bg-[#131B2E]/95 border border-[#8B5CF6]/40 text-xs text-[#8B5CF6] font-mono shadow-xl z-20">
          {travelMessage}
        </div>
      )}

      {/* MOBILE / TABLET TOUCH CONTROL DECK (Virtual Analog Joystick + Action Button) */}
      {controlMode === 'touch' && (
        <div className="absolute bottom-20 sm:bottom-6 left-1/2 sm:left-[56%] xl:left-1/2 -translate-x-1/2 z-30 flex items-center justify-center gap-14 sm:gap-20 pointer-events-none">
          {/* Left Virtual Analog Joystick */}
          <div
            ref={joystickBaseRef}
            onTouchStart={handleJoystickTouchStart}
            onTouchMove={handleJoystickTouchMove}
            onTouchEnd={handleJoystickTouchEnd}
            onTouchCancel={handleJoystickTouchEnd}
            onMouseDown={handleJoystickMouseDown}
            className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-[#8B5CF6]/60 bg-[#131B2E]/85 backdrop-blur-md flex items-center justify-center shadow-2xl shadow-violet-500/25 pointer-events-auto touch-none select-none active:border-[#8B5CF6]"
            aria-label="Flight Joystick"
          >
            {/* Crosshair guide lines */}
            <div className="absolute inset-x-3 top-1/2 h-px bg-[#8B5CF6]/20 pointer-events-none" />
            <div className="absolute inset-y-3 left-1/2 w-px bg-[#8B5CF6]/20 pointer-events-none" />

            {/* Cardinal direction labels */}
            <span className="absolute top-1 text-[8px] font-mono text-[#94A3B8]/60 pointer-events-none">▲</span>
            <span className="absolute bottom-1 text-[8px] font-mono text-[#94A3B8]/60 pointer-events-none">▼</span>
            <span className="absolute left-1 text-[8px] font-mono text-[#94A3B8]/60 pointer-events-none">◀</span>
            <span className="absolute right-1 text-[8px] font-mono text-[#94A3B8]/60 pointer-events-none">▶</span>

            {/* Draggable Analog Stick Knob */}
            <div
              style={{
                transform: `translate(${knobOffset.x}px, ${knobOffset.y}px)`
              }}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#8B5CF6] border-2 border-white shadow-[0_0_15px_#8B5CF6] pointer-events-none flex items-center justify-center transition-transform duration-75"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-white/80" />
            </div>
          </div>

          {/* Right Tactile Action Button */}
          <button
            onClick={handleActionButton}
            onTouchStart={handleActionButton}
            className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex flex-col items-center justify-center font-mono font-bold transition-all duration-150 active:scale-90 shadow-2xl pointer-events-auto select-none ${
              nearZone
                ? 'bg-[#8B5CF6] border-2 border-white text-white shadow-[0_0_25px_#8B5CF6] animate-pulse ring-4 ring-[#8B5CF6]/40'
                : 'bg-[#131B2E]/90 border border-[#8B5CF6]/50 text-[#8B5CF6] hover:bg-[#1E293B]'
            }`}
            aria-label={nearZone ? 'Enter Orbital Station' : 'Warp Thruster Boost'}
          >
            <Zap className={`w-5 h-5 ${nearZone ? 'fill-current' : ''}`} />
            <span className="text-[10px] mt-0.5 leading-tight">
              {nearZone
                ? (language === 'en' ? 'ENTER' : 'VÀO')
                : (language === 'en' ? 'BOOST' : 'TĂNG TỐC')}
            </span>
            <span className="text-[8px] opacity-75 font-mono">
              {nearZone ? '[E]' : '2X'}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};
