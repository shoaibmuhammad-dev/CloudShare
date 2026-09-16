import { AuthLayout } from "@/components/layout/AuthLayout";
import { ResetPasswordForm } from "./_components/ResetPasswordForm";

export const metadata = {
  title: "Set New Password | CloudShare",
  description: "Set a new password for your CloudShare account.",
};

export default function ResetPasswordPage() {
  return (
    <AuthLayout
      title="Set new password"
      subtitle="Your new password must be different from previously used passwords."
    >
      <ResetPasswordForm />
    </AuthLayout>
  );
}
