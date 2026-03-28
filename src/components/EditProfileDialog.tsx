"use client";

import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useAuthStore } from "@/stores/authStore";
import { updateCustomerProfile } from "@/lib/shopify";

type ProfileSnapshot = {
	firstName: string | null;
	lastName: string | null;
	email: string | null;
	phone: string | null;
};

interface EditProfileDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	profile: ProfileSnapshot;
}

export const EditProfileDialog = ({
	open,
	onOpenChange,
	profile,
}: EditProfileDialogProps) => {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");

	const accessToken = useAuthStore((s) => s.accessToken);
	const setToken = useAuthStore((s) => s.setToken);
	const queryClient = useQueryClient();

	useEffect(() => {
		if (!open) return;
		setFirstName(profile.firstName?.trim() ?? "");
		setLastName(profile.lastName?.trim() ?? "");
		setEmail(profile.email?.trim() ?? "");
		setPhone(profile.phone?.trim() ?? "");
	}, [open, profile]);

	const mutation = useMutation({
		mutationFn: () =>
			updateCustomerProfile(accessToken!, {
				firstName,
				lastName,
				email,
				phone,
			}),
		onSuccess: (result) => {
			if (result.customerAccessToken?.accessToken) {
				setToken(
					result.customerAccessToken.accessToken,
					result.customerAccessToken.expiresAt,
				);
			}
			queryClient.invalidateQueries({ queryKey: ["customer"] });
			toast.success("Profile updated");
			onOpenChange(false);
		},
		onError: (err: Error) => {
			toast.error("Could not update profile", { description: err.message });
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!firstName.trim() || !lastName.trim() || !email.trim()) {
			toast.error("Please fill in your name and email.");
			return;
		}
		if (!accessToken) return;
		mutation.mutate();
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md rounded-[1.5rem] border-border/60">
				<DialogHeader>
					<DialogTitle className="font-display text-xl font-normal tracking-tight">
						Edit profile
					</DialogTitle>
					<DialogDescription className="text-[14px] text-muted-foreground">
						Update your name, email, and phone. Changes sync to your store
						account.
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-4 pt-2">
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="edit-first-name" className="text-xs uppercase tracking-wider">
								First name
							</Label>
							<Input
								id="edit-first-name"
								autoComplete="given-name"
								value={firstName}
								onChange={(e) => setFirstName(e.target.value)}
								disabled={mutation.isPending}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="edit-last-name" className="text-xs uppercase tracking-wider">
								Last name
							</Label>
							<Input
								id="edit-last-name"
								autoComplete="family-name"
								value={lastName}
								onChange={(e) => setLastName(e.target.value)}
								disabled={mutation.isPending}
							/>
						</div>
					</div>
					<div className="space-y-2">
						<Label htmlFor="edit-email" className="text-xs uppercase tracking-wider">
							Email
						</Label>
						<Input
							id="edit-email"
							type="email"
							autoComplete="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							disabled={mutation.isPending}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="edit-phone" className="text-xs uppercase tracking-wider">
							Phone
						</Label>
						<Input
							id="edit-phone"
							type="tel"
							autoComplete="tel"
							placeholder="+91 … (E.164 recommended)"
							value={phone}
							onChange={(e) => setPhone(e.target.value)}
							disabled={mutation.isPending}
						/>
						<p className="text-[12px] text-muted-foreground">
							Use international format (e.g. +919061061442). Leave blank to remove.
						</p>
					</div>
					<div className="flex justify-end gap-3 pt-2">
						<Button
							type="button"
							variant="outline"
							className="rounded-full"
							onClick={() => onOpenChange(false)}
							disabled={mutation.isPending}
						>
							Cancel
						</Button>
						<Button
							type="submit"
							className="rounded-full bg-foreground text-background min-w-[120px]"
							disabled={mutation.isPending}
						>
							{mutation.isPending ? (
								<Loader2 className="h-4 w-4 animate-spin" />
							) : (
								<>
									<Pencil className="h-4 w-4 mr-2" />
									Save
								</>
							)}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
};
