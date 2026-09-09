export interface Product {
  id: string;
  slug: string;
  name: string;
  image: string;
  hoverImage?: string;
  price: number;
  oldPrice?: number;
  discountPercent?: number;
  rating: number;
  reviewCount: number;
  vendor?: string;
  vendorLogo?: string;
  unit?: string;
  badge?: string;
  category?: string;
  inStock?: boolean;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  itemCount?: number;
  href?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  image: string;
  excerpt?: string;
  date: string;
  author?: string;
  category?: string;
  commentCount?: number;
}

export interface Vendor {
  id: string;
  slug: string;
  name: string;
  logo: string;
  cover?: string;
  rating: number;
  reviewCount: number;
  productCount?: number;
  location?: string;
  description?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  avatar?: string;
  rating: number;
  quote: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  vendor?: string;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface OrderItem {
  id: string;
  product: string;
  image: string;
  date: string;
  total: number;
  status: "Delivered" | "Processing" | "Cancelled" | "Shipped";
  itemCount: number;
}
