import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion, useAnimationControls, useReducedMotion } from "framer-motion";
import { ArrowLeft, Info, KeyRound, LockKeyhole, Mail, ShieldAlert, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../../components/ui/Button";
import { Checkbox } from "../../components/ui/Checkbox";
import { Input } from "../../components/ui/Input";
import { PasswordInput } from "../../components/ui/PasswordInput";
import { cn } from "../../lib/cn";
import { useAuth } from "../../features/auth/AuthContext";
import { resendOtp, signIn, verifyOtp } from "../../features/auth/api";
import { AdminAuthLayout } from "../../features/auth/components/AdminAuthLayout";
import { OtpVerificationForm } from "../../features/auth/components/OtpVerificationForm";
import { loginSchema, otpSchema } from "../../features/auth/schema";
import {
  LOCKOUT_MS,
  MAX_LOGIN_ATTEMPTS,
  clearLoginGuard,
  clearLoginNotice,
  formatCountdown,
  formatLastLogin,
  getLoginGuard,
  peekLoginNotice,
  recordFailedLogin,
} from "../../features/auth/security";

const COPY = {
  login: { title: "Admin sign in", subtitle: "Use your staff account. A verification code follows." },
  otp: { title: "Two-step verification", subtitle: "Confirm it's you before the console opens." },
  forgot: { title: "Reset your password", subtitle: "Admin passwords are managed by your organisation." },
};

const STEPS = ["Credentials", "Verification"];

export default function AdminLoginPage() {
  const [step, setStep] = useState("login");
  const [challenge, setChallenge] = useState(null);
  const [loginPending, setLoginPending] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [otpPending, setOtpPending] = useState(false);
  const [otpSuccess, setOtpSuccess] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [attemptError, setAttemptError] = useState("");
  const [notice] = useState(peekLoginNotice);
  const [now, setNow] = useState(() => Date.now());
  const cardControls = useAnimationControls();
  const reduceMotion = useReducedMotion();
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

  const email = watch("email");
  // Read on every render: the entered email can change, and each attempt updates storage.
  const guard = getLoginGuard(email, now);
  const lockedFor = guard.lockedUntil ? guard.lockedUntil - now : 0;
  const locked = lockedFor > 0;

  // The idle-logout message shows once.
  useEffect(() => {
    if (notice) clearLoginNotice();
  }, [notice]);

  // Tick the lockout countdown every second while the entered email is locked.
  useEffect(() => {
    if (!guard.lockedUntil) return undefined;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [guard.lockedUntil]);

  async function shake() {
    if (!reduceMotion) await cardControls.start({ x: [0, -8, 7, -5, 4, 0], transition: { duration: 0.32 } });
  }

  async function onLogin(values) {
    if (getLoginGuard(values.email).lockedUntil) {
      setNow(Date.now());
      return;
    }
    setLoginPending(true);
    setAttemptError("");
    try {
      const response = await signIn(values);
      clearLoginGuard(values.email);
      setLoginSuccess(true);
      await new Promise((resolve) => window.setTimeout(resolve, 450));
      setChallenge({ ...response, remember: values.remember });
      setStep("otp");
      setLoginSuccess(false);
    } catch (error) {
      const next = recordFailedLogin(values.email);
      setNow(Date.now());
      setValue("password", "");
      if (!next.lockedUntil) {
        const left = MAX_LOGIN_ATTEMPTS - next.failures;
        setAttemptError(`${error.message}. ${left} ${left === 1 ? "attempt" : "attempts"} left before this account is locked for ${LOCKOUT_MS / 60000} minutes.`);
      }
      await shake();
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
      const previous = completeAuthentication(session, challenge.remember);
      const lastLogin = formatLastLogin(previous);
      toast.success("Welcome back, Admin", lastLogin ? { description: `Last login: ${lastLogin}`, duration: 8000 } : undefined);
      await new Promise((resolve) => window.setTimeout(resolve, 450));
      const requestedPath = location.state?.from?.pathname;
      navigate(requestedPath?.startsWith("/admin") ? requestedPath : "/admin", { replace: true });
    } catch (error) {
      setOtpError(error.message);
      await shake();
    } finally {
      setOtpPending(false);
    }
  }

  // DEV ONLY: fills the mock admin account. Rendered only when import.meta.env.DEV is true,
  // so `vite build` drops the button from production bundles.
  function autofillDemo() {
    setValue("email", "admin@tourtrip.com", { shouldValidate: true });
    setValue("password", "Admin@123", { shouldValidate: true });
    toast.info("Demo credentials filled in");
  }

  const stepIndex = step === "otp" ? 1 : 0;
  const slide = reduceMotion ? 0 : 18;

  return (
    <AdminAuthLayout>
      <div className="w-full max-w-[400px]">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.section
            animate={cardControls}
            aria-labelledby="admin-auth-title"
            className="rounded-2xl border border-border bg-surface/85 p-6 shadow-[var(--shadow-panel)] backdrop-blur-xl sm:p-7"
          >
            <div className="flex items-start gap-3.5">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-border bg-surface-2 text-accent shadow-[inset_0_1px_rgba(255,255,255,.06)]">
                {step === "forgot" ? <KeyRound className="size-5" aria-hidden="true" /> : step === "otp" ? <ShieldCheck className="size-5" aria-hidden="true" /> : <LockKeyhole className="size-5" aria-hidden="true" />}
              </span>
              <div className="min-w-0">
                <h1 id="admin-auth-title" className="font-display text-xl font-semibold tracking-[-0.02em] text-foreground">
                  {COPY[step].title}
                </h1>
                <p className="mt-0.5 text-sm text-muted">{COPY[step].subtitle}</p>
              </div>
            </div>

            {step !== "forgot" && (
              <ol className="mt-5 grid grid-cols-2 gap-2" aria-label="Sign-in steps">
                {STEPS.map((label, index) => (
                  <li key={label} aria-current={index === stepIndex ? "step" : undefined}>
                    <span className={cn("block h-1 rounded-full transition-colors duration-300", index <= stepIndex ? "bg-accent" : "bg-border")} />
                    <span className={cn("mt-1.5 block text-[11px] font-medium", index === stepIndex ? "text-foreground" : "text-muted")}>
                      {index + 1}. {label}
                    </span>
                  </li>
                ))}
              </ol>
            )}

            {notice && step === "login" && (
              <p role="status" className="mt-5 flex items-start gap-2.5 rounded-control border border-info/30 bg-info/10 p-3 text-sm text-foreground">
                <Info className="mt-0.5 size-4 shrink-0 text-info" aria-hidden="true" /> {notice}
              </p>
            )}

            <div className="mt-5">
              <AnimatePresence mode="wait" initial={false}>
                {step === "login" && (
                  <motion.form
                    key="login"
                    initial={{ opacity: 0, x: -slide }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -slide }}
                    transition={{ duration: 0.24 }}
                    onSubmit={handleSubmit(onLogin)}
                    className="space-y-3.5"
                    noValidate
                  >
                    <Input
                      label="Email address"
                      icon={Mail}
                      type="email"
                      autoComplete="username"
                      error={errors.email?.message}
                      // Lockouts are per email: re-check against the current time as it changes.
                      {...register("email", { onChange: () => setNow(Date.now()) })}
                    />
                    <PasswordInput
                      label="Password"
                      icon={LockKeyhole}
                      autoComplete="current-password"
                      disabled={locked}
                      error={errors.password?.message}
                      {...register("password")}
                    />

                    {locked ? (
                      <div role="alert" className="flex items-start gap-2.5 rounded-control border border-danger/35 bg-danger/10 p-3 text-sm text-foreground">
                        <ShieldAlert className="mt-0.5 size-4 shrink-0 text-danger" aria-hidden="true" />
                        <span>
                          Too many attempts. Try again in{" "}
                          <span className="font-semibold tabular-nums" aria-live="off">
                            {formatCountdown(lockedFor)}
                          </span>
                          .
                        </span>
                      </div>
                    ) : (
                      attemptError && (
                        <p role="alert" className="flex items-start gap-2.5 rounded-control border border-warning/35 bg-warning/10 p-3 text-sm text-foreground">
                          <ShieldAlert className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden="true" /> {attemptError}
                        </p>
                      )
                    )}

                    <div className="flex items-center justify-between gap-4 py-0.5">
                      <Checkbox label="Remember me" checked={watch("remember")} {...register("remember")} />
                      <button
                        type="button"
                        onClick={() => setStep("forgot")}
                        className="rounded text-sm text-muted transition-colors hover:text-accent focus-visible:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                      >
                        Forgot password?
                      </button>
                    </div>

                    <Button type="submit" size="lg" className="w-full" loading={loginPending} success={loginSuccess} disabled={locked}>
                      {locked ? "Locked" : "Continue"}
                    </Button>
                  </motion.form>
                )}

                {step === "otp" && (
                  <OtpVerificationForm
                    key="otp"
                    showIcon={false}
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

                {step === "forgot" && (
                  <motion.div
                    key="forgot"
                    initial={{ opacity: 0, x: slide }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: slide }}
                    transition={{ duration: 0.24 }}
                    className="space-y-4"
                  >
                    <p className="rounded-control border border-border bg-surface-2/70 p-3.5 text-sm leading-relaxed text-foreground">
                      Contact your system administrator to reset your password. For security, admin accounts can't be
                      reset from this page.
                    </p>
                    <Button variant="outline" size="lg" className="w-full" onClick={() => setStep("login")}>
                      <ArrowLeft className="size-4" aria-hidden="true" /> Back to sign in
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.section>
        </motion.div>

        {import.meta.env.DEV && step === "login" && (
          <button
            type="button"
            onClick={autofillDemo}
            className="mx-auto mt-4 flex items-center gap-2 rounded-full border border-dashed border-warning/40 bg-warning/5 px-3.5 py-1.5 text-xs text-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <span className="rounded bg-warning/20 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-warning">Dev only</span>
            Fill demo admin (admin@tourtrip.com)
          </button>
        )}
      </div>
    </AdminAuthLayout>
  );
}
