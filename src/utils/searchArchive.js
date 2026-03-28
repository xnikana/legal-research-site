import { categories, mockDocuments } from '../data/mockDocuments';
import { mdSearchTextByPath } from '../data/mdSearchTextByPath';

let flatIndex = null;

function buildFlatIndex() {
  const rows = [];
  for (const cat of categories) {
    const docs = mockDocuments[cat.id] || [];
    for (const doc of docs) {
      rows.push({
        doc,
        categoryId: cat.id,
        categoryTitle: cat.title,
      });
    }
  }
  return rows;
}

function getFlatIndex() {
  if (!flatIndex) flatIndex = buildFlatIndex();
  return flatIndex;
}

const DEFAULT_LIMIT = 60;

function haystackForDoc(doc) {
  const parts = [doc.title, doc.pdfPath, doc.mdPath, doc.videoUrl];
  if (doc.mdPath && mdSearchTextByPath[doc.mdPath]) {
    parts.push(mdSearchTextByPath[doc.mdPath]);
  }
  return parts.filter(Boolean).join('\n').toLowerCase();
}

/**
 * Case-insensitive substring match on title, pdfPath, mdPath (min 2 chars to match).
 * @param {object} doc
 * @param {string} rawQuery
 */
export function documentMatchesQuery(doc, rawQuery) {
  const q = rawQuery.trim().toLowerCase();
  if (q.length < 2) return true;
  return haystackForDoc(doc).includes(q);
}

/**
 * @param {string} rawQuery
 * @param {number} [limit]
 * @param {string | null} [categoryId] when set, only documents in this category are searched (home page omits this to search all)
 * @returns {{ results: Array<{ doc: object, categoryId: string, categoryTitle: string }>, total: number }}
 */
export function searchArchive(rawQuery, limit = DEFAULT_LIMIT, categoryId = null) {
  const q = rawQuery.trim().toLowerCase();
  if (q.length < 2) {
    return { results: [], total: 0 };
  }
  const idx = getFlatIndex();
  const matches = [];
  for (const row of idx) {
    if (categoryId != null && row.categoryId !== categoryId) continue;
    const { doc } = row;
    if (haystackForDoc(doc).includes(q)) matches.push(row);
  }
  const total = matches.length;
  return {
    results: matches.slice(0, limit),
    total,
  };
}
