"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Loader2, CheckCircle2, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Mirrors the password rules enforced server-side in lib/validations/auth.ts —
// keeping these in sync means the user hits the same rule at both layers
// instead of passing client validation and then getting a confusing 400.
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[a-z]/, "Include at least one lowercase letter")
  .regex(/[A-Z]/, "Include at least one uppercase letter")
  .regex(/[0-9]/, "Include at least one number");

const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
type TokenStatus = "checking" | "valid" | "invalid";

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [tokenStatus, setTokenStatus] = useState<TokenStatus>("checking");
  const [tokenError, setTokenError] = useState<string>("");

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // Validate the token as soon as the page loads, before showing the form
  // at all — no point letting someone fill out a form for a dead link.
  useEffect(() => {
    if (!token) {
      setTokenStatus("invalid");
      setTokenError("This password reset link is missing a token.");
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(
          `/api/auth/reset-password?token=${encodeURIComponent(token)}`,
        );
        const data = await res.json().catch(() => ({}));

        if (cancelled) return;

        if (res.ok && data.valid) {
          setTokenStatus("valid");
        } else {
          setTokenStatus("invalid");
          setTokenError(
            data.error ?? "This reset link is invalid or has expired.",
          );
        }
      } catch {
        if (!cancelled) {
          setTokenStatus("invalid");
          setTokenError(
            "Couldn't verify this link. Check your connection and try again.",
          );
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token]);

  const onSubmit: SubmitHandler<ResetPasswordFormData> = async (data) => {
    if (!token) return;

    setIsSubmitting(true);
    setFormError(null);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: data.password }),
      });

      const resData = await res.json().catch(() => ({}));

      if (!res.ok) {
        const message =
          resData.error ?? "Something went wrong. Please try again.";
        setFormError(message);

        // The token can expire in the gap between page load and submit —
        // if that's what happened, drop into the "invalid link" state
        // instead of just leaving them stuck retrying a dead token.
        if (/invalid|expired/i.test(message)) {
          setTokenStatus("invalid");
          setTokenError(message);
        }
        return;
      }

      setSubmitSuccess(true);
    } catch {
      setFormError(
        "Couldn't reach the server. Check your connection and try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (tokenStatus === "checking") {
    return (
      <div className="flex flex-col items-center gap-3 py-6 text-center animate-in fade-in">
        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
        <p className="text-sm text-slate-600">Validating your reset link…</p>
      </div>
    );
  }

  if (tokenStatus === "invalid") {
    return (
      <div className="text-center animate-in fade-in slide-in-from-bottom-4">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <XCircle className="h-6 w-6 text-red-600" />
        </div>

        <h3 className="mb-2 text-xl font-semibold text-slate-900">
          Link expired
        </h3>

        <p className="mb-6 text-sm text-slate-600">{tokenError}</p>

        <Link href="/forgot-password">
          <Button className="w-full">Request a new link</Button>
        </Link>
      </div>
    );
  }

  if (submitSuccess) {
    return (
      <div className="text-center animate-in fade-in slide-in-from-bottom-4">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="h-6 w-6 text-green-600" />
        </div>

        <h3 className="mb-2 text-xl font-semibold text-slate-900">
          Password reset
        </h3>

        <p className="mb-6 text-sm text-slate-600">
          Your password has been successfully reset. You can now log in with
          your new password.
        </p>

        <Link href="/login">
          <Button className="w-full">Continue to login</Button>
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 animate-in fade-in slide-in-from-bottom-4"
    >
      {formError && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {formError}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="password">New Password</Label>

        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            error={errors.password?.message}
            {...register("password")}
          />

          <button
            type="button"
            className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 focus:outline-none"
            onClick={() => setShowPassword((prev) => !prev)}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}

            <span className="sr-only">
              {showPassword ? "Hide password" : "Show password"}
            </span>
          </button>
        </div>

        <p className="text-xs text-slate-500">
          At least 8 characters, with an uppercase letter, a lowercase letter,
          and a number.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm New Password</Label>

        <Input
          id="confirmPassword"
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />
      </div>

      <Button type="submit" className="mt-6 w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Resetting password...
          </>
        ) : (
          "Reset password"
        )}
      </Button>
    </form>
  );
}
