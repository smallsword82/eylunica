import { generate, type Operation, type Question } from "../math-engine";
import { attentionVariant, type AttentionKind } from "../attention-engine";
import { stories, type Story } from "../reading-engine";
import type { Activity } from "../learning-engine";

type Fact = Pick<Question, "a" | "b" | "operation">;
export function questionKey(question: Fact) {
  const operands = [question.a, question.b];
  if (["add", "multiply"].includes(question.operation)) operands.sort((first, second) => first - second);
  return `${question.operation}:${operands.join(":")}`;
}
export function freshQuestion(operation: Operation, level: number, history: Fact[], rng = Math.random): Question {
  const recent = new Set(history.slice(-200).map(questionKey));
  for (let nextLevel = Math.max(1, Math.min(5, level)); nextLevel <= 5; nextLevel++) {
    const bound = ["multiply", "divide"].includes(operation) ? [4, 6, 8, 12, 25][nextLevel - 1] : [10, 20, 50, 100, 200][nextLevel - 1];
    const pool = new Map<string, [number, number]>();
    for (let first = 1; first <= bound; first++) for (let second = 1; second <= bound; second++) {
      const candidate = { a: operation === "divide" ? first * second : operation === "subtract" ? Math.max(first, second) : first, b: operation === "subtract" ? Math.min(first, second) : second, operation };
      if (nextLevel === 1 && operation === "add" && first + second > 10) continue;
      if (nextLevel > 1) {
        const previousBound = ["multiply", "divide"].includes(operation) ? [4, 6, 8, 12][nextLevel - 2] : [10, 20, 50, 100][nextLevel - 2];
        if (operation === "add" ? first + second <= previousBound || first + second > bound : Math.max(first, second) <= previousBound) continue;
      }
      const key = questionKey(candidate);
      if (!recent.has(key)) pool.set(key, [first, second]);
    }
    const available = [...pool.values()];
    if (!available.length) continue;
    const [first, second] = available[Math.floor(Math.max(0, Math.min(.999999, rng())) * available.length)];
    const a = operation === "divide" ? first * second : operation === "subtract" ? Math.max(first, second) : first;
    const b = operation === "subtract" ? Math.min(first, second) : second;
    const answer = operation === "add" ? a + b : operation === "subtract" ? a - b : operation === "multiply" ? a * b : a / b;
    const options = new Set([answer]);
    for (const offset of [1, -1, 10, -10, 2, -2]) {
      if (options.size === 4) break;
      if (answer + offset >= 0) options.add(answer + offset);
    }
    const shuffled = [...options];
    for (let index = shuffled.length - 1; index > 0; index--) {
      const position = Math.floor(Math.max(0, Math.min(.999999, rng())) * (index + 1));
      [shuffled[index], shuffled[position]] = [shuffled[position], shuffled[index]];
    }
    return { a, b, answer, options: shuffled, operation, level: nextLevel };
  }
  return generate(operation, 5, rng);
}
export function freshStrategy(level: number, history: Fact[], rng = Math.random): Question {
  const recent = new Set(history.slice(-200).map(questionKey));
  const pair = [[8, 7], [9, 6], [7, 5], [6, 8], [8, 9]].find(([first, second]) => !recent.has(questionKey({ operation: "add", a: first, b: second })));
  if (!pair) return freshQuestion("add", Math.max(2, level), history, rng);
  const [first, second] = pair;
  return { a: first, b: second, answer: first + second, operation: "add", level: 1, options: [first + second - 1, first + second, first + second + 1, first + second + 2] };
}
function activityKey(task: Activity) {
  return JSON.stringify([task.prompt, task.sentences, task.visual, task.memory, task.skill === "Farklı olanı bul" ? task.choices : [...task.choices].sort()]);
}
export function freshAttention(kind: AttentionKind, level: number, seen: Record<string, number>, history: string[], rng = Math.random) {
  const pool = Array.from({ length: 64 }, (_, variant) => attentionVariant(kind, level, variant));
  const previous = new Set(history.slice(-12).flatMap(id => {
    const task = pool.find(candidate => candidate.id === id);
    return task ? [activityKey(task)] : [];
  }));
  const novel = pool.filter(task => !previous.has(activityKey(task)));
  const available = (novel.length ? novel : pool).filter(task => !seen[task.id]);
  const candidates = available.length ? available : novel.length ? novel : pool;
  return candidates[Math.floor(Math.max(0, Math.min(.999999, rng())) * candidates.length)];
}
export function nextStory(level: number, seen: Record<string, number>, exactLevel = false): Story | null {
  const remaining = stories.filter(story => (!exactLevel || story.level === level) && story.questions.some(question => !seen[question.id]));
  const selected = remaining.find(story => story.level >= level) ?? remaining[0];
  return selected ? { ...selected, questions: selected.questions.filter(question => !seen[question.id]) } : null;
}
export function readingStep(seen: Record<string, number>) {
  return stories.find(story => story.questions.some(question => !seen[question.id]))?.level ?? 3;
}
