import { motionEase } from "../../lib/motion";

/*
 * Storefront motion is slower and more cinematic than admin (300–500 ms, larger travel),
 * built on the shared easing curve. Pair with `useMotionPreset` for reduced motion.
 */
export const reveal = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: motionEase } },
};

export const revealFade = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: motionEase } },
};

export const revealScale = {
  hidden: { opacity: 0, scale: 0.96, y: 16 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: motionEase } },
};

export const revealStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};
