# Full Bilingual Localization Engine (English & Vietnamese)

Comprehensive architectural plan to deliver 100% complete, authentic bilingual localization across all UI surfaces, interactive lounges, arcade cabinet emulators, and motion video suites—ensuring zero mixed-language states when switching between English and Vietnamese modes.

## User Decisions & Clarifications Summary

- **Translation Style**: Natural tech Vietnamese using clear, modern industry terminology (e.g., video editing, motion design, AI workflows, arcade gaming) rather than stiff or literal mechanical phrasing.
- **Code & CLI Strategy**: Keep code syntax, CLI commands, and raw filenames in standard English/code syntax, but translate all UI explanations, terminal headers, execution logs, and guides into natural Vietnamese.
- **Visual & Brand Constraints**: Adhere strictly to the 5-color palette (`#090D16`, `#131B2E`, `#8B5CF6`, `#F8FAFC`, `#94A3B8`) with zero pill enclosures for static metadata and zero heavy 3D mesh overhead.

---

## 1. Audit Findings: Mixed-Language Hotspots

During systematic codebase auditing, several UI components and data structures were found to exhibit hardcoded English strings or lack corresponding Vietnamese data fields:

1. **`QuestItem` Schema & `QUEST_LOG_DATA` (`src/types/game.ts` & `src/constants/gameData.ts`)**:
   - `QuestItem` lacked `roleVi`, `periodVi`, and `achievementsVi`.
   - In both `CleanReaderView.tsx` and `AcademyTowerZone.tsx`, `quest.achievements` was rendered directly from English strings, leaving all career bullet points in English even when the rest of the page was in Vietnamese.

2. **Editorial Hero & Metrics Strip (`src/components/reader/CleanReaderView.tsx`)**:
   - Subtitle role string: `Video Editor / News Editor / AI Content Creator` (needs Vietnamese counterpart: `Biên tập Video / Biên tập Tin tức / Sáng tạo Nội dung AI`).
   - Metrics labels: `"Lotus Media Subscribers"`, `"MA Honours"`, `"Dublin City University"`, `"Video Post-Production"`, `"Published Tech & Crypto Articles"`.
   - Card read estimates: `"3 min read"`, `"12 min video"`, `"5 min read"` statically defined in English.

3. **10-Game Arcade Hub & In-Game Modals (`src/components/zones/ArcadeProjectZone.tsx` & `src/components/arcade/ArcadeGameModal.tsx`)**:
   - Cabinet top tags: `"COIN OP"`, `"FREE PLAY"`, `"GAMES"`, `"10 / 10 ONLINE"`, `"FILTER GENRE:"`.
   - Modal telemetry & touch controls: `"CIRCUIT BREACH"`, `"SCORE"`, `"BEST"`, `"REBOOT SYSTEM"`, `"LINES"`, `"MOVES"`, `"PAIRS"`, `"ROTATE"`, `"DROP"`, `"ALTITUDE"`, `"ATTEMPTS"`, `"RESTART"`.

4. **Motion & Video Suite Labs (`src/components/video/*`)**:
   - `KineticTypographyLab.tsx`: Preset category badges (`High-Retention`, `Cinematic`, `Experimental`, `Cyberpunk`, `Creative`, `Dynamic`, `Minimalist`), parameter labels (`"EDIT TEST HEADLINE:"`, `"SPEED & TENSION:"`, `"SELECT TYPOGRAPHY PRESET:"`, `"Copy CSS Keyframes"`).
   - `AutomatedWorkflowVisualizer.tsx`: Header labels (`"VERIFIED OPEN-SOURCE BLUEPRINTS:"`, `"PHASE 01"`, `"TARGET ASPECT"`, `"CRF COMPRESSION"`, `"AUDIO DUCKING"`, `"RUNTIME CODE BLUEPRINT"`, `"Copy Code"`, `"Benchmark:"`).
   - `VideoPipelineSimulator.tsx`: Initial console log strings, filter toggles (`"35mm Grain: ON / OFF"`, `"Vignette: ON / OFF"`), and track titles.

5. **Lo-Fi Audio Lounge & Contact Zone (`src/components/zones/LoFiLoungeZone.tsx`)**:
   - Header badge: `"Web Audio Procedural Synthesis"`.
   - Slider titles: `"Vinyl Crackle"`, `"Tempo / BPM"`, `"Reverb / Space"`, `"Master Volume"`.
   - Pomodoro timer: presets (`"25m Focus"`, `"5m Short"`, `"15m Long"`), actions (`"Start"`, `"Pause"`, `"Reset"`), and completion counters (`"Done"`).

6. **AntiGravity Shipyard Outpost (`src/components/zones/AntiGravityShipyardZone.tsx`)**:
   - CLI preset descriptions and simulated execution logs (currently English-only).

---

## 2. Proposed Architecture & Implementation Steps

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Language State ('en' | 'vi')                    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 1. Schema & Data Updates (src/types/game.ts & constants/gameData.ts)  │
│  - QuestItem: roleVi, periodVi, achievementsVi: string[]               │
│  - QUEST_LOG_DATA: 100% natural Vietnamese career achievements         │
│  - Helper: formatReadTime(str, language) -> "3 phút đọc", etc.         │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
          ┌─────────────────────────┼─────────────────────────┐
          ▼                         ▼                         ▼
┌───────────────────┐     ┌───────────────────┐     ┌───────────────────┐
│ CleanReaderView   │     │ Arcade Hub &      │     │ Motion Video &    │
│ & Academy Tower   │     │ 10-Game Modal     │     │ Automated Suite   │
│ - Subtitle roles  │     │ - Coin op / genres│     │ - Typography labs │
│ - Metrics strip   │     │ - In-game HUDs    │     │ - Hyperframes flow│
│ - Quests & links  │     │ - Touch buttons   │     │ - Pipeline logs   │
└───────────────────┘     └───────────────────┘     └───────────────────┘
          │                         │                         │
          └─────────────────────────┼─────────────────────────┘
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ Lo-Fi Audio Lounge & AntiGravity Shipyard & Navigation HUD             │
│ - Audio remix sliders & Pomodoro presets                               │
│ - CLI preset logs & terminal descriptions                              │
│ - Zero mixed-language state across entire app                          │
└────────────────────────────────────────────────────────────────────────┘
```

### Step 1: Types & Data Foundation
- **`src/types/game.ts`**: Update `QuestItem` to support `roleVi?: string; periodVi?: string; achievementsVi?: string[];`.
- **`src/utils/readingTime.ts`**: Add `formatReadTime(estimate: string, language: 'en' | 'vi'): string` to automatically convert `"3 min read"` to `"3 phút đọc"`, `"12 min video"` to `"Video 12 phút"`, etc.
- **`src/constants/gameData.ts`**:
  - Add comprehensive `roleVi`, `periodVi`, and `achievementsVi` arrays for all career milestones (Lotus Media, Web3 Tech Journalist, Freelance Video Producer).

### Step 2: Editorial & Reader Views
- **`src/components/reader/CleanReaderView.tsx`**:
  - Subtitle: `Video Editor / News Editor / AI Content Creator` ⇄ `Biên tập Video / Biên tập Tin tức / Sáng tạo Nội dung AI`.
  - Metrics strip: Translate all labels into Vietnamese when toggled.
  - Category filter tabs: `"All Works"`, `"Web & AI Apps"`, `"Cinematic Video"`, `"Documents & Vaults"`.
  - Render `quest.roleVi`, `quest.periodVi`, and `quest.achievementsVi` seamlessly.
- **`src/components/zones/AcademyTowerZone.tsx`**:
  - Render `quest.roleVi`, `quest.periodVi`, and `quest.achievementsVi` in the expanded quest log.
  - Localize skill tree level chips and stat counters.

### Step 3: Arcade Hub & 10 Game Cabinets
- **`src/components/zones/ArcadeProjectZone.tsx`**:
  - Localize header tags: `"COIN OP"`, `"FREE PLAY"`, `"GAMES"`, `"10 / 10 ONLINE"`, `"FILTER GENRE:"`, `"Category:"`.
- **`src/components/arcade/ArcadeGameModal.tsx`**:
  - Localize in-game telemetry across all 10 games:
    - Score / Best score headers: `SCORE` ⇄ `ĐIỂM`, `BEST` ⇄ `KỶ LỤC`.
    - Game status banners: `CIRCUIT BREACH`, `SYSTEM BREACH`, `MISSION ACCOMPLISHED`, `PAUSED`.
    - Game-specific buttons & overlays:
      * Snake: `Reboot System` ⇄ `Chơi lại`, `Score:` ⇄ `Điểm:`
      * Memory Core: `Moves:` ⇄ `Lượt:`, `Pairs:` ⇄ `Cặp:`, `Memory Restored!` ⇄ `Đã Khôi Phục Bộ Nhớ!`
      * Cyber-Pong: `Player` ⇄ `Người chơi`, `AI Core` ⇄ `Trí tuệ Nhân tạo`, `Wins!` ⇄ `Thắng!`
      * Neon-Tetris: `Lines:` ⇄ `Số hàng:`, `Rotate` ⇄ `Xoay`, `Drop` ⇄ `Thả`, `Matrix Cleared` ⇄ `Đã Phá Hàng`
      * Pixel-Jump: `Altitude:` ⇄ `Độ cao:`, `Falling` ⇄ `Rơi tự do`
      * Cipher-Break: `Attempts:` ⇄ `Lần thử:`, `Decrypted` ⇄ `Đã giải mã`, `Clear` ⇄ `Xóa`
      * Grid-Racer: `Distance:` ⇄ `Khoảng cách:`, `Impact` ⇄ `Va chạm`
      * Reactor-Core: `Core Stability` ⇄ `Độ ổn định lõi`, `Cool Down` ⇄ `Hạ nhiệt`
      * Void-Breaker: `Bricks Left:` ⇄ `Khối còn lại:`, `Victory` ⇄ `Chiến thắng`
      * Tic-Tac-Quantum: `Your Turn` ⇄ `Lượt của bạn`, `AI Turn` ⇄ `Lượt của AI`, `Draw` ⇄ `Hòa`

### Step 4: Motion Video Suite & Automation Labs
- **`src/components/video/KineticTypographyLab.tsx`**:
  - Map preset categories to Vietnamese: `High-Retention` ⇄ `Giữ chân cao`, `Cinematic` ⇄ `Điện ảnh`, `Experimental` ⇄ `Thử nghiệm`, `Cyberpunk` ⇄ `Cyberpunk`, `Creative` ⇄ `Sáng tạo`, `Dynamic` ⇄ `Năng động`, `Minimalist` ⇄ `Tối giản`.
  - Localize labels: `"EDIT TEST HEADLINE:"`, `"SPEED & TENSION:"`, `"SELECT TYPOGRAPHY PRESET:"`, `"Copy CSS Keyframes"`, `"Replay Physics"`.
- **`src/components/video/AutomatedWorkflowVisualizer.tsx`**:
  - Localize: `"VERIFIED OPEN-SOURCE BLUEPRINTS:"`, `"PHASE"`, `"TARGET ASPECT"`, `"CRF COMPRESSION"`, `"AUDIO DUCKING"`, `"RUNTIME CODE BLUEPRINT"`, `"Copy Code"`, `"Benchmark:"`.
- **`src/components/video/VideoPipelineSimulator.tsx`**:
  - Localize startup console logs, color grade preset names, audio ducking labels, and post-render telemetry.

### Step 5: Lo-Fi Audio Lounge & AntiGravity Shipyard
- **`src/components/zones/LoFiLoungeZone.tsx`**:
  - Localize audio synthesis effects sliders (`Vinyl Crackle` ⇄ `Tiếng đĩa than`, `Tempo / BPM` ⇄ `Tốc độ nhịp`, `Reverb / Space` ⇄ `Độ vang không gian`, `Master Volume` ⇄ `Âm lượng tổng`).
  - Localize Pomodoro timer presets and status readouts.
- **`src/components/zones/AntiGravityShipyardZone.tsx`**:
  - Add bilingual descriptions and simulated execution log streams for all CLI cards (`antigravity run`, `claude-code task`, `codex sync`).

---

## 3. Verification & Acceptance Criteria

1. **Language Purity Test**:
   - In English mode: 100% of UI text, tooltips, buttons, logs, and guides display in clear, easy-to-understand English.
   - In Vietnamese mode: 100% of UI text, tooltips, buttons, logs, and guides display in natural tech Vietnamese with zero remaining English artifacts.
2. **Code Syntax Preservation**:
   - Underlying Python, Rust, YAML code blocks, CLI commands (`concat -i ...`), and raw URLs remain in correct syntax.
3. **Build & Type Check**:
   - `compile_applet` (`npm run build`) succeeds with 0 errors.
   - `lint_applet` (`tsc --noEmit`) passes with 0 type errors.

---

## 4. Execution Status: COMPLETED

All planned changes have been implemented and verified:
- [x] Schema & Data: Added `roleVi`, `periodVi`, `achievementsVi` to `QuestItem` and populated complete Vietnamese translations.
- [x] Format Read Time: Created `formatReadTime` and integrated into reader, dossier cards, and zone modals.
- [x] Clean Reader & Tower: Fully localized subtitles, metrics strip, degree honors, and quest logs.
- [x] 10-Game Arcade Hub & Modal: Fully localized cabinet tags, telemetry HUD, game overlays, and touch controls.
- [x] Motion & Video Suite: Fully localized presets, automated blueprints, 9:16 monitor subtitles, and console logs.
- [x] Lo-Fi Audio Lounge: Fully localized procedural synthesis sliders, Pomodoro timers, and dock controls.
- [x] AntiGravity Shipyard: Added bilingual CLI logs, descriptions, and workflow blueprints.
- [x] 2.5D Star System Map: Fully localized ship HUD, touch stick controls, dock prompts, and fast-travel bar.
- [x] Verification: Successfully executed `tsc --noEmit` (0 errors) and `npm run build` (success). Zero mixed-language state.
