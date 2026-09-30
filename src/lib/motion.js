import { useReducedMotion } from "framer-motion";

export const motionEase = [0.22, 1, 0.36, 1];

export const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.32, ease: motionEase } },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25, ease: motionEase } },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.96, y: 10 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.35, ease: motionEase } },
};

export const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.08 } },
};

export const slideInRight = {
  hidden: { opacity: 0, x: 28 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.32, ease: motionEase } },
  exit: { opacity: 0, x: -18, transition: { duration: 0.18, ease: motionEase } },
};

export const shake = {
  idle: { x: 0 },
  error: { x: [0, -8, 7, -5, 4, 0], transition: { duration: 0.32, ease: "easeOut" } },
};

export const pageTransition = {
  initial: { opacity: 0, y: 4 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2, ease: motionEase } },
  exit: { opacity: 0, y: -4, transition: { duration: 0.1, ease: motionEase } },
};

const reduced = {
  hidden: { opacity: 1 },
  visible: { opacity: 1, x: 0, y: 0, scale: 1, transition: { duration: 0 } },
  exit: { opacity: 1, transition: { duration: 0 } },
};

export function useMotionPreset(preset) {
  return useReducedMotion() ? reduced : preset;
}
