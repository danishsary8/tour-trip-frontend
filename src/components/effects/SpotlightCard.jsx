import { useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { cn } from "../../lib/cn";

export function SpotlightCard({ children, className, ...props }) {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const rotateX = useSpring(useTransform(pointerY, [-0.5, 0.5], [2.5, -2.5]), { stiffness: 220, damping: 24 });
  const rotateY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-2.5, 2.5]), { stiffness: 220, damping: 24 });

  function onPointerMove(event) {
    if (reduceMotion || event.pointerType === "touch" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
    ref.current.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
    ref.current.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
  }

  function resetTilt() {
    pointerX.set(0);
    pointerY.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={resetTilt}
      style={reduceMotion ? undefined : { rotateX, rotateY, transformPerspective: 1200 }}
      className={cn(
        "relative overflow-hidden before:pointer-events-none before:absolute before:inset-0 before:z-10 before:opacity-0 before:transition-opacity before:duration-300 before:content-[''] before:[background:radial-gradient(420px_circle_at_var(--spot-x,50%)_var(--spot-y,50%),rgba(255,255,255,.13),transparent_55%)] hover:before:opacity-100",
        className,
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
