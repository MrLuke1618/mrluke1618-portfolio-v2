# 2.5D Layered Isometric World & Motion Video Suite

A high-performance, depth-rich 2.5D isometric world environment featuring pure layered canvas/vector mathematics (zero heavy 3D meshes), a 1.0-second decaying glowing energy dash trail, strict 5-color palette lockdown, and a dedicated flagship "Motion & Video Suite" zone with interactive kinetic typography and automated video pipeline orchestration.

### User Review & Critical Decisions

> [!IMPORTANT]
> **Key Architectural Direction**:
> - **Zero Heavy 3D Meshes**: We are replacing all Three.js 3D mesh instancing with a lightweight, 60fps 2.5D Isometric Canvas Engine using genuine isometric projection math (`isoX = (x - y) * cos(30°)`, `isoY = (x + y) * sin(30°)`), multi-layer parallax depth, and floating glassmorphic architectural station footprints.
> - **1.0-Second Dash Decay**: The nano-drone thruster trail maintains timestamped segments rendered as a glowing violet gradient vector that completely fades out at $t = 1000\text{ms}$ with zero lingering artifacts.
> - **Flagship "Motion & Video Suite"**: Zone 1 is upgraded to the primary showcase, housing the Kinetic Motion Typography sandbox, the visual breakdown of the Python + Hyperframes + Concat automated pipeline, and the multi-track timeline simulator.
> - **Strict 5-Color System**: Obsidian Black (`#090D16`), Muted Navy Charcoal (`#131B2E`), Electric Violet (`#8B5CF6`), Crisp White (`#F8FAFC`), and Slate Gray (`#94A3B8`).

---

### 1. Overview & Core Concept

- **What It Does**: Replaces flat static cards and heavy 3D meshes with an authentic 2.5D isometric environment where visitors pilot a glowing nano-drone or click station coordinates to travel across a floating digital studio. Approaching or selecting any of the four core stations triggers an immersive modal HUD.
- **Target Audience & Value**: Video production directors, tech recruiters, engineering managers, and clients seeking proof of world-class video automation (Python/Hyperframes/Concat) and full-stack software craftsmanship.
- **Core Distinction**: Reader Mode delivers a clean, editorial layout for recruiters; Game Mode delivers a living, interactive 2.5D isometric world with cinematic focus and audio-responsive ambience.

---

### 2. User Experience & Visual Design

#### A. The 2.5D Isometric World Canvas
- **Multi-Layer Parallax Scrolling**:
  - *Layer 0 (Deep Background)*: Ambient floating particles and faint isometric wireframe grid lines drifting at $0.3\times$ speed.
  - *Layer 1 (Isometric Ground Plane)*: Layered isometric diamond tiles with subtle glowing circuit lines linking the stations.
  - *Layer 2 (Architectural Station Footprints)*: Glassmorphic station platforms with glowing isometric rings, elevation shadows, and floating HUD corner brackets.
  - *Layer 3 (Foreground Avatar & Thruster Trail)*: Cyberpunk nano-drone sprite with directional tilt, altitude bobbing ($y = \sin(t) \cdot 3\text{px}$), and a crisp energy dash trail.
- **1-Second Energy Dash Trail**:
  - The movement engine records trail vertices `{ x, y, timestamp }`.
  - On every animation frame, points older than 1000ms are discarded.
  - Opacity is computed as $\alpha = 1 - \frac{t_{\text{now}} - t_{\text{point}}}{1000}$, creating a luminous Electric Violet laser dash that vanishes in exactly 1.0 second.

#### B. Dedicated "Motion & Video Suite" Zone
- **Interactive Kinetic Typography Lab**: Live spring-physics typography previews with selectable animation modes (Snap Drift, Spring Elastic, Glitch Shimmer, Typewriter Beat) and speed controls.
- **Automated Video Pipeline Breakdown**: Visual flowchart illustrating the automated YouTube pipeline:
  1. *Prompt/Script Intake* (Markdown / Structured JSON)
  2. *Hyperframes Synthesis* (Automated composition & keyframe generation)
  3. *Python Automation* (Headless orchestration & media caching)
  4. *Concat Stitching & FFmpeg* (Lossless concat, audio sync & multi-aspect rendering)
- **Interactive Video Timeline Simulator**: Multi-track timeline (Video, B-Roll, Audio Beats, Subtitles), draggable scrubber, 9:16 vertical live preview monitor, and live Python code runner logs.

#### C. Strict 5-Color Palette Lockdown
```
┌────────────────────────┬─────────────┬────────────────────────────────────────────┐
│ Color Name             │ Hex Code    │ UI Role                                    │
├────────────────────────┼─────────────┼────────────────────────────────────────────┤
│ Obsidian Black         │ #090D16     │ 60% Dominant canvas & viewport background  │
│ Muted Navy Charcoal    │ #131B2E     │ 30% Structural cards, HUD panels, tiles    │
│ Electric Violet        │ #8B5CF6     │ 10% High-intent accents, glow, active path │
│ Crisp White            │ #F8FAFC     │ Primary typography & focal titles          │
│ Slate Gray             │ #94A3B8     │ Secondary metadata, subtitles, helpers     │
└────────────────────────┴─────────────┴────────────────────────────────────────────┘
```

---

### 3. Key Product Decisions & Trade-Offs

- **2.5D Canvas Projection vs Three.js 3D WebGL**:
  - *Chosen Approach*: Pure HTML5 2D Canvas with mathematical isometric matrix projection.
  - *Why*: Eliminates 3D mesh overhead, prevents GPU stutters, ensures 60fps on mobile and low-power devices, and gives pixel-perfect vector control over glowing paths and HUD brackets.
- **Timestamped Array vs Particle System for Dash Trail**:
  - *Chosen Approach*: Continuous path spline drawn across timestamped coordinates, discarded after $\Delta t \ge 1000\text{ms}$.
  - *Why*: Guarantees a cohesive glowing energy line that moves seamlessly with the drone rather than messy drifting circles.
- **Single Source of Truth for Contact**:
  - *Chosen Approach*: Direct functional `mailto:hoangcaominh27@gmail.com` alongside an interactive direct transmission form with copy-to-clipboard feedback, honoring the user's Vietnamese name **Cao Minh Hoàng**.

---

### 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             App.tsx (Root State)                            │
│    viewMode: 'reader' | 'game' · activeZone · language · performanceTier    │
└──────────────────────┬───────────────────────────────┬──────────────────────┘
                       │                               │
        ┌──────────────┴──────────────┐  ┌─────────────┴─────────────┐
        │        Reader Mode          │  │     2.5D Game Mode        │
        │   (Editorial Portfolio)     │  │  IsometricWorldCanvas.tsx │
        └─────────────────────────────┘  │   - Iso Coordinate Math   │
                                         │   - 1-Sec Dash Trail      │
                                         │   - Parallax Wireframe    │
                                         │   - Proximity HUD Trigger │
                                         └─────────────┬─────────────┘
                                                       │
                                 ┌─────────────────────┴─────────────────────┐
                                 │       Active Zone HUD Modals              │
                                 ├───────────────────────────────────────────┤
                                 │ 1. Motion & Video Suite (Flagship)        │
                                 │    - Kinetic Heading Playground           │
                                 │    - Python + Hyperframes + Concat Flow   │
                                 │    - Video Pipeline Simulator             │
                                 │ 2. Project Showcase & Rust Systems        │
                                 │ 3. Career & Education Tower               │
                                 │ 4. Lo-Fi Lounge & Contact Hub             │
                                 └───────────────────────────────────────────┘
```

#### State & Movement Lifecycle
1. **Input Handlers**: WASD, Arrow keys, or canvas click/touch update `targetPos`.
2. **Kinematic Update Loop**: Avatar velocity interpolates smoothly toward target with deceleration:
   $$v_{x, y} = (\text{target} - \text{current}) \times \text{speed}$$
3. **Trail Buffer**: Every frame, push `{ x: drone.x, y: drone.y, time: performance.now() }`.
4. **Trail Cull & Render**: Filter `t - point.time < 1000`. Render stroke with quadratic curves and alpha gradient.
5. **Proximity Trigger**: When distance to station platform $\le \text{threshold}$, render glowing "PRESS [E] OR CLICK TO ENTER" bracket prompt.
