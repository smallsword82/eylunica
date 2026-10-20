import { build } from "esbuild";
import { writeFile, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const temporary = await mkdtemp(join(tmpdir(), "eylunica-catalog-"));
try {
  const target = join(temporary, "catalog.mjs");
  await build({ stdin: { contents: `export { stories } from './src/reading-engine'; export { attentionKinds, attentionVariant } from './src/attention-engine'; export { concert } from './src/concert-engine';`, resolveDir: process.cwd() }, outfile: target, bundle: true, platform: "node", format: "esm" });
  const { stories, attentionKinds, attentionVariant, concert } = await import(pathToFileURL(target));
  const tasks = stories.flatMap(story => story.questions);
  for (let level = 1; level <= 3; level++) {
    for (const kind of attentionKinds) for (let variant = 0; variant < 64; variant++) tasks.push(attentionVariant(kind, level, variant));
    for (let round = 0; round < 5; round++) tasks.push(...concert(level, round).tasks);
  }
  const records = tasks.map(task => ({ key: task.id, expected: task.sequence ? { sequence: task.sequence } : { answer: task.answer, ...(task.evidence ? { evidence: task.evidence } : {}) } }));
  const data = JSON.stringify(records).replaceAll("'", "''");
  const output = process.argv[2] || "supabase/migrations/202610200005_lesson_catalog_v2.sql";
  await writeFile(output, `begin;\ninsert into ritma_private.lesson_catalog(key, expected)\nselect item->>'key', item->'expected' from jsonb_array_elements('${data}'::jsonb) item\non conflict(key) do update set expected = excluded.expected;\ncommit;\n`);
  console.log(`${records.length} eğitim sorusu doğrulama kataloğuna yazıldı.`);
} finally { await rm(temporary, { recursive: true }); }
