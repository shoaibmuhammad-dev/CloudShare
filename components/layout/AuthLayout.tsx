import Link from "next/link";
import { Cloud, Shield, Zap, Users } from "lucide-react";
import React from "react";

export function AuthLayout({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string | null;
  subtitle: string | null;
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white">
      {/* Left side: Form */}
      <div className="flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:max-w-md flex flex-col items-center lg:items-start text-center lg:text-left">
          <Link href="/" className="flex items-center gap-2 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-sm shadow-blue-200">
              <Cloud className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              CloudShare
            </span>
          </Link>

          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-2 text-sm text-slate-600 mb-4">{subtitle}</p>
          )}

          <div className="w-full mt-4">{children}</div>
        </div>
      </div>

      {/* Right side: Illustration/Features */}
      <div className="hidden lg:flex flex-col justify-center bg-gray-50 border-l border-slate-100 p-12 lg:p-24 relative overflow-hidden">
        {/* Decorative background shapes */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-blue-100 opacity-50 blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-indigo-100 opacity-50 blur-3xl" />

        <div className="relative z-10 max-w-lg">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">
            Secure, fast, and reliable file sharing.
          </h3>
          <p className="text-slate-600 mb-6 text-base leading-[1.35]">
            Join thousands of teams who trust CloudShare to manage their files,
            collaborate seamlessly, and maintain enterprise-grade security.
          </p>

          <div className="space-y-6">
            <FeatureItem
              icon={Shield}
              title="Enterprise-grade security"
              description="Your files are encrypted at rest and in transit."
            />
            <FeatureItem
              icon={Zap}
              title="Lightning fast sharing"
              description="Share large files instantly with customizable links."
            />
            <FeatureItem
              icon={Users}
              title="Collaborate seamlessly"
              description="Work together with your team in real-time."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({
  icon: Icon,
  title,
  description,
}: {
  icon: any;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white shadow border border-slate-100 text-blue-600">
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <h4 className="text-base font-semibold text-slate-900">{title}</h4>
        <p className="text-sm text-slate-500 mt-1">{description}</p>
      </div>
    </div>
  );
}
