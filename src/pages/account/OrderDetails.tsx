// src/pages/account/OrderDetails.tsx
import { useEffect, useState, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { MapPinned, PackageX, ArrowLeft, Truck, Banknote, Printer, ExternalLink, ShieldCheck, Store } from "lucide-react";
import { Container, Section } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { AccountSidebar } from "@/components/account/AccountSidebar";
import { OrderReceipt } from "@/components/order/OrderReceipt";
import { fetchOrderDetails, type OrderDetail } from "@/api/customer";
import { formatCurrency, getImageSrc, cn } from "@/lib/utils";

const statusColors: Record<string, string> = {
  delivered: "bg-emerald-100 text-emerald-800",
  shipped: "bg-blue-100 text-blue-800",
  shipment_created: "bg-indigo-100 text-indigo-800",
  processing: "bg-amber-100 text-amber-800",
  pending: "bg-amber-100 text-amber-800",
  cancelled: "bg-rose-100 text-rose-800",
  paid: "bg-emerald-100 text-emerald-800",
};

type VendorSubOrder = {
  id: string | number;
  sub_order_no: string | number;
  order_status: string;
  shipping_fee: string | number;
  tracking_number?: string | null;
  waybill_url?: string | null;
};

export function OrderDetails() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const orderWithVendorOrders = order as (OrderDetail & {
    vendor_orders?: VendorSubOrder[];
    items: Array<OrderDetail["items"][number] & { vendor_order_id?: string | number }>;
  }) | null;
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

                  <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 space-y-4">
                    <div className="h-5 w-48 bg-gray-200 rounded-md"></div>
                    <div className="h-16 w-full bg-gray-100 rounded-xl"></div>
                  </div>
                </div>
              ) : error || !order ? (
                <div className="flex flex-col items-center gap-4 py-16 text-center">
                  <PackageX className="text-gray-400 size-16" />
                  <h2 className="text-gray-900 text-lg font-bold">Order not found</h2>
                  <Link to="/my-orders" className="text-primary-main flex items-center gap-1.5 text-sm font-semibold hover:underline">
                    <ArrowLeft className="size-4" /> Back to My Orders
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Header Card */}
                  <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-2xs">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h2 className="text-gray-900 text-lg font-extrabold">Order #{order.order_no}</h2>
                        <span
                          className={cn(
                            "rounded-full px-3 py-1 text-xs font-bold capitalize",
                            statusColors[order.order_status?.toLowerCase()] || "bg-gray-100 text-gray-700",
                          )}
                        >
                          {order.order_status?.replace("_", " ")}
                        </span>
                      </div>
                      <p className="text-gray-500 text-xs mt-1">
                        Placed on {new Date(order.created_at).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <Button
                        size="sm"
                        variant="outline"
                        icon={<Printer className="size-3.5" />}
                        onClick={() => handlePrint()}
                        className="rounded-xl font-semibold"
                      >
                        Print Receipt
                      </Button>
                      <Link to={`/track-order?id=${order.id}`}>
                        <Button size="sm" icon={<MapPinned className="size-3.5" />} className="rounded-xl font-semibold">
                          Track Shipment
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Multi-Vendor Sub-Orders Breakdown Section */}
                  {orderWithVendorOrders?.vendor_orders && orderWithVendorOrders.vendor_orders.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-gray-900 font-bold text-base flex items-center gap-2">
                          <Store className="size-4 text-primary-main" /> Shipment Packages ({orderWithVendorOrders.vendor_orders.length})
                        </h3>
                        <span className="text-xs text-gray-500 font-medium">Split fulfillment by independent sellers</span>
                      </div>

                      {orderWithVendorOrders.vendor_orders.map((subOrder) => {
                        // Find items belonging to this sub-order
                        const subOrderItems = orderWithVendorOrders.items.filter(
                          (item) => (item as typeof item & { vendor_order_id?: string | number }).vendor_order_id === subOrder.id,
                        );

                        return (
                          <div key={subOrder.id} className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-2xs">
                            {/* Sub-Order Header */}
                            <div className="bg-gray-50/80 px-6 py-3.5 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4 text-xs">
                              <div className="flex items-center gap-3">
                                <span className="font-bold text-gray-900">Sub-Order: #{subOrder.sub_order_no}</span>
                                <span className={cn("px-2.5 py-0.5 rounded-full font-semibold capitalize", statusColors[subOrder.order_status] || "bg-gray-200 text-gray-700")}>
                                  {subOrder.order_status.replace("_", " ")}
                                </span>
                              </div>
                              <div className="flex items-center gap-4 text-gray-600">
                                <span>Shipping Fee: <strong className="text-gray-900">{formatCurrency(Number(subOrder.shipping_fee))}</strong></span>
                                {subOrder.tracking_number && (
                                  <span>Tracking: <strong className="text-primary-main">{subOrder.tracking_number}</strong></span>
                                )}
                              </div>
                            </div>

                            {/* Sub-Order Items */}
                            <div className="divide-y divide-gray-100 p-2">
                              {subOrderItems.map((item) => (
                                <div key={item.id} className="flex items-center gap-4 p-4 hover:bg-gray-50/50 rounded-xl transition-colors">
                                  <div className="size-14 shrink-0 overflow-hidden rounded-xl bg-gray-100 border border-gray-100">
                                    {item.product?.thumbnail ? (
                                      <img
                                        src={getImageSrc(item.product.thumbnail)}
                                        alt={item.product.name}
                                        className="size-full object-cover"
                                      />
                                    ) : (
                                      <PlaceholderImage label={item.product?.name || "Item"} className="size-full" />
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-gray-900 text-sm font-bold truncate">{item.product?.name}</p>
                                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                                      <span>Qty: {item.quantity}</span>
                                      <span>•</span>
                                      <span>Unit Price: {formatCurrency(Number(item.unit_price))}</span>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-gray-900 text-sm font-black">{formatCurrency(Number(item.total_price))}</p>
                                    <span className="text-[11px] text-emerald-600 font-medium capitalize">
                                      {item.delivery_status?.replace("_", " ")}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Waybill Action Footer if available */}
                            {subOrder.waybill_url && (
                              <div className="bg-primary-lighter/10 px-6 py-2.5 border-t border-gray-100 flex items-center justify-between text-xs">
                                <span className="text-primary-main font-semibold">Courier Waybill generated</span>
                                <a
                                  href={subOrder.waybill_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 font-bold text-primary-main hover:underline"
                                >
                                  Download Waybill Label <ExternalLink className="size-3" />
                                </a>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Grid Cards: Shipping & Payment Summary */}
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {/* Shipping Address Card */}
                    <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-2xs">
                      <div className="pointer-events-none absolute -bottom-4 -right-4 text-primary-main opacity-[0.03]">
                        <Truck className="size-36" />
                      </div>

                      <div className="relative z-10">
                        <h4 className="text-gray-900 mb-3 text-sm font-bold flex items-center gap-2">
                          <MapPinned className="size-4 text-primary-main" /> Delivery Address
                        </h4>
                        <div className="space-y-2 text-xs sm:text-sm">
                          {order.shipping_address && (
                            <p className="text-gray-600">
                              <strong className="text-gray-900 font-semibold">Address:</strong> {order.shipping_address}
                            </p>
                          )}
                          {order.shipping_city && (
                            <p className="text-gray-600">
                              <strong className="text-gray-900 font-semibold">City:</strong> {order.shipping_city}
                            </p>
                          )}
                          {order.shipping_state && (
                            <p className="text-gray-600">
                              <strong className="text-gray-900 font-semibold">State:</strong> {order.shipping_state}
                            </p>
                          )}
                          {order.shipping_country && (
                            <p className="text-gray-600">
                              <strong className="text-gray-900 font-semibold">Country:</strong> {order.shipping_country}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Payment Summary Card */}
                    <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-2xs">
                      <div className="pointer-events-none absolute -bottom-4 -right-4 text-primary-main opacity-[0.03]">
                        <Banknote className="size-36" />
                      </div>

                      <div className="relative z-10">
                        <h4 className="text-gray-900 mb-3 text-sm font-bold flex items-center gap-2">
                          <Banknote className="size-4 text-primary-main" /> Payment Summary
                        </h4>
                        <div className="text-gray-600 space-y-2 text-xs sm:text-sm">
                          <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span className="font-semibold text-gray-900">{formatCurrency(Number(order.subtotal ?? 0))}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Shipping Cost</span>
                            <span className="font-semibold text-gray-900">{formatCurrency(Number(order.shipping_cost ?? 0))}</span>
                          </div>
                          {Number(order.discount_amount ?? 0) > 0 && (
                            <div className="flex justify-between text-emerald-600">
                              <span>Discount</span>
                              <span>-{formatCurrency(Number(order.discount_amount ?? 0))}</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span>Tax (VAT)</span>
                            <span className="font-semibold text-gray-900">{formatCurrency(Number(order.tax_amount ?? 0))}</span>
                          </div>
                          <div className="text-gray-900 flex justify-between border-t border-gray-200 pt-3 text-base font-black">
                            <span>Total Amount</span>
                            <span className="text-primary-main">{formatCurrency(Number(order.total_amount ?? 0))}</span>
                          </div>
                          <div className="pt-2 flex items-center justify-between text-[11px] text-gray-500 border-t border-gray-100 mt-2">
                            <span className="capitalize flex items-center gap-1 font-medium">
                              <ShieldCheck className="size-3.5 text-emerald-600" /> Paid via {order.payment_method} ({order.payment_status})
                            </span>
                          </div>
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