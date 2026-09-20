"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, ArrowLeft, MailCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [submittedEmail, setSubmittedEmail] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit: SubmitHandler<ForgotPasswordFormData> = async (data) => {
    setIsSubmitting(true);
    setFormError(null);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      // The API responds with the same generic message whether or not the
      // email is registered (by design, to avoid leaking which emails
      // exist), so a 200 here always means "show the success state" —
      // never "we found your account".
      const resData = await res.json().catch(() => ({}));

      if (!res.ok) {
        setFormError(
          resData.error ?? "Something went wrong. Please try again.",
        );
        return;
      }

      setSubmittedEmail(data.email);
      setSubmitSuccess(true);
    } catch {
      setFormError(
        "Couldn't reach the server. Check your connection and try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="text-center animate-in fade-in slide-in-from-bottom-4">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
          <MailCheck className="h-6 w-6 text-blue-600" />
        </div>

        <h3 className="mb-2 text-xl font-semibold text-slate-900">
          Check your email
        </h3>

        <p className="mb-2 text-sm text-slate-600">
          If an account exists for{" "}
          <span className="font-medium">{submittedEmail}</span>, we&apos;ve sent
          a password reset link. Click it to choose a new password.
        </p>

        <p className="mb-6 text-xs text-slate-500">
          The link expires in 30 minutes. Don&apos;t see it? Check your spam
          folder.
        </p>

        <div className="space-y-2">
          <Link href="/login">
            <Button variant="outline" className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to login
            </Button>
          </Link>

          <button
            type="button"
            onClick={() => setSubmitSuccess(false)}
            className="text-sm font-medium text-slate-500 hover:text-slate-700 hover:underline"
          >
            Use a different email
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 animate-in fade-in slide-in-from-bottom-4"
    >
      {formError && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {formError}
        </div>
      )}

      <div className="space-y-2 text-start">
        <Label htmlFor="email">Email address</Label>

        <Input
          id="email"
          type="email"
          placeholder="name@example.com"
          error={errors.email?.message}
          {...register("email")}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending link...
          </>
        ) : (
          "Send reset link"
        )}
      </Button>

      <div className="mt-6 text-center">
        <Link
          href="/login"
          className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to login
        </Link>
      </div>
    </form>
  );
}
