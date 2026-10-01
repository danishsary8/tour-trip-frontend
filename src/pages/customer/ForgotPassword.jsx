import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, KeyRound, Mail, MailCheck } from "lucide-react";
import { toast } from "sonner";
import { AuthCard, AuthKicker, CustomerAuthLayout } from "../../features/storefront/auth/CustomerAuthLayout";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

const linkClass =
  "inline-flex items-center gap-1.5 font-semibold text-accent transition-colors hover:text-[#f4ce72] hover:underline hover:underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

/** Customer password reset (mock: nothing is sent). Admin resets go through the system administrator. */
export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError("Please enter a valid email address");
      return;
    }
    setError("");
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setLoading(false);
    setSubmitted(true);
    toast.success("Password reset instructions sent");
  }

  return (
    <CustomerAuthLayout>
      <AuthCard
        kicker={<AuthKicker icon={KeyRound}>Traveller account</AuthKicker>}
        title={submitted ? "Check your email" : "Reset your password"}
        subtitle={
          submitted
            ? `If an account exists for ${email.trim()}, we've sent a link to reset its password.`
            : "Enter the email you signed up with and we'll send you a reset link."
        }
        footer={
          <p>
            Remember your password?{" "}
            <Link to="/login" className={linkClass}>
              Sign in
            </Link>
          </p>
        }
      >
        {submitted ? (
          <div className="space-y-5 text-center">
            <div className="mx-auto grid size-14 place-items-center rounded-2xl border border-accent/25 bg-accent/10 text-accent">
              <MailCheck className="size-7" aria-hidden="true" />
            </div>
            <p className="text-sm leading-relaxed text-white/60">
              Didn't get it? Check your spam folder, or wait a couple of minutes before trying again.
            </p>
            <div className="flex flex-col items-center gap-3">
              <Button variant="outline" size="lg" className="w-full border-white/14 bg-white/5" onClick={() => setSubmitted(false)}>
                Try another email address
              </Button>
              <Link to="/login" className={linkClass}>
                <ArrowLeft className="size-4" aria-hidden="true" /> Back to sign in
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Input
              label="Email address"
              icon={Mail}
              type="email"
              autoComplete="email"
              value={email}
              error={error}
              onChange={(event) => setEmail(event.target.value)}
            />
            <Button type="submit" size="lg" className="w-full" loading={loading}>
              Send reset link
            </Button>
          </form>
        )}
      </AuthCard>
    </CustomerAuthLayout>
  );
}
