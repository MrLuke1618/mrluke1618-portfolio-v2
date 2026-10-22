import { EasterEggSnippet } from '../types/game';

export const EASTER_EGGS: EasterEggSnippet[] = [
  {
    id: 'rust-modder',
    title: 'Universal Modder Memory Scanner',
    filename: 'universal_modder/src/scanner.rs',
    language: 'rust',
    tag: 'Rust • Systems Engineering',
    descriptionEn: 'Core binary pattern scanner and memory signature hook written in Rust with memory safety guarantees and zero runtime allocation.',
    descriptionVi: 'Trình quét mẫu nhị phân (binary pattern) và hook bộ nhớ viết bằng Rust, đảm bảo an toàn bộ nhớ và tối ưu chi phí phân bổ bộ nhớ.',
    code: `//! Universal Modder Core Engine - Pattern Scanner & Memory Hook
use std::error::Error;
use std::fmt;

#[derive(Debug, Clone, PartialEq)]
pub struct PatternSig {
    pub pattern: Vec<Option<u8>>,
    pub mask: String,
}

impl PatternSig {
    /// Compiles an IDA-style signature string (e.g. "48 89 5C 24 ?? 48 89 74")
    pub fn from_ida(signature: &str) -> Result<Self, Box<dyn Error>> {
        let mut pattern = Vec::new();
        let mut mask = String::new();

        for token in signature.split_whitespace() {
            if token == "?" || token == "??" {
                pattern.push(None);
                mask.push('?');
            } else {
                let byte = u8::from_str_radix(token, 16)?;
                pattern.push(Some(byte));
                mask.push('x');
            }
        }
        Ok(Self { pattern, mask })
    }

    /// Scans a memory slice for byte sequence match with zero-copy iteration
    pub fn scan(&self, buffer: &[u8]) -> Option<usize> {
        let sig_len = self.pattern.len();
        if buffer.len() < sig_len {
            return None;
        }

        buffer.windows(sig_len).position(|window| {
            window.iter().zip(&self.pattern).all(|(byte, expected)| {
                match expected {
                    Some(val) => *byte == *val,
                    None => true, // wildcard matched
                }
            })
        })
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_signature_resolution() {
        let sig = PatternSig::from_ida("48 8B ?? 55 48 89 E5").unwrap();
        let memory_dump = [0x90, 0x90, 0x48, 0x8B, 0x05, 0x55, 0x48, 0x89, 0xE5, 0xC3];
        let offset = sig.scan(&memory_dump);
        assert_eq!(offset, Some(2));
    }
}`
  },
  {
    id: 'python-hyperframes',
    title: 'Automated YouTube Shorts Pipeline',
    filename: 'pipelines/hyperframes_concat.py',
    language: 'python',
    tag: 'Python • Hyperframes • Concat',
    descriptionEn: 'Automated script combining heygen-com/hyperframes programmatic code-to-video scenes and jub0t/concat for automated multi-clip YouTube Shorts rendering.',
    descriptionVi: 'Script tự động hóa kết hợp công cụ Hyperframes (kết xuất video từ mã) và concat để ghép nối video YouTube Shorts đa phân cảnh hoàn toàn tự động.',
    code: `"""
Automated YouTube Shorts Assembly Pipeline
Powered by AntiGravity, Hyperframes (heygen-com/hyperframes) and concat (jub0t/concat)
"""

import os
import json
import subprocess
from pathlib import Path

WORKSPACE = Path("./dist/shorts_pipeline")
WORKSPACE.mkdir(parents=True, exist_ok=True)

def generate_hyperframe_scene(scene_id: int, script_text: str, visual_config: dict) -> Path:
    """Invokes hyperframes to render a programmatic dynamic animated scene."""
    output_scene = WORKSPACE / f"scene_{scene_id:02d}.mp4"
    config_file = WORKSPACE / f"config_{scene_id:02d}.json"
    
    payload = {
        "aspect_ratio": "9:16",
        "duration_seconds": 6.5,
        "typography": {"font": "Orbitron", "color": "#06B6D4", "text": script_text},
        "visual_fx": visual_config
    }
    config_file.write_text(json.dumps(payload, indent=2))
    
    cmd = [
        "hyperframes", "render",
        "--config", str(config_file),
        "--out", str(output_scene),
        "--fps", "60",
        "--quality", "high"
    ]
    subprocess.run(cmd, check=True)
    return output_scene

def assemble_shorts(scene_paths: list[Path], output_filename: str = "final_shorts.mp4") -> Path:
    """Uses concat engine (jub0t/concat) to stitch scenes seamlessly with audio crossfades."""
    final_output = WORKSPACE / output_filename
    file_list = WORKSPACE / "concat_list.txt"
    file_list.write_text("\\n".join([f"file '{p.resolve()}'" for p in scene_paths]))
    
    stitch_cmd = [
        "concat",
        "--input-list", str(file_list),
        "--output", str(final_output),
        "--transition", "cyber_wipe",
        "--audio-normalize", "lufs-14"
    ]
    subprocess.run(stitch_cmd, check=True)
    print(f"[SUCCESS] YouTube Short rendered at: {final_output}")
    return final_output

if __name__ == "__main__":
    scenes = [
        generate_hyperframe_scene(1, "AI Automation Superpower", {"style": "neon_grid"}),
        generate_hyperframe_scene(2, "Rust Engine x Universal Modder", {"style": "matrix_flow"}),
        generate_hyperframe_scene(3, "Subscribe for Next-Gen Tech", {"style": "pulse_cta"})
    ]
    assemble_shorts(scenes)`
  },
  {
    id: 'antigravity-workflow',
    title: 'AntiGravity IDE Toolchain Configuration',
    filename: '.antigravity/workflows/video_factory.yaml',
    language: 'yaml',
    tag: 'AntiGravity • CLI Pipelines',
    descriptionEn: 'AntiGravity IDE workflow declaration orchestrating prompt compilation, voice synthesis, hyperframes rendering, and git-ops publishing.',
    descriptionVi: 'Cấu hình quy trình AntiGravity IDE điều phối việc tổng hợp prompt, đồng bộ giọng nói, dựng video tự động qua Hyperframes và xuất bản tự động.',
    code: `name: ai-creator-video-factory
version: "2.5.0"
runtime: python-3.11-rust-nightly

triggers:
  - event: content.schedule.daily
    cron: "0 9 * * 1-5"
  - event: manual.dispatch
    inputs:
      topic: string
      target_channel: "youtube_shorts"

jobs:
  synthesize_content:
    steps:
      - name: Generate Content Outline
        run: antigravity run llm-prompt --template prompt_pillars.jinja2
      - name: Audio Voice Clone Synthesis
        run: python scripts/elevenlabs_clone.py --style dynamic_narrator
      - name: Programmatic Hyperframes Render
        run: hyperframes batch --scenes ./workspace/scenes.json --concurrency 4
      - name: Concat & Color Grade
        run: concat --input-list ./workspace/render_manifest.txt --preset youtube_hdr
      - name: Automated Quality Verification
        run: |
          cargo run --bin visual_inspector -- --file ./dist/final_shorts.mp4 --min-score 95`
  }
];
