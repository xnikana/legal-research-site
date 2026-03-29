import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ArchiveSearch from '../components/ArchiveSearch';
import DocumentCard from '../components/DocumentCard';
import { categories, mockDocuments } from '../data/mockDocuments';
import { searchArchive } from '../utils/searchArchive';
import {
  FileText, Video, Music, Table, MessageSquare, BookOpen, BarChart2,
} from 'lucide-react';

const accentByCategory = Object.fromEntries(categories.map((c) => [c.id, c.colorAccent]));

const INLINE_LIMIT = 50000;

const FILE_TYPE_FILTERS = [
  { id: null,          label: 'All types',  color: '#64748b' },
  { id: 'pdf',         label: 'PDF',         color: '#3b82f6' },
  { id: 'video',       label: 'Video',       color: '#ef4444' },
  { id: 'word',        label: 'Word',        color: '#8b5cf6' },
  { id: 'spreadsheet', label: 'Spreadsheet', color: '#22c55e' },
  { id: 'audio',       label: 'Audio',       color: '#f59e0b' },
];

const STATS = [
  { value: '502',   label: 'Documents inventoried', color: '#3b82f6' },
  { value: '453',   label: 'Markdown files indexed', color: '#22c55e' },
  { value: '2.18M', label: 'Words searchable',        color: '#8b5cf6' },
  { value: '8',     label: 'Hearings transcribed',    color: '#ef4444' },
];

const CAT_ICONS = { pdf: FileText, video: Video, word: FileText, spreadsheet: Table, audio: Music };

const QUICK_LINKS = [
  { to: '/chat',        icon: MessageSquare, label: 'Ask the Archive',  desc: 'Natural language Q&A with source citations',  color: '#3b82f6' },
  { to: '/legal-guide', icon: BookOpen,      label: 'RI Legal Guide',   desc: '10-section Rhode Island land use law reference', color: '#8b5cf6' },
  { to: '/archive-stats', icon: BarChart2,   label: 'Archive Stats',    desc: 'Coverage breakdown across all document types',  color: '#22c55e' },
];

export default function Home() {
  const [draftQuery, setDraftQuery] = useState('');
  const [committedQuery, setCommittedQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState(null);

  const filterActive = committedQuery.length >= 2;
  // collapse browse content as soon as user starts typing
  const searching = draftQuery.length >= 2 || filterActive;

  const { results: inlineResults, total: inlineTotal } = useMemo(
    () =>
      filterActive
        ? searchArchive(committedQuery, INLINE_LIMIT, typeFilter)
        : { results: [], total: 0 },
    [committedQuery, filterActive, typeFilter],
  );

  return (
    <div className="home-page">

      {/* Hero — collapses when searching */}
      <div className={`home-hero${searching ? ' home-hero--collapsed' : ''}`}>
        <div className="home-hero-inner">
          <h1 className="hero-title">Municipal Planning Records</h1>
          <p className="hero-subtitle">
            Comprehensive archive of municipal planning materials — searchable, indexed, and AI-ready.
          </p>
        </div>
      </div>

      {/* SharePoint session warning */}
      <div className={`home-banner${searching ? ' home-banner--hidden' : ''}`}>
        <strong>Before opening documents:</strong> visit the{' '}
        <a
          href="https://twnbarrintonri.sharepoint.com/:f:/s/BoardandCommissionPacketLibrary/Es4wuqEH_bJNp0Mdm-ZC4XsB0Mu7WJozo__I3Bi_Un0oYw?e=EHQOBH"
          target="_blank"
          rel="noopener noreferrer"
        >
          SharePoint library link
        </a>{' '}
        first to establish a public session — otherwise SharePoint will prompt you to log in.
      </div>

      {/* Search + filter pills — always visible */}
      <ArchiveSearch
        query={draftQuery}
        onQueryChange={setDraftQuery}
        onCommitSearch={setCommittedQuery}
      />

      <div className="home-filter-pills">
        {FILE_TYPE_FILTERS.map(({ id, label, color }) => {
          const active = typeFilter === id;
          return (
            <button
              key={String(id)}
              type="button"
              onClick={() => setTypeFilter(id)}
              className={`home-filter-pill${active ? ' home-filter-pill--active' : ''}`}
              style={active ? { '--pill-color': color, borderColor: color, background: color } : { '--pill-color': color }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* ── Search results ── */}
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
              onClick={() => { setCommittedQuery(''); setDraftQuery(''); }}
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
            <p style={{ color: 'var(--text-secondary)' }}>
              No documents match that search. Try another term or clear the filter.
            </p>
          )}
        </>
      ) : null}

      {/* ── Browse content — hidden while searching ── */}
      <div className={`home-browse${searching ? ' home-browse--hidden' : ''}`} aria-hidden={searching}>

        {/* Stats strip */}
        <div className="home-stats">
          {STATS.map(({ value, label, color }) => (
            <div key={label} className="home-stat-card" style={{ '--stat-color': color }}>
              <div className="home-stat-value" style={{ color }}>{value}</div>
              <div className="home-stat-label">{label}</div>
            </div>
          ))}
        </div>

        {/* Category grid */}
        <div className="home-section-label">Browse by file type</div>
        <div className="home-cat-grid">
          {categories.map((cat) => {
            const Icon = CAT_ICONS[cat.id] || FileText;
            const count = mockDocuments[cat.id]?.length ?? 0;
            return (
              <Link
                key={cat.id}
                to={`/category/${cat.id}`}
                className="home-cat-card"
                style={{ '--cat-color': cat.colorAccent }}
              >
                <div className="home-cat-card-top">
                  <Icon size={22} style={{ color: cat.colorAccent }} aria-hidden />
                  <span className="home-cat-count" style={{ color: cat.colorAccent }}>{count}</span>
                </div>
                <div className="home-cat-title">{cat.title}</div>
                <div className="home-cat-desc">{cat.description.split('.')[0]}.</div>
              </Link>
            );
          })}
        </div>

        {/* Quick access */}
        <div className="home-section-label">Tools &amp; resources</div>
        <div className="home-quick-grid">
          {QUICK_LINKS.map(({ to, icon: Icon, label, desc, color }) => (
            <Link key={to} to={to} className="home-quick-card" style={{ '--quick-color': color }}>
              <Icon size={20} style={{ color }} aria-hidden />
              <div>
                <div className="home-quick-title">{label}</div>
                <div className="home-quick-desc">{desc}</div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
