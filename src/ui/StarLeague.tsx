import { useEffect, useRef, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { leagueCall, onlineClient, type Leader, type LeaguePlayer, type LeagueQuestion } from "../online/client";
import { playAnswerEffect } from "../audio";
import { stopNarration } from "../audio/narration";
import type { UsageDomain } from "../time-engine";
import { accountAddress } from "../online/username";

function message(error: unknown) {
  const text = error instanceof Error ? error.message : "Bağlantı kurulamadı. İnternetini kontrol edip yeniden dene.";
  if (/Invalid login credentials/i.test(text)) return "Kullanıcı adı veya şifre doğru değil.";
  if (/already registered|already been registered|user_already_exists/i.test(text)) return "Bu kullanıcı adı alınmış. Başka bir ad seç veya mevcut hesabına giriş yap.";
  if (/weak_password|at least 10 characters/i.test(text)) return "Şifre en az 10 karakter olmalı.";
  if (/Database error saving new user/i.test(text)) return "Hesap oluşturulamadı. Kullanıcı adını ve paylaşım onayını kontrol edip yeniden dene.";
  if (/rate limit|too many/i.test(text)) return "Kısa sürede çok sayıda istek oldu. Biraz bekleyip yeniden dene.";
  if (/fetch|network/i.test(text)) return "İnternet bağlantısı kurulamadı. Yerel öğrenme bölümleri çevrimdışı kullanılabilir.";
  return text;
}

function AccountForm() {
  const [creating, setCreating] = useState(false), [username, setUsername] = useState(""), [password, setPassword] = useState("");
  const [consent, setConsent] = useState(false), [busy, setBusy] = useState(false), [error, setError] = useState("");
  const locked = useRef(false);
  async function signIn(event: React.FormEvent) {
    event.preventDefault();
    if (locked.current || (creating && !consent)) return;
    locked.current = true;
    setBusy(true); setError("");
    try {
      const email = accountAddress(username);
      const result = creating
        ? await onlineClient.auth.signUp({ email, password, options: { data: { league_consent: true } } })
        : await onlineClient.auth.signInWithPassword({ email, password });
      if (result.error) throw result.error;
      if (!result.data.session) throw new Error("Hesap girişi tamamlanamadı. Yeniden giriş yapmayı dene.");
      setPassword("");
    } catch (failure) { setError(message(failure)); }
    finally { locked.current = false; setBusy(false); }
  }
  return <section className="league-account">
    <h2>{creating ? "Kendi lig hesabını oluştur" : "Lig hesabına giriş"}</h2>
    <p>Telefon, e-posta veya Google hesabı gerekmez. Gerçek adın yerine eğlenceli bir takma ad kullan.</p>
    <form onSubmit={event => { void signIn(event); }}>
      <label>Kullanıcı adı<input required pattern="[A-Za-z][A-Za-z0-9_]{2,19}" minLength={3} maxLength={20} autoComplete="username" autoCapitalize="none" spellCheck={false} value={username} onChange={event => setUsername(event.target.value)} disabled={busy} /></label>
      <p className="small">3–20 karakter; a-z, 0-9 ve alt çizgi. Örnek: ritim_kedisi.</p>
      <label>Şifre<input type="password" required minLength={creating ? 10 : 1} maxLength={64} autoComplete={creating ? "new-password" : "current-password"} value={password} onChange={event => setPassword(event.target.value)} disabled={busy} /></label>
      {creating && <label className="league-consent"><input type="checkbox" required checked={consent} onChange={event => setConsent(event.target.checked)} disabled={busy} />Hesabı yetişkin/veli olarak yönetiyorum. Kullanıcı adım ve lig yıldızlarımın herkese açık tabloda görüneceğini, şifre unutulursa otomatik sıfırlama yapılamayacağını biliyorum.</label>}
      <button className="primary" disabled={busy || (creating && !consent)}>{busy ? "Bekleniyor…" : creating ? "Hesabımı oluştur →" : "Giriş yap →"}</button>
    </form>
    <button className="text-button" disabled={busy} onClick={() => { setCreating(!creating); setPassword(""); setError(""); }}>{creating ? "Hesabım var, giriş yap" : "Yeni hesap oluştur"}</button>
    <p className="small">Şifreni güvenli bir yerde sakla. E-posta alınmadığından şifre sıfırlama bağlantısı gönderemeyiz.</p>
    {error && <p role="alert">{error}</p>}
  </section>;
}

function LeagueMember({ refreshBoard, onActivity, onTransition, paused }: {
  refreshBoard: () => void; onActivity: (domain: UsageDomain | null, playing?: boolean) => void;
  onTransition: (action: () => void, startsTask?: boolean) => void; paused: boolean;
}) {
  const [player, setPlayer] = useState<LeaguePlayer | null>(null), [loaded, setLoaded] = useState(false);
  const [nickname, setNickname] = useState(""), [consent, setConsent] = useState(false);
  const [question, setQuestion] = useState<LeagueQuestion | null>(null), [answer, setAnswer] = useState("");
  const [result, setResult] = useState(""), [error, setError] = useState("");
  const [busy, setBusy] = useState(false), [deleting, setDeleting] = useState(false);
  const [loadVersion, setLoadVersion] = useState(0);
  const locked = useRef(false);
  useEffect(() => {
    let mounted = true;
    setError("");
    leagueCall<LeaguePlayer | null>("league_me").then(value => { if (mounted) { setPlayer(value); setLoaded(true); } }).catch(failure => { if (mounted) setError(message(failure)); });
    return () => { mounted = false; };
  }, [loadVersion]);
  useEffect(() => {
    onActivity(question && !result ? "math" : "other", !!question && !result);
    return () => onActivity("other", false);
  }, [!!question, !!result, onActivity]);
  async function run(action: () => Promise<void>) {
    if (locked.current) return;
    locked.current = true; setBusy(true); setError("");
    try { await action(); } catch (failure) { setError(message(failure)); }
    finally { locked.current = false; setBusy(false); }
  }
  function nextQuestion() {
    onTransition(() => { void run(async () => {
      const value = await leagueCall<LeagueQuestion>("league_question");
      setQuestion(value); setAnswer(""); setResult("");
    }); });
  }
  return <section className="league-account">
    {!loaded ? <><p role="status">Hesap yükleniyor…</p>{error && <><p role="alert">{error}</p><button className="secondary" onClick={() => setLoadVersion(value => value + 1)}>Hesabı yeniden yükle</button></>}</> : !player ? <>
      <h2>Tabloda hangi takma adla görünmek istersin?</h2>
      <p>Gerçek adını, okulunu veya doğum yılını yazma. Örnek: ritim_kedisi. Takma adın hesabında sabit kalır.</p>
      <form onSubmit={event => { event.preventDefault(); void run(async () => {
        if (!consent) throw new Error("Tabloda paylaşılacak bilgileri onayla.");
        setPlayer(await leagueCall<LeaguePlayer>("league_join", { p_nickname: nickname.trim().toLowerCase() })); refreshBoard();
      }); }}>
        <label>Lig takma adı<input required pattern="[a-z][a-z0-9_]{2,19}" minLength={3} maxLength={20} autoComplete="off" value={nickname} onChange={event => setNickname(event.target.value)} /></label>
        <p className="small">3–20 karakter; a-z, 0-9 ve alt çizgi. Harfle başlar.</p>
        <label className="league-consent"><input type="checkbox" required checked={consent} onChange={event => setConsent(event.target.checked)} />Bu takma ad ve lig yıldızlarının herkesin görebileceği tabloda yer almasını istiyorum. İstersem sıralamadan gizlenebilirim.</label>
        <button className="primary" disabled={busy}>Takma adımla lige katıl →</button>
      </form>
    </> : <>
      <div className="league-player"><strong>{player.nickname}</strong><span>✦ {player.stars} lig yıldızı</span></div>
      <p>Bugün {player.dailyStars}/20 yıldız. Hız puanı yok; düşünmek için acele etme.</p>
      {!question ? <button className="primary" disabled={busy || paused} onClick={nextQuestion}>Lig sorusuna başla →</button> : <section className="league-question" aria-label="Çevrimiçi lig sorusu">
        <h2>{question.prompt}</h2>
        {!result ? <form onSubmit={event => { event.preventDefault(); if (paused) return; void run(async () => {
          stopNarration(); void playAnswerEffect();
          const value = await leagueCall<{ correct: boolean; answer: number; player: LeaguePlayer }>("league_answer", { p_id: question.id, p_answer: Number(answer) });
          setPlayer(value.player); setResult(value.correct ? "Harika! Bir lig yıldızı kazandın." : `Birlikte öğrendik. Doğru yanıt ${value.answer}. Yeni soruda yeniden keşfedelim.`);
          refreshBoard();
        }); }}>
          <label>Lig yanıtın<input type="number" inputMode="numeric" required min={0} max={100} step={1} value={answer} onChange={event => setAnswer(event.target.value)} disabled={busy || paused} /></label>
          <button className="primary" disabled={busy || paused || !answer}>Yanıtımı kontrol et</button>
        </form> : <><p role="status">{result}</p><button className="primary" disabled={busy || paused} onClick={nextQuestion}>Sıradaki lig sorusu →</button></>}
        {error && <button className="secondary" disabled={busy || paused} onClick={nextQuestion}>Yeni soru aç</button>}
      </section>}
      <label className="league-consent"><input type="checkbox" checked={player.visible} disabled={busy} onChange={event => {
        if (locked.current) return;
        const visible = event.target.checked;
        const previous = player;
        setPlayer({ ...player, visible });
        void run(async () => {
          try { setPlayer(await leagueCall<LeaguePlayer>("league_visibility", { p_visible: visible })); refreshBoard(); }
          catch (failure) { setPlayer(previous); throw failure; }
        });
      }} />Takma adım puan tablosunda görünsün</label>
    </>}
    {loaded && error && <p role="alert">{error}</p>}
    <div className="league-actions">
      <button className="secondary" disabled={busy} onClick={() => { void run(async () => { const result = await onlineClient.auth.signOut(); if (result.error) throw result.error; }); }}>Çıkış yap</button>
      <button className="text-button" disabled={busy} onClick={() => setDeleting(true)}>Hesabımı sil</button>
    </div>
    {deleting && <section className="league-delete" aria-label="Hesap silme onayı"><h3>Hesabın ve lig yıldızların kalıcı olarak silinsin mi?</h3><p>Bu işlem geri alınamaz. Cihazdaki yerel öğrenme ilerlemesi silinmez.</p>
      <button className="secondary" disabled={busy} onClick={() => setDeleting(false)}>Vazgeç</button>{" "}
      <button className="secondary" disabled={busy} onClick={() => { void run(async () => { await leagueCall("league_delete_account"); await onlineClient.auth.signOut({ scope: "local" }); refreshBoard(); }); }}>Evet, hesabımı kalıcı sil</button>
    </section>}
  </section>;
}

export function StarLeague({ onBack, onActivity, onTransition, paused }: {
  onBack: () => void; onActivity: (domain: UsageDomain | null, playing?: boolean) => void;
  onTransition: (action: () => void, startsTask?: boolean) => void; paused: boolean;
}) {
  const [session, setSession] = useState<Session | null>(null), [ready, setReady] = useState(false);
  const [board, setBoard] = useState<Leader[]>([]);
  const [error, setError] = useState(""), [refresh, setRefresh] = useState(0), [boardReady, setBoardReady] = useState(false);
  useEffect(() => {
    let mounted = true;
    onlineClient.auth.getSession().then(({ data, error }) => { if (mounted) { setSession(data.session); setReady(true); if (error) setError(message(error)); } }).catch(failure => { if (mounted) { setReady(true); setError(message(failure)); } });
    const { data } = onlineClient.auth.onAuthStateChange((event, value) => {
      if (!mounted) return;
      setSession(value); setReady(true);
    });
    return () => { mounted = false; data.subscription.unsubscribe(); };
  }, []);
  useEffect(() => {
    let mounted = true;
    setError(""); setBoardReady(false);
    leagueCall<Leader[]>("league_board").then(value => { if (mounted) { setBoard(value); setBoardReady(true); } }).catch(failure => { if (mounted) setError(message(failure)); });
    return () => { mounted = false; };
  }, [refresh]);
  return <main className="subpage league-page">
    <button className="text-button" onClick={onBack}>← Öğrenme haritasına dön</button>
    <div className="eyebrow muted">BİRLİKTE PARLAYALIM</div>
    <h1>RİTMA Yıldız Ligi</h1>
    <p>Takma adınla katıl, düşünerek yıldız topla. Başkalarını geçmek zorunda değilsin; her keşif değerlidir.</p>
    <div className="league-layout">
      {!ready ? <p role="status">Giriş kontrol ediliyor…</p> : session ? <LeagueMember key={session.user.id} refreshBoard={() => setRefresh(value => value + 1)} onActivity={onActivity} onTransition={onTransition} paused={paused} /> : <AccountForm />}
      <section className="league-board" aria-label="Yıldız puan tablosu">
        <h2>✦ Yıldız puan tablosu</h2><p>En çok lig yıldızı toplayan ilk 50 takma ad.</p>
        <button className="secondary" onClick={() => setRefresh(value => value + 1)}>Tabloyu yenile</button>
        {error ? <p role="alert">{error}</p> : !boardReady ? <p role="status">Tablo yükleniyor…</p> : !board.length ? <p>Henüz lig yıldızı yok. İlk keşif senin olabilir!</p> : <table><caption>Çevrimiçi lig yıldızları</caption><thead><tr><th scope="col">Sıra</th><th scope="col">Takma ad</th><th scope="col">Yıldız</th></tr></thead><tbody>{board.map(leader => <tr key={leader.nickname}><td>{leader.rank <= 3 ? ["🥇", "🥈", "🥉"][leader.rank - 1] : leader.rank}</td><th scope="row">{leader.nickname}</th><td>✦ {leader.stars}</td></tr>)}</tbody></table>}
      </section>
    </div>
    <section className="league-rules"><h2>Adil ve güvenli keşif</h2>
      <p>Lig için internet gerekir. Yalnız bu ekranda sunucunun doğruladığı doğru yanıtlar lig yıldızı verir. Her soru bir kez sayılır; hız bonusu yoktur. Günlük en fazla 20 yıldız ve 40 soru vardır.</p>
      <p>Eski yerel yıldızların ve derslerin cihazında korunur; puan tablosuna aktarılmaz. Bu tabloda yalnız takma ad ve lig yıldızı paylaşılır; e-posta, gerçek ad ve öğrenme geçmişi gösterilmez. Mesajlaşma yoktur. İstediğin zaman sıralamadan gizlenebilir veya hesabını silebilirsin.</p>
      <p>Kullanıcı adı, kimlik doğrulama ve lig bilgileri Supabase’de işlenir. Gerçek e-posta alınmaz; kullanıcı adından yalnız teknik bir hesap kimliği üretilir, e-posta gönderilmez. Şifren Supabase Auth ile korunur, puan tablosunda görünmez ve otomatik sıfırlanamaz. Paylaşılan cihazda işin bitince çıkış yap. Çevrimdışı bölümler hesap gerektirmez.</p>
    </section>
  </main>;
}
