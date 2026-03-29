import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import capabilitiesMd from '../../CAPABILITIES.md?raw';

export default function AboutPage() {
  return (
    <article className="capabilities-doc">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', padding: '2rem 0 1.5rem' }}>
        <div style={{ textAlign: 'center' }}>
          <img
            src="/browser-agent.webp"
            alt="Browser agent — OLlama vision agent using browser-use and GPU-backed Ollama on a DGX to navigate SharePoint, Google Drive, OneDrive, and Dropbox"
            style={{ width: '100%', borderRadius: '16px', display: 'block' }}
          />
          <p style={{ marginTop: '0.75rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Vision-Guided Browser Agent
          </p>
          <p style={{ marginTop: '0.4rem', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
            An autonomous agent discovers and mirrors documents from cloud drives without manual configuration.
            In <strong>BFS/crawl mode</strong> it performs a breadth-first DOM traversal of SharePoint, Google Drive,
            OneDrive, and Dropbox portals, building a JSON inventory of file URLs and metadata.
            In <strong>agent mode</strong> it uses <strong>browser-use</strong> with GPU-backed <strong>Ollama</strong>
            vision inference (moondream / llava:7b on the DGX) to visually interpret pages and navigate
            through login walls, dynamic menus, and nested folder structures that DOM crawling alone cannot reach.
            The resulting inventory feeds directly into the ingestion pipeline.
          </p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <img
            src="/ingestion-engine.webp"
            alt="Ingestion engine — DGX-powered pipeline converting PDF, DOCX, WAV, MOV, MP4, and XLSX into searchable text using PyMuPDF4LLM, Marker, and OpenAI Whisper"
            style={{ width: '100%', borderRadius: '16px', display: 'block' }}
          />
          <p style={{ marginTop: '0.75rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Document Ingestion Pipeline
          </p>
          <p style={{ marginTop: '0.4rem', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
            A three-stage GPU-accelerated pipeline converts any document format into searchable, indexed text.
            Digital PDFs are processed by <strong>PyMuPDF4LLM</strong> (CPU-fast, structure-preserving).
            Scanned or image-heavy documents route through <strong>Marker</strong>, a layout-aware OCR engine
            running on CUDA/PyTorch — capable of ~25 pages/second on an H100.
            Audio and video files (WAV, MOV, MP4) are transcribed by <strong>OpenAI Whisper large-v3</strong>,
            also GPU-accelerated on the DGX workstation. Output is clean Markdown ready for search indexing and RAG retrieval.
          </p>
        </div>
      </div>
      <div className="capabilities-doc-body">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{capabilitiesMd}</ReactMarkdown>
      </div>
    </article>
  );
}
