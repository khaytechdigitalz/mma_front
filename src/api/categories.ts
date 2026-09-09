import { apiClient } from "@/lib/axios";

export interface SubCategory {
  id: number;
  category_id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
  banner: string | null;
  priority: number;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
  sub_categories: SubCategory[];
}

interface CategoriesResponse {
  status: boolean;
  message: string;
  data: Category[];
}

export async function fetchCategories(): Promise<Category[]> {
  const res = await apiClient.get<CategoriesResponse>("/front/categories");
  return res.data.data;
}