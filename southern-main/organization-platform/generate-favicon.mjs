/**
 * Generates favicon.ico (multi-size RGBA) and apple-touch-icon.png from icon.jpg
 * Run with: node generate-favicon.mjs
 */
import sharp from 'sharp';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const src = join(__dirname, 'public', 'icon.jpg');
const publicDir = join(__dirname, 'public');
const appDir = join(__dirname, 'app');

async function generatePng(size, destPath) {
  await sharp(src)
    .resize(size, size, { fit: 'cover', position: 'centre' })
    .ensureAlpha()   // RGBA required by Turbopack
    .png()
    .toFile(destPath);
  console.log(`✓ Created ${destPath} (${size}x${size})`);
}

// ICO file builder — wraps RGBA PNG data into a valid .ico binary
function buildIco(pngBuffers) {
  const numImages = pngBuffers.length;
  const headerSize = 6;
  const dirEntrySize = 16;
  const dataOffset = headerSize + dirEntrySize * numImages;

  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0);        // Reserved
  header.writeUInt16LE(1, 2);        // Type: ICO
  header.writeUInt16LE(numImages, 4);

  const dirEntries = [];
  let currentOffset = dataOffset;

  for (const { buf, size } of pngBuffers) {
    const entry = Buffer.alloc(dirEntrySize);
    entry.writeUInt8(size >= 256 ? 0 : size, 0);  // Width (0 = 256)
    entry.writeUInt8(size >= 256 ? 0 : size, 1);  // Height
    entry.writeUInt8(0, 2);                         // Color count
    entry.writeUInt8(0, 3);                         // Reserved
    entry.writeUInt16LE(1, 4);                      // Color planes
    entry.writeUInt16LE(32, 6);                     // Bits per pixel (RGBA = 32)
    entry.writeUInt32LE(buf.length, 8);             // Data size
    entry.writeUInt32LE(currentOffset, 12);         // Data offset
    dirEntries.push(entry);
    currentOffset += buf.length;
  }

  return Buffer.concat([header, ...dirEntries, ...pngBuffers.map(x => x.buf)]);
}

async function main() {
  console.log('Generating favicon assets from icon.jpg...\n');

  // Apple Touch Icon (180x180 RGBA PNG)
  await generatePng(180, join(publicDir, 'apple-touch-icon.png'));

  // PWA icons
  await generatePng(192, join(publicDir, 'icon-192.png'));
  await generatePng(512, join(publicDir, 'icon-512.png'));

  // Build ICO with RGBA PNGs at 16, 32, 48
  const icoSizes = [16, 32, 48];
  const pngBuffers = [];

  for (const size of icoSizes) {
    const buf = await sharp(src)
      .resize(size, size, { fit: 'cover', position: 'centre' })
      .ensureAlpha()   // RGBA — required by Next.js/Turbopack ICO decoder
      .png()
      .toBuffer();
    pngBuffers.push({ buf, size });
    console.log(`✓ Prepared ${size}x${size} RGBA PNG for ICO`);
  }

  const icoBuffer = buildIco(pngBuffers);

  writeFileSync(join(publicDir, 'favicon.ico'), icoBuffer);
  console.log(`✓ Created public/favicon.ico (${icoBuffer.length} bytes)`);

  writeFileSync(join(appDir, 'favicon.ico'), icoBuffer);
  console.log(`✓ Created app/favicon.ico`);

  console.log('\n✅ Done!');
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
