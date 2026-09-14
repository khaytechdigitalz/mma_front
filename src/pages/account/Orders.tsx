// src/pages/account/Orders.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, ChevronLeft, ChevronRight, MapPinned, CreditCard } from "lucide-react";
import { Container, Section } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { AccountSidebar } from "@/components/account/AccountSidebar";
import { fetchOrders, type OrderSummary } from "@/api/customer";
import { formatCurrency, cn } from "@/lib/utils";

const statusColors: Record<string, string> = {
  delivered: "bg-success-light text-success-dark-main",
  shipped: "bg-info-light text-info-dark",
  processing: "bg-warning-light text-warning-dark-main",
  pending: "bg-warning-light text-warning-dark-main",
  cancelled: "bg-error-lighter text-error-dark",
};

export function Orders() {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(false);
      try {
        const res = await fetchOrders(page);
        if (!cancelled) {
          const payload = res?.data;
          const list = Array.isArray(payload) ? payload : payload?.data || [];
          setOrders(list);
          setTotalPages(payload?.last_page || 1);
        }
      } catch (err) {
        console.error("Failed to load orders", err);
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [page]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div>
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "My Orders" }]} title="My Orders" />
      <Section>
        <Container>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
            <AccountSidebar active="orders" />

            <div>
              {loading ? (
                <div className="space-y-4 animate-pulse">
                  {/* Desktop Table Skeleton */}
                  <div className="hidden md:block overflow-hidden rounded-2xl border border-gray-200 bg-white">
                    <div className="bg-gray-100 px-5 py-3 flex gap-6">
                      {[60, 80, 50, 70, 70, 60, 70].map((w, i) => (
                        <div key={i} className={`h-4 bg-gray-200 rounded`} style={{ width: `${w}px` }}></div>
                      ))}
                    </div>
                    <div className="divide-y divide-gray-100">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="px-5 py-4 flex items-center justify-between">
                          <div className="h-4 w-24 bg-gray-200 rounded"></div>
                          <div className="h-4 w-20 bg-gray-100 rounded"></div>
                          <div className="h-4 w-16 bg-gray-100 rounded"></div>
                          <div className="h-4 w-16 bg-gray-100 rounded"></div>
                          <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
                          <div className="h-4 w-20 bg-gray-200 rounded"></div>
                          <div className="flex gap-2">
                            <div className="h-8 w-14 bg-gray-200 rounded-lg"></div>
                            <div className="h-8 w-14 bg-gray-200 rounded-lg"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mobile Card Skeleton */}
                  <div className="grid grid-cols-1 gap-4 md:hidden">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="rounded-2xl border border-gray-200 p-4 space-y-3 bg-white">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                          <div className="space-y-1">
                            <div className="h-4 w-24 bg-gray-200 rounded"></div>
                            <div className="h-3 w-20 bg-gray-100 rounded"></div>
                          </div>
                          <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
                        </div>
                        <div className="flex justify-between">
                          <div className="h-3 w-16 bg-gray-100 rounded"></div>
                          <div className="h-3 w-20 bg-gray-100 rounded"></div>
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <div className="h-5 w-24 bg-gray-200 rounded"></div>
                          <div className="flex gap-2">
                            <div className="h-8 w-14 bg-gray-200 rounded-lg"></div>
                            <div className="h-8 w-14 bg-gray-200 rounded-lg"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : error ? (
                <p className="text-error-dark py-10 text-center text-sm">
                  Couldn't load your orders. Please try again shortly.
                </p>
              ) : orders.length === 0 ? (
                <div className="flex flex-col items-center gap-4 py-16 text-center">
                  <Package className="text-gray-tertiary size-16" />
                  <h2 className="text-gray-primary text-lg font-bold">No orders yet</h2>
                  <p className="text-gray-secondary text-sm">
                    Your past and current orders will show up here.
                  </p>
                  <Link to="/products">
                    <Button size="sm">Start Shopping</Button>
                  </Link>
                </div>
              ) : (
                <>
                  {/* Desktop Table View */}
                  <div className="hidden md:block overflow-hidden rounded-2xl border border-gray-300 bg-white">
                    <table className="w-full text-left">
                      <thead className="bg-gray-100">
                        <tr>
                          {["Order", "Date", "Items", "Payment", "Status", "Total", ""].map((h) => (
                            <th key={h} className="text-gray-secondary px-5 py-3 text-sm font-medium">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => {
                          const orderNo = order.order_no || order.order_number;
                          const totalItems = order.items?.reduce((sum, item) => sum + item.quantity, 0) || order.items.length;
                          return (
                            <tr key={order.id} className="border-t border-gray-200 hover:bg-gray-50/50 transition-colors">
                              <td className="text-gray-primary px-5 py-4 text-sm font-medium">
                                #{orderNo}
                              </td>
                              <td className="text-gray-secondary px-5 py-4 text-sm">
                                {formatDate(order.created_at)}
                              </td>
                              <td className="text-gray-secondary px-5 py-4 text-sm">
                                {totalItems} Item(s)
                              </td>
                              <td className="text-gray-secondary px-5 py-4 text-sm uppercase">
                                {order.payment_method || "—"}
                              </td>
                              <td className="px-5 py-4">
                                <span
                                  className={cn(
                                    "rounded-full px-2.5 py-1 text-xs font-medium capitalize",
                                    statusColors[order.order_status?.toLowerCase()] || "bg-gray-100 text-gray-600",
                                  )}
                                >
                                  {order.order_status}
                                </span>
                              </td>
                              <td className="text-gray-primary px-5 py-4 text-sm font-bold">
                                {formatCurrency(Number(order.total_amount))}
                              </td>
                              <td className="px-5 py-4">
                                <div className="flex items-center gap-2">
                                  <Link to={`/order-details?id=${order.id}`}>
                                    <Button size="sm" variant="outline">
                                      View
                                    </Button>
                                  </Link>
                                  <Link to={`/track-order?id=${order.id}`}>
                                    <Button size="sm" variant="ghost" icon={<MapPinned className="size-3.5" />}>
                                      Track
                                    </Button>
                                  </Link>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Card-Based View */}
                  <div className="grid grid-cols-1 gap-4 md:hidden">
                    {orders.map((order) => {
                      const orderNo = order.order_no || order.order_number;
                      const totalItems = order.items?.reduce((sum, item) => sum + item.quantity, 0) || order.items.length;
                      return (
                        <div
                          key={order.id}
                          className="rounded-2xl border border-gray-300 p-4 space-y-3 bg-white shadow-xs"
                        >
                          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                            <div>
                              <p className="text-gray-primary text-sm font-bold">#{orderNo}</p>
                              <p className="text-gray-tertiary text-xs">{formatDate(order.created_at)}</p>
                            </div>
                            <span
                              className={cn(
                                "rounded-full px-2.5 py-1 text-xs font-medium capitalize",
                                statusColors[order.order_status?.toLowerCase()] || "bg-gray-100 text-gray-600",
                              )}
                            >
                              {order.order_status}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-xs text-gray-secondary">
                            <span>{totalItems} item(s)</span>
                            {order.payment_method && (
                              <span className="uppercase flex items-center gap-1 font-medium text-gray-primary">
                                <CreditCard className="size-3 text-gray-400" /> {order.payment_method}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center justify-between pt-1">
                            <span className="text-gray-primary text-base font-bold">
                              {formatCurrency(Number(order.total_amount))}
                            </span>
                            <div className="flex items-center gap-2">
                              <Link to={`/order-details?id=${order.id}`}>
                                <Button size="sm" variant="outline">
                                  View
                                </Button>
                              </Link>
                              <Link to={`/track-order?id=${order.id}`}>
                                <Button size="sm" variant="ghost" icon={<MapPinned className="size-3.5" />}>
                                  Track
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {totalPages > 1 && (
                    <div className="mt-8 flex items-center justify-center gap-2">
                      <button
                        onClick={() => setPage((p) => Math.max(p - 1, 1))}
                        disabled={page === 1}
                        className="flex size-10 items-center justify-center rounded-full border border-gray-200 text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 cursor-pointer"
                      >
                        <ChevronLeft className="size-4" />
                      </button>
                      <span className="text-gray-secondary text-sm px-2">
                        Page {page} of {totalPages}
                      </span>
                      <button
                        onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                        disabled={page === totalPages}
                        className="flex size-10 items-center justify-center rounded-full border border-gray-200 text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 cursor-pointer"
                      >
                        <ChevronRight className="size-4" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}