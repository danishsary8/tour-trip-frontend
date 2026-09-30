import { cn } from "../../lib/cn";

/**
 * Line drawing of Angkor's five towers over a gallery roof and water ripples.
 * Decorative only; stroke follows `currentColor`.
 */
export function AngkorLines({ className, withWater = true }) {
  return (
    <svg
      viewBox="0 0 240 96"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("pointer-events-none", className)}
      aria-hidden="true"
    >
      {/* gallery */}
      <path d="M8 78 V67 H232 V78" />
      <path d="M18 67 V62 H222 V67" />
      {/* outer towers */}
      <path d="M30 67 V56 Q40 34 50 56 V67" />
      <path d="M190 67 V56 Q200 34 210 56 V67" />
      {/* inner towers */}
      <path d="M68 67 V48 Q80 18 92 48 V67" />
      <path d="M148 67 V48 Q160 18 172 48 V67" />
      <path d="M72 56 H88 M152 56 H168" />
      {/* central prang */}
      <path d="M104 67 V40 Q120 -2 136 40 V67" />
      <path d="M107 56 H133 M109 46 H131 M112 34 H128" />
      <path d="M120 6 V2" />
      {/* base */}
      <path d="M2 78 H238" />
      {withWater && (
        <g strokeDasharray="2 5" opacity="0.7">
          <path d="M20 86 H220" />
          <path d="M48 92 H192" />
        </g>
      )}
    </svg>
  );
}
