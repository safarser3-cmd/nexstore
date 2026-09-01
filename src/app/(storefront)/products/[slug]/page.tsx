"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { Button, buttonVariants } from "@/components/ui/button";
import { Star, Truck, ShieldCheck, ArrowRight, RotateCcw } from "lucide-react";
import { toast } from "sonner"; // if available, or just fallback
import { ProductReviews } from "@/components/ProductReviews";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { addItem } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<Record<string, string>>({});
  const [viewers, setViewers] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    setViewers(Math.floor(Math.random() * 45) + 12);
  }, []);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const q = query(collection(db, "products"), where("slug", "==", slug));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const doc = snapshot.docs[0];
          setProduct({ id: doc.id, ...doc.data() } as Product);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    }
    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-24 flex justify-center">
        <div className="animate-pulse space-y-8 w-full max-w-4xl">
          <div className="h-96 bg-muted rounded-xl w-full"></div>
          <div className="space-y-4">
            <div className="h-8 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-1/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
        <p className="text-muted-foreground mb-8">The product you're looking for doesn't exist or has been removed.</p>
        <a href="/products" className={buttonVariants()}>Browse Products</a>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem({
      productId: product.id!,
      name: product.name,
      sku: product.sku,
      price: product.salePrice || product.price,
      quantity,
      imageUrl: product.images?.[0],
      variantSelections: selectedVariant
    });
    
    // Fallback if toast isn't available:
    alert(`Added ${quantity} x ${product.name} to your cart!`);
  };

  const finalPrice = product.salePrice || product.price;

  return (
    <div className="bg-background min-h-screen pb-28">
      {/* Top App Bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 pt-6 sticky top-0 bg-background/80 backdrop-blur z-30 max-w-7xl mx-auto w-full">
        <button onClick={() => window.history.back()} className="w-10 h-10 bg-muted/50 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h1 className="font-bold text-lg">Product Details</h1>
        <button className="w-10 h-10 bg-muted/50 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
        </button>
      </div>

      {/* Adaptive Layout: single col mobile, two col desktop */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
        
        {/* LEFT: Product Images */}
        <div className="md:sticky md:top-20 md:self-start">
          <div className="w-full aspect-[4/3] bg-[#F5F5F5] rounded-2xl overflow-hidden">
             {product.images?.[selectedImage] ? (
               <img 
                 src={product.images[selectedImage]} 
                 alt={product.name} 
                 className="w-full h-full object-cover transition-all duration-300"
               />
             ) : (
               <div className="w-full h-full flex items-center justify-center text-muted-foreground">No Image</div>
             )}
          </div>
          
          {/* Thumbnail Gallery */}
          {product.images && product.images.length > 0 && (
            <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1 hide-scrollbar">
              {product.images.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setSelectedImage(i)}
                  className={`h-10 w-10 flex-shrink-0 rounded-lg overflow-hidden transition-all duration-200 ${
                    selectedImage === i 
                      ? 'ring-2 ring-primary' 
                      : 'border border-border/40 opacity-50 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: Product Info */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground font-medium text-sm">{product.categoryName || 'Clothes'}</span>
            <div className="flex items-center text-sm font-bold">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" /> 4.5
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">{product.name}</h2>

          {/* Price */}
          <div className="flex items-end gap-3">
            <span className="text-3xl md:text-4xl font-extrabold text-primary">${finalPrice.toFixed(2)}</span>
            {product.salePrice && (
              <span className="text-lg text-muted-foreground line-through mb-1">${product.price.toFixed(2)}</span>
            )}
          </div>

          {/* Seller Profile */}
          <div className="flex flex-col gap-3 p-4 bg-muted/30 rounded-2xl">
            <h3 className="font-semibold">Seller</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src="https://i.pravatar.cc/150?img=5" alt="Seller" className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <p className="font-bold text-sm">Jenny Doe</p>
                  <p className="text-xs text-muted-foreground">Manager</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>
                </button>
                <button className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                </button>
              </div>
            </div>
          </div>

          {/* Product Details Text */}
          <div className="space-y-2">
            <h3 className="font-semibold">Product Details</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {product.description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'} <span className="text-foreground font-semibold underline cursor-pointer">Read more</span>
            </p>
          </div>

          {/* Select Size */}
          <div className="space-y-3">
            <h3 className="font-semibold">Select Size</h3>
            <div className="flex gap-3">
              {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                <button key={size} className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold border ${size === 'M' ? 'bg-primary text-primary-foreground border-primary shadow-sm' : 'bg-background text-foreground border-border hover:border-primary/50'}`}>
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Desktop Add to Cart (visible on md+) */}
          <div className="hidden md:flex items-center gap-4 pt-4">
            <Button 
              size="lg" 
              className="rounded-full shadow-lg font-bold px-10 h-14 bg-primary text-primary-foreground hover:bg-primary/90 flex gap-2 flex-1"
              onClick={handleAddToCart}
              disabled={product.inventory <= 0}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              Add to Cart — ${finalPrice.toFixed(2)}
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-2 mt-8 pt-6 border-t border-border/50 text-center">
            <div className="flex flex-col items-center gap-1.5 p-2">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <span className="text-[10px] sm:text-xs font-semibold text-muted-foreground leading-tight">100% Secure<br/>Checkout</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 p-2">
              <Truck className="w-5 h-5 text-primary" />
              <span className="text-[10px] sm:text-xs font-semibold text-muted-foreground leading-tight">Free & Fast<br/>Delivery</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 p-2">
              <RotateCcw className="w-5 h-5 text-primary" />
              <span className="text-[10px] sm:text-xs font-semibold text-muted-foreground leading-tight">7-Day Easy<br/>Returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Add To Cart — mobile only */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-5 bg-background rounded-t-3xl border-t z-50 flex items-center justify-between shadow-[0_-15px_40px_rgba(0,0,0,0.06)]">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-muted-foreground font-medium">Total Price</span>
          <span className="font-extrabold text-2xl text-foreground">${finalPrice.toFixed(2)}</span>
        </div>
        <Button 
          size="lg" 
          className="rounded-full shadow-lg font-bold px-8 h-14 bg-primary text-primary-foreground hover:bg-primary/90 flex gap-2"
          onClick={handleAddToCart}
          disabled={product.inventory <= 0}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
          Add to Cart
        </Button>
      </div>

      {/* Social Proof: Customer Reviews */}
      <ProductReviews />
    </div>
  );
}
