import { motion, useReducedMotion } from "framer-motion";

import { styles } from "../styles";
import { staggerContainer } from "../utils/motion";

const StarWrapper = (Component, idName) =>
  function HOC() {
    const shouldReduceMotion = useReducedMotion();

    return (
      <motion.section
        // An empty idName previously rendered an invalid id="" attribute.
        id={idName || undefined}
        variants={staggerContainer()}
        initial={shouldReduceMotion ? false : "hidden"}
        whileInView='show'
        viewport={{ once: true, amount: 0.25 }}
        className={`${styles.padding} max-w-5xl mx-auto relative z-0`}
      >
        <Component />
      </motion.section>
    );
  };

export default StarWrapper;
