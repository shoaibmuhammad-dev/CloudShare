import { AuthLayout } from "@/components/layout/AuthLayout";
import { ForgotPasswordForm } from "./_components/ForgotPasswordForm";

export const metadata = {
  title: "Forgot Password | CloudShare",
  description: "Reset your CloudShare account password.",
};

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="Reset password"
      subtitle="Enter your email and we'll send you a link to reset your password."
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
