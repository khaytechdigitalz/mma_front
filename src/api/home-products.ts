// src/api/home-products.ts
import { apiClient } from "@/lib/axios";
import type { ProductItem } from "@/api/products";

export interface BestsellerCategoryGroup {
  category_id: number;
  category_name: string;
  products: ProductItem[];
}

export interface BestsellerResponse {
  status: boolean;
  message: string;
  data: BestsellerCategoryGroup[];
}

export interface TodayDealResponse {
  status: boolean;
  message: string;
  data: ProductItem[];
}

export interface FeaturedProductsResponse {
  status: boolean;
  message: string;
  data: ProductItem[];
}

export interface NewArrivalsResponse {
  status: boolean;
  message: string;
  data: ProductItem[];
}

export async function fetchBestsellers(): Promise<BestsellerResponse> {
  const response = await apiClient.get<BestsellerResponse>("/front/products/bestseller");
  return response.data;
}

export async function fetchTodayDeals(): Promise<TodayDealResponse> {
  const response = await apiClient.get<TodayDealResponse>("/front/products/today_deal");
  return response.data;
}

export async function fetchFeaturedProducts(): Promise<FeaturedProductsResponse> {
  const response = await apiClient.get<FeaturedProductsResponse>("/front/products/featured");
  return response.data;
}

export async function fetchNewArrivals(): Promise<NewArrivalsResponse> {
  const response = await apiClient.get<NewArrivalsResponse>("/front/products/new-arrival");
  return response.data;
}