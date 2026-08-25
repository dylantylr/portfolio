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

const VIBE_INSTRUCTION = `
You pick music for characters from Rick and Morty. You are given a character's
canonical details from the show's API. Reply with a genre, a real existing song
that suits them, and three short observations.

Rules:
- The song must be a real, released track. Give the exact title and the primary
  artist so it can be looked up. Prefer well known tracks that a search will find.
- Ground the observations in the details provided and in widely known show canon.
  Keep them playful rather than stated as trivia. Never invent episode numbers,
  quotes or plot points.
- Each observation is one sentence, under 20 words.
- "reason" is one sentence on why the song fits.
- Be funny and a little mean where the character deserves it. Never crude.
`.trim();

const VIBE_SCHEMA = {
  type: "object",
  properties: {
    genre: { type: "string" },
    song: { type: "string" },
    artist: { type: "string" },
    reason: { type: "string" },
    observations: { type: "array", items: { type: "string" } },
  },
  required: ["genre", "song", "artist", "reason", "observations"],
};

// Deezer rather than iTunes. Apple rate limits its search endpoint per caller
// IP, and both Cloudflare's shared egress addresses and carrier NAT sit
// permanently over that limit, which is why a track would resolve on a home
// desktop and come back empty from a phone or from here. Deezer has no CORS
// header so a browser cannot call it, but a worker is not subject to CORS, and
// the preview mp3 plays in an <audio> element without one.
async function findTrack(song, artist) {
  const attempts = [`${song} ${artist}`, song];

  for (const term of attempts) {
    try {
      const response = await fetch(
        "https://api.deezer.com/search?limit=1&q=" + encodeURIComponent(term)
      );
      if (!response.ok) continue;

      const track = (await response.json())?.data?.[0];
      if (!track?.preview) continue;

      return {
        title: track.title_short || track.title,
        artist: track.artist?.name || artist,
        artwork: track.album?.cover_big || track.album?.cover_medium || null,
        preview: track.preview,
        link: track.link || null,
      };
    } catch {
      // try the next phrasing
    }
  }

  return null;
}

async function handleVibe(payload, env, origin) {
  const id = Number(payload?.id);
  const name = typeof payload?.name === "string" ? payload.name.slice(0, 80) : "";

  if (!Number.isInteger(id) || id < 1 || !name) {
    return json({ error: "Pick a character first." }, 400, origin);
  }

  // A character's vibe never changes, so one Gemini call per character ever.
  const cacheKey = `vibe:v2:${id}`;
  if (env.RATE_LIMIT) {
    const cached = await env.RATE_LIMIT.get(cacheKey);

    if (cached) {
      const hit = JSON.parse(cached);

      // Entries written before the track moved server-side have no track on
      // them. Fill it in without spending another model call.
      if (!hit.track) {
        hit.track = await findTrack(hit.song, hit.artist);
        await env.RATE_LIMIT.put(cacheKey, JSON.stringify(hit));
      }

      return json({ ...hit, cached: true }, 200, origin);
    }
  }

  const facts = [
    `Name: ${name}`,
    payload?.species && `Species: ${String(payload.species).slice(0, 40)}`,
    payload?.status && `Status: ${String(payload.status).slice(0, 20)}`,
    payload?.gender && `Gender: ${String(payload.gender).slice(0, 20)}`,
    payload?.origin && `Origin: ${String(payload.origin).slice(0, 60)}`,
    payload?.location && `Last known location: ${String(payload.location).slice(0, 60)}`,
    payload?.episodes && `Appears in ${Number(payload.episodes)} episodes`,
  ]
    .filter(Boolean)
    .join("\n");

  const model = env.GEMINI_MODEL || "gemini-3.5-flash-lite";
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-goog-api-key": env.GEMINI_API_KEY,
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: VIBE_INSTRUCTION }] },
        contents: [{ role: "user", parts: [{ text: facts }] }],
        generationConfig: {
          temperature: 0.9,
          maxOutputTokens: 500,
          responseMimeType: "application/json",
          responseSchema: VIBE_SCHEMA,
        },
      }),
    }
  ).catch(() => null);

  if (!response?.ok) {
    const detail = response ? await response.text().catch(() => "") : "";
    console.error("Vibe error", response?.status, detail.slice(0, 300));

    return json(
      {
        error:
          response?.status === 429
            ? "The jukebox is out of free plays for today. Try again tomorrow."
            : "Could not pick a track for that one. Try another character.",
      },
      502,
      origin
    );
  }

  const data = await response.json().catch(() => null);
  const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  let vibe;
  try {
    vibe = JSON.parse(raw);
  } catch {
    return json({ error: "Got a garbled answer. Try again." }, 502, origin);
  }

  vibe.observations = (vibe.observations || []).slice(0, 3);
  vibe.track = await findTrack(vibe.song, vibe.artist);

  if (env.RATE_LIMIT) {
    await env.RATE_LIMIT.put(cacheKey, JSON.stringify(vibe));
  }

  return json({ ...vibe, cached: false }, 200, origin);
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

    if (new URL(request.url).pathname === "/vibe") {
      return handleVibe(payload, env, origin);
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
