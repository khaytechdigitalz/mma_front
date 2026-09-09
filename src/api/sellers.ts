import {apiClient} from "@/lib/axios";

export interface Storefront {
  id: number;
  name: string;
  slug: string;
  logo: string | null;
  banner: string | null;
  description: string | null;
}

export interface VendorItem {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
  storefront?: Storefront | null;
  total_products?: number;
  average_rating?: number;
  total_reviews?: number;
  location?: string;
}

export async function fetchSellers(params?: Record<string, any>) {
  const response = await apiClient.get("/front/sellers", { params });
  return response.data;
}

export async function fetchSellerDetails(id: string | number) {
  const response = await apiClient.get(`/front/sellers/details/${id}`);
  return response.data;
}