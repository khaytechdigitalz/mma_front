import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, Loader2, UserCheck, Edit3 } from "lucide-react";
import { Container, Section } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/store/StoreContext";
import { formatCurrency, cn } from "@/lib/utils";
import { checkoutApi } from "@/api/checkout"; 
import { EmptyCartScreen } from "@/pages/EmptyCartScreen";

export function Checkout() {
  const { clearCart } = useStore();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Guest Checkout Mode State
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

  // Form selections & Guest manual address input
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [selectedGatewayId, setSelectedGatewayId] = useState<number | null>(null);
  const [guestAddress, setGuestAddress] = useState({
    address: "",
    city: "",
    state: "",
    country: "",
    zip: "",
  });

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
          setCartItems(data.cart_items || []);
          setSubtotal(data.subtotal || 0);
          setShippingFee(data.shipping_fee || 0);
          setTotal(data.total || 0);
          setDefaultAddress(data.default_address || null);
          setAddresses(data.addresses || []);
          setPaymentGateways(data.payment_gateways || []);

          if (data.user && data.user.email) {
            setIsAuthenticated(true);
            setUserData(data.user);
          } else {
            setIsAuthenticated(false);
          }

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

    const isGuest = isGuestMode || !isAuthenticated;

    try {
      setSubmitting(true);
      const payload = {
        is_guest: isGuest,
        address_id: isGuest ? null : selectedAddressId,
        guest_address: isGuest ? guestAddress : null,
        name: userData.name,
        email: userData.email,
        phone: userData.phone || "",
        payment_gateway_id: selectedGatewayId,
        shipping_fee: shippingFee,
      };

      // Call guest checkout API if guest mode or not logged in
      const res = isGuest 
        ? await checkoutApi.placeOrderGuest(payload)
        : await checkoutApi.placeOrder(payload);

      if (res?.status && res?.data) {
        await clearCart();

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

  function handleEnableGuestCheckout() {
    setIsGuestMode(true);
    showToast("Guest checkout enabled. You can now fill in your details.");
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="text-primary-main size-8 animate-spin" />
      </div>
    );
  }

  if (!loading && cartItems.length === 0) {
    return <EmptyCartScreen />;
  }

  // If not logged in and guest mode is not active, display prompt to log in or checkout as guest
  if (!isAuthenticated && !isGuestMode) {
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
        <Section>
          <Container>
            <div className="flex flex-col items-center justify-center py-16 text-center max-w-md mx-auto space-y-4 rounded-2xl border border-gray-200 bg-white p-8 shadow-xs">
              <div className="size-16 rounded-full bg-primary-lighter/40 flex items-center justify-center text-primary-main mb-2 shadow-inner">
                <UserCheck className="size-8" />
              </div>
              <h2 className="text-gray-primary text-xl font-bold tracking-tight">Authentication Required</h2>
              <p className="text-gray-secondary text-sm">
                Please log in to your account to proceed with checkout, or continue as a guest.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 w-full pt-4">
                <Button 
                  onClick={() => navigate("/login")}
                  className="flex-1 py-3 rounded-xl bg-primary-main text-white font-bold shadow-md"
                >
                  Log In to Account
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleEnableGuestCheckout}
                  className="flex-1 py-3 rounded-xl border-gray-300 font-bold hover:bg-gray-50"
                >
                  Checkout as Guest
                </Button>
              </div>
            </div>
          </Container>
        </Section>
      </div>
    );
  }

  const activeInputClass =
    "border-gray-300 focus:border-primary-main focus:ring-primary-main/20 h-12 w-full rounded-xl border bg-white px-4 text-sm text-gray-900 transition-all focus:ring-4 focus:outline-0";
  
  const readOnlyInputClass =
    "border-gray-200 h-12 w-full rounded-xl border bg-gray-50 px-4 text-sm text-gray-500 focus:outline-0 cursor-not-allowed";

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
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <div>
                    <h3 className="text-gray-primary text-lg font-bold">Shipping Information</h3>
                    <p className="text-gray-500 text-xs mt-0.5">
                      {isGuestMode || !isAuthenticated ? "Entering details as a guest checkout" : "Using your saved account profile"}
                    </p>
                  </div>
                  {isAuthenticated && (
                    <button
                      type="button"
                      onClick={() => setIsGuestMode((prev) => !prev)}
                      className={cn(
                        "inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer border",
                        isGuestMode
                          ? "bg-primary-main text-white border-primary-main shadow-sm"
                          : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                      )}
                    >
                      {isGuestMode ? <UserCheck className="size-4" /> : <Edit3 className="size-4" />}
                      {isGuestMode ? "Guest Mode Active" : "Switch to Guest?"}
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2">
                  <div>
                    <label className="text-gray-secondary mb-1.5 block text-xs font-semibold">Full Name</label>
                    <input
                      required
                      value={userData.name || ""}
                      onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                      readOnly={isAuthenticated && !isGuestMode}
                      className={isAuthenticated && !isGuestMode ? readOnlyInputClass : activeInputClass}
                      placeholder="Enter full name"
                    />
                  </div>
                  <div>
                    <label className="text-gray-secondary mb-1.5 block text-xs font-semibold">Email Address</label>
                    <input
                      required
                      type="email"
                      value={userData.email || ""}
                      onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                      readOnly={isAuthenticated && !isGuestMode}
                      className={isAuthenticated && !isGuestMode ? readOnlyInputClass : activeInputClass}
                      placeholder="Enter email address"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-gray-secondary mb-1.5 block text-xs font-semibold">Phone Number</label>
                    <input
                      required
                      type="tel"
                      value={userData.phone || ""}
                      onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                      readOnly={isAuthenticated && !isGuestMode}
                      className={isAuthenticated && !isGuestMode ? readOnlyInputClass : activeInputClass}
                      placeholder="Enter phone number"
                    />
                  </div>

                  {/* Delivery Address Section */}
                  <div className="sm:col-span-2 pt-2">
                    <label className="text-gray-secondary mb-1.5 block text-xs font-semibold">Delivery Address</label>
                    {isGuestMode || !isAuthenticated ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="sm:col-span-2">
                          <input
                            required
                            placeholder="Street Address"
                            value={guestAddress.address}
                            onChange={(e) => setGuestAddress({ ...guestAddress, address: e.target.value })}
                            className={activeInputClass}
                          />
                        </div>
                        <div>
                          <input
                            required
                            placeholder="City"
                            value={guestAddress.city}
                            onChange={(e) => setGuestAddress({ ...guestAddress, city: e.target.value })}
                            className={activeInputClass}
                          />
                        </div>
                        <div>
                          <input
                            required
                            placeholder="State / Province"
                            value={guestAddress.state}
                            onChange={(e) => setGuestAddress({ ...guestAddress, state: e.target.value })}
                            className={activeInputClass}
                          />
                        </div>
                        <div>
                          <input
                            required
                            placeholder="Country"
                            value={guestAddress.country}
                            onChange={(e) => setGuestAddress({ ...guestAddress, country: e.target.value })}
                            className={activeInputClass}
                          />
                        </div>
                        <div>
                          <input
                            placeholder="ZIP / Postal Code"
                            value={guestAddress.zip}
                            onChange={(e) => setGuestAddress({ ...guestAddress, zip: e.target.value })}
                            className={activeInputClass}
                          />
                        </div>
                      </div>
                    ) : defaultAddress ? (
                      <div className="border-gray-200 flex items-center justify-between rounded-xl border p-4 bg-gray-50/50">
                        <div>
                          <p className="text-gray-primary text-sm font-semibold">
                            {defaultAddress.address}, {defaultAddress.city}, {defaultAddress.state}, {defaultAddress.country}
                          </p>
                          <p className="text-gray-400 text-xs mt-0.5">ZIP Code: {defaultAddress.zip || "N/A"}</p>
                        </div>
                        <span className="bg-primary-lighter/50 text-primary-main rounded-full px-3 py-1 text-xs font-bold">
                          Default Address
                        </span>
                      </div>
                    ) : (
                      <p className="text-sm text-red-500 font-medium">No default address found. Switch to guest mode to enter your address manually.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
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
                          "flex flex-col items-center gap-2 rounded-xl border p-4 text-sm font-semibold transition-all cursor-pointer",
                          isSelected
                            ? "border-primary-main text-primary-main bg-primary-lighter/20 shadow-xs ring-2 ring-primary-main/20"
                            : "border-gray-200 text-gray-600 hover:bg-gray-50",
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
            <aside className="h-fit space-y-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-xs sticky top-6">
              <h3 className="text-gray-primary text-lg font-bold border-b border-gray-100 pb-4">Order Summary</h3>
              <div className="max-h-64 space-y-3 overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="flex-1">
                      <p className="text-gray-primary line-clamp-1 text-sm font-semibold">
                        {item.product?.name || "Product Item"}
                      </p>
                      <p className="text-gray-400 text-xs">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-gray-primary text-sm font-bold">
                      {formatCurrency(Number(item.total_price || 0))}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-3.5 border-t border-gray-100 pt-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-secondary">Subtotal</span>
                  <span className="text-gray-primary font-bold">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-secondary">Shipping</span>
                  <span className="text-gray-primary font-bold">
                    {shippingFee === 0 ? <span className="text-emerald-600 font-bold uppercase text-xs bg-emerald-50 px-2 py-0.5 rounded">Free</span> : formatCurrency(shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-gray-100 pt-4 text-base">
                  <span className="text-gray-primary font-black">Total Amount</span>
                  <span className="text-primary-main text-lg font-black">{formatCurrency(total)}</span>
                </div>
              </div>

              <Button type="submit" fullWidth disabled={cartItems.length === 0 || submitting} className="py-3.5 rounded-xl font-bold shadow-md">
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