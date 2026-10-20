const shapePattern = /[●○■□▲△◆◇✦]\s*(?:Daire|Kare|Üçgen|Baklava|Yıldız)(?:\s*·\s*(?:Mavi|Sarı|Mor|Turuncu|Yeşil|Pembe|Kırmızı|Lacivert|içi dolu|içi boş|ek nokta))*/g;
const colors: Record<string, string> = { Mavi: "#57baff", Sarı: "#ffe16a", Mor: "#c49aff", Turuncu: "#ffad5b", Yeşil: "#6ee6a0", Pembe: "#ff99d1", Kırmızı: "#ff727f", Lacivert: "#8c9cff" };
const defaults: Record<string, string> = { Daire: "Mavi", Kare: "Sarı", Üçgen: "Mor", Baklava: "Turuncu", Yıldız: "Pembe" };
export function hasShapes(text: string) {
  return new RegExp(shapePattern.source).test(text);
}
function Shape({ label }: { label: string }) {
  const name = label.match(/Daire|Kare|Üçgen|Baklava|Yıldız/)![0];
  const colorName = Object.keys(colors).find(color => label.includes(color)) ?? defaults[name];
  const hollow = /[○□△◇]|içi boş/.test(label);
  const fill = hollow ? "none" : colors[colorName];
  return <span className="shape-token" role="img" aria-label={`${colorName} ${name.toLocaleLowerCase("tr")}, içi ${hollow ? "boş" : "dolu"}${label.includes("ek nokta") ? ", ek noktalı" : ""}`}>
    <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false" fill={fill} stroke={colors[colorName]} strokeWidth="4" strokeLinejoin="round">
      {name === "Daire" ? <circle cx="32" cy="32" r="22" /> : name === "Kare" ? <rect x="11" y="11" width="42" height="42" rx="2" /> : name === "Üçgen" ? <polygon points="32,8 57,54 7,54" /> : name === "Baklava" ? <polygon points="32,6 57,32 32,58 7,32" /> : <polygon points="32,5 40,23 59,25 45,38 49,58 32,48 15,58 19,38 5,25 24,23" />}
      {label.includes("ek nokta") && <circle cx="51" cy="13" r="6" fill="#ffffff" stroke="#241b32" strokeWidth="3" />}
    </svg>
  </span>;
}
export function ShapeText({ text }: { text: string }) {
  const matches = [...text.matchAll(shapePattern)];
  if (!matches.length) return <>{text}</>;
  let start = 0;
  const parts = matches.flatMap(match => {
    const before = text.slice(start, match.index);
    start = match.index! + match[0].length;
    return [before, <Shape key={match.index} label={match[0]} />];
  });
  return <span className="shape-content">{parts}{text.slice(start)}</span>;
}
