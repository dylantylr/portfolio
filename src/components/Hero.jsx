import { motion, useReducedMotion } from 'framer-motion';

import { styles } from '../styles';
import { ComputersCanvas } from "./canvas";

const Hero = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    // Below sm the hero is a real column: the copy takes the height it needs
    // and the canvas gets the remainder. A fixed percentage split cannot work
    // there, because the heading wraps to more lines on a short or narrow
    // phone while the split stays put. From sm up the copy is a narrow column
    // on the left with the model clear of it, so the old overlay is kept.
    <section className="relative mx-auto flex h-screen w-full flex-col sm:block">
       <div
        className={`relative pt-[120px] sm:absolute sm:inset-0 sm:top-[120px] sm:pt-0 max-w-7xl mx-auto w-full ${styles.paddingX} flex flex-col items-start`}
      >
        <div className='max-w-2xl'>
          <p className='font-mono text-[12px] uppercase tracking-[0.18em] text-accent'>
            San Francisco
          </p>

          <h1 className={`${styles.heroHeadText} mt-5 text-balance`}>
            Dylan Taylor
          </h1>

          <p className={`${styles.heroSubText} mt-4 text-pretty`}>
            Software engineer at Atlassian, building the platform tooling behind
            regulated cloud.
          </p>

          <p className='mt-6 inline-flex items-center gap-2 font-mono text-[12px] text-secondary'>
            <span
              aria-hidden='true'
              className='h-1.5 w-1.5 rounded-full bg-accent'
            />
            Open to interesting opportunities
          </p>
        </div>
      </div>

      {/* min-h-0 so the canvas can shrink inside the flex column rather than
          forcing the section taller than the viewport. */}
      <div className='relative min-h-0 flex-1 sm:absolute sm:inset-0'>
        <ComputersCanvas />
      </div>

      <div className='absolute xs:bottom-10 bottom-32 w-full flex justify-center items-center'>
        <a
          href='#about'
          aria-label='Scroll to the About section'
          className='touch-manipulation rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary'
        >
          <div className='w-[35px] h-[64px] rounded-3xl border-4 border-secondary flex justify-center items-start p-2'>
            <motion.div
              animate={
                shouldReduceMotion
                  ? undefined
                  : {
                      y: [0, 24, 0],
                    }
              }
              transition={
                shouldReduceMotion
                  ? undefined
                  : {
                      duration: 1.5,
                      repeat: Infinity,
                      repeatType: "loop",
                    }
              }
              className='w-3 h-3 rounded-full bg-secondary mb-1'
            />
          </div>
        </a>
      </div>
    </section>
  );
};

export default Hero
