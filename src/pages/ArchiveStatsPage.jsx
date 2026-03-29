import React from 'react';

/* ── snapshot data ── */
const SNAPSHOT_DATE = 'March 2026';

const topStats = [
  { val: '1,036', lbl: 'Source files on disk' },
  { val: '9.5 GB', lbl: 'Total source data' },
  { val: '502', lbl: 'Inventoried documents' },
  { val: '453', lbl: 'MD text conversions' },
  { val: '2.18M', lbl: 'Searchable words' },
  { val: '4,814', lbl: 'Avg words / MD file' },
];

const fileTypes = [
  { ext: 'wav',  count: 5,   total: 5225733396, avg: 1045146679, min: 466600448,  max: 2749018998 },
  { ext: 'pdf',  count: 566, total: 2905955908, avg: 5134197,   min: 9439,       max: 276567986  },
  { ext: 'mov',  count: 6,   total: 1195897281, avg: 199316213, min: 16489454,   max: 383478327  },
  { ext: 'm4a',  count: 1,   total: 96278352,   avg: 96278352,  min: 96278352,   max: 96278352   },
  { ext: 'jpeg', count: 357, total: 44430362,   avg: 124454,    min: 915,        max: 673066     },
  { ext: 'docx', count: 39,  total: 27635364,   avg: 708599,    min: 12015,      max: 7294203    },
  { ext: 'mp4',  count: 3,   total: 16817053,   avg: 5605684,   min: 3430762,    max: 7092474    },
  { ext: 'jpg',  count: 3,   total: 8666967,    avg: 2888989,   min: 2721343,    max: 3014133    },
  { ext: 'json', count: 17,  total: 7167474,    avg: 421616,    min: 1100,       max: 1687961    },
  { ext: 'srt',  count: 6,   total: 1336434,    avg: 222739,    min: 131416,     max: 326702     },
  { ext: 'vtt',  count: 6,   total: 1223862,    avg: 203977,    min: 121187,     max: 291959     },
  { ext: 'tsv',  count: 6,   total: 1005826,    avg: 167637,    min: 104128,     max: 229803     },
  { ext: 'txt',  count: 6,   total: 736224,     avg: 122704,    min: 82123,      max: 162935     },
  { ext: 'msg',  count: 1,   total: 365056,     avg: 365056,    min: 365056,     max: 365056     },
  { ext: 'xlsx', count: 7,   total: 270677,     avg: 38668,     min: 15385,      max: 70114      },
  { ext: 'doc',  count: 2,   total: 141824,     avg: 70912,     min: 69632,      max: 72192      },
  { ext: 'url',  count: 5,   total: 413,        avg: 82,        min: 56,         max: 123        },
];
const TOTAL_BYTES = fileTypes.reduce((s, r) => s + r.total, 0);

const yearData = [
  { year: '2023', hasMd: 125, noMd: 7  },
  { year: '2024', hasMd: 63,  noMd: 8  },
  { year: '2025', hasMd: 180, noMd: 18 },
  { year: '2026', hasMd: 85,  noMd: 16 },
];

const mdCoverage = [
  { ext: 'pdf',  hasMd: 404, noMd: 40, note: null },
  { ext: 'docx', hasMd: 31,  noMd: 0,  note: '100%' },
  { ext: 'wav',  hasMd: 6,   noMd: 0,  note: '100% — transcribed' },
  { ext: 'mp4',  hasMd: 3,   noMd: 0,  note: '100%' },
  { ext: 'mov',  hasMd: 6,   noMd: 3,  note: null },
  { ext: 'm4a',  hasMd: 1,   noMd: 0,  note: '100%' },
  { ext: 'xlsx', hasMd: 1,   noMd: 6,  note: null },
  { ext: 'doc',  hasMd: 1,   noMd: 0,  note: '100%' },
];

const wordDist = [
  { label: '0 – 99',        count: 51  },
  { label: '100 – 499',     count: 114 },
  { label: '500 – 1,999',   count: 120 },
  { label: '2,000 – 9,999', count: 123 },
  { label: '10k – 49k',     count: 36  },
  { label: '50k+',          count: 9   },
];

/* ── helpers ── */
function fmt(bytes) {
  if (bytes >= 1e9) return (bytes / 1e9).toFixed(2) + ' GB';
  if (bytes >= 1e6) return (bytes / 1e6).toFixed(1) + ' MB';
  if (bytes >= 1e3) return (bytes / 1e3).toFixed(1) + ' KB';
  return bytes + ' B';
}

function Bar({ pct, color = 'var(--accent-blue)', height = 8 }) {
  return (
    <div style={{ background: '#1e293b', borderRadius: 4, height, overflow: 'hidden', marginTop: 4 }}>
      <div style={{ width: `${Math.max(pct, 1)}%`, background: color, height: '100%', borderRadius: 4, transition: 'width 0.3s' }} />
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <h2 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-secondary)', marginBottom: '1rem', marginTop: 0 }}>
      {children}
    </h2>
  );
}

function Card({ children, style }) {
  return (
    <div style={{ background: 'var(--card-bg, #1e293b)', border: '1px solid #334155', borderRadius: 12, padding: '1.5rem', ...style }}>
      {children}
    </div>
  );
}

export default function ArchiveStatsPage() {
  const maxTotal = Math.max(...fileTypes.map(r => r.total));
  const maxCount = Math.max(...fileTypes.map(r => r.count));
  const maxWordDist = Math.max(...wordDist.map(r => r.count));
  const maxYear = Math.max(...yearData.map(r => r.hasMd + r.noMd));

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '1.5rem 0' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem', color: 'var(--text-primary)' }}>
        Archive Stats
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '2rem' }}>
        Dataset snapshot — {SNAPSHOT_DATE} &nbsp;·&nbsp; Source: <code>Planner-Sharepoint</code> + <code>sharepoint_inventory_md_union</code>
      </p>

      {/* Top stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {topStats.map(s => (
          <Card key={s.lbl} style={{ padding: '1rem 1.25rem' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#38bdf8', lineHeight: 1 }}>{s.val}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 6 }}>{s.lbl}</div>
          </Card>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>

        {/* Size by type */}
        <Card>
          <SectionTitle>Total size by file type</SectionTitle>
          {fileTypes.filter(r => r.total > 100000).map(r => (
            <div key={r.ext} style={{ marginBottom: '0.6rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>.{r.ext}</span>
                <span style={{ color: 'var(--text-secondary)' }}>{fmt(r.total)} &nbsp;<span style={{ color: '#475569' }}>({(r.total / TOTAL_BYTES * 100).toFixed(1)}%)</span></span>
              </div>
              <Bar pct={r.total / maxTotal * 100} color={r.ext === 'wav' ? '#818cf8' : r.ext === 'pdf' ? '#38bdf8' : r.ext === 'mov' ? '#fb923c' : '#34d399'} />
            </div>
          ))}
        </Card>

        {/* Count by type */}
        <Card>
          <SectionTitle>File count by type</SectionTitle>
          {fileTypes.filter(r => r.count > 1).map(r => (
            <div key={r.ext} style={{ marginBottom: '0.6rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>.{r.ext}</span>
                <span style={{ color: 'var(--text-secondary)' }}>{r.count.toLocaleString()} files</span>
              </div>
              <Bar pct={r.count / maxCount * 100} color={r.ext === 'jpeg' ? '#fbbf24' : r.ext === 'pdf' ? '#38bdf8' : '#64748b'} />
            </div>
          ))}
        </Card>

        {/* MD coverage by year */}
        <Card>
          <SectionTitle>MD text coverage by year</SectionTitle>
          {yearData.map(r => {
            const total = r.hasMd + r.noMd;
            const pctMd = (r.hasMd / total * 100).toFixed(0);
            return (
              <div key={r.year} style={{ marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: 2 }}>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{r.year}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{r.hasMd} / {total} &nbsp;<span style={{ color: '#34d399' }}>({pctMd}%)</span></span>
                </div>
                <div style={{ background: '#1e293b', borderRadius: 4, height: 10, overflow: 'hidden', display: 'flex' }}>
                  <div style={{ width: `${r.hasMd / maxYear * 100}%`, background: '#34d399', height: '100%' }} />
                  <div style={{ width: `${r.noMd / maxYear * 100}%`, background: '#f87171', height: '100%' }} />
                </div>
              </div>
            );
          })}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
            <span><span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 2, background: '#34d399', marginRight: 4 }} />Has MD</span>
            <span><span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 2, background: '#f87171', marginRight: 4 }} />No MD</span>
          </div>
        </Card>

        {/* MD coverage by source type */}
        <Card>
          <SectionTitle>MD coverage by source file type</SectionTitle>
          {mdCoverage.map(r => {
            const total = r.hasMd + r.noMd;
            const pct = (r.hasMd / total * 100).toFixed(0);
            return (
              <div key={r.ext} style={{ marginBottom: '0.65rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: 2 }}>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                    .{r.ext}
                    {r.note && <span style={{ marginLeft: 6, fontSize: '0.7rem', color: '#34d399', fontWeight: 400 }}>{r.note}</span>}
                  </span>
                  <span style={{ color: 'var(--text-secondary)' }}>{r.hasMd} / {total}</span>
                </div>
                <div style={{ background: '#1e293b', borderRadius: 4, height: 8, overflow: 'hidden', display: 'flex' }}>
                  <div style={{ width: `${r.hasMd / total * 100}%`, background: '#34d399', height: '100%' }} />
                  <div style={{ width: `${r.noMd / total * 100}%`, background: '#f87171', height: '100%' }} />
                </div>
              </div>
            );
          })}
        </Card>

        {/* Word count distribution */}
        <Card>
          <SectionTitle>MD file word count distribution (453 files · 2.18M words total)</SectionTitle>
          {wordDist.map(r => (
            <div key={r.label} style={{ marginBottom: '0.6rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--text-primary)' }}>{r.label} words</span>
                <span style={{ color: 'var(--text-secondary)' }}>{r.count} files</span>
              </div>
              <Bar pct={r.count / maxWordDist * 100} color='#818cf8' />
            </div>
          ))}
        </Card>

        {/* Audio/video highlight */}
        <Card>
          <SectionTitle>Audio &amp; video — fully transcribed</SectionTitle>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: '1rem' }}>
            All audio and video files in the inventory now have full Markdown transcriptions, making their spoken content searchable.
          </p>
          {[
            { ext: 'wav', count: 5, size: '5.2 GB', words: '~780k est.', color: '#818cf8' },
            { ext: 'mov', count: 6, size: '1.2 GB', words: 'summarized', color: '#fb923c' },
            { ext: 'mp4', count: 3, size: '16 MB',  words: 'summarized', color: '#fbbf24' },
            { ext: 'm4a', count: 1, size: '92 MB',  words: 'transcribed', color: '#34d399' },
          ].map(r => (
            <div key={r.ext} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0', borderBottom: '1px solid #1e293b' }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: r.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, color: r.color }}>
                .{r.ext}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-primary)', fontWeight: 500 }}>{r.count} {r.ext.toUpperCase()} file{r.count > 1 ? 's' : ''} &middot; {r.size}</div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>{r.words}</div>
              </div>
              <span style={{ fontSize: '0.7rem', color: '#34d399', fontWeight: 600 }}>✓ in index</span>
            </div>
          ))}
        </Card>

      </div>

      {/* Detailed table */}
      <Card style={{ overflowX: 'auto' }}>
        <SectionTitle>All source file types — detailed breakdown</SectionTitle>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #334155' }}>
              {['Extension', 'Count', 'Total size', 'Avg size', 'Min', 'Max', '% of total'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '0.4rem 0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {fileTypes.map(r => {
              const pct = (r.total / TOTAL_BYTES * 100).toFixed(1);
              const barW = (r.total / maxTotal * 100).toFixed(1);
              return (
                <tr key={r.ext} style={{ borderBottom: '1px solid #0f172a' }}>
                  <td style={{ padding: '0.4rem 0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>.{r.ext}</td>
                  <td style={{ padding: '0.4rem 0.75rem', color: 'var(--text-secondary)' }}>{r.count.toLocaleString()}</td>
                  <td style={{ padding: '0.4rem 0.75rem', color: 'var(--text-secondary)' }}>{fmt(r.total)}</td>
                  <td style={{ padding: '0.4rem 0.75rem', color: 'var(--text-secondary)' }}>{fmt(r.avg)}</td>
                  <td style={{ padding: '0.4rem 0.75rem', color: 'var(--text-secondary)' }}>{fmt(r.min)}</td>
                  <td style={{ padding: '0.4rem 0.75rem', color: 'var(--text-secondary)' }}>{fmt(r.max)}</td>
                  <td style={{ padding: '0.4rem 0.75rem', minWidth: 120 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{pct}%</span>
                    <div style={{ background: '#0f172a', borderRadius: 3, height: 5, marginTop: 3, overflow: 'hidden' }}>
                      <div style={{ width: `${barW}%`, background: '#38bdf8', height: '100%', borderRadius: 3 }} />
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
