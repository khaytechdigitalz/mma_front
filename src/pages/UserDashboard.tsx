// src/pages/UserDashboard.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, Heart, MapPin, ArrowRight, Loader2 } from "lucide-react";
import { Container, Section } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { AccountSidebar } from "@/components/account/AccountSidebar";
import { useStore } from "@/store/StoreContext";
import { fetchProfile, fetchOrders, fetchAddresses, type OrderSummary, type CustomerProfile } from "@/api/customer";
import { formatCurrency, cn } from "@/lib/utils";

const statusColors: Record<string, string> = {
  delivered: "bg-success-light text-success-dark-main",
  shipped: "bg-info-light text-info-dark",
  processing: "bg-warning-light text-warning-dark-main",
  pending: "bg-warning-light text-warning-dark-main",
  cancelled: "bg-error-lighter text-error-dark",
};

export function UserDashboard() {
  const { wishlist } = useStore();
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [addressCount, setAddressCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const [profileRes, ordersRes, addressesRes] = await Promise.allSettled([
          fetchProfile(),
          fetchOrders(1),
          fetchAddresses(),
        ]);

        if (cancelled) return;

        if (profileRes.status === "fulfilled" && profileRes.value?.data) {
          setProfile(profileRes.value.data);
        }
        if (ordersRes.status === "fulfilled" && ordersRes.value?.data) {
          const list = Array.isArray(ordersRes.value.data)
            ? ordersRes.value.data
            : ordersRes.value.data.data || [];
          setOrders(list);
        }
        if (addressesRes.status === "fulfilled" && addressesRes.value?.data) {
          const list = Array.isArray(addressesRes.value.data) ? addressesRes.value.data : [];
          setAddressCount(list.length);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const recentOrders = orders.slice(0, 3);

  return (
    <div>
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "My Account" }]} title="My Account" />
      <Section>
        <Container>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
            <AccountSidebar active="dashboard" customer={profile || undefined} />

            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Link
                  to="/my-orders"
                  className="rounded-2xl border border-gray-300 p-5 transition-shadow hover:shadow-regular"
                >
                  <Package className="text-primary-main mb-3 size-6" />
                  <p className="text-gray-primary text-2xl font-bold">
                    {loading ? <Loader2 className="size-5 animate-spin" /> : orders.length}
                  </p>
                  <p className="text-gray-secondary text-sm">Total Orders</p>
                </Link>
                <Link
                  to="/wishlist"
                  className="rounded-2xl border border-gray-300 p-5 transition-shadow hover:shadow-regular"
                >
                  <Heart className="text-primary-main mb-3 size-6" />
                  <p className="text-gray-primary text-2xl font-bold">{wishlist.length}</p>
                  <p className="text-gray-secondary text-sm">Wishlist Items</p>
                </Link>
                <Link
                  to="/address-book"
                  className="rounded-2xl border border-gray-300 p-5 transition-shadow hover:shadow-regular"
                >
                  <MapPin className="text-primary-main mb-3 size-6" />
                  <p className="text-gray-primary text-2xl font-bold">
                    {loading ? <Loader2 className="size-5 animate-spin" /> : addressCount}
                  </p>
                  <p className="text-gray-secondary text-sm">Saved Addresses</p>
                </Link>
              </div>

              <div className="rounded-2xl border border-gray-300 p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-gray-primary text-base font-bold">Recent Orders</h3>
                  <Link
                    to="/my-orders"
                    className="text-primary-main flex items-center gap-1 text-sm font-medium hover:underline"
                  >
                    View All <ArrowRight className="size-3.5" />
                  </Link>
                </div>

                {loading ? (
                  <div className="flex justify-center py-10">
                    <Loader2 className="text-gray-tertiary size-6 animate-spin" />
                  </div>
                ) : recentOrders.length === 0 ? (
                  <div className="py-10 text-center">
                    <p className="text-gray-secondary mb-4 text-sm">You haven't placed any orders yet.</p>
                    <Link to="/products">
                      <Button size="sm">Start Shopping</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {recentOrders.map((order) => (
                      <Link
                        key={order.id}
                        to={`/order-details?id=${order.id}`}
                        className="hover:bg-primary-main/5 flex items-center justify-between gap-4 rounded-lg px-2 py-3 transition-colors"
                      >
                        <div>
                          <p className="text-gray-primary text-sm font-medium">
                            #{order.order_number}
                          </p>
                          <p className="text-gray-tertiary text-xs">{order.created_at}</p>
                        </div>
                        <span
                          className={cn(
                            "rounded-full px-2.5 py-1 text-xs font-medium capitalize",
                            statusColors[order.status?.toLowerCase()] || "bg-gray-100 text-gray-600",
                          )}
                        >
                          {order.status}
                        </span>
                        <span className="text-gray-primary text-sm font-bold">
                          {formatCurrency(order.total)}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
