import {apiClient} from "@/lib/axios";

export interface CheckoutSummary {
  user: {
    name: string;
    email: string;
    phone: string | null;
  };
  cart_items: Array<{
    id: number;
    cart_id: number;
    product_id: number;
    quantity: number;
    unit_price: string | number;
    total_price: string | number;
    product?: {
      id: number;
      name: string;
      slug: string;
      unit_price: string | number;
      thumbnail?: string;
    };
  }>;
  subtotal: number;
  shipping_fee: number;
  total: number;
  default_address: {
    id: number;
    user_id: number;
    address: string;
    city: string;
    zip: string;
    state: string;
    country: string;
    is_default: number;
  } | null;
  addresses: Array<{
    id: number;
    user_id: number;
    address: string;
    city: string;
    zip: string;
    state: string;
    country: string;
    is_default: number;
  }>;
  payment_gateways: Array<{
    id: number;
    name: string;
  }>;
}

export interface CheckoutPayload {
  address_id: number | null;
  payment_gateway_id: number;
  phone: string;
  shipping_fee?: number;
}

export interface CheckoutResponse {
  status: boolean;
  message: string;
  data: {
    order_id: number;
    order_code: string;
    authorization_url: string;
    redirect: string;
    grand_total: number;
  };
}

export const checkoutApi = {
  /**
   * Fetch summary data for the checkout page
   */
  async getSummary() {
    const response = await apiClient.get<{ status: boolean; data: CheckoutSummary }>("/checkout/summary");
    return response.data;
  },

  /**
   * Submit/Place the final order
   */
  async placeOrder(payload: CheckoutPayload) {
    const response = await apiClient.post<CheckoutResponse>("/checkout/place-order", payload);
    return response.data;
  },
};