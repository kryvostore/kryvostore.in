import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export const WhatsAppButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const phoneNumber = "9061061442";
  const message = "Hi Kryvo Store, I need some help!";

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const handleClick = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <div
      className={`fixed bottom-3 right-4 md:bottom-6 md:right-6 z-50 transition-all duration-500 ease-out transform ${
        isVisible
          ? "translate-y-0 opacity-100 scale-100"
          : "translate-y-10 opacity-0 scale-95 pointer-events-none"
      }`}
    >
      <div className="relative group">
        {/* Tooltip */}
        <div className="absolute -top-12 right-0 w-max px-3 py-1.5 bg-foreground text-background text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-lg">
          Chat with us
          <div className="absolute -bottom-1 right-6 w-2 h-2 bg-foreground rotate-45"></div>
        </div>

        <Button
          onClick={handleClick}
          size="icon"
          className="md:w-16 md:h-16 w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-xl shadow-[#25D366]/20 transition-transform active:scale-95 group-hover:-translate-y-1"
        >
          <svg
            viewBox="0 0 24 24"
            width="40"
            height="40"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white"
          >
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
        </Button>
      </div>
    </div>
  );
};
