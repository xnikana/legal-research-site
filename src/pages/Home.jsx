import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ArchiveSearch from '../components/ArchiveSearch';
import SearchHitRow from '../components/SearchHitRow';
import { categories } from '../data/mockDocuments';
import { searchArchive } from '../utils/searchArchive';
import { Users, FileText, Activity, ClipboardList, Scale, ArrowRight, ShieldCheck } from 'lucide-react';

const iconMap = {
  'users': Users,
  'file-text': FileText,
  'activity': Activity,
  'clipboard-list': ClipboardList,
  'scale': Scale
};

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
        <h1 className="hero-title">Town of Barrington Public Records</h1>
        <p className="hero-subtitle">
          Comprehensive physical and digital archive of municipal planning materials,
          specifically regarding the Belton Court permit application process.
        </p>
      </div>

      <h2 className="section-header">Record Categories</h2>

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

      {!filterActive ? (
        <div className="home-category-grid">
          {categories.map((cat) => {
            const IconComponent = iconMap[cat.iconType] || FileText;
            return (
              <Link to={`/category/${cat.id}`} key={cat.id} style={{ display: 'block' }}>
                <div
                  className="document-item"
                  style={{
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    height: '100%',
                    gap: '0.75rem',
                    padding: '1.5rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%' }}>
                    <div style={{ padding: '0.5rem', background: '#eff6ff', borderRadius: '8px' }}>
                      <IconComponent className="doc-icon" size={24} />
                    </div>
                    <h3
                      style={{
                        fontSize: '1.125rem',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        flex: 1,
                      }}
                    >
                      {cat.title}
                    </h3>
                    <ArrowRight size={16} color="#94a3b8" />
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {cat.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
