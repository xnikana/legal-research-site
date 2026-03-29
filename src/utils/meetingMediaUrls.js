/** Prefix for meeting transcript mdPaths (relative to SharePoint_PDF_with_associated_MD root). */
export const MEETING_TRANSCRIPTS_PREFIX = 'documentation/planning-board/meeting-transcripts/';

/**
 * URL to open a committed markdown summary from /public.
 * @param {string} mdPath
 * @returns {string | null}
 */
export function publicSummaryUrl(mdPath) {
  if (!mdPath || !mdPath.startsWith(MEETING_TRANSCRIPTS_PREFIX)) return null;
  const parts = ['SharePoint_PDF_with_associated_MD', ...mdPath.split('/')].map((p) =>
    encodeURIComponent(p),
  );
  return `/${parts.join('/')}`;
}

/** In-app route for rendered markdown summary (see MeetingSummaryPage). */
export function meetingSummaryRoute(docId) {
  return `/meeting/${docId}`;
}
