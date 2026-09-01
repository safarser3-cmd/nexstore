"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

export interface CartItem {
  productId: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  variantSelections?: Record<string, string>;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, variantSelections?: Record<string, string>) => void;
  updateQuantity: (productId: string, quantity: number, variantSelections?: Record<string, string>) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  appliedCoupon: string | null;
  couponDiscount: number;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem("nexa_cart");
    if (saved) {
      try {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        setItems(JSON.parse(saved));
      } catch (error) {
        console.error("Failed to parse cart");
      }
    }
    setIsInitialized(true);
  }, []);

  // Save to local storage
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("nexa_cart", JSON.stringify(items));
    }
  }, [items, isInitialized]);

  // Recalculate discount if cart changes
  const baseTotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  useEffect(() => {
    if (appliedCoupon === "SAVE20") {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      setCouponDiscount(Math.round(baseTotal * 0.2));
    } else if (appliedCoupon === "WELCOME500") {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      setCouponDiscount(baseTotal >= 1000 ? 500 : 0); // Only apply if total > 1000
    } else {
      setCouponDiscount(0);
    }
  }, [baseTotal, appliedCoupon]);

  const addItem = (newItem: CartItem) => {
    setItems((currentItems) => {
      // Check if exact variant already exists
      const existingIndex = currentItems.findIndex(
        (item) => item.productId === newItem.productId && JSON.stringify(item.variantSelections) === JSON.stringify(newItem.variantSelections)
      );

      if (existingIndex > -1) {
        const newItems = [...currentItems];
        newItems[existingIndex].quantity += newItem.quantity;
        toast.success(`Added another ${newItem.name} to cart`);
        return newItems;
      }
      
      toast.success(`Added ${newItem.name} to cart`);
      return [...currentItems, newItem];
    });
  };

  const removeItem = (productId: string, variantSelections?: Record<string, string>) => {
    setItems((currentItems) => currentItems.filter(
      (item) => !(item.productId === productId && JSON.stringify(item.variantSelections) === JSON.stringify(variantSelections))
    ));
  };

  const updateQuantity = (productId: string, quantity: number, variantSelections?: Record<string, string>) => {
    if (quantity <= 0) {
      removeItem(productId, variantSelections);
      return;
    }
    
    setItems((currentItems) => {
      const newItems = [...currentItems];
      const index = newItems.findIndex(
        (item) => item.productId === productId && JSON.stringify(item.variantSelections) === JSON.stringify(variantSelections)
      );
      if (index > -1) {
        newItems[index].quantity = quantity;
      }
      return newItems;
    });
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
    setCouponDiscount(0);
  };

  const applyCoupon = (code: string) => {
    const uppercaseCode = code.toUpperCase();
    if (uppercaseCode === "SAVE20") {
      setAppliedCoupon(uppercaseCode);
      return { success: true, message: "20% Discount applied!" };
    } else if (uppercaseCode === "WELCOME500") {
      if (baseTotal < 1000) {
        return { success: false, message: "Minimum cart value must be ₹1000 for this coupon." };
      }
      setAppliedCoupon(uppercaseCode);
      return { success: true, message: "₹500 Flat Discount applied!" };
    } else {
      return { success: false, message: "Invalid coupon code." };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
  };

  const cartTotal = baseTotal;
  const cartCount = items.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      items, addItem, removeItem, updateQuantity, clearCart, cartTotal, cartCount,
      appliedCoupon, couponDiscount, applyCoupon, removeCoupon
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
