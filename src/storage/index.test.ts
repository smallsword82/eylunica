import { Capacitor } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";
import { it, expect, vi } from "vitest";
import {
  fresh,
  record,
  decode,
  loadProgress,
  saveProgress,
  KEY,
} from "./index";
import { generate } from "../math-engine";
import { completeArena } from "./index";
import { getLane, makeDeck, observation, observe, specs, finishSession, freshArena } from "../arena-engine";
import { awardCard } from './cards';
import { stories } from '../reading-engine';
it("ilk cihaz kaydı seviye tespitine yönlenir; mevcut kayıt ve bölüm sayaçları korunur", async () => {
  localStorage.removeItem(KEY);
  expect((await loadProgress()).assessmentPending).toBe(true);
  const previous = { ...fresh(), mathSections: { divide: 3 } };
  await saveProgress(previous);
  expect(await loadProgress()).toEqual(previous);
});
it("yerel kayıt tekrar okunur", async () => {
  const p = fresh();
  p.character = "Esin";
  p.stars = 12;
  await saveProgress(p);
  expect(await loadProgress()).toEqual(p);
});
it('invalid optional level records cannot unlock content or erase existing progress', () => {
  const previous = { ...fresh(), stars: 23, academyUnlocked: { math: 'broken', reading: 99, attention: null }, mathCompleted: { '1:add': true, '1:divide': 'true', '99:mixed': true } };
  const decoded = decode(JSON.stringify(previous));
  expect(decoded.stars).toBe(23);
  expect(decoded.academyUnlocked).toEqual({ math: 1, reading: 3, attention: 1 });
  expect(decoded.mathCompleted).toEqual({ '1:add': true });
});
it('completed reading rewards from before level locks keep the next level accessible', () => {
  const story = stories.find(story => story.level === 1)!;
  const old = awardCard(fresh(), `reading:${story.id}`, story.title);
  const restored = decode(JSON.stringify(old));
  expect(restored.academyUnlocked).toEqual({math:1, reading:2, attention:1});
  expect(restored.cards).toEqual(old.cards);
  expect(restored.stars).toBe(old.stars);
});

it("Arena eklenmemiş veya bozulmuş olsa da eski öğrenme ve ödüller korunur", () => {
  const old = { ...fresh(), stars: 19, rewards: ["lights"], arena: undefined };
  expect(decode(JSON.stringify(old))).toEqual({ ...old, arena: freshArena() });
  expect(decode(JSON.stringify({ ...old, arena: { version: 99 } }))).toEqual({ ...old, arena: freshArena() });
});
it("normal ilk yanıt doğru düzey ve beceriyle saklanır; konser hazırlık kapısını değiştirmez", () => {
  const q = generate("add", 3);
  const p = record(fresh(), q, true, false, 3000, true);
  expect(p.history[0]).toMatchObject({ level: 3, timingValid: true });
  expect(getLane(p.arena, { operation: "add", level: 3, skill: p.history[0].skill! }).recent).toHaveLength(1);
  expect(record(fresh(), q, true, false, 3000, true, "concert").arena).toEqual(freshArena());
});
it("rekor ödülü ve üç yıldız tek cihaz kaydında atomik ve tekrarsızdır", async () => {
  const s = specs("multiply", 1)[0];
  let p = fresh(); p.stars = 7; p.rewards = ["lights"];
  const skillsBefore = structuredClone(p.skills);
  for (let i = 0; i < 4; i++) {
    const id = `s${i}`;
    const answers = makeDeck(s).map((q, j) => observation(q, true, false, i < 2 ? 5000 : 4000, true, "arena", `${id}:${j}`));
    for (const o of answers) p.arena = observe(p.arena, s, o);
    const result = completeArena(p, s, id, answers);
    p = result.progress;
    if (i === 3) {
      expect(p.stars).toBe(10);
      expect(p.rewards).toContain("arena-lights");
      expect(completeArena(p, s, id, answers).progress.stars).toBe(10);
    }
  }
  expect(p.skills).toEqual(skillsBefore);
  await saveProgress(p);
  expect(await loadProgress()).toEqual(p);
});
it("bozuk ve eski şemayı güvenle ele alır", () => {
  for (const raw of [
    "bad",
    '{"version":0}',
    JSON.stringify({ ...fresh(), skills: {} }),
    JSON.stringify({ ...fresh(), stars: -1 }),
  ])
    expect(decode(raw)).toEqual(fresh());
});
it("beş bağımsız doğru sonrası sadece ilgili işlemi ilerletir", () => {
  let p = fresh();
  for (let i = 0; i < 5; i++) p = record(p, generate("add"), true, false, 1000);
  expect(p.skills.add.level).toBe(2);
  expect(p.skills.subtract.level).toBe(1);
  expect(p.stars).toBe(5);
  expect(p.rewards).toContain("lights");
});
it("zorlanmada kolaylaştırır ve ceza puanı vermez", () => {
  let p = fresh();
  p.skills.subtract.level = 3;
  for (let i = 0; i < 4; i++)
    p = record(p, generate("subtract", 3), false, true, 2000);
  expect(p.skills.subtract.level).toBe(2);
  expect(p.stars).toBe(0);
  expect(p.skills.subtract.hints).toBe(4);
  expect(p.history).toHaveLength(4);
});
it("ipucuyla başarı hız ve seviye baskısı yaratmaz", () => {
  let p = fresh();
  for (let i = 0; i < 7; i++) p = record(p, generate("add"), true, true, 99999);
  expect(p.skills.add.level).toBe(1);
  expect(p.stars).toBe(7);
});
it("depolama hatasını çağırana bildirir", async () => {
  const mock = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
    throw new Error("quota");
  });
  await expect(saveProgress(fresh())).rejects.toThrow("quota");
  mock.mockRestore();
  localStorage.removeItem(KEY);
});

vi.mock("@capacitor/preferences", () => ({
  Preferences: { get: vi.fn(), set: vi.fn() },
}));
it("Android adaptörü aynı sürümlü kaydı Preferences üzerinden saklar", async () => {
  const native = vi.spyOn(Capacitor, "isNativePlatform").mockReturnValue(true);
  try {
    const p = fresh();
    p.stars = 8;
    vi.mocked(Preferences.set).mockResolvedValue();
    vi.mocked(Preferences.get).mockResolvedValue({ value: JSON.stringify(p) });
    await saveProgress(p);
    expect(Preferences.set).toHaveBeenCalledWith({
      key: KEY,
      value: JSON.stringify(p),
    });
    expect(await loadProgress()).toEqual(p);
  } finally {
    native.mockRestore();
  }
});

it("v1 kaydını matematik, karakter, yıldız ve ödülleri koruyarak v2ye taşır", async () => {
  const p = record(fresh(), generate("add"), true, false, 1200);
  p.character = "Elya";
  p.stars = 18;
  p.rewards = ["lights", "confetti"];
  p.calibrationDone = true;
  const { academies, ...old } = p;
  localStorage.setItem(KEY, JSON.stringify({ ...old, version: 1 }));
  const migrated = await loadProgress();
  expect(migrated.version).toBe(2);
  expect(migrated.skills).toEqual(p.skills);
  expect(migrated.character).toBe("Sueda");
  expect(migrated.stars).toBe(18);
  expect(migrated.rewards).toEqual(p.rewards);
  expect(migrated.history).toEqual(p.history);
  expect(migrated.academies.reading.attempts).toBe(0);
  await saveProgress(migrated);
  expect(await loadProgress()).toEqual(migrated);
});
it("yeni akademi puanları matematik becerilerini değiştirmez", async () => {
  const { recordAcademy } = await import("./index");
  let p = fresh();
  for (let i = 0; i < 5; i++)
    p = recordAcademy(p, "reading", {
      id: `r${i}`,
      skill: "Ana fikir",
      correct: true,
      hint: false,
      elapsedMs: 1000,
    });
  expect(p.stars).toBe(5);
  expect(p.rewards).toContain("lights");
  expect(p.skills.add.attempts).toBe(0);
  expect(p.academies.attention.attempts).toBe(0);
  await saveProgress(p);
  expect(await loadProgress()).toEqual(p);
});

it("eski altı karakter adını aynı arkadaşın yeni adına taşır, öğrenmeyi korur", () => {
  for (const [oldName, newName] of [["Mina", "Mina"], ["Lidya", "Lidya"], ["Eylül", "Lidya"], ["Alara", "Hilal"], ["Beren", "Esin"], ["Öykü", "Zeynep"], ["Defne", "Sueda"], ["Derin", "Hilal"], ["Arya", "Esin"], ["Zeyna", "Zeynep"], ["Elya", "Sueda"]]) {
    const previous = record(fresh(), generate("add"), true, false, 1500);
    previous.character = oldName;
    const next = decode(JSON.stringify(previous));
    expect(next).toEqual({ ...previous, character: newName });
  }
});
