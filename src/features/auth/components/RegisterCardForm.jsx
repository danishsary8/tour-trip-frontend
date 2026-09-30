import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  LockKeyhole,
  LogIn,
  Mail,
  Phone,
  Sparkles,
  User,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "../../../components/ui/Button";
import { Checkbox } from "../../../components/ui/Checkbox";
import { Input } from "../../../components/ui/Input";
import { PasswordInput } from "../../../components/ui/PasswordInput";
import { signUp } from "../api";
import { registerSchema } from "../schema";

export function RegisterCardForm({ onSwitchToLogin }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      phone: "",
      dob: "",
      agreeTerms: false,
    },
  });

  async function handleGoToStep2() {
    const isStep1Valid = await trigger(["email", "password", "confirmPassword"]);
    if (isStep1Valid) {
      setStep(2);
    }
  }

  async function onSubmit(data) {
    setLoading(true);
    try {
      await signUp(data);
      setSuccess(true);
      toast.success("Account created successfully! Please sign in.");
      await new Promise((resolve) => setTimeout(resolve, 600));
      reset();
      setStep(1);
      onSwitchToLogin(data.email);
    } catch (error) {
      toast.error(error.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
      setSuccess(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col justify-between">
      {/* Top Header & Step Indicator */}
      <div>
        <div className="mb-3 flex items-center justify-between gap-4">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.17em] text-accent">
            <Sparkles className="size-3" /> Step {step} of 2
          </span>

          <div className="flex items-center gap-3">
            {/* Stepper Dots */}
            <div className="flex items-center gap-1.5" aria-hidden="true">
              <span
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  step === 1 ? "w-6 bg-accent" : "w-2 bg-white/20"
                }`}
              />
              <span
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  step === 2 ? "w-6 bg-accent" : "w-2 bg-white/20"
                }`}
              />
            </div>

            {/* Quick 3D Flip Back to Sign In */}
            <button
              type="button"
              data-no-flip="true"
              onClick={() => onSwitchToLogin()}
              className="group inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/6 px-2.5 py-1 text-xs font-medium text-white/70 transition-all hover:border-white/30 hover:bg-white/12 active:scale-95"
            >
              <LogIn className="size-3.5 text-accent" /> Sign in
            </button>
          </div>
        </div>

        <h2 className="font-display text-2xl font-semibold tracking-[-0.04em] text-white sm:text-[1.85rem]">
          {step === 1 ? "Account Credentials" : "Personal Profile"}
        </h2>
        <p className="mt-1 text-sm text-white/50">
          {step === 1
            ? "Used as your username and for booking confirmations."
            : "Enter your legal details as they appear on your passport or ID."}
        </p>
      </div>


      {/* Form Content with Step Slide */}
      <form onSubmit={handleSubmit(onSubmit)} className="my-auto py-3" noValidate>
        <AnimatePresence mode="wait" initial={false}>
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-3.5"
            >
              <Input
                label="Email address"
                icon={Mail}
                type="email"
                placeholder="traveler@example.com"
                autoComplete="username"
                error={errors.email?.message}
                {...register("email")}
              />

              <PasswordInput
                label="Password (min 8 chars, 1 number, 1 symbol)"
                icon={LockKeyhole}
                placeholder="••••••••"
                autoComplete="new-password"
                error={errors.password?.message}
                {...register("password")}
              />

              <PasswordInput
                label="Confirm password"
                icon={LockKeyhole}
                placeholder="••••••••"
                autoComplete="new-password"
                error={errors.confirmPassword?.message}
                {...register("confirmPassword")}
              />

              <div className="pt-2">
                <Button
                  type="button"
                  size="lg"
                  className="w-full"
                  onClick={handleGoToStep2}
                >
                  Next: Personal Profile <ArrowRight className="ml-1.5 size-4" />
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-3"
            >
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="First name"
                  icon={User}
                  placeholder="First name"
                  autoComplete="given-name"
                  error={errors.firstName?.message}
                  {...register("firstName")}
                />
                <Input
                  label="Last name"
                  placeholder="Last name"
                  autoComplete="family-name"
                  error={errors.lastName?.message}
                  {...register("lastName")}
                />
              </div>

              <Input
                label="Phone number (with country code)"
                icon={Phone}
                type="tel"
                placeholder="+855 12 345 678"
                autoComplete="tel"
                error={errors.phone?.message}
                {...register("phone")}
              />

              <Input
                label="Date of birth (DD/MM/YYYY)"
                icon={Calendar}
                placeholder="15/08/1995"
                error={errors.dob?.message}
                {...register("dob")}
              />

              <div className="pt-1">
                <Checkbox
                  label={
                    <span className="text-xs text-white/60">
                      I agree to the{" "}
                      <span className="text-accent underline-offset-2 hover:underline">
                        Terms
                      </span>{" "}
                      &{" "}
                      <span className="text-accent underline-offset-2 hover:underline">
                        Privacy Policy
                      </span>
                    </span>
                  }
                  error={errors.agreeTerms?.message}
                  {...register("agreeTerms")}
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="w-1/3 border-white/14 bg-white/5"
                  onClick={() => setStep(1)}
                  disabled={loading || success}
                >
                  <ArrowLeft className="mr-1 size-4" /> Back
                </Button>
                <Button
                  type="submit"
                  size="lg"
                  className="flex-1"
                  loading={loading}
                  success={success}
                >
                  Create account
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      {/* Bottom Switcher */}
      <p className="pt-2 text-center text-sm text-white/50">
        Already have an account?{" "}
        <button
          type="button"
          data-no-flip="true"
          onClick={() => onSwitchToLogin()}
          className="font-medium text-accent transition-colors hover:text-[#f4ce72] hover:underline hover:underline-offset-4"
        >
          Sign in
        </button>
      </p>
    </div>
  );
}
