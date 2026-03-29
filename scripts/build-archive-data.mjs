import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

// Primary source: the md-union inventory (502 items, 453 with paired MDs)
const mdUnionPath = path.join(
  root,
  'SharePoint_PDF_with_associated_MD',
  'documentation',
  'sharepoint-inventory-md-union.json',
);

// Curated meeting video entries (hand-titled, with human-readable summaries)
const videosManifestPath = path.join(
  root,
  'SharePoint_PDF_with_associated_MD',
  'documentation',
  'planning-board',
  'videos-manifest.json',
);

// Legacy pairing manifest — kept for custom mdPath overrides (e.g. large OCR docs)
const manifestPath = path.join(root, 'PAIRING_MANIFEST.txt');

const outPath = path.join(root, 'src', 'data', 'mockDocuments.js');

// ── Helper: extension → bucket ──────────────────────────────────────────────
function extToBucket(name) {
  const ext = path.extname(name).replace(/^\./, '').toLowerCase();
  if (ext === 'pdf') return 'pdf';
  if (ext === 'docx' || ext === 'doc') return 'word';
  if (ext === 'xlsx' || ext === 'xls' || ext === 'csv') return 'spreadsheet';
  if (ext === 'wav' || ext === 'mp3' || ext === 'm4a') return 'audio';
  if (ext === 'mov' || ext === 'mp4') return 'video';
  return null;
}

const byCat = { pdf: [], video: [], word: [], spreadsheet: [], audio: [] };
let nextId = 1;

// ── 1. Build mdPath override map from legacy PAIRING_MANIFEST ────────────────
// Some PDFs have hand-curated mdPaths (e.g. large OCR docs under documentation/).
// Key: lowercase PDF stem → mdPath string
const mdOverrideByPdfStem = new Map();
if (fs.existsSync(manifestPath)) {
  const lines = fs.readFileSync(manifestPath, 'utf8').split(/\r?\n/);
  let pendingPdf = null;
  let inUnpaired = false;
  for (const line of lines) {
    if (line.startsWith('=== PDFs without')) { inUnpaired = true; pendingPdf = null; continue; }
    if (inUnpaired) continue;
    if (line.startsWith('PDF: ')) { pendingPdf = line.slice(5).trim(); continue; }
    const mdMatch = line.match(/^\s*MD:\s+(.+)$/);
    if (mdMatch && pendingPdf) {
      const stem = path.basename(pendingPdf, path.extname(pendingPdf)).toLowerCase();
      mdOverrideByPdfStem.set(stem, mdMatch[1].trim());
      pendingPdf = null;
    }
  }
}

// ── 2. Build curated video set from videos-manifest ──────────────────────────
// These get richer titles and human-readable summaries; we mark their SP filename
// stems so we don't double-list them from the main inventory.
const curatedVideoStems = new Set();
if (fs.existsSync(videosManifestPath)) {
  try {
    const raw = JSON.parse(fs.readFileSync(videosManifestPath, 'utf8'));
    for (const entry of (raw.entries || [])) {
      const title = (entry.title || '').trim();
      const summaryMd = (entry.summaryMd || '').trim().replace(/\\/g, '/');
      const videoUrl = typeof entry.videoUrl === 'string' ? entry.videoUrl.trim() : '';
      if (!title || !summaryMd) continue;
      const absMd = path.join(root, 'SharePoint_PDF_with_associated_MD', summaryMd);
      if (!fs.existsSync(absMd)) {
        console.warn('build-archive-data: skip video entry (missing MD):', summaryMd);
        continue;
      }
      // Derive a stem key from the title date pattern (e.g. "2026-02-03") to match inventory
      const dateMatch = title.match(/(\w+ \d+, \d{4})/);
      if (dateMatch) curatedVideoStems.add(dateMatch[1].toLowerCase());
      byCat['video'].push({
        id: nextId++,
        title,
        videoUrl,
        mdPath: summaryMd.replace(/^\//, ''),
        type: 'Video',
        date: '—',
        size: '—',
      });
    }
  } catch (e) {
    console.warn('build-archive-data: could not read videos-manifest.json:', e.message);
  }
}

// ── 3. Main loop: md-union inventory (502 items) ─────────────────────────────
const MD_ROOT = path.join(root, 'SharePoint_PDF_with_associated_MD');

if (fs.existsSync(mdUnionPath)) {
  try {
    const data = JSON.parse(fs.readFileSync(mdUnionPath, 'utf8'));
    const items = Array.isArray(data.items) ? data.items : [];
    for (const item of items) {
      const name = (item.inventory_name || '').trim();
      if (!name) continue;
      const bucket = extToBucket(name);
      if (!bucket) continue;

      const title = path.basename(name, path.extname(name));
      const stem = title.toLowerCase();
      const ext = path.extname(name).replace(/^\./, '').toUpperCase();
      const spUrl = item.sharepoint_file_url || '';
      const date = (item.online_modified_at || '').slice(0, 10) || '—';
      const folder = (item.library_relative_path || '').split('/').slice(0, 2).join(' / ') || '—';

      // Resolve mdPath: prefer legacy override, then flat-filename reconstruction
      let mdPath = null;
      if (bucket === 'pdf' && mdOverrideByPdfStem.has(stem)) {
        mdPath = mdOverrideByPdfStem.get(stem);
      } else if (item.md_export_flat_filename) {
        const repoRel = path.join(
          'sources', 'Planner-Sharepoint',
          item.md_export_flat_filename.replace(/__/g, path.sep),
        ).split(path.sep).join('/');
        const abs = path.join(MD_ROOT, repoRel);
        if (fs.existsSync(abs)) mdPath = repoRel;
      }

      // Skip curated video entries — already added from videos-manifest
      if (bucket === 'video') {
        const titleLower = title.toLowerCase();
        if ([...curatedVideoStems].some((s) => titleLower.includes(s.split(',')[0].trim()))) continue;
      }

      byCat[bucket].push({
        id: nextId++,
        title,
        sharepointUrl: spUrl,
        parentFolderUrl: item.parent_folder_url || '',
        mdPath,
        type: ext,
        date,
        folder,
      });
    }
  } catch (e) {
    console.warn('build-archive-data: could not read sharepoint-inventory-md-union.json:', e.message);
  }
} else {
  console.warn('build-archive-data: sharepoint-inventory-md-union.json not found');
}

// ── Categories ────────────────────────────────────────────────────────────────
const categories = [
  {
    id: 'pdf',
    title: 'PDF Documents',
    fullTitle: 'PDF Document Archive',
    description:
      'Planning applications, agendas, draft minutes, TRC materials, maps, public comment, and legal filings in PDF format. Original files on SharePoint; full-text search over converted copies.',
    iconType: 'file-text',
    colorAccent: '#3b82f6',
  },
  {
    id: 'video',
    title: 'Meeting Recordings',
    fullTitle: 'Planning Board meeting recordings',
    description:
      'Town Planning Board hearings with links to official meeting recordings and readable written summaries. Search covers both listing text and summary content.',
    iconType: 'video',
    colorAccent: '#ef4444',
  },
  {
    id: 'word',
    title: 'Word Documents',
    fullTitle: 'Word Document Archive',
    description: 'Reports, correspondence, and drafted materials in Microsoft Word format.',
    iconType: 'file-text',
    colorAccent: '#8b5cf6',
  },
  {
    id: 'spreadsheet',
    title: 'Spreadsheets',
    fullTitle: 'Spreadsheet Archive',
    description: 'Data tables, budgets, inventories, and structured records in Excel or CSV format.',
    iconType: 'table',
    colorAccent: '#22c55e',
  },
  {
    id: 'audio',
    title: 'Audio Recordings',
    fullTitle: 'Audio Recording Archive',
    description: 'Audio recordings from public hearings and Planning Board meetings.',
    iconType: 'music',
    colorAccent: '#f59e0b',
  },
];

const mockDocuments = {};
for (const c of categories) {
  mockDocuments[c.id] = byCat[c.id] || [];
}

const total = Object.values(byCat).reduce((s, a) => s + a.length, 0);
let out = `/* Auto-generated from sharepoint-inventory-md-union.json — run: node scripts/build-archive-data.mjs */\n\n`;
out += `export const categories = ${JSON.stringify(categories, null, 2)};\n\n`;
out += `export const mockDocuments = ${JSON.stringify(mockDocuments, null, 2)};\n`;

fs.writeFileSync(outPath, out, 'utf8');
console.log(
  `Wrote ${outPath}: ${total} total docs. ` +
  categories.map((c) => `${c.id}(${byCat[c.id].length})`).join(', '),
);
