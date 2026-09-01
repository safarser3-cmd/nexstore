const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const serviceAccount = require("./e-commerce.json");

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

const demoProducts = [
  {
    name: "Premium Cotton T-Shirt",
    slug: "premium-cotton-t-shirt",
    shortDescription: "Ultra-soft, breathable everyday tee.",
    description: "Our Premium Cotton T-Shirt is made from 100% organic cotton, offering unparalleled comfort and durability for everyday wear.",
    price: 999,
    salePrice: 799,
    currency: "INR",
    sku: "TS-PREM-001",
    categoryId: "clothing",
    categoryName: "Clothing",
    brand: "Nexa",
    inventory: 50,
    lowStockThreshold: 10,
    status: "published",
    images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80"],
    tags: ["cotton", "t-shirt", "casual"],
    variants: [],
    featured: true,
    active: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    rating: 4.5,
    reviewCount: 24,
    specifications: {}
  },
  {
    name: "Wireless Noise-Canceling Headphones",
    slug: "wireless-noise-canceling-headphones",
    shortDescription: "Immersive sound without the distractions.",
    description: "Experience premium audio with our active noise-canceling technology, designed to block out the world so you can focus on your music.",
    price: 4999,
    salePrice: 3499,
    currency: "INR",
    sku: "EL-HP-002",
    categoryId: "electronics",
    categoryName: "Electronics",
    brand: "AudioPro",
    inventory: 15,
    lowStockThreshold: 5,
    status: "published",
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"],
    tags: ["audio", "headphones", "wireless"],
    variants: [],
    featured: true,
    active: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    rating: 4.8,
    reviewCount: 156,
    specifications: {}
  },
  {
    name: "Minimalist Leather Wallet",
    slug: "minimalist-leather-wallet",
    shortDescription: "Slim, elegant, and practical.",
    description: "Crafted from genuine full-grain leather, this minimalist wallet holds all your essentials without adding bulk to your pocket.",
    price: 1499,
    salePrice: 1299,
    currency: "INR",
    sku: "AC-WL-003",
    categoryId: "accessories",
    categoryName: "Accessories",
    brand: "Craft",
    inventory: 100,
    lowStockThreshold: 20,
    status: "published",
    images: ["https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80"],
    tags: ["wallet", "leather", "accessories"],
    variants: [],
    featured: false,
    active: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    rating: 4.2,
    reviewCount: 45,
    specifications: {}
  },
  {
    name: "Smart Fitness Watch",
    slug: "smart-fitness-watch",
    shortDescription: "Track your health and stay connected.",
    description: "Monitor your heart rate, sleep, and workouts with our sleek Smart Fitness Watch. Features a vibrant AMOLED display and up to 7 days of battery life.",
    price: 2999,
    currency: "INR",
    sku: "EL-SW-004",
    categoryId: "electronics",
    categoryName: "Electronics",
    brand: "FitTech",
    inventory: 30,
    lowStockThreshold: 10,
    status: "published",
    images: ["https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80"],
    tags: ["smartwatch", "fitness", "wearable"],
    variants: [],
    featured: true,
    active: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    rating: 4.6,
    reviewCount: 89,
    specifications: {}
  },
  {
    name: "Ceramic Coffee Mug",
    slug: "ceramic-coffee-mug",
    shortDescription: "Hand-crafted for your morning brew.",
    description: "Start your day right with this beautiful, hand-glazed ceramic coffee mug. Microwave and dishwasher safe.",
    price: 499,
    currency: "INR",
    sku: "HM-MG-005",
    categoryId: "home",
    categoryName: "Home & Living",
    brand: "Artisan",
    inventory: 2, // low stock to test low stock UI
    lowStockThreshold: 5,
    status: "published",
    images: ["https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=800&q=80"],
    tags: ["home", "kitchen", "coffee"],
    variants: [],
    featured: false,
    active: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    rating: 4.9,
    reviewCount: 12,
    specifications: {}
  }
];

async function seedProducts() {
  console.log("Starting database seed...");
  try {
    for (const product of demoProducts) {
      const docRef = await db.collection("products").add(product);
      console.log(`Added product: ${product.name} (ID: ${docRef.id})`);
    }
    console.log("Seeding complete! Added 5 demo products.");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding products:", error);
    process.exit(1);
  }
}

seedProducts();
