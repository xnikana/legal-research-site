import React, { useEffect, useRef, useState } from 'react';

/* ── snapshot data ─────────────────────────────────────────────────────────── */
const SNAPSHOT_DATE = 'March 2026';

// Excluded from index: .json .srt .vtt .tsv .txt .msg .url (metadata / subtitle artifacts)
const fileTypes = [
  { ext: 'pdf',  count: 566, total: 2905955908, avg: 5134197,   color: '#3b82f6' },
  { ext: 'wav',  count: 5,   total: 5225733396, avg: 1045146679, color: '#818cf8' },
  { ext: 'mov',  count: 6,   total: 1195897281, avg: 199316213, color: '#fb923c' },
  { ext: 'jpeg', count: 357, total: 44430362,   avg: 124454,    color: '#fbbf24' },
  { ext: 'docx', count: 32,  total: 27635364,   avg: 863605,    color: '#8b5cf6' },
  { ext: 'm4a',  count: 1,   total: 96278352,   avg: 96278352,  color: '#06b6d4' },
  { ext: 'mp4',  count: 3,   total: 16817053,   avg: 5605684,   color: '#f43f5e' },
  { ext: 'jpg',  count: 3,   total: 8666967,    avg: 2888989,   color: '#eab308' },
  { ext: 'xlsx', count: 7,   total: 270677,     avg: 38668,     color: '#22c55e' },
  { ext: 'doc',  count: 2,   total: 141824,     avg: 70912,     color: '#a78bfa' },
];

const TOTAL_BYTES = fileTypes.reduce((s, r) => s + r.total, 0);
const TOTAL_FILES = fileTypes.reduce((s, r) => s + r.count, 0);

const yearData = [
  { year: '2023', hasMd: 125, noMd: 7  },
  { year: '2024', hasMd: 63,  noMd: 8  },
  { year: '2025', hasMd: 180, noMd: 18 },
  { year: '2026', hasMd: 85,  noMd: 16 },
];

const mdCoverage = [
  { ext: 'pdf',  hasMd: 444, noMd: 0,  color: '#3b82f6' },
  { ext: 'docx', hasMd: 32,  noMd: 0,  color: '#8b5cf6' },
  { ext: 'wav',  hasMd: 5,   noMd: 0,  color: '#818cf8' },
  { ext: 'mov',  hasMd: 6,   noMd: 3,  color: '#fb923c' },
  { ext: 'mp4',  hasMd: 3,   noMd: 0,  color: '#f43f5e' },
  { ext: 'm4a',  hasMd: 1,   noMd: 0,  color: '#06b6d4' },
  { ext: 'xlsx', hasMd: 1,   noMd: 6,  color: '#22c55e' },
  { ext: 'doc',  hasMd: 1,   noMd: 1,  color: '#a78bfa' },
];

const wordDist = [
  { label: '< 100',      count: 51,  color: '#475569' },
  { label: '100–499',    count: 114, color: '#64748b' },
  { label: '500–1,999',  count: 120, color: '#3b82f6' },
  { label: '2k–9,999',   count: 123, color: '#06b6d4' },
  { label: '10k–49k',    count: 36,  color: '#22c55e' },
  { label: '50k+',       count: 9,   color: '#f59e0b' },
];

const topStats = [
  { val: 989,      display: '989',    lbl: 'Content files',      suffix: '',    color: '#3b82f6' },
  { val: 9.52,     display: '9.5',    lbl: 'GB source data',     suffix: ' GB', color: '#06b6d4' },
  { val: 502,      display: '502',    lbl: 'Inventoried docs',   suffix: '',    color: '#8b5cf6' },
  { val: 453,      display: '453',    lbl: 'MD conversions',     suffix: '',    color: '#22c55e' },
  { val: 2180000,  display: '2.18M',  lbl: 'Searchable words',   suffix: '',    color: '#f59e0b' },
  { val: 90,       display: '90%',    lbl: 'Ingestion coverage', suffix: '%',   color: '#f43f5e' },
];

/* ── helpers ────────────────────────────────────────────────────────────────── */
function fmt(bytes) {
  if (bytes >= 1e9) return (bytes / 1e9).toFixed(2) + ' GB';
  if (bytes >= 1e6) return (bytes / 1e6).toFixed(1) + ' MB';
  if (bytes >= 1e3) return (bytes / 1e3).toFixed(1) + ' KB';
  return bytes + ' B';
}

/* ── animated counter hook ──────────────────────────────────────────────────── */
function useCountUp(target, duration = 1200, format) {
  const [value, setValue] = useState(0);
  const raf = useRef(null);
  useEffect(() => {
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(ease * target));
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);
  return format ? format(value) : value;
}

/* ── animated bar ───────────────────────────────────────────────────────────── */
function AnimBar({ pct, color, height = 8, delay = 0 }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), delay + 100);
    return () => clearTimeout(t);
  }, [pct, delay]);
  return (
    <div style={{ background: '#0f172a', borderRadius: 99, height, overflow: 'hidden' }}>
      <div style={{
        width: `${Math.max(width, 0)}%`, background: color, height: '100%', borderRadius: 99,
        transition: 'width 0.8s cubic-bezier(0.16,1,0.3,1)',
      }} />
    </div>
  );
}

/* ── donut ring ─────────────────────────────────────────────────────────────── */
function DonutRing({ pct, color, size = 80, stroke = 10 }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const [dash, setDash] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setDash(circ * pct / 100), 200);
    return () => clearTimeout(t);
  }, [pct, circ]);
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1e293b" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ}`}
        style={{ transition: 'stroke-dasharray 1s cubic-bezier(0.16,1,0.3,1)' }}
        strokeLinecap="round" />
    </svg>
  );
}

/* ── sub-components ─────────────────────────────────────────────────────────── */
function Card({ children, style }) {
  return (
    <div style={{
      background: 'var(--card-bg, #1e293b)', border: '1px solid #1e293b',
      borderRadius: 16, padding: '1.5rem', ...style,
    }}>
      {children}
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{
      fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.12em',
      textTransform: 'uppercase', color: '#475569', marginBottom: '1.1rem',
    }}>
      {children}
    </div>
  );
}

function StatCard({ stat, index }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), index * 80);
    return () => clearTimeout(t);
  }, [index]);

  return (
    <div style={{
      background: 'var(--card-bg, #1e293b)',
      border: `1px solid ${stat.color}33`,
      borderTop: `3px solid ${stat.color}`,
      borderRadius: 14, padding: '1.25rem 1.5rem',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(12px)',
      transition: 'opacity 0.4s ease, transform 0.4s ease',
    }}>
      <div style={{ fontSize: '2rem', fontWeight: 800, color: stat.color, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
        {stat.display}
      </div>
      <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 6 }}>{stat.lbl}</div>
    </div>
  );
}

/* ── page ───────────────────────────────────────────────────────────────────── */
export default function ArchiveStatsPage() {
  const maxTotal = Math.max(...fileTypes.map(r => r.total));
  const maxCount = Math.max(...fileTypes.map(r => r.count));
  const maxWordDist = Math.max(...wordDist.map(r => r.count));
  const maxYear = Math.max(...yearData.map(r => r.hasMd + r.noMd));

  const totalMd = mdCoverage.reduce((s, r) => s + r.hasMd, 0);
  const totalDocs = mdCoverage.reduce((s, r) => s + r.hasMd + r.noMd, 0);
  const overallPct = Math.round(totalMd / totalDocs * 100);

  return (
    <div style={{ maxWidth: 980, margin: '0 auto', padding: '1.5rem 0 3rem' }}>

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
          Archive Stats
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
          Dataset snapshot — {SNAPSHOT_DATE} &nbsp;·&nbsp;
          <code style={{ fontSize: '0.8rem', background: '#0f172a', padding: '1px 6px', borderRadius: 4 }}>Planner-Sharepoint</code>
          &nbsp;+&nbsp;
          <code style={{ fontSize: '0.8rem', background: '#0f172a', padding: '1px 6px', borderRadius: 4 }}>sharepoint_inventory_md_union</code>
        </p>
      </div>

      {/* Top stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {topStats.map((s, i) => <StatCard key={s.lbl} stat={s} index={i} />)}
      </div>

      {/* Row 1: size bars + coverage overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>

        {/* Size by file type */}
        <Card>
          <SectionLabel>Storage by file type</SectionLabel>
          {fileTypes.sort((a,b) => b.total - a.total).map((r, i) => (
            <div key={r.ext} style={{ marginBottom: '0.65rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, background: r.color + '22', color: r.color, padding: '1px 7px', borderRadius: 99 }}>.{r.ext}</span>
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{fmt(r.total)}</span>
                  <span style={{ fontSize: '0.7rem', color: '#334155', minWidth: 36, textAlign: 'right' }}>{(r.total / TOTAL_BYTES * 100).toFixed(1)}%</span>
                </div>
              </div>
              <AnimBar pct={r.total / maxTotal * 100} color={r.color} delay={i * 60} />
            </div>
          ))}
        </Card>

        {/* MD coverage overview with donut */}
        <Card>
          <SectionLabel>Ingestion coverage</SectionLabel>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <DonutRing pct={overallPct} color="#22c55e" size={88} stroke={10} />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#22c55e', lineHeight: 1 }}>{overallPct}%</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{totalMd} of {totalDocs} docs</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: 3 }}>have Markdown text conversions</div>
              <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
                <span style={{ fontSize: '0.72rem', color: '#22c55e' }}>● Indexed</span>
                <span style={{ fontSize: '0.72rem', color: '#f87171' }}>● Pending</span>
              </div>
            </div>
          </div>
          {mdCoverage.map((r, i) => {
            const total = r.hasMd + r.noMd;
            const pct = Math.round(r.hasMd / total * 100);
            return (
              <div key={r.ext} style={{ marginBottom: '0.6rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, background: r.color + '22', color: r.color, padding: '1px 7px', borderRadius: 99 }}>.{r.ext}</span>
                  <span style={{ fontSize: '0.75rem', color: pct === 100 ? '#22c55e' : 'var(--text-secondary)' }}>
                    {pct === 100 ? '✓ ' : ''}{r.hasMd}/{total}
                  </span>
                </div>
                <div style={{ background: '#0f172a', borderRadius: 99, height: 6, overflow: 'hidden', display: 'flex' }}>
                  <div style={{ width: `${r.hasMd / total * 100}%`, background: pct === 100 ? '#22c55e' : r.color, height: '100%', borderRadius: 99, transition: 'width 0.8s cubic-bezier(0.16,1,0.3,1)' }} />
                  <div style={{ width: `${r.noMd / total * 100}%`, background: '#f87171', height: '100%', opacity: 0.5 }} />
                </div>
              </div>
            );
          })}
        </Card>

        {/* File count by type */}
        <Card>
          <SectionLabel>File count by type — {TOTAL_FILES.toLocaleString()} total</SectionLabel>
          {fileTypes.sort((a,b) => b.count - a.count).map((r, i) => (
            <div key={r.ext} style={{ marginBottom: '0.65rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: '0.68rem', fontWeight: 700, background: r.color + '22', color: r.color, padding: '1px 7px', borderRadius: 99 }}>.{r.ext}</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{r.count.toLocaleString()}</span>
              </div>
              <AnimBar pct={r.count / maxCount * 100} color={r.color} delay={i * 60} />
            </div>
          ))}
        </Card>

        {/* MD word count distribution */}
        <Card>
          <SectionLabel>Word count distribution — 453 files · 2.18M words</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {wordDist.map((r, i) => (
              <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', minWidth: 70, textAlign: 'right' }}>{r.label}</span>
                <div style={{ flex: 1, background: '#0f172a', borderRadius: 99, height: 20, overflow: 'hidden', position: 'relative' }}>
                  <div style={{
                    width: `${r.count / maxWordDist * 100}%`, height: '100%',
                    background: `linear-gradient(90deg, ${r.color}99, ${r.color})`,
                    borderRadius: 99, transition: 'width 0.8s cubic-bezier(0.16,1,0.3,1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 8,
                  }}>
                    {r.count / maxWordDist > 0.25 && (
                      <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#fff' }}>{r.count}</span>
                    )}
                  </div>
                  {r.count / maxWordDist <= 0.25 && (
                    <span style={{ position: 'absolute', left: `${r.count / maxWordDist * 100 + 2}%`, top: '50%', transform: 'translateY(-50%)', fontSize: '0.68rem', color: '#64748b' }}>{r.count}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Coverage by year */}
        <Card>
          <SectionLabel>Documents by year</SectionLabel>
          {yearData.map((r, i) => {
            const total = r.hasMd + r.noMd;
            const pct = Math.round(r.hasMd / total * 100);
            return (
              <div key={r.year} style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>{r.year}</span>
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{total} docs &nbsp;·&nbsp; <span style={{ color: '#22c55e' }}>{pct}% indexed</span></span>
                </div>
                <div style={{ background: '#0f172a', borderRadius: 99, height: 12, overflow: 'hidden', display: 'flex', gap: 1 }}>
                  <div style={{ width: `${r.hasMd / maxYear * 100}%`, background: '#22c55e', height: '100%', borderRadius: '99px 0 0 99px', transition: 'width 0.8s cubic-bezier(0.16,1,0.3,1)' }} />
                  <div style={{ width: `${r.noMd / maxYear * 100}%`, background: '#f87171', height: '100%', opacity: 0.6, borderRadius: '0 99px 99px 0', transition: 'width 0.8s cubic-bezier(0.16,1,0.3,1)' }} />
                </div>
              </div>
            );
          })}
          <div style={{ display: 'flex', gap: '1.25rem', marginTop: '0.5rem' }}>
            <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 3, background: '#22c55e' }} /> Indexed
            </span>
            <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 3, background: '#f87171', opacity: 0.7 }} /> Pending ingestion
            </span>
          </div>
        </Card>

        {/* Audio/video */}
        <Card>
          <SectionLabel>Audio &amp; video — fully transcribed</SectionLabel>
          <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '1.1rem', lineHeight: 1.6 }}>
            All audio and video files in the inventory have full Markdown transcriptions, making spoken content fully searchable.
          </p>
          {[
            { ext: 'wav', count: 5, size: '5.2 GB', note: 'Full Whisper transcription',  color: '#818cf8' },
            { ext: 'mov', count: 6, size: '1.2 GB', note: 'Meeting summary',              color: '#fb923c' },
            { ext: 'mp4', count: 3, size: '16 MB',  note: 'Meeting summary',              color: '#f43f5e' },
            { ext: 'm4a', count: 1, size: '92 MB',  note: 'Full Whisper transcription',   color: '#06b6d4' },
          ].map(r => (
            <div key={r.ext} style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '0.65rem 0', borderBottom: '1px solid #0f172a' }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: r.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.68rem', fontWeight: 800, color: r.color, flexShrink: 0 }}>
                .{r.ext}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.84rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                  {r.count} file{r.count > 1 ? 's' : ''} &nbsp;·&nbsp; {r.size}
                </div>
                <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: 2 }}>{r.note}</div>
              </div>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#22c55e', background: '#22c55e11', padding: '3px 8px', borderRadius: 99 }}>✓ indexed</span>
            </div>
          ))}
        </Card>

      </div>

      {/* Detailed table */}
      <Card style={{ overflowX: 'auto' }}>
        <SectionLabel>Full file type breakdown</SectionLabel>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
          <thead>
            <tr>
              {['Type', 'Files', 'Total size', 'Avg size', 'Share'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '0.5rem 0.75rem', color: '#475569', fontWeight: 600, borderBottom: '1px solid #1e293b' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {fileTypes.sort((a,b) => b.total - a.total).map((r, i) => {
              const pct = (r.total / TOTAL_BYTES * 100).toFixed(1);
              return (
                <tr key={r.ext} style={{ borderBottom: '1px solid #0f172a' }}>
                  <td style={{ padding: '0.5rem 0.75rem' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, background: r.color + '22', color: r.color, padding: '2px 8px', borderRadius: 99 }}>.{r.ext}</span>
                  </td>
                  <td style={{ padding: '0.5rem 0.75rem', color: 'var(--text-secondary)' }}>{r.count.toLocaleString()}</td>
                  <td style={{ padding: '0.5rem 0.75rem', color: 'var(--text-secondary)' }}>{fmt(r.total)}</td>
                  <td style={{ padding: '0.5rem 0.75rem', color: 'var(--text-secondary)' }}>{fmt(r.avg)}</td>
                  <td style={{ padding: '0.5rem 0.75rem', minWidth: 130 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ flex: 1, background: '#0f172a', borderRadius: 99, height: 6, overflow: 'hidden' }}>
                        <div style={{ width: `${r.total / maxTotal * 100}%`, background: r.color, height: '100%', borderRadius: 99 }} />
                      </div>
                      <span style={{ color: '#475569', minWidth: 36 }}>{pct}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

    </div>
  );
}
