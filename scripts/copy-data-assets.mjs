/**
 * Copies image assets from data/ directories into public/data/ so they are
 * servable by Next.js at runtime.
 *
 * Data directories like data/guides/<country>/images/ and data/team/images/
 * contain images referenced by frontmatter with relative paths (e.g.
 * "images/flag.png"). This script mirrors those into public/ so a resolved
 * URL like /data/guides/allemagne/images/flag.png actually serves the file.
 *
 * Run via: node scripts/copy-data-assets.mjs
 */

import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'data');
const PUBLIC_DIR = path.join(ROOT, 'public');

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.ico', '.avif']);

function isImage(filePath) {
  return IMAGE_EXTENSIONS.has(path.extname(filePath).toLowerCase());
}

function copyRecursive(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) return;

  const entries = fs.readdirSync(srcDir, {withFileTypes: true});

  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else if (isImage(srcPath)) {
      fs.mkdirSync(path.dirname(destPath), {recursive: true});
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Copy all image assets from data/ into public/data/
// This mirrors the directory structure so that a file at
//   data/guides/allemagne/images/flag.png
// becomes available at
//   public/data/guides/allemagne/images/flag.png
// and can be referenced as /data/guides/allemagne/images/flag.png

console.log('Copying data assets to public/data/ ...');
copyRecursive(DATA_DIR, path.join(PUBLIC_DIR, 'data'));
console.log('Done.');
