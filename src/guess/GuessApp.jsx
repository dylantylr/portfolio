import React, { useCallback, useEffect, useRef, useState } from "react";

import { fetchRound, loadNames, normalise } from "./pokeapi";

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

const Silhouette = ({ round, revealed }) => (
  <div className='relative flex h-56 w-full items-center justify-center rounded-xl border border-line bg-black-100 sm:h-72'>
    {round?.artwork ? (
      <img
        src={round.artwork}
        alt={revealed ? round.label : ""}
        width={240}
        height={240}
        className={`h-full w-auto max-w-full object-contain p-4 transition-[filter,opacity] duration-500 ${
          revealed ? "" : "brightness-0 invert"
        }`}
      />
    ) : (
      <span className='font-mono text-[12px] text-secondary'>loading…</span>
    )}
  </div>
);

const GuessApp = () => {
  const [round, setRound] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | playing | won | revealed
  const [guess, setGuess] = useState("");
  const [wrong, setWrong] = useState([]);
  const [names, setNames] = useState([]);
  const [score, setScore] = useState({ correct: 0, played: 0 });
  const [error, setError] = useState("");

  const inputRef = useRef(null);

  useEffect(() => {
    loadNames().then(setNames).catch(() => {});
  }, []);

  const nextRound = useCallback(
    async () => {
      setStatus("loading");
      setGuess("");
      setWrong([]);
      setError("");

      try {
        const next = await fetchRound();
        setRound(next);
        setStatus("playing");
        inputRef.current?.focus();
      } catch {
        setError("Could not reach the Pokédex. Try again in a moment.");
        setStatus("error");
      }
    },
    []
  );

  useEffect(() => {
    nextRound();
  }, [nextRound]);

  const submit = (event) => {
    event.preventDefault();
    if (status !== "playing" || !guess.trim()) return;

    if (normalise(guess) === normalise(round.slug)) {
      setStatus("won");
      setScore((s) => ({ correct: s.correct + 1, played: s.played + 1 }));
    } else {
      setWrong((w) => [...w, guess.trim()]);
      setGuess("");
    }
  };

  const giveUp = () => {
    if (status !== "playing") return;
    setStatus("revealed");
    setScore((s) => ({ ...s, played: s.played + 1 }));
  };

  const revealed = status === "won" || status === "revealed";

  // Hints arrive one wrong guess at a time so the entry stays the main event.
  const hints = [
    wrong.length >= 1 && round && { label: "Generation", value: round.generation },
    wrong.length >= 2 && round && { label: "Type", value: round.types.join(" / ") },
    wrong.length >= 3 && round && {
      label: "Starts with",
      value: round.label[0].toUpperCase(),
    },
  ].filter(Boolean);

  return (
    <div className='relative z-0 min-h-screen bg-primary'>
      <a
        href='#game'
        className='sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:font-bold focus:text-primary'
      >
        Skip to the game
      </a>

      <div className='mx-auto w-full max-w-2xl px-6 py-10 sm:py-16'>
        <a
          href='/'
          className={`inline-flex items-center gap-2 rounded-sm text-[15px] font-medium text-secondary hover:text-white ${focusRing}`}
        >
          <BackIcon />
          Back to portfolio
        </a>

        <main id='game'>
          <header className='mt-8 flex flex-wrap items-end justify-between gap-4'>
            <div>
              <p className='font-mono text-[12px] uppercase tracking-[0.18em] text-accent'>
                Pokédex
              </p>
              <h1 className='mt-3 text-[30px] font-semibold leading-tight tracking-tight text-white sm:text-[34px]'>
                Guess from the entry
              </h1>
            </div>

            <p
              className='font-mono text-[13px] text-secondary'
              aria-live='polite'
            >
              {score.correct} / {score.played}
            </p>
          </header>


          <section className='mt-6' aria-live='polite'>
            <Silhouette round={round} revealed={revealed} />

            <blockquote className='mt-6 border-l-2 border-accent pl-4 text-[17px] leading-relaxed text-white-100 text-pretty'>
              {status === "loading"
                ? "Pulling an entry…"
                : error || round?.entry}
            </blockquote>

            {round && status !== "loading" ? (
              <p className='mt-3 font-mono text-[12px] text-secondary'>
                Pokémon {round.version}
              </p>
            ) : null}
          </section>

          {hints.length > 0 && !revealed ? (
            <ul className='mt-5 flex flex-wrap gap-2 list-none'>
              {hints.map((hint) => (
                <li
                  key={hint.label}
                  className='rounded-md border border-line px-3 py-1.5 font-mono text-[12px] text-white-100'
                >
                  <span className='text-secondary'>{hint.label}:</span>{" "}
                  {hint.value}
                </li>
              ))}
            </ul>
          ) : null}

          {revealed ? (
            <div className='mt-6 rounded-xl border border-line bg-tertiary p-5'>
              <p className='font-mono text-[12px] uppercase tracking-[0.18em] text-accent'>
                {status === "won" ? "Correct" : "The answer was"}
              </p>
              <p className='mt-2 text-[24px] font-semibold text-white'>
                {round.label}
              </p>
              <p className='mt-1 font-mono text-[13px] text-secondary'>
                #{String(round.id).padStart(4, "0")} · {round.generation} ·{" "}
                {round.types.join(" / ")}
              </p>


              <button
                type='button'
                onClick={() => nextRound()}
                className={`mt-5 inline-flex items-center justify-center rounded-lg bg-accent px-5 py-2.5 text-[15px] font-semibold text-primary transition-colors duration-200 hover:bg-accent-dim touch-manipulation ${focusRing}`}
              >
                Next Pokémon
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className='mt-6'>
              <label htmlFor='guess' className='sr-only'>
                Which Pokémon is this?
              </label>

              <div className='flex gap-2'>
                <input
                  id='guess'
                  ref={inputRef}
                  list='pokemon-names'
                  value={guess}
                  onChange={(event) => setGuess(event.target.value)}
                  disabled={status !== "playing"}
                  autoComplete='off'
                  spellCheck='false'
                  placeholder='Name the Pokémon…'
                  className={`flex-1 rounded-lg border-none bg-black-100 px-4 py-3 text-[15px] text-white placeholder:text-secondary disabled:opacity-60 ${focusRing}`}
                />

                <button
                  type='submit'
                  disabled={status !== "playing" || !guess.trim()}
                  className={`rounded-lg bg-accent px-5 py-3 text-[15px] font-semibold text-primary transition-colors duration-200 hover:bg-accent-dim disabled:cursor-not-allowed disabled:opacity-50 touch-manipulation ${focusRing}`}
                >
                  Guess
                </button>
              </div>

              <datalist id='pokemon-names'>
                {names.map((n) => (
                  <option key={n.slug} value={n.label} />
                ))}
              </datalist>

              <div className='mt-3 flex items-center justify-between gap-4'>
                <p className='font-mono text-[12px] text-secondary'>
                  {wrong.length
                    ? `${wrong.length} wrong: ${wrong.join(", ")}`
                    : "Hints appear as you miss."}
                </p>

                <button
                  type='button'
                  onClick={giveUp}
                  disabled={status !== "playing"}
                  className={`shrink-0 rounded-sm font-mono text-[12px] text-secondary underline underline-offset-4 hover:text-white disabled:opacity-50 ${focusRing}`}
                >
                  Give up
                </button>
              </div>
            </form>
          )}

          <p className='mt-10 text-[13px] leading-relaxed text-secondary'>
            Entries and artwork come from{" "}
            <a
              href='https://pokeapi.co'
              target='_blank'
              rel='noopener noreferrer'
              className={`text-white-100 underline underline-offset-4 hover:text-accent ${focusRing}`}
            >
              PokéAPI
            </a>
            . Pokémon is a trademark of Nintendo, Creatures and Game Freak. This
            is a fan-made toy, not affiliated with them.
          </p>
        </main>
      </div>
    </div>
  );
};

export default GuessApp;
