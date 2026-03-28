import React, { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import { categories, mockDocuments } from '../data/mockDocuments';
import { FileText, Music, ShieldAlert, Copy, Check, ExternalLink } from 'lucide-react';
import { sharePointPdfUrlFromMirror } from '../utils/sharepointUrls';

export default function CategoryPage() {
  const { id } = useParams();
  const [copiedKey, setCopiedKey] = useState(null);

  const category = categories.find((c) => c.id === id);
  const documents = mockDocuments[id] || [];

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
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.1rem' }}>
        {category.description}
      </p>

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
      ) : (
        <div className="document-list">
          {documents.map((doc) => {
            const spUrl = doc.pdfPath ? sharePointPdfUrlFromMirror(doc.pdfPath) : null;
            const copyPdfKey = `${doc.id}-pdf`;
            const pdfCopyValue = spUrl || doc.pdfPath;

            return (
              <div key={doc.id} className="document-item document-item-archive">
                {doc.type === 'WAV' || doc.type === 'MP3' ? (
                  <Music className="doc-icon" size={24} />
                ) : (
                  <FileText className="doc-icon" size={24} />
                )}

                <div className="doc-info">
                  <div className="doc-title">{doc.title}</div>
                  <div className="doc-meta">
                    <span>{doc.type}</span>
                    {doc.mdPath ? (
                      <>
                        <span style={{ color: '#64748b' }}>•</span>
                        <span>Markdown paired</span>
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
                  {pdfCopyValue ? (
                    <button
                      type="button"
                      className="doc-action-btn"
                      onClick={() => copyText(pdfCopyValue, copyPdfKey)}
                    >
                      {copiedKey === copyPdfKey ? <Check size={16} /> : <Copy size={16} />}
                      {copiedKey === copyPdfKey
                        ? 'Copied'
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
