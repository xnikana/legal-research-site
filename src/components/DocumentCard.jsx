import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Music, Video, Table, FolderOpen, ExternalLink } from 'lucide-react';
import { sharePointPdfUrlFromMirror } from '../utils/sharepointUrls';
import { meetingSummaryRoute, publicMdUrl } from '../utils/meetingMediaUrls';
import MatchHighlight from './MatchHighlight';
import SearchHitBadges from './SearchHitBadges';

/**
 * Full-size document card — used by CategoryPage and Home full results.
 * @param {{ doc: object, accent: string, searchQuery?: string, categoryTitle?: string }} props
 */
export default function DocumentCard({ doc, accent, searchQuery = '', categoryTitle }) {
  const spUrl = doc.sharepointUrl || (doc.pdfPath ? sharePointPdfUrlFromMirror(doc.pdfPath) : null);
  const mdUrl = publicMdUrl(doc.mdPath);
  const videoUrl = doc.videoUrl?.trim() || null;
  const isVideoRow = doc.type === 'Video' || doc.type === 'MOV' || doc.type === 'MP4';
  const isAudio = doc.type === 'WAV' || doc.type === 'MP3' || doc.type === 'M4A';
  const isSpreadsheet = doc.type === 'XLSX' || doc.type === 'XLS' || doc.type === 'CSV';
  const parentFolderUrl = doc.parentFolderUrl || null;
  const filterActive = searchQuery.trim().length >= 2;

  return (
    <div className="document-item document-item-archive">
      {isVideoRow ? (
        <Video className="doc-icon" size={24} style={{ color: accent }} />
      ) : isAudio ? (
        <Music className="doc-icon" size={24} style={{ color: accent }} />
      ) : isSpreadsheet ? (
        <Table className="doc-icon" size={24} style={{ color: accent }} />
      ) : (
        <FileText className="doc-icon" size={24} style={{ color: accent }} />
      )}

      <div className="doc-info">
        <div className="doc-title">
          <MatchHighlight text={doc.title} query={filterActive ? searchQuery : ''} />
        </div>
        {filterActive ? <SearchHitBadges doc={doc} searchQuery={searchQuery} /> : null}
        <div className="doc-meta">
          <span>{doc.type}</span>
          {categoryTitle ? (
            <>
              <span style={{ color: '#94a3b8' }}>•</span>
              <span style={{ color: accent, fontWeight: 500 }}>{categoryTitle}</span>
            </>
          ) : doc.folder ? (
            <>
              <span style={{ color: '#94a3b8' }}>•</span>
              <span>{doc.folder}</span>
            </>
          ) : null}
          {doc.date && doc.date !== '—' ? (
            <>
              <span style={{ color: '#94a3b8' }}>•</span>
              <span>{doc.date}</span>
            </>
          ) : null}
          {doc.mdPath ? (
            <>
              <span style={{ color: '#94a3b8' }}>•</span>
              <span>{isVideoRow ? 'Written summary (searchable)' : 'Text indexed'}</span>
            </>
          ) : null}
        </div>
      </div>

      <div className="document-item-actions">
        {isVideoRow && mdUrl ? (
          <Link to={meetingSummaryRoute(doc.id)} className="doc-action-btn doc-action-primary">
            View Summary
          </Link>
        ) : mdUrl ? (
          <a
            href={mdUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="doc-action-btn doc-action-primary"
          >
            View Markdown
          </a>
        ) : spUrl ? (
          <a
            href={spUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="doc-action-btn doc-action-primary"
          >
            <ExternalLink size={14} aria-hidden />
            Open Document
          </a>
        ) : null}
        {parentFolderUrl ? (
          <a
            href={parentFolderUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="doc-action-btn doc-action-secondary"
          >
            <FolderOpen size={14} aria-hidden />
            SharePoint Folder
          </a>
        ) : videoUrl && isVideoRow ? (
          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="doc-action-btn doc-action-secondary"
          >
            <ExternalLink size={14} aria-hidden />
            Recording
          </a>
        ) : null}
      </div>
    </div>
  );
}
