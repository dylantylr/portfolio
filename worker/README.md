# Recruiter assistant worker

A thin Cloudflare Worker that sits between the portfolio and the Gemini API.

The site is static, so a Gemini key placed in the frontend would be readable by
anyone who opens DevTools. This worker keeps the key server-side. The browser
talks to the worker; only the worker talks to Google.

## What it does

- Accepts `POST` with `{ message, history }` from an allowlisted origin.
- Prepends a system instruction containing Dylan's professional briefing.
- Calls `gemini-2.5-flash` and returns `{ reply }`.
- Rejects requests from any origin not in `ALLOWED_ORIGINS` (`src/index.js`).
- Caps message length (600 chars) and history (12 turns).
- Optionally rate limits per IP when a KV namespace is bound.

## One-time setup

Get a free API key from https://aistudio.google.com/apikey

```bash
cd worker
npm install
npx wrangler login
npx wrangler secret put GEMINI_API_KEY   # paste the key when prompted
npx wrangler deploy
```

`deploy` prints the worker URL, e.g.
`https://dylan-recruiter-assistant.<subdomain>.workers.dev`

If that does not match the default in `src/constants/recruiter.js`, set it in a
`.env` file at the repo root and rebuild:

```
VITE_ASSISTANT_URL=https://dylan-recruiter-assistant.<subdomain>.workers.dev
```

## Optional: per-IP rate limiting

Without this the worker still refuses other origins, but a determined caller
could script requests. To cap them at 40/hour per IP:

```bash
npx wrangler kv namespace create RATE_LIMIT
```

Uncomment the `[[kv_namespaces]]` block in `wrangler.toml`, paste in the printed
id, and redeploy.

## Editing what the assistant knows

`src/knowledge.js` holds the briefing and the system instruction. It is the only
thing the model is told to treat as fact. After editing:

```bash
npx wrangler deploy
```

Changes take effect immediately; no site rebuild needed.

## Local development

```bash
npx wrangler dev            # serves on http://localhost:8787
```

Put the key in `worker/.dev.vars` (gitignored) for local runs:

```
GEMINI_API_KEY=your-key-here
```

Then point the site at it with `VITE_ASSISTANT_URL=http://localhost:8787`.

## Logs

```bash
npx wrangler tail
```
