import { useEffect, useRef, useState } from "react";
import {
  dayTotal,
  formatDuration,
  todayUsage,
  weekUsage,
  type UsageDomain,
} from "../time-engine";
import type { Wellbeing } from "../wellbeing/useWellbeing";
export function ParentTimePanel({ wellbeing: w }: { wellbeing: Wellbeing }) {
  const [limited, setLimited] = useState(
      w.state.settings.dailyLimitMinutes !== null,
    ),
    [minutes, setMinutes] = useState(
      String(w.state.settings.dailyLimitMinutes || 15),
    ),
    [reminders, setReminders] = useState(w.state.settings.breakReminders),
    [message, setMessage] = useState("");
  useEffect(() => {
    setLimited(w.state.settings.dailyLimitMinutes !== null);
    setMinutes(String(w.state.settings.dailyLimitMinutes || 15));
    setReminders(w.state.settings.breakReminders);
  }, [w.state.settings.dailyLimitMinutes, w.state.settings.breakReminders]);
  const today = todayUsage(w.state, w.now),
    week = weekUsage(w.state, w.now);
  return (
    <section className="parent-time-panel" aria-labelledby="parent-time-title">
      <h2 id="parent-time-title">Oyun süresi ve molalar</h2>
      <p>
        Önerilen günlük öğrenme süresi 15 dakikadır. Varsayılan kullanım
        serbesttir; öneriye ulaşmak oyunu kapatmaz ve süre için yıldız verilmez.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const n = Number(minutes);
          if (limited && (!Number.isInteger(n) || n < 1 || n > 1440)) {
            setMessage("Günlük sınır 1–1440 arasında tam dakika olmalı.");
            return;
          }
          w.settings({
            dailyLimitMinutes: limited ? n : null,
            breakReminders: reminders,
          });
          setMessage("Ayarlar güncellendi.");
        }}
      >
        <fieldset disabled={!w.loaded || !w.canConfigure}>
          <legend>Kullanım biçimi</legend>
          <label>
            <input
              type="radio"
              name="usage-mode"
              checked={!limited}
              onChange={() => setLimited(false)}
            />{" "}
            Serbest kullanım (varsayılan)
          </label>
          <label>
            <input
              type="radio"
              name="usage-mode"
              checked={limited}
              onChange={() => setLimited(true)}
            />{" "}
            Günlük süre sınırı
          </label>
          {limited && (
            <label htmlFor="daily-limit">
              Günlük sınır (dakika)
              <input
                id="daily-limit"
                type="number"
                min="1"
                max="1440"
                step="1"
                required
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
              />
            </label>
          )}
          <label>
            <input
              type="checkbox"
              checked={reminders}
              onChange={(e) => setReminders(e.target.checked)}
            />{" "}
            Mola hatırlatmaları açık
          </label>
          <button className="primary" type="submit">
            Süre ayarlarını kaydet
          </button>
        </fieldset>
        <p role="status">{message}</p>
      </form>
      <div className="time-policy">
        <h3>İsteğe bağlı sınır nasıl uygulanır?</h3>
        <p>
          Sınır dolunca açık soru tamamlanabilir; ardından yeni soru veya görev
          başlatılamaz. Uygulama kapanmaz. Yıldızlar ve ilerleme korunur.
          Ebeveyn ayarları erişilebilir kalır; sınır değiştirilebilir veya
          kaldırılabilir. Yeni yerel takvim gününde günlük sayaç yeniden başlar.
        </p>
        <p>
          Bu panel PIN ile kilitli değildir. Sınır, cihazdaki uygulama içi
          kuraldır.
        </p>
        <p>
          15. dakika bilgisi günlük bir kez gösterilir. Mola önerileri 25.
          dakikadan sonra, önerinin gösterildiği andan itibaren yaklaşık 20
          dakikalık etkin kullanım aralıklarıyla tekrarlanır. Yalnızca soru veya
          bölüm geçişinde gösterilir. Mola önerilerini kapatmak 15 dakika
          bilgisini kapatmaz.
        </p>
      </div>
      <h3>Bu cihazdaki etkin kullanım</h3>
      <p>
        Yalnızca uygulama görünür ve ön plandayken sayılır. Arka plan, ebeveyn
        paneli ve mola ekranları sayılmaz. Akademi seçimi ve ana menü
        “Menü/diğer” olarak gösterilir. Veriler cihazda tutulur; son 90 takvim
        günü saklanır.
      </p>
      <div className="usage-totals">
        <div>
          <strong>{formatDuration(dayTotal(today))}</strong>
          <span>Bugün · {new Date(w.now).toLocaleDateString("tr-TR")}</span>
        </div>
        <div>
          <strong>{formatDuration(dayTotal(week))}</strong>
          <span>Son 7 takvim günü (bugün dahil)</span>
        </div>
      </div>
      <dl className="usage-domains">
        {(
          [
            ["math", "Matematik"],
            ["reading", "Okuma"],
            ["attention", "Dikkat"],
            ["other", "Menü/diğer"],
          ] as [UsageDomain, string][]
        ).map(([key, label]) => (
          <div key={key}>
            <dt>{label}</dt>
            <dd>Bugün: {formatDuration(today[key])}</dd>
            <dd>Son 7 gün: {formatDuration(week[key])}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
export function TimeNotice({
  wellbeing: w,
  onParent,
  onHome,
}: {
  wellbeing: Wellbeing;
  onParent: () => void;
  onHome: () => void;
}) {
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!w.notice) return;
    const previous = document.activeElement as HTMLElement | null;
    box.current?.querySelector<HTMLButtonElement>("button")?.focus();
    const trap = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const buttons =
        box.current?.querySelectorAll<HTMLButtonElement>("button");
      if (!buttons?.length) return;
      const first = buttons[0],
        last = buttons[buttons.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", trap);
    return () => {
      document.removeEventListener("keydown", trap);
      previous?.focus();
    };
  }, [w.notice]);
  if (!w.notice) return null;
  const limit = w.notice === "limit",
    paused = w.notice === "paused";
  return (
    <div className="time-overlay">
      <div
        ref={box}
        className="time-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="time-dialog-title"
        aria-describedby="time-dialog-description"
      >
        <h2 id="time-dialog-title">
          {limit
            ? "Bugünkü oyun süresi tamamlandı"
            : paused
              ? "Mola zamanı"
              : w.notice === "goal"
                ? "Günlük öğrenme hedefin tamamlandı"
                : "Kısa bir mola?"}
        </h2>
        <p id="time-dialog-description">
          {limit
            ? "Ebeveyn ayarındaki günlük sınıra ulaştın. İlerlemen saklı. Yeni sorular bir sonraki yerel takvim gününde açılır; ebeveynin sınırı değiştirebilir."
            : paused
              ? "İstersen ekrandan uzaklaş. Hazır olduğunda kaldığın yerden devam edebilirsin. Mola süresi oyun süresine eklenmez."
              : w.notice === "goal"
                ? "Bugünkü önerilen 15 dakikalık öğrenme süresine ulaştın. Şimdi mola verebilir veya devam edebilirsin."
                : `${!todayUsage(w.state, w.now).goalAcknowledged ? "15 dakikalık günlük öğrenme hedefini de tamamladın. " : ""}Biraz dinlenmek iyi gelebilir. İstersen mola ver, istersen devam et; yıldızların ve ilerlemen saklı.`}
        </p>
        <div className="time-dialog-actions">
          {limit ? (
            <>
              <button
                className="primary"
                onClick={() => {
                  w.dismiss();
                  onParent();
                }}
              >
                Ebeveyn ayarlarını aç
              </button>
              <button
                className="secondary"
                onClick={() => {
                  w.dismiss();
                  onHome();
                }}
              >
                Ana menüye dön
              </button>
            </>
          ) : paused ? (
            <>
              <button className="primary" onClick={w.resume}>
                Hazırım, devam et
              </button>
              <button
                className="secondary"
                onClick={() => {
                  w.dismiss();
                  onHome();
                }}
              >
                Ana menüye dön
              </button>
            </>
          ) : (
            <>
              <button className="primary" onClick={w.pause}>
                Mola ver
              </button>
              <button className="secondary" onClick={w.resume}>
                Devam et
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
