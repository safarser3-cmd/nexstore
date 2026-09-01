"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { collection, query, limit, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowRight, Star, ShieldCheck, Truck, Clock, RotateCcw } from "lucide-react";

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem, items, updateQuantity } = useCart();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        setFeaturedProducts(products);
      } catch (error) {
        console.error("Error fetching featured products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);
  const [currentOffer, setCurrentOffer] = useState(0);

  const offers = [
    {
      id: 1,
      tag: "Limited time!",
      title: "Get Special Offer",
      discount: "40",
      bgImage: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
      bgColor: "bg-[#1A1A1A]"
    },
    {
      id: 2,
      tag: "New Arrivals",
      title: "Smart Watches",
      discount: "25",
      bgImage: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80",
      bgColor: "bg-[#0F172A]"
    },
    {
      id: 3,
      tag: "Weekend Sale",
      title: "Premium Audio",
      discount: "50",
      bgImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
      bgColor: "bg-[#4C0519]"
    }
  ];

  // Auto-play slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentOffer((prev) => (prev + 1) % offers.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col">
      {/* Trust Badges Strip */}
      <div className="w-full bg-[#0B1121] text-slate-300 py-3 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center text-center text-xs">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 flex-1">
            <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-1.5">
              <span className="font-bold text-white leading-tight">100% Secure Checkout</span>
              <span className="hidden lg:inline text-[10px] text-slate-400">256-bit SSL encrypted</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 flex-1 border-x border-slate-700/50">
            <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-1.5">
              <span className="font-bold text-white leading-tight">Free & Fast Delivery</span>
              <span className="hidden lg:inline text-[10px] text-slate-400">On all orders over ₹1000</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 flex-1">
            <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-1.5">
              <span className="font-bold text-white leading-tight">7-Day Easy Returns</span>
              <span className="hidden lg:inline text-[10px] text-slate-400">No questions asked</span>
            </div>
          </div>
        </div>
      </div>

      {/* Special For You Section */}
      <section className="px-4 sm:px-6 mt-6 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-xl font-bold">#SpecialForYou</h2>
          <span className="text-sm text-muted-foreground font-medium cursor-pointer hover:text-primary transition-colors">See All</span>
        </div>
        
        <div className="relative w-full max-w-4xl mx-auto overflow-hidden rounded-3xl aspect-[2/1] md:aspect-[2.5/1] lg:aspect-[3/1] shadow-xl group">
          {offers.map((offer, index) => (
            <div 
              key={offer.id}
              className={`absolute inset-0 w-full h-full ${offer.bgColor} text-white transition-transform duration-700 ease-in-out`}
              style={{ transform: `translateX(${(index - currentOffer) * 100}%)` }}
            >
              <div 
                className="absolute right-0 top-0 bottom-0 w-1/2 bg-cover bg-center mask-image-gradient-left"
                style={{ backgroundImage: `url('${offer.bgImage}')` }}
              ></div>
              <div className="relative z-10 max-w-[60%] h-full p-6 flex flex-col justify-center">
                <span className="inline-block self-start bg-white text-black text-[10px] font-bold px-2 py-0.5 rounded-full mb-2">{offer.tag}</span>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold leading-tight mb-1 sm:mb-2">{offer.title}</h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-sm font-medium mr-1.5">Up to</span>
                  <span className="text-3xl sm:text-4xl font-extrabold">{offer.discount}</span>
                  <span className="text-lg sm:text-xl font-bold">%</span>
                </div>
              </div>
              <div className="absolute bottom-4 left-6 text-[9px] sm:text-[10px] text-white/60">
                All Services Available | T&C Applied
              </div>
              <button className="absolute bottom-4 right-4 bg-primary text-primary-foreground font-bold text-xs px-5 py-2 rounded-full shadow-lg hover:scale-105 transition-transform active:scale-95">
                Claim
              </button>
            </div>
          ))}
          
          {/* Navigation Arrows */}
          <button 
            onClick={() => setCurrentOffer((prev) => (prev === 0 ? offers.length - 1 : prev - 1))}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/20 backdrop-blur text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/40"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button 
            onClick={() => setCurrentOffer((prev) => (prev + 1) % offers.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/20 backdrop-blur text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/40"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-1.5 mt-4">
          {offers.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentOffer(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentOffer ? "w-4 bg-primary" : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Category Section */}
      <section className="px-4 sm:px-6 mt-8 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-xl font-bold">Category</h2>
          <span className="text-sm text-muted-foreground font-medium">See All</span>
        </div>
        <div className="flex justify-between md:justify-start md:gap-12">
          <div className="flex flex-col items-center gap-2">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary relative">
              <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping opacity-20"></div>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4 6v2l2 1v9a2 2 0 002 2h8a2 2 0 002-2v-9l2-1V6l-8-4z"/></svg>
            </div>
            <span className="text-xs font-semibold text-foreground/80">Clothes</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center text-primary">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
            </div>
            <span className="text-xs font-semibold text-foreground/80">Electronics</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center text-primary">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20 10v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2a2 2 0 012-2h12a2 2 0 012 2z" /><path d="M12 20a4 4 0 100-8 4 4 0 000 8z" /></svg>
            </div>
            <span className="text-xs font-semibold text-foreground/80">Shoes</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center text-primary">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><circle cx="12" cy="12" r="7" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3l1.5 1.5" /></svg>
            </div>
            <span className="text-xs font-semibold text-foreground/80">Watch</span>
          </div>
        </div>
      </section>

      {/* Flash Sale Header & Filters */}
      <section className="px-4 sm:px-6 py-6 pb-2 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Flash Sale</h2>
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            Closing in : 
            <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded ml-1">02</span>:
            <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded">12</span>:
            <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded">56</span>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
          <button className="px-5 py-1.5 bg-background border rounded-full text-sm font-semibold whitespace-nowrap shadow-sm hover:border-primary/50">All</button>
          <button className="px-5 py-1.5 bg-primary text-primary-foreground rounded-full text-sm font-bold whitespace-nowrap shadow-sm">Newest</button>
          <button className="px-5 py-1.5 bg-background border rounded-full text-sm font-semibold whitespace-nowrap shadow-sm hover:border-primary/50">Popular</button>
          <button className="px-5 py-1.5 bg-background border rounded-full text-sm font-semibold whitespace-nowrap shadow-sm hover:border-primary/50">Clothes</button>
        </div>
      </section>

      {/* Flash Sale Product Grid */}
      <section className="px-4 sm:px-6 pb-12 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {loading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse space-y-3">
                <div className="aspect-square bg-muted rounded-2xl"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </div>
            ))
          ) : featuredProducts.length > 0 ? (
            featuredProducts.map((product) => {
              const cartItem = items.find(i => i.productId === product.id);
              const qtyInCart = cartItem ? cartItem.quantity : 0;

              return (
              <div key={product.id} className="group relative flex flex-col gap-2 p-2 rounded-[1.25rem] bg-card border-none shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all duration-300">
                <div className="absolute top-4 right-4 z-20 bg-background/80 backdrop-blur rounded-full p-1.5 text-muted-foreground hover:text-primary hover:bg-background transition-colors cursor-pointer">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                </div>
                
                <Link href={`/products/${product.slug}`} className="relative aspect-[4/5] overflow-hidden rounded-[1rem] bg-[#F5F5F5] transition-all">
                  {product.images?.[0] ? (
                    <img 
                      src={product.images[0]} 
                      alt={product.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-xs">
                      No Image
                    </div>
                  )}
                  {product.salePrice && (
                    <div className="absolute top-2 left-2 z-20 bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      -{(100 - (product.salePrice / product.price) * 100).toFixed(0)}%
                    </div>
                  )}
                </Link>
                
                <div className="space-y-0.5 px-1 pb-1">
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{product.categoryName || 'Clothes'}</span>
                    <div className="flex items-center text-[10px] text-foreground font-bold">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-0.5" /> 4.5
                    </div>
                  </div>
                  
                  <Link href={`/products/${product.slug}`} className="font-semibold text-sm leading-tight line-clamp-1">
                    {product.name}
                  </Link>
                  
                  <div className="flex items-center justify-between pt-1">
                    <div className="font-extrabold text-foreground">
                      ${product.salePrice || product.price}
                    </div>
                    {qtyInCart > 0 ? (
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => updateQuantity(product.id!, qtyInCart - 1)}
                          className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold hover:bg-primary hover:text-white transition-colors"
                        >−</button>
                        <span className="text-xs font-bold w-5 text-center">{qtyInCart}</span>
                        <button 
                          onClick={() => updateQuantity(product.id!, qtyInCart + 1)}
                          className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold hover:bg-primary/80 transition-colors"
                        >+</button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addItem({
                          productId: product.id!,
                          name: product.name,
                          sku: product.sku,
                          price: product.salePrice || product.price,
                          quantity: 1,
                          imageUrl: product.images?.[0],
                        })}
                        className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center shadow-sm hover:bg-primary/80 transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
              );
            })
          ) : (
            <div className="col-span-full text-center text-muted-foreground py-12">
              No featured products available at the moment.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
