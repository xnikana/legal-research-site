import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ExternalLink } from 'lucide-react';
import { mockDocuments } from '../data/mockDocuments';
import { publicSummaryUrl } from '../utils/meetingMediaUrls';

const MEETING_CAT = 'video';

const mdLink = ({ children, ...props }) => (
  <a {...props} target="_blank" rel="noopener noreferrer">
    {children}
  </a>
);

function MeetingSummaryBody({ doc, mdFetchUrl }) {
  const [markdown, setMarkdown] = useState(null);
  const [fetchError, setFetchError] = useState(null);
  const videoUrl = doc.videoUrl?.trim() || null;
  const loading = markdown === null && fetchError === null;

  useEffect(() => {
    let cancelled = false;

    fetch(mdFetchUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`Could not load summary (${res.status})`);
        return res.text();
      })
      .then((text) => {
        if (!cancelled) {
          setMarkdown(text);
          setFetchError(null);
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setFetchError(e.message || 'Failed to load summary.');
          setMarkdown(null);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [mdFetchUrl]);

  return (
    <article className="meeting-summary-page">
      <div className="meeting-summary-toolbar">
        <Link to={`/category/${MEETING_CAT}`} className="meeting-summary-back">
          ← Back to meetings
        </Link>
        {videoUrl ? (
          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="meeting-summary-video-link"
          >
            <ExternalLink size={16} aria-hidden />
            Open meeting recording
          </a>
        ) : null}
      </div>

      <header className="meeting-summary-header">
        <h1 className="meeting-summary-title">{doc.title}</h1>
      </header>

      {loading ? (
        <p className="meeting-summary-status" style={{ color: 'var(--text-secondary)' }}>
          Loading summary…
        </p>
      ) : null}
      {fetchError ? (
        <p className="meeting-summary-status" role="alert" style={{ color: '#b91c1c' }}>
          {fetchError}
        </p>
      ) : null}

      {markdown !== null && !fetchError ? (
        <div className="capabilities-doc-body meeting-summary-markdown">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ a: mdLink }}>
            {markdown}
          </ReactMarkdown>
        </div>
      ) : null}
    </article>
  );
}

export default function MeetingSummaryPage() {
  const { docId } = useParams();
  const doc = (mockDocuments[MEETING_CAT] || []).find((d) => String(d.id) === String(docId));
  const mdFetchUrl = doc?.mdPath ? publicSummaryUrl(doc.mdPath) : null;

  if (!doc) {
    return (
      <div className="meeting-summary-page" style={{ padding: '2rem' }}>
        <p style={{ color: 'var(--text-secondary)' }}>This meeting summary was not found.</p>
        <Link to={`/category/${MEETING_CAT}`}>Back to town meeting videos</Link>
      </div>
    );
  }

  if (!mdFetchUrl) {
    return (
      <div className="meeting-summary-page" style={{ padding: '2rem' }}>
        <p style={{ color: 'var(--text-secondary)' }}>No summary file is available for this meeting.</p>
        <Link to={`/category/${MEETING_CAT}`}>Back to town meeting videos</Link>
      </div>
    );
  }

  return <MeetingSummaryBody key={mdFetchUrl} doc={doc} mdFetchUrl={mdFetchUrl} />;
}
