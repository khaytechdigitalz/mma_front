import { apiClient } from "@/lib/axios";

export interface FrontendContentItem {
  id: number;
  component: string;
  type: string;
  slug: string;
  value: string;
  status: boolean;
}

export const frontendApi = {
  getComponent: async (componentName: string) => {
    const response = await apiClient.get(`/front/component/${componentName}`);
    return response.data;
  },

  // Fetch front blog listing
  async getBlogs(page = 1, perPage = 15) {
    const response = await apiClient.get(`/front/blogs`, {
      params: { page, per_page: perPage },
    });
    return response.data;
  },

  // Optional: Fetch a single blog by slug or ID
  async getBlogDetails(slugOrId: string | number) {
    const response = await apiClient.get(`/front/blogs/${slugOrId}`);
    return response.data;
  },
};