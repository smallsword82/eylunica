import { expect, it } from "vitest";
import { SESSION, OPERATIONS, decodeArena, eligibility, finishSession, freshArena, getLane, laneKey, makeDeck, meanIndependent, observation, observe, skillFor, specs, type ArenaState, type LaneSpec } from ".";
const spec = specs("multiply", 1)[0];
const day = new Date(2026, 9, 20, 12).getTime();
function session(state: ArenaState, id: string, ms: number, now = day, flag?: "wrong" | "hint" | "interrupted" | "instant") {
  const answers = makeDeck(spec).map((q, i) => observation(q, !(flag === "wrong" && i === 0), flag === "hint" && i === 0, flag === "instant" && i === 0 ? 50 : ms, !(flag === "interrupted" && i === 0), "arena", `${id}:${i}`, now));
  for (const a of answers) state = observe(state, spec, a);
  return { ...finishSession(state, spec, id, answers, now), answers };
}
function baseline() { return session(session(freshArena(), "a", 5000).state, "b", 5000).state; }
function pair(state: ArenaState, id: string, ms: number, now = day) { return session(session(state, `${id}-1`, ms, now).state, `${id}-2`, ms, now); }

it.each(OPERATIONS)("%s: her düzey ve beceride 10 farklı, aynı zorlukta soru üretir", operation => {
  for (let level = 1; level <= 5; level++) for (const s of specs(operation, level)) {
    const deck = makeDeck(s, () => 0.5);
    expect(deck).toHaveLength(SESSION);
    expect(new Set(deck.map(q => observation(q, true, false, 1000, true, "practice", "x").fact)).size).toBe(SESSION);
    expect(deck.every(q => q.operation === operation && q.level === level && skillFor(q) === s.skill && q.options.includes(q.answer))).toBe(true);
  }
});
it("açılma hızdan bağımsızdır: 20 ilk yanıt, %90 bağımsız doğruluk ve çeşitlilik gerekir", () => {
  let state = freshArena();
  const deck = makeDeck(spec);
  for (let i = 0; i < 20; i++) {
    state = observe(state, spec, observation(deck[i % 10], i >= 2, false, 120_000, false, "practice", `p${i}`));
    if (i === 18) expect(eligibility(getLane(state, spec)).open).toBe(false);
  }
  expect(eligibility(getLane(state, spec)).open).toBe(true);
  const next = observe(state, spec, observation(deck[0], false, true, 1000, true, "practice", "extra"));
  // Replace an already incorrect first answer; another wrong answer then drops below 90%.
  const worse = observe(next, spec, observation(deck[1], false, true, 1000, true, "practice", "extra2"));
  const closed = observe(worse, spec, observation(deck[2], false, true, 1000, true, "practice", "extra3"));
  expect(eligibility(getLane(closed, spec)).open).toBe(false);
  expect(eligibility(getLane(state, specs("multiply", 2)[0])).open).toBe(false);
});
it("aynı soru tekrarları veya ipuçları kapıyı açmaz; aynı yanıt kimliği iki kez eklenmez", () => {
  let state = freshArena(); const q = makeDeck(spec)[0];
  for (let i = 0; i < 20; i++) state = observe(state, spec, observation(q, true, false, 1000, true, "practice", `${i}`));
  expect(eligibility(getLane(state, spec)).open).toBe(false);
  const a = getLane(state, spec).recent[0];
  expect(observe(state, spec, a)).toBe(state);
  let hinted = freshArena();
  const deck = makeDeck(spec);
  for (let i = 0; i < 20; i++) hinted = observe(hinted, spec, observation(deck[i % 10], true, true, 1000, true, "practice", `${i}`));
  expect(eligibility(getLane(hinted, spec)).open).toBe(false);
});
it("10 soru veya yarım kalan tur rekor oluşturmaz; ilk 20 bağımsız doğru başlangıç ölçümüdür", () => {
  const first = session(freshArena(), "a", 5000);
  expect(first.comparison).toBe(null);
  expect(getLane(first.state, spec).pending).toHaveLength(10);
  const partial = finishSession(first.state, spec, "partial", first.answers.slice(0, 5));
  expect(partial.state).toBe(first.state);
  const second = session(first.state, "b", 5000);
  expect(second.comparison?.qualified).toBe(true);
  expect(second.comparison?.record).toBe(false);
  expect(second.bonus).toBe(null);
  expect(getLane(second.state, spec).bestMs).toBe(5000);
});
it.each(["wrong", "hint", "interrupted", "instant"] as const)("%s içeren grup hızlı olsa bile rekor veya ödül üretmez", flag => {
  const state = baseline();
  const first = session(state, "c", 2000, day, flag);
  const second = session(first.state, "d", 2000);
  expect(second.comparison?.qualified).toBe(false);
  expect(second.comparison?.record).toBe(false);
  expect(getLane(second.state, spec).bestMs).toBe(5000);
  expect(second.bonus).toBe(null);
});
it("%5 altı fark rekor sayılmaz, yavaşlama kazanılmış rekoru değiştirmez", () => {
  const small = pair(baseline(), "small", 4900);
  expect(small.comparison?.record).toBe(false);
  const slow = pair(small.state, "slow", 6000);
  expect(getLane(slow.state, spec).bestMs).toBe(5000);
  expect(getLane(slow.state, spec).baselineMs).toBe(5000);
});
it("ödüller günde bir, toplam üç; tekrar teslim ve geri alınan saat ek ödül vermez", () => {
  const first = pair(baseline(), "r1", 4000);
  expect(first.bonus).toBe("arena-lights");
  const replay = finishSession(first.state, spec, "r1-2", first.answers);
  expect(replay.state).toBe(first.state);
  expect(replay.bonus).toBe(null);
  const sameDay = pair(first.state, "r2", 3500);
  expect(sameDay.comparison?.record).toBe(true);
  expect(sameDay.bonus).toBe(null);
  const tomorrow = pair(sameDay.state, "r3", 3000, day + 86_400_000);
  expect(tomorrow.bonus).toBe("arena-costume");
  const rewind = pair(tomorrow.state, "r4", 2500, day);
  expect(rewind.bonus).toBe(null);
  const third = pair(rewind.state, "r5", 2000, day + 2 * 86_400_000);
  expect(third.bonus).toBe("arena-badge");
  const fourth = pair(third.state, "r6", 1500, day + 3 * 86_400_000);
  expect(fourth.bonus).toBe(null);
  expect(fourth.state.bonusCount).toBe(3);
});
it("yetersiz veya destekli sürelerden ortalama çıkarmaz; bozuk kaydı güvenle ele alır", () => {
  const q = makeDeck(spec)[0];
  const clean = observation(q, true, false, 1000, true, "practice", "a");
  expect(meanIndependent(Array(9).fill(clean))).toBe(null);
  expect(meanIndependent([...Array(9).fill(clean), { ...clean, hint: true }])).toBe(null);
  expect(meanIndependent(Array(10).fill(clean))).toBe(1000);
  expect(observation(q, true, false, NaN, true, "practice", "x").timingValid).toBe(false);
  const saved = baseline();
  expect(decodeArena(saved)).toEqual(saved);
  for (const bad of [null, {}, { ...freshArena(), bonusCount: 99 }, { ...freshArena(), lanes: { [laneKey(spec)]: {} } }]) expect(decodeArena(bad)).toEqual(freshArena());
});
