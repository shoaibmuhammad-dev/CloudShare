import { AuthLayout } from "@/components/layout/AuthLayout";
import { SignupForm } from "./_components/SignupForm";

export const metadata = {
  title: "Create Account | CloudShare",
  description:
    "Create a new CloudShare account to start securely storing and sharing files.",
};

export default function SignupPage() {
  return (
    <AuthLayout
      title="Create an account"
      subtitle="Start your 14-day free trial. No credit card required."
    >
      <SignupForm />
    </AuthLayout>
  );
}
