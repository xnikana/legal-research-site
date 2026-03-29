import React, { useMemo, useState } from 'react';
import ArchiveSearch from '../components/ArchiveSearch';
import SearchHitRow from '../components/SearchHitRow';
import { searchArchive } from '../utils/searchArchive';
import { ShieldCheck } from 'lucide-react';

const INLINE_LIMIT = 50000;

export default function Home() {
  const [draftQuery, setDraftQuery] = useState('');
  const [committedQuery, setCommittedQuery] = useState('');
  const filterActive = committedQuery.length >= 2;

  const { results: inlineResults, total: inlineTotal } = useMemo(
    () =>
      filterActive ? searchArchive(committedQuery, INLINE_LIMIT) : { results: [], total: 0 },
    [committedQuery, filterActive],
  );

  return (
    <div className="home-page">
      <div className="hero-section">
        <ShieldCheck size={48} color="var(--accent-blue)" style={{ marginBottom: '1rem' }} />
        <h1 className="hero-title">Municipal Planning Records</h1>
        <p className="hero-subtitle">
          Comprehensive physical and digital archive of municipal planning materials.
        </p>
      </div>

      <ArchiveSearch
        query={draftQuery}
        onQueryChange={setDraftQuery}
        onCommitSearch={setCommittedQuery}
      />

      {filterActive ? (
        <>
          <div className="archive-page-filter-banner">
            <span>
              <strong>{inlineTotal}</strong> result{inlineTotal === 1 ? '' : 's'} for{' '}
              <strong>&quot;{committedQuery}&quot;</strong>
            </span>
            <button
              type="button"
              className="archive-page-filter-clear"
              onClick={() => {
                setCommittedQuery('');
                setDraftQuery('');
              }}
            >
              Clear filter
            </button>
          </div>
          {inlineTotal > 0 ? (
            <div className="archive-inline-results">
              <ul className="archive-inline-results-list">
                {inlineResults.map((row) => (
                  <li key={`${row.categoryId}-${row.doc.id}`}>
                    <SearchHitRow row={row} searchQuery={committedQuery} />
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              No documents match that search. Try another term or clear the filter.
            </p>
          )}
        </>
      ) : null}

    </div>
  );
}
