import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAnimationControls } from "framer-motion";
import { AlertCircle, Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { toast } from "sonner";

import { CustomerAuthShell } from "../auth/CustomerAuthShell";
import { customerRegisterSchema } from "../auth/schema";
import { useCustomerAuth } from "../auth/CustomerAuthContext";
import { safeRedirect } from "../auth/redirect";
import { Button } from "../../../components/ui/Button";
import islandHero from "../../../assets/images/common/koh_rong_island.jpg";

function GoogleIcon({ className = "size-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.15 0 9.99 0 12s.45 3.85 1.24 5.42l4.04-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}

export default function CustomerRegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const cardControls = useAnimationControls();
  const { register: registerCustomer } = useCustomerAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectParam = searchParams.get("redirect");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(customerRegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeTerms: false,
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
      const user = await registerCustomer(data.name, data.email, data.password);
      setIsSuccess(true);
      toast.success(`Welcome to TourTrip, ${user.name}! Your account is ready.`);

      // 450ms for success animation feedback
      await new Promise((r) => setTimeout(r, 450));

      const destination = safeRedirect(redirectParam);
      navigate(destination, { replace: true });
    } catch (err) {
      await triggerShake();
      toast.error(err.message || "Failed to create account. Please try again.");
    } finally {
      setIsPending(false);
    }
  }

  function handleGoogleRegister() {
    toast.info("Google registration coming soon");
  }

  const loginLink = redirectParam
    ? `/login?redirect=${encodeURIComponent(redirectParam)}`
    : "/login";

  return (
    <CustomerAuthShell
      image={islandHero}
      imageAlt="Koh Rong turquoise waters and wooden boardwalk"
      tagline="Untouched Shores & Azure Waters"
      title="Create your account"
      subtitle="Join TourTrip to save itineraries, book tours, and unlock exclusive experiences."
      cardControls={cardControls}
      footer={
        <p>
          Already have an account?{" "}
          <Link
            to={loginLink}
            className="font-semibold text-primary transition-colors hover:text-primary/80 hover:underline"
          >
            Sign in
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Full Name */}
        <div className="space-y-1.5">
          <label htmlFor="register-name" className="block text-xs font-semibold uppercase tracking-wider text-muted">
            Full Name
          </label>
          <div className="relative">
            <User className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
            <input
              id="register-name"
              type="text"
              autoComplete="name"
              placeholder="e.g. Bopha Chan"
              {...register("name")}
              className={`h-11 w-full rounded-xl border bg-surface-2/60 pl-10 pr-4 text-sm text-foreground placeholder:text-muted/60 transition-[border-color,background-color,box-shadow] duration-200 outline-none hover:bg-surface-2 focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/20 ${
                errors.name ? "border-danger focus:border-danger focus:ring-danger/20" : "border-border"
              }`}
            />
          </div>
          {errors.name && (
            <p className="flex items-center gap-1 text-xs text-danger" role="alert">
              <AlertCircle className="size-3.5 shrink-0" />
              <span>{errors.name.message}</span>
            </p>
          )}
        </div>

        {/* Email Address */}
        <div className="space-y-1.5">
          <label htmlFor="register-email" className="block text-xs font-semibold uppercase tracking-wider text-muted">
            Email Address
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
            <input
              id="register-email"
              type="email"
              autoComplete="email"
              placeholder="bopha.chan@example.com"
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

        {/* Password */}
        <div className="space-y-1.5">
          <label htmlFor="register-password" className="block text-xs font-semibold uppercase tracking-wider text-muted">
            Password (min. 8 characters)
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
            <input
              id="register-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="••••••••"
              {...register("password")}
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
          {errors.password && (
            <p className="flex items-center gap-1 text-xs text-danger" role="alert">
              <AlertCircle className="size-3.5 shrink-0" />
              <span>{errors.password.message}</span>
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <label htmlFor="register-confirm-password" className="block text-xs font-semibold uppercase tracking-wider text-muted">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
            <input
              id="register-confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="••••••••"
              {...register("confirmPassword")}
              className={`h-11 w-full rounded-xl border bg-surface-2/60 pl-10 pr-11 text-sm text-foreground placeholder:text-muted/60 transition-[border-color,background-color,box-shadow] duration-200 outline-none hover:bg-surface-2 focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/20 ${
                errors.confirmPassword ? "border-danger focus:border-danger focus:ring-danger/20" : "border-border"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
              className="absolute right-2.5 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-lg text-muted transition-colors hover:text-foreground active:scale-95"
            >
              {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="flex items-center gap-1 text-xs text-danger" role="alert">
              <AlertCircle className="size-3.5 shrink-0" />
              <span>{errors.confirmPassword.message}</span>
            </p>
          )}
        </div>

        {/* Terms and Conditions Checkbox */}
        <div className="pt-1 space-y-1">
          <label className="group flex cursor-pointer items-start gap-2.5 select-none">
            <input
              type="checkbox"
              {...register("agreeTerms")}
              className="mt-0.5 size-4 rounded border-border text-primary transition accent-primary focus:ring-2 focus:ring-primary/20"
            />
            <span className="text-xs leading-normal text-muted group-hover:text-foreground transition-colors">
              I agree to TourTrip's{" "}
              <span className="text-foreground font-medium underline underline-offset-2">Terms of Service</span> and{" "}
              <span className="text-foreground font-medium underline underline-offset-2">Privacy Policy</span>.
            </span>
          </label>
          {errors.agreeTerms && (
            <p className="flex items-center gap-1 text-xs text-danger pl-6.5" role="alert">
              <AlertCircle className="size-3.5 shrink-0" />
              <span>{errors.agreeTerms.message}</span>
            </p>
          )}
        </div>

        {/* Create Account Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={isPending}
          success={isSuccess}
          className="w-full font-semibold shadow-md active:scale-[0.99] mt-2"
        >
          Create Account
        </Button>

        {/* Divider */}
        <div className="relative my-4 flex items-center justify-center">
          <div className="w-full border-t border-border" />
          <span className="absolute bg-surface px-3 text-xs uppercase tracking-wider text-muted">
            or continue with
          </span>
        </div>

        {/* Google OAuth Mock Button */}
        <button
          type="button"
          onClick={handleGoogleRegister}
          className="flex h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-border bg-surface-2/60 text-sm font-semibold text-foreground transition-all duration-200 hover:border-border hover:bg-surface-2 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-primary/30"
        >
          <GoogleIcon className="size-4.5" />
          <span>Continue with Google</span>
        </button>
      </form>
    </CustomerAuthShell>
  );
}
