import { PGlite } from "@electric-sql/pglite";
import { readFile } from "node:fs/promises";
import { after, before, beforeEach, test } from "node:test";
import assert from "node:assert/strict";

let database;
const firstUser = "10000000-0000-0000-0000-000000000001";
const secondUser = "20000000-0000-0000-0000-000000000002";
before(async () => {
  database = new PGlite();
  await database.exec(`create role anon; create role authenticated;
    create schema auth; grant usage on schema auth to anon, authenticated;
    create table auth.users(id uuid primary key, email text, raw_user_meta_data jsonb default '{}'::jsonb);
    create function auth.uid() returns uuid language sql stable as $$
      select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid;
    $$;`);
  await database.exec(await readFile(new URL("../../supabase/migrations/202610200001_star_league.sql", import.meta.url), "utf8"));
});
after(async () => { await database?.close(); });
beforeEach(async () => {
  await database.exec("delete from auth.users;");
  await database.query("insert into auth.users(id) values($1), ($2)", [firstUser, secondUser]);
});
function asUser(user, sql, parameters = [], role = "authenticated") {
  return database.transaction(async transaction => {
    await transaction.exec(`set local role ${role}`);
    await transaction.query("select set_config('request.jwt.claim.sub', $1, true)", [user ?? ""]);
    const result = await transaction.query(sql, parameters);
    return result.rows[0]?.value;
  });
}
const join = (user, nickname) => asUser(user, "select public.league_join($1) as value", [nickname]);
const question = user => asUser(user, "select public.league_question() as value");
const submit = (user, ticket, answer) => asUser(user, "select public.league_answer($1, $2) as value", [ticket, answer]);
async function correctAnswer(user) {
  return (await database.query("select expected from ritma_private.players where user_id = $1", [user])).rows[0].expected;
}

test("anon yalnız takma ad/yıldız tablosunu okuyabilir", async () => {
  assert.deepEqual(await asUser(null, "select public.league_board() as value", [], "anon"), []);
  for (const sql of ["select public.league_me()", "select public.league_question()", "select public.league_join('deneme')", "select public.league_visibility(false)", "select public.league_delete_account()"])
    await assert.rejects(asUser(null, sql, [], "anon"), /permission denied/);
  await assert.rejects(asUser(firstUser, "select * from ritma_private.players"), /permission denied/);
  await assert.rejects(asUser(firstUser, "update ritma_private.players set stars=999"), /permission denied/);
});
test("takma ad doğrulanır, benzersizdir ve kullanıcı diğerinin profilini okuyamaz", async () => {
  await assert.rejects(join(firstUser, "Gerçek Ad"), /Takma ad/);
  await assert.rejects(join(firstUser, null), /Takma ad/);
  assert.equal((await join(firstUser, "ritim_kedisi")).stars, 0);
  await assert.rejects(join(secondUser, "ritim_kedisi"), /kullanılıyor/);
  assert.equal(await asUser(secondUser, "select public.league_me() as value"), null);
  assert.equal((await join(firstUser, "yeni_isim")).nickname, "ritim_kedisi");
});
test("soru yanıtı gizlidir, başkasının sorusu ve tekrar gönderim puan vermez", async () => {
  await join(firstUser, "birinci"); await join(secondUser, "ikinci");
  const task = await question(firstUser);
  assert.deepEqual(Object.keys(task).sort(), ["id", "prompt"]);
  const answer = await correctAnswer(firstUser);
  await assert.rejects(submit(secondUser, task.id, answer), /tamamlandı|süresi/);
  const result = await submit(firstUser, task.id, answer);
  assert.equal(result.correct, true); assert.equal(result.player.stars, 1);
  await assert.rejects(submit(firstUser, task.id, answer), /tamamlandı|süresi/);
  assert.deepEqual(await asUser(null, "select public.league_board() as value", [], "anon"), [{ rank: 1, nickname: "birinci", stars: 1 }]);
});
test("yanlış cevap yıldız vermez; cevap tüketilir; ağ yeniden gönderiminde ödül çoğalmaz", async () => {
  await join(firstUser, "birinci");
  const task = await question(firstUser);
  const answer = await correctAnswer(firstUser);
  const result = await submit(firstUser, task.id, answer === 0 ? 1 : 0);
  assert.equal(result.correct, false); assert.equal(result.player.stars, 0);
  assert.equal(result.answer, answer);
  await assert.rejects(submit(firstUser, task.id, answer), /tamamlandı|süresi/);
});
test("soru hızı, süre dolumu ve günlük 20 yıldız/40 soru sunucuda sınırlıdır", async () => {
  await join(firstUser, "birinci");
  const task = await question(firstUser);
  await assert.rejects(question(firstUser), /bekleyip/);
  await database.query("update ritma_private.players set expires_at=now()-interval '1 minute' where user_id=$1", [firstUser]);
  await assert.rejects(submit(firstUser, task.id, 1), /süresi/);
  for (const column of ["daily_stars", "daily_questions"]) {
    await database.query("update ritma_private.players set issued_at=null, daily_stars=$2, daily_questions=$3 where user_id=$1", [firstUser, column === "daily_stars" ? 20 : 0, column === "daily_questions" ? 40 : 0]);
    await assert.rejects(question(firstUser), /yarın/);
  }
  await database.query("update ritma_private.players set score_day=current_date-1, issued_at=null where user_id=$1", [firstUser]);
  assert.ok((await question(firstUser)).id);
});
test("gizlenme yalnız kendi satırını gizler; hesap silme diğer hesabı etkilemez", async () => {
  await join(firstUser, "birinci"); await join(secondUser, "ikinci");
  await database.exec("update ritma_private.players set stars=3");
  await asUser(firstUser, "select public.league_visibility(false) as value");
  const board = await asUser(null, "select public.league_board() as value", [], "anon");
  assert.deepEqual(board.map(entry => entry.nickname), ["ikinci"]);
  await asUser(firstUser, "select public.league_delete_account() as value");
  assert.equal((await database.query("select count(*)::int as count from auth.users")).rows[0].count, 1);
  await assert.rejects(join(firstUser, "hayalet"), /foreign key/);
  assert.equal((await asUser(secondUser, "select public.league_me() as value")).stars, 3);
});
test("e-postasız kayıt yalnız teknik kullanıcı adını kabul eder; profil atomik oluşturulur", async () => {
  await database.exec(await readFile(new URL("../../supabase/migrations/202610200002_username_accounts.sql", import.meta.url), "utf8"));
  const newUser = "30000000-0000-0000-0000-000000000003";
  await assert.rejects(database.query("insert into auth.users(id,email) values($1,$2)", [newUser, "real@example.com"]), /kullanıcı adı/);
  await assert.rejects(database.query("insert into auth.users(id,email) values($1,$2)", [newUser, "ritim_kedisi@accounts.eylunica.netlify.app"]), /onaylanmalı/);
  await database.query("insert into auth.users(id,email,raw_user_meta_data) values($1,$2,$3)", [newUser, "ritim_kedisi@accounts.eylunica.netlify.app", { league_consent: true }]);
  assert.equal((await asUser(newUser, "select public.league_me() as value")).nickname, "ritim_kedisi");
  await assert.rejects(database.query("update auth.users set email='baska_isim@accounts.eylunica.netlify.app' where id=$1", [newUser]), /değiştirilemez/);
  await assert.rejects(database.query("insert into auth.users(id,email,raw_user_meta_data) values($1,$2,$3)", ["40000000-0000-0000-0000-000000000004", "ritim_kedisi@accounts.eylunica.netlify.app", { league_consent: true }]), /unique/);
  assert.equal((await database.query("select count(*)::int as count from auth.users where id='40000000-0000-0000-0000-000000000004'")).rows[0].count, 0);
});
