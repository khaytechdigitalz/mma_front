// src/pages/account/Orders.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, Loader2, ChevronLeft, ChevronRight, MapPinned } from "lucide-react";
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

  return (
    <div>
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "My Orders" }]} title="My Orders" />
      <Section>
        <Container>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
            <AccountSidebar active="orders" />

            <div>
              {loading ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="text-gray-tertiary size-8 animate-spin" />
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
                  <div className="overflow-hidden rounded-2xl border border-gray-300">
                    <table className="w-full text-left">
                      <thead className="bg-gray-100">
                        <tr>
                          {["Order", "Date", "Items", "Status", "Total", ""].map((h) => (
                            <th key={h} className="text-gray-secondary px-5 py-3 text-sm font-medium">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order.id} className="border-t border-gray-200">
                            <td className="text-gray-primary px-5 py-4 text-sm font-medium">
                              #{order.order_number}
                            </td>
                            <td className="text-gray-secondary px-5 py-4 text-sm">{order.created_at}</td>
                            <td className="text-gray-secondary px-5 py-4 text-sm">{order.items_count}</td>
                            <td className="px-5 py-4">
                              <span
                                className={cn(
                                  "rounded-full px-2.5 py-1 text-xs font-medium capitalize",
                                  statusColors[order.status?.toLowerCase()] || "bg-gray-100 text-gray-600",
                                )}
                              >
                                {order.status}
                              </span>
                            </td>
                            <td className="text-gray-primary px-5 py-4 text-sm font-bold">
                              {formatCurrency(order.total)}
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
                        ))}
                      </tbody>
                    </table>
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
