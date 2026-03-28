import React from 'react';

/**
 * Highlights case-insensitive substring matches of `query` inside `text`.
 */
export default function MatchHighlight({ text, query }) {
  const q = (query || '').trim();
  const s = text == null ? '' : String(text);
  if (!s || q.length < 2) return s;

  let escaped;
  try {
    escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  } catch {
    return s;
  }

  let parts;
  try {
    parts = s.split(new RegExp(`(${escaped})`, 'gi'));
  } catch {
    return s;
  }
  if (parts.length === 1) return s;

  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <mark key={i} className="search-hit-mark">
            {part}
          </mark>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        ),
      )}
    </>
  );
}
