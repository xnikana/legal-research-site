import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot } from 'lucide-react';
import { searchArchive } from '../utils/searchArchive';
import { mdSearchTextByPath } from '../data/mdSearchTextByPath';

const API_URL = (import.meta.env.VITE_CHAT_API_URL || 'http://localhost:3000') + '/api/chat';

const SYSTEM_PROMPT =
  'You are a research assistant for a municipal planning records archive. ' +
  'You have access to two types of source material that will be provided in context: ' +
  '(1) archive documents — planning board packets, permit application materials, meeting summaries, and related municipal records; ' +
  '(2) a Rhode Island legal research guide covering the Comprehensive Permit Act (§ 45-53), Zoning Enabling Act (§ 45-24), ' +
  'NFPA fire safety code, RIDEM environmental regulations, water supply and fire flow analysis, ' +
  'APRA public records law (§ 38-2), Open Meetings Act (§ 42-46), and Superior Court Land Use Calendar appeals procedure. ' +
  'Always base your answers on the provided documents. ' +
  'If the documents contain the answer, state it clearly and cite which document or guide section it came from. ' +
  'If the documents do not contain enough information, say so specifically — do not claim you lack access to documents.';

const MAX_CONTEXT_CHARS = 8000;
const LEGAL_GUIDE_BUDGET = 4000;
const EXCERPT_WINDOW = 1500;
const LEGAL_GUIDE_PREFIX = 'documentation/ri-legal-guide/';

function extractExcerpt(text, keywords) {
  // Find the earliest keyword hit and return a window around it
  let bestIdx = -1;
  for (const kw of keywords) {
    const idx = text.indexOf(kw);
    if (idx !== -1 && (bestIdx === -1 || idx < bestIdx)) bestIdx = idx;
  }
  if (bestIdx === -1) return text.slice(0, EXCERPT_WINDOW);
  const start = Math.max(0, bestIdx - 200);
  return text.slice(start, start + EXCERPT_WINDOW);
}

function buildContext(query) {
  const keywords = [...new Set(
    query.toLowerCase().split(/\s+/).filter(w => w.length >= 4)
  )];
  if (!keywords.length) return null;

  const parts = [];
  let total = 0;

  // 1. Search RI legal guide sections first
  for (const [key, text] of Object.entries(mdSearchTextByPath)) {
    if (!key.startsWith(LEGAL_GUIDE_PREFIX) || !text) continue;
    if (!keywords.some(kw => text.includes(kw))) continue;
    const section = key.replace(LEGAL_GUIDE_PREFIX, '').replace('.md', '');
    const excerpt = extractExcerpt(text, keywords).slice(0, LEGAL_GUIDE_BUDGET - total);
    parts.push(`### RI Legal Guide — ${section}\n${excerpt}`);
    total += excerpt.length;
    if (total >= LEGAL_GUIDE_BUDGET) break;
  }

  // 2. Fill remaining budget with archive docs
  const archiveBudget = MAX_CONTEXT_CHARS - total;
  if (archiveBudget > 500) {
    const seen = new Set();
    const results = [];
    for (const kw of keywords) {
      const { results: hits } = searchArchive(kw, 5);
      for (const hit of hits) {
        if (!seen.has(hit.doc.id)) {
          seen.add(hit.doc.id);
          results.push(hit);
        }
      }
      if (results.length >= 5) break;
    }
    let archiveTotal = 0;
    for (const { doc, categoryTitle } of results) {
      const text = doc.mdPath ? mdSearchTextByPath[doc.mdPath] : null;
      if (!text) continue;
      const excerpt = extractExcerpt(text.toLowerCase(), keywords).slice(0, archiveBudget - archiveTotal);
      parts.push(`### ${doc.title} (${categoryTitle})\n${excerpt}`);
      archiveTotal += excerpt.length;
      if (archiveTotal >= archiveBudget) break;
    }
  }

  return parts.length ? parts.join('\n\n') : null;
}

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { role: 'user', content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput('');
    setError(null);
    setLoading(true);

    try {
      const context = buildContext(text);
      console.log('[chat] context length:', context ? context.length : 0);
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...next],
          context,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Request failed');
      } else {
        setMessages([...next, { role: 'assistant', content: data.reply }]);
      }
    } catch (e) {
      setError('Could not reach the chat server. Is it running?');
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  function onKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <div className="chat-page">
      <div className="hero-section" style={{ paddingBottom: '1rem' }}>
        <Bot size={40} color="var(--accent-blue)" style={{ marginBottom: '0.75rem' }} />
        <h1 className="hero-title">Ask the Archive</h1>
        <p className="hero-subtitle">
          Ask questions about the Belton Court permit process and Barrington planning records.
        </p>
      </div>

      <div className="chat-thread">
        {messages.length === 0 && !loading && (
          <p className="chat-empty">Send a message to get started.</p>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`chat-bubble chat-bubble--${m.role}`}>
            <span className="chat-bubble-label">{m.role === 'user' ? 'You' : 'Assistant'}</span>
            <p className="chat-bubble-text">{m.content}</p>
          </div>
        ))}
        {loading && (
          <div className="chat-bubble chat-bubble--assistant">
            <span className="chat-bubble-label">Assistant</span>
            <p className="chat-bubble-text chat-typing">Thinking…</p>
          </div>
        )}
        {error && <p className="chat-error">{error}</p>}
        <div ref={bottomRef} />
      </div>

      <div className="chat-input-row">
        <textarea
          ref={inputRef}
          className="chat-input"
          rows={1}
          placeholder="Ask a question…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={loading}
        />
        <button
          type="button"
          className="chat-send-btn"
          onClick={send}
          disabled={loading || !input.trim()}
          aria-label="Send message"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
