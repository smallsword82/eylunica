import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

const rate = 16000;
const seconds = 24;
const samples = rate * seconds;
const buffer = Buffer.alloc(44 + samples * 2);
buffer.write("RIFF"); buffer.writeUInt32LE(buffer.length - 8, 4);
buffer.write("WAVEfmt ", 8); buffer.writeUInt32LE(16, 16);
buffer.writeUInt16LE(1, 20); buffer.writeUInt16LE(1, 22);
buffer.writeUInt32LE(rate, 24); buffer.writeUInt32LE(rate * 2, 28);
buffer.writeUInt16LE(2, 32); buffer.writeUInt16LE(16, 34);
buffer.write("data", 36); buffer.writeUInt32LE(samples * 2, 40);
const chords = [[130.8128, 164.8138, 195.9977, 246.9417], [110, 164.8138, 195.9977, 261.6256], [130.8128, 174.6141, 220, 261.6256]];
for (let index = 0; index < samples; index++) {
  const time = index / rate;
  let value = 0;
  for (let chord = 0; chord < chords.length; chord++) {
    const distance = (time - chord * 8 + seconds) % seconds;
    if (distance > 10) continue;
    const envelope = Math.sin(Math.PI * distance / 10) ** 2;
    for (const frequency of chords[chord]) value += envelope * (Math.sin(2 * Math.PI * frequency * time) + .12 * Math.sin(4 * Math.PI * frequency * time)) * .07;
  }
  const fade = Math.min(1, time / .4, (seconds - time) / .4);
  buffer.writeInt16LE(Math.round(Math.max(-1, Math.min(1, value * fade)) * 32767), 44 + index * 2);
}
const directory = new URL("../public/audio/", import.meta.url);
mkdirSync(directory, { recursive: true });
writeFileSync(new URL("study-ambient.wav", directory), buffer);
process.stdout.write(`Sözsüz özgün odak fonu: ${fileURLToPath(directory)} (${seconds} saniye)\n`);
