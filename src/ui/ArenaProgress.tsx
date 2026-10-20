import { useState } from "react";
import { OPERATIONS, getLane, meanIndependent, operationNames, specs, type Comparison, type Lane } from "../arena-engine";
import type { Operation } from "../math-engine";
import type { Progress } from "../storage";
function samples(lane: Lane): Comparison[] {
  const points: Comparison[] = [];
  for (let i = 0; i < lane.recent.length; i += 20) {
    const group = lane.recent.slice(i, i + 20);
    if (group.length < 10) continue;
    points.push({ at: group.at(-1)!.at, correct: group.filter(o => o.correct).length / group.length * 20, independent: group.filter(o => o.correct && !o.hint && o.timingValid && o.elapsedMs >= 300 && o.elapsedMs <= 3_600_000).length, meanMs: meanIndependent(group), qualified: false, record: false });
  }
  return points;
}
function Chart({ points, kind }: { points: Comparison[]; kind: "accuracy" | "time" }) {
  const values = points.map(p => kind === "accuracy" ? p.correct * 5 : p.meanMs === null ? null : p.meanMs / 1000);
  const max = kind === "accuracy" ? 100 : Math.max(1, ...values.filter((v): v is number => v !== null));
  const x = (i: number) => points.length < 2 ? 170 : 45 + i * 270 / (points.length - 1);
  const y = (n: number) => 160 - n / max * 125;
  const label = kind === "accuracy" ? "İlk yanıt doğruluğu (%)" : "Bağımsız doğru yanıtlarda ortalama etkin süre (saniye)";
  return <svg className="arena-chart" viewBox="0 0 350 205" role="img" aria-label={`${label}. Sayısal değerler aşağıdaki tabloda.`}>
    <title>{label}</title><desc>Aynı işlem, beceri ve düzeydeki sıralı gruplar. Eksik süre örnekleri çizilmez. Daha düşük süre ancak doğrulukla birlikte değerlendirilir.</desc>
    <path d="M45 30V160H320" fill="none" stroke="#655271" />
    <text x="4" y="40">{Math.round(max)}</text><text x="20" y="163">0</text>
    {values.map((v, i) => v === null ? null : <g key={i}>
      {i > 0 && values[i - 1] !== null && <line x1={x(i - 1)} y1={y(values[i - 1]!)} x2={x(i)} y2={y(v)} stroke="#5a3977" strokeWidth="3" />}
      <circle cx={x(i)} cy={y(v)} r="5" fill="#5a3977"><title>{i + 1}. grup: {v.toFixed(1)} {kind === "accuracy" ? "%" : "saniye"}</title></circle>
      <text x={x(i)} y="180" textAnchor="middle">{i + 1}</text>
    </g>)}
    <text x="175" y="201" textAnchor="middle">{kind === "accuracy" ? "Doğruluk (%) · grup sırası" : "Ortalama saniye · grup sırası"}</text>
  </svg>;
}
export function ArenaProgress({ progress }: { progress: Progress }) {
  const [operation, setOperation] = useState<Operation>("add"), [level, setLevel] = useState(1), [skillIndex, setSkillIndex] = useState(0);
  const list = specs(operation, level), spec = list[Math.min(skillIndex, list.length - 1)];
  const lane = getLane(progress.arena, spec);
  const points = lane.comparisons.length ? lane.comparisons : samples(lane);
  return <section className="arena-parent" aria-labelledby="arena-progress-title">
    <h2 id="arena-progress-title">Hız Arenası gelişimi</h2>
    <p>Yalnızca çocuğun kendi sonuçları karşılaştırılır. İşlem, beceri ve düzeyler birbirine karıştırılmaz. Hız tek başına başarı ölçütü değildir.</p>
    <div className="arena-selectors">
      <label>Grafik işlemi <select value={operation} onChange={e => { setOperation(e.target.value as Operation); setSkillIndex(0); }}>{OPERATIONS.map(op => <option key={op} value={op}>{operationNames[op]}</option>)}</select></label>
      <label>Grafik düzeyi <select value={level} onChange={e => setLevel(Number(e.target.value))}>{[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>Düzey {n}</option>)}</select></label>
      <label>Grafik becerisi <select value={skillIndex} onChange={e => setSkillIndex(Number(e.target.value))}>{list.map((s, i) => <option key={s.skill} value={i}>{s.skill}</option>)}</select></label>
    </div>
    <p>{operationNames[operation]} · {spec.skill} · Düzey {level}</p>
    <p>İlk karşılaştırma: {lane.baselineMs === null ? "Henüz yeterli bağımsız örnek yok" : `${(lane.baselineMs / 1000).toFixed(1)} saniye`}. Kişisel rekor: {lane.bestMs === null ? "Henüz yok" : `${(lane.bestMs / 1000).toFixed(1)} saniye`}.</p>
    {points.length ? <>
      <p>{lane.comparisons.length ? "Tamamlanan Arena turlarından, çakışmayan 20 ilk yanıtlık gruplar gösteriliyor." : "Henüz Arena karşılaştırması yok. Son hazırlık/öğrenme yanıtları en az 10, en fazla 20 soruluk gruplarda gösteriliyor; bunlar rekor sayılmaz."}</p>
      <div className="arena-charts"><Chart points={points} kind="accuracy" /><Chart points={points} kind="time" /></div>
      <div className="table-wrap" role="region" aria-label="Arena grafik tablosu" tabIndex={0}><table aria-label="Arena gelişim grafiğinin sayısal değerleri"><thead><tr><th>Grup</th><th>Tarih</th><th>İlk yanıtta doğru</th><th>Süre örneği</th><th>Ortalama saniye</th><th>Rekor koşulu</th></tr></thead><tbody>{points.map((p, i) => <tr key={i}><td>{i + 1}</td><td>{new Date(p.at).toLocaleDateString("tr-TR")}</td><td>%{Math.round(p.correct * 5)}</td><td>{p.independent} bağımsız doğru</td><td>{p.meanMs === null ? "Yeterli örnek yok" : (p.meanMs / 1000).toFixed(1)}</td><td>{p.record ? "Yeni kişisel rekor" : p.qualified ? "Koşullar sağlandı" : "Rekor grubuna uygun değil"}</td></tr>)}</tbody></table></div>
    </> : <p>Grafik için henüz yeterli yanıt yok. Tek sorudan hız sonucu çıkarılmaz; çocuk sırf grafik oluşturmak için devam etmek zorunda değildir.</p>}
    <p>Ortalama için en az 10 bağımsız doğru süre gerekir; ipuçlu, yanlış, 300 ms altı, bir saatten uzun veya kesintili süreler ortalamaya alınmaz. Rekor için 20/20 bağımsız, kesintisiz doğru gerekir. Eski sürümlerde düzeyi kaydedilmeyen sürelerden rekor üretilmez.</p>
    <p>İlk yanıtlar her beceri/düzeyde son 40 kayıtla, karşılaştırmalar son 24 grupla sınırlıdır. Gelişim verisi bu cihazda saklanır. Kayıt sıfırlanırsa Arena geçmişi ve oyun ödülleri de sıfırlanır.</p>
  </section>;
}
