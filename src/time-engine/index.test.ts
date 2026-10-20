import { it, expect } from "vitest";
import {
  MINUTE,
  acknowledge,
  addUsage,
  dateKey,
  dayTotal,
  decodeWellbeing,
  dueReminder,
  freshWellbeing,
  limitReached,
  todayUsage,
  weekUsage,
} from "./index";
const now = new Date(2026, 9, 20, 12).getTime();
const at = (minutes: number) =>
  addUsage(freshWellbeing(), now, minutes * MINUTE, "math");
it("varsayılan serbesttir, 15 dakika bilgisi oyun sınırı değildir", () => {
  const s = at(15);
  expect(s.settings.dailyLimitMinutes).toBeNull();
  expect(limitReached(s, now)).toBe(false);
  expect(dueReminder(s, now)).toBe("goal");
  expect(dueReminder(acknowledge(s, now, "goal"), now)).toBeNull();
});
it("mola sırası 25, 45 ve 65 etkin dakikadır; her öneri bir kez gösterilir", () => {
  let s = acknowledge(at(24), now, "goal");
  expect(dueReminder(s, now)).toBeNull();
  s = addUsage(s, now, MINUTE, "reading");
  expect(dueReminder(s, now)).toBe("break");
  s = acknowledge(s, now, "break");
  s = addUsage(s, now, 19 * MINUTE, "attention");
  expect(dueReminder(s, now)).toBeNull();
  s = addUsage(s, now, MINUTE, "attention");
  expect(dueReminder(s, now)).toBe("break");
  s = acknowledge(s, now, "break");
  s = addUsage(s, now, 20 * MINUTE, "math");
  expect(dueReminder(s, now)).toBe("break");
});
it("geciken önerileri üst üste yağdırmaz; sonraki öneri 20 etkin dakika sonradır", () => {
  let s = acknowledge(at(60), now, "goal");
  s = acknowledge(s, now, "break");
  expect(todayUsage(s, now).nextBreakAtMs).toBe(80 * MINUTE);
  expect(dueReminder(s, now)).toBeNull();
});
it("mola ayarı kapalıyken mola yok, 15 dakika bilgisi korunur", () => {
  const s = at(50);
  s.settings.breakReminders = false;
  expect(dueReminder(s, now)).toBe("goal");
  expect(dueReminder(acknowledge(s, now, "goal"), now)).toBeNull();
});
it("yerel gece yarısında intervali iki güne böler; yeni gün ayrı hedef ve sınır alır", () => {
  const end = new Date(2026, 9, 21, 0, 2).getTime();
  let s = addUsage(freshWellbeing(), end, 4 * MINUTE, "reading");
  expect(s.days["2026-10-20"].reading).toBe(2 * MINUTE);
  expect(s.days["2026-10-21"].reading).toBe(2 * MINUTE);
  s.settings.dailyLimitMinutes = 1;
  expect(limitReached(s, end)).toBe(true);
  const tomorrow = new Date(2026, 9, 22, 0, 0).getTime();
  expect(limitReached(s, tomorrow)).toBe(false);
  expect(dayTotal(todayUsage(s, tomorrow))).toBe(0);
  expect(dueReminder(s, tomorrow)).toBeNull();
});
it("yıl değişimini bölüp son 7 takvim gününü toplar; eski günleri dahil etmez", () => {
  const end = new Date(2027, 0, 1, 0, 1).getTime();
  let s = addUsage(freshWellbeing(), end, 2 * MINUTE, "attention");
  expect(s.days["2026-12-31"].attention).toBe(MINUTE);
  expect(s.days["2027-01-01"].attention).toBe(MINUTE);
  s = addUsage(s, new Date(2026, 11, 23, 12).getTime(), 10 * MINUTE, "math");
  expect(dayTotal(weekUsage(s, end))).toBe(2 * MINUTE);
});
it("akademi süreleri ayrıdır ve girdiyi değiştirmez", () => {
  const s = freshWellbeing();
  let p = addUsage(s, now, MINUTE, "math");
  p = addUsage(p, now, 2 * MINUTE, "reading");
  p = addUsage(p, now, 3 * MINUTE, "attention");
  expect(dayTotal(todayUsage(p, now))).toBe(6 * MINUTE);
  expect(s.days).toEqual({});
  expect(todayUsage(p, now).reading).toBe(2 * MINUTE);
});
it("sınır yalnız seçilmişse çalışır ve yeni gün otomatik açılır", () => {
  const s = at(15);
  s.settings.dailyLimitMinutes = 15;
  expect(limitReached(s, now)).toBe(true);
  s.settings.dailyLimitMinutes = null;
  expect(limitReached(s, now)).toBe(false);
});
it("bozuk kayıtları ve eksik günleri güvenle ele alır; geçerli ayar ve geçmişi korur", () => {
  expect(decodeWellbeing("bad")).toEqual(freshWellbeing());
  let s = at(20);
  s.settings.dailyLimitMinutes = 30;
  s.settings.breakReminders = false;
  expect(decodeWellbeing(JSON.stringify(s))).toEqual(s);
  expect(
    decodeWellbeing(JSON.stringify({ ...s, days: { broken: { math: -1 } } }))
      .days,
  ).toEqual({});
});
it("90 günlük geçmiş tutar; negatif veya geçersiz süre eklemez", () => {
  let s = freshWellbeing();
  for (let i = 0; i < 100; i++)
    s = addUsage(s, new Date(2026, 0, 1 + i, 12).getTime(), MINUTE, "other");
  expect(Object.keys(s.days)).toHaveLength(90);
  expect(addUsage(s, now, -10, "math")).toBe(s);
  expect(addUsage(s, now, NaN, "math")).toBe(s);
  expect(dateKey(new Date(2026, 0, 1).getTime())).toBe("2026-01-01");
});

it("uzun sorunun ardından hedef ve mola bilgisini birleştirir; ikinci mesajı üst üste açmaz", () => {
  const s = at(30);
  expect(dueReminder(s, now)).toBe("break");
  const acknowledged = acknowledge(s, now, "break");
  expect(todayUsage(acknowledged, now).goalAcknowledged).toBe(true);
  expect(dueReminder(acknowledged, now)).toBeNull();
  expect(todayUsage(acknowledged, now).nextBreakAtMs).toBe(50 * MINUTE);
});
