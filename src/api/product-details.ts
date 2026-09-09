import { apiClient } from "@/lib/axios";
import type { ProductItem } from "@/api/products";

export interface ReviewUser {
  id: number;
  name: string;
}

export interface ProductReview {
  id: number;
  product_id: number;
  user_id: number;
  rating: number;
  comment: string;
  user: ReviewUser;
}

export interface RatingSummary {
  total_reviews: number;
  average_rating: number;
  rating_counts: {
    "1": number;
    "2": number;
    "3": number;
    "4": number;
    "5": number;
  };
}

export interface RelatedProductItem {
  id: number;
  name: string;
  slug: string;
  purchase_price: number;
  unit_price?: number;
  thumbnail: string;
}

export interface ProductDetailData {
  product: ProductItem & {
    reviews: ProductReview[];
  };
  rating_summary: RatingSummary;
  related_products: RelatedProductItem[];
}

export interface ProductDetailResponse {
  status: boolean;
  message: string;
  data: ProductDetailData;
}

export async function fetchProductDetails(id: string | number): Promise<ProductDetailResponse> {
  const response = await apiClient.get<ProductDetailResponse>(`/front/products/details/${id}`);
  return response.data;
}