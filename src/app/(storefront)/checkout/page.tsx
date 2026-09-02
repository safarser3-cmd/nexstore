"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ShieldCheck, ArrowRight, Wallet, Banknote, Clock, CreditCard, CheckCircle2, Lock, Truck } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, cartTotal, clearCart, appliedCoupon, couponDiscount } = useCart();
  
  const [timeLeft, setTimeLeft] = useState(10 * 60); // 10 minutes reserved

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'prepaid'>('prepaid');

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const SHIPPING_FEE = cartTotal > 999 ? 0 : 99;
  const PREPAID_DISCOUNT = paymentMethod === 'prepaid' ? 30 : 0;
  
  const finalTotal = cartTotal + SHIPPING_FEE - PREPAID_DISCOUNT - couponDiscount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    
    setLoading(true);

    try {
      const orderDoc = {
        customerId: formData.email,
        items: items,
        subtotal: cartTotal,
        discount: PREPAID_DISCOUNT + couponDiscount,
        couponCode: appliedCoupon,
        shipping: SHIPPING_FEE,
        total: finalTotal,
        shippingAddress: {
          fullName: formData.fullName,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
          phone: formData.phone,
        },
        paymentMethod: paymentMethod,
        status: 'Pending',
        createdAt: Date.now()
      };

      const docRef = await addDoc(collection(db, "orders"), orderDoc);
      
      setIsSuccess(true);
      clearCart();
      
      if (paymentMethod === 'prepaid') {
        router.push(`/payment/${docRef.id}`);
      } else {
        router.push(`/order-success/${docRef.id}`);
      }
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Something went wrong while placing your order.");
      setLoading(false);
    }
  };

  if (items.length === 0 && !isSuccess) {
    return (
      <div className="container mx-auto px-4 py-24 text-center max-w-lg">
        <div className="p-6 bg-muted/50 rounded-2xl">
          <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">Looks like you haven't added anything yet.</p>
          <Button className="w-full rounded-full" onClick={() => router.push("/products")}>
            Start Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Checkout</h1>
      
      <div className="bg-destructive/10 border border-destructive/20 text-destructive text-center p-3 rounded-lg mb-8 font-bold flex items-center justify-center gap-2">
        <Clock className="w-5 h-5 animate-pulse" />
        High Demand: Your order is reserved for {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')} minutes!
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-6">
          <form id="checkout-form" onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Contact & Shipping</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" required value={formData.fullName} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" required value={formData.email} onChange={handleInputChange} />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" required value={formData.phone} onChange={handleInputChange} />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="street">Street Address</Label>
                  <Input id="street" required value={formData.street} onChange={handleInputChange} />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2 col-span-1">
                    <Label htmlFor="zipCode">PIN Code</Label>
                    <Input id="zipCode" required value={formData.zipCode} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2 col-span-1">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" required value={formData.city} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2 col-span-1">
                    <Label htmlFor="state">State</Label>
                    <Input id="state" required value={formData.state} onChange={handleInputChange} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  
                  <div 
                    className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${paymentMethod === 'prepaid' ? 'border-primary bg-primary/5 ring-4 ring-primary/20 shadow-[0_0_20px_rgba(var(--primary),0.2)]' : 'border-border hover:border-primary/50'}`}
                    onClick={() => setPaymentMethod('prepaid')}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'prepaid' ? 'border-primary bg-primary' : 'border-muted-foreground'}`}>
                        {paymentMethod === 'prepaid' && <CheckCircle2 className="w-3 h-3 text-primary-foreground" />}
                      </div>
                      <CreditCard className={`w-6 h-6 ${paymentMethod === 'prepaid' ? 'text-primary' : 'text-muted-foreground'}`} />
                      <span className="font-bold text-lg">Online Payment (UPI/Card)</span>
                    </div>
                    <p className="text-sm text-primary font-bold pl-8 bg-primary/10 inline-block px-2 py-1 rounded ml-8 mt-1">
                      🔥 EXTRA ₹30 DISCOUNT APPLIED!
                    </p>
                  </div>

                  <label 
                    className={`flex items-start p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'hover:border-primary/50'}`}
                  >
                    <div className="flex h-5 items-center mr-4">
                      <input 
                        type="radio" 
                        name="payment" 
                        value="cod"
                        className="w-4 h-4 text-primary"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Banknote className="h-5 w-5 text-muted-foreground" />
                        <span className="font-semibold">Cash on Delivery (COD)</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Pay when your order arrives. Standard fees apply.</p>
                    </div>
                  </label>
                  
                </CardContent>
              </Card>
            </div>
          </form>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <Card className="shadow-lg border-primary/20">
              <CardHeader className="bg-muted/50 pb-4">
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                  {items.map((item, idx) => (
                    <div key={idx} className="flex gap-3 text-sm">
                      <div className="relative h-16 w-16 bg-muted rounded overflow-hidden flex-shrink-0">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.name} className="object-cover w-full h-full" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground">No img</div>
                        )}
                        <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium line-clamp-2">{item.name}</p>
                        <p className="text-muted-foreground text-xs mt-1">₹{item.price}</p>
                      </div>
                      <div className="font-medium text-right">
                        ₹{item.price * item.quantity}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>₹{cartTotal}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span>{SHIPPING_FEE === 0 ? <span className="text-green-600 font-medium">Free</span> : `₹${SHIPPING_FEE}`}</span>
                  </div>
                  
                  {appliedCoupon && (
                    <div className="flex justify-between text-green-600 font-medium">
                      <span>Coupon ({appliedCoupon})</span>
                      <span>-₹{couponDiscount}</span>
                    </div>
                  )}

                  {paymentMethod === 'prepaid' && (
                    <div className="flex justify-between text-green-600 font-medium bg-green-500/10 p-2 rounded-md -mx-2 px-2">
                      <span>Online Payment Discount</span>
                      <span>-₹30</span>
                    </div>
                  )}
                  
                  <div className="border-t pt-3 mt-3 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹{finalTotal}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/30 pt-4 flex-col gap-3">
                <Button 
                  type="submit" 
                  form="checkout-form" 
                  size="lg" 
                  className="w-full h-16 text-xl font-bold rounded-xl shadow-[0_0_30px_rgba(var(--primary),0.3)] transition-all hover:scale-[1.02]"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Place Order Now'}
                </Button>
                
                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-2 w-full mt-2 text-center opacity-75">
                  <div className="flex flex-col items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                    <span className="text-[9px] font-medium leading-tight">100% Secure<br/>Payment</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Lock className="w-4 h-4 text-primary" />
                    <span className="text-[9px] font-medium leading-tight">256-bit SSL<br/>Encryption</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Truck className="w-4 h-4 text-primary" />
                    <span className="text-[9px] font-medium leading-tight">Free Returns<br/>Within 7 Days</span>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>

      </div>
    </div>
  );
}
