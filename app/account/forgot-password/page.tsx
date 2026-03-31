import type { Metadata } from "next";
import Link from "next/link";
import { ForgotPasswordForm } from "@/components/ForgotPasswordForm";
import { getSiteUrl } from "@/lib/site";

const canonical = `${getSiteUrl()}/account/forgot-password`;

export const metadata: Metadata = {
  title: "Forgot password",
  description: "Request a link to reset your KRYVO account password.",
  robots: { index: false, follow: true },
  alternates: { canonical },
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-background pt-[120px] pb-24 px-4">
      <div className="container mx-auto max-w-md">
        <h1 className="font-display text-2xl font-medium mb-2">Forgot password</h1>
        <p className="text-sm text-muted-foreground mb-8">
          We will email you a link to reset your password.
        </p>
        <ForgotPasswordForm backHref="/collections" />
        <p className="mt-10 text-center text-[13px] text-muted-foreground">
          <Link
            href="/collections"
            className="font-medium text-foreground underline underline-offset-4"
          >
            Continue shopping
          </Link>
        </p>
      </div>
    </div>
  );
}
