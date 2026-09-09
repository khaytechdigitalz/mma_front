import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  fetchCart,
  addToCart as apiAddToCart,
  updateCartItemQuantity as apiUpdateCartItemQuantity,
  removeCartItem as apiRemoveCartItem,
  clearCart as apiClearCart,
  type CartItem,
} from "@/api/carts";

interface AddToCartResult {
  success: boolean;
  message: string;
}

interface StoreContextValue {
  cartItems: CartItem[];
  cartLoading: boolean;
  refreshCart: () => Promise<void>;
  addToCart: (productId: number, quantity?: number) => Promise<AddToCartResult>;
  updateCartQuantity: (itemId: number, quantity: number) => Promise<AddToCartResult>;
  removeFromCart: (itemId: number) => Promise<AddToCartResult>;
  clearCart: () => Promise<void>;
  cartCount: number;
  cartSubtotal: number;

  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;

  compareList: string[];
  toggleCompare: (productId: string) => void;
  isCompared: (productId: string) => boolean;

  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  authView: AuthView;
  setAuthView: (view: AuthView) => void;
}

export type AuthView =
  | null
  | "sign-in"
  | "sign-up"
  | "forgot-password"
  | "otp"
  | "reset-password";

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartServerCount, setCartServerCount] = useState<number | null>(null);
  const [cartSubtotal, setCartSubtotal] = useState(0);
  const [cartLoading, setCartLoading] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authView, setAuthView] = useState<AuthView>(null);

  // Single source of truth for the cart: always synced from the server so the
  // header badge, the mini-cart drawer, and the cart page never fall out of sync.
  const refreshCart = useCallback(async () => {
    try {
      setCartLoading(true);
      const response = await fetchCart();
      if (response?.status && response.data) {
        setCartItems(response.data.items || []);
        setCartSubtotal(response.data.subtotal || 0);
        setCartServerCount(
          typeof response.data.total_items === "number"
            ? response.data.total_items
            : null,
        );
      }
    } catch (error) {
      // A logged-out/guest user may not have a cart yet - fail quietly and
      // keep whatever we last knew about instead of throwing in the header.
      console.error("Failed to load cart", error);
    } finally {
      setCartLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = useCallback(
    async (productId: number, quantity = 1): Promise<AddToCartResult> => {
      try {
        const response = await apiAddToCart({ product_id: productId, quantity });
        if (response?.status) {
          await refreshCart();
          setCartOpen(true);
          return { success: true, message: response.message || "Product added to cart." };
        }
        return { success: false, message: response?.message || "Failed to add product to cart." };
      } catch (error: any) {
        return {
          success: false,
          message: error?.response?.data?.message || "Failed to add product to cart.",
        };
      }
    },
    [refreshCart],
  );

  const removeFromCart = useCallback(
    async (itemId: number): Promise<AddToCartResult> => {
      try {
        const response = await apiRemoveCartItem(itemId);
        if (response?.status !== false) {
          await refreshCart();
          return { success: true, message: response?.message || "Item removed from cart." };
        }
        return { success: false, message: response?.message || "Failed to remove item." };
      } catch (error: any) {
        return {
          success: false,
          message: error?.response?.data?.message || "Failed to remove item.",
        };
      }
    },
    [refreshCart],
  );

  const updateCartQuantity = useCallback(
    async (itemId: number, quantity: number): Promise<AddToCartResult> => {
      try {
        const response = await apiUpdateCartItemQuantity(itemId, Math.max(1, quantity));
        if (response?.status !== false) {
          await refreshCart();
          return { success: true, message: response?.message || "Cart updated." };
        }
        return { success: false, message: response?.message || "Failed to update quantity." };
      } catch (error: any) {
        return {
          success: false,
          message: error?.response?.data?.message || "Failed to update quantity.",
        };
      }
    },
    [refreshCart],
  );

  const clearCart = useCallback(async () => {
    try {
      await apiClearCart();
    } catch (error) {
      console.error("Failed to clear cart", error);
    } finally {
      setCartItems([]);
      setCartSubtotal(0);
      setCartServerCount(0);
    }
  }, []);

  const toggleWishlist = useCallback((productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  }, []);

  const toggleCompare = useCallback((productId: string) => {
    setCompareList((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  }, []);

  // Prefer the server-reported total (accounts for min order qty rules etc.);
  // fall back to summing quantities locally if that field wasn't returned.
  const cartCount = useMemo(
    () =>
      cartServerCount !== null
        ? cartServerCount
        : cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartServerCount, cartItems],
  );

  const value: StoreContextValue = {
    cartItems,
    cartLoading,
    refreshCart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartCount,
    cartSubtotal,
    wishlist,
    toggleWishlist,
    isWishlisted: (id) => wishlist.includes(id),
    compareList,
    toggleCompare,
    isCompared: (id) => compareList.includes(id),
    cartOpen,
    setCartOpen,
    mobileMenuOpen,
    setMobileMenuOpen,
    authView,
    setAuthView,
  };

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
