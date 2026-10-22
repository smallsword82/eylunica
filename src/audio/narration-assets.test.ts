import {angleCoachTexts} from '../grade5/angle-coach';
import {mathNarrationTexts} from '../grade5/math-narration';
import { it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { stories } from "../reading-engine";
import { narrationTexts, storyNarrationText } from "./narration-texts";
import { narrationManifest } from "./narration-manifest";

it("bütün yönerge ve hikâyeler güncel metinle, sağlam gömülü ses dosyasıyla eşleşir", () => {
  const texts = [...new Set([...Object.values(narrationTexts), ...Object.values(angleCoachTexts), ...mathNarrationTexts, ...stories.map(s => storyNarrationText(s.title, s.sentences))])];
  expect(Object.keys(narrationManifest).sort()).toEqual([...texts].sort());
  for (const text of texts) {
    const asset = narrationManifest[text];
    expect(asset.file).toBe(`tr-${createHash("sha256").update(text).digest("hex").slice(0, 16)}.mp3`);
    const bytes = readFileSync(`public/narration/${asset.file}`);
    expect(createHash("sha256").update(bytes).digest("hex")).toBe(asset.sha256);
    expect(asset.duration).toBeGreaterThan(1);
    expect(bytes.length).toBeLessThan(2 * 1024 * 1024);
  }
});
