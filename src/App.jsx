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
      </main>

      <RecruiterCTA />
    </div>
  );
};

export default App;
