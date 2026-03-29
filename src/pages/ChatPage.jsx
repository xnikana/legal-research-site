import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot } from 'lucide-react';
import { searchArchive } from '../utils/searchArchive';
import { mdSearchTextByPath } from '../data/mdSearchTextByPath';

const API_URL = (import.meta.env.VITE_CHAT_API_URL || 'http://localhost:3000') + '/api/chat';

const SYSTEM_PROMPT =
  'You are a helpful assistant for the Town of Barrington public records archive. ' +
  'Help users understand planning documents, permit applications, and municipal records ' +
  'related to the Belton Court permit application process. ' +
  'When relevant archive documents are provided, use them to answer questions accurately and cite the document title.';

const MAX_CONTEXT_CHARS = 6000;

function buildContext(query) {
  // Search for each meaningful keyword separately, deduplicate results
  const keywords = [...new Set(
    query.toLowerCase().split(/\s+/).filter(w => w.length >= 4)
  )];
  if (!keywords.length) return null;

  const seen = new Set();
  const results = [];
  for (const kw of keywords) {
    const { results: hits } = searchArchive(kw, 4);
    for (const hit of hits) {
      if (!seen.has(hit.doc.id)) {
        seen.add(hit.doc.id);
        results.push(hit);
      }
    }
    if (results.length >= 4) break;
  }

  if (!results.length) return null;
  const parts = [];
  let total = 0;
  for (const { doc, categoryTitle } of results) {
    const text = doc.mdPath ? mdSearchTextByPath[doc.mdPath] : null;
    if (!text) continue;
    const excerpt = text.slice(0, MAX_CONTEXT_CHARS - total);
    parts.push(`### ${doc.title} (${categoryTitle})\n${excerpt}`);
    total += excerpt.length;
    if (total >= MAX_CONTEXT_CHARS) break;
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
