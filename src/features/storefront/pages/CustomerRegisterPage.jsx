import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAnimationControls } from "framer-motion";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";

import { AuthCard, AuthKicker, CustomerAuthLayout } from "../auth/CustomerAuthLayout";
import { RegisterWizard } from "../auth/RegisterWizard";
import { useCustomerAuth } from "../auth/CustomerAuthContext";
import { authPath, safeRedirect } from "../auth/redirect";

export default function CustomerRegisterPage() {
  const cardControls = useAnimationControls();
  const { register } = useCustomerAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectParam = searchParams.get("redirect");

  async function createAccount(values) {
    const name = `${values.firstName.trim()} ${values.lastName.trim()}`;
    const user = await register(name, values.email, values.password, { phone: values.phone.trim(), dob: values.dob });
    toast.success(`Welcome to TourTrip, ${user.name}! Your account is ready.`);
  }

  async function onFail(error) {
    toast.error(error.message || "We couldn't create your account. Please try again.");
    await cardControls.start({ x: [0, -8, 7, -5, 4, 0], transition: { duration: 0.32 } });
  }

  return (
    <CustomerAuthLayout>
      <AuthCard
        kicker={<AuthKicker icon={UserPlus}>Join TourTrip</AuthKicker>}
        title="Create your account"
        subtitle="Book tours, keep every trip and invoice in one place, and review the tours you've taken."
        bookingNote="Create your account to finish your booking. Your date and travellers are saved."
        cardControls={cardControls}
        footer={
          <p>
            Already have an account?{" "}
            <Link
              to={authPath(redirectParam)}
              className="font-semibold text-accent transition-colors hover:text-[#f4ce72] hover:underline hover:underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              Sign in
            </Link>
          </p>
        }
      >
        <RegisterWizard
          onSubmit={createAccount}
          onDone={() => navigate(safeRedirect(redirectParam), { replace: true })}
          onFail={onFail}
        />
      </AuthCard>
    </CustomerAuthLayout>
  );
}
