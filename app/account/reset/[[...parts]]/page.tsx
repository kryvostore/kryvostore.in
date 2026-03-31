import type { Metadata } from "next";
import { Suspense } from "react";
import ResetPassword from "@/views/ResetPassword";
import { getSiteUrl } from "@/lib/site";

const canonical = `${getSiteUrl()}/account/reset`;

export const metadata: Metadata = {
  title: "Reset password",
  description: "Set a new password for your KRYVO account.",
  robots: { index: false, follow: true },
  alternates: { canonical },
};

function ResetFallback() {
  return (
    <div className="min-h-screen bg-background pt-[120px] pb-24 px-4">
      <div className="container mx-auto max-w-md">
        <div className="h-8 w-48 rounded-md bg-muted animate-pulse mb-4" />
        <div className="h-4 w-full rounded-md bg-muted/80 animate-pulse" />
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetFallback />}>
      <ResetPassword />
    </Suspense>
  );
}
