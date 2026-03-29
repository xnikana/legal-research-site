import React from 'react';
import { Link } from 'react-router-dom';
import { FolderOpen, FileText, ExternalLink } from 'lucide-react';
import { sharePointPdfUrlFromMirror } from '../utils/sharepointUrls';
import { meetingSummaryRoute, publicMdUrl } from '../utils/meetingMediaUrls';
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
  const spUrl = doc.sharepointUrl || (doc.pdfPath ? sharePointPdfUrlFromMirror(doc.pdfPath) : null);
  const mdUrl = publicMdUrl(doc.mdPath);
  const videoUrl = doc.videoUrl?.trim() || null;
  const isVideo = doc.type === 'Video' || doc.type === 'MOV' || doc.type === 'MP4';
  const parentFolderUrl = doc.parentFolderUrl || null;
  const folderOrVideoUrl = parentFolderUrl || (isVideo ? videoUrl : null);

  const titleContent = <MatchHighlight text={doc.title} query={searchQuery} />;

  return (
    <div
      className={`archive-search-row${active ? ' archive-search-row-active' : ''}`}
      role={active !== undefined ? 'option' : undefined}
      aria-selected={active !== undefined ? active : undefined}
    >
      <div className="archive-search-row-main">
        <span className="archive-search-title">
          {titleContent}
        </span>
        {searchQuery.trim().length >= 2 ? (
          <SearchHitBadges doc={doc} searchQuery={searchQuery} />
        ) : null}
        <span className="archive-search-cat">{categoryTitle}</span>
      </div>
      <div className="archive-search-row-actions">
        {isVideo && mdUrl ? (
          <Link
            to={meetingSummaryRoute(doc.id)}
            className="archive-search-link"
            onClick={onNavigate}
          >
            <FileText size={13} aria-hidden />
            Summary
          </Link>
        ) : mdUrl ? (
          <a
            href={mdUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="archive-search-link"
            onClick={onNavigate}
          >
            <FileText size={13} aria-hidden />
            Markdown
          </a>
        ) : null}
        {spUrl && !isVideo ? (
          <a
            href={spUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="archive-search-link"
            onClick={onNavigate}
          >
            <ExternalLink size={13} aria-hidden />
            Document
          </a>
        ) : null}
        {folderOrVideoUrl ? (
          <a
            href={folderOrVideoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="archive-search-link archive-search-link-muted"
            onClick={onNavigate}
          >
            <FolderOpen size={13} aria-hidden />
            {isVideo ? 'Recording' : 'Folder'}
          </a>
        ) : null}
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
