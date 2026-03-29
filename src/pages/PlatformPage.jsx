import React from 'react';
import { Link } from 'react-router-dom';

const FEATURES = [
  {
    img: '/platform-search-falcon.png',
    alt: 'Peregrine falcon diving through a vast archive of floating documents',
    title: 'Full-Text Archive Search',
    subtitle: 'The falcon — precision at speed',
    body: `Every word across all 502 inventoried documents and 2.18 million indexed characters is searchable in a single query. Results appear as you type in a live dropdown preview with highlighted match fragments, file type badges, and document metadata. File type filter pills — PDF, Video, Word, Spreadsheet, Audio — let you scope results before committing. Pressing Enter expands to a full result set rendered as rich document cards with direct action buttons to the source material.`,
  },
  {
    img: '/platform-chat-owl.png',
    alt: 'Great horned owl perched on legal documents in a dark archive, illuminated by a shaft of blue light',
    title: 'Ask the Archive',
    subtitle: 'The owl — synthesis from deep knowledge',
    body: `A Claude-powered conversational interface that answers natural-language questions about the municipal record. Every response is grounded in retrieved document chunks from the indexed archive and includes inline source citations — no hallucinated facts, no unsupported claims. Ask "What did the planning board decide about the Belton Court setback variance?" and receive a structured, evidence-backed answer with links to the source documents. The archive doesn't just store information — it reasons over it.`,
  },
  {
    img: '/platform-legal-guide-tortoise.png',
    alt: 'Ancient giant tortoise carrying a briefcase through a columned hall carved with legal text',
    title: 'RI Legal Research Guide',
    subtitle: 'The tortoise — authoritative, deliberate, complete',
    body: `A 10-section Rhode Island public records and land use law reference built for legal practitioners working in the RI municipal planning context. Covers the Comprehensive Permit Act (§ 45-53), Zoning Enabling Act (§ 45-24), RIDEM environmental regulations, APRA public records access (§ 38-2), the Open Meetings Act (§ 42-46), appeals and judicial review before the Superior Court Land Use Calendar, and a full research workflow with portals and tools. Rendered inline with a navigable table of contents — no PDFs, no downloads.`,
  },
  {
    img: '/platform-transcripts-elephant.png',
    alt: 'Elephant standing in a vast amphitheater surrounded by glowing concentric rings of transcribed text',
    title: 'Meeting Transcript Viewer',
    subtitle: 'The elephant — it never forgets',
    body: `Eight Planning Board hearings transcribed by OpenAI Whisper large-v3 on a DGX GPU and surfaced as readable, searchable written summaries. Every motion, vote, public comment, and board discussion is preserved in structured Markdown and indexed for full-text search alongside all other documents in the archive. Each meeting page links directly to the official video recording. The public record of every hearing — not just the minutes — is now searchable text.`,
  },
  {
    img: '/platform-archive-bee.png',
    alt: 'Honeybee hovering before a vast geometric honeycomb of glowing documents',
    title: 'Archive Document Browser',
    subtitle: 'The bee — organized, industrious, exhaustive',
    body: `Five category views — PDF, Video, Word, Spreadsheet, Audio — each with scoped full-text search, folder metadata, date, and per-document action buttons. Every one of the 502 inventoried documents appears in the archive regardless of whether a Markdown conversion exists — documents with indexed text show a View Markdown button; all others link directly to their SharePoint source location. Nothing in the inventory is hidden. The archive is the complete public record, not a curated subset.`,
  },
];

export default function PlatformPage() {
  return (
    <article className="capabilities-doc">
      <div style={{ padding: '2rem 0 1rem' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#64748b', marginBottom: '0.5rem' }}>
            legal-research.tech
          </div>
          <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.25rem)', fontWeight: 900, color: 'var(--text-primary)', margin: '0 0 0.75rem' }}>
            The Research Platform
          </h1>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: '52rem', margin: 0 }}>
            The ingestion pipeline exists to feed this: a public, zero-login research environment built on top of 502 inventoried municipal documents, 453 indexed Markdown files, and 2.18 million searchable words. Every feature below is live at{' '}
            <a href="https://legal-research.tech" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-blue)' }}>legal-research.tech</a>.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
          {FEATURES.map(({ img, alt, title, subtitle, body }, i) => (
            <React.Fragment key={title}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '2.5rem',
                  alignItems: 'center',
                }}
                className="platform-feature-row"
              >
                <div style={{ order: i % 2 === 0 ? 0 : 1 }} className="platform-feature-img-wrap">
                  <img
                    src={img}
                    alt={alt}
                    style={{ width: '100%', borderRadius: '16px', display: 'block', boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}
                  />
                </div>
                <div style={{ order: i % 2 === 0 ? 1 : 0 }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent-blue)', marginBottom: '0.4rem' }}>
                    {subtitle}
                  </div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.85rem', lineHeight: 1.25 }}>
                    {title}
                  </h2>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.75, margin: 0 }}>
                    {body}
                  </p>
                </div>
              </div>
              {i === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                  <img
                    src="/chat-screenshot.png"
                    alt="Ask the Archive — live Claude response grounded in the municipal archive"
                    style={{ width: '100%', maxWidth: '860px', borderRadius: '12px', display: 'block', boxShadow: '0 8px 32px rgba(0,0,0,0.22)', border: '1px solid #1e3a5f' }}
                  />
                  <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0, letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 600 }}>
                    Live response — Claude grounded in the municipal archive
                  </p>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        <div style={{ marginTop: '4rem', padding: '2rem', background: '#0a1628', borderRadius: '12px', textAlign: 'center' }}>
          <p style={{ color: '#93c5fd', fontSize: '0.85rem', margin: '0 0 1rem', lineHeight: 1.6 }}>
            Powered by the GPU-accelerated ingestion pipeline — Whisper, Marker, and a vision-guided browser agent on a DGX workstation.
          </p>
          <Link
            to="/capabilities"
            style={{ color: 'var(--accent-blue)', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'underline', textUnderlineOffset: 3 }}
          >
            How the pipeline works →
          </Link>
        </div>
      </div>
    </article>
  );
}
