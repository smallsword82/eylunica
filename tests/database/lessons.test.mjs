import { PGlite } from "@electric-sql/pglite";
import { readFile } from "node:fs/promises";
import { before, after, beforeEach, test } from "node:test";
import assert from "node:assert/strict";
let database;
const first = "10000000-0000-0000-0000-000000000001", second = "20000000-0000-0000-0000-000000000002";
before(async () => {
  database = new PGlite();
  await database.exec(`create role anon; create role authenticated;
    create schema auth; grant usage on schema auth to anon, authenticated;
    create table auth.users(id uuid primary key, email text, raw_user_meta_data jsonb default '{}'::jsonb);
    create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid; $$;`);
  for (const migration of ["202610200001_star_league", "202610200002_username_accounts", "202610200003_lesson_scores", "202610200004_lesson_catalog"])
    await database.exec(await readFile(new URL(`../../supabase/migrations/${migration}.sql`, import.meta.url), "utf8"));
});
after(async () => database?.close());
beforeEach(async () => {
  await database.exec("delete from auth.users");
  await database.query("insert into auth.users(id,email,raw_user_meta_data) values($1,'birinci@accounts.eylunica.netlify.app','{\"league_consent\":true}'),($2,'ikinci@accounts.eylunica.netlify.app','{\"league_consent\":true}')", [first, second]);
});
function call(user, sql, parameters = [], role = "authenticated") {
  return database.transaction(async transaction => {
    await transaction.exec(`set local role ${role}`);
    await transaction.query("select set_config('request.jwt.claim.sub',$1,true)", [user ?? ""]);
    return (await transaction.query(sql, parameters)).rows[0]?.value;
  });
}
const start = (user, key = "math", math = { a: 8, b: 7, operation: "add" }) => call(user, "select public.lesson_start($1,$2) as value", [key, math]);
const answer = (user, id, value) => call(user, "select public.lesson_answer($1,$2) as value", [id, value]);
test("normal matematik sunucuda kontrol edilir; aynı bilet yeniden yıldız vermez", async () => {
  const ticket = await start(first);
  assert.deepEqual(Object.keys(ticket), ["id"]);
  await assert.rejects(answer(second, ticket.id, { answer: 15 }), /Geçersiz/);
  assert.equal((await answer(first, ticket.id, { answer: 15 })).stars, 1);
  assert.equal((await answer(first, ticket.id, { answer: 15 })).stars, 1);
  const wrong = await start(first);
  assert.equal((await answer(first, wrong.id, { answer: 14 })).stars, 1);
  assert.equal((await answer(first, wrong.id, { answer: 15 })).stars, 1);
});
test("okuma kanıtı, dikkat sırası ve konser kataloğu doğrulanır", async () => {
  const catalog = (await database.query("select key, expected from ritma_private.lesson_catalog order by key")).rows;
  assert.equal(catalog.length, 1233);
  for (const entry of [catalog.find(entry => entry.expected.evidence), catalog.find(entry => entry.key.startsWith("attention-instructions")), catalog.find(entry => entry.key.endsWith("-math"))]) {
    const ticket = await start(first, entry.key, null);
    const response = { ...entry.expected, ...(entry.expected.evidence ? { evidence: entry.expected.evidence[0] } : {}) };
    await answer(first, ticket.id, response);
  }
  assert.equal((await call(first, "select public.league_me() as value")).stars, 3);
  const reading = catalog.find(entry => entry.expected.evidence);
  const ticket = await start(first, reading.key, null);
  assert.equal((await answer(first, ticket.id, { answer: reading.expected.answer })).stars, 3);
});
test("istemci puan, doğru cevap veya bilinmeyen görev uyduramaz; özel tablolar kapalıdır", async () => {
  await assert.rejects(start(first, "fake-task", { answer: 15 }), /Bilinmeyen/);
  await assert.rejects(start(first, "math", { a: 2, b: 0, operation: "divide" }), /Geçersiz/);
  await assert.rejects(start(first, "math", { a: -1, b: 0, operation: "add" }), /Geçersiz/);
  await assert.rejects(call(null, "select public.lesson_start('math','{}')", [], "anon"), /permission denied/);
  for (const sql of ["select * from ritma_private.lesson_catalog", "select * from ritma_private.lesson_tickets", "select public.league_question()", "select public.league_answer(gen_random_uuid(),1)"])
    await assert.rejects(call(first, sql), /permission denied/);
  const ticket = await start(first);
  assert.equal((await answer(first, ticket.id, { answer: 0, correct: true, stars: 999 })).stars, 0);
});
test("günlük sınır, bilet süresi ve yeni gün güvenlidir; eski puan korunur", async () => {
  const ticket = await start(first);
  await database.query("update ritma_private.lesson_tickets set created_at=now()-interval '3 hours' where id=$1", [ticket.id]);
  assert.equal((await answer(first, ticket.id, { answer: 15 })).stars, 0);
  await database.exec("update ritma_private.players set stars=7,daily_stars=20,score_day=(now() at time zone 'Europe/Istanbul')::date");
  assert.equal(await start(first), null);
  await database.exec("update ritma_private.players set score_day=(now() at time zone 'Europe/Istanbul')::date-1");
  const newDay = await start(first);
  const player = await answer(first, newDay.id, { answer: 15 });
  assert.equal(player.stars, 8); assert.equal(player.dailyStars, 1);
  const board = await call(null, "select public.league_board() as value", [], "anon");
  assert.deepEqual(Object.keys(board[0]).sort(), ["nickname", "rank", "stars"]);
});
