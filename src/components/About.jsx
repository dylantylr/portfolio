import React from "react";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { focusAreas, metrics } from "../constants";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";

const Metric = ({ value, label, index }) => (
  <motion.div
    variants={fadeIn("up", "tween", index * 0.08, 0.5)}
    className='border-t border-line pt-4'
  >
    <p className='font-mono text-[26px] font-medium leading-none text-accent'>
      {value}
    </p>
    <p className='mt-2 text-[14px] leading-snug text-secondary text-pretty'>
      {label}
    </p>
  </motion.div>
);

const About = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>About</p>
        <h2 className={`${styles.sectionHeadText} mt-3 text-balance`}>
          Backend and platform engineering
        </h2>
      </motion.div>

      <motion.div
        variants={fadeIn("", "", 0.1, 1)}
        className='mt-6 max-w-3xl'
      >
        <p className='text-[17px] leading-relaxed text-white-100 text-pretty'>
          I&rsquo;m a software engineer at Atlassian in San Francisco, on the
          Regulated Industries team supporting our FedRAMP customers. Most of my
          work is the unglamorous kind that makes other teams faster: shared
          SDKs, environment configuration, and automation that removes a manual
          step nobody wanted to own.
        </p>
        <p className='mt-4 text-[17px] leading-relaxed text-secondary text-pretty'>
          Before joining full time I interned at Atlassian in New York, and
          worked in data and business intelligence at Sherwin Williams. I hold an
          M.S. in Business Analytics and a B.S. in Computer Science and Economics,
          both from Rensselaer Polytechnic Institute.
        </p>
      </motion.div>

      {/* The numbers are the strongest thing on the resume, so they get their
          own moment instead of being buried in a timeline bullet. */}
      <div className='mt-14 grid gap-x-8 gap-y-8 sm:grid-cols-3'>
        {metrics.map((metric, index) => (
          <Metric key={metric.label} index={index} {...metric} />
        ))}
      </div>

      <motion.div variants={fadeIn("", "", 0.2, 1)} className='mt-14'>
        <p className='font-mono text-[12px] uppercase tracking-[0.18em] text-secondary'>
          Focus areas
        </p>
        <ul className='mt-4 flex flex-wrap gap-2 list-none'>
          {focusAreas.map((area) => (
            <li
              key={area}
              className='rounded-md border border-line px-3 py-1.5 font-mono text-[13px] text-white-100'
            >
              {area}
            </li>
          ))}
        </ul>
      </motion.div>
    </>
  );
};

export default SectionWrapper(About, "about");
