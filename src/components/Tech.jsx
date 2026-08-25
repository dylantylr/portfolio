import { SectionWrapper } from "../hoc";
import { technologies } from "../constants";

const Tech = () => {
  return (
    <div className="flex flex-row flex-wrap justify-center gap-3">
      {technologies.map((technology) => (
        <div
          key={technology.name}
          className="group flex h-24 w-24 items-center justify-center rounded-lg border border-line bg-tertiary transition-colors duration-300 hover:border-line-strong"
        >
          <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center transform hover:rotate-12 transition-transform duration-300">
            <img
              className="h-11 w-11 opacity-70 transition-opacity duration-300 group-hover:opacity-100"
              src={technology.icon}
              alt={technology.name}
              width={44}
              height={44}
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SectionWrapper(Tech, "tech");
