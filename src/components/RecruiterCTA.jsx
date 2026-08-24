import React from "react";

const SparkIcon = () => (
  <svg
    aria-hidden='true'
    viewBox='0 0 20 20'
    className='w-4 h-4 shrink-0'
    fill='none'
    stroke='currentColor'
    strokeWidth='1.8'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <path d='M10 3.5 11.6 8 16 9.6 11.6 11.2 10 15.6 8.4 11.2 4 9.6 8.4 8Z' />
    <path d='M15.5 3.5v2.4M14.3 4.7h2.4' />
  </svg>
);

// Deliberately always visible rather than revealed on scroll: a recruiter who
// lands here should see it without having to discover it.
const RecruiterCTA = () => (
  <a
    href='/recruiter/'
    aria-label='For recruiters: ask an AI assistant about Dylan'
    className='fixed bottom-5 right-5 z-30 inline-flex items-center gap-2 rounded-full border border-[#915EFF]/40 bg-black-100/95 px-4 py-3 text-[14px] font-semibold text-white shadow-card backdrop-blur transition-colors duration-200 hover:border-[#915EFF] hover:bg-[#915EFF] touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#915EFF] focus-visible:ring-offset-2 focus-visible:ring-offset-primary'
  >
    <SparkIcon />
    <span>
      Recruiter?<span className='hidden sm:inline'> Ask my AI</span>
    </span>
  </a>
);

export default RecruiterCTA;
