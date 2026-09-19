// src/components/account/OrderReceipt.tsx
import { forwardRef } from "react";
import { type OrderDetail } from "@/api/customer";
import { formatCurrency, getImageSrc } from "@/lib/utils";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";

interface OrderReceiptProps {
  order: OrderDetail;
}

export const OrderReceipt = forwardRef<HTMLDivElement, OrderReceiptProps>(({ order }, ref) => {
  // Generate a reliable QR code URL encoding the order number
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(
    order.order_no
  )}`;

  return (
    <div ref={ref} className="p-8 bg-white text-slate-800 font-sans max-w-2xl mx-auto">
      {/* Header with QR Code */}
      <div className="flex justify-between items-start border-b border-slate-200 pb-6 mb-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">MARKET MY ART</h1>
          <p className="text-xs text-slate-500 mt-1">Official Purchase Receipt & Invoice</p>
          <div className="mt-4 text-xs space-y-1">
            <p className="text-slate-900 font-bold">Order #{order.order_no}</p>
            <p className="text-slate-500">Date: {order.created_at}</p>
            <p className="text-emerald-600 font-semibold uppercase">Status: {order.order_status}</p>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="flex flex-col items-center bg-slate-50 p-3 rounded-xl border border-slate-200">
          <img src={qrCodeUrl} alt={`QR Code for Order ${order.order_no}`} className="size-24 object-contain" />
          <span className="text-[10px] font-mono text-slate-500 mt-1.5">Scan to Verify</span>
        </div>
      </div>

      {/* Shipping Information */}
      <div className="mb-6 grid grid-cols-2 gap-4 text-xs">
        <div>
          <h3 className="font-bold text-slate-900 uppercase tracking-wider mb-1">Shipping Details</h3>
          <p className="text-slate-600">{order.shipping_address}</p>
          <p className="text-slate-600">
            {order.shipping_city}, {order.shipping_state} {order.shipping_zip}
          </p>
          <p className="text-slate-600">{order.shipping_country}</p>
        </div>
        <div>
          <h3 className="font-bold text-slate-900 uppercase tracking-wider mb-1">Payment Method</h3>
          <p className="text-slate-600 capitalize">{order.payment_method}</p>
          <p className="text-slate-600 capitalize font-medium text-emerald-600">Payment: {order.payment_status}</p>
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full text-left border-collapse mb-6 text-xs">
        <thead>
          <tr className="border-b border-slate-300 text-slate-700">
            <th className="py-2 font-bold">Item Description</th>
            <th className="py-2 text-center font-bold">Qty</th>
            <th className="py-2 text-right font-bold">Price</th>
            <th className="py-2 text-right font-bold">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {order.items.map((item) => (
            <tr key={item.id}>
              <td className="py-3 pr-4 font-medium text-slate-900">
                <div className="flex items-center gap-3">
                  <div className="size-10 shrink-0 overflow-hidden rounded-md bg-slate-100 border border-slate-200">
                    {item.product?.thumbnail ? (
                      <img
                        src={getImageSrc(item.product.thumbnail)}
                        alt={item.name}
                        className="size-full object-cover"
                      />
                    ) : (
                      <PlaceholderImage label={item.product.name} className="size-full" />
                    )}
                  </div>
                  <span className="line-clamp-1">{item.product.name}</span>
                </div>
              </td>
              <td className="py-3 text-center text-slate-600">{item.quantity}</td>
              <td className="py-3 text-right text-slate-600">{formatCurrency(Number(item.total_price ?? 0) / item.quantity)}</td>
              <td className="py-3 text-right font-semibold text-slate-900">{formatCurrency(Number(item.total_price ?? 0))}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Summary Totals */}
      <div className="flex justify-end border-t border-slate-200 pt-4">
        <div className="w-64 space-y-1.5 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal:</span>
            <span>{formatCurrency(Number(order.subtotal ?? 0))}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Shipping:</span>
            <span>{formatCurrency(Number(order.shipping_cost ?? 0))}</span>
          </div>
          {Number(order.discount ?? 0) > 0 && (
            <div className="flex justify-between text-slate-600">
              <span>Discount:</span>
              <span>-{formatCurrency(Number(order.discount ?? 0))}</span>
            </div>
          )}
          <div className="flex justify-between text-slate-600">
            <span>Tax:</span>
            <span>{formatCurrency(Number(order.tax_amount ?? 0))}</span>
          </div>
          <div className="flex justify-between text-slate-900 font-bold text-sm border-t border-slate-200 pt-2 mt-1">
            <span>Grand Total:</span>
            <span>{formatCurrency(Number(order.total_amount ?? 0))}</span>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="border-t border-slate-200 mt-12 pt-4 text-center text-[10px] text-slate-400">
        <p>Thank you for shopping with Market My Art. This is a computer-generated receipt.</p>
      </div>
    </div>
  );
});

OrderReceipt.displayName = "OrderReceipt";