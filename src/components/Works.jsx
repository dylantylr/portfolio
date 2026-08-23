import React from "react";
import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { projects } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";

const ExternalLinkIcon = () => (
  <svg
    aria-hidden='true'
    viewBox='0 0 20 20'
    className='w-4 h-4 shrink-0'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <path d='M8 5H5.5A1.5 1.5 0 0 0 4 6.5v8A1.5 1.5 0 0 0 5.5 16h8a1.5 1.5 0 0 0 1.5-1.5V12' />
    <path d='M12 4h4v4M16 4l-6.5 6.5' />
  </svg>
);

const ProjectCard = ({
  index,
  name,
  description,
  tags,
  image,
  source_code_link,
}) => {
  return (
    <motion.div variants={fadeIn("up", "spring", index * 0.5, 0.75)}>
      <Tilt
        tiltMaxAngleX={45}
        tiltMaxAngleY={45}
        scale={1}
        transitionSpeed={450}
        className='sm:w-[360px] w-full'
      >
        {/* The whole card is the link, so there is nothing interactive nested
            inside it. aria-label keeps the accessible name short. */}
        <a
          href={source_code_link}
          target='_blank'
          rel='noopener noreferrer'
          aria-label={`${name} - view credential (opens in a new tab)`}
          className='group flex h-full flex-col bg-tertiary p-5 rounded-2xl ring-1 ring-white/5 transition duration-300 hover:ring-[#915EFF] hover:shadow-card touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#915EFF] focus-visible:ring-offset-2 focus-visible:ring-offset-primary'
        >
          <div className='relative w-full h-[230px]'>
            <img
              src={image}
              alt=''
              aria-hidden='true'
              width={320}
              height={230}
              loading='lazy'
              decoding='async'
              className='w-full h-full object-cover rounded-2xl'
            />
          </div>

          <div className='mt-5'>
            <h3 className='text-white font-bold text-[24px] text-balance'>
              {name}
            </h3>
            <p className='mt-2 text-secondary text-[14px] text-pretty break-words'>
              {description}
            </p>
          </div>

          <div className='mt-4 flex flex-wrap gap-2'>
            {tags.map((tag) => (
              <p
                key={`${name}-${tag.name}`}
                className={`text-[14px] ${tag.color}`}
              >
                #{tag.name}
              </p>
            ))}
          </div>

          <span
            aria-hidden='true'
            className='mt-5 inline-flex items-center gap-2 text-[14px] font-medium text-secondary transition-colors duration-300 group-hover:text-white'
          >
            View credential
            <ExternalLinkIcon />
          </span>
        </a>
      </Tilt>
    </motion.div>
  );
};

const Works = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={`${styles.sectionSubText} `}>My work</p>
        <h2 className={`${styles.sectionHeadText} text-balance`}>
          Licenses and Certifications.
        </h2>
      </motion.div>

      <div className='w-full flex'>
        <motion.p
          variants={fadeIn("", "", 0.1, 1)}
          className='mt-3 text-secondary text-[17px] max-w-3xl leading-[30px] text-pretty'
        >
          The following are some of the certifications I have earned to enhance
          my skills as a software engineer.
        </motion.p>
      </div>

      <div className='mt-20 flex flex-wrap gap-7 place-content-center items-stretch'>
        {projects.map((project, index) => (
          <ProjectCard key={`project-${index}`} index={index} {...project} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(Works, "certifications");
