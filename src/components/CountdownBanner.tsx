"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";

export function CountdownBanner() {
  const [timeLeft, setTimeLeft] = useState(2 * 60 * 60 + 45 * 60 + 12);
  const [isVisible, setIsVisible] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Hide if dismissed, or on product detail pages and checkout
  if (!isVisible || pathname.startsWith("/products/") || pathname.startsWith("/checkout")) return null;

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="bg-primary text-primary-foreground py-2 px-10 text-center text-[11px] sm:text-sm font-bold tracking-wider animate-slide-down shadow-md z-50 relative flex justify-center items-center">
      <div>
        ⚡ FLASH SALE: 50% OFF ENDS IN{" "}
        <span className="inline-block min-w-[70px] font-mono text-xs sm:text-base bg-black/20 px-1.5 sm:px-2 py-0.5 rounded ml-1">
          {String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </span>
      </div>
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute right-3 p-1 rounded-full hover:bg-black/10 transition-colors"
        aria-label="Close offer"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
