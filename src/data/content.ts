import type { BlogPost, Category, FaqItem, Testimonial, Vendor } from "@/types";

export const categories: Category[] = [
  { id: "cat-1", name: "Grocery", image: "cat-1", itemCount: 128 },
  { id: "cat-2", name: "Bakery", image: "cat-2", itemCount: 64 },
  { id: "cat-3", name: "Ice Cream", image: "cat-3", itemCount: 42 },
  { id: "cat-4", name: "Energy Drink", image: "cat-4", itemCount: 36 },
  { id: "cat-5", name: "Chocolate", image: "cat-5", itemCount: 58 },
  { id: "cat-6", name: "Honey", image: "cat-6", itemCount: 21 },
];

export const blogPosts: BlogPost[] = [
  {
    id: "blog-1",
    slug: "blog-1",
    title: "5 Simple Ways to Eat More Sustainably This Year",
    image: "blog-1",
    excerpt:
      "Small changes to how you shop for groceries can make a big difference for the planet.",
    date: "Jan 12, 2026",
    author: "Alicia Moore",
    category: "Lifestyle",
    commentCount: 12,
  },
  {
    id: "blog-2",
    slug: "blog-2",
    title: "Why Farm-Fresh Produce Tastes Better (And Is Better For You)",
    image: "blog-2",
    excerpt:
      "We break down the nutritional and flavor differences between farm-fresh and store-bought produce.",
    date: "Feb 03, 2026",
    author: "James Carter",
    category: "Health",
    commentCount: 8,
  },
  {
    id: "blog-3",
    slug: "blog-3",
    title: "A Beginner's Guide to Meal Prepping on a Budget",
    image: "blog-3",
    excerpt:
      "Save time and money every week with these simple batch-cooking strategies.",
    date: "Feb 21, 2026",
    author: "Dana Kim",
    category: "Recipes",
    commentCount: 20,
  },
  {
    id: "blog-4",
    slug: "blog-4",
    title: "How to Read Nutrition Labels Like a Pro",
    image: "blog-4",
    excerpt:
      "Cut through the marketing jargon and understand what's actually in your food.",
    date: "Mar 05, 2026",
    author: "Alicia Moore",
    category: "Health",
    commentCount: 5,
  },
];

export const vendors: Vendor[] = Array.from({ length: 9 }, (_, i) => ({
  id: `vendor-${i + 1}`,
  slug: `vendor-${i + 1}`,
  name: ["Brown Shop", "Green Basket", "Urban Grocer", "Fresh Mart", "Daily Harvest"][i % 5],
  logo: `vendor-${i + 1}`,
  rating: 3.8 + ((i * 5) % 12) / 10,
  reviewCount: 40 + ((i * 21) % 300),
  productCount: 30 + ((i * 17) % 200),
  location: ["Illinois, USA", "Texas, USA", "Ohio, USA", "Nevada, USA"][i % 4],
  description:
    "A trusted seller of fresh, quality goods delivered right to your doorstep.",
}));

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Courtney Henry",
    role: "Verified Buyer",
    rating: 5,
    quote:
      "The quality of the produce is outstanding and delivery is always right on time. Storly is now my go-to for groceries.",
  },
  {
    id: "t2",
    name: "Devon Lane",
    role: "Verified Buyer",
    rating: 5,
    quote:
      "Great prices, easy checkout, and the vendor selection means I can find everything I need in one place.",
  },
  {
    id: "t3",
    name: "Jenny Wilson",
    role: "Verified Buyer",
    rating: 4,
    quote:
      "Customer support was quick to help when I had an issue with an order. Overall a very smooth experience.",
  },
];

export const faqs: FaqItem[] = [
  {
    question: "How long does delivery take?",
    answer:
      "Most orders arrive within 1-3 business days depending on your location and the vendor you order from. Express delivery is available at checkout for select areas.",
  },
  {
    question: "Can I return a product if I'm not satisfied?",
    answer:
      "Yes, we offer a 14-day return policy on most items. Perishable goods must be reported within 24 hours of delivery for a refund or replacement.",
  },
  {
    question: "Do you offer support for multiple vendors in one order?",
    answer:
      "Absolutely. Storly is a multi-vendor marketplace, so your cart can contain items from several sellers, each shipped and tracked separately.",
  },
  {
    question: "What payment methods are accepted?",
    answer:
      "We accept all major debit/credit cards, PayPal, and select digital wallets. All payments are processed securely.",
  },
  {
    question: "How do I become a vendor on Storly?",
    answer:
      "Select the vendor account option during sign up and complete your store profile. Our team reviews new vendor applications within 2 business days.",
  },
];

export const navLinks = {
  pages: [
    { label: "About Us", href: "/about" },
    { label: "Contact Us", href: "/contact" },
    { label: "FAQ", href: "/faq" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/term-and-conditions" },
  ],
};
