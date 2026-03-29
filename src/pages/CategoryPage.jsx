import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ArchiveSearch from '../components/ArchiveSearch';
import { categories, mockDocuments } from '../data/mockDocuments';
import { documentMatchesQuery } from '../utils/searchArchive';
import { FileText, Music, Video, Table, ShieldAlert, Clock, FolderOpen, ExternalLink } from 'lucide-react';
import { sharePointPdfUrlFromMirror } from '../utils/sharepointUrls';
import { meetingSummaryRoute, publicSummaryUrl, publicMdUrl } from '../utils/meetingMediaUrls';
import MatchHighlight from '../components/MatchHighlight';
import SearchHitBadges from '../components/SearchHitBadges';

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
          {visibleDocs.map((doc) => {
            const spUrl = doc.sharepointUrl || (doc.pdfPath ? sharePointPdfUrlFromMirror(doc.pdfPath) : null);
            const summaryUrl = publicSummaryUrl(doc.mdPath);
            const videoUrl = doc.videoUrl?.trim() || null;
            const isVideoRow = doc.type === 'Video' || doc.type === 'MOV' || doc.type === 'MP4';
            const parentFolderUrl = doc.parentFolderUrl || null;

            return (
              <div key={doc.id} className="document-item document-item-archive">
                {isVideoRow ? (
                  <Video className="doc-icon" size={24} style={{ color: accent }} />
                ) : doc.type === 'WAV' || doc.type === 'MP3' || doc.type === 'M4A' ? (
                  <Music className="doc-icon" size={24} style={{ color: accent }} />
                ) : doc.type === 'XLSX' || doc.type === 'XLS' || doc.type === 'CSV' ? (
                  <Table className="doc-icon" size={24} style={{ color: accent }} />
                ) : (
                  <FileText className="doc-icon" size={24} style={{ color: accent }} />
                )}

                <div className="doc-info">
                  <div className="doc-title">
                    <MatchHighlight text={doc.title} query={filterActive ? listFilter : ''} />
                  </div>
                  {filterActive ? <SearchHitBadges doc={doc} searchQuery={listFilter} /> : null}
                  <div className="doc-meta">
                    <span>{doc.type}</span>
                    {doc.folder ? (
                      <>
                        <span style={{ color: '#64748b' }}>•</span>
                        <span style={{ color: 'var(--text-secondary)' }}>{doc.folder}</span>
                      </>
                    ) : null}
                    {doc.date && doc.date !== '—' ? (
                      <>
                        <span style={{ color: '#64748b' }}>•</span>
                        <span>{doc.date}</span>
                      </>
                    ) : null}
                    {doc.mdPath ? (
                      <>
                        <span style={{ color: '#64748b' }}>•</span>
                        <span>{isVideoRow ? 'Written summary (searchable)' : 'Text indexed'}</span>
                      </>
                    ) : null}
                  </div>
                </div>

                <div className="document-item-actions">
                  {isVideoRow && summaryUrl ? (
                    <Link
                      to={meetingSummaryRoute(doc.id)}
                      className="doc-action-btn doc-action-primary"
                    >
                      View Markdown (local)
                    </Link>
                  ) : doc.mdPath && !isVideoRow ? (
                    <a
                      href={publicMdUrl(doc.mdPath)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="doc-action-btn doc-action-primary"
                    >
                      View Markdown (local)
                    </a>
                  ) : null}
                  {parentFolderUrl ? (
                    <a
                      href={parentFolderUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="doc-action-btn"
                    >
                      <FolderOpen size={16} aria-hidden />
                      Goto SharePoint Folder
                    </a>
                  ) : videoUrl ? (
                    <a
                      href={videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="doc-action-btn"
                    >
                      <ExternalLink size={16} aria-hidden />
                      Goto SharePoint Folder
                    </a>
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
