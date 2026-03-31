"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  resetCustomerPassword,
  resetCustomerPasswordByUrl,
} from "@/lib/shopify";
import { useAuthStore } from "@/stores/authStore";

/**
 * Password reset from Shopify email: path /account/reset/[id]/[token] or
 * query ?id=&token= or ?reset_url= (full URL from email, encoded).
 */
export default function ResetPassword() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const setToken = useAuthStore((s) => s.setToken);

  const parts = params.parts as string[] | undefined;

  const { customerId, resetToken, resetUrl } = useMemo(() => {
    let id = parts?.[0];
    let token = parts?.[1];
    if (!id) id = searchParams.get("id") ?? undefined;
    if (!token) token = searchParams.get("token") ?? undefined;

    const raw =
      searchParams.get("reset_url") ??
      searchParams.get("url") ??
      undefined;
    let url: string | undefined;
    if (raw) {
      try {
        url = decodeURIComponent(raw);
      } catch {
        url = raw;
      }
    }

    return {
      customerId: id,
      resetToken: token,
      resetUrl: url,
    };
  }, [parts, searchParams]);

  const canResetByUrl = Boolean(resetUrl);
  const canResetById =
    Boolean(customerId && resetToken) && !canResetByUrl;

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const mutation = useMutation({
    mutationFn: async () => {
      if (password.length < 5) {
        throw new Error("Password must be at least 5 characters.");
      }
      if (password !== passwordConfirm) {
        throw new Error("Passwords do not match.");
      }
      if (canResetByUrl && resetUrl) {
        return resetCustomerPasswordByUrl(resetUrl, password);
      }
      if (canResetById && customerId && resetToken) {
        return resetCustomerPassword(customerId, resetToken, password);
      }
      throw new Error("Invalid or expired reset link.");
    },
    onSuccess: (data) => {
      const t = data.customerAccessToken;
      setToken(t.accessToken, t.expiresAt);
      toast.success("Password updated", {
        description: "You are signed in with your new password.",
      });
      router.push("/account");
      router.refresh();
    },
    onError: (e: Error) => {
      toast.error("Reset failed", { description: e.message });
    },
  });

  const invalidLink = !canResetByUrl && !canResetById;

  if (invalidLink) {
    return (
      <div className="min-h-screen bg-background pt-[120px] pb-24 px-4">
        <div className="container mx-auto max-w-md">
          <h1 className="font-display text-2xl font-medium mb-3">
            Link invalid or expired
          </h1>
          <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
            Request a new password reset link. If you opened this page from an
            old email, use the latest message from us.
          </p>
          <Button asChild className="rounded-full">
            <Link href="/account/forgot-password">Forgot password</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-[120px] pb-24 px-4">
      <div className="container mx-auto max-w-md">
        <h1 className="font-display text-2xl font-medium mb-2">
          Set a new password
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          Choose a strong password you have not used elsewhere.
        </p>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate();
          }}
        >
          <Input
            type="password"
            autoComplete="new-password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 rounded-xl"
            required
            minLength={5}
          />
          <Input
            type="password"
            autoComplete="new-password"
            placeholder="Confirm password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            className="h-12 rounded-xl"
            required
            minLength={5}
          />
          <Button
            type="submit"
            disabled={mutation.isPending}
            className="w-full h-12 rounded-full"
          >
            {mutation.isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "Update password"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
