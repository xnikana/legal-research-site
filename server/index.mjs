// Chat API server
import express from 'express';
import cors from 'cors';
import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function anthropicKey() {
  const v = process.env.ANTHROPIC_API_KEY;
  return typeof v === 'string' ? v.trim() : '';
}

// Merge server/.env from this file's directory (not cwd).
dotenv.config({ path: join(__dirname, '.env'), override: false });

const KEY_AT_BOOT = anthropicKey();

const PORT = Number(process.env.PORT) || 3000;

function parseAllowedOrigins() {
  const raw = process.env.ALLOWED_ORIGINS?.trim();
  if (!raw) {
    return ['http://localhost:5173', 'http://127.0.0.1:5173'];
  }
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '512kb' }));

app.use(
  cors({
    origin: parseAllowedOrigins(),
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
  }),
);

app.get('/health', (_req, res) => {
  const has = Boolean(anthropicKey());
  const payload = { ok: true, hasAnthropicKey: has, bootHasKey: Boolean(KEY_AT_BOOT) };
  if (process.env.RAILWAY_PROJECT_ID !== undefined) {
    payload.railway = true;
  }
  res.json(payload);
});

const ALLOWED_ROLES = new Set(['user', 'assistant']);

function normalizeMessages(body) {
  const raw = body?.messages;
  if (!Array.isArray(raw) || raw.length === 0) {
    return { error: 'Request body must include a non-empty "messages" array.' };
  }
  if (raw.length > 40) {
    return { error: 'Too many messages (max 40).' };
  }
  const messages = [];
  let systemPrompt = null;
  for (const m of raw) {
    if (!m || typeof m !== 'object') {
      return { error: 'Each message must be an object with "role" and "content".' };
    }
    const role = typeof m.role === 'string' ? m.role.trim() : '';
    const content = typeof m.content === 'string' ? m.content.trim() : '';
    if (role === 'system') {
      systemPrompt = content;
      continue;
    }
    if (!ALLOWED_ROLES.has(role)) {
      return { error: `Invalid role "${m.role}". Use system, user, or assistant.` };
    }
    if (!content) {
      return { error: 'Each message must have non-empty "content".' };
    }
    if (content.length > 32000) {
      return { error: 'Message content too long.' };
    }
    messages.push({ role, content });
  }
  return { messages, systemPrompt };
}

app.post('/api/chat', async (req, res) => {
  const parsed = normalizeMessages(req.body);
  if (parsed.error) {
    res.status(400).json({ error: parsed.error });
    return;
  }

  const key = anthropicKey();
  if (!key) {
    res.json({
      mock: true,
      reply:
        'Chat API is running, but ANTHROPIC_API_KEY is not set. Add it in Railway Variables (or server/.env locally), then redeploy or restart.',
    });
    return;
  }

  try {
    const client = new Anthropic({ apiKey: key });
    const context = typeof req.body?.context === 'string' ? req.body.context.slice(0, 20000) : null;
    console.log('[api/chat] context length:', context ? context.length : 0);
    console.log('[api/chat] systemPrompt length:', parsed.systemPrompt ? parsed.systemPrompt.length : 0);
    const systemParts = [];
    if (parsed.systemPrompt) systemParts.push(parsed.systemPrompt);
    if (context) systemParts.push(`Relevant archive documents:\n\n${context}`);
    console.log('[api/chat] final system length:', systemParts.join('\n\n').length);
    const response = await client.messages.create({
      model: process.env.ANTHROPIC_CHAT_MODEL || 'claude-haiku-4-5-20251001',
      max_tokens: Number(process.env.ANTHROPIC_MAX_TOKENS) || 1024,
      ...(systemParts.length ? { system: systemParts.join('\n\n') } : {}),
      messages: parsed.messages,
    });
    const text = response.content[0]?.text ?? '';
    res.json({ reply: text, mock: false });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Anthropic request failed';
    console.error('[api/chat]', message);
    res.status(502).json({ error: message });
  }
});

app.listen(PORT, () => {
  console.log(`Chat API listening on port ${PORT}`);
  console.log(`Anthropic: ${Boolean(anthropicKey()) ? 'configured' : 'not set (mock replies)'}`);
});
