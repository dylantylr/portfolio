const API = "https://pokeapi.co/api/v2";

// Gen 1 through 9. Species beyond this range exist but are regional forms
// with sparse flavour text.
export const MAX_SPECIES = 1025;

const titleCase = (slug) =>
  slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

// Flavour text is stored with hard line breaks and form feeds from the
// original cartridges.
const clean = (text) => text.replace(/[\n\f\r­]+/g, " ").replace(/\s+/g, " ").trim();

// "mr-mime" has to match "MR. MIME", "Mr.Mime" and "Mr Mime" in the entries.
function nameMatcher(slug) {
  const parts = slug.split("-").map((p) => p.replace(/[^a-z0-9]/gi, ""));
  return new RegExp(parts.join("[\\s.\\-']*"), "gi");
}

export function redact(text, slug) {
  let out = text.replace(nameMatcher(slug), "?????");

  // Species with a form suffix ("nidoran-f") appear in the entries under the
  // stem alone, which the joined matcher above will not catch.
  for (const part of slug.split("-")) {
    const stem = part.replace(/[^a-z0-9]/gi, "");
    // Bounded, so "mime" does not also gut "pantomime".
    if (stem.length >= 4) {
      out = out.replace(new RegExp(`\\b${stem}\\b`, "gi"), "?????");
    }
  }

  return out;
}

export const normalise = (value) =>
  value.toLowerCase().replace(/[^a-z0-9]/g, "");

async function getJSON(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${response.status} for ${url}`);
  return response.json();
}

let namesCache = null;

// One request, reused for the whole session, for the guess suggestions.
export async function loadNames() {
  if (namesCache) return namesCache;

  const data = await getJSON(`${API}/pokemon-species?limit=${MAX_SPECIES}`);
  namesCache = data.results.map((r) => ({
    slug: r.name,
    label: titleCase(r.name),
  }));

  return namesCache;
}

export async function fetchRound({ attempt = 0 } = {}) {
  const id = 1 + Math.floor(Math.random() * MAX_SPECIES);

  const species = await getJSON(`${API}/pokemon-species/${id}`);

  const entries = species.flavor_text_entries.filter(
    (entry) => entry.language.name === "en"
  );

  // A handful of species carry no English entry. Try again rather than
  // showing an empty card.
  if (!entries.length) {
    if (attempt >= 4) throw new Error("No flavour text available");
    return fetchRound({ attempt: attempt + 1 });
  }

  const chosen = entries[Math.floor(Math.random() * entries.length)];

  // The display name ("Mr. Mime") can differ from the slug, so strip it too.
  const localNames = species.names
    .filter((n) => n.language.name === "en")
    .map((n) => n.name)
    .filter(Boolean);

  const pokemon = await getJSON(`${API}/pokemon/${species.id}`);

  const artwork =
    pokemon.sprites?.other?.["official-artwork"]?.front_default ||
    pokemon.sprites?.front_default;

  return {
    id: species.id,
    slug: species.name,
    label: titleCase(species.name),
    entry: localNames.reduce(
      (text, name) => text.split(name).join("?????"),
      redact(clean(chosen.flavor_text), species.name)
    ),
    version: titleCase(chosen.version.name),
    generation: titleCase(species.generation.name.replace("generation-", "Gen ")),
    types: pokemon.types.map((t) => titleCase(t.type.name)),
    artwork,
  };
}
