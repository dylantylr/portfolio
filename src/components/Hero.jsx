import { motion, useReducedMotion } from 'framer-motion';

import { styles } from '../styles';
import { ComputersCanvas } from "./canvas";

const Hero = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative w-full h-screen mx-auto">
       <div
        className={`absolute inset-0 top-[120px]  max-w-7xl mx-auto ${styles.paddingX} flex flex-col items-start`}
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

      <ComputersCanvas />

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
