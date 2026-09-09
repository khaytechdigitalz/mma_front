import type { Product } from "@/types";

const names = [
  "Farm Fresh Milk – Pure Pasteurized Daily Nutrition",
  "Organic Free-Range Eggs – Pack of 12",
  "Artisan Sourdough Bread – Freshly Baked",
  "Cold Pressed Orange Juice – 1L Bottle",
  "Crisp Vegetables Mixed Box – Seasonal Harvest",
  "Premium Atlantic Salmon Fillet – 500g",
  "Rare Fruits Basket – Exotic Selection",
  "Nutty Treasures – Mixed Nuts 400g",
  "Sweets & Honey Gift Box",
  "Energy Drink – Citrus Blast 250ml",
  "Pressed Juices – Green Detox 3-Pack",
  "New Launch Instant Noodles – Spicy",
  "Frozen Garden Peas – 900g",
  "Ice Cream Tub – Vanilla Bean 1L",
  "Whole Grain Pasta – 500g",
  "Extra Virgin Olive Oil – 750ml",
  "Chocolate Chip Cookies – Family Pack",
  "Grass-Fed Ground Beef – 1kg",
  "Sparkling Mineral Water – 6 Pack",
  "Basmati Rice – 5kg Bag",
];

const categories = [
  "Beverages",
  "Frozen Foods",
  "Vegetables",
  "Meat & Seafood",
  "Bakery",
  "Grocery",
];

function makeProduct(i: number): Product {
  const price = Number((5 + ((i * 37) % 45) + 0.49).toFixed(2));
  const hasDiscount = i % 3 === 0;
  const discountPercent = hasDiscount ? [10, 15, 20, 25][i % 4] : undefined;
  const oldPrice = hasDiscount
    ? Number((price / (1 - (discountPercent ?? 0) / 100)).toFixed(2))
    : undefined;

  return {
    id: `product-${i + 1}`,
    slug: `product-${i + 1}`,
    name: names[i % names.length],
    image: `product-${i + 1}`,
    price,
    oldPrice,
    discountPercent,
    rating: 3.5 + ((i * 7) % 15) / 10,
    reviewCount: 10 + ((i * 13) % 240),
    vendor: ["Brown Shop", "Green Basket", "Urban Grocer", "Fresh Mart"][i % 4],
    unit: ["1 pc", "500g", "1L", "1kg", "250ml"][i % 5],
    category: categories[i % categories.length],
    inStock: i % 11 !== 0,
  };
}

export const products: Product[] = Array.from({ length: 48 }, (_, i) =>
  makeProduct(i),
);

export function getProductById(id: string | null | undefined) {
  return products.find((p) => p.id === id) ?? products[0];
}

export const bestSellingCategories = [
  "All Products",
  "Beverages",
  "Frozen Foods",
  "Vegetables",
  "Meat & Seafood",
];
