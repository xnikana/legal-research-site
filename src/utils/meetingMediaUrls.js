/** Repo folder copied to public at build time; keys in mockDocuments / search index use this prefix. */
export const BELTON_TRANSCRIPTS_PREFIX = 'BeltonCourt_TownMeeting_Transcripts_MD_2026-03-28/';

/**
 * URL to open a committed markdown summary from /public (path must use BELTON_TRANSCRIPTS_PREFIX).
 * @param {string} mdPath
 * @returns {string | null}
 */
export function publicSummaryUrl(mdPath) {
  if (!mdPath || !mdPath.startsWith(BELTON_TRANSCRIPTS_PREFIX)) return null;
  const parts = mdPath.split('/').map((p) => encodeURIComponent(p));
  return `/${parts.join('/')}`;
}

/** In-app route for rendered markdown summary (see MeetingSummaryPage). */
export function meetingSummaryRoute(docId) {
  return `/meeting/${docId}`;
}
