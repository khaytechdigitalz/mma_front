// src/api/customer.ts
//
// Endpoints follow this project's existing `/front/...` REST convention
// (see api/carts.ts, api/frontend.ts). These specific customer-area routes
// don't exist anywhere else in the codebase yet, so their exact paths/shapes
// are a best-effort convention, not confirmed against your live backend -
// double check them against your actual Laravel routes and adjust as needed.
import { apiClient } from "@/lib/axios";

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  unit_price: string;
  name: string;
  thumbnail: string | null;
  quantity: number;
  total: number;
  total_price: string;
  product: {
    id: number;
    name: string;
    thumbnail: string;
  };
}

export interface OrderSummary {
  id: number;
  order_no: string;
  order_status: string;
  total_amount: string;
  created_at: string;
  items: OrderItem[];
}

export interface DashboardData {
  total_orders: number;
  pending_orders: number;
  saved_addresses_count: number;
  total_spent: number;
  last_orders: OrderSummary[];
}


// ---------- Orders ----------
export interface OrderSummary {
  id: number;
  order_number: string;
  status: string;
  payment_status: string;
  payment_method: string;
  total: number;
  tax_amount: number;
  created_at: string;
}
 
export interface OrderDetail extends OrderSummary {
  subtotal: number;
  shipping_cost: number;
  discount: number;
  tax: number;
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  shipping_zip: string;
  shipping_country: string;
  payment_method: string;
  items: OrderItem[];
}

export interface TrackingStep {
  status: string;
  label: string;
  description?: string;
  timestamp: string | null;
  completed: boolean;
}


export async function fetchDashboard() {
  return apiClient.get<{ status: boolean; message: string; data: DashboardData }>("/dashboard");
}

export async function fetchOrders(page = 1) {
  const response = await apiClient.get("/orders", { params: { page } });
  return response.data;
}

export async function fetchOrderDetails(orderId: string | number) {
  const response = await apiClient.get(`/orders/${orderId}`);
  return response.data;
}

export async function trackOrder(orderId: string | number) {
  const response = await apiClient.get(`/orders/${orderId}/track`);
  return response.data;
}

export async function cancelOrder(orderId: string | number) {
  const response = await apiClient.post(`/orders/${orderId}/cancel`);
  return response.data;
}

// ---------- Addresses ----------
export interface CustomerAddress {
  id: number;
  label: string; 
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
}

export type CustomerAddressInput = Omit<CustomerAddress, "id" | "is_default">;

export async function fetchAddresses() {
  const response = await apiClient.get("/addresses");
  return response.data;
}

export async function createAddress(data: CustomerAddressInput) {
  const response = await apiClient.post("/addresses", data);
  return response.data;
}

export async function updateAddress(id: number, data: CustomerAddressInput) {
  const response = await apiClient.put(`/addresses/${id}`, data);
  return response.data;
}

export async function deleteAddress(id: number) {
  const response = await apiClient.delete(`/addresses/${id}`);
  return response.data;
}

export async function setDefaultAddress(id: number) {
  const response = await apiClient.post(`/addresses/${id}/default`);
  return response.data;
}

// ---------- Profile ----------
export interface CustomerProfile {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
}

export async function fetchProfile() {
  const response = await apiClient.get("/profile");
  return response.data;
}

export async function updateProfile(data: { name: string; email: string; phone?: string }) {
  const response = await apiClient.post("/profile", data);
  return response.data;
}

export async function updateProfileAvatar(file: File) {
  const formData = new FormData();
  formData.append("avatar", file);
  const response = await apiClient.post("/profile/avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

// ---------- Security: password & 2FA ----------
export async function changePassword(data: {
  current_password: string;
  password: string;
  password_confirmation: string;
}) {
  const response = await apiClient.post("/security/password", data);
  return response.data;
}

export async function fetchTwoFactorStatus() {
  const response = await apiClient.get("/security/2fa");
  return response.data;
}

export async function enableTwoFactor() {
  // Expected to return a QR code (data URL or otpauth URI) plus a manual secret.
  const response = await apiClient.post("/security/2fa/setup");
  return response.data;
}

export async function confirmTwoFactor(code: string) {
  const response = await apiClient.post("/security/2fa/enable", { code });
  return response.data;
}

export async function disableTwoFactor(code: string) {
  const response = await apiClient.post("/security/2fa/disable", { code });
  return response.data;
}

// ---------- Logout ----------
export async function logoutUser() {
  const response = await apiClient.post("/auth/logout");
  return response.data;
}
