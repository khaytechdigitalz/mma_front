// src/pages/UserDashboard.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Heart, MapPin, ArrowRight } from "lucide-react";
import { Container, Section } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { AccountSidebar } from "@/components/account/AccountSidebar";
import { useStore } from "@/store/StoreContext";
import { fetchDashboard, type DashboardData, type OrderSummary } from "@/api/customer";
import { formatCurrency, cn, getImageSrc } from "@/lib/utils";

const statusColors: Record<string, string> = {
  delivered: "bg-success-light text-success-dark-main",
  shipped: "bg-info-light text-info-dark",
  processing: "bg-warning-light text-warning-dark-main",
  pending: "bg-warning-light text-warning-dark-main",
  cancelled: "bg-error-lighter text-error-dark",
};

const paymentStatusColors: Record<string, string> = {
  paid: "bg-success-light text-success-dark-main",
  pending: "bg-warning-light text-warning-dark-main",
  failed: "bg-error-lighter text-error-dark",
};

export function UserDashboard() {
  const { wishlist } = useStore();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const response = await fetchDashboard();
        if (cancelled) return;

        if (response?.data?.data) {
          setDashboardData(response.data.data);
        }
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const recentOrders = dashboardData?.last_orders || [];

  return (
    <div>
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "My Account" }]} title="My Account" />
      <Section>
        <Container>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
            <AccountSidebar active="dashboard" />

            <div className="space-y-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Link
                  to="/my-orders"
                  className="group relative rounded-2xl border border-primary-main/15 bg-primary-lighter/40 p-5 transition-all hover:border-primary-main/40 hover:bg-primary-lighter/70 hover:shadow-xs"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex size-11 items-center justify-center rounded-xl bg-primary-main text-white shadow-xs">
                      <ShoppingBag className="size-5" />
                    </div>
                    <ArrowRight className="size-4 text-primary-main/60 transition-transform group-hover:translate-x-1 group-hover:text-primary-main" />
                  </div>
                  {loading ? (
                    <div className="h-8 w-16 bg-primary-main/10 animate-pulse rounded-md mb-1"></div>
                  ) : (
                    <p className="text-gray-primary text-2xl font-bold">
                      {dashboardData?.total_orders ?? 0}
                    </p>
                  )}
                  <p className="text-gray-secondary text-xs font-semibold mt-0.5">Total Orders Placed</p>
                </Link>

                <Link
                  to="/wishlist"
                  className="group relative rounded-2xl border border-rose-500/15 bg-rose-50/40 p-5 transition-all hover:border-rose-500/40 hover:bg-rose-50/70 hover:shadow-xs"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex size-11 items-center justify-center rounded-xl bg-rose-500 text-white shadow-xs">
                      <Heart className="size-5 fill-white/20" />
                    </div>
                    <ArrowRight className="size-4 text-rose-500/60 transition-transform group-hover:translate-x-1 group-hover:text-rose-600" />
                  </div>
                  <p className="text-gray-primary text-2xl font-bold">{wishlist.length}</p>
                  <p className="text-gray-secondary text-xs font-semibold mt-0.5">Wishlist Items Saved</p>
                </Link>

                <Link
                  to="/address-book"
                  className="group relative rounded-2xl border border-amber-500/15 bg-amber-50/40 p-5 transition-all hover:border-amber-500/40 hover:bg-amber-50/70 hover:shadow-xs"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex size-11 items-center justify-center rounded-xl bg-amber-500 text-white shadow-xs">
                      <MapPin className="size-5" />
                    </div>
                    <ArrowRight className="size-4 text-amber-500/60 transition-transform group-hover:translate-x-1 group-hover:text-amber-600" />
                  </div>
                  {loading ? (
                    <div className="h-8 w-16 bg-amber-500/10 animate-pulse rounded-md mb-1"></div>
                  ) : (
                    <p className="text-gray-primary text-2xl font-bold">
                      {dashboardData?.saved_addresses_count ?? 0}
                    </p>
                  )}
                  <p className="text-gray-secondary text-xs font-semibold mt-0.5">Saved Delivery Addresses</p>
                </Link>
              </div>

              {/* Recent Orders Section */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-gray-primary text-base font-bold">Recent Orders</h3>
                    <p className="text-gray-secondary text-xs mt-0.5">Review your latest purchase activity</p>
                  </div>
                  <Link
                    to="/my-orders"
                    className="text-primary-main flex items-center gap-1 text-sm font-medium hover:underline"
                  >
                    View All <ArrowRight className="size-3.5" />
                  </Link>
                </div>

                {loading ? (
                  <div className="divide-y divide-gray-100 animate-pulse">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex flex-col gap-3 py-3.5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                          <div className="size-12 bg-gray-200 rounded-lg shrink-0"></div>
                          <div className="space-y-2">
                            <div className="h-4 w-24 bg-gray-200 rounded-md"></div>
                            <div className="h-3 w-32 bg-gray-100 rounded-md"></div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between gap-4 sm:justify-end">
                          <div className="flex gap-2">
                            <div className="h-5 w-16 bg-gray-200 rounded-full"></div>
                            <div className="h-5 w-14 bg-gray-200 rounded-full"></div>
                          </div>
                          <div className="h-4 w-16 bg-gray-200 rounded-md"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : recentOrders.length === 0 ? (
                  <div className="py-12 text-center rounded-xl border border-dashed border-gray-200 bg-gray-50/50 mt-2">
                    <p className="text-gray-secondary mb-3 text-sm">You haven't placed any orders yet.</p>
                    <Link to="/products">
                      <Button size="sm">Start Shopping</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {recentOrders.map((order: OrderSummary) => {
                      const totalItems = order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
                      return (
                        <Link
                          key={order.id}
                          to={`/order-details?id=${order.id}`}
                          className="hover:bg-primary-main/5 flex flex-col gap-3 rounded-xl p-3.5 transition-colors sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div className="flex items-start gap-3">
                            {order.items?.[0]?.product?.thumbnail && (
                              <img
                                src={getImageSrc(order.items[0].product.thumbnail)}
                                alt={order.items[0].product.name}
                                className="size-12 rounded-lg object-cover border border-gray-200 shrink-0"
                              />
                            )}
                            <div>
                              <p className="text-gray-primary text-sm font-semibold">
                                #{order.order_no}
                              </p>
                              <p className="text-gray-secondary text-xs mt-0.5">
                                {totalItems} {totalItems === 1 ? "item" : "items"} • {new Date(order.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between gap-4 sm:justify-end">
                            <div className="flex items-center gap-2">
                              <span
                                className={cn(
                                  "rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
                                  statusColors[order.order_status?.toLowerCase()] || "bg-gray-100 text-gray-600",
                                )}
                              >
                                {order.order_status}
                              </span>
                              {order.payment_status && (
                                <span
                                  className={cn(
                                    "rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
                                    paymentStatusColors[order.payment_status?.toLowerCase()] || "bg-gray-100 text-gray-600",
                                  )}
                                >
                                  {order.payment_status}
                                </span>
                              )}
                            </div>
                            <span className="text-gray-primary text-sm font-bold">
                              {formatCurrency(Number(order.total_amount ?? 0))}
                            </span>
                          </div>
                        </Link>
                      );
                    })}
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