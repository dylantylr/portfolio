import React, { useEffect, useRef, useState } from "react";

import { styles } from "../styles";
import { navLinks } from "../constants";
import { logo, menu, close } from "../assets";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary rounded-sm";

const Navbar = () => {
  const [active, setActive] = useState("");
  const [toggle, setToggle] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButtonRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Escape closes the mobile menu and returns focus to the toggle.
  useEffect(() => {
    if (!toggle) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setToggle(false);
        menuButtonRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [toggle]);

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
      <div className='w-full flex justify-between items-center max-w-7xl mx-auto'>
        <a
          href='/'
          onClick={handleHomeClick}
          className={`flex items-center gap-2 touch-manipulation ${focusRing}`}
        >
          <img
            src={logo}
            alt=''
            aria-hidden='true'
            width={36}
            height={36}
            className='w-9 h-9 object-contain'
          />
          <p className='text-white text-[18px] font-bold flex '>
            Dylan &nbsp;
            <span className='sm:block hidden'> | SWE</span>
          </p>
        </a>

        <ul className='list-none hidden sm:flex flex-row gap-10'>
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
        </ul>

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
            } p-6 black-gradient absolute top-20 right-0 mx-4 my-2 min-w-[140px] z-10 rounded-xl`}
          >
            <ul className='list-none flex justify-end items-start flex-1 flex-col gap-4'>
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
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
