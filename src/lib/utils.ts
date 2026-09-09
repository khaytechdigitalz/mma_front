const API_BASE_URL = import.meta.env.NEXT_PUBLIC_STORAGE_URL as string;
import { apiClient } from "@/lib/axios";

export function cn(...inputs: Array<string | false | null | undefined>) {
  return inputs.filter(Boolean).join(" ");
}

let currencySymbol = "₦"; // Default fallback symbol

// Automatically fetch the currency symbol when the module loads (runs on every browser refresh)
const fetchCurrencySymbol = async () => {
  try {
    const response = await apiClient.get("/front/currency");
    if (response.data?.status && response.data?.data?.value) {
      currencySymbol = response.data.data.value;
    }
  } catch (error) {
    console.error("Failed to fetch currency symbol:", error);
  }
};

fetchCurrencySymbol();

export function formatCurrency(value: number): string {
  return `${currencySymbol}${value.toFixed(2)}`;
}

/**
 * Resolves media storage URLs, supporting full external URLs and relative storage paths.
 */
export function getImageSrc(path?: string | null, fallback: string = "/images/placeholder.png"): string {
  if (!path) return fallback;
  return path.startsWith("http")
    ? path
    : `${API_BASE_URL || ""}/${path}`;
}
