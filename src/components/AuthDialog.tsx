import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/authStore";
import { useMutation } from "@tanstack/react-query";
import {
  loginCustomer,
  registerCustomer,
} from "@/lib/shopify";
import { ForgotPasswordForm } from "@/components/ForgotPasswordForm";
import { SITE_NAME_SHORT } from "@/lib/seo/config";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type AuthView = "login" | "register" | "forgot";

function isEmailVerificationPending(message: string): boolean {
  const text = message.toLowerCase();
  return (
    text.includes("verify your email") ||
    text.includes("we have sent an email")
  );
}

function celebrateSignup() {
  const count = 160;
  const defaults = { origin: { y: 0.72 }, zIndex: 9999 };

  function fire(particleRatio: number, opts: Record<string, unknown>) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
      spread: 76,
      startVelocity: 38,
      colors: ["#6366f1", "#a855f7", "#ec4899", "#fbbf24", "#38bdf8"],
    });
  }

  fire(0.25, { spread: 26, startVelocity: 55 });
  fire(0.2, { spread: 60 });
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
  fire(0.1, { spread: 120, startVelocity: 45 });
}

export const AuthDialog = ({ open, onOpenChange }: AuthDialogProps) => {
  const [view, setView] = useState<AuthView>("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const { setToken } = useAuthStore();
  const router = useRouter();

  const goToAccount = useCallback(() => {
    onOpenChange(false);
    router.push("/account");
    router.refresh();
  }, [onOpenChange, router]);

  useEffect(() => {
    if (!open) {
      setView("login");
      setPassword("");
    }
  }, [open]);

  const loginMutation = useMutation({
    mutationFn: () => loginCustomer(email, password),
    onSuccess: (authData) => {
      setToken(authData.accessToken, authData.expiresAt);
      toast.success("Welcome back!");
      setPassword("");
      goToAccount();
    },
    onError: (error: Error) => {
      toast.error("Authentication Failed", { description: error.message });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async () => {
      await registerCustomer(email, password, firstName, lastName);
      return loginCustomer(email, password);
    },
    onSuccess: (authData) => {
      setToken(authData.accessToken, authData.expiresAt);
      celebrateSignup();
      toast.success("You're in!", {
        description: `Your ${SITE_NAME_SHORT} account is ready.`,
      });
      setPassword("");
      window.setTimeout(() => goToAccount(), 420);
    },
    onError: (error: Error) => {
      if (isEmailVerificationPending(error.message)) {
        toast.success("Check your email", {
          description: "We sent a verification link. Open it, then sign in.",
        });
        return;
      }
      toast.error("Registration Failed", { description: error.message });
    },
  });

  const isLoading =
    loginMutation.isPending || registerMutation.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (view === "login") {
      loginMutation.mutate();
    } else if (view === "register") {
      registerMutation.mutate();
    }
  };

  const title =
    view === "forgot"
      ? "Forgot password"
      : view === "login"
        ? "Welcome back"
        : "Create an account";

  const description =
    view === "forgot"
      ? "We will email you a link to reset your password."
      : view === "login"
        ? "Enter your credentials to access your saved items and order history."
        : `Set up your ${SITE_NAME_SHORT} account to track orders and save favorites.`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] p-8 border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden">
        <DialogHeader className="text-center sm:text-center pb-2">
          <div className="mx-auto mb-4 flex h-14 items-center justify-center rounded-2xl border border-border/60 bg-secondary/40 px-6">
            <span className="font-display text-2xl font-semibold tracking-[0.12em] text-foreground">
              {SITE_NAME_SHORT}
            </span>
          </div>
          <DialogTitle className="font-display text-2xl tracking-tight">
            {title}
          </DialogTitle>
          <DialogDescription className="text-[13px] pt-1.5 px-4 text-muted-foreground/80 leading-relaxed mx-auto max-w-[280px]">
            {description}
          </DialogDescription>
        </DialogHeader>

        {view === "forgot" ? (
          <div className="pt-4">
            <ForgotPasswordForm
              onBack={() => setView("login")}
              onSent={() => onOpenChange(false)}
            />
            <p className="mt-6 text-center text-[12px] text-muted-foreground">
              <Link
                href="/account/forgot-password"
                className="underline underline-offset-4 hover:text-foreground"
              >
                Open full page
              </Link>
            </p>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              {view === "register" && (
                <div className="grid grid-cols-2 gap-3 space-y-0">
                  <Input
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="h-12 bg-secondary/30 border-border/50 text-[14px] px-4 rounded-xl focus-visible:ring-1 focus-visible:ring-foreground"
                    required
                  />
                  <Input
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="h-12 bg-secondary/30 border-border/50 text-[14px] px-4 rounded-xl focus-visible:ring-1 focus-visible:ring-foreground"
                    required
                  />
                </div>
              )}
              <div className="space-y-2 w-full">
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 bg-secondary/30 border-border/50 text-[14px] px-4 rounded-xl focus-visible:ring-1 focus-visible:ring-foreground"
                  required
                />
              </div>
              <div className="space-y-2 pb-2">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-[13px] text-muted-foreground">
                    Password
                  </span>
                  {view === "login" && (
                    <button
                      type="button"
                      onClick={() => setView("forgot")}
                      className="text-[12px] font-medium text-foreground hover:underline underline-offset-4"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 bg-secondary/30 border-border/50 text-[14px] px-4 rounded-xl focus-visible:ring-1 focus-visible:ring-foreground"
                  required
                  minLength={5}
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 rounded-full font-medium shadow-sm transition-transform active:scale-[0.98]"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : view === "login" ? (
                  "Sign In"
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-[13px] text-muted-foreground">
                {view === "login"
                  ? "Don't have an account?"
                  : "Already have an account?"}{" "}
                <button
                  onClick={() =>
                    setView(view === "login" ? "register" : "login")
                  }
                  className="font-medium text-foreground hover:underline underline-offset-4 decoration-border"
                  type="button"
                >
                  {view === "login" ? "Sign up" : "Log in"}
                </button>
              </p>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
