import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { CardReward } from "./CollectibleCards";
import { ContinueCard } from "./ContinueCard";
import { fresh } from "../storage";
import { awardCard } from "../storage/cards";

afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); });

it("kaydedilmiş kart paketten açılır; devam düğmesi odağı çalmaz ve yeniden ödül yazılmaz", () => {
  vi.useFakeTimers();
  const progress = awardCard(fresh(), "section:1", "Toplama Ormanı");
  const saved = JSON.stringify(progress);
  render(<><CardReward progress={progress} /><ContinueCard title="Yeni bölüm" focusOnMount={false} onContinue={() => {}} /></>);
  const opener = screen.getByRole("button", { name: "Kart paketini aç" });
  expect(opener).toHaveFocus();
  expect(screen.queryByRole("img", { name: "Mina · İlk Buluşma" })).toBeNull();
  fireEvent.click(opener);
  expect(opener).toBeDisabled();
  act(() => { vi.advanceTimersByTime(850); });
  expect(screen.getByRole("heading", { name: "Mina kartı kazandın!" })).toBeVisible();
  expect(screen.getByRole("group", { name: "Mina · İlk Buluşma kartın" })).toHaveFocus();
  expect(screen.getByRole("img", { name: "Mina · İlk Buluşma" })).toBeVisible();
  expect(JSON.stringify(progress)).toBe(saved);
});

it("azaltılmış harekette kart beklemeden açılır; sonraki ödül yeni paketle başlar", () => {
  vi.stubGlobal("matchMedia", vi.fn(() => ({ matches: true })));
  const progress = awardCard(fresh(), "section:1", "Bölüm");
  const { rerender } = render(<CardReward progress={progress} />);
  fireEvent.click(screen.getByRole("button", { name: "Kart paketini aç" }));
  expect(screen.getByRole("heading", { name: "Mina kartı kazandın!" })).toBeVisible();
  rerender(<CardReward progress={awardCard(progress, "section:2", "Bölüm")} />);
  expect(screen.getByRole("button", { name: "Kart paketini aç" })).toHaveFocus();
  expect(screen.queryByRole("heading", { name: "Mina kartı kazandın!" })).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Kart paketini aç" }));
  expect(screen.getByRole("heading", { name: "Lidya kartı kazandın!" })).toBeVisible();
});

it("ekrandan ayrılırken açılış zamanlayıcısı temizlenir; tamamlanan albüm paket üretmez", () => {
  vi.useFakeTimers();
  let progress = awardCard(fresh(), "section:0", "Bölüm");
  const { unmount } = render(<CardReward progress={progress} />);
  const pendingTimers = vi.getTimerCount();
  fireEvent.click(screen.getByRole("button", { name: "Kart paketini aç" }));
  unmount();
  expect(vi.getTimerCount()).toBe(pendingTimers);
  for (let index = 1; index <= 24; index++) progress = awardCard(progress, `section:${index}`, "Bölüm");
  render(<CardReward progress={progress} />);
  expect(screen.queryByRole("button", { name: "Kart paketini aç" })).toBeNull();
  expect(screen.getByRole("heading", { name: "24 farklı kartı topladın!" })).toBeVisible();
});
