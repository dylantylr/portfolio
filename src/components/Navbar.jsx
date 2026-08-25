import React, { useEffect, useRef, useState } from "react";

import { styles } from "../styles";
import { navLinks, contactLinks, resumeUrl } from "../constants";
import { menu, close } from "../assets";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary rounded-sm";

const ChevronIcon = ({ open }) => (
  <svg
    aria-hidden='true'
    viewBox='0 0 20 20'
    className={`w-4 h-4 transition-transform duration-200 ${
      open ? "rotate-180" : ""
    }`}
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <path d='M5 7.5 10 12.5 15 7.5' />
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

const ResumeButton = ({ className = "" }) => (
  <a
    href={resumeUrl}
    download
    aria-label='Download resume (PDF)'
    className={`inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2 text-[15px] font-semibold text-primary transition-colors duration-200 hover:bg-accent-dim touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary ${className}`}
  >
    <DownloadIcon />
    Resume
  </a>
);

const ContactLink = ({ link, onNavigate, className = "" }) => (
  <a
    href={link.href}
    onClick={onNavigate}
    {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    aria-label={link.external ? `${link.title} (opens in a new tab)` : link.title}
    className={`touch-manipulation ${focusRing} ${className}`}
  >
    {link.title}
  </a>
);

const Navbar = () => {
  const [active, setActive] = useState("");
  const [toggle, setToggle] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const menuButtonRef = useRef(null);
  const contactButtonRef = useRef(null);
  const contactWrapRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Escape closes whichever menu is open and restores focus to its trigger.
  useEffect(() => {
    if (!toggle && !contactOpen) return;

    const handleKeyDown = (event) => {
      if (event.key !== "Escape") return;

      if (contactOpen) {
        setContactOpen(false);
        contactButtonRef.current?.focus();
      } else if (toggle) {
        setToggle(false);
        menuButtonRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [toggle, contactOpen]);

  // Clicking or tabbing outside the dropdown dismisses it.
  useEffect(() => {
    if (!contactOpen) return;

    const handleOutside = (event) => {
      if (!contactWrapRef.current?.contains(event.target)) {
        setContactOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("focusin", handleOutside);

    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("focusin", handleOutside);
    };
  }, [contactOpen]);

  const handleHomeClick = (event) => {
    event.preventDefault();
    setActive("");
    window.scrollTo({ top: 0 });
  };

  return (
    <nav
      aria-label='Main'
      className={`${
        styles.paddingX
      } w-full flex items-center py-5 fixed top-0 z-20 ${
        scrolled ? "bg-primary" : "bg-transparent"
      }`}
    >
      <div className='w-full flex justify-between items-center max-w-6xl mx-auto'>
        <a
          href='/'
          onClick={handleHomeClick}
          className={`flex items-center touch-manipulation ${focusRing}`}
        >
          <p className='text-white text-[18px] font-bold flex '>
            Dylan &nbsp;
            <span className='sm:block hidden'> | SWE</span>
          </p>
        </a>

        {/* Desktop: section links, a Contact disclosure, then the resume CTA. */}
        <div className='hidden sm:flex flex-row items-center gap-8'>
          <ul className='list-none flex flex-row items-center gap-8'>
            {navLinks.map((nav) => (
              <li key={nav.id} className='text-[18px] font-medium'>
                <a
                  href={`#${nav.id}`}
                  onClick={() => setActive(nav.title)}
                  aria-current={active === nav.title ? "true" : undefined}
                  className={`${
                    active === nav.title ? "text-white" : "text-secondary"
                  } hover:text-white touch-manipulation ${focusRing}`}
                >
                  {nav.title}
                </a>
              </li>
            ))}

            <li className='relative' ref={contactWrapRef}>
              <button
                type='button'
                ref={contactButtonRef}
                onClick={() => setContactOpen((open) => !open)}
                aria-expanded={contactOpen}
                aria-controls='contact-menu'
                aria-haspopup='true'
                className={`flex items-center gap-1 text-[18px] font-medium touch-manipulation ${
                  contactOpen ? "text-white" : "text-secondary"
                } hover:text-white ${focusRing}`}
              >
                Contact
                <ChevronIcon open={contactOpen} />
              </button>

              <div
                id='contact-menu'
                hidden={!contactOpen}
                className='absolute right-0 top-full mt-3 min-w-[150px] rounded-xl black-gradient p-3 shadow-card'
              >
                <ul className='list-none flex flex-col gap-1'>
                  {contactLinks.map((link) => (
                    <li key={link.id}>
                      <ContactLink
                        link={link}
                        onNavigate={() => setContactOpen(false)}
                        className='block rounded-lg px-3 py-2 text-[16px] font-medium text-white hover:bg-white/10'
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          </ul>

          <ResumeButton />
        </div>

        {/* Mobile: one flat list, no nested disclosure. */}
        <div className='sm:hidden flex flex-1 justify-end items-center'>
          <button
            type='button'
            ref={menuButtonRef}
            onClick={() => setToggle(!toggle)}
            aria-label={toggle ? "Close menu" : "Open menu"}
            aria-expanded={toggle}
            aria-controls='mobile-menu'
            className={`p-1 touch-manipulation ${focusRing}`}
          >
            <img
              src={toggle ? close : menu}
              alt=''
              aria-hidden='true'
              width={28}
              height={28}
              className='w-[28px] h-[28px] object-contain'
            />
          </button>

          <div
            id='mobile-menu'
            hidden={!toggle}
            className={`${
              !toggle ? "hidden" : "flex"
            } p-6 black-gradient absolute top-20 right-0 mx-4 my-2 min-w-[200px] z-10 rounded-xl`}
          >
            <ul className='list-none flex justify-end items-stretch flex-1 flex-col gap-4'>
              {navLinks.map((nav) => (
                <li
                  key={nav.id}
                  className='font-poppins font-medium text-[16px]'
                >
                  <a
                    href={`#${nav.id}`}
                    onClick={() => {
                      setToggle(false);
                      setActive(nav.title);
                    }}
                    aria-current={active === nav.title ? "true" : undefined}
                    className={`${
                      active === nav.title ? "text-white" : "text-secondary"
                    } hover:text-white touch-manipulation ${focusRing}`}
                  >
                    {nav.title}
                  </a>
                </li>
              ))}

              {contactLinks.map((link) => (
                <li
                  key={link.id}
                  className='font-poppins font-medium text-[16px]'
                >
                  <ContactLink
                    link={link}
                    onNavigate={() => setToggle(false)}
                    className='block text-secondary hover:text-white'
                  />
                </li>
              ))}

              <li className='pt-1'>
                <ResumeButton className='w-full' />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
