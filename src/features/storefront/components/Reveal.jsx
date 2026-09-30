import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useMotionPreset } from "../../../lib/motion";
import { reveal, revealStagger } from "../motion";

/**
 * Animates its children in the first time they scroll into view. With `stagger`, direct
 * children wrapped in `RevealItem` enter one after another. Reduced motion shows everything at once.
 */
export function Reveal({ as = "div", stagger = false, variants, amount = 0.2, className, children, ...props }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount });
  const preset = useMotionPreset(stagger ? revealStagger : variants ?? reveal);
  const Component = motion[as];

  return (
    <Component ref={ref} variants={preset} initial="hidden" animate={inView ? "visible" : "hidden"} className={className} {...props}>
      {children}
    </Component>
  );
}

/** Child of a staggered `Reveal`. */
export function RevealItem({ as = "div", variants, className, children, ...props }) {
  const preset = useMotionPreset(variants ?? reveal);
  const Component = motion[as];
  return (
    <Component variants={preset} className={className} {...props}>
      {children}
    </Component>
  );
}
