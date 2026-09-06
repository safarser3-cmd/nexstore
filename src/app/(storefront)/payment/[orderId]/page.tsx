"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShieldCheck, CheckCircle2, Loader2, ArrowRight, Truck, Wallet } from "lucide-react";
import { toast } from "sonner";

declare global { interface Window { Cashfree?: any; } }

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const cashfreeRef = useRef<any>(null);

  useEffect(() => {
    async function fetchOrder() {
      if (!orderId) return;
      try {
        const docRef = doc(db, "orders", orderId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setOrder(docSnap.data());
        } else {
          toast.error("Order not found");
          router.push("/");
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [orderId, router]);

  useEffect(() => {
    // Load Cashfree JS SDK
    const scriptId = "cashfree-sdk";
    if (!document.getElementById(scriptId)) {
      const s = document.createElement("script");
      s.id = scriptId;
      s.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
      s.async = true;
      s.onload = () => {
        cashfreeRef.current = window.Cashfree({
          mode: "production", // "production" based on .env keys
        });
      };
      document.head.appendChild(s);
    } else {
      if (window.Cashfree) {
        cashfreeRef.current = window.Cashfree({ mode: "production" });
      }
    }
  }, []);

  const handlePayment = async () => {
    if (!cashfreeRef.current) {
      toast.error("Payment system is still loading. Please wait a moment.");
      return;
    }

    setPaymentLoading(true);
    try {
      // 1. Create Order on Backend
      const res = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          amount: order.total,
          customerPhone: order.shippingAddress?.phone || "9999999999",
          customerEmail: order.customerId || "customer@example.com",
          customerName: order.shippingAddress?.fullName || "Customer"
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to initialize payment");
      }

      // 2. Open Cashfree Checkout Modal
      const checkoutResult = await cashfreeRef.current.checkout({
        paymentSessionId: data.paymentSessionId,
        redirectTarget: "_modal",
      });

      if (checkoutResult.error) {
        toast.error("Payment was not completed. You can try again.");
        setPaymentLoading(false);
        return;
      }

      if (checkoutResult.paymentDetails) {
        // 3. Verify Payment on Backend
        const verifyRes = await fetch("/api/checkout/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: data.orderId || orderId }),
        });

        const verifyData = await verifyRes.json();
        
        if (verifyData.status === "PAID") {
          // Update order status in Firebase
          const docRef = doc(db, "orders", orderId);
          await updateDoc(docRef, {
            status: "Processing", // Mark as Processing after successful payment
            paymentStatus: "PAID",
            updatedAt: Date.now()
          });
          setIsSuccess(true);
        } else {
          toast.error(`Payment not completed. Status: ${verifyData.status}`);
        }
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Something went wrong.");
    } finally {
      setPaymentLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-24 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!order) return null;

  if (isSuccess) {
    return (
      <div className="container mx-auto px-4 py-24 max-w-lg text-center space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="relative h-32 w-full overflow-hidden flex items-center justify-center">
          <Truck className="w-20 h-20 text-primary animate-[bounce_1s_infinite] absolute -left-20" style={{ animation: 'drive 3s ease-in-out forwards' }} />
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes drive {
              0% { left: -20%; }
              50% { left: 40%; transform: scale(1.2); }
              100% { left: 120%; }
            }
          `}} />
        </div>
        
        <div className="space-y-4">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Payment Successful!</h1>
          <p className="text-muted-foreground text-lg">
            We have received your payment. Your order is now being processed.
          </p>
        </div>
        <Button 
          size="lg" 
          className="w-full h-14 text-lg font-bold rounded-xl"
          onClick={() => router.push(`/order-success/${orderId}`)}
        >
          View Order Details <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-md">
      <div className="text-center mb-6 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Complete Your Payment</h1>
        <p className="text-muted-foreground">Order ID: #{orderId.slice(-6).toUpperCase()}</p>
      </div>

      <Card className="border-primary/20 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-blue-500 via-primary to-purple-500" />

        <CardHeader className="text-center pb-2 pt-6">
          <CardTitle>Pay Securely with Cashfree</CardTitle>
          <CardDescription className="font-medium text-foreground mt-2">
            Amount to pay: <span className="text-xl font-bold text-primary">₹{order.total}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6 pt-4">
          
          <Button 
            size="lg" 
            className="w-full h-14 text-lg font-bold rounded-xl shadow-lg shadow-primary/30"
            onClick={handlePayment}
            disabled={paymentLoading}
          >
            {paymentLoading ? (
              <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...</>
            ) : (
              <><Wallet className="mr-2 h-5 w-5" /> Pay ₹{order.total}</>
            )}
          </Button>
          
          <div className="flex items-center gap-2 text-xs font-bold text-green-600 bg-green-500/10 px-4 py-2 rounded-full w-full justify-center">
            <ShieldCheck className="w-4 h-4" /> 100% Secure Payment via Cashfree
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
