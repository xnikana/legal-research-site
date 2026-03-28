import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const manifestPath = path.join(root, 'PAIRING_MANIFEST.txt');
const outPath = path.join(root, 'src', 'data', 'mockDocuments.js');

const text = fs.readFileSync(manifestPath, 'utf8');
const lines = text.split(/\r?\n/);

const paired = [];
const unpairedPdf = [];
let pendingPdf = null;
let inUnpaired = false;

for (const line of lines) {
  if (line.startsWith('=== PDFs without')) {
    inUnpaired = true;
    pendingPdf = null;
    continue;
  }
  if (inUnpaired) {
    const t = line.trim();
    if (t.startsWith('sources/')) unpairedPdf.push(t);
    continue;
  }
  if (line.startsWith('PDF: ')) {
    pendingPdf = line.slice(5).trim();
    continue;
  }
  const mdMatch = line.match(/^\s*MD:\s+(.+)$/);
  if (mdMatch && pendingPdf) {
    paired.push({ pdf: pendingPdf, md: mdMatch[1].trim() });
    pendingPdf = null;
  }
}

function pairBucket(pdf) {
  if (pdf.includes('Belton Court Application')) return 'paired-belton-application';
  return 'paired-planner-2026';
}

const byCat = {
  'paired-planner-2026': [],
  'paired-belton-application': [],
  'sharepoint-pdf-unpaired': [],
};

let nextId = 1;

for (const { pdf, md } of paired) {
  const cat = pairBucket(pdf);
  const ext = path.extname(pdf).replace(/^\./, '').toUpperCase() || 'PDF';
  const base = path.basename(pdf, path.extname(pdf));
  byCat[cat].push({
    id: nextId++,
    title: base,
    pdfPath: pdf,
    mdPath: md,
    type: ext,
    date: '—',
    size: '—',
  });
}

for (const pdf of unpairedPdf) {
  const ext = path.extname(pdf).replace(/^\./, '').toUpperCase() || 'PDF';
  const base = path.basename(pdf, path.extname(pdf));
  byCat['sharepoint-pdf-unpaired'].push({
    id: nextId++,
    title: base,
    pdfPath: pdf,
    type: ext,
    date: '—',
    size: '—',
  });
}

const categories = [
  {
    id: 'paired-planner-2026',
    title: '2026 packets (PDF + MD)',
    fullTitle: 'Planner SharePoint 2026 — paired PDF and Markdown',
    description:
      '2026 Planning Board SharePoint PDFs that have a matching Markdown file in the Belton Court research archive (from PAIRING_MANIFEST).',
    iconType: 'users',
  },
  {
    id: 'paired-belton-application',
    title: 'Belton Court application (PDF + MD)',
    fullTitle: 'Belton Court comprehensive permit application — paired PDF and Markdown',
    description:
      'Numbered Belton Court application PDF bundles paired with Markdown conversions.',
    iconType: 'file-text',
  },
  {
    id: 'sharepoint-pdf-unpaired',
    title: 'SharePoint PDFs (no MD)',
    fullTitle: 'Planner SharePoint PDFs without Markdown in archive',
    description:
      'PDF paths from the Barrington Planner SharePoint mirror with no associated .md in the research repo, per PAIRING_MANIFEST.',
    iconType: 'clipboard-list',
  },
];

const mockDocuments = {};
for (const c of categories) {
  mockDocuments[c.id] = byCat[c.id];
}

let out = `/* Auto-generated from PAIRING_MANIFEST.txt — run: node scripts/build-archive-data.mjs */\n\n`;
out += `export const categories = ${JSON.stringify(categories, null, 2)};\n\n`;
out += `export const mockDocuments = ${JSON.stringify(mockDocuments, null, 2)};\n`;

fs.writeFileSync(outPath, out, 'utf8');
console.log(
  `Wrote ${outPath}: ${paired.length} paired (${byCat['paired-planner-2026'].length} planner-2026, ${byCat['paired-belton-application'].length} belton-app), ${unpairedPdf.length} unpaired PDFs.`,
);
