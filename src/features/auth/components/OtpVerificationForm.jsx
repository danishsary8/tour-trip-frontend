import { useEffect, useRef, useState } from "react";
import { ArrowLeft, RefreshCw, ShieldCheck } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "../../../components/ui/Button";

const OTP_LENGTH = 6;

export function OtpVerificationForm({ email, loading, success, error, onVerify, onResend, onBack, showIcon = true }) {
  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(""));
  const [seconds, setSeconds] = useState(30);
  const inputs = useRef([]);

  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (seconds <= 0) return undefined;
    const timer = window.setInterval(() => setSeconds((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [seconds]);

  function setDigit(index, value) {
    const clean = value.replace(/\D/g, "");
    if (!clean) {
      setDigits((current) => current.map((digit, digitIndex) => (digitIndex === index ? "" : digit)));
      return;
    }

    const next = [...digits];
    clean.slice(0, OTP_LENGTH - index).split("").forEach((digit, offset) => {
      next[index + offset] = digit;
    });
    setDigits(next);
    inputs.current[Math.min(index + clean.length, OTP_LENGTH - 1)]?.focus();
  }

  function onKeyDown(event, index) {
    if (event.key === "Backspace") {
      if (digits[index]) setDigit(index, "");
      else if (index > 0) {
        inputs.current[index - 1]?.focus();
        setDigit(index - 1, "");
      }
    }
    if (event.key === "ArrowLeft" && index > 0) inputs.current[index - 1]?.focus();
    if (event.key === "ArrowRight" && index < OTP_LENGTH - 1) inputs.current[index + 1]?.focus();
  }

  function onPaste(event) {
    event.preventDefault();
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    setDigits([...pasted.split(""), ...Array(OTP_LENGTH - pasted.length).fill("")]);
    inputs.current[Math.min(pasted.length, OTP_LENGTH) - 1]?.focus();
  }

  async function handleResend() {
    await onResend();
    setSeconds(30);
  }

  const code = digits.join("");

  return (
    <motion.form
      initial={{ opacity: 0, x: 28 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      onSubmit={(event) => {
        event.preventDefault();
        if (code.length === OTP_LENGTH) onVerify(code);
      }}
      className="space-y-6"
    >
      <div>
        {showIcon && (
          <div className="mb-5 grid size-12 place-items-center rounded-2xl border border-accent/25 bg-accent/10 text-accent shadow-[inset_0_1px_rgba(255,255,255,.12)]">
            <ShieldCheck className="size-6" />
          </div>
        )}
        <p className="text-sm leading-relaxed text-white/55">
          Enter the 6-digit security code sent to <span className="font-medium text-white/85">{email}</span>
        </p>
      </div>

      <fieldset>
        <legend className="sr-only">One-time verification code</legend>
        <div className="grid grid-cols-6 gap-2 sm:gap-2.5" onPaste={onPaste}>
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(element) => { inputs.current[index] = element; }}
              value={digit}
              onChange={(event) => setDigit(index, event.target.value)}
              onKeyDown={(event) => onKeyDown(event, index)}
              inputMode="numeric"
              autoComplete={index === 0 ? "one-time-code" : "off"}
              maxLength={1}
              aria-label={`Verification digit ${index + 1}`}
              aria-invalid={Boolean(error)}
              className="aspect-square min-w-0 rounded-control border border-white/13 bg-black/25 text-center font-display text-xl font-semibold text-white caret-accent outline-none transition-all duration-200 hover:border-white/25 focus:border-accent/70 focus:bg-black/35 focus:shadow-[0_0_0_4px_rgba(233,185,73,.12)] disabled:opacity-50"
              disabled={loading || success}
            />
          ))}
        </div>
        <AnimatePresence>
          {error && (
            <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} role="alert" className="mt-2 text-xs text-[#ffaaa7]">
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </fieldset>

      <Button type="submit" size="lg" className="w-full" loading={loading} success={success} disabled={code.length !== OTP_LENGTH}>
        Verify & continue
      </Button>

      <div className="flex items-center justify-between text-sm">
        <button type="button" onClick={onBack} className="group inline-flex items-center gap-1.5 text-white/55 transition-colors hover:text-white active:scale-95">
          <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" /> Back
        </button>
        <button type="button" onClick={handleResend} disabled={seconds > 0 || loading} className="inline-flex items-center gap-1.5 text-accent transition-colors hover:text-[#f4cc6c] disabled:cursor-not-allowed disabled:text-white/35">
          <RefreshCw className="size-3.5" /> {seconds > 0 ? `Resend in ${seconds}s` : "Resend code"}
        </button>
      </div>
    </motion.form>
  );
}
