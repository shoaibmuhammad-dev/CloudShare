"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

type Status = "verifying" | "success" | "error";

export default function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<Status>("verifying");
  const [errorMessage, setErrorMessage] = useState("");
  // Guards against React 18 Strict Mode / re-renders firing the request twice.
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    if (!token) {
      setStatus("error");
      setErrorMessage("This verification link is missing a token.");
      return;
    }

    async function verify() {
      try {
        const res = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        const data = await res.json();

        if (!res.ok) {
          setStatus("error");
          setErrorMessage(data.error ?? "This link is invalid or has expired.");
          return;
        }

        setStatus("success");
        // Session cookie is already set by the API route — brief pause so
        // the success state is visible, then send them into the app.
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      } catch {
        setStatus("error");
        setErrorMessage("Something went wrong. Please try again.");
      }
    }

    verify();
  }, [token, router]);

  if (status === "verifying") {
    return (
      <div>
        <h1>Verify Email</h1>
        <p>Verifying your email address…</p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div>
        <h1>Email verified</h1>
        <p>You're all set. Taking you to your dashboard…</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Verification failed</h1>
      <p>{errorMessage}</p>
      <p>
        <Link href="/login">Back to login</Link>
        {" · "}
        <Link href="/resend-verification">Resend verification email</Link>
      </p>
    </div>
  );
}
