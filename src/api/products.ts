// src/api/products.ts
import { apiClient } from "@/lib/axios";

export interface ProductItem {
  id: number;
  seller_id: number;
  brand_id: number | null;
  category_id: number;
  sub_category_id: number | null;
  name: string;
  slug: string;
  sku: string;
  product_type: string;
  unit: string | null;
  tags: string[];
  short_description: string;
  description: string;
  thumbnail: string;
  images: string[];
  unit_price: number;
  purchase_price: number;
  tax: number;
  tax_type: string;
  discount: number;
  discount_type: string;
  current_stock: number;
  minimum_order_qty: number;
  low_stock_threshold: number;
  stock_status: string;
  shipping_cost: number;
  multiply_qty: boolean;
  digital_file: string | null;
  digital_file_type: string | null;
  is_featured: boolean;
  is_todays_deal: boolean;
  published: boolean;
  status: string;
  denied_reason: string | null;
  meta_title: string | null;
  meta_description: string | null;
  meta_image: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  category: {
    id: number;
    name: string;
  };
  brand: any | null;
}

export interface ProductsResponse {
  status: boolean;
  message: string;
  data: {
    current_page: number;
    data: ProductItem[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{
      url: string | null;
      label: string;
      page: number | null;
      active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
}

export interface PaginatedProductsResponse {
  status: boolean;
  message: string;
  data: {
    current_page: number;
    data: ProductItem[];
    last_page: number;
    total: number;
    per_page: number;
    from: number;
    to: number;
  };
}


export interface ProductQueryParams {
  search?: string;
  category_id?: string | number;
  brand_id?: string | number;
  seller_id?: string | number;
  min_price?: number;
  max_price?: number;
  page?: number;
  [key: string]: any; // Allows any additional query params like sorting if needed
}

export async function fetchProducts(params: ProductQueryParams = {}) {
  const response = await apiClient.get<PaginatedProductsResponse>("/front/products", {
    params,
  });
  return response.data;
}