import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Github, Loader2, Mail, LogOut, Package } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/authStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { loginCustomer, registerCustomer, getCustomerData } from "@/lib/shopify";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AuthDialog = ({ open, onOpenChange }: AuthDialogProps) => {
  const [isLogin, setIsLogin] = useState(true);
  
  // Fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const { accessToken, setToken, logout } = useAuthStore();
  const queryClient = useQueryClient();

  // Fetch customer profile if logged in
  const { data: customer, isLoading: isFetching } = useQuery({
    queryKey: ['customer', accessToken],
    queryFn: () => getCustomerData(accessToken!),
    enabled: !!accessToken && open, // Only fetch if we have a token and the modal is open
    retry: false, // If it fails, token is probably invalid
  });

  // Login Mutation
  const loginMutation = useMutation({
    mutationFn: () => loginCustomer(email, password),
    onSuccess: (authData) => {
      setToken(authData.accessToken, authData.expiresAt);
      toast.success("Welcome back!");
      setPassword("");
    },
    onError: (error: Error) => {
      toast.error("Authentication Failed", { description: error.message });
    }
  });

  // Register Mutation
  const registerMutation = useMutation({
    mutationFn: () => registerCustomer(email, password, firstName, lastName),
    onSuccess: async () => {
      toast.success("Account created successfully!");
      // Immediately log them in
      await loginMutation.mutateAsync();
    },
    onError: (error: Error) => {
      toast.error("Registration Failed", { description: error.message });
    }
  });

  const isLoading = loginMutation.isPending || registerMutation.isPending || (isFetching && !!accessToken);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      loginMutation.mutate(undefined, {
        onSuccess: () => onOpenChange(false)
      });
    } else {
      registerMutation.mutate(undefined, {
        onSuccess: () => setTimeout(() => onOpenChange(false), 500)
      });
    }
  };

  // Not logged in: Show Login/Register Form
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] p-8 border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden">
        <DialogHeader className="text-center sm:text-center pb-2">
          <div className="mx-auto w-12 h-12 bg-secondary rounded-full flex items-center justify-center mb-4">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-foreground" aria-label="Logo">
              <path d="M4 4l8 8-8 8V4z" />
              <path d="M12 4l8 8-8 8V4z" />
            </svg>
          </div>
          <DialogTitle className="font-display text-2xl tracking-tight">
            {isLogin ? "Welcome back" : "Create an account"}
          </DialogTitle>
          <DialogDescription className="text-[13px] pt-1.5 px-4 text-muted-foreground/80 leading-relaxed mx-auto max-w-[280px]">
            {isLogin 
              ? "Enter your credentials to access your saved items and order history." 
              : "Set up your Kryvo account to track orders and save favorites."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          {!isLogin && (
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
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : (isLogin ? "Sign In" : "Create Account")}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-[13px] text-muted-foreground">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button 
              onClick={() => setIsLogin(!isLogin)} 
              className="font-medium text-foreground hover:underline underline-offset-4 decoration-border"
              type="button"
            >
              {isLogin ? "Sign up" : "Log in"}
            </button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
