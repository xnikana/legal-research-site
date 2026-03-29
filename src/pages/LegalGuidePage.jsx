import React, { useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import s01 from '../../SharePoint_PDF_with_associated_MD/documentation/ri-legal-guide/01-intro-research-framework.md?raw';
import s02 from '../../SharePoint_PDF_with_associated_MD/documentation/ri-legal-guide/02-comprehensive-permit-act-45-53.md?raw';
import s03 from '../../SharePoint_PDF_with_associated_MD/documentation/ri-legal-guide/03-zoning-enabling-act-45-24.md?raw';
import s04 from '../../SharePoint_PDF_with_associated_MD/documentation/ri-legal-guide/04-fire-safety-code-nfpa.md?raw';
import s05 from '../../SharePoint_PDF_with_associated_MD/documentation/ri-legal-guide/05-ridem-environmental-regulations.md?raw';
import s06 from '../../SharePoint_PDF_with_associated_MD/documentation/ri-legal-guide/06-water-supply-fire-flow.md?raw';
import s07 from '../../SharePoint_PDF_with_associated_MD/documentation/ri-legal-guide/07-apra-public-records-38-2.md?raw';
import s08 from '../../SharePoint_PDF_with_associated_MD/documentation/ri-legal-guide/08-open-meetings-act-42-46.md?raw';
import s09 from '../../SharePoint_PDF_with_associated_MD/documentation/ri-legal-guide/09-appeals-judicial-review.md?raw';
import s10 from '../../SharePoint_PDF_with_associated_MD/documentation/ri-legal-guide/10-research-workflow-portals.md?raw';

const SECTIONS = [
  { id: 's01', slug: 'intro',          label: 'Introduction & Research Framework',                  content: s01 },
  { id: 's02', slug: 'comprehensive-permit', label: 'Comprehensive Permit Act (§ 45-53)',            content: s02 },
  { id: 's03', slug: 'zoning',         label: 'Zoning Enabling Act (§ 45-24)',                       content: s03 },
  { id: 's04', slug: 'fire-safety',    label: 'Fire Safety Code & NFPA Standards',                   content: s04 },
  { id: 's05', slug: 'ridem',          label: 'RIDEM Environmental Regulations',                      content: s05 },
  { id: 's06', slug: 'water-supply',   label: 'Water Supply, Fire Flow & Water Authority Research',  content: s06 },
  { id: 's07', slug: 'apra',           label: 'Access to Public Records Act (APRA) (§ 38-2)',        content: s07 },
  { id: 's08', slug: 'open-meetings',  label: 'Open Meetings Act (§ 42-46)',                         content: s08 },
  { id: 's09', slug: 'appeals',        label: 'Appeals & Judicial Review',                           content: s09 },
  { id: 's10', slug: 'workflow',       label: 'Research Workflow, Portals & Tools',                  content: s10 },
];

const mdLink = ({ children, ...props }) => (
  <a {...props} target="_blank" rel="noopener noreferrer">{children}</a>
);

export default function LegalGuidePage() {
  const tocRef = useRef(null);

  return (
    <div className="legal-guide-page">
      <div className="legal-guide-header">
        <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#93c5fd', marginBottom: '0.5rem' }}>
          Rhode Island · March 2026
        </div>
        <h1 style={{ fontSize: 'clamp(1.4rem, 4vw, 2rem)', fontWeight: 900, color: '#fff', margin: '0 0 0.5rem' }}>
          RI Legal Research Guide
        </h1>
        <p style={{ color: '#93c5fd', fontSize: '0.9rem', margin: 0, lineHeight: 1.6 }}>
          Public Records &amp; Land Use Law — A research guide for legal practitioners
        </p>
      </div>

      <nav className="legal-guide-toc" ref={tocRef} aria-label="Table of contents">
        <div className="legal-guide-toc-label">Contents</div>
        <ol className="legal-guide-toc-list">
          {SECTIONS.map((s, i) => (
            <li key={s.id}>
              <a href={`#${s.slug}`} className="legal-guide-toc-link">
                <span className="legal-guide-toc-num">{i + 1}</span>
                {s.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="legal-guide-body capabilities-doc-body">
        {SECTIONS.map((s) => (
          <section key={s.id} id={s.slug} className="legal-guide-section">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ a: mdLink }}>
              {s.content}
            </ReactMarkdown>
          </section>
        ))}
      </div>
    </div>
  );
}
