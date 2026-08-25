const RM = "https://rickandmortyapi.com/api";
const ITUNES = "https://itunes.apple.com/search";

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

// iTunes gives a 30 second preview with no key and permissive CORS, which is
// the only free option that will actually play in the browser.
export async function findTrack(song, artist) {
  const attempts = [`${song} ${artist}`, song];

  for (const term of attempts) {
    try {
      const data = await getJSON(
        `${ITUNES}?limit=1&media=music&entity=song&term=${encodeURIComponent(term)}`
      );
      const track = data.results?.[0];

      if (track?.previewUrl) {
        return {
          title: track.trackName,
          artist: track.artistName,
          album: track.collectionName,
          genre: track.primaryGenreName,
          artwork: track.artworkUrl100?.replace("100x100", "300x300"),
          preview: track.previewUrl,
          link: track.trackViewUrl,
        };
      }
    } catch {
      // fall through to the next attempt
    }
  }

  return null;
}
