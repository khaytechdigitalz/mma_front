// src/pages/account/OrderDetails.tsx
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Loader2, MapPinned, PackageX, ArrowLeft } from "lucide-react";
import { Container, Section } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { AccountSidebar } from "@/components/account/AccountSidebar";
import { fetchOrderDetails, type OrderDetail } from "@/api/customer";
import { formatCurrency, getImageSrc, cn } from "@/lib/utils";

const statusColors: Record<string, string> = {
  delivered: "bg-success-light text-success-dark-main",
  shipped: "bg-info-light text-info-dark",
  processing: "bg-warning-light text-warning-dark-main",
  pending: "bg-warning-light text-warning-dark-main",
  cancelled: "bg-error-lighter text-error-dark",
};

export function OrderDetails() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError(true);
      return;
    }

    let cancelled = false;
    fetchOrderDetails(id)
      .then((res) => {
        if (!cancelled) {
          if (res?.data) setOrder(res.data);
          else setError(true);
        }
      })
      .catch((err) => {
        console.error("Failed to load order details", err);
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <div>
      <Breadcrumb
        items={[{ label: "Home", href: "/" }, { label: "My Orders", href: "/my-orders" }, { label: "Order Details" }]}
        title={order ? `Order #${order.order_number}` : "Order Details"}
      />
      <Section>
        <Container>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
            <AccountSidebar active="orders" />

            <div>
              {loading ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="text-gray-tertiary size-8 animate-spin" />
                </div>
              ) : error || !order ? (
                <div className="flex flex-col items-center gap-4 py-16 text-center">
                  <PackageX className="text-gray-tertiary size-16" />
                  <h2 className="text-gray-primary text-lg font-bold">Order not found</h2>
                  <Link to="/my-orders" className="text-primary-main flex items-center gap-1.5 text-sm font-semibold hover:underline">
                    <ArrowLeft className="size-4" /> Back to My Orders
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-300 p-5">
                    <div>
                      <p className="text-gray-primary text-lg font-bold">Order #{order.order_number}</p>
                      <p className="text-gray-tertiary text-sm">Placed on {order.created_at}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "rounded-full px-3 py-1.5 text-xs font-medium capitalize",
                          statusColors[order.status?.toLowerCase()] || "bg-gray-100 text-gray-600",
                        )}
                      >
                        {order.status}
                      </span>
                      <Link to={`/track-order?id=${order.id}`}>
                        <Button size="sm" icon={<MapPinned className="size-3.5" />}>
                          Track Order
                        </Button>
                      </Link>
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-2xl border border-gray-300">
                    <div className="divide-y divide-gray-200">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 p-4">
                          <div className="size-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                            {item.thumbnail ? (
                              <img
                                src={getImageSrc(item.thumbnail)}
                                alt={item.name}
                                className="size-full object-cover"
                              />
                            ) : (
                              <PlaceholderImage label={item.name} className="size-full" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-primary text-sm font-medium">{item.name}</p>
                            <p className="text-gray-tertiary text-xs">Qty: {item.quantity}</p>
                          </div>
                          <p className="text-gray-primary text-sm font-bold">{formatCurrency(item.total)}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="rounded-2xl border border-gray-300 p-5">
                      <h4 className="text-gray-primary mb-3 text-sm font-bold">Shipping Address</h4>
                      <p className="text-gray-secondary text-sm">{order.shipping_address}</p>
                    </div>
                    <div className="rounded-2xl border border-gray-300 p-5">
                      <h4 className="text-gray-primary mb-3 text-sm font-bold">Payment Summary</h4>
                      <div className="text-gray-secondary space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span>{formatCurrency(order.subtotal)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Shipping</span>
                          <span>{formatCurrency(order.shipping_cost)}</span>
                        </div>
                        {order.discount > 0 && (
                          <div className="flex justify-between">
                            <span>Discount</span>
                            <span>-{formatCurrency(order.discount)}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span>Tax</span>
                          <span>{formatCurrency(order.tax)}</span>
                        </div>
                        <div className="text-gray-primary flex justify-between border-t border-gray-200 pt-2 font-bold">
                          <span>Total</span>
                          <span>{formatCurrency(order.total)}</span>
                        </div>
                        <p className="text-gray-tertiary pt-1 text-xs">
                          Paid via {order.payment_method} - {order.payment_status}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
