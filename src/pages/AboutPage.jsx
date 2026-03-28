import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import capabilitiesMd from '../../CAPABILITIES.md?raw';

export default function AboutPage() {
  return (
    <article className="capabilities-doc">
      <div className="capabilities-doc-body">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{capabilitiesMd}</ReactMarkdown>
      </div>
    </article>
  );
}
