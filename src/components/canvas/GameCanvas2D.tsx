import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameZoneId } from '../../types/game';
import { GAME_ZONES } from '../../constants/gameData';
import { sound } from '../../constants/soundEffects';
import { lofiAudioEngine } from '../../utils/lofiAudioEngine';
import { Video, Gamepad2, GraduationCap, Headphones, Crosshair, Orbit, Zap } from 'lucide-react';

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

// Star System Coordinates: Core Sector + Distant Orbital Planets Alpha & Beta
const ZONE_WORLD_COORDS: Record<GameZoneId, { wx: number; wy: number }> = {
  vault: { wx: -60, wy: -40 },     // Core Sector NW: Motion & Video Suite
  arcade: { wx: 165, wy: 0 },      // Distant Planet Beta: 10-Game Retro Arcade Planet
  academy: { wx: -60, wy: 50 },    // Core Sector SW: Career & Education Tower
  lounge: { wx: 50, wy: 50 },      // Core Sector SE: Lo-Fi Lounge & Contact Hub
  shipyard: { wx: 0, wy: -175 }    // Distant Planet Alpha: AntiGravity Orbital Shipyard
};

export const GameCanvas2D: React.FC<GameCanvas2DProps> = ({
  activeZone,
  onSelectZone,
  language
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const joystickBaseRef = useRef<HTMLDivElement>(null);

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

  // Long-range warp jump state
  const warpRef = useRef<{ isWarping: boolean; warpProgress: number; warpStartTime: number }>({
    isWarping: false,
    warpProgress: 0,
    warpStartTime: 0
  });

  const keysPressed = useRef<{ [key: string]: boolean }>({});
  const [nearZone, setNearZone] = useState<GameZoneId | null>('vault');
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

  // Sync when activeZone is selected from external docks
  useEffect(() => {
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

    // Clamp to map bounds (covers deep space northern & eastern sectors)
    const clampedWx = Math.max(-140, Math.min(210, world.wx));
    const clampedWy = Math.max(-220, Math.min(140, world.wy));

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

      // Update Player World Position with EXPANDED star system boundary
      player.wx = Math.max(-140, Math.min(210, player.wx + player.vx * dt));
      player.wy = Math.max(-220, Math.min(140, player.wy + player.vy * dt));

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
      // RENDER PASS 4: Glowing Flight Corridors to Distant Planets Alpha & Beta
      // ------------------------------------------------------------------------
      ctx.save();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.35)';
      ctx.setLineDash([8, 8]);

      // Hyperlane 1: Nexus to Distant Planet Alpha (Shipyard at 0, -175)
      const nexusScreen = toScreen(0, 0);
      ctx.beginPath();
      ctx.moveTo(nexusScreen.x, nexusScreen.y);
      ctx.lineTo(shipyardScreen.x, shipyardScreen.y);
      ctx.stroke();

      // Hyperlane 2: Nexus to Distant Planet Beta (Arcade at 165, 0)
      const arcadeCoords = ZONE_WORLD_COORDS.arcade;
      const arcadeScreen = toScreen(arcadeCoords.wx, arcadeCoords.wy);
      ctx.beginPath();
      ctx.moveTo(nexusScreen.x, nexusScreen.y);
      ctx.lineTo(arcadeScreen.x, arcadeScreen.y);
      ctx.stroke();
      ctx.setLineDash([]);

      // Flight corridor beacon markers along Planet Alpha highway
      for (let t = 0.25; t <= 0.75; t += 0.25) {
        const beaconWx = 0 * (1 - t) + shipyardCoords.wx * t;
        const beaconWy = 0 * (1 - t) + shipyardCoords.wy * t;
        const bScreen = toScreen(beaconWx, beaconWy);
        ctx.beginPath();
        ctx.arc(bScreen.x, bScreen.y, 3 * camera.zoom, 0, Math.PI * 2);
        ctx.fillStyle = '#8B5CF6';
        ctx.shadowColor = '#8B5CF6';
        ctx.shadowBlur = 6;
        ctx.fill();
      }

      // Flight corridor beacon markers along Planet Beta highway
      for (let t = 0.25; t <= 0.75; t += 0.25) {
        const beaconWx = 0 * (1 - t) + arcadeCoords.wx * t;
        const beaconWy = 0 * (1 - t) + arcadeCoords.wy * t;
        const bScreen = toScreen(beaconWx, beaconWy);
        ctx.beginPath();
        ctx.arc(bScreen.x, bScreen.y, 3 * camera.zoom, 0, Math.PI * 2);
        ctx.fillStyle = '#8B5CF6';
        ctx.shadowColor = '#8B5CF6';
        ctx.shadowBlur = 6;
        ctx.fill();
      }
      ctx.restore();

      // ------------------------------------------------------------------------
      // RENDER PASS 5: Core Sector Circuit Triangle Connections
      // ------------------------------------------------------------------------
      ctx.save();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.25)';
      ctx.setLineDash([6, 6]);

      const connections: [GameZoneId, GameZoneId][] = [
        ['vault', 'academy'],
        ['academy', 'lounge'],
        ['lounge', 'vault']
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

      // Central Nexus Core
      drawIsoDiamond(0, 0, 16, 0, 'rgba(139, 92, 246, 0.08)', '#8B5CF6', 1.5);
      ctx.save();
      ctx.font = '9px monospace';
      ctx.fillStyle = '#94A3B8';
      ctx.textAlign = 'center';
      ctx.fillText('NEXUS CORE', nexusScreen.x, nexusScreen.y + 4);
      ctx.restore();

      // ------------------------------------------------------------------------
      // RENDER PASS 6: Architectural Hubs & Outposts
      // ------------------------------------------------------------------------
      for (const zone of GAME_ZONES) {
        const coords = ZONE_WORLD_COORDS[zone.id];
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
          'rgba(30, 41, 59, 0.8)',
          1
        );

        // Raised Glassmorphic Tier
        const plinthFill = isHovered
          ? 'rgba(139, 92, 246, 0.24)'
          : isDistantPlanet
          ? 'rgba(19, 27, 46, 0.95)'
          : 'rgba(19, 27, 46, 0.85)';
        const plinthBorder = isHovered
          ? '#8B5CF6'
          : isDistantPlanet
          ? 'rgba(139, 92, 246, 0.65)'
          : 'rgba(139, 92, 246, 0.4)';

        drawIsoDiamond(coords.wx, coords.wy, baseRadius - 3, 10, plinthFill, plinthBorder, isHovered ? 2 : 1);

        // Glowing Concentric Ring on Platform
        const topScreen = toScreen(coords.wx, coords.wy, 10);
        ctx.save();
        ctx.beginPath();
        ctx.arc(topScreen.x, topScreen.y, (isDistantPlanet ? 22 : 16) * camera.zoom * pulse, 0, Math.PI * 2);
        ctx.strokeStyle = isHovered ? 'rgba(139, 92, 246, 0.85)' : 'rgba(139, 92, 246, 0.3)';
        ctx.lineWidth = isHovered ? 2 : 1;
        ctx.stroke();

        // Planet Alpha: Rotating Orbital Defense Ring
        if (isPlanetAlpha) {
          const orbitAngle = currentTime * 0.002;
          ctx.beginPath();
          ctx.ellipse(topScreen.x, topScreen.y, 34 * camera.zoom, 14 * camera.zoom, orbitAngle, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(139, 92, 246, 0.5)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Planet Beta: Retro Arcade Planetary Halo Ring
        if (isPlanetBeta) {
          const orbitAngle = -currentTime * 0.0018;
          ctx.beginPath();
          ctx.ellipse(topScreen.x, topScreen.y, 36 * camera.zoom, 15 * camera.zoom, orbitAngle, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(139, 92, 246, 0.6)';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([4, 4]);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // Corner HUD Brackets
        const bracketSize = (isDistantPlanet ? 18 : 14) * camera.zoom;
        ctx.strokeStyle = isHovered ? '#8B5CF6' : '#94A3B8';
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
        ctx.fillStyle = isHovered ? '#F8FAFC' : '#94A3B8';
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
          ctx.fillStyle = '#8B5CF6';
          ctx.font = 'bold 10px monospace';
          ctx.shadowColor = '#8B5CF6';
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
      // RENDER PASS 8: Cyberpunk Nano-Drone Avatar
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
      if (isMoving || isWarping) {
        ctx.beginPath();
        ctx.arc(0, 8, (isWarping ? 10 : 4) + Math.random() * 3, 0, Math.PI * 2);
        ctx.fillStyle = '#8B5CF6';
        ctx.shadowColor = '#8B5CF6';
        ctx.shadowBlur = isWarping ? 20 : 12;
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
      className="relative w-full h-[360px] sm:h-[460px] md:h-[540px] lg:h-[620px] rounded-2xl overflow-hidden border border-[#1E293B] bg-[#090D16] select-none touch-none"
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
        <div className="absolute inset-x-0 bottom-14 sm:bottom-16 px-4 flex items-end justify-between pointer-events-none z-20">
          {/* Left Virtual Analog Joystick */}
          <div
            ref={joystickBaseRef}
            onTouchStart={handleJoystickTouchStart}
            onTouchMove={handleJoystickTouchMove}
            onTouchEnd={handleJoystickTouchEnd}
            onTouchCancel={handleJoystickTouchEnd}
            onMouseDown={handleJoystickMouseDown}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-[#8B5CF6]/60 bg-[#131B2E]/85 backdrop-blur-md relative flex items-center justify-center shadow-2xl shadow-violet-500/25 pointer-events-auto touch-none select-none active:border-[#8B5CF6]"
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

      {/* Bottom Fast-Travel Star System Bar */}
      <div className="absolute bottom-2 sm:bottom-3 left-2 right-2 sm:left-4 sm:right-4 flex items-center justify-start sm:justify-center gap-1.5 overflow-x-auto scrollbar-none pointer-events-auto py-1 z-10">
        {GAME_ZONES.map((zone) => {
          const isCurrent = activeZone === zone.id;
          const isClose = nearZone === zone.id;
          const isShipyard = zone.id === 'shipyard';

          return (
            <button
              key={zone.id}
              onClick={() => {
                const coords = ZONE_WORLD_COORDS[zone.id];
                triggerWarpJump(coords.wx, coords.wy, zone.id);
                onSelectZone(zone.id, true);
              }}
              className={`shrink-0 flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-medium transition-all ${
                isCurrent || isClose
                  ? 'bg-[#8B5CF6] text-white shadow-lg shadow-violet-500/20 border border-violet-400'
                  : isShipyard
                  ? 'bg-[#090D16]/90 text-[#8B5CF6] hover:bg-[#1E293B] border border-[#8B5CF6]/40'
                  : 'bg-[#131B2E]/90 text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E293B] border border-[#1E293B]'
              }`}
            >
              {zone.id === 'vault' && <Video className="w-3.5 h-3.5" />}
              {zone.id === 'arcade' && <Gamepad2 className="w-3.5 h-3.5" />}
              {zone.id === 'academy' && <GraduationCap className="w-3.5 h-3.5" />}
              {zone.id === 'lounge' && <Headphones className="w-3.5 h-3.5" />}
              {zone.id === 'shipyard' && <Orbit className="w-3.5 h-3.5 text-violet-300" />}
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
