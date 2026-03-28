import React from 'react';
import { Link } from 'react-router-dom';
import { sharePointPdfUrlFromMirror } from '../utils/sharepointUrls';
import MatchHighlight from './MatchHighlight';
import SearchHitBadges from './SearchHitBadges';

/**
 * @param {{ doc: object, categoryId: string, categoryTitle: string }} row
 * @param {string} [searchQuery] when set (≥2 chars), title highlighting and match badges apply
 * @param {() => void} [onNavigate]
 * @param {boolean} [active]
 */
export default function SearchHitRow({ row, searchQuery = '', onNavigate, active }) {
  const { doc, categoryId, categoryTitle } = row;
  const spUrl = doc.pdfPath ? sharePointPdfUrlFromMirror(doc.pdfPath) : null;

  const titleContent = <MatchHighlight text={doc.title} query={searchQuery} />;

  return (
    <div
      className={`archive-search-row${active ? ' archive-search-row-active' : ''}`}
      role={active !== undefined ? 'option' : undefined}
      aria-selected={active !== undefined ? active : undefined}
    >
      <div className="archive-search-row-main">
        <span className="archive-search-title">
          {spUrl ? (
            <a
              href={spUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="archive-search-title-link"
              onClick={onNavigate}
            >
              {titleContent}
            </a>
          ) : (
            titleContent
          )}
        </span>
        {searchQuery.trim().length >= 2 ? (
          <SearchHitBadges doc={doc} searchQuery={searchQuery} />
        ) : null}
        <span className="archive-search-cat">{categoryTitle}</span>
      </div>
      <div className="archive-search-row-actions">
        <Link
          to={`/category/${categoryId}`}
          className="archive-search-link archive-search-link-muted"
          onClick={onNavigate}
        >
          Category
        </Link>
      </div>
    </div>
  );
}
