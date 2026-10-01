import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import { LockKeyhole, Mail, Sparkles } from "lucide-react";

import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../../components/ui/Button";
import { Checkbox } from "../../components/ui/Checkbox";
import { Input } from "../../components/ui/Input";
import { PasswordInput } from "../../components/ui/PasswordInput";
import { useAuth } from "../../features/auth/AuthContext";
import { resendOtp, signIn, verifyOtp } from "../../features/auth/api";
import { OtpVerificationForm } from "../../features/auth/components/OtpVerificationForm";
import { loginSchema, otpSchema } from "../../features/auth/schema";

export default function AdminLoginPage() {
  const [step, setStep] = useState("login");
  const [challenge, setChallenge] = useState(null);
  const [loginPending, setLoginPending] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [otpPending, setOtpPending] = useState(false);
  const [otpSuccess, setOtpSuccess] = useState(false);
  const [otpError, setOtpError] = useState("");
  const cardControls = useAnimationControls();
  const { completeAuthentication } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", remember: false },
  });

  async function showCardError(message) {
    toast.error(message);
    await cardControls.start({ x: [0, -8, 7, -5, 4, 0], transition: { duration: 0.32 } });
  }

  async function onLogin(values) {
    setLoginPending(true);
    try {
      const response = await signIn(values);
      setLoginSuccess(true);
      await new Promise((resolve) => window.setTimeout(resolve, 450));
      setChallenge({ ...response, remember: values.remember });
      setStep("otp");
      setLoginSuccess(false);
    } catch (error) {
      await showCardError(error.message);
    } finally {
      setLoginPending(false);
    }
  }

  async function onVerify(code) {
    const parsed = otpSchema.safeParse(code);
    if (!parsed.success) {
      setOtpError(parsed.error.issues[0].message);
      return;
    }

    setOtpPending(true);
    setOtpError("");
    try {
      const session = await verifyOtp({ challengeId: challenge.challengeId, code });
      setOtpSuccess(true);
      completeAuthentication(session, challenge.remember);
      toast.success("Welcome back, Admin");
      await new Promise((resolve) => window.setTimeout(resolve, 450));
      const requestedPath = location.state?.from?.pathname;
      navigate(requestedPath?.startsWith("/admin") ? requestedPath : "/admin", { replace: true });
    } catch (error) {
      setOtpError(error.message);
      await showCardError(error.message);
    } finally {
      setOtpPending(false);
    }
  }

  function autofillDemo() {
    setValue("email", "admin@tourtrip.com", { shouldValidate: true });
    setValue("password", "Admin@123", { shouldValidate: true });
    toast.info("Demo credentials filled in");
  }

  // Sign in, then OTP verification. Admin accounts are never self-registered.
  const FrontContent = (
    <div className="w-full h-full min-h-[585px] rounded-[24px] border border-white/14 bg-[#10191d]/96 p-6 shadow-[0_24px_70px_rgba(0,0,0,.55),inset_0_1px_rgba(255,255,255,.12)] transform-gpu sm:p-8 lg:p-9 flex flex-col justify-between [contain:paint]">
      <div className="relative z-20 flex h-full flex-1 flex-col justify-between">


        <div className="mb-6">
          <div className="mb-3 flex items-center justify-between gap-4">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/6 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.17em] text-white/65">
              <Sparkles className="size-3 text-accent" /> Secure access
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22 }}
            >
              <h2 className="font-display text-3xl font-semibold tracking-[-0.04em] text-white sm:text-[2.15rem]">
                {step === "login" ? "Welcome back" : "Verify it’s you"}
              </h2>
              <p className="mt-2 text-sm text-white/50">
                {step === "login"
                  ? "Sign in to shape the next unforgettable journey."
                  : "One quick check before your dashboard."}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {step === "login" ? (
            <motion.form
              key="login"
              initial={{ opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -26 }}
              transition={{ duration: 0.28 }}
              onSubmit={handleSubmit(onLogin)}
              className="space-y-4"
              noValidate
            >
              <Input
                label="Email address"
                icon={Mail}
                type="email"
                autoComplete="username"
                error={errors.email?.message}
                {...register("email")}
              />

              <PasswordInput
                label="Password"
                icon={LockKeyhole}
                autoComplete="current-password"
                error={errors.password?.message}
                {...register("password")}
              />

              <div className="flex items-center justify-between gap-4 py-1">
                <Checkbox
                  label="Remember me"
                  checked={watch("remember")}
                  {...register("remember")}
                />
                <Link
                  to="/forgot-password"
                  className="group relative text-sm text-white/65 transition-colors hover:text-accent focus-visible:text-accent"
                >
                  Forgot password?
                  <span className="absolute -bottom-1 left-0 h-px w-0 bg-accent transition-all duration-200 group-hover:w-full" />
                </Link>
              </div>

              <Button
                type="submit"
                size="lg"
                className="mt-1 w-full"
                loading={loginPending}
                success={loginSuccess}
              >
                Sign in
              </Button>
            </motion.form>
          ) : (
            <OtpVerificationForm
              key="otp"
              email={challenge.destination}
              loading={otpPending}
              success={otpSuccess}
              error={otpError}
              onVerify={onVerify}
              onResend={async () => {
                await resendOtp(challenge.challengeId);
                toast.success("A fresh demo code was sent");
              }}
              onBack={() => {
                setOtpError("");
                setStep("login");
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );


  return (
    <main className="dark grid min-h-dvh place-items-center bg-[#081013] px-5 py-10 text-white">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
        className="min-w-0 w-full max-w-[520px] max-lg:w-[calc(100vw-2.5rem)] max-lg:max-w-none"
      >
        <motion.div animate={cardControls}>
          {FrontContent}
        </motion.div>


        {import.meta.env.DEV && step === "login" && (
          <button
            type="button"
            onClick={autofillDemo}
            className="mx-auto mt-4 block rounded-full border border-white/8 bg-black/20 px-4 py-2 text-xs text-white/50 backdrop-blur transition-all hover:-translate-y-0.5 hover:border-accent/30 hover:text-accent focus-visible:text-accent active:scale-95"
          >
            Demo credentials · click to autofill (admin@tourtrip.com)
          </button>
        )}
      </motion.div>
    </main>
  );
}
