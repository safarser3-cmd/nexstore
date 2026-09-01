"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShieldCheck, Smartphone, CheckCircle2, Loader2, ArrowRight, Truck } from "lucide-react";
import { toast } from "sonner";

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5 * 60); // 5 minutes
  const [isSuccess, setIsSuccess] = useState(false);

  const UPI_ID = "nexastores@upi";
  const MERCHANT_NAME = "NexaStore";

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
    if (!order || isSuccess) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [order, isSuccess]);

  const handleTimeExpired = async () => {
    setIsSuccess(true);
    try {
      const docRef = doc(db, "orders", orderId);
      await updateDoc(docRef, {
        status: "Awaiting Confirmation",
        updatedAt: Date.now()
      });
    } catch (error) {
      console.error("Error updating order:", error);
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

  const upiString = `upi://pay?pa=${UPI_ID}&pn=${MERCHANT_NAME}&am=${order.total}&cu=INR`;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

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
          <h1 className="text-3xl font-extrabold tracking-tight">Order Placed Successfully!</h1>
          <p className="text-muted-foreground text-lg">
            We have received your payment request. Your order is now being processed.
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
        
        {/* Timer Section */}
        <div className="bg-muted/50 p-3 text-center border-b">
          <p className="text-sm font-semibold text-muted-foreground mb-1">Time remaining to pay</p>
          <div className="text-3xl font-mono font-bold text-primary tracking-wider">
            {formatTime(timeLeft)}
          </div>
        </div>

        <CardHeader className="text-center pb-2">
          <CardTitle>Pay via UPI</CardTitle>
          <CardDescription className="font-medium text-foreground">
            Amount to pay: <span className="text-xl font-bold text-primary">₹{order.total}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6 pt-4">
          
          {/* Desktop QR Code */}
          <div className="hidden md:flex flex-col items-center space-y-4">
            <div className="p-4 bg-white rounded-xl shadow-sm border">
              <QRCodeSVG value={upiString} size={200} />
            </div>
            <p className="text-sm text-muted-foreground font-medium">Scan with any UPI App</p>
          </div>

          {/* Mobile Deep Link Button */}
          <div className="md:hidden w-full flex flex-col items-center space-y-4">
            <a 
              href={upiString} 
              className="w-full flex items-center justify-center gap-2 h-14 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/30 active:scale-95 transition-all"
            >
              <Smartphone className="w-5 h-5" /> Pay ₹{order.total} with UPI App
            </a>
            <p className="text-xs text-muted-foreground">Tap above to open your UPI app directly</p>
          </div>
          
          <div className="flex items-center gap-2 text-xs font-bold text-green-600 bg-green-500/10 px-4 py-2 rounded-full w-full justify-center">
            <ShieldCheck className="w-4 h-4" /> 100% Secure Direct Bank Transfer
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
