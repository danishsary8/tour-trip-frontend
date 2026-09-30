import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * High-performance 3D FlipCard component.
 * Uses GPU-accelerated CSS transforms on the compositor thread for a butter-smooth 60fps transition.
 */
export default function FlipCard({
  front = null,
  back = null,
  flipped,
  defaultFlipped = false,
  onFlipChange,
  axis = "y",
  perspective = 1200,
  duration = 0.55,
  radius = 24,
  shadow = true,
  shadowColor = "#000000",
  shadowOpacity = 0.45,
  ariaLabel = "Authentication card",
  className = "",
}) {
  const reduceMotion = useReducedMotion();
  const controlled = flipped !== undefined;
  const [internalFlipped, setInternalFlipped] = useState(defaultFlipped);

  const isFlipped = controlled ? flipped : internalFlipped;
  const isFlippedRef = useRef(isFlipped);

  useEffect(() => {
    if (isFlippedRef.current !== isFlipped) {
      isFlippedRef.current = isFlipped;
      onFlipChange?.(isFlipped);
    }
  }, [isFlipped, onFlipChange]);

  const targetRotation = isFlipped ? 180 : 0;
  const rotateProp = axis === "x" ? "rotateX" : "rotateY";

  return (
    <div
      role="region"
      aria-label={ariaLabel}
      className={`relative w-full select-none ${className}`}
      style={{
        perspective: `${perspective}px`,
      }}
    >
      {/* High-performance ambient shadow layer */}
      {shadow && (
        <span
          className="pointer-events-none absolute inset-x-8 -bottom-3 top-8 -z-10 rounded-[30px] opacity-75 blur-xl transform-gpu"
          style={{
            backgroundColor: shadowColor,
            opacity: shadowOpacity,
          }}
          aria-hidden="true"
        />
      )}

      {/* GPU-composited 3D Rotor */}
      <motion.div
        initial={false}
        animate={
          reduceMotion
            ? { opacity: 1 }
            : { [rotateProp]: targetRotation }
        }
        transition={{
          duration: reduceMotion ? 0.2 : duration,
          ease: [0.22, 1, 0.36, 1],
        }}
        style={{
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
        className="grid grid-cols-1 grid-rows-1 w-full [transform-style:preserve-3d] transform-gpu"
      >
        {/* Front Face */}
        <div
          className={`col-start-1 row-start-1 h-full w-full overflow-hidden [border-radius:${radius}px] [backface-visibility:hidden] [-webkit-backface-visibility:hidden] [transform:translate3d(0,0,1px)] transform-gpu ${
            isFlipped ? "pointer-events-none" : ""
          }`}
          aria-hidden={isFlipped}
          inert={isFlipped ? "" : undefined}
        >
          {front}
        </div>

        {/* Back Face */}
        <div
          className={`col-start-1 row-start-1 h-full w-full overflow-hidden [border-radius:${radius}px] [backface-visibility:hidden] [-webkit-backface-visibility:hidden] ${
            axis === "x"
              ? "[transform:rotateX(180deg)_translate3d(0,0,1px)]"
              : "[transform:rotateY(180deg)_translate3d(0,0,1px)]"
          } transform-gpu ${
            !isFlipped ? "pointer-events-none" : ""
          }`}
          aria-hidden={!isFlipped}
          inert={!isFlipped ? "" : undefined}
        >
          {back}
        </div>

      </motion.div>
    </div>
  );
}
