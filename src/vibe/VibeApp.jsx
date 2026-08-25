import React, { useEffect, useRef, useState } from "react";

import { ASSISTANT_URL } from "../constants/recruiter";
import { findTrack, loadFeatured, searchCharacters } from "./api";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary";

const BackIcon = () => (
  <svg
    aria-hidden='true'
    viewBox='0 0 20 20'
    className='h-4 w-4'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <path d='M12.5 15 8 10l4.5-5' />
  </svg>
);

const statusDot = {
  Alive: "bg-[#3ddc84]",
  Dead: "bg-[#ff6b6b]",
  unknown: "bg-secondary",
};

const CharacterButton = ({ character, onPick }) => (
  <button
    type='button'
    onClick={() => onPick(character)}
    className={`group flex flex-col overflow-hidden rounded-xl border border-line bg-tertiary text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-[#97ce4c] hover:shadow-[0_0_20px_-4px_rgba(151,206,76,0.45)] touch-manipulation ${focusRing}`}
  >
    <span className='relative block overflow-hidden'>
      <img
        src={character.image}
        alt=''
        aria-hidden='true'
        width={300}
        height={300}
        loading='lazy'
        decoding='async'
        className='aspect-square w-full object-cover grayscale-[35%] transition-[filter,transform] duration-300 group-hover:scale-105 group-hover:grayscale-0'
      />
      {/* Green wash that clears on hover, so the grid reads as one piece and
          the hovered card pops out of it. */}
      <span
        aria-hidden='true'
        className='pointer-events-none absolute inset-0 bg-[#97ce4c]/10 opacity-100 transition-opacity duration-300 group-hover:opacity-0'
      />
    </span>
    <span className='flex items-center gap-2 px-3 py-2.5'>
      <span
        aria-hidden='true'
        className={`h-1.5 w-1.5 shrink-0 rounded-full ${
          statusDot[character.status] || "bg-secondary"
        }`}
      />
      <span className='truncate text-[14px] font-medium text-white'>
        {character.name}
      </span>
    </span>
  </button>
);

const VibeApp = () => {
  const [characters, setCharacters] = useState([]);
  const [term, setTerm] = useState("");
  const [picked, setPicked] = useState(null);
  const [vibe, setVibe] = useState(null);
  const [track, setTrack] = useState(null);
  const [phase, setPhase] = useState("browsing"); // browsing | thinking | done | error
  const [error, setError] = useState("");

  const resultRef = useRef(null);

  useEffect(() => {
    loadFeatured().then(setCharacters).catch(() => setCharacters([]));
  }, []);

  useEffect(() => {
    const id = setTimeout(() => {
      searchCharacters(term).then(setCharacters).catch(() => setCharacters([]));
    }, 250);

    return () => clearTimeout(id);
  }, [term]);

  const pick = async (character) => {
    setPicked(character);
    setVibe(null);
    setTrack(null);
    setError("");
    setPhase("thinking");
    resultRef.current?.scrollIntoView({ block: "start" });

    try {
      const response = await fetch(`${ASSISTANT_URL}/vibe`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          id: character.id,
          name: character.name,
          species: character.species,
          status: character.status,
          gender: character.gender,
          origin: character.origin,
          location: character.location,
          episodes: character.episodes,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.song) {
        setError(data?.error || "The jukebox is jammed. Try another character.");
        setPhase("error");
        return;
      }

      setVibe(data);
      setPhase("done");

      // The track lookup is separate so a miss still leaves the pick readable.
      findTrack(data.song, data.artist).then(setTrack).catch(() => {});
    } catch {
      setError("Could not reach the jukebox. Try again in a moment.");
      setPhase("error");
    }
  };

  return (
    <div className='relative z-0 min-h-screen bg-primary'>
      <a
        href='#picker'
        className='sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:font-bold focus:text-primary'
      >
        Skip to the characters
      </a>

      <div className='mx-auto w-full max-w-3xl px-6 py-10 sm:py-16'>
        <a
          href='/'
          className={`inline-flex items-center gap-2 rounded-sm text-[15px] font-medium text-secondary hover:text-white ${focusRing}`}
        >
          <BackIcon />
          Back to portfolio
        </a>

        <main>
          <header className='mt-8'>
            <p className='font-mono text-[12px] uppercase tracking-[0.18em] text-accent'>
              Interdimensional radio
            </p>
            <h1 className='mt-3 text-[30px] font-semibold leading-tight tracking-tight text-white sm:text-[34px]'>
              What would they listen to?
            </h1>
            <p className='mt-3 max-w-xl text-[16px] leading-relaxed text-secondary text-pretty'>
              Pick a Rick and Morty character and find out what is on their
              playlist, with a thirty second preview.
            </p>
          </header>

          <section ref={resultRef} aria-live='polite' className='scroll-mt-6'>
            {picked ? (
              <div className='mt-8 rounded-xl border border-line bg-tertiary p-5 sm:p-6'>
                <div className='flex flex-wrap items-start gap-6'>
                  {/* Character sits inside a spinning portal rather than a
                      plain thumbnail. Decorative, so it is hidden from AT. */}
                  <div
                    aria-hidden='true'
                    className='relative h-32 w-32 shrink-0 sm:h-36 sm:w-36'
                  >
                    <div className='portal-glow absolute -inset-2 rounded-full opacity-80' />
                    <img
                      src={picked.image}
                      alt=''
                      width={144}
                      height={144}
                      className='portal-rim relative h-full w-full rounded-full object-cover'
                    />
                  </div>

                  <div className='min-w-0 flex-1'>
                    <h2 className='text-[22px] font-semibold text-white'>
                      {picked.name}
                    </h2>
                    <p className='mt-1 font-mono text-[12px] text-secondary'>
                      {[picked.species, picked.status, picked.origin]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>

                    {phase === "thinking" ? (
                      <p className='mt-4 font-mono text-[13px] text-secondary'>
                        Consulting the jukebox…
                      </p>
                    ) : null}

                    {phase === "error" ? (
                      <p className='mt-4 text-[15px] text-[#ffc9c9]'>{error}</p>
                    ) : null}

                    {vibe ? (
                      <>
                        <p className='mt-4 inline-block rounded-md border border-line px-3 py-1 font-mono text-[12px] text-accent'>
                          {vibe.genre}
                        </p>

                        <ul className='mt-4 flex flex-col gap-2 list-none'>
                          {vibe.observations.map((line) => (
                            <li
                              key={line}
                              className='relative pl-5 text-[15px] leading-relaxed text-white-100 text-pretty'
                            >
                              <span
                                aria-hidden='true'
                                className='absolute left-0 top-[9px] h-[5px] w-[5px] rounded-full bg-accent'
                              />
                              {line}
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : null}
                  </div>
                </div>

                {vibe ? (
                  <div className='mt-6 border-t border-line pt-5'>
                    <div className='flex flex-wrap items-center gap-4'>
                      {track?.artwork ? (
                        <img
                          src={track.artwork}
                          alt=''
                          aria-hidden='true'
                          width={72}
                          height={72}
                          className='h-18 w-18 rounded-md object-cover'
                        />
                      ) : null}

                      <div className='min-w-0 flex-1'>
                        <p className='text-[17px] font-semibold text-white'>
                          {track?.title || vibe.song}
                        </p>
                        <p className='text-[14px] text-secondary'>
                          {track?.artist || vibe.artist}
                        </p>
                      </div>
                    </div>

                    <p className='mt-4 text-[15px] leading-relaxed text-secondary text-pretty'>
                      {vibe.reason}
                    </p>

                    {track?.preview ? (
                      <audio
                        controls
                        src={track.preview}
                        className='mt-4 h-10 w-full'
                        aria-label={`Preview of ${track.title} by ${track.artist}`}
                      />
                    ) : (
                      <p className='mt-4 font-mono text-[12px] text-secondary'>
                        No preview found for that one. Search it up yourself.
                      </p>
                    )}
                  </div>
                ) : null}
              </div>
            ) : null}
          </section>

          <section id='picker' className='mt-10'>
            <label htmlFor='search' className='sr-only'>
              Search characters
            </label>
            <input
              id='search'
              value={term}
              onChange={(event) => setTerm(event.target.value)}
              placeholder='Search all 826 characters…'
              autoComplete='off'
              className={`w-full rounded-lg border-none bg-black-100 px-4 py-3 text-[15px] text-white placeholder:text-secondary ${focusRing}`}
            />

            {characters.length ? (
              <ul className='mt-5 grid grid-cols-2 gap-3 list-none sm:grid-cols-4'>
                {characters.map((character) => (
                  <li key={character.id}>
                    <CharacterButton character={character} onPick={pick} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className='mt-5 font-mono text-[13px] text-secondary'>
                Nobody by that name in this dimension.
              </p>
            )}
          </section>

          <p className='mt-10 text-[13px] leading-relaxed text-secondary'>
            Character data from{" "}
            <a
              href='https://rickandmortyapi.com'
              target='_blank'
              rel='noopener noreferrer'
              className={`text-white-100 underline underline-offset-4 hover:text-accent ${focusRing}`}
            >
              the Rick and Morty API
            </a>
            , previews from iTunes. Picks are generated and meant as a joke, not
            a statement about the show. Rick and Morty belongs to Adult Swim.
          </p>
        </main>
      </div>
    </div>
  );
};

export default VibeApp;
