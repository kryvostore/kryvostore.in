"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  MapPin,
  Phone,
  Mail,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Footer = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    // Simulate API call for newsletter subscription
    setTimeout(() => {
      setStatus("success");
      setEmail("");

      // Reset success message after 5 seconds
      setTimeout(() => {
        setStatus("idle");
      }, 5000);
    }, 1500);
  };

  return (
    <footer className=" pt-16 pb-8">
      <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
        {/* Newsletter — secondary surface, tonal depth (no 1px section borders) */}
        <div className="rounded-2xl p-10 lg:p-20 text-center mb-24 lg:mb-32 relative overflow-hidden bg-surface-container-highest/50">
          <div className="relative z-10 w-full flex flex-col items-center">
            <h2 className="font-display text-3xl lg:text-[3.25rem] font-semibold leading-[1.2] mb-6 tracking-tight text-on-surface">
              The editorial list
              <br />
              <span className="text-on-primary-container">
                New arrivals & offers
              </span>
            </h2>
            <p className="text-on-surface-variant mb-10 max-w-[650px] mx-auto text-sm leading-relaxed">
              Occasional notes on restocks, curated picks, and subscriber-only
              perks.
            </p>
            <form
              onSubmit={handleSubscribe}
              className="w-full max-w-[480px] mx-auto"
            >
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-0 bg-surface-container-lowest rounded-xl p-2 w-full transition-all focus-within:outline focus-within:outline-2 focus-within:outline-editorial-outline">
                <Input
                  type="email"
                  required
                  disabled={status === "loading" || status === "success"}
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent h-[46px] px-6 shadow-none flex-1 text-[15px] rounded-xl placeholder:text-on-surface-variant/70 disabled:opacity-50"
                />
                <Button
                  type="submit"
                  disabled={
                    status === "loading" || status === "success" || !email
                  }
                  className="rounded-md h-[48px] px-8 font-medium text-[14px] shrink-0 transition-all duration-[200ms] active:scale-[0.97]"
                >
                  {status === "loading" ? (
                    <Loader2 className="h-4 w-4 animate-spin my-0.5 mx-4" />
                  ) : status === "success" ? (
                    "Subscribed!"
                  ) : (
                    "Subscribe"
                  )}
                </Button>
              </div>

              <div className="mt-4 h-6 flex items-center justify-center overflow-hidden">
                {status === "success" && (
                  <p className="text-on-primary-container text-[14px] font-medium flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <CheckCircle2 className="w-4 h-4" /> You're on the list.
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          {/* Brand & Socials */}
          <div className="space-y-6">
            <Link
              href="/"
              className="flex items-center gap-3 font-display text-2xl font-bold tracking-tight group"
            >
              <span className="text-on-surface pt-0.5">KRYVO</span>
            </Link>
            <p className="text-[14px] text-on-surface-variant leading-relaxed max-w-xs">
              Curated products with the care of a gallery — quality, clarity,
              and calm shopping.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="#"
                className="h-10 w-10 flex items-center justify-center rounded-full bg-surface-container-high text-on-surface hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                <Facebook className="h-[18px] w-[18px]" />
              </a>
              <a
                href="#"
                className="h-10 w-10 flex items-center justify-center rounded-full bg-surface-container-high text-on-surface hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                <Twitter className="h-[18px] w-[18px]" />
              </a>
              <a
                href="https://www.instagram.com/kryvostore.in?igsh=bHY2aXo4ajYwMnMy"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 flex items-center justify-center rounded-full bg-surface-container-high text-on-surface hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                <Instagram className="h-[18px] w-[18px]" />
              </a>
              <a
                href="#"
                className="h-10 w-10 flex items-center justify-center rounded-full bg-surface-container-high text-on-surface hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                <Linkedin className="h-[18px] w-[18px]" />
              </a>
            </div>
          </div>

          {/* Pages */}
          <div>
            <h4 className="font-semibold text-lg mb-6 tracking-tight">Pages</h4>
            <div className="flex flex-col gap-3.5">
              <Link
                href="/"
                className="text-[14px] text-muted-foreground/80 hover:text-foreground hover:translate-x-1 transition-all duration-200"
              >
                Home
              </Link>
              <Link
                href="/collections"
                className="text-[14px] text-muted-foreground/80 hover:text-foreground hover:translate-x-1 transition-all duration-200"
              >
                Shop
              </Link>
              <Link
                href="/cart"
                className="text-[14px] text-muted-foreground/80 hover:text-foreground hover:translate-x-1 transition-all duration-200"
              >
                Cart
              </Link>
              <Link
                href="/about"
                className="text-[14px] text-muted-foreground/80 hover:text-foreground hover:translate-x-1 transition-all duration-200"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-[14px] text-muted-foreground/80 hover:text-foreground hover:translate-x-1 transition-all duration-200"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* About */}
          <div>
            <h4 className="font-semibold text-lg mb-6 tracking-tight">About</h4>
            <div className="flex flex-col gap-3.5">
              <Link
                href="/contact"
                className="text-[14px] text-muted-foreground/80 hover:text-foreground hover:translate-x-1 transition-all duration-200"
              >
                Contact & FAQ
              </Link>
              <a
                href="https://wa.me/919061061442"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[14px] text-muted-foreground/80 hover:text-foreground hover:translate-x-1 transition-all duration-200"
              >
                WhatsApp
              </a>
              <Link
                href="/collections"
                className="text-[14px] text-muted-foreground/80 hover:text-foreground hover:translate-x-1 transition-all duration-200"
              >
                Product
              </Link>
              <Link
                href="/track-order"
                className="text-[14px] text-muted-foreground/80 hover:text-foreground hover:translate-x-1 transition-all duration-200"
              >
                Track order
              </Link>
            </div>
          </div>

          {/* Contact Us */}
          <div>
            <h4 className="font-semibold text-lg mb-6 tracking-tight">
              Contact Us
            </h4>
            <div className="flex flex-col gap-5">
              <div className="flex items-start gap-3.5 text-[14px] text-muted-foreground/90 leading-relaxed group">
                <div className="mt-0.5 h-9 w-9 shrink-0 rounded-full bg-secondary/80 flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-colors duration-300">
                  <MapPin className="h-[16px] w-[16px]" />
                </div>
                <span className="pt-1.5">Kuttikkatoor, Kozhikode, Kerala</span>
              </div>
              <div className="flex items-start gap-3.5 text-[14px] text-muted-foreground/90 leading-relaxed group">
                <div className="mt-0.5 h-9 w-9 shrink-0 rounded-full bg-secondary/80 flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-colors duration-300">
                  <Phone className="h-[16px] w-[16px]" />
                </div>
                <div className="flex flex-col pt-1.5 gap-1">
                  <a
                    href="tel:+919061061442"
                    className="hover:text-foreground transition-colors"
                  >
                    +91 90610 61442
                  </a>
                  <a
                    href="tel:+919605655712"
                    className="hover:text-foreground transition-colors"
                  >
                    +91 96056 55712
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3.5 text-[14px] text-muted-foreground/90 leading-relaxed group">
                <div className="h-9 w-9 shrink-0 rounded-full bg-secondary/80 flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-colors duration-300">
                  <Mail className="h-[16px] w-[16px]" />
                </div>
                <a
                  href="mailto:kryvostore.in@gmail.com"
                  className="hover:text-foreground transition-colors"
                >
                  kryvostore.in@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright — spacing separation, no hairline rule */}
        <div className="pt-12 mt-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[13px] text-on-surface-variant font-light">
            © {new Date().getFullYear()} KRYVO. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-2">
            <Link
              href="/terms"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms of service
            </Link>
            <Link
              href="/privacy"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy policy
            </Link>
            <Link
              href="/refund"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Return & refund policy
            </Link>
            <Link
              href="/shipping"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Shipping policy
            </Link>
            <Link
              href="/contact-information"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact information
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
