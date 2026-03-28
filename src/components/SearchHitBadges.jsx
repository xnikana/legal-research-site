import React from 'react';
import { classifySearchHit } from '../utils/searchMatchMeta';

/**
 * @param {{ doc: object, searchQuery: string }} props
 */
export default function SearchHitBadges({ doc, searchQuery }) {
  const { titleMatch, pathMatch, bodyMatch } = classifySearchHit(doc, searchQuery);
  const listingLabel = titleMatch ? 'Title' : pathMatch ? 'Path' : null;

  if (!listingLabel && !bodyMatch) return null;

  return (
    <div className="search-hit-badges" aria-label="Match location">
      {listingLabel ? (
        <span className="search-hit-badge search-hit-badge-listing">{listingLabel}</span>
      ) : null}
      {bodyMatch ? (
        <span className="search-hit-badge search-hit-badge-body">Document text</span>
      ) : null}
    </div>
  );
}
