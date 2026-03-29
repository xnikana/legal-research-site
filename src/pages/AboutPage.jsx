import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import capabilitiesMd from '../../CAPABILITIES.md?raw';

export default function AboutPage() {
  return (
    <article className="capabilities-doc">
      <div style={{ textAlign: 'center', padding: '2rem 0 1.5rem' }}>
        <img
          src="/ingestion-engine.webp"
          alt="Ingestion engine diagram — DGX-powered pipeline converting PDF, DOCX, WAV, MOV, MP4, and XLSX into searchable text using PyMuPDF4LLM, Marker, and OpenAI Whisper"
          style={{ maxWidth: '480px', width: '100%', borderRadius: '16px' }}
        />
        <p style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          GPU-accelerated ingestion pipeline — converts PDFs, Word docs, spreadsheets, and audio/video into searchable text
        </p>
      </div>
      <div className="capabilities-doc-body">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{capabilitiesMd}</ReactMarkdown>
      </div>
    </article>
  );
}
