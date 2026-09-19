import {apiClient} from "@/lib/axios"; 

export interface ProductSummary {
  id: number;
  name: string;
  slug: string;
  unit_price: number;
  discount: number | null;
  thumbnail: string;
  current_stock: number;
}

export interface CartItem {
  id: number;
  cart_id: number;
  product_id: number;
  seller_id: number | null;
  quantity: number;
  sku: string;
  unit_price: string;
  total_price: string;
  variation_options: any | null;
  created_at: string;
  updated_at: string;
  product: ProductSummary;
}

export interface CartData {
  cart_id: number;
  sku: string;
  items: CartItem[];
  subtotal: number;
  total_items: number;
}

export interface CartApiResponse {
  status: boolean;
  message: string;
  data: CartData;
}

export interface AddToCartPayload {
  product_id: number;
  quantity: number;
}

export interface AddToCartApiResponse {
  status: boolean;
  message: string;
  data: CartItem;
}

// GET /front/cart
export async function fetchCart(): Promise<CartApiResponse> {
  const response = await apiClient.get<CartApiResponse>("/front/cart");
  return response.data;
}

// POST /front/cart/add (Reusable from anywhere)
export async function addToCart(payload: AddToCartPayload): Promise<AddToCartApiResponse> {
  const response = await apiClient.post<AddToCartApiResponse>("/front/cart/add", {
    product_id: payload.product_id,
    quantity: payload.quantity,
  });
  return response.data;
}

// PUT /front/cart/update/{id}
export async function updateCartItemQuantity(itemId: number, quantity: number): Promise<any> {
  const response = await apiClient.put(`/front/cart/update/${itemId}`, {
    quantity,
  });
  return response.data;
}

// DELETE /front/cart/item/{id}
export async function removeCartItem(itemId: number): Promise<any> {
  const response = await apiClient.delete(`/front/cart/item/${itemId}`);
  return response.data;
}

// DELETE /front/cart/clear
export async function clearCart(): Promise<any> {
  const response = await apiClient.delete("/front/cart/clear");
  return response.data;
}