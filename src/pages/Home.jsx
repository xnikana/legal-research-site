import React, { useMemo, useState } from 'react';
import ArchiveSearch from '../components/ArchiveSearch';
import DocumentCard from '../components/DocumentCard';
import { categories } from '../data/mockDocuments';
import { searchArchive } from '../utils/searchArchive';
import { ShieldCheck } from 'lucide-react';

const accentByCategory = Object.fromEntries(categories.map((c) => [c.id, c.colorAccent]));

const INLINE_LIMIT = 50000;

const FILE_TYPE_FILTERS = [
  { id: null,           label: 'All types',   color: '#64748b' },
  { id: 'pdf',          label: 'PDF',          color: '#3b82f6' },
  { id: 'video',        label: 'Video',        color: '#ef4444' },
  { id: 'word',         label: 'Word',         color: '#8b5cf6' },
  { id: 'spreadsheet',  label: 'Spreadsheet',  color: '#22c55e' },
  { id: 'audio',        label: 'Audio',        color: '#f59e0b' },
];

export default function Home() {
  const [draftQuery, setDraftQuery] = useState('');
  const [committedQuery, setCommittedQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState(null);
  const filterActive = committedQuery.length >= 2;

  const { results: inlineResults, total: inlineTotal } = useMemo(
    () =>
      filterActive
        ? searchArchive(committedQuery, INLINE_LIMIT, typeFilter)
        : { results: [], total: 0 },
    [committedQuery, filterActive, typeFilter],
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

      <div style={{
        background: '#fffbeb',
        border: '1px solid #fcd34d',
        borderRadius: '8px',
        padding: '0.75rem 1rem',
        marginBottom: '1rem',
        fontSize: '0.875rem',
        color: '#92400e',
        lineHeight: 1.5,
      }}>
        <strong>Before opening any documents:</strong> you must first visit the{' '}
        <a
          href="https://twnbarrintonri.sharepoint.com/:f:/s/BoardandCommissionPacketLibrary/Es4wuqEH_bJNp0Mdm-ZC4XsB0Mu7WJozo__I3Bi_Un0oYw?e=EHQOBH"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#b45309', fontWeight: 600 }}
        >
          SharePoint library link
        </a>{' '}
        to establish a public session. Without this step, SharePoint will prompt you to log in even though the files are publicly accessible.
      </div>

      <ArchiveSearch
        query={draftQuery}
        onQueryChange={setDraftQuery}
        onCommitSearch={setCommittedQuery}
      />

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
        {FILE_TYPE_FILTERS.map(({ id, label, color }) => {
          const active = typeFilter === id;
          return (
            <button
              key={String(id)}
              type="button"
              onClick={() => setTypeFilter(id)}
              style={{
                padding: '0.3rem 0.85rem',
                borderRadius: '999px',
                border: `1.5px solid ${active ? color : 'var(--border-color)'}`,
                background: active ? color : 'var(--card-bg)',
                color: active ? '#fff' : 'var(--text-secondary)',
                fontWeight: active ? 600 : 400,
                fontSize: '0.8rem',
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.15s',
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

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
            <div className="document-list">
              {inlineResults.map((row) => (
                <DocumentCard
                  key={`${row.categoryId}-${row.doc.id}`}
                  doc={row.doc}
                  accent={accentByCategory[row.categoryId] || 'var(--accent-blue)'}
                  searchQuery={committedQuery}
                  categoryTitle={row.categoryTitle}
                />
              ))}
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
