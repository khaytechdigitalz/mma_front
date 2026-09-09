// src/api/customer.ts
//
// Endpoints follow this project's existing `/front/...` REST convention
// (see api/carts.ts, api/frontend.ts). These specific customer-area routes
// don't exist anywhere else in the codebase yet, so their exact paths/shapes
// are a best-effort convention, not confirmed against your live backend -
// double check them against your actual Laravel routes and adjust as needed.
import { apiClient } from "@/lib/axios";

// ---------- Orders ----------
export interface OrderSummary {
  id: number;
  order_number: string;
  status: string;
  payment_status: string;
  total: number;
  items_count: number;
  created_at: string;
}

export interface OrderItem {
  id: number;
  product_id: number;
  name: string;
  thumbnail: string | null;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface OrderDetail extends OrderSummary {
  subtotal: number;
  shipping_cost: number;
  discount: number;
  tax: number;
  shipping_address: string;
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

export async function fetchOrders(page = 1) {
  const response = await apiClient.get("/front/customer/orders", { params: { page } });
  return response.data;
}

export async function fetchOrderDetails(orderId: string | number) {
  const response = await apiClient.get(`/front/customer/orders/${orderId}`);
  return response.data;
}

export async function trackOrder(orderId: string | number) {
  const response = await apiClient.get(`/front/customer/orders/${orderId}/track`);
  return response.data;
}

export async function cancelOrder(orderId: string | number) {
  const response = await apiClient.post(`/front/customer/orders/${orderId}/cancel`);
  return response.data;
}

// ---------- Addresses ----------
export interface CustomerAddress {
  id: number;
  label: string;
  full_name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  is_default: boolean;
}

export type CustomerAddressInput = Omit<CustomerAddress, "id" | "is_default">;

export async function fetchAddresses() {
  const response = await apiClient.get("/front/customer/addresses");
  return response.data;
}

export async function createAddress(data: CustomerAddressInput) {
  const response = await apiClient.post("/front/customer/addresses", data);
  return response.data;
}

export async function updateAddress(id: number, data: CustomerAddressInput) {
  const response = await apiClient.put(`/front/customer/addresses/${id}`, data);
  return response.data;
}

export async function deleteAddress(id: number) {
  const response = await apiClient.delete(`/front/customer/addresses/${id}`);
  return response.data;
}

export async function setDefaultAddress(id: number) {
  const response = await apiClient.post(`/front/customer/addresses/${id}/default`);
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
  const response = await apiClient.get("/front/customer/profile");
  return response.data;
}

export async function updateProfile(data: { name: string; email: string; phone?: string }) {
  const response = await apiClient.put("/front/customer/profile", data);
  return response.data;
}

export async function updateProfileAvatar(file: File) {
  const formData = new FormData();
  formData.append("avatar", file);
  const response = await apiClient.post("/front/customer/profile/avatar", formData, {
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
  const response = await apiClient.post("/front/customer/change-password", data);
  return response.data;
}

export async function fetchTwoFactorStatus() {
  const response = await apiClient.get("/front/customer/2fa");
  return response.data;
}

export async function enableTwoFactor() {
  // Expected to return a QR code (data URL or otpauth URI) plus a manual secret.
  const response = await apiClient.post("/front/customer/2fa/enable");
  return response.data;
}

export async function confirmTwoFactor(code: string) {
  const response = await apiClient.post("/front/customer/2fa/confirm", { code });
  return response.data;
}

export async function disableTwoFactor(code: string) {
  const response = await apiClient.post("/front/customer/2fa/disable", { code });
  return response.data;
}

// ---------- Logout ----------
export async function logoutUser() {
  const response = await apiClient.post("/auth/logout");
  return response.data;
}
