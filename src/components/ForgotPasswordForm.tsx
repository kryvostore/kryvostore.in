"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

type ForgotPasswordFormProps = {
  /** Dialog: go back to sign-in. Page: omit and use `backHref` instead. */
  onBack?: () => void;
  /** Standalone page: link target for “back” (e.g. /collections). */
  backHref?: string;
  /** Called after a successful recover request (e.g. close dialog). */
  onSent?: () => void;
};

export function ForgotPasswordForm({
  onBack,
  backHref,
  onSent,
}: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("");

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/auth/recover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }
    },
    onSuccess: () => {
      toast.success("Check your email", {
        description:
          "If an account exists for that address, Shopify will send a link to reset your password.",
      });
      onSent?.();
    },
    onError: (e: Error) => {
      toast.error("Could not complete request", { description: e.message });
    },
  });

  const backControl =
    backHref != null ? (
      <Link
        href={backHref}
        className="inline-flex items-center gap-2 text-[13px] text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Link>
    ) : onBack ? (
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-[13px] text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to sign in
      </button>
    ) : null;

  return (
    <div className="space-y-4">
      {backControl}
      <p className="text-[13px] text-muted-foreground leading-relaxed">
        Enter the email you use for your account. We will send you a link to
        choose a new password.
      </p>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          mutation.mutate();
        }}
      >
        <Input
          type="email"
          autoComplete="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-12 bg-secondary/30 border-border/50 text-[14px] px-4 rounded-xl focus-visible:ring-1 focus-visible:ring-foreground"
          required
        />
        <Button
          type="submit"
          disabled={mutation.isPending}
          className="w-full h-12 rounded-full font-medium shadow-sm transition-transform active:scale-[0.98]"
        >
          {mutation.isPending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            "Send reset link"
          )}
        </Button>
      </form>
    </div>
  );
}
