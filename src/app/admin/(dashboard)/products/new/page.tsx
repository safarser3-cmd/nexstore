"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner"; // Assuming sonner is installed with shadcn, if not we'll use a basic alert or standard toast

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    slug: "",
    shortDescription: "",
    description: "",
    price: 0,
    currency: "INR",
    sku: "",
    categoryId: "uncategorized",
    categoryName: "Uncategorized",
    brand: "",
    inventory: 0,
    lowStockThreshold: 5,
    status: "draft",
    images: [],
    tags: [],
    variants: [],
    featured: false,
    active: true,
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const uploadImages = async () => {
    // In a real implementation, this would hit an API route to get a signed URL 
    // for Cloudflare R2, then PUT the file to R2, returning the public URL.
    // For now, we mock the upload process.
    if (images.length === 0) return [];
    
    console.log("Simulating upload to Cloudflare R2 for", images.length, "images");
    // Mock URLs
    return images.map(img => `https://ecommerce-prod-images.example.com/${Date.now()}-${img.name}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Upload images to Cloudflare R2
      const uploadedImageUrls = await uploadImages();

      // 2. Prepare product document
      const productDoc: Omit<Product, "id"> = {
        ...(formData as Product),
        images: uploadedImageUrls,
        slug: formData.name?.toLowerCase().replace(/[\s_]+/g, '-').replace(/[^\w-]+/g, '') || "",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        rating: 0,
        reviewCount: 0,
        specifications: {}
      };

      // 3. Save to Firestore
      await addDoc(collection(db, "products"), productDoc);
      
      alert("Product created successfully!");
      router.push("/admin/products");
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Failed to create product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">New Product</h1>
          <p className="text-muted-foreground">Add a new product to your catalog</p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Details</CardTitle>
            <CardDescription>Essential information about the product.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input 
                id="name" 
                required 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                placeholder="e.g. Premium Cotton T-Shirt"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (₹)</Label>
                <Input 
                  id="price" 
                  type="number" 
                  required 
                  value={formData.price || ''} 
                  onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salePrice">Sale Price (Optional, ₹)</Label>
                <Input 
                  id="salePrice" 
                  type="number" 
                  value={formData.salePrice || ''} 
                  onChange={(e) => setFormData({...formData, salePrice: parseFloat(e.target.value)})} 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="shortDesc">Short Description</Label>
              <Input 
                id="shortDesc" 
                required 
                value={formData.shortDescription} 
                onChange={(e) => setFormData({...formData, shortDescription: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="desc">Full Description</Label>
              <Textarea 
                id="desc" 
                rows={4}
                required 
                value={formData.description} 
                onChange={(e) => setFormData({...formData, description: e.target.value})} 
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inventory & Organization</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input 
                  id="sku" 
                  required 
                  value={formData.sku} 
                  onChange={(e) => setFormData({...formData, sku: e.target.value})} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Available Stock</Label>
                <Input 
                  id="stock" 
                  type="number" 
                  required 
                  value={formData.inventory || ''} 
                  onChange={(e) => setFormData({...formData, inventory: parseInt(e.target.value)})} 
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(val: any) => setFormData({...formData, status: val})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="images">Product Images</Label>
                <Input 
                  id="images" 
                  type="file" 
                  multiple 
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Creating Product..." : "Save Product"}
          </Button>
        </div>
      </form>
    </div>
  );
}
