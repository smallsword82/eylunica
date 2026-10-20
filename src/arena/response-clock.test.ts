import { expect, it } from "vitest";
import { ResponseClock } from "./response-clock";
it("yalnız etkin monoton süreyi ölçer; mola kaydı keser, dönüşte süreyi şişirmez", () => {
  const c = new ResponseClock();
  c.reset(100, true);
  c.update(1100, false);
  c.update(61_100, true);
  expect(c.read(62_100)).toEqual({ elapsedMs: 2000, timingValid: false });
  c.reset(70_000, true);
  expect(c.read(73_000)).toEqual({ elapsedMs: 3000, timingValid: true });
});
it("arka planda başlayan soru rekor sayılmaz ve negatif fark süreyi azaltmaz", () => {
  const c = new ResponseClock();
  c.reset(100, false);
  c.update(200, true);
  expect(c.read(1200)).toEqual({ elapsedMs: 1000, timingValid: false });
  c.reset(100, true);
  expect(c.read(90).elapsedMs).toBe(0);
});
