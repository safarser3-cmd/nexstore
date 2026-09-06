"use client";

import { useEffect, useState } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, MapPin, Package, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    async function loadProfile() {
      const savedAddressStr = localStorage.getItem("saved_address");
      if (savedAddressStr) {
        try {
          const addressData = JSON.parse(savedAddressStr);
          setProfile(addressData);
          
          if (addressData.email) {
            // Fetch Orders
            // Note: We avoid orderBy to prevent requiring a composite index right now,
            // we will sort on the client side instead.
            const q = query(
              collection(db, "orders"), 
              where("customerId", "==", addressData.email)
            );
            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            
            // Sort client side (descending by createdAt)
            data.sort((a: any, b: any) => (b.createdAt || 0) - (a.createdAt || 0));
            setOrders(data);
          }
        } catch (e) {
          console.error("Error loading profile", e);
        }
      }
      setLoading(false);
    }
    
    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-24 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <h1 className="text-3xl font-bold tracking-tight mb-8">My Account</h1>
      
      {!profile ? (
        <div className="text-center bg-muted/30 p-12 rounded-2xl">
          <User className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
          <h2 className="text-xl font-semibold mb-2">No Account Details Found</h2>
          <p className="text-muted-foreground mb-6">
            We couldn't find any saved shipping or order details on this device. Place your first order to create a profile!
          </p>
          <Link href="/products">
            <Button>Start Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="space-y-6 md:col-span-1">
            <Card>
              <CardHeader className="pb-3 border-b">
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" /> Personal Info
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Full Name</p>
                  <p className="font-semibold">{profile.fullName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-semibold break-all">{profile.email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Phone Number</p>
                  <p className="font-semibold">{profile.phone}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3 border-b">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" /> Saved Address
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-1 text-sm">
                <p className="font-semibold">{profile.fullName}</p>
                <p>{profile.street}</p>
                <p>{profile.city}, {profile.state} {profile.zipCode}</p>
                <p>{profile.country}</p>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2 space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
              <Package className="w-6 h-6 text-primary" /> Order History
            </h2>
            
            {orders.length === 0 ? (
              <div className="text-center p-8 bg-muted/20 border border-dashed rounded-xl text-muted-foreground">
                No past orders found.
              </div>
            ) : (
              orders.map((order, idx) => (
                <Card key={idx} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="bg-muted/30 px-4 py-3 flex justify-between items-center border-b text-sm">
                    <div>
                      <span className="text-muted-foreground">Order </span>
                      <span className="font-mono font-bold">#{order.id.slice(-8).toUpperCase()}</span>
                    </div>
                    <div className="text-muted-foreground font-medium">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex gap-4 overflow-x-auto pb-2">
                          {order.items?.map((item: any, i: number) => (
                            <div key={i} className="flex-shrink-0 flex items-center gap-3 bg-muted/30 pr-3 rounded-lg border">
                              <div className="w-12 h-12 bg-muted rounded-l-lg overflow-hidden flex-shrink-0">
                                {item.imageUrl ? (
                                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-[8px] text-muted-foreground">No img</div>
                                )}
                              </div>
                              <div className="text-xs">
                                <p className="font-semibold line-clamp-1 max-w-[120px]">{item.name}</p>
                                <p className="text-muted-foreground">Qty: {item.quantity}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0 gap-2 min-w-[120px]">
                        <div className="text-lg font-bold">₹{order.total}</div>
                        <div>
                          <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                            order.status === 'Processing' || order.status === 'Completed' || order.paymentStatus === 'PAID'
                              ? 'bg-green-100 text-green-700 border border-green-200'
                              : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                          }`}>
                            {order.status || 'Pending'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
