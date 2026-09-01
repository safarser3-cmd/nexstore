"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Heart, ShoppingBag, MessageSquare, User } from "lucide-react";
import { useCart } from "@/context/CartContext";

export function BottomNav() {
  const pathname = usePathname();
  const { cartCount } = useCart();

  const navItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Heart, label: "Wishlist", href: "/wishlist" },
    { icon: ShoppingBag, label: "Cart", href: "/cart" },
    { icon: MessageSquare, label: "Chat", href: "/chat" },
    { icon: User, label: "Profile", href: "/profile" },
  ];

  // Hide bottom nav on checkout page to avoid overlapping the payment forms
  if (pathname.startsWith("/checkout")) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-xl border-t border-border/40 px-6 pt-1.5 pb-2 rounded-t-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.04)]">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center gap-1 p-2 transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
            >
              <div className="relative">
                <item.icon className={`w-6 h-6 ${isActive ? 'fill-primary/20' : ''}`} />
                {isActive && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full"></span>
                )}
                {/* Cart Badge */}
                {item.label === "Cart" && cartCount > 0 && (
                  <span className="absolute -top-1 -right-2 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
