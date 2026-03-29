import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import ArchiveSearch from '../components/ArchiveSearch';
import DocumentCard from '../components/DocumentCard';
import { categories, mockDocuments } from '../data/mockDocuments';
import { documentMatchesQuery } from '../utils/searchArchive';
import { Clock } from 'lucide-react';

export default function CategoryPage() {
  const { id } = useParams();
  const [draftQuery, setDraftQuery] = useState('');
  const [listFilter, setListFilter] = useState('');

  const category = categories.find((c) => c.id === id);
  const documents = useMemo(() => mockDocuments[id] || [], [id]);

  const filterActive = listFilter.length >= 2;

  const visibleDocs = useMemo(() => {
    if (!filterActive) return documents;
    return documents.filter((d) => documentMatchesQuery(d, listFilter));
  }, [documents, listFilter, filterActive]);

  const accent = category?.colorAccent || 'var(--accent-blue)';

  if (!category) {
    return <div style={{ padding: '2rem' }}>Category not found.</div>;
  }

  return (
    <div className="category-page">
      <div
        className="section-header"
        style={{
          marginBottom: '0.5rem',
          borderLeft: `4px solid ${accent}`,
          paddingLeft: '0.75rem',
          color: accent,
        }}
      >
        {category.fullTitle}
      </div>

      <ArchiveSearch
        query={draftQuery}
        onQueryChange={setDraftQuery}
        onCommitSearch={setListFilter}
        categoryId={id}
      />

      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.1rem' }}>
        {category.description}
      </p>

      {filterActive ? (
        <div className="archive-page-filter-banner">
          <span>
            <strong>{visibleDocs.length}</strong> result{visibleDocs.length === 1 ? '' : 's'} for{' '}
            <strong>&quot;{listFilter}&quot;</strong>
            {visibleDocs.length < documents.length ? (
              <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>
                {' '}
                (of {documents.length} in this category)
              </span>
            ) : null}
          </span>
          <button
            type="button"
            className="archive-page-filter-clear"
            onClick={() => {
              setListFilter('');
              setDraftQuery('');
            }}
          >
            Clear filter
          </button>
        </div>
      ) : null}

      {documents.length === 0 ? (
        <div
          style={{
            padding: '3rem',
            textAlign: 'center',
            background: 'var(--card-bg)',
            borderRadius: '12px',
            border: '1px solid var(--border-color)',
          }}
        >
          <Clock
            size={48}
            color={accent}
            style={{ marginBottom: '1rem', marginLeft: 'auto', marginRight: 'auto', opacity: 0.6 }}
          />
          <p style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: '0.4rem' }}>
            No documents ingested yet
          </p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            This file type is recognized by the archive. Documents will appear here once the ingestion pipeline processes files of this format.
          </p>
        </div>
      ) : filterActive && visibleDocs.length === 0 ? (
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          No documents in this category match that search. Clear the filter or try another term.
        </p>
      ) : (
        <div className="document-list">
          {visibleDocs.map((doc) => (
            <DocumentCard
              key={doc.id}
              doc={doc}
              accent={accent}
              searchQuery={filterActive ? listFilter : ''}
            />
          ))}
        </div>
      )}
    </div>
  );
}
