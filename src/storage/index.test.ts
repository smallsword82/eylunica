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
it("yerel kayıt tekrar okunur", async () => {
  const p = fresh();
  p.character = "Arya";
  p.stars = 12;
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
