import { createClient } from "@supabase/supabase-js";
import { randomBytes } from "node:crypto";
import assert from "node:assert/strict";

const url = process.env.SUPABASE_URL || "https://shtryogkcorfhoeslnco.supabase.co";
const key = process.env.SUPABASE_PUBLISHABLE_KEY || "sb_publishable_frHqwJ8wECaVvsJXNUwxMg_phY5K16k";
const client = () => createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } });
const guest = client();
const accounts = [];
let checks = 0;
function verify(value, description) { assert.ok(value, description); checks++; console.log(`PASS ${description}`); }
async function rpc(account, name, parameters) {
  const response = await account.rpc(name, parameters);
  assert.ifError(response.error);
  return response.data;
}
try {
  verify(Array.isArray(await rpc(guest, "league_board")), "misafir yalnız açık tabloyu okuyabiliyor");
  verify(!!(await guest.rpc("league_me")).error, "girişsiz profil erişimi reddediliyor");
  const weakAccount = client();
  const weak = await weakAccount.auth.signUp({ email: `check_${randomBytes(5).toString("hex")}@accounts.eylunica.netlify.app`, password: "aB3!xy", options: { data: { league_consent: true } } });
  if (weak.data.session) accounts.push(weakAccount);
  verify(!!weak.error && !weak.data.session, "on karakterden kısa parola sunucuda reddediliyor");
  for (let index = 0; index < 2; index++) {
    const account = client();
    const nickname = `check_${randomBytes(5).toString("hex")}`;
    const password = randomBytes(24).toString("base64url");
    const email = `${nickname}@accounts.eylunica.netlify.app`;
    const signup = await account.auth.signUp({ email, password, options: { data: { league_consent: true } } });
    assert.ifError(signup.error);
    accounts.push(account);
    verify(!!signup.data.session, "e-posta ve telefon olmadan test hesabı oluşturuluyor");
    const profile = await rpc(account, "league_me");
    verify(profile.nickname === nickname && profile.stars === 0, "kayıtta profil atomik oluşturuluyor");
    const invalid = await guest.auth.signInWithPassword({ email, password: randomBytes(20).toString("hex") });
    verify(!!invalid.error, "yanlış parola reddediliyor");
    const login = await account.auth.signInWithPassword({ email, password });
    assert.ifError(login.error);
    verify(!!login.data.session, "kullanıcı adı teknik kimliği ve parola ile tekrar giriş başarılı");
  }
  const [first, second] = accounts;
  const task = await rpc(first, "league_question");
  verify(!("answer" in task), "sorunun doğru cevabı istemciye sızmıyor");
  const parts = /^(\d+) ([+−×]) (\d+) = \?$/.exec(task.prompt);
  assert.ok(parts);
  const firstNumber = Number(parts[1]), secondNumber = Number(parts[3]);
  const answer = parts[2] === "+" ? firstNumber + secondNumber : parts[2] === "−" ? firstNumber - secondNumber : firstNumber * secondNumber;
  verify(!!(await second.rpc("league_answer", { p_id: task.id, p_answer: answer })).error, "başka hesaba ait soru puan vermiyor");
  const submissions = await Promise.all([first.rpc("league_answer", { p_id: task.id, p_answer: answer }), first.rpc("league_answer", { p_id: task.id, p_answer: answer })]);
  verify(submissions.filter(result => !result.error).length === 1, "eşzamanlı tekrar gönderimde yalnız bir ödül veriliyor");
  const profile = await rpc(first, "league_me");
  verify(profile.stars === 1 && profile.dailyStars === 1, "sunucu puanı yalnız bir artırıyor");
  const board = await rpc(guest, "league_board");
  verify(board.some(row => row.nickname === profile.nickname && row.stars === 1), "puan başka oturumun açık tablosunda görünüyor");
  verify(board.every(row => Object.keys(row).every(field => ["rank", "nickname", "stars"].includes(field))), "tablo yalnız takma ad, sıra ve yıldız döndürüyor");
  await rpc(first, "league_visibility", { p_visible: false });
  verify(!(await rpc(guest, "league_board")).some(row => row.nickname === profile.nickname), "gizlenme diğer oturumlara yansıyor");
  const raw = await fetch(`${url}/rest/v1/players?select=*`, { headers: { apikey: key, "Accept-Profile": "ritma_private" } });
  verify(raw.status >= 400, "özel tablo Data API üzerinden açılmıyor");
} finally {
  for (const account of accounts) {
    await rpc(account, "league_delete_account");
    await account.auth.signOut({ scope: "local" });
  }
  console.log(`${checks} canlı kontrol tamamlandı; oluşturulan test hesapları temizlendi.`);
}
