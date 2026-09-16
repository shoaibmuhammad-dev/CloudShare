import { AuthLayout } from "@/components/layout/AuthLayout";
import { LoginForm } from "./_components/LoginForm";

export const metadata = {
  title: "Sign In | CloudShare",
  description: "Sign in to your CloudShare account to access your files.",
};

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Enter your credentials to access your account"
    >
      <LoginForm />
    </AuthLayout>
  );
}
