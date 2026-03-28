import { mdSearchTextByPath } from '../data/mdSearchTextByPath';

/**
 * @returns {{ titleMatch: boolean, pathMatch: boolean, bodyMatch: boolean }}
 */
export function classifySearchHit(doc, rawQuery) {
  const q = rawQuery.trim().toLowerCase();
  if (q.length < 2) {
    return { titleMatch: false, pathMatch: false, bodyMatch: false };
  }

  const titleMatch = (doc.title || '').toLowerCase().includes(q);

  const pathBlob = [doc.pdfPath, doc.mdPath, doc.videoUrl].filter(Boolean).join('\n').toLowerCase();
  const pathMatch = pathBlob.includes(q);

  const body =
    doc.mdPath && mdSearchTextByPath[doc.mdPath] ? mdSearchTextByPath[doc.mdPath] : '';
  const bodyMatch = Boolean(body && body.includes(q));

  return { titleMatch, pathMatch, bodyMatch };
}
