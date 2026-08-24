import { SYSTEM_INSTRUCTION } from "./knowledge.js";

const ALLOWED_ORIGINS = new Set([
  "https://dylntylr.com",
  "https://www.dylntylr.com",
  "https://dylantylr.github.io",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:4173",
]);

// Keeps a single abusive caller from burning the free Gemini quota.
const RATE_LIMIT = { windowSeconds: 3600, maxRequests: 40 };

const MAX_MESSAGE_CHARS = 600;
const MAX_HISTORY_TURNS = 12;

// How long we are willing to stall a request waiting out a per-minute 429.
const MAX_RETRY_WAIT_SECONDS = 12;

const json = (body, status, origin) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json",
      "access-control-allow-origin": origin,
      "cache-control": "no-store",
      vary: "Origin",
    },
  });

function corsFor(request) {
  const origin = request.headers.get("Origin") || "";
  return ALLOWED_ORIGINS.has(origin) ? origin : null;
}

// Optional. Only runs when a RATE_LIMIT KV namespace is bound to the worker.
async function overRateLimit(env, ip) {
  if (!env.RATE_LIMIT || !ip) return false;

  const key = `rl:${ip}:${Math.floor(Date.now() / 1000 / RATE_LIMIT.windowSeconds)}`;
  const used = Number((await env.RATE_LIMIT.get(key)) || 0);

  if (used >= RATE_LIMIT.maxRequests) return true;

  await env.RATE_LIMIT.put(key, String(used + 1), {
    expirationTtl: RATE_LIMIT.windowSeconds,
  });

  return false;
}

function sanitizeHistory(history) {
  if (!Array.isArray(history)) return [];

  return history
    .filter(
      (turn) =>
        turn &&
        (turn.role === "user" || turn.role === "model") &&
        typeof turn.text === "string" &&
        turn.text.trim()
    )
    .slice(-MAX_HISTORY_TURNS)
    .map((turn) => ({
      role: turn.role,
      parts: [{ text: turn.text.slice(0, MAX_MESSAGE_CHARS) }],
    }));
}

export default {
  async fetch(request, env) {
    const origin = corsFor(request);

    if (request.method === "OPTIONS") {
      if (!origin) return new Response(null, { status: 403 });

      return new Response(null, {
        status: 204,
        headers: {
          "access-control-allow-origin": origin,
          "access-control-allow-methods": "POST, OPTIONS",
          "access-control-allow-headers": "content-type",
          "access-control-max-age": "86400",
          vary: "Origin",
        },
      });
    }

    // The browser will not send a cross-origin POST without a matching CORS
    // response, so the allowlist is what keeps other sites off this worker.
    if (!origin) {
      return new Response("Forbidden", { status: 403 });
    }

    if (request.method !== "POST") {
      return json({ error: "Method not allowed" }, 405, origin);
    }

    if (!env.GEMINI_API_KEY) {
      return json({ error: "Assistant is not configured." }, 500, origin);
    }

    const ip = request.headers.get("CF-Connecting-IP");
    if (await overRateLimit(env, ip)) {
      return json(
        { error: "Too many questions for now. Please try again later." },
        429,
        origin
      );
    }

    let payload;
    try {
      payload = await request.json();
    } catch {
      return json({ error: "Invalid request body." }, 400, origin);
    }

    const message = typeof payload?.message === "string" ? payload.message.trim() : "";

    if (!message) {
      return json({ error: "Please include a question." }, 400, origin);
    }

    if (message.length > MAX_MESSAGE_CHARS) {
      return json(
        { error: `Please keep questions under ${MAX_MESSAGE_CHARS} characters.` },
        400,
        origin
      );
    }

    const model = env.GEMINI_MODEL || "gemini-3.5-flash-lite";
    const endpoint =
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

    const body = {
      systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
      contents: [
        ...sanitizeHistory(payload?.history),
        { role: "user", parts: [{ text: message }] },
      ],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 600,
        topP: 0.9,
      },
    };

    const call = () =>
      fetch(endpoint, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-goog-api-key": env.GEMINI_API_KEY,
        },
        body: JSON.stringify(body),
      });

    let upstream;
    let detail = "";

    try {
      upstream = await call();

      // A burst of quick questions can trip the per-minute limit. Google sends
      // a retryDelay for those, so absorb a short wait rather than erroring.
      // The daily cap comes back with no usable delay: retrying cannot help,
      // so fall straight through to the error.
      if (upstream.status === 429) {
        detail = await upstream.text().catch(() => "");
        const seconds = Number(
          /"retryDelay":\s*"(\d+(?:\.\d+)?)s"/.exec(detail)?.[1]
        );

        if (Number.isFinite(seconds) && seconds <= MAX_RETRY_WAIT_SECONDS) {
          await new Promise((resolve) => setTimeout(resolve, seconds * 1000 + 250));
          upstream = await call();
          detail = "";
        }
      }
    } catch {
      return json({ error: "Could not reach the assistant." }, 502, origin);
    }

    if (!upstream.ok) {
      if (!detail) detail = await upstream.text().catch(() => "");
      console.error("Gemini error", upstream.status, detail.slice(0, 500));

      const daily = /per day|PerDay|generate_content_free_tier_requests/.test(detail);

      const error =
        upstream.status !== 429
          ? "The assistant could not answer that. Please try again."
          : daily
          ? "The assistant has used up its free quota for today. Please use the Email or LinkedIn buttons above to reach Dylan directly."
          : "The assistant is answering a lot of questions right now. Please wait a moment and ask again.";

      return json({ error }, 502, origin);
    }

    const data = await upstream.json().catch(() => null);
    const reply = data?.candidates?.[0]?.content?.parts
      ?.map((part) => part?.text || "")
      .join("")
      .trim();

    if (!reply) {
      const blocked = data?.promptFeedback?.blockReason;

      return json(
        {
          error: blocked
            ? "I cannot answer that one. Try asking about Dylan's experience or skills."
            : "No answer came back. Please try rephrasing.",
        },
        502,
        origin
      );
    }

    return json({ reply }, 200, origin);
  },
};
