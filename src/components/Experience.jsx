import React from "react";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { experiences } from "../constants";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";

const ExperienceRow = ({ experience, index }) => (
  <motion.article
    variants={fadeIn("up", "tween", index * 0.08, 0.5)}
    className='grid gap-x-10 gap-y-3 border-t border-line py-8 md:grid-cols-[180px_1fr]'
  >
    <div className='flex items-start gap-3'>
      <img
        src={experience.icon}
        alt=''
        aria-hidden='true'
        width={22}
        height={22}
        loading='lazy'
        decoding='async'
        className='mt-[3px] h-[22px] w-[22px] shrink-0 rounded object-contain'
      />
      <span className='font-mono text-[12px] leading-relaxed text-secondary'>
        {experience.date}
      </span>
    </div>

    <div className='min-w-0'>
      <h3 className='text-[18px] font-semibold text-white'>
        {experience.title}
      </h3>
      <p className='mt-0.5 text-[15px] text-secondary'>
        {experience.company_name}
      </p>

      <ul className='mt-4 flex flex-col gap-2 list-none'>
        {experience.points.map((point, pointIndex) => (
          <li
            key={`${experience.title}-${pointIndex}`}
            className='relative pl-5 text-[15px] leading-relaxed text-white-100 text-pretty'
          >
            <span
              aria-hidden='true'
              className='absolute left-0 top-[9px] h-[5px] w-[5px] rounded-full bg-accent'
            />
            {point}
          </li>
        ))}
      </ul>
    </div>
  </motion.article>
);

const Experience = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>Experience</p>
        <h2 className={`${styles.sectionHeadText} mt-3 text-balance`}>
          Where I&rsquo;ve worked
        </h2>
      </motion.div>

      <div className='mt-12 border-b border-line'>
        {experiences.map((experience, index) => (
          <ExperienceRow
            key={`experience-${index}`}
            index={index}
            experience={experience}
          />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(Experience, "work");
