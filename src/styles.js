const styles = {
  paddingX: "sm:px-10 px-6",
  paddingY: "sm:py-16 py-10",
  padding: "sm:px-10 px-6 sm:py-24 py-16",

  // Down from 80px. The heading should introduce the work, not shout over it.
  heroHeadText:
    "font-semibold tracking-tight text-white lg:text-[64px] sm:text-[52px] xs:text-[42px] text-[34px] lg:leading-[1.05] leading-[1.1]",
  heroSubText:
    "text-secondary font-normal lg:text-[20px] sm:text-[18px] text-[16px] leading-relaxed",

  sectionHeadText:
    "text-white font-semibold tracking-tight md:text-[34px] sm:text-[30px] text-[26px] leading-tight",
  // Mono eyebrow instead of the template's spaced-out uppercase sans.
  sectionSubText:
    "font-mono uppercase text-accent text-[12px] tracking-[0.18em]",
};

export { styles };
