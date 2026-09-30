import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAnimationControls } from "framer-motion";
import { AlertCircle, Eye, EyeOff, Lock, Mail, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { CustomerAuthShell } from "../auth/CustomerAuthShell";
import { customerLoginSchema } from "../auth/schema";
import { useCustomerAuth } from "../auth/CustomerAuthContext";
import { safeRedirect } from "../auth/redirect";
import { Button } from "../../../components/ui/Button";
import angkorHero from "../../../assets/images/common/login_bg_luxury.jpg";

export default function CustomerLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const cardControls = useAnimationControls();
  const { login } = useCustomerAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectParam = searchParams.get("redirect");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(customerLoginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  async function triggerShake() {
    await cardControls.start({
      x: [0, -10, 10, -8, 8, -4, 4, 0],
      transition: { duration: 0.35, ease: "easeInOut" },
    });
  }

  async function onSubmit(data) {
    setIsPending(true);
    try {
      const user = await login(data.email, data.password, data.remember);
      setIsSuccess(true);
      toast.success(`Welcome back, ${user.name}!`);

      // Allow 450ms for success feedback
      await new Promise((r) => setTimeout(r, 450));

      const destination = safeRedirect(redirectParam);
      navigate(destination, { replace: true });
    } catch (err) {
      await triggerShake();
      toast.error(err.message || "Failed to sign in. Please verify your credentials.");
    } finally {
      setIsPending(false);
    }
  }

  function fillDemoCredentials() {
    setValue("email", "customer@tourtrip.com", { shouldValidate: true });
    setValue("password", "Customer@123", { shouldValidate: true });
    toast.info("Demo traveller credentials filled");
  }


  const registerLink = redirectParam
    ? `/register?redirect=${encodeURIComponent(redirectParam)}`
    : "/register";

  return (
    <CustomerAuthShell
      image={angkorHero}
      imageAlt="Angkor Wat dawn sunrise reflection"
      tagline="Sacred Heritage & Living Culture"
      title="Welcome back, traveller"
      subtitle="Sign in to your TourTrip account to view bookings and curated tours."
      cardControls={cardControls}
      footer={
        <p>
          New to TourTrip?{" "}
          <Link
            to={registerLink}
            className="font-semibold text-primary transition-colors hover:text-primary/80 hover:underline"
          >
            Create an account
          </Link>
        </p>
      }
    >
      {/* Demo helper pill */}
      <div className="mb-5 flex items-center justify-between rounded-xl border border-primary/20 bg-primary/8 px-3.5 py-2.5 text-xs text-foreground/90">
        <span className="flex items-center gap-1.5 font-medium text-primary">
          <Sparkles className="size-3.5" /> Demo Account
        </span>
        <button
          type="button"
          onClick={fillDemoCredentials}
          className="rounded-lg bg-primary/15 px-2.5 py-1 font-semibold text-primary transition-colors hover:bg-primary/25 active:scale-95"
        >
          Auto-fill
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4.5" noValidate>
        {/* Email Field */}
        <div className="space-y-1.5">
          <label htmlFor="customer-email" className="block text-xs font-semibold uppercase tracking-wider text-muted">
            Email Address
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
            <input
              id="customer-email"
              type="email"
              autoComplete="email"
              placeholder="customer@tourtrip.com"
              {...register("email")}
              className={`h-11 w-full rounded-xl border bg-surface-2/60 pl-10 pr-4 text-sm text-foreground placeholder:text-muted/60 transition-[border-color,background-color,box-shadow] duration-200 outline-none hover:bg-surface-2 focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/20 ${
                errors.email ? "border-danger focus:border-danger focus:ring-danger/20" : "border-border"
              }`}
            />
          </div>
          {errors.email && (
            <p className="flex items-center gap-1 text-xs text-danger" role="alert">
              <AlertCircle className="size-3.5 shrink-0" />
              <span>{errors.email.message}</span>
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="customer-password" className="block text-xs font-semibold uppercase tracking-wider text-muted">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-xs font-medium text-primary transition-colors hover:text-primary/80 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
            <input
              id="customer-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              {...register("password")}
              onKeyUp={(e) => setCapsLock(e.getModifierState?.("CapsLock") ?? false)}
              onKeyDown={(e) => setCapsLock(e.getModifierState?.("CapsLock") ?? false)}
              onBlur={() => setCapsLock(false)}
              className={`h-11 w-full rounded-xl border bg-surface-2/60 pl-10 pr-11 text-sm text-foreground placeholder:text-muted/60 transition-[border-color,background-color,box-shadow] duration-200 outline-none hover:bg-surface-2 focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/20 ${
                errors.password ? "border-danger focus:border-danger focus:ring-danger/20" : "border-border"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-2.5 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-lg text-muted transition-colors hover:text-foreground active:scale-95"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {capsLock && (
            <p className="text-xs text-accent font-medium">
              Caps Lock is on
            </p>
          )}
          {errors.password && (
            <p className="flex items-center gap-1 text-xs text-danger" role="alert">
              <AlertCircle className="size-3.5 shrink-0" />
              <span>{errors.password.message}</span>
            </p>
          )}
        </div>

        {/* Remember Me Checkbox */}
        <div className="flex items-center justify-between pt-1">
          <label className="group inline-flex cursor-pointer items-center gap-2.5 select-none">
            <input
              type="checkbox"
              {...register("remember")}
              className="size-4 rounded border-border text-primary transition accent-primary focus:ring-2 focus:ring-primary/20"
            />
            <span className="text-xs text-muted group-hover:text-foreground transition-colors">
              Remember this device
            </span>
          </label>
        </div>

        {/* Primary Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={isPending}
          success={isSuccess}
          className="w-full font-semibold shadow-md active:scale-[0.99]"
        >
          Sign In
        </Button>
      </form>
    </CustomerAuthShell>
  );
}
