# Durum tespiti · 23 Ekim 2026

Devir notundaki ilk görev (mevcut durumu doğrulamak) için yapılan kontrollerdir. Uygulama kodunda değişiklik yapılmamıştır.

## Dallar

| Dal | Son commit | `main` ile ilişki | Sonuç |
| --- | --- | --- | --- |
| `main` | `a355779` (22.10.2026) "Add narrated touch-first science journeys…" | — | Güncel ana çizgi. |
| `feat/science-learning-journey` | `8bff6f2` | 16 commit önde, 19 commit geride | İçeriği `121221f` ile `main`e squash olarak alınmış; sonrasında `main` daha da geliştirilmiş. Dalda kalan farklar eski sürümdür. **Birleştirilmemeli**, arşivlenebilir. |
| `feat/pwa-onboarding-parent-improvements` | `b87e707` | 8 önde, 3 geride | PWA/onboarding/ebeveyn işleri `9de9d41` ile `main`e alınmış. Daldaki `App.tsx` elle yapıştırılmış ve "Hello→Goodbye" başlıklı bir commit içeriyor; `main`e göre 3125 satır siliyor. **Birleştirilmemeli.** |

## Doğrulanan işlevler (`main` = `a355779`)

- `npm test`: 54 dosya, **323/323 test geçti**.
- `npm run build`: başarılı (PWA, 2429 önbellek girdisi).
- `npx playwright test` (yerel Chromium ile): **94 geçti, 4 atlandı** (atlananlar çevrimiçi lig yapılandırması gerektiriyor). Tek turda baştan sona yeşil.
- Matematik Akademisi: düzey ekranı olmadan altı macera kartı doğrudan açılıyor; Düzey 2, altısı bitene kadar kilitli (`src/App.test.tsx`, `tests/e2e/progression.spec.ts`).
- Kitaplıkta görünür geri dönüş düğmesi ve doğrudan ses seçimleri mevcut (`1ac6345`, `90b1d60`).
- Fen Bilimleri: ilk dönemin 9 konusu dokunmatik keşif, sesli anlatım, çözümlü örnek, 8 alıştırma ve 20 soruluk test ile çalışıyor; Güneş–Dünya–Ay, Ay evreleri ve kuvvet/sürtünme simülasyonları kaynakta ve testlerde (`tests/e2e/science-journey.spec.ts`).

## Doğrulanamayanlar

- **Canlı site** (`eylunica.smallsword82.workers.dev`): bu bulut ortamının ağ politikası erişime izin vermedi. Hangi commit'in yayında olduğu buradan doğrulanamadı.
- Depoda `wrangler` yapılandırması yok; yayın, Cloudflare Workers Builds'in GitHub bağlantısı üzerinden yapılıyor gibi görünüyor (bkz. `GITHUB-REVIEW-2026-10-22.md`). Cloudflare panelinde son derlemenin `a355779` olup olmadığı kontrol edilmeli.

## YouTube video sistemi

- Son kayıtlı rapor (`VIDEO-RESEARCH-REPORT.json`, 21.10.2026): 724 konu; 94'ü taranmış, 80'inde aday yok, 630'u bekliyor; 8 aday (5'i 2026, 3'ü 2025), onaylı 0. Durum: `quota-blocked` ve **kullanıcı isteğiyle duraklatılmış** (`pausedByUser: true`).
- Tarama ilerlemesi `.tools/video-admin/state.json` dosyasında tutulur; bu klasör `.gitignore` ile depoya alınmaz, yani yalnızca taramanın yapıldığı bilgisayarda bulunur. Kaldığı yerden devam için yönetim sunucusu o bilgisayarda çalıştırılmalıdır.
- Uygulamadaki onaylı katalog (`src/grade5/video-catalog.json`): 36 video.
- API anahtarı kaynakta yok; yalnız `YOUTUBE_API_KEY` ortam değişkeniyle sunucu tarafında kullanılıyor.
- Arama önce 2026'yı, sonra 2025'i tarar; tarih filtresi YouTube API meta verisiyle doğrulanır. **Not:** arama tek kanalla sınırlı (`tonguç 5. SINIF`). Bu, devir notundaki "sabit listeye bağlı kalmama" hedefiyle tam örtüşmüyor; kanal kısıtının bilinçli bir güvenlik kararı olup olmadığı netleştirilmeli.

## Öncelikli eksikler

1. Sosyal Bilgiler: 10 konuda görselli anlatım var (`src/grade5/social-visuals.ts`), ancak Fen'deki gibi keşif görevi + ayrı 8/20 soru bankası + yolculuk kaydı yok. Öncelik sırasına göre sıradaki iş.
2. Canlı yayındaki sürümün Cloudflare panelinden doğrulanması.
3. Eski iki özellik dalının temizlenmesi (silme kararı depo sahibine ait).
4. Video taramasına devam kararı ve kanal kısıtı.
