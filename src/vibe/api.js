const RM = "https://rickandmortyapi.com/api";

// The ones people actually want to pick, shown before any searching.
export const FEATURED_IDS = [
  1, 2, 3, 4, 5, 118, 47, 141, 265, 244, 242, 38,
];

const shape = (c) => ({
  id: c.id,
  name: c.name,
  image: c.image,
  species: c.species,
  status: c.status,
  gender: c.gender,
  type: c.type,
  origin: c.origin?.name,
  location: c.location?.name,
  episodes: c.episode?.length ?? 0,
});

async function getJSON(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(String(response.status));
  return response.json();
}

export async function loadFeatured() {
  const data = await getJSON(`${RM}/character/${FEATURED_IDS.join(",")}`);
  return (Array.isArray(data) ? data : [data]).map(shape);
}

export async function searchCharacters(term) {
  if (!term.trim()) return loadFeatured();

  try {
    const data = await getJSON(
      `${RM}/character/?name=${encodeURIComponent(term.trim())}`
    );
    return data.results.slice(0, 24).map(shape);
  } catch {
    // The API answers 404 for "no matches" rather than an empty list.
    return [];
  }
}

