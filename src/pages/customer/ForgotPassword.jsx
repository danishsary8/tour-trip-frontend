import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Mail, MailCheck } from "lucide-react";
import { toast } from "sonner";
import { CustomerAuthShell } from "../../features/storefront/auth/CustomerAuthShell";
import { Button } from "../../components/ui/Button";
import mekongHero from "../../assets/images/common/mekong_river_sunset.jpg";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setLoading(false);
    setSubmitted(true);
    toast.success("Password reset instructions sent!");
  }

  return (
    <CustomerAuthShell
      image={mekongHero}
      imageAlt="Mekong river sunset with traditional longtail boat"
      tagline="Living Waters & Golden Sunsets"
      title={submitted ? "Check your email" : "Reset your password"}
      subtitle={
        submitted
          ? `We sent instructions to ${email || "your address"}. Follow the link in that email to reset your password.`
          : "Enter your email address and we will send you a link to reset your account password."
      }
      footer={
        <p>
          Remember your password?{" "}
          <Link
            to="/login"
            className="font-semibold text-primary transition-colors hover:text-primary/80 hover:underline"
          >
            Sign in
          </Link>
        </p>
      }
    >
      {submitted ? (
        <div className="space-y-5 text-center py-2">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <MailCheck className="size-7" />
          </div>

          <div className="rounded-2xl border border-border bg-surface-2/60 p-4 text-xs text-muted leading-relaxed">
            <p className="flex items-center justify-center gap-1.5 font-medium text-foreground">
              <CheckCircle2 className="size-3.5 text-accent" />
              Reset email dispatched
            </p>
            <p className="mt-1">
              Didn't receive it? Check your spam folder or wait a couple of minutes before requesting another link.
            </p>
          </div>

          <div className="space-y-2.5 pt-2">
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="text-xs font-semibold text-primary hover:underline"
            >
              Try another email address
            </button>
            <Link
              to="/login"
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-white shadow-md transition hover:bg-primary/90"
            >
              <ArrowLeft className="size-4" /> Return to Sign In
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <label htmlFor="reset-email" className="block text-xs font-semibold uppercase tracking-wider text-muted">
              Email Address
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
              <input
                id="reset-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="customer@tourtrip.com"
                required
                className="h-11 w-full rounded-xl border border-border bg-surface-2/60 pl-10 pr-4 text-sm text-foreground placeholder:text-muted/60 transition outline-none hover:bg-surface-2 focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className="w-full font-semibold shadow-md active:scale-[0.99]"
          >
            Send Reset Link
          </Button>

          <div className="pt-2 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted hover:text-foreground transition-colors"
            >
              <ArrowLeft className="size-3.5" /> Back to Sign In
            </Link>
          </div>
        </form>
      )}
    </CustomerAuthShell>
  );
}
