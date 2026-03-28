import React, { useCallback, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ArchiveSearch from '../components/ArchiveSearch';
import { categories, mockDocuments } from '../data/mockDocuments';
import { documentMatchesQuery } from '../utils/searchArchive';
import { FileText, Music, Video, ShieldAlert, Copy, Check, ExternalLink } from 'lucide-react';
import { sharePointPdfUrlFromMirror } from '../utils/sharepointUrls';
import { meetingSummaryRoute, publicSummaryUrl } from '../utils/meetingMediaUrls';
import MatchHighlight from '../components/MatchHighlight';
import SearchHitBadges from '../components/SearchHitBadges';

export default function CategoryPage() {
  const { id } = useParams();
  const [copiedKey, setCopiedKey] = useState(null);
  const [draftQuery, setDraftQuery] = useState('');
  const [listFilter, setListFilter] = useState('');

  const category = categories.find((c) => c.id === id);
  const documents = useMemo(() => mockDocuments[id] || [], [id]);

  const filterActive = listFilter.length >= 2;

  const visibleDocs = useMemo(() => {
    if (!filterActive) return documents;
    return documents.filter((d) => documentMatchesQuery(d, listFilter));
  }, [documents, listFilter, filterActive]);

  const copyText = useCallback(async (text, key) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      window.setTimeout(() => setCopiedKey((k) => (k === key ? null : k)), 2000);
    } catch {
      setCopiedKey(null);
    }
  }, []);

  if (!category) {
    return <div style={{ padding: '2rem' }}>Category not found.</div>;
  }

  return (
    <div className="category-page">
      <div className="section-header" style={{ marginBottom: '0.5rem' }}>
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
          <ShieldAlert
            size={48}
            color="#94a3b8"
            style={{ marginBottom: '1rem', marginLeft: 'auto', marginRight: 'auto' }}
          />
          <p style={{ color: 'var(--text-secondary)' }}>No documents currently available in this archive.</p>
        </div>
      ) : filterActive && visibleDocs.length === 0 ? (
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          No documents in this category match that search. Clear the filter or try another term.
        </p>
      ) : (
        <div className="document-list">
          {visibleDocs.map((doc) => {
            const spUrl = doc.pdfPath ? sharePointPdfUrlFromMirror(doc.pdfPath) : null;
            const summaryUrl = publicSummaryUrl(doc.mdPath);
            const videoUrl = doc.videoUrl?.trim() || null;
            const isVideoRow = doc.type === 'Video';
            const summaryPageUrl =
              typeof window !== 'undefined'
                ? `${window.location.origin}${meetingSummaryRoute(doc.id)}`
                : meetingSummaryRoute(doc.id);
            const copyPrimaryKey = `${doc.id}-primary`;
            const copyPrimaryValue = isVideoRow
              ? videoUrl || summaryPageUrl
              : videoUrl || summaryUrl || spUrl || doc.pdfPath;

            return (
              <div key={doc.id} className="document-item document-item-archive">
                {isVideoRow ? (
                  <Video className="doc-icon" size={24} />
                ) : doc.type === 'WAV' || doc.type === 'MP3' ? (
                  <Music className="doc-icon" size={24} />
                ) : (
                  <FileText className="doc-icon" size={24} />
                )}

                <div className="doc-info">
                  <div className="doc-title">
                    <MatchHighlight text={doc.title} query={filterActive ? listFilter : ''} />
                  </div>
                  {filterActive ? <SearchHitBadges doc={doc} searchQuery={listFilter} /> : null}
                  <div className="doc-meta">
                    <span>{isVideoRow ? 'Meeting' : doc.type}</span>
                    {doc.mdPath ? (
                      <>
                        <span style={{ color: '#64748b' }}>•</span>
                        <span>{isVideoRow ? 'Written summary (searchable)' : 'Markdown paired'}</span>
                      </>
                    ) : (
                      <>
                        <span style={{ color: '#64748b' }}>•</span>
                        <span>PDF only (manifest)</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="document-item-actions">
                  {videoUrl ? (
                    <a
                      href={videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="doc-action-btn doc-action-primary"
                    >
                      <ExternalLink size={16} aria-hidden />
                      Open meeting recording
                    </a>
                  ) : null}
                  {isVideoRow && summaryUrl ? (
                    <Link
                      to={meetingSummaryRoute(doc.id)}
                      className={`doc-action-btn${videoUrl ? '' : ' doc-action-primary'}`}
                    >
                      Read written summary
                    </Link>
                  ) : null}
                  {spUrl ? (
                    <a
                      href={spUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="doc-action-btn doc-action-primary"
                    >
                      <ExternalLink size={16} aria-hidden />
                      Open in SharePoint
                    </a>
                  ) : null}
                  {copyPrimaryValue ? (
                    <button
                      type="button"
                      className="doc-action-btn"
                      onClick={() => copyText(copyPrimaryValue, copyPrimaryKey)}
                    >
                      {copiedKey === copyPrimaryKey ? <Check size={16} /> : <Copy size={16} />}
                      {copiedKey === copyPrimaryKey
                        ? 'Copied'
                        : videoUrl
                          ? 'Copy recording link'
                          : isVideoRow
                            ? 'Copy link to summary page'
                            : summaryUrl
                              ? 'Copy summary file link'
                              : spUrl
                                ? 'Copy SharePoint link'
                                : 'Copy PDF path'}
                    </button>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
