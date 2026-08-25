import { About, Experience, Feedbacks, Hero, Navbar, Tech, Works, StarsCanvas, EarthCanvas, RecruiterCTA } from "./components";

const App = () => {
  return (
    <div className="relative z-0 bg-primary">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:font-bold focus:text-primary"
      >
        Skip to main content
      </a>

      <div className='relative bg-cover bg-no-repeat bg-center'>
        <StarsCanvas />
        <Navbar />
        <Hero />
      </div>

      <main id="main-content">
        <About />
        <Experience />
        <Tech />
        <Works />
        <Feedbacks />

        {/* Decorative sign-off. The model spins on its own; the canvas is
            already hidden from assistive tech. */}
        {/* The canvas carries its own height so this collapses to nothing
            when WebGL is unavailable and EarthCanvas renders null. */}
        <div aria-hidden="true" className="w-full mt-4">
          <EarthCanvas />
        </div>

        {/* The only route into the radio page, sitting with the model rather
            than cluttering the main nav. */}
        <div className="flex justify-center pb-16 pt-2">
          <a
            href="/vibe/"
            className="group inline-flex items-center gap-3 rounded-full border border-line bg-tertiary px-5 py-3 transition-colors duration-200 hover:border-accent touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              className="h-4 w-4 text-accent"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              <circle cx="10" cy="10" r="7" />
              <circle cx="10" cy="10" r="2.5" />
              <path d="M10 3v2M10 15v2M3 10h2M15 10h2" />
            </svg>
            <span className="text-[15px] font-medium text-white">Radio</span>
            <span className="hidden text-[14px] text-secondary sm:inline">
              what would they listen to?
            </span>
            <span
              aria-hidden="true"
              className="text-secondary transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-accent"
            >
              &rarr;
            </span>
          </a>
        </div>
      </main>

      <RecruiterCTA />
    </div>
  );
};

export default App;
