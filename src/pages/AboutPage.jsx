import React from 'react';

const NAVY   = '#0a1628';
const BLUE   = '#1a6cdc';
const BLUE_L = '#3b82f6';
const CYAN   = '#06b6d4';
const GREEN  = '#22c55e';
const AMBER  = '#f59e0b';
const SLATE  = '#334155';
const SLATE_L= '#64748b';
const SILVER = '#e2e8f0';
const WHITE  = '#ffffff';

function Section({ label, title, children }) {
  return (
    <section style={{ marginBottom: '3rem' }}>
      <div style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: BLUE_L, marginBottom: '0.4rem' }}>{label}</div>
      {title && <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: NAVY, marginBottom: '1.1rem', lineHeight: 1.25 }}>{title}</h2>}
      {children}
    </section>
  );
}

function CalloutBox({ children, color = BLUE_L }) {
  return (
    <blockquote style={{
      borderLeft: `4px solid ${color}`, background: `${color}11`,
      margin: '1.25rem 0', padding: '0.85rem 1.25rem',
      borderRadius: '0 8px 8px 0', fontStyle: 'italic',
      fontSize: '1rem', color: NAVY, lineHeight: 1.6,
    }}>
      {children}
    </blockquote>
  );
}

function StatRow({ stats }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${stats.length}, 1fr)`, gap: '1rem', margin: '1.5rem 0' }}>
      {stats.map(({ val, lbl, color }) => (
        <div key={lbl} style={{
          background: WHITE, border: `1px solid ${SILVER}`, borderTop: `3px solid ${color}`,
          borderRadius: 10, padding: '1rem', textAlign: 'center',
        }}>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color, lineHeight: 1 }}>{val}</div>
          <div style={{ fontSize: '0.72rem', color: SLATE_L, marginTop: 5 }}>{lbl}</div>
        </div>
      ))}
    </div>
  );
}

function PipelineStep({ label, sub, color, last }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
      <div style={{ background: color, borderRadius: 8, padding: '0.55rem 0.9rem', textAlign: 'center', minWidth: 80 }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: WHITE }}>{label}</div>
        <div style={{ fontSize: '0.6rem', color: `${WHITE}bb`, marginTop: 2 }}>{sub}</div>
      </div>
      {!last && <div style={{ color: SLATE_L, fontSize: '1.1rem', padding: '0 4px' }}>›</div>}
    </div>
  );
}

function SubsystemCard({ title, color, children }) {
  return (
    <div style={{ background: NAVY, borderRadius: 12, padding: '1.25rem 1.5rem', borderTop: `3px solid ${color}`, marginBottom: '0.75rem' }}>
      <div style={{ fontWeight: 700, fontSize: '1rem', color, marginBottom: '0.5rem' }}>{title}</div>
      <p style={{ fontSize: '0.875rem', color: '#93c5fd', lineHeight: 1.65, margin: 0 }}>{children}</p>
    </div>
  );
}

function MoatCard({ title, color, children }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: '1rem', padding: '1rem 0', borderTop: `1px solid ${SILVER}` }}>
      <div style={{ fontWeight: 700, fontSize: '0.9rem', color, paddingTop: 2 }}>{title}</div>
      <p style={{ fontSize: '0.875rem', color: SLATE, lineHeight: 1.65, margin: 0 }}>{children}</p>
    </div>
  );
}

function Table({ headers, rows }) {
  return (
    <div style={{ overflowX: 'auto', margin: '1rem 0' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
        <thead>
          <tr style={{ background: NAVY }}>
            {headers.map(h => <th key={h} style={{ padding: '0.6rem 0.9rem', color: WHITE, fontWeight: 600, textAlign: 'left' }}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? WHITE : '#f8fafc', borderBottom: `1px solid ${SILVER}` }}>
              {row.map((cell, j) => (
                <td key={j} style={{ padding: '0.55rem 0.9rem', color: j === 0 ? NAVY : SLATE, fontWeight: j === 0 ? 600 : 400 }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AboutPage() {
  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '2rem 1rem 4rem', fontFamily: 'system-ui, sans-serif', color: SLATE }}>

      {/* Cover */}
      <div style={{ background: NAVY, borderRadius: 16, padding: '3rem 2.5rem', marginBottom: '3rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.06, backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)', backgroundSize: '30px 30px' }} />
        <div style={{ position: 'relative' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.14em', color: '#93c5fd', marginBottom: '0.75rem', textTransform: 'uppercase' }}>CyberKnights · Executive Overview · v1.3 · March 2026</div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 900, color: WHITE, lineHeight: 1.15, marginBottom: '0.75rem' }}>
            Municipal Records<br />Intelligence Platform
          </h1>
          <p style={{ fontSize: '1rem', color: '#93c5fd', lineHeight: 1.6, marginBottom: '1.25rem', maxWidth: 540 }}>
            AI-powered civic data infrastructure for the legal, policy, and planning sectors
          </p>
          <p style={{ fontSize: '1rem', fontStyle: 'italic', color: AMBER, margin: 0 }}>
            "Public records, instantly searchable. Evidence-backed, immediately usable."
          </p>
        </div>
      </div>

      {/* Opportunity */}
      <Section label="The Opportunity" title="A $100B problem hiding in plain sight">
        <p style={{ lineHeight: 1.75, marginBottom: '1rem' }}>
          Municipal governments generate millions of documents annually — planning permits, zoning decisions, hearing transcripts, environmental reports, public comments — yet this data remains locked in fragmented portals, scanned PDFs, and disorganized SharePoint folders that are technically public but practically inaccessible.
        </p>
        <p style={{ lineHeight: 1.75, marginBottom: '1rem' }}>
          Legal professionals, residents, journalists, and policymakers who need this information face a wall of friction: failed search tools, login prompts on "public" files, hundreds of pages of unindexed documents, and no way to ask the archive a question.
        </p>
        <CalloutBox color={BLUE_L}>"Legal teams spend 40–60% of their time on information retrieval — not analysis."</CalloutBox>
        <Table
          headers={['Stakeholder', 'Current pain', 'What they need']}
          rows={[
            ['Attorneys & paralegals',  'Manual review across disconnected sources',         'Evidence-cited AI answers, fast cross-doc search'],
            ['Residents & advocates',   "Can't navigate complex planning portals",            'Plain-language Q&A over the public record'],
            ['Journalists',             'Days spent FOIA-ing and parsing PDFs manually',      'Instant full-text search + timeline reconstruction'],
            ['Municipal staff',         'No cross-meeting institutional memory',              'Semantic search over years of board minutes'],
            ['Planners & consultants',  'Inconsistent formats, missing metadata',             'Normalized, queryable archive with version history'],
          ]}
        />
      </Section>

      {/* Platform */}
      <Section label="The Platform" title="A continuous intelligence layer over civic data">
        <p style={{ lineHeight: 1.75, marginBottom: '1.25rem' }}>
          The Municipal Records Intelligence Platform is not a document viewer — it is a <strong>continuously updated, AI-enriched knowledge base</strong> that transforms raw government data into a structured, queryable intelligence environment. Once running, the system requires no manual uploads, no tagging, and no curation.
        </p>
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 600, color: SLATE_L, marginBottom: '0.75rem' }}>End-to-end automated pipeline</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px', alignItems: 'center' }}>
            {[
              { label: 'SYNC',       sub: 'SharePoint crawl',   color: BLUE    },
              { label: 'INGEST',     sub: 'PDF·DOCX·AV',        color: BLUE_L  },
              { label: 'TRANSCRIBE', sub: 'Whisper+OCR',         color: CYAN    },
              { label: 'INDEX',      sub: 'Full-text+vector',    color: GREEN   },
              { label: 'RAG',        sub: 'Evidence answers',    color: AMBER   },
              { label: 'SERVE',      sub: 'Web UI + API',        color: '#8b5cf6' },
            ].map((s, i, arr) => <PipelineStep key={s.label} {...s} last={i === arr.length - 1} />)}
          </div>
        </div>
        <SubsystemCard title="Vision-Guided Browser Agent" color={BLUE_L}>
          A GPU-backed autonomous agent (browser-use + Ollama moondream/llava) navigates SharePoint, Google Drive, OneDrive, and Dropbox portals. It performs BFS DOM traversal to enumerate all files and falls back to vision-guided navigation for login walls and dynamic menus — producing a complete JSON inventory of every document.
        </SubsystemCard>
        <SubsystemCard title="GPU-Accelerated Document Ingestion" color={CYAN}>
          A three-stage pipeline converts any format to clean, searchable Markdown. PyMuPDF4LLM handles digital PDFs at CPU speed. Marker (CUDA/PyTorch) processes scanned documents at ~25 pages/second on an H100. OpenAI Whisper large-v3 transcribes all audio and video — full meeting recordings become searchable text in minutes.
        </SubsystemCard>
        <SubsystemCard title="RAG-Powered Civic AI" color={GREEN}>
          User queries are matched against the full-text and vector search index, retrieving the most relevant document chunks. A Claude-powered assistant synthesizes answers with explicit citations — every claim links back to source documents. No hallucinated facts. No missing context.
        </SubsystemCard>
      </Section>

      {/* Traction */}
      <Section label="Traction" title="Live and running — real data, real results">
        <p style={{ lineHeight: 1.75, marginBottom: '1rem' }}>
          The platform is deployed and operational today against a real municipal planning archive — a New England town's Planning Board including a contested comprehensive permit application — as a proof of concept for the full model.
        </p>
        <StatRow stats={[
          { val: '502',   lbl: 'Documents inventoried',   color: BLUE_L  },
          { val: '9.5 GB',lbl: 'Source data ingested',    color: CYAN    },
          { val: '453',   lbl: 'MD files indexed',         color: GREEN   },
          { val: '2.18M', lbl: 'Words searchable',         color: AMBER   },
          { val: '8',     lbl: 'Meeting videos transcribed',color: '#8b5cf6'},
        ]} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem 1.5rem' }}>
          {[
            ['Full-text + semantic search',  'Across all ingested documents'],
            ['RAG chat agent',               'Natural language Q&A with citations'],
            ['Multi-format archive',          'PDF, DOCX, XLSX, audio, video'],
            ['Meeting transcript viewer',     '8 hearings — video link + written summary'],
            ['Automated build pipeline',      'Sync → ingest → index → deploy'],
            ['Public web interface',          'React 19 + Vite on Vercel, zero login'],
          ].map(([title, detail]) => (
            <div key={title} style={{ display: 'flex', gap: 8, padding: '0.4rem 0', borderBottom: `1px solid ${SILVER}` }}>
              <span style={{ color: BLUE, fontWeight: 700, flexShrink: 0 }}>✓</span>
              <div>
                <span style={{ fontWeight: 600, color: NAVY, fontSize: '0.875rem' }}>{title}</span>
                <span style={{ color: SLATE_L, fontSize: '0.8rem' }}> — {detail}</span>
              </div>
            </div>
          ))}
        </div>
        <CalloutBox color={CYAN}>"From a SharePoint folder nobody could search — to a queryable AI knowledge base in 72 hours."</CalloutBox>
      </Section>

      {/* Competitive */}
      <Section label="Competitive Position" title="Defensible moat across three dimensions">
        <MoatCard title="Data moat" color={BLUE_L}>
          Every ingested municipality becomes a proprietary, normalized dataset that competitors cannot replicate without running the same pipeline. As coverage expands, the archive compounds in value — cross-municipality search, precedent comparison, and trend analysis become possible only with scale.
        </MoatCard>
        <MoatCard title="Technical moat" color={CYAN}>
          The GPU-accelerated pipeline (Whisper + Marker on DGX) processes formats and volumes that cloud OCR APIs cannot handle cost-effectively. The vision-guided browser agent reaches files behind dynamic portals that no off-the-shelf crawler can access. These capabilities took months to build and tune.
        </MoatCard>
        <MoatCard title="Integration moat" color={GREEN}>
          The platform is designed to sit inside existing legal workflows — not replace them. An API layer exposes search, retrieval, and AI Q&A to any downstream tool: case management systems, eDiscovery platforms, document automation, or custom LLM agents. Switching cost increases with every integration.
        </MoatCard>
        <CalloutBox color={AMBER}>"We are not a search engine. We are a continuously maintained intelligence layer over the civic record."</CalloutBox>
      </Section>

      {/* Roadmap + Ask */}
      <Section label="Roadmap" title="From pilot to platform">
        <Table
          headers={['Phase', 'Timeline', 'Milestone']}
          rows={[
            ['Phase 1', 'Now',     'Single-municipality pilot live. Full pipeline operational. RAG chat, multi-format browsing, and meeting transcripts all running.'],
            ['Phase 2', 'Q3 2026', 'Expand to 10 municipalities across Rhode Island. Vector embeddings, cross-municipality comparison, REST API for firm integrations.'],
            ['Phase 3', '2027',    'Regional coverage across New England. Subscription tiers for law firms and journalists. White-label deployment for municipalities.'],
          ]}
        />
        <div style={{ marginTop: '2.5rem' }}>
          <div style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: BLUE_L, marginBottom: '0.75rem' }}>The Ask</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: NAVY, marginBottom: '1rem' }}>What we need to get to Phase 2</h2>
          <Table
            headers={['Use of funds', 'Amount', 'Outcome']}
            rows={[
              ['GPU compute (DGX / cloud GPU burst)', '$40K',  '10-municipality ingestion sprint'],
              ['Engineering (pipeline + API layer)',   '$80K',  'Vector search, cross-muni queries, REST API'],
              ['Data licensing & legal review',        '$15K',  'Confirm public-record rights at scale'],
              ['Go-to-market (legal firm pilots)',     '$25K',  '3 paying law firm design partners'],
              ['Total seed ask',                       '$160K', 'Phase 2 live, revenue pipeline open'],
            ]}
          />
        </div>
        <CalloutBox color={GREEN}>"The data is public. The infrastructure is built. The market is real. We are ready to scale."</CalloutBox>
      </Section>

      <div style={{ textAlign: 'center', color: SLATE_L, fontSize: '0.8rem', paddingTop: '1rem', borderTop: `1px solid ${SILVER}` }}>
        CyberKnights · Confidential · March 2026
      </div>
    </div>
  );
}
