/**
 * Maps local mirror paths (PAIRING_MANIFEST) to the Town Planning Board SharePoint library.
 * Mirror layout: sources/Planner-Sharepoint/<...> → Shared Documents/PLANNING BOARD/<...>
 */
const SHAREPOINT_ORIGIN = 'https://twnbarrintonri.sharepoint.com';
const SITE_SEGMENT = 'sites/BoardandCommissionPacketLibrary';
const LIBRARY_SEGMENTS = ['Shared Documents', 'PLANNING BOARD'];
const MIRROR_PREFIX = 'sources/Planner-Sharepoint/';

export function sharePointPdfUrlFromMirror(mirrorPdfPath) {
  if (!mirrorPdfPath || !mirrorPdfPath.startsWith(MIRROR_PREFIX)) return null;
  const tail = mirrorPdfPath.slice(MIRROR_PREFIX.length);
  const segments = [...LIBRARY_SEGMENTS, ...tail.split('/').filter(Boolean)];
  const encodedPath = segments.map(encodeURIComponent).join('/');
  return `${SHAREPOINT_ORIGIN}/${SITE_SEGMENT}/${encodedPath}`;
}
