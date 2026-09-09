import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, Loader2, Truck } from "lucide-react";
import { Container, Section } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/store/StoreContext";
import { formatCurrency, cn } from "@/lib/utils";
import { checkoutApi } from "@/api/checkout"; 
import { EmptyCartScreen } from "@/pages/EmptyCartScreen";

const inputClass =
  "border-gray-tertiary/32 h-12 w-full rounded-lg border bg-gray-50 px-4 text-sm text-gray-500 focus:outline-0 cursor-not-allowed";

export function Checkout() {
  const { clearCart } = useStore();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Data loaded from checkoutApi.getSummary()
  const [userData, setUserData] = useState<{ name: string; email: string; phone: string | null }>({
    name: "",
    email: "",
    phone: "",
  });
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [shippingFee, setShippingFee] = useState(0);
  const [total, setTotal] = useState(0);
  const [defaultAddress, setDefaultAddress] = useState<any>(null);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [paymentGateways, setPaymentGateways] = useState<any[]>([]);

  // Form selections
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [selectedGatewayId, setSelectedGatewayId] = useState<number | null>(null);

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  function showToast(message: string) {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  }

  useEffect(() => {
    async function fetchCheckoutSummary() {
      try {
        setLoading(true);
        const res = await checkoutApi.getSummary();
        
        if (res?.status && res?.data) {
          const data = res.data;
          setUserData(data.user || {});
          setCartItems(data.cart_items || []);
          setSubtotal(data.subtotal || 0);
          setShippingFee(data.shipping_fee || 0);
          setTotal(data.total || 0);
          setDefaultAddress(data.default_address || null);
          setAddresses(data.addresses || []);
          setPaymentGateways(data.payment_gateways || []);

          if (data.default_address?.id) {
            setSelectedAddressId(data.default_address.id);
          }
          if (data.payment_gateways?.length > 0) {
            setSelectedGatewayId(data.payment_gateways[0].id);
          }
        }
      } catch (err: any) {
        console.error("Failed to load checkout summary", err);
        setError(err.response?.data?.message || err.message || "Failed to load checkout details.");
      } finally {
        setLoading(false);
      }
    }

    fetchCheckoutSummary();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (selectedGatewayId === null) {
      showToast("Please select a payment method.");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        address_id: selectedAddressId,
        payment_gateway_id: selectedGatewayId,
        phone: userData.phone || "",
        shipping_fee: shippingFee,
      };

      const res = await checkoutApi.placeOrder(payload);

      if (res?.status && res?.data) {
        await clearCart();

        // Check if the gateway requests a payment redirect (e.g., Paystack)
        if (res.data.redirect && res.data.authorization_url) {
          showToast("Redirecting to payment gateway...");
          window.location.href = res.data.authorization_url;
        } else {
          navigate("/order-success");
        }
      }
    } catch (err: any) {
      console.error("Checkout submission failed", err);
      const errorMessage = err.response?.data?.message || err.message || "Checkout failed. Please check your inputs.";
      showToast(errorMessage);
      setSubmitting(false);
    }
  }

  function handleGuestClick() {
    showToast("🚀 Checkout as Guest feature is coming soon!");
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="text-primary-main size-8 animate-spin" />
      </div>
    );
  }

  // Show EmptyCartScreen if cart items are empty or fetch resulted in no items
  if (!loading && cartItems.length === 0) {
    return <EmptyCartScreen />;
  }

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Cart", href: "/cart" },
          { label: "Checkout" },
        ]}
        title="Checkout"
      />

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white shadow-xl transition-all">
          {toastMessage}
        </div>
      )}

      <Section>
        <Container>
          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
            <div className="space-y-8">
              {/* Customer & Shipping Information */}
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-gray-primary text-lg font-bold">Shipping Information</h3>
                  <button
                    type="button"
                    onClick={handleGuestClick}
                    className="text-primary-main hover:underline text-xs font-semibold cursor-pointer"
                  >
                    Checkout as Guest?
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-gray-secondary mb-1 block text-xs font-medium">Full Name</label>
                    <input readOnly value={userData.name || ""} className={inputClass} />
                  </div>
                  <div>
                    <label className="text-gray-secondary mb-1 block text-xs font-medium">Email Address</label>
                    <input readOnly value={userData.email || ""} className={inputClass} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-gray-secondary mb-1 block text-xs font-medium">Phone Number</label>
                    <input readOnly value={userData.phone || ""} className={inputClass} />
                  </div>

                  {/* Delivery Address Selector / Display */}
                  <div className="sm:col-span-2">
                    <label className="text-gray-secondary mb-1 block text-xs font-medium">Delivery Address</label>
                    {defaultAddress ? (
                      <div className="border-gray-tertiary/32 flex items-center justify-between rounded-lg border p-4 bg-white">
                        <div>
                          <p className="text-gray-primary text-sm font-medium">
                            {defaultAddress.address}, {defaultAddress.city}, {defaultAddress.state}, {defaultAddress.country}
                          </p>
                          <p className="text-gray-tertiary text-xs mt-0.5">ZIP Code: {defaultAddress.zip || "N/A"}</p>
                        </div>
                        <span className="bg-primary-lighter text-primary-main rounded-full px-2.5 py-1 text-xs font-semibold">
                          Default Address
                        </span>
                      </div>
                    ) : (
                      <p className="text-sm text-red-500">No default address found. Please add an address in your profile.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <h3 className="text-gray-primary mb-4 text-lg font-bold">Payment Method</h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {paymentGateways.map((gateway) => {
                    const isSelected = selectedGatewayId === gateway.id;
                    return (
                      <button
                        type="button"
                        key={gateway.id}
                        onClick={() => setSelectedGatewayId(gateway.id)}
                        className={cn(
                          "flex flex-col items-center gap-2 rounded-xl border p-4 text-sm font-medium transition-colors cursor-pointer",
                          isSelected
                            ? "border-primary-main text-primary-main bg-primary-lighter/30"
                            : "border-gray-300 text-gray-secondary",
                        )}
                      >
                        <CreditCard className="size-5" />
                        {gateway.name}
                      </button>
                    );
                  })} 
                </div>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <aside className="h-fit space-y-5 rounded-2xl border border-gray-300 p-6 bg-white">
              <h3 className="text-gray-primary text-lg font-bold">Order Summary</h3>
              <div className="max-h-64 space-y-3 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="flex-1">
                      <p className="text-gray-primary line-clamp-1 text-sm font-medium">
                        {item.product?.name || "Product Item"}
                      </p>
                      <p className="text-gray-tertiary text-xs">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-gray-primary text-sm font-medium">
                      {formatCurrency(Number(item.total_price || 0))}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t border-gray-200 pt-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-secondary">Subtotal</span>
                  <span className="text-gray-primary font-medium">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-secondary">Shipping</span>
                  <span className="text-gray-primary font-medium">
                    {shippingFee === 0 ? "Free" : formatCurrency(shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-3 text-base">
                  <span className="text-gray-primary font-bold">Total</span>
                  <span className="text-gray-primary font-bold">{formatCurrency(total)}</span>
                </div>
              </div>

              <Button type="submit" fullWidth disabled={cartItems.length === 0 || submitting}>
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="size-4 animate-spin" />
                    Processing...
                  </span>
                ) : (
                  "Place Order"
                )}
              </Button>
            </aside>
          </form>
        </Container>
      </Section>
    </div>
  );
}