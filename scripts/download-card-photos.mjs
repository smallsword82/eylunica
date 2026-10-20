import { mkdir, writeFile } from "node:fs/promises";

const portraits = { mina: "3", lidya: "4", hilal: "8", esin: "7", zeynep: "6", sueda: "5" };
const hileli = {
  mina: "‘Hileli-son-2-❤️",
  lidya: "InCollage_20260513_140733491",
  hilal: "InCollage_20260513_140650812",
  esin: "InCollage_20260513_140453933",
  zeynep: "InCollage_20260513_140539135",
  sueda: "InCollage_20260513_140746065",
};
const spotlight = { mina: "1000040258", lidya: "1000040255", hilal: "1000040252", esin: "1000040202", zeynep: "1000040261", sueda: "1000040193" };
const destination = new URL("../public/manifest/cards/", import.meta.url);
await mkdir(destination, { recursive: true });
for (const name of Object.keys(portraits)) {
  const photos = [
    ["portrait", "webp", `https://manifestbyme.vercel.app/images/${portraits[name]}.webp`],
    ["hileli", "jpg", `https://kprofiles.com/wp-content/uploads/2025/02/${hileli[name]}-640x800.jpg`],
    ["spotlight", "jpg", `https://blog.biletino.com/wp-content/uploads/2026/06/${spotlight[name]}-768x432.jpg`],
  ];
  for (const [series, extension, url] of photos) {
    const response = await fetch(url);
    if (!response.ok || !response.headers.get("content-type")?.startsWith("image/")) throw new Error(`${name}: ${url} ${response.status}`);
    const bytes = new Uint8Array(await response.arrayBuffer());
    if (bytes.length > 2_000_000) throw new Error(`Photo too large: ${name} ${series}`);
    await writeFile(new URL(`${name}-${series}.${extension}`, destination), bytes);
    console.log(`${name}-${series}.${extension}: ${bytes.length} bytes`);
  }
}
