import { useEffect, useRef, useState } from "react";
import { leagueCall, onlineClient, type Leader, type LeaguePlayer } from "../online/client";
import { accountAddress } from "../online/username";
import { useAccount } from "../online/useAccount";

function message(error: unknown) {
  const text = error instanceof Error ? error.message : "Bağlantı kurulamadı. Yeniden dene.";
  if (/Invalid login credentials/i.test(text)) return "Kullanıcı adı veya şifre doğru değil.";
  if (/already registered|already been registered|user_already_exists/i.test(text)) return "Bu kullanıcı adı alınmış. Başka bir ad seç veya giriş yap.";
  if (/weak_password|at least 10 characters/i.test(text)) return "Şifre en az 10 karakter olmalı.";
  if (/rate limit|too many/i.test(text)) return "Biraz bekleyip yeniden dene.";
  if (/fetch|network/i.test(text)) return "İnternet bağlantısı kurulamadı. Cihazdaki öğrenmene çevrimdışı devam edebilirsin.";
  return text;
}

export function AccountForm() {
  const [creating, setCreating] = useState(true), [username, setUsername] = useState(""), [password, setPassword] = useState("");
  const [consent, setConsent] = useState(false), [busy, setBusy] = useState(false), [error, setError] = useState("");
  const locked = useRef(false);
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (locked.current || (creating && !consent)) return;
    locked.current = true; setBusy(true); setError("");
    try {
      const email = accountAddress(username);
      const result = creating
        ? await onlineClient.auth.signUp({ email, password, options: { data: { league_consent: true } } })
        : await onlineClient.auth.signInWithPassword({ email, password });
      if (result.error) throw result.error;
      if (!result.data.session) throw new Error("Giriş tamamlanamadı. Yeniden dene.");
      setPassword("");
    } catch (failure) { setError(message(failure)); }
    finally { locked.current = false; setBusy(false); }
  }
  return <section className="league-account">
    <h1>{creating ? "eylunica’ya hoş geldin" : "Yeniden hoş geldin"}</h1>
    <p>{creating ? "Bir kullanıcı adı ve şifre seç, keşfe başlayalım." : "Hesabınla giriş yap, keşfe devam edelim."} Telefon ve e-posta gerekmez.</p>
    <form onSubmit={event => { void submit(event); }}>
      <label>Kullanıcı adı<input required pattern="[A-Za-z][A-Za-z0-9_]{2,19}" minLength={3} maxLength={20} autoComplete="username" autoCapitalize="none" spellCheck={false} value={username} onChange={event => setUsername(event.target.value)} disabled={busy} /></label>
      <p className="small">Sitedeki adın bu olacak. Gerçek ad yerine takma ad kullan: örneğin eylul_7. 3–20 karakter, a-z, 0-9 veya _.</p>
      <label>Şifre<input type="password" required minLength={creating ? 10 : 1} maxLength={64} autoComplete={creating ? "new-password" : "current-password"} value={password} onChange={event => setPassword(event.target.value)} disabled={busy} /></label>
      <p className="small">En az 10 karakter. Şifreni sakla; e-posta alınmadığı için otomatik şifre sıfırlama yok.</p>
      {creating && <label className="league-consent"><input type="checkbox" required checked={consent} onChange={event => setConsent(event.target.checked)} disabled={busy} />Veliyim/yetişkinim; takma adın ve kazanılan yıldızların puan tablosunda paylaşılmasını onaylıyorum.</label>}
      <button className="primary" disabled={busy || (creating && !consent)}>{busy ? "Bekleniyor…" : creating ? "Kayıt ol ve başla →" : "Giriş yap →"}</button>
    </form>
    <button className="text-button" disabled={busy} onClick={() => { setCreating(!creating); setPassword(""); setError(""); }}>{creating ? "Hesabım var, giriş yap" : "Yeni hesap oluştur"}</button>
    {error && <p role="alert">{error}</p>}
  </section>;
}

export function StarLeague({ onBack }: { onBack: () => void }) {
  const account = useAccount();
  const [player, setPlayer] = useState<LeaguePlayer | null>(null), [board, setBoard] = useState<Leader[]>([]);
  const [error, setError] = useState(""), [refresh, setRefresh] = useState(0), [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false), [deleting, setDeleting] = useState(false);
  const locked = useRef(false);
  useEffect(() => {
    let mounted = true;
    setError(""); setReady(false);
    Promise.all([leagueCall<Leader[]>("league_board"), account.session ? leagueCall<LeaguePlayer | null>("league_me") : Promise.resolve(null)])
      .then(([leaders, member]) => { if (mounted) { setBoard(leaders); setPlayer(member); setReady(true); } })
      .catch(failure => { if (mounted) setError(message(failure)); });
    return () => { mounted = false; };
  }, [refresh, account.session?.user.id]);
  async function run(action: () => Promise<void>) {
    if (locked.current) return;
    locked.current = true; setBusy(true); setError("");
    try { await action(); } catch (failure) { setError(message(failure)); }
    finally { locked.current = false; setBusy(false); }
  }
  return <main className="subpage league-page">
    <button className="text-button" onClick={onBack}>← Öğrenme haritasına dön</button>
    <h1>eylunica Yıldız Tablosu</h1>
    <p>Yeni bir görev yok! Matematik, okuma, dikkat, konser ve arena alıştırmalarındaki doğru ilk yanıtlarınla yıldız kazan.</p>
    {account.session ? <section className="league-account">
      {player && <><div className="league-player"><strong>{player.nickname}</strong><span>✦ {player.stars} yıldız</span></div>
        <p>Bugün {player.dailyStars}/20 çevrimiçi yıldız. Derslerde devam edebilirsin; hız bonusu yok.</p>
        <button className="primary" onClick={onBack}>Eğitimlere devam et →</button>
        <label className="league-consent"><input type="checkbox" checked={player.visible} disabled={busy} onChange={event => {
          if (locked.current) return;
          const visible = event.target.checked;
          const previous = player;
          setPlayer({ ...player, visible });
          void run(async () => {
            try { setPlayer(await leagueCall<LeaguePlayer>("league_visibility", { p_visible: visible })); setRefresh(value => value + 1); }
            catch (failure) { setPlayer(previous); throw failure; }
          });
        }} />Takma adım puan tablosunda görünsün</label></>}
      <div className="league-actions"><button className="secondary" disabled={busy} onClick={() => { void run(async () => { const result = await onlineClient.auth.signOut(); if (result.error) throw result.error; }); }}>Çıkış yap</button>
        <button className="text-button" disabled={busy} onClick={() => setDeleting(true)}>Hesabımı sil</button></div>
      {deleting && <section aria-label="Hesap silme onayı"><h2>Hesabın ve çevrimiçi yıldızların kalıcı silinsin mi?</h2><p>Cihazdaki eski ilerlemen silinmez.</p>
        <button className="secondary" disabled={busy} onClick={() => setDeleting(false)}>Vazgeç</button>
        <button className="secondary" disabled={busy} onClick={() => { void run(async () => { await leagueCall("league_delete_account"); await onlineClient.auth.signOut({ scope: "local" }); setRefresh(value => value + 1); }); }}>Evet, hesabımı kalıcı sil</button></section>}
    </section> : <AccountForm />}
    <section className="league-board" aria-label="Yıldız puan tablosu"><h2>✦ Yıldız puan tablosu</h2>
      <button className="secondary" onClick={() => setRefresh(value => value + 1)}>Tabloyu yenile</button>
      {error ? <p role="alert">{error}</p> : !ready ? <p role="status">Tablo yükleniyor…</p> : !board.length ? <p>Henüz yıldız yok. İlk keşif senin olabilir!</p> : <table><caption>Çevrimiçi eğitim yıldızları · ilk 50</caption><thead><tr><th scope="col">Sıra</th><th scope="col">Takma ad</th><th scope="col">Yıldız</th></tr></thead><tbody>{board.map(leader => <tr key={leader.nickname}><td>{leader.rank <= 3 ? ["🥇", "🥈", "🥉"][leader.rank - 1] : leader.rank}</td><th scope="row">{leader.nickname}</th><td>✦ {leader.stars}</td></tr>)}</tbody></table>}
    </section>
    <section className="league-rules"><h2>Birlikte, adilce öğrenelim</h2>
      <p>Yalnız giriş yaptıktan sonra internet bağlantısıyla çözülen mevcut eğitim soruları sayılır. İlk yanıt bir kez değerlendirilir; ipucu yıldız azaltmaz. Günlük en fazla 20 çevrimiçi yıldız vardır. Cihazdaki eski yıldızların korunur; doğrulanamadıkları için tabloya aktarılmaz.</p>
      <p>Herkese yalnız takma adın ve yıldızların gösterilir. Gizlenebilir veya hesabını silebilirsin. Şifren Supabase Auth ile korunur. Paylaşılan cihazda çıkış yap. Öğrenme geçmişin bu cihazda kalır.</p>
    </section>
  </main>;
}
