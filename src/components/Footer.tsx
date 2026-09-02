"use client";

import Link from "next/link";
import { ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();

  if (pathname === "/checkout" || pathname.startsWith("/checkout/")) {
    return null;
  }

  return (
    <footer className="bg-[#0F172A] text-slate-300 mt-20 border-t border-slate-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <img src="/logo.png" alt="Nexa Store" className="h-12 w-auto object-contain rounded-lg" />
            </Link>
            <p className="text-slate-400 text-sm">
              Premium quality products designed for the modern lifestyle. Fast shipping and exceptional customer service.
            </p>
            <div className="flex gap-2 mt-4 opacity-70 grayscale hover:grayscale-0 transition-all duration-300">
              <div className="bg-white p-1 rounded">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/200px-Visa_Inc._logo.svg.png" alt="Visa" className="h-4 object-contain" />
              </div>
              <div className="bg-white p-1 rounded">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/200px-Mastercard-logo.svg.png" alt="Mastercard" className="h-4 object-contain" />
              </div>
              <div className="bg-white p-1 px-2 rounded flex items-center justify-center font-bold text-black text-xs">
                UPI
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products" className="hover:text-primary transition-colors">All Products</Link></li>
              <li><Link href="/categories/electronics" className="hover:text-primary transition-colors">Electronics</Link></li>
              <li><Link href="/categories/clothing" className="hover:text-primary transition-colors">Clothing</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link href="/track" className="hover:text-primary transition-colors">Track Order</Link></li>
              <li><Link href="/shipping" className="hover:text-primary transition-colors">Shipping Policy</Link></li>
              <li><Link href="/returns" className="hover:text-primary transition-colors">Returns</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} Nexa Store. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="cursor-pointer hover:text-white">Instagram</span>
            <span className="cursor-pointer hover:text-white">Twitter</span>
            <span className="cursor-pointer hover:text-white">Facebook</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
