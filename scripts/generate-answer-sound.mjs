import { writeFile } from "node:fs/promises";

const sampleRate = 22050;
const duration = 0.18;
const count = Math.round(sampleRate * duration);
const wave = Buffer.alloc(44 + count * 2);
wave.write("RIFF", 0); wave.writeUInt32LE(wave.length - 8, 4);
wave.write("WAVEfmt ", 8); wave.writeUInt32LE(16, 16);
wave.writeUInt16LE(1, 20); wave.writeUInt16LE(1, 22);
wave.writeUInt32LE(sampleRate, 24); wave.writeUInt32LE(sampleRate * 2, 28);
wave.writeUInt16LE(2, 32); wave.writeUInt16LE(16, 34);
wave.write("data", 36); wave.writeUInt32LE(count * 2, 40);
for (let index = 0; index < count; index++) {
  const time = index / sampleRate;
  const envelope = Math.min(1, time / 0.008) * (1 - time / duration) ** 2;
  const sample = (Math.sin(2 * Math.PI * 880 * time) + 0.35 * Math.sin(2 * Math.PI * 1320 * time)) * envelope * 0.35;
  wave.writeInt16LE(Math.round(sample * 32767), 44 + index * 2);
}
await writeFile(new URL("../public/manifest/audio/answer-tick.wav", import.meta.url), wave);
