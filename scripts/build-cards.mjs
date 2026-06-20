/* One-off asset pipeline: resize the Korean Rider–Waite deck from
   _assets_raw/ into public/cards/ at web-friendly size.
   Filenames already encode the global tarot index 00..77:
     00–21 Major · 22–35 Wands · 36–49 Cups · 50–63 Swords · 64–77 Pentacles
   Run: node scripts/build-cards.mjs */
import sharp from 'sharp'
import { mkdir, readdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')
const RAW = path.join(ROOT, '_assets_raw')
const OUT = path.join(ROOT, 'public', 'cards')

const SRC_DIRS = [
  path.join(RAW, 'kr1', 'Major Arcana'),
  path.join(RAW, 'kr3', 'Wands'),
  path.join(RAW, 'kr2', 'Cups'),
  path.join(RAW, 'kr3', 'Swords'),
  path.join(RAW, 'kr2', 'Pentacles'),
]
const BACK_SRC = path.join(RAW, 'kr1', 'Back', 'back.jpg')

const MAX_WIDTH = 620 // đủ nét cho hiển thị tối đa ~360px @2x

async function process(src, destName) {
  const dest = path.join(OUT, destName)
  await sharp(src)
    .rotate() // tôn trọng EXIF orientation
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(dest)
  return dest
}

async function main() {
  await mkdir(OUT, { recursive: true })
  let count = 0
  for (const dir of SRC_DIRS) {
    if (!existsSync(dir)) {
      console.warn('Bỏ qua (không thấy):', dir)
      continue
    }
    const files = (await readdir(dir)).filter((f) => /\.jpe?g$/i.test(f))
    for (const f of files) {
      const num = path.basename(f).replace(/\.jpe?g$/i, '') // "00".."77"
      await process(path.join(dir, f), `${num}.jpg`)
      count++
    }
  }
  if (existsSync(BACK_SRC)) {
    await process(BACK_SRC, 'back.jpg')
    console.log('+ back.jpg')
  }
  console.log(`Hoàn tất: ${count} lá → ${path.relative(ROOT, OUT)}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
