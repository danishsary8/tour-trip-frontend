import { motion, useReducedMotion } from "framer-motion";
import { cn } from "../../lib/cn";

export function SplitText({ children, className, as: Component = "span", delay = 0 }) {
  const reduceMotion = useReducedMotion();
  const words = String(children).split(" ");

  return (
    <Component className={cn("inline-flex flex-wrap", className)} aria-label={children}>
      {words.map((word, index) => (
        <span key={`${word}-${index}`} className="mr-[0.25em] inline-block overflow-hidden" aria-hidden="true">
          <motion.span
            className="inline-block"
            initial={reduceMotion ? false : { y: "110%", opacity: 0, rotate: 2 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.5, delay: reduceMotion ? 0 : delay + index * 0.065, ease: [0.22, 1, 0.36, 1] }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Component>
  );
}
