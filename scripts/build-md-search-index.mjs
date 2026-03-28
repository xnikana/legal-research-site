import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const MD_ROOT = path.join(root, 'SharePoint_PDF_with_associated_MD');
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

if (!fs.existsSync(MD_ROOT)) {
  console.warn('build-md-search-index: SharePoint_PDF_with_associated_MD not found; writing empty index.');
  fs.writeFileSync(
    outPath,
    '/* Auto-generated — run: node scripts/build-md-search-index.mjs */\nexport const mdSearchTextByPath = {};\n',
  );
  process.exit(0);
}

const files = walkMdFiles(MD_ROOT);
const map = {};
for (const abs of files) {
  const rel = path.relative(MD_ROOT, abs).split(path.sep).join('/');
  try {
    const raw = fs.readFileSync(abs, 'utf8');
    map[rel] = normalizeForSearch(raw);
  } catch (e) {
    console.warn('build-md-search-index: skip', rel, e.message);
  }
}

const header =
  '/* Auto-generated from SharePoint_PDF_with_associated_MD — run: node scripts/build-md-search-index.mjs */\n';
fs.writeFileSync(outPath, `${header}export const mdSearchTextByPath = ${JSON.stringify(map)};\n`);
console.log(`Wrote ${outPath}: ${Object.keys(map).length} markdown files indexed.`);
