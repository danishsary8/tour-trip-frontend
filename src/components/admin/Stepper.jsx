import React from 'react'
import { Check, Plane } from "lucide-react";
import { cx } from '../../utils/helpers';
import { STEPS } from '../../constants/customerConstant';

const Stepper = ({ step, furthestStep, onJump }) => {
  return (
        <div className="w-full max-w-2xl mx-auto px-4">
          <div className="relative flex items-center justify-between">
            <svg className="absolute left-0 right-0 top-5 h-1 w-full" preserveAspectRatio="none">
              <line x1="5%" y1="2" x2="95%" y2="2" stroke="var(--border)" strokeWidth="2" />
              <line
                x1="5%" y1="2"
                x2={step === 1 ? "5%" : step === 2 ? "50%" : "95%"}
                y2="2"
                stroke="var(--primary)" strokeWidth="2"
                className="flight-dash"
                style={{ transition: "x2 0.4s cubic-bezier(0.16,1,0.3,1)" }}
              />
            </svg>
            {STEPS.map((label, i) => {
              const idx = i + 1;
              const done = idx < step || idx <= furthestStep && idx < step;
              const isCompleted = idx < step;
              const isActive = idx === step;
              const clickable = idx <= furthestStep;
              return (
                <button
                  key={label}
                  type="button"
                  disabled={!clickable}
                  onClick={() => clickable && onJump(idx)}
                  className="relative z-10 flex flex-col items-center gap-2 bg-transparent"
                  style={{ cursor: clickable ? "pointer" : "default" }}
                >
                  <span
                    className={cx(
                      "w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-semibold font-display transition-all duration-300 border-2",
                      isCompleted && "bg-primary border-primary text-white",
                      isActive && "bg-surface border-primary text-primary-ink ring-4 ring-primary/20",
                      !isCompleted && !isActive && "bg-surface border-border text-muted"
                    )}
                  >
                    {isCompleted ? <Check className="w-4 h-4" /> : isActive ? <Plane className="w-4 h-4 -rotate-45" /> : idx}
                  </span>
                  <span className={cx(
                    "text-[12px] font-medium font-body whitespace-nowrap absolute top-12",
                    isActive ? "text-primary-ink" : isCompleted ? "text-foreground" : "text-muted"
                  )}>
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )
}

export default Stepper
