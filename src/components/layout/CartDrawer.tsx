import { useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, ShoppingCart, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Drawer } from "@/components/ui/Drawer";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { Button } from "@/components/ui/Button";
import { formatCurrency, cn, getImageSrc } from "@/lib/utils";
import { useStore } from "@/store/StoreContext";

export function CartDrawer({
  cartOpen,
  setCartOpen,
}: {
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
}) {
  const { cartItems, cartSubtotal, cartLoading, updateCartQuantity, removeFromCart } = useStore();
  const [actionLoading, setActionLoading] = useState<number | null>(null);

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

  return (
    <Drawer
      open={cartOpen}
      onClose={() => setCartOpen(false)}
      title={`Shopping Cart (${cartItems.length})`}
    >
      {cartLoading && cartItems.length === 0 ? (
        <div className="flex h-full items-center justify-center">
          <Loader2 className="size-8 animate-spin text-gray-secondary" />
        </div>
      ) : cartItems.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
          <ShoppingCart className="text-gray-tertiary size-16" />
          <p className="text-gray-secondary">Your cart is empty.</p>
          <Link
            to="/products"
            onClick={() => setCartOpen(false)}
            className={cn(
              "bg-primary-main text-success-light hover:bg-primary-main-dark hover:text-white inline-flex h-12 items-center justify-center rounded-full px-6 text-sm font-medium transition-all",
            )}
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="flex h-full flex-col">
          <div className="flex-1 space-y-4 overflow-y-auto p-5">
            {cartItems.map((item) => {
              const unitPrice = Number(item.unit_price || item.product?.unit_price || 0);
              const itemTotal = Number(item.total_price) || unitPrice * item.quantity;
              const isItemLoading = actionLoading === item.id;

              return (
                <div
                  key={item.id}
                  className="flex gap-3 border-b border-gray-200 pb-4 last:border-0"
                >
                  <div className="size-20 shrink-0 overflow-hidden rounded-lg bg-gray-100">
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
                  <div className="flex flex-1 flex-col gap-2">
                    <h4 className="text-gray-primary line-clamp-2 text-sm font-medium">
                      {item.product?.name || "Product Item"}
                    </h4>
                    <div className="flex items-center justify-between">
                      <QuantityStepper
                        value={item.quantity}
                        onChange={(q) => handleUpdateQuantity(item.id, q)}
                        className="scale-90 origin-left"
                      />
                      <span className="text-gray-primary text-sm font-bold">
                        {formatCurrency(itemTotal)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    disabled={isItemLoading}
                    className="text-gray-tertiary hover:text-error-dark h-fit cursor-pointer disabled:opacity-50"
                    aria-label="Remove item"
                  >
                    {isItemLoading ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Trash2 className="size-4" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
          <div className="border-gray-tertiary/24 space-y-4 border-t p-5">
            <div className="flex items-center justify-between">
              <span className="text-gray-secondary text-base">Sub Total</span>
              <span className="text-gray-primary text-lg font-bold">
                {formatCurrency(cartSubtotal)}
              </span>
            </div>
            <Link to="/cart" onClick={() => setCartOpen(false)}>
              <Button variant="outline" fullWidth>
                View Cart
              </Button>
            </Link>
            <hr className="border-white" />
            <Link to="/checkout" onClick={() => setCartOpen(false)}>
              <Button fullWidth>Checkout</Button>
            </Link>
          </div>
        </div>
      )}
    </Drawer>
  );
}
