// src/api/payments.ts
import {apiClient} from "@/lib/axios";

export const paymentsApi = {
  verifyPaystackOrder: async (orderId: string, reference: string) => {
    const response = await apiClient.post(`/payment/verify-paystack/${orderId}`, {
      reference,
    });
    return response.data;
  },
};