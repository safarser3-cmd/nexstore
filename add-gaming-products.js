const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const serviceAccount = require("./e-commerce.json");

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

const gamingProducts = [
  {
    name: "RGB Mechanical Gaming Keyboard",
    slug: "rgb-mechanical-gaming-keyboard",
    shortDescription: "Sleek mechanical keyboard with RGB lighting.",
    description: "Dominate the game with our ultra-responsive mechanical gaming keyboard. Features customizable RGB lighting, tactile switches, and an ergonomic design for marathon sessions.",
    price: 399,
    salePrice: 200,
    currency: "INR",
    sku: "GAM-KB-001",
    categoryId: "electronics",
    categoryName: "Electronics",
    brand: "GamerPro",
    inventory: 50,
    lowStockThreshold: 10,
    status: "published",
    images: ["/images/gaming_keyboard.png"],
    tags: ["gaming", "keyboard", "rgb", "electronics"],
    variants: [],
    featured: true,
    active: true,
    createdAt: Date.now() + 1000,
    updatedAt: Date.now() + 1000,
    rating: 4.8,
    reviewCount: 34,
    specifications: {}
  },
  {
    name: "Ergonomic RGB Gaming Mouse",
    slug: "ergonomic-rgb-gaming-mouse",
    shortDescription: "High-precision optical gaming mouse.",
    description: "Experience pixel-perfect tracking and ultimate comfort with this ergonomic gaming mouse. Designed with customizable RGB zones and programmable buttons.",
    price: 299,
    salePrice: 150,
    currency: "INR",
    sku: "GAM-MS-001",
    categoryId: "electronics",
    categoryName: "Electronics",
    brand: "GamerPro",
    inventory: 45,
    lowStockThreshold: 5,
    status: "published",
    images: ["/images/gaming_mouse.png"],
    tags: ["gaming", "mouse", "rgb", "electronics"],
    variants: [],
    featured: true,
    active: true,
    createdAt: Date.now() + 2000,
    updatedAt: Date.now() + 2000,
    rating: 4.7,
    reviewCount: 56,
    specifications: {}
  }
];

async function addProducts() {
  console.log("Adding gaming products...");
  try {
    for (const product of gamingProducts) {
      const docRef = await db.collection("products").add(product);
      console.log(`Added product: ${product.name} (ID: ${docRef.id})`);
    }
    console.log("Success! Added gaming keyboard and mouse.");
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

addProducts();
