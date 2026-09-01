"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, MapPin, Search, SlidersHorizontal, ShoppingCart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";
import { useLocation } from "@/context/LocationContext";

export function Header() {
  const { cartCount } = useCart();
  const { location, setIsModalOpen } = useLocation();
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Hide on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY > lastScrollY && currentY > 120) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      setLastScrollY(currentY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Don't render the header on product detail pages or checkout
  if (pathname.startsWith("/products/") || pathname.startsWith("/checkout")) return null;

  return (
    <header
      className={`sticky top-0 z-40 w-full bg-background/95 backdrop-blur-xl border-b border-border/40 transition-all duration-400 ease-in-out ${
        hidden ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
      }`}
    >
      <div className="pt-safe pt-3 pb-4 px-4 sm:px-6">
        {/* Top Row: Location + Actions */}
        <div className="flex justify-between items-center mb-4 max-w-7xl mx-auto">
          <button className="text-left flex flex-col group" onClick={() => setIsModalOpen(true)}>
            <p className="text-[10px] text-muted-foreground uppercase font-extrabold tracking-wider mb-0.5 group-hover:text-primary transition-colors">Delivery To</p>
            <div className="flex items-center gap-1.5 font-bold text-sm text-foreground">
              <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="truncate max-w-[180px] sm:max-w-[250px]">
                {location.isSet ? `${location.pincode} – ${location.city}` : 'Add Pincode'}
              </span>
              <span className="text-[9px] text-muted-foreground ml-0.5">▼</span>
            </div>
          </button>

          <div className="flex items-center gap-2.5">
            <button className="bg-muted/50 hover:bg-muted p-2.5 rounded-full relative text-foreground transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-primary rounded-full ring-2 ring-background"></span>
            </button>
            <Link href="/cart" className="bg-muted/50 hover:bg-muted p-2.5 rounded-full relative text-foreground transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-background shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex gap-2.5 max-w-7xl mx-auto">
          <div className="relative flex-1 group">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              className="w-full h-12 pl-11 pr-4 bg-muted/40 hover:bg-muted/60 focus:bg-background text-foreground rounded-2xl border border-transparent focus:border-primary/20 focus:ring-4 focus:ring-primary/10 shadow-inner shadow-black/5 transition-all text-sm font-medium placeholder:text-muted-foreground/70"
              placeholder="Search for smartwatches, clothes..."
            />
          </div>
          <button className="h-12 w-12 bg-primary/10 hover:bg-primary/20 text-primary rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors">
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
