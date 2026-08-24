import React from "react";

import { contactLinks, resumeUrl } from "../constants";
import { recruiterProfile } from "../constants/recruiter";
import { logo } from "../assets";
import Chat from "./Chat";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#915EFF] focus-visible:ring-offset-2 focus-visible:ring-offset-primary";

const BackIcon = () => (
  <svg
    aria-hidden='true'
    viewBox='0 0 20 20'
    className='w-4 h-4'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <path d='M12.5 15 8 10l4.5-5' />
  </svg>
);

const DownloadIcon = () => (
  <svg
    aria-hidden='true'
    viewBox='0 0 20 20'
    className='w-4 h-4'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <path d='M10 3v9m0 0 3.5-3.5M10 12 6.5 8.5M4 15.5h12' />
  </svg>
);

const actionBase =
  "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-[15px] font-semibold transition-colors duration-200 touch-manipulation";

const RecruiterApp = () => {
  return (
    <div className='relative z-0 min-h-screen bg-primary'>
      <a
        href='#recruiter-main'
        className='sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:font-bold focus:text-primary'
      >
        Skip to main content
      </a>

      <div className='mx-auto w-full max-w-3xl px-6 py-10 sm:px-8 sm:py-16'>
        <a
          href='/'
          className={`inline-flex items-center gap-2 text-[15px] font-medium text-secondary hover:text-white rounded-sm touch-manipulation ${focusRing}`}
        >
          <BackIcon />
          Back to portfolio
        </a>

        <main id='recruiter-main'>
          <header className='mt-8 flex items-start gap-4'>
            <img
              src={logo}
              alt=''
              aria-hidden='true'
              width={56}
              height={56}
              className='h-14 w-14 shrink-0 object-contain'
            />

            <div className='min-w-0'>
              <h1 className='text-white font-black text-[32px] sm:text-[40px] leading-tight text-balance'>
                {recruiterProfile.name}
              </h1>
              <p className='mt-1 text-[17px] text-white-100'>
                {recruiterProfile.title}
              </p>
              <p className='text-[15px] text-secondary'>
                {recruiterProfile.location}
              </p>
            </div>
          </header>

          <p className='mt-6 inline-flex items-center gap-2 rounded-full border border-[#2bd67b]/30 bg-[#2bd67b]/10 px-4 py-2 text-[14px] font-medium text-[#7ff0b3]'>
            <span
              aria-hidden='true'
              className='h-2 w-2 rounded-full bg-[#2bd67b]'
            />
            {recruiterProfile.availability}
          </p>

          <nav aria-label='Quick actions' className='mt-6'>
            <ul className='flex flex-wrap gap-3 list-none'>
              <li>
                <a
                  href={resumeUrl}
                  download
                  aria-label='Download resume (PDF)'
                  className={`${actionBase} bg-[#915EFF] text-white hover:bg-[#7d4ae8] ${focusRing}`}
                >
                  <DownloadIcon />
                  Download CV
                </a>
              </li>

              {contactLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href={link.href}
                    {...(link.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    aria-label={
                      link.external
                        ? `${link.title} (opens in a new tab)`
                        : link.title
                    }
                    className={`${actionBase} border border-white/10 bg-tertiary text-white-100 hover:border-[#915EFF] hover:text-white ${focusRing}`}
                  >
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className='mt-10'>
            <Chat />
          </div>

          <p className='mt-6 text-[13px] leading-relaxed text-secondary'>
            This assistant is grounded in Dylan&rsquo;s resume and professional
            background. It can be wrong or incomplete, so treat anything
            important as worth confirming with Dylan directly.
          </p>
        </main>
      </div>
    </div>
  );
};

export default RecruiterApp;
