"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, query, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";

export default function AllProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">All Products</h1>
        <p className="text-muted-foreground text-lg">Browse our complete collection of premium products.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {loading ? (
          Array(8).fill(0).map((_, i) => (
            <div key={i} className="animate-pulse space-y-4">
              <div className="aspect-square bg-muted rounded-xl w-full"></div>
              <div className="h-5 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/4"></div>
            </div>
          ))
        ) : products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="group flex flex-col gap-3">
              <Link href={`/products/${product.slug}`} className="relative aspect-square overflow-hidden rounded-xl bg-muted transition-all">
                {product.images?.[0] ? (
                  <img 
                    src={product.images[0]} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-secondary/50 group-hover:bg-secondary/20 transition-colors">
                    No Image
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  <Button className="w-full shadow-lg shadow-black/20" variant="secondary">
                    View Details
                  </Button>
                </div>
              </Link>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Link href={`/products/${product.slug}`} className="font-medium truncate hover:text-primary transition-colors">
                    {product.name}
                  </Link>
                </div>
                <div className="flex items-center text-sm">
                  <span className="font-semibold text-primary">₹{product.salePrice || product.price}</span>
                  {product.salePrice && (
                    <span className="text-muted-foreground line-through ml-2 text-xs">₹{product.price}</span>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-muted-foreground py-24">
            <h2 className="text-2xl font-semibold mb-2">No products found</h2>
            <p>Check back later for new arrivals!</p>
          </div>
        )}
      </div>
    </div>
  );
}
