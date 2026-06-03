/**
 * Build-time script: converts og-image.svg → og-image.png (1200×630)
 * Runs during Vercel build so the PNG is available as a static asset.
 */
import { readFileSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root      = resolve(__dirname, '..')
const svgPath   = resolve(root, 'client/public/og-image.svg')
const pngPath   = resolve(root, 'client/public/og-image.png')

if (!existsSync(svgPath)) {
  console.warn('[og] og-image.svg not found — skipping PNG generation')
  process.exit(0)
}

const { default: sharp } = await import('sharp')

const svg = readFileSync(svgPath)

await sharp(svg)
  .resize(1200, 630)
  .png({ quality: 95, compressionLevel: 9 })
  .toFile(pngPath)

console.log('[og] og-image.png generated ✓')
