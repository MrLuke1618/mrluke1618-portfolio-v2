# Implementation Plan: Interactive In-App YouTube Playlist Theater Player

## User Requirements & Clarifications Summary
- **Target Playlist**: `https://www.youtube.com/playlist?list=PL8l48rFpYhhaFUDxydFt2tTY55rpb9rWi`
- **Location**: Replaces the static featured banner section (lines 194–233 in `src/components/video/AutomatedWorkflowVisualizer.tsx`) inside the **Automated AI Video Station**.
- **Layout Choice**: **Theater player on top or left with scrollable video queue** (responsive 2-column on desktop/tablet landscape, stacked on mobile).
- **Preview & Play Behavior**: **Select video to preview details and thumbnail, then click Play** before the iframe starts playback.
- **Language Mode**: Full bilingual support (`en` and `vi`) matching the app's established localized tech vocabulary.
- **Styling Rules**: Strict compliance with the 5-color palette (`#090D16`, `#131B2E`, `#8B5CF6`, `#F8FAFC`, `#94A3B8`), mobile & tablet touch optimization, and zero decorative pill enclosures.

---

## Architecture & Component Design

### 1. Dedicated Component: `src/components/video/PlaylistVideoPlayer.tsx`
Create a modular, production-grade video player and queue component:
- **State Management**:
  - `activeVideoId`: currently loaded video (or playlist series mode).
  - `previewVideoId`: currently selected video in the queue (showing thumbnail, title, description, tags, tech stack).
  - `isPlaying`: boolean flag. Clicking "Play Video" switches the view from high-res preview mode into the active YouTube iframe embed with autoplay enabled (`&autoplay=1`).
  - `queueFilter`: filter between All videos, AI HTML/Remotion, and Model Pipelines.
- **Queue List**:
  - Curated items from the user's playlist (including `SfQYA6_Maw4` Remotion showcase and related AI video engineering demos) plus a "Complete Playlist Stream" mode embedding `listType=playlist&list=PL8l48rFpYhhaFUDxydFt2tTY55rpb9rWi`.
  - Each item displays:
    - High-definition video thumbnail with duration badge.
    - Title (bilingual).
    - Status indicator (Playing / Previewing / Queued).
    - Tech tags (e.g. `Remotion`, `Hyperframes`, `Concat`, `Kling AI`, `Veo 3`).
- **Interactive Theater Section**:
  - **Preview State**: Shows the video thumbnail with high-contrast cinematic overlay, title, badges, workflow description, sound effect triggers, and a prominent "Play Video in App" (`Xem Video Ngay`) button.
  - **Playing State**: Embeds `iframe` with `youtube-nocookie.com/embed/...` with responsive 16:9 aspect ratio, picture-in-picture, fullscreen permissions, and in-app controls to pause/close playback back to preview mode.
  - Quick action to open directly on YouTube (`ExternalLink`) if desired.

### 2. Integration into `AutomatedWorkflowVisualizer.tsx`
- Replace the current static container (lines 194–233) with the new `<PlaylistVideoPlayer language={language} sound={sound} />`.
- Retain seamless sound feedback (`sound.playBlip()`, `sound.playTeleport()`).

### 3. Responsive Touch & Desktop Controls
- **Desktop/Tablet Landscape**: Split layout (65% theater view / 35% scrollable playlist queue).
- **Mobile/Tablet Portrait**: Stacked layout with theater on top and horizontally scrollable or swipeable queue cards underneath.
- Accessible buttons with `min-h-[44px]` touch targets.

---

## Verification & Testing
1. Run `compile_applet` (`npm run build`) to ensure zero TypeScript errors or missing imports.
2. Verify switching between preview and play states:
   - Selecting a video updates the preview card.
   - Clicking "Play" swaps to the live YouTube iframe without page redirects.
   - Pausing / exiting returns cleanly to preview mode.
3. Verify bilingual switching between English and Vietnamese.
4. Verify responsiveness across mobile, tablet, and desktop viewports.
