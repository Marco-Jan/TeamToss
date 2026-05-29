import sharp from 'sharp';
import toIco from 'to-ico';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');

mkdirSync(publicDir, { recursive: true });

const svg = readFileSync(join(publicDir, 'icon.svg'));

const sizes = [
  ['favicon-16x16.png', 16],
  ['favicon-32x32.png', 32],
  ['apple-touch-icon.png', 180],
  ['android-chrome-192x192.png', 192],
  ['android-chrome-512x512.png', 512],
  ['mstile-150x150.png', 150],
];

for (const [name, size] of sizes) {
  await sharp(svg).resize(size, size).png().toFile(join(publicDir, name));
  console.log(`✓ ${name} (${size}x${size})`);
}

const png16 = readFileSync(join(publicDir, 'favicon-16x16.png'));
const png32 = readFileSync(join(publicDir, 'favicon-32x32.png'));
const ico = await toIco([png16, png32]);
writeFileSync(join(publicDir, 'favicon.ico'), ico);
console.log('✓ favicon.ico (16+32)');

console.log('\nAll icons generated successfully.');
