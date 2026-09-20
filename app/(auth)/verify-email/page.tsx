import { Metadata } from "next";
import { Suspense } from "react";
import VerifyEmailForm from "./_components/VerifyEmailForm";

export const metadata: Metadata = {
  title: "Verify Email | CloudShare",
  description: "Verify user email address",
};

export default function VerifyEmailPage() {
  return (
    <main>
      <Suspense fallback={<VerifyEmailFallback />}>
        <VerifyEmailForm />
      </Suspense>
    </main>
  );
}

function VerifyEmailFallback() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center text-white bg-[rgba(0,0,0,0.4)] absolute inset-0 z-50">
      <h1 className="relative z-10">Verify Email</h1>
      <p className="relative z-10">Loading…</p>
    </div>
  );
}
