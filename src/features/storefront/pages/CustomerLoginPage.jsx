import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAnimationControls } from "framer-motion";
import { LockKeyhole, Mail, Plane } from "lucide-react";
import { toast } from "sonner";

import { AuthCard, AuthKicker, CustomerAuthLayout } from "../auth/CustomerAuthLayout";
import { customerLoginSchema } from "../auth/schema";
import { useCustomerAuth } from "../auth/CustomerAuthContext";
import { authPath, safeRedirect } from "../auth/redirect";
import { Button } from "../../../components/ui/Button";
import { Checkbox } from "../../../components/ui/Checkbox";
import { Input } from "../../../components/ui/Input";
import { PasswordInput } from "../../../components/ui/PasswordInput";

export default function CustomerLoginPage() {
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
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(customerLoginSchema),
    defaultValues: { email: "", password: "", remember: false },
  });

  async function onSubmit(data) {
    setIsPending(true);
    try {
      const user = await login(data.email, data.password, data.remember);
      setIsSuccess(true);
      toast.success(`Welcome back, ${user.name}!`);
      await new Promise((r) => setTimeout(r, 450));
      navigate(safeRedirect(redirectParam), { replace: true });
    } catch (err) {
      toast.error(err.message || "We couldn't sign you in. Please check your details.");
      await cardControls.start({ x: [0, -8, 7, -5, 4, 0], transition: { duration: 0.32 } });
    } finally {
      setIsPending(false);
    }
  }

  function fillDemoCredentials() {
    setValue("email", "customer@tourtrip.com", { shouldValidate: true });
    setValue("password", "Customer@123", { shouldValidate: true });
    toast.info("Demo traveller credentials filled in");
  }

  return (
    <CustomerAuthLayout>
      <div className="w-full min-w-0 max-w-[480px]">
        <AuthCard
          kicker={<AuthKicker icon={Plane}>Traveller account</AuthKicker>}
          title="Welcome back"
          subtitle="Sign in to see your trips, saved tours and invoices."
          cardControls={cardControls}
          footer={
            <p>
              New to TourTrip?{" "}
              <Link
                to={authPath(redirectParam, "register")}
                className="font-semibold text-accent transition-colors hover:text-[#f4ce72] hover:underline hover:underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                Create an account
              </Link>
            </p>
          }
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <Input label="Email address" icon={Mail} type="email" autoComplete="email" error={errors.email?.message} {...register("email")} />
            <PasswordInput
              label="Password"
              icon={LockKeyhole}
              autoComplete="current-password"
              error={errors.password?.message}
              {...register("password")}
            />

            <div className="flex items-center justify-between gap-4 py-1">
              <Checkbox label="Remember me" checked={watch("remember")} {...register("remember")} />
              <Link
                to="/forgot-password"
                className="text-sm text-white/65 transition-colors hover:text-accent focus-visible:text-accent focus-visible:outline-none"
              >
                Forgot password?
              </Link>
            </div>

            <Button type="submit" size="lg" className="mt-1 w-full" loading={isPending} success={isSuccess}>
              Sign in
            </Button>
          </form>
        </AuthCard>

        {/* DEV ONLY: demo autofill. `import.meta.env.DEV` is false in `vite build`, so this is stripped from production. */}
        {import.meta.env.DEV && (
          <button
            type="button"
            onClick={fillDemoCredentials}
            className="mx-auto mt-4 block rounded-full border border-dashed border-white/15 bg-black/30 px-4 py-2 text-xs text-white/55 backdrop-blur transition-colors hover:border-accent/40 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            Dev only · fill demo traveller (customer@tourtrip.com)
          </button>
        )}
      </div>
    </CustomerAuthLayout>
  );
}
