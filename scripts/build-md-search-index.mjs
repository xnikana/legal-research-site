import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const MD_ROOT = path.join(root, 'SharePoint_PDF_with_associated_MD');
const BELTON_ROOT = path.join(root, 'BeltonCourt_TownMeeting_Transcripts_MD_2026-03-28');
const BELTON_KEY_PREFIX = 'BeltonCourt_TownMeeting_Transcripts_MD_2026-03-28/';
const outPath = path.join(root, 'src', 'data', 'mdSearchTextByPath.js');

const MAX_CHARS = 400_000;

function walkMdFiles(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, name.name);
    if (name.isDirectory()) walkMdFiles(full, acc);
    else if (name.name.toLowerCase().endsWith('.md')) acc.push(full);
  }
  return acc;
}

function normalizeForSearch(raw) {
  if (!raw || typeof raw !== 'string') return '';
  return raw
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]+`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
    .replace(/\[[^\]]*\]\([^)]+\)/g, ' ')
    .replace(/[#*_>|\\\-[\]]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, MAX_CHARS)
    .toLowerCase();
}

const map = {};

if (fs.existsSync(MD_ROOT)) {
  const files = walkMdFiles(MD_ROOT);
  for (const abs of files) {
    const rel = path.relative(MD_ROOT, abs).split(path.sep).join('/');
    try {
      const raw = fs.readFileSync(abs, 'utf8');
      map[rel] = normalizeForSearch(raw);
    } catch (e) {
      console.warn('build-md-search-index: skip', rel, e.message);
    }
  }
} else {
  console.warn('build-md-search-index: SharePoint_PDF_with_associated_MD not found; skipping that tree.');
}

if (fs.existsSync(BELTON_ROOT)) {
  const files = walkMdFiles(BELTON_ROOT);
  for (const abs of files) {
    const rel = path.relative(BELTON_ROOT, abs).split(path.sep).join('/');
    const key = BELTON_KEY_PREFIX + rel;
    try {
      const raw = fs.readFileSync(abs, 'utf8');
      map[key] = normalizeForSearch(raw);
    } catch (e) {
      console.warn('build-md-search-index: skip', key, e.message);
    }
  }
} else {
  console.warn(
    'build-md-search-index: BeltonCourt_TownMeeting_Transcripts_MD_2026-03-28 not found; skipping meeting transcripts.',
  );
}

const header =
  '/* Auto-generated from archive markdown trees — run: node scripts/build-md-search-index.mjs */\n';
fs.writeFileSync(outPath, `${header}export const mdSearchTextByPath = ${JSON.stringify(map)};\n`);
console.log(`Wrote ${outPath}: ${Object.keys(map).length} markdown files indexed.`);
