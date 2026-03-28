import React from 'react';
import { useParams } from 'react-router-dom';
import { categories, mockDocuments } from '../data/mockDocuments';
import { FileText, Download, Music, ShieldAlert } from 'lucide-react';

export default function CategoryPage() {
  const { id } = useParams();
  
  const category = categories.find(c => c.id === id);
  const documents = mockDocuments[id] || [];

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
        <div style={{ padding: '3rem', textAlign: 'center', background: 'var(--card-bg)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <ShieldAlert size={48} color="#94a3b8" style={{ marginBottom: '1rem', marginLeft: 'auto', marginRight: 'auto' }} />
          <p style={{ color: 'var(--text-secondary)' }}>No documents currently available in this archive.</p>
        </div>
      ) : (
        <div className="document-list">
          {documents.map(doc => (
            <div key={doc.id} className="document-item">
              {doc.type === 'WAV' || doc.type === 'MP3' ? (
                <Music className="doc-icon" size={24} />
              ) : (
                <FileText className="doc-icon" size={24} />
              )}
              
              <div className="doc-info">
                <div className="doc-title">{doc.title}</div>
                <div className="doc-meta">
                  <span>{doc.date}</span>
                  <span style={{ color: '#64748b' }}>•</span>
                  <span>{doc.type}</span>
                  <span style={{ color: '#64748b' }}>•</span>
                  <span>{doc.size}</span>
                </div>
              </div>

              <button 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  background: '#f1f5f9',
                  color: 'var(--text-primary)',
                  borderRadius: '6px',
                  fontWeight: 500,
                  fontSize: '0.875rem',
                  transition: 'background-color 0.2s',
                  border: '1px solid #e2e8f0'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e2e8f0'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
              >
                <Download size={16} />
                Download
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
