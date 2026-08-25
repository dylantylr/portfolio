import React from "react";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";
import { testimonials } from "../constants";

const FeedbackCard = ({
  index,
  testimonial,
  name,
  designation,
  company,
  image,
}) => (
  <motion.div
    variants={fadeIn("up", "tween", index * 0.08, 0.5)}
    className='flex w-full flex-col rounded-xl border border-line bg-tertiary p-7'
  >
    <figure className='flex flex-1 flex-col'>
      <p aria-hidden='true' className='font-mono text-[13px] text-accent'>
        &ldquo;
      </p>

      <div className='mt-1 flex flex-1 flex-col'>
        <blockquote className='text-[16px] leading-relaxed text-white-100 text-pretty break-words'>
          {testimonial}
        </blockquote>

        <figcaption className='mt-auto flex items-center gap-3 pt-7'>
          <img
            src={image}
            alt=''
            aria-hidden='true'
            width={36}
            height={36}
            loading='lazy'
            decoding='async'
            className='h-9 w-9 shrink-0 rounded-full object-cover'
          />

          <div className='min-w-0 flex-1'>
            <p className='truncate font-mono text-[13px] text-white-100'>
              {name}
            </p>
            {designation || company ? (
              <p className='mt-0.5 truncate text-[12px] text-secondary'>
                {designation} {company}
              </p>
            ) : null}
          </div>
        </figcaption>
      </div>
    </figure>
  </motion.div>
);

const Feedbacks = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>Inspiration</p>
        <h2 className={`${styles.sectionHeadText} mt-3 text-balance`}>
          Words I keep around
        </h2>
      </motion.div>

      {/* Grid rather than fixed-width cards in a flex-wrap, so three sit
          across at full width instead of wrapping two and one. */}
      <div className='mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        {testimonials.map((testimonial, index) => (
          <FeedbackCard key={testimonial.name} index={index} {...testimonial} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(Feedbacks, "quotes");
