// src/pages/Cart.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, ShoppingCart, Tag, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Container, Section } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { Button } from "@/components/ui/Button";
import { formatCurrency, getImageSrc } from "@/lib/utils";
import { useStore } from "@/store/StoreContext";

export function Cart() {
  const { cartItems, cartSubtotal, cartLoading, updateCartQuantity, removeFromCart, clearCart } =
    useStore();
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [clearing, setClearing] = useState(false);

  const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
    setActionLoading(itemId);
    const result = await updateCartQuantity(itemId, newQuantity);
    if (result.success) {
      toast.success("Cart updated");
    } else {
      toast.error(result.message);
    }
    setActionLoading(null);
  };

  const handleRemoveItem = async (itemId: number) => {
    setActionLoading(itemId);
    const result = await removeFromCart(itemId);
    if (result.success) {
      toast.success("Item removed from cart");
    } else {
      toast.error(result.message);
    }
    setActionLoading(null);
  };

  const handleClearCart = async () => {
    setClearing(true);
    await clearCart();
    toast.success("Cart cleared successfully");
    setClearing(false);
  };

  if (!cartLoading && (!cartItems || cartItems.length === 0)) {
    return (
      <div>
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Cart" }]} title="Your Cart" />
        <Section>
          <Container>
            <div className="flex flex-col items-center gap-4 py-16 text-center">
              <ShoppingCart className="text-gray-tertiary size-20" />
              <h2 className="text-gray-primary text-xl font-bold">Your cart is empty</h2>
              <p className="text-gray-secondary">Looks like you haven't added anything yet.</p>
              <Link to="/products">
                <Button>Continue Shopping</Button>
              </Link>
            </div>
          </Container>
        </Section>
      </div>
    );
  }

  const shipping = cartSubtotal > 50 ? 0 : 4.99;
  const total = cartSubtotal + shipping;

  return (
    <div>
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Cart" }]} title="Your Cart" />
      <Section>
        <Container>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
            <div className="space-y-4">
              <div className="flex justify-end">
                <button
                  onClick={handleClearCart}
                  disabled={cartLoading || clearing}
                  className="text-error-dark text-sm font-medium hover:underline cursor-pointer disabled:opacity-50"
                >
                  Clear Cart
                </button>
              </div>

              {/* Responsive Container: Table on Desktop, Cards on Mobile */}
              <div className="overflow-hidden rounded-2xl border border-gray-300 bg-white">
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="text-gray-secondary px-5 py-3 text-sm font-medium">Product</th>
                        <th className="text-gray-secondary px-5 py-3 text-sm font-medium">Price</th>
                        <th className="text-gray-secondary px-5 py-3 text-sm font-medium">Quantity</th>
                        <th className="text-gray-secondary px-5 py-3 text-sm font-medium">Total</th>
                        <th className="px-5 py-3" />
                      </tr>
                    </thead>
                    <tbody>
                      {cartLoading && cartItems.length === 0 ? (
                        Array.from({ length: 3 }).map((_, index) => (
                          <tr key={index} className="border-t border-gray-200 animate-pulse">
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <div className="size-16 shrink-0 rounded-lg bg-gray-200" />
                                <div className="space-y-2 w-36">
                                  <div className="h-4 bg-gray-200 rounded w-full" />
                                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-4"><div className="h-4 bg-gray-200 rounded w-16" /></td>
                            <td className="px-5 py-4"><div className="h-9 bg-gray-200 rounded w-28" /></td>
                            <td className="px-5 py-4"><div className="h-4 bg-gray-200 rounded w-16" /></td>
                            <td className="px-5 py-4"><div className="size-4 bg-gray-200 rounded" /></td>
                          </tr>
                        ))
                      ) : (
                        cartItems.map((item) => {
                          const unitPrice = Number(item.unit_price || item.product?.unit_price || 0);
                          const itemTotal = Number(item.total_price) || unitPrice * item.quantity;
                          const isItemLoading = actionLoading === item.id;

                          return (
                            <tr key={item.id} className="border-t border-gray-200">
                              <td className="px-5 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="size-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                                    {item.product?.thumbnail ? (
                                      <img
                                        src={getImageSrc(item.product.thumbnail)}
                                        alt={item.product?.name || "Product"}
                                        className="size-full object-cover"
                                      />
                                    ) : (
                                      <PlaceholderImage label={item.product?.name || "Product"} className="size-full" />
                                    )}
                                  </div>
                                  <span className="text-gray-primary line-clamp-2 text-sm font-medium">
                                    {item.product?.name || "Product Item"}
                                  </span>
                                </div>
                              </td>
                              <td className="text-gray-primary px-5 py-4 text-sm">
                                {formatCurrency(unitPrice)}
                              </td>
                              <td className="px-5 py-4">
                                <QuantityStepper
                                  value={item.quantity}
                                  onChange={(q) => handleUpdateQuantity(item.id, q)}
                                />
                              </td>
                              <td className="text-gray-primary px-5 py-4 text-sm font-bold">
                                {formatCurrency(itemTotal)}
                              </td>
                              <td className="px-5 py-4">
                                <button
                                  onClick={() => handleRemoveItem(item.id)}
                                  disabled={isItemLoading}
                                  className="text-gray-tertiary hover:text-error-dark cursor-pointer disabled:opacity-50"
                                >
                                  {isItemLoading ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card Stack View */}
                <div className="block md:hidden divide-y divide-gray-200">
                  {cartLoading && cartItems.length === 0 ? (
                    Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="p-4 space-y-3 animate-pulse">
                        <div className="flex gap-3">
                          <div className="size-16 rounded-lg bg-gray-200 shrink-0" />
                          <div className="space-y-2 flex-1">
                            <div className="h-4 bg-gray-200 rounded w-full" />
                            <div className="h-3 bg-gray-200 rounded w-1/2" />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    cartItems.map((item) => {
                      const unitPrice = Number(item.unit_price || item.product?.unit_price || 0);
                      const itemTotal = Number(item.total_price) || unitPrice * item.quantity;
                      const isItemLoading = actionLoading === item.id;

                      return (
                        <div key={item.id} className="p-4 space-y-3">
                          <div className="flex items-start gap-3">
                            <div className="size-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                              {item.product?.thumbnail ? (
                                <img
                                  src={getImageSrc(item.product.thumbnail)}
                                  alt={item.product?.name || "Product"}
                                  className="size-full object-cover"
                                />
                              ) : (
                                <PlaceholderImage label={item.product?.name || "Product"} className="size-full" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <span className="text-gray-primary line-clamp-2 text-sm font-medium">
                                  {item.product?.name || "Product Item"}
                                </span>
                                <button
                                  onClick={() => handleRemoveItem(item.id)}
                                  disabled={isItemLoading}
                                  className="text-gray-tertiary hover:text-error-dark cursor-pointer p-1"
                                >
                                  {isItemLoading ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                                </button>
                              </div>
                              <div className="text-gray-primary text-sm mt-1 font-semibold">
                                {formatCurrency(unitPrice)}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                            <QuantityStepper
                              value={item.quantity}
                              onChange={(q) => handleUpdateQuantity(item.id, q)}
                            />
                            <div className="text-right">
                              <span className="text-[10px] uppercase text-gray-secondary block">Total</span>
                              <span className="text-gray-primary text-sm font-bold">{formatCurrency(itemTotal)}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            <aside className="h-fit space-y-5 rounded-2xl border border-gray-300 p-6 bg-white">
              <h3 className="text-gray-primary text-lg font-bold">Order Summary</h3>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="text-gray-tertiary absolute top-1/2 left-4 size-4 -translate-y-1/2" />
                  <input
                    placeholder="Coupon code"
                    className="border-gray-tertiary/32 h-11 w-full rounded-full border pr-4 pl-11 text-sm focus:outline-0"
                  />
                </div>
                <Button variant="outline" size="sm">
                  Apply
                </Button>
              </div>
              <div className="space-y-3 border-t border-gray-200 pt-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-secondary">Subtotal</span>
                  <span className="text-gray-primary font-medium">
                    {cartLoading ? <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" /> : formatCurrency(cartSubtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-secondary">Shipping</span>
                  <span className="text-gray-primary font-medium">
                    {cartLoading ? <div className="h-4 bg-gray-200 rounded w-12 animate-pulse" /> : (shipping === 0 ? "Free" : formatCurrency(shipping))}
                  </span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-3 text-base">
                  <span className="text-gray-primary font-bold">Total</span>
                  <span className="text-gray-primary font-bold">
                    {cartLoading ? <div className="h-5 bg-gray-200 rounded w-20 animate-pulse" /> : formatCurrency(total)}
                  </span>
                </div>
              </div>
              <Link to="/checkout" className="block">
                <Button fullWidth disabled={cartLoading}>Proceed to Checkout</Button>
              </Link>
            </aside>
          </div>
        </Container>
      </Section>
    </div>
  );
}