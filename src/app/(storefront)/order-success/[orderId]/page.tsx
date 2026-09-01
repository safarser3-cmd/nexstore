"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Package, Truck, ArrowRight, Loader2 } from "lucide-react";

export default function OrderSuccessPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      if (!orderId) return;
      try {
        const docRef = doc(db, "orders", orderId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setOrder({ id: docSnap.id, ...docSnap.data() });
        } else {
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-24 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl text-center space-y-8">
      {/* Success Animation / Icon */}
      <div className="flex justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20" />
          <CheckCircle2 className="w-24 h-24 text-green-500 relative z-10" />
        </div>
      </div>

      <div className="space-y-3">
        <h1 className="text-4xl font-extrabold tracking-tight">Order Confirmed!</h1>
        <p className="text-muted-foreground text-lg">
          Thank you for shopping with us. Your order has been successfully placed.
        </p>
      </div>

      <Card className="shadow-lg border-border/50 bg-muted/20">
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4 text-left border-b pb-6">
            <div>
              <p className="text-sm text-muted-foreground font-medium">Order ID</p>
              <p className="font-bold font-mono">#{order.id.slice(-8).toUpperCase()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Amount Paid</p>
              <p className="font-bold text-primary">₹{order.total}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Payment Status</p>
              {order.status === 'Pending Verification' ? (
                <p className="font-bold text-yellow-600 flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" /> Verifying UTR
                </p>
              ) : (
                <p className="font-bold text-green-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Confirmed
                </p>
              )}
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Shipping To</p>
              <p className="font-bold truncate" title={order.shippingAddress?.fullName}>
                {order.shippingAddress?.fullName || 'Customer'}
              </p>
            </div>
          </div>

          <div className="flex justify-center gap-6 text-sm font-medium text-muted-foreground">
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Package className="w-5 h-5" />
              </div>
              Preparing
            </div>
            <div className="w-12 border-t-2 border-dashed border-muted-foreground/30 mt-5" />
            <div className="flex flex-col items-center gap-2 opacity-50">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              Shipped
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
        <Link href="/products" className="w-full sm:w-auto">
          <Button size="lg" variant="outline" className="w-full h-14 rounded-xl font-bold">
            Continue Shopping
          </Button>
        </Link>
        <Link href="/track" className="w-full sm:w-auto">
          <Button size="lg" className="w-full h-14 rounded-xl font-bold shadow-lg">
            Track Order <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
