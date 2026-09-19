// src/pages/account/OrderDetails.tsx
import { useEffect, useState, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { MapPinned, PackageX, ArrowLeft, Truck, Banknote, Printer } from "lucide-react";
import { Container, Section } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { AccountSidebar } from "@/components/account/AccountSidebar";
import { OrderReceipt } from "@/components/order/OrderReceipt";
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

  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: receiptRef,
    documentTitle: order ? `Invoice-Order-${order.order_no}` : "Order-Receipt",
  });

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
        title={order ? `Order #${order.order_no}` : "Order Details"}
      />
      <Section>
        <Container>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
            <AccountSidebar active="orders" />

            <div>
              {loading ? (
                /* Skeleton Loader */
                <div className="space-y-6 animate-pulse">
                  <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-200 p-5 bg-white">
                    <div className="space-y-2">
                      <div className="h-6 w-36 bg-gray-200 rounded-md"></div>
                      <div className="h-4 w-28 bg-gray-100 rounded-md"></div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-7 w-20 bg-gray-200 rounded-full"></div>
                      <div className="h-9 w-28 bg-gray-200 rounded-lg"></div>
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                    <div className="divide-y divide-gray-100">
                      {[1, 2].map((i) => (
                        <div key={i} className="flex items-center gap-4 p-4">
                          <div className="size-16 shrink-0 rounded-lg bg-gray-200"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 w-3/4 bg-gray-200 rounded-md"></div>
                            <div className="h-3 w-16 bg-gray-100 rounded-md"></div>
                          </div>
                          <div className="h-4 w-16 bg-gray-200 rounded-md"></div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="rounded-2xl border border-gray-200 p-5 bg-white space-y-3">
                      <div className="h-4 w-32 bg-gray-200 rounded-md"></div>
                      <div className="h-12 w-full bg-gray-100 rounded-md"></div>
                    </div>
                    <div className="rounded-2xl border border-gray-200 p-5 bg-white space-y-3">
                      <div className="h-4 w-32 bg-gray-200 rounded-md"></div>
                      <div className="space-y-2 pt-1">
                        <div className="h-3.5 w-full bg-gray-100 rounded-md"></div>
                        <div className="h-3.5 w-full bg-gray-100 rounded-md"></div>
                        <div className="h-4 w-full bg-gray-200 rounded-md pt-2"></div>
                      </div>
                    </div>
                  </div>
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
                  <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-300 bg-white p-5">
                    <div>
                      <p className="text-gray-primary text-lg font-bold">Order #{order.order_no}</p>
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
                      <Button
                        size="sm"
                        variant="outline"
                        icon={<Printer className="size-3.5" />}
                        onClick={() => handlePrint()}
                      >
                        Print Receipt
                      </Button>
                      <Link to={`/track-order?id=${order.id}`}>
                        <Button size="sm" icon={<MapPinned className="size-3.5" />}>
                          Track Order
                        </Button>
                      </Link>
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-2xl border border-gray-300 bg-white">
                    <div className="divide-y divide-gray-200">
                      {order.items.map((item, idx) => (
                        <div key={item.id} className="flex items-center gap-4 p-4">
                          <div className="size-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                            {order.items[idx]?.product?.thumbnail ? (
                              <img
                                src={getImageSrc(order.items[idx].product.thumbnail)}
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
                          <p className="text-gray-primary text-sm font-bold">{formatCurrency(Number(item.total_price ?? 0))}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {/* Shipping Address Card */}
                    <div className="relative overflow-hidden rounded-2xl border border-gray-300 bg-white p-5">
                      <div className="pointer-events-none absolute -bottom-4 -right-4 text-primary-main opacity-[0.04]">
                        <Truck className="size-36" />
                      </div>
                      
                      <div className="relative z-10">
                        <h4 className="text-gray-primary mb-3 text-sm font-bold flex items-center gap-2">
                          <MapPinned className="size-4 text-primary-main" /> Shipping Address
                        </h4>
                        <div className="space-y-1.5 text-sm">
                          {order.shipping_address && (
                            <p className="text-gray-secondary">
                              <strong className="text-gray-primary font-medium">Street:</strong> {order.shipping_address}
                            </p>
                          )}
                          {order.shipping_city && (
                            <p className="text-gray-secondary">
                              <strong className="text-gray-primary font-medium">City:</strong> {order.shipping_city}
                            </p>
                          )}
                          {order.shipping_state && (
                            <p className="text-gray-secondary">
                              <strong className="text-gray-primary font-medium">State:</strong> {order.shipping_state}
                            </p>
                          )}
                          {order.shipping_zip && (
                            <p className="text-gray-secondary">
                              <strong className="text-gray-primary font-medium">Zip Code:</strong> {order.shipping_zip}
                            </p>
                          )}
                          {order.shipping_country && (
                            <p className="text-gray-secondary">
                              <strong className="text-gray-primary font-medium">Country:</strong> {order.shipping_country}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Payment Summary Card */}
                    <div className="relative overflow-hidden rounded-2xl border border-gray-300 bg-white p-5">
                      <div className="pointer-events-none absolute -bottom-4 -right-4 text-primary-main opacity-[0.04]">
                        <Banknote className="size-36" />
                      </div>

                      <div className="relative z-10">
                        <h4 className="text-gray-primary mb-3 text-sm font-bold flex items-center gap-2">
                          <Banknote className="size-4 text-primary-main" /> Payment Summary
                        </h4>
                        <div className="text-gray-secondary space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>{formatCurrency(Number(order.subtotal ?? 0))}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Shipping</span>
                            <span>{formatCurrency(Number(order.shipping_cost ?? 0))}</span>
                          </div>
                          {Number(order.discount ?? 0) > 0 && (
                            <div className="flex justify-between">
                              <span>Discount</span>
                              <span>-{formatCurrency(Number(order.discount ?? 0))}</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span>Tax</span>
                            <span>{formatCurrency(Number(order.tax_amount ?? 0))}</span>
                          </div>
                          <div className="text-gray-primary flex justify-between border-t border-gray-200 pt-2 font-bold">
                            <span>Total</span>
                            <span>{formatCurrency(Number(order.total_amount ?? 0))}</span>
                          </div>
                          <p className="text-gray-tertiary pt-1 text-xs">
                            Paid via {order.payment_method} - {order.payment_status}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Hidden Printable Receipt Component Container */}
                  <div className="hidden">
                    <OrderReceipt ref={receiptRef} order={order} />
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