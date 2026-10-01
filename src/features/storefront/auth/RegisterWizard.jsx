import { useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Calendar, LockKeyhole, Mail, Phone, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "../../../components/ui/Button";
import { Checkbox } from "../../../components/ui/Checkbox";
import { Input } from "../../../components/ui/Input";
import { PasswordInput } from "../../../components/ui/PasswordInput";
import { REGISTER_STEP_FIELDS, customerRegisterSchema } from "./schema";

const STEPS = [
  { title: "Account credentials", hint: "Your email is your username and where booking confirmations go." },
  { title: "Personal profile", hint: "Use your name as it appears on your passport or ID." },
];

/**
 * Two-step customer sign-up (credentials, then profile). `onSubmit(values)` does the actual
 * registration and should throw on failure; after the button's success tick, `onDone` runs.
 */
export function RegisterWizard({ onSubmit, onDone, onFail }) {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const reduceMotion = useReducedMotion();
  const headingRef = useRef(null);
  const firstRender = useRef(true);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(customerRegisterSchema),
    mode: "onTouched",
    defaultValues: { email: "", password: "", confirmPassword: "", firstName: "", lastName: "", phone: "", dob: "", agreeTerms: false },
  });

  // Move focus to the new step's heading so keyboard and screen-reader users follow along.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [step]);

  async function next() {
    if (await trigger(REGISTER_STEP_FIELDS[0])) setStep(1);
  }

  async function submit(values) {
    setLoading(true);
    try {
      await onSubmit(values);
      setLoading(false);
      setSuccess(true);
      await new Promise((resolve) => setTimeout(resolve, 450));
      onDone?.();
    } catch (error) {
      // An email that is already registered belongs to step 1.
      if (/already exists/i.test(error.message)) setStep(0);
      onFail?.(error);
    } finally {
      setLoading(false);
    }
  }

  const slide = reduceMotion ? 0 : 16;

  return (
    <div>
      <div className="mb-5 flex items-center gap-3" aria-hidden="true">
        {STEPS.map((item, index) => (
          <span key={item.title} className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-white/12">
            <motion.span
              className="absolute inset-0 origin-left rounded-full bg-accent"
              initial={false}
              animate={{ scaleX: index <= step ? 1 : 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            />
          </span>
        ))}
        <span className="shrink-0 font-display text-xs font-semibold tabular-nums text-white/55">
          0{step + 1} / 0{STEPS.length}
        </span>
      </div>

      <h3 ref={headingRef} tabIndex={-1} className="font-display text-lg font-semibold text-white outline-none">
        <span className="sr-only">Step {step + 1} of {STEPS.length}: </span>
        {STEPS[step].title}
      </h3>
      <p className="mt-1 text-sm text-white/55">{STEPS[step].hint}</p>

      <form onSubmit={handleSubmit(submit)} className="mt-5" noValidate>
        <AnimatePresence mode="wait" initial={false}>
          {step === 0 ? (
            <motion.div
              key="credentials"
              initial={{ opacity: 0, x: -slide }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -slide }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-3.5"
            >
              <Input label="Email address" icon={Mail} type="email" autoComplete="email" error={errors.email?.message} {...register("email")} />
              <PasswordInput
                label="Password (8+ characters, a number and a symbol)"
                icon={LockKeyhole}
                autoComplete="new-password"
                error={errors.password?.message}
                {...register("password")}
              />
              <PasswordInput
                label="Confirm password"
                icon={LockKeyhole}
                autoComplete="new-password"
                error={errors.confirmPassword?.message}
                {...register("confirmPassword")}
              />
              <Button type="button" size="lg" className="mt-2 w-full" onClick={next}>
                Next: personal profile <ArrowRight className="size-4" aria-hidden="true" />
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: slide }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: slide }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-3"
            >
              <div className="grid grid-cols-2 gap-3 max-[380px]:grid-cols-1">
                <Input label="First name" icon={User} autoComplete="given-name" error={errors.firstName?.message} {...register("firstName")} />
                <Input label="Last name" autoComplete="family-name" error={errors.lastName?.message} {...register("lastName")} />
              </div>
              <Input
                label="Phone (with country code)"
                icon={Phone}
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                error={errors.phone?.message}
                {...register("phone")}
              />
              <Input
                label="Date of birth (DD/MM/YYYY)"
                icon={Calendar}
                inputMode="numeric"
                autoComplete="bday"
                error={errors.dob?.message}
                {...register("dob")}
              />
              <div className="pt-1">
                <Checkbox
                  checked={watch("agreeTerms")}
                  label={
                    <span className="text-xs text-white/65">
                      I agree to TourTrip's Terms of Service and Privacy Policy
                    </span>
                  }
                  {...register("agreeTerms")}
                />
                {errors.agreeTerms && (
                  <p role="alert" className="mt-1.5 text-xs text-[#ffaaa7]">
                    {errors.agreeTerms.message}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="w-1/3 border-white/14 bg-white/5"
                  onClick={() => setStep(0)}
                  disabled={loading || success}
                >
                  <ArrowLeft className="size-4" aria-hidden="true" /> Back
                </Button>
                <Button type="submit" size="lg" className="flex-1" loading={loading} success={success}>
                  Create account
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}
