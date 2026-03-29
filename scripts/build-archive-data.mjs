import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const manifestPath = path.join(root, 'PAIRING_MANIFEST.txt');
const videosManifestPath = path.join(
  root,
  'BeltonCourt_TownMeeting_Transcripts_MD_2026-03-28',
  'videos-manifest.json',
);
const beltonPrefix = 'BeltonCourt_TownMeeting_Transcripts_MD_2026-03-28/';
const outPath = path.join(root, 'src', 'data', 'mockDocuments.js');

const text = fs.readFileSync(manifestPath, 'utf8');
const lines = text.split(/\r?\n/);

const paired = [];
let pendingPdf = null;
let inUnpaired = false;

for (const line of lines) {
  if (line.startsWith('=== PDFs without')) {
    inUnpaired = true;
    pendingPdf = null;
    continue;
  }
  if (inUnpaired) {
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
  'meeting-videos-transcripts': [],
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

let videoEntries = [];
if (fs.existsSync(videosManifestPath)) {
  try {
    const raw = JSON.parse(fs.readFileSync(videosManifestPath, 'utf8'));
    videoEntries = Array.isArray(raw.entries) ? raw.entries : [];
  } catch (e) {
    console.warn('build-archive-data: could not read videos-manifest.json:', e.message);
  }
}

for (const entry of videoEntries) {
  const title = (entry.title || '').trim();
  const summaryMd = (entry.summaryMd || '').trim().replace(/\\/g, '/');
  const videoUrl = typeof entry.videoUrl === 'string' ? entry.videoUrl.trim() : '';
  if (!title || !summaryMd) continue;
  const mdPath = beltonPrefix + summaryMd.replace(/^\//, '');
  const absMd = path.join(root, beltonPrefix.slice(0, -1), summaryMd);
  if (!fs.existsSync(absMd)) {
    console.warn('build-archive-data: skip video entry (missing file):', summaryMd);
    continue;
  }
  byCat['meeting-videos-transcripts'].push({
    id: nextId++,
    title,
    videoUrl,
    mdPath,
    type: 'Video',
    date: '—',
    size: '—',
  });
}

/** User-facing browse groups (ids must match pairBucket / byCat keys). */
const categories = [
  {
    id: 'paired-belton-application',
    title: 'Belton Court application',
    fullTitle: 'Belton Court comprehensive permit application',
    description:
      'Numbered application volumes—site plans, stormwater, traffic, wetlands, legal filings, and related exhibits. Original files open on the town SharePoint; this site adds full-text search over converted copies.',
    iconType: 'landmark',
  },
  {
    id: 'paired-planner-2026',
    title: 'Planning Board 2026',
    fullTitle: 'Planning Board materials (2026)',
    description:
      'Agendas, draft minutes, TRC materials, maps, and public comment from 2026 Planning Board and special meetings. PDFs on SharePoint; searchable text mirrored here.',
    iconType: 'calendar',
  },
  {
    id: 'meeting-videos-transcripts',
    title: 'Town meeting videos',
    fullTitle: 'Planning Board meetings — video and transcripts',
    description:
      'Planning Board hearings with links to town meeting recordings and readable summaries of what was discussed. Search covers both listing text and summary content.',
    iconType: 'video',
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
  `Wrote ${outPath}: ${paired.length} paired (${byCat['paired-planner-2026'].length} planner-2026, ${byCat['paired-belton-application'].length} belton-app), ${byCat['meeting-videos-transcripts'].length} meeting video/transcript rows.`,
);
