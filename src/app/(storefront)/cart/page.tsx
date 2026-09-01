"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Button, buttonVariants } from "@/components/ui/button";
import { ShoppingCart, Trash2, ArrowRight, Tag, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LoginModal } from "@/components/LoginModal";

export default function CartPage() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, cartTotal, appliedCoupon, couponDiscount, applyCoupon, removeCoupon } = useCart();
  const { user } = useAuth();
  
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleCheckout = () => {
    if (!user) {
      setShowLoginModal(true);
    } else {
      router.push("/checkout");
    }
  };

  const handleApplyCoupon = () => {
    setCouponError("");
    if (!couponCode) return;
    const result = applyCoupon(couponCode);
    if (!result.success) {
      setCouponError(result.message);
    } else {
      setCouponCode("");
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center max-w-lg">
        <div className="p-8 bg-muted/30 rounded-3xl border border-border/50">
          <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-6 opacity-50" />
          <h1 className="text-3xl font-bold mb-3 tracking-tight">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8 text-lg">Looks like you haven't added anything to your cart yet.</p>
          <Link 
            href="/products" 
            className={buttonVariants({ size: "lg", className: "w-full rounded-full h-14 text-lg font-medium shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]" })}
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item, idx) => (
            <Card key={idx} className="flex flex-col sm:flex-row items-center p-4 gap-6 hover:border-primary/50 transition-colors">
              <div className="h-24 w-24 bg-muted rounded-xl overflow-hidden flex-shrink-0 relative">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} className="object-cover w-full h-full" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">No Image</div>
                )}
              </div>
              
              <div className="flex-1 text-center sm:text-left space-y-1">
                <h3 className="font-semibold text-lg line-clamp-1">{item.name}</h3>
                <p className="text-muted-foreground text-sm">SKU: {item.sku}</p>
                <div className="font-bold text-primary text-lg mt-2">₹{item.price}</div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-md">
                  <button 
                    className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variantSelections)}
                  >
                    -
                  </button>
                  <input 
                    type="number" 
                    className="w-12 h-10 text-center font-medium border-x bg-transparent outline-none" 
                    value={item.quantity}
                    readOnly
                  />
                  <button 
                    className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variantSelections)}
                  >
                    +
                  </button>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => removeItem(item.productId, item.variantSelections)}
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-24 shadow-lg border-primary/20">
            <CardHeader className="bg-muted/50 pb-4">
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>₹{cartTotal}</span>
              </div>
              
              {appliedCoupon && (
                <div className="flex justify-between text-green-500 font-bold bg-green-500/10 p-2 rounded -mx-2 px-2">
                  <div className="flex items-center gap-1 text-sm">
                    <Tag className="w-4 h-4" /> Coupon ({appliedCoupon})
                    <button onClick={removeCoupon} className="ml-2 hover:text-red-500"><X className="w-4 h-4" /></button>
                  </div>
                  <span>-₹{couponDiscount}</span>
                </div>
              )}

              <div className="flex justify-between text-muted-foreground">
                <span>Estimated Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              
              {/* Coupon Input Area */}
              {!appliedCoupon && (
                <div className="pt-2">
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Enter coupon code (e.g. SAVE20)" 
                      value={couponCode} 
                      onChange={(e) => setCouponCode(e.target.value)} 
                      className="uppercase"
                    />
                    <Button onClick={handleApplyCoupon} variant="secondary">Apply</Button>
                  </div>
                  {couponError && <p className="text-xs text-destructive mt-1">{couponError}</p>}
                </div>
              )}

              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between font-extrabold text-3xl">
                  <span>Total</span>
                  <span className="text-primary">₹{cartTotal - couponDiscount}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Taxes and shipping calculated at checkout</p>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/30 pt-4 flex flex-col gap-3">
              <Button 
                onClick={handleCheckout}
                size="lg"
                className="w-full h-14 text-lg rounded-xl shadow-md transition-all hover:scale-[1.02]"
              >
                Proceed to Checkout <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Mobile Sticky Checkout CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/90 backdrop-blur-md border-t z-40 lg:hidden shadow-[0_-10px_40px_rgba(0,0,0,0.3)] flex flex-col gap-2">
        <div className="flex justify-between items-center text-sm font-bold">
          <span className="text-muted-foreground">Total:</span>
          <span className="text-xl text-primary font-extrabold">₹{cartTotal - couponDiscount}</span>
        </div>
        <Button 
          onClick={handleCheckout}
          size="lg"
          className="w-full rounded-full h-14 font-bold text-lg shadow-[0_0_20px_rgba(var(--primary),0.3)] animate-pulse-fast"
        >
          Checkout Now <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
      
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
        title="Sign In to Checkout"
        description="Create an account or sign in to complete your purchase, track orders, and get exclusive discounts."
      />
    </div>
  );
}
