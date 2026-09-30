import { forwardRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "./Input";

export const PasswordInput = forwardRef(function PasswordInput(props, ref) {
  const [visible, setVisible] = useState(false);
  const [capsLock, setCapsLock] = useState(false);

  function updateCapsLock(event) {
    setCapsLock(event.getModifierState?.("CapsLock") ?? false);
    props.onKeyUp?.(event);
  }

  return (
    <div className="relative">
      <Input
        {...props}
        ref={ref}
        type={visible ? "text" : "password"}
        onKeyUp={updateCapsLock}
        onKeyDown={(event) => {
          setCapsLock(event.getModifierState?.("CapsLock") ?? false);
          props.onKeyDown?.(event);
        }}
        onBlur={(event) => {
          setCapsLock(false);
          props.onBlur?.(event);
        }}
        inputClassName="pr-12"
      />
      <button
        type="button"
        onClick={() => setVisible((current) => !current)}
        className="absolute right-2.5 top-2.5 z-10 grid size-9 place-items-center rounded-lg text-white/48 transition-colors hover:bg-white/8 hover:text-white focus-visible:text-accent active:scale-95"
        aria-label={visible ? "Hide password" : "Show password"}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={visible ? "hide" : "show"} initial={{ scale: 0.7, opacity: 0, rotate: -12 }} animate={{ scale: 1, opacity: 1, rotate: 0 }} exit={{ scale: 0.7, opacity: 0, rotate: 12 }} transition={{ duration: 0.15 }}>
            {visible ? <EyeOff className="size-[18px]" /> : <Eye className="size-[18px]" />}
          </motion.span>
        </AnimatePresence>
      </button>
      <AnimatePresence>
        {capsLock && (
          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="mt-1.5 text-xs text-accent" aria-live="polite">
            Caps Lock is on
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
});
