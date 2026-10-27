"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { formatBDT } from "@/lib/utils";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Printer,
  Truck,
  CheckCircle2,
  Package,
  History,
  CreditCard,
  User,
  MapPin,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { OrderStatus, PaymentStatus } from "@prisma/client";

interface OrderDetailManagerProps {
  order: {
    id: string;
    orderNumber: string;
    trackingToken: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    paymentMethod: string;
    currency: string;
    subtotal: number;
    discountAmount: number;
    shippingFee: number;
    totalAmount: number;
    shippingAddress: string;
    customerNotes?: string | null;
    createdAt: Date | string;
    items: {
      id: string;
      productName: string;
      variantName?: string | null;
      sku: string;
      unitPrice: number;
      quantity: number;
      totalPrice: number;
      imageUrl?: string | null;
    }[];
    statusHistory: {
      id: string;
      fromStatus: string;
      toStatus: string;
      notes?: string | null;
      createdAt: Date | string;
      actor?: { name: string | null; email: string | null } | null;
    }[];
    shipments: {
      id: string;
      courierName: string;
      trackingNumber?: string | null;
      status: string;
      dispatchedAt?: Date | string | null;
    }[];
  };
}

export function OrderDetailManager({ order }: OrderDetailManagerProps) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [selectedStatus, setSelectedStatus] = React.useState<OrderStatus>(order.status);
  const [statusNotes, setStatusNotes] = React.useState("");

  // Courier state
  const [courierName, setCourierName] = React.useState("Steadfast Courier");
  const [trackingNumber, setTrackingNumber] = React.useState("");
  const [courierNotes, setCourierNotes] = React.useState("");

  // Parse shipping address JSON
  let addressObj: Record<string, string> = {};
  try {
    addressObj = JSON.parse(order.shippingAddress);
  } catch {
    addressObj = { addressLine: order.shippingAddress };
  }

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "UPDATE_STATUS",
          status: selectedStatus,
          notes: statusNotes,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update status");
      }

      toast.success(data.message || "Order status updated!");
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Status update failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignCourier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) {
      toast.error("Please enter courier consignment tracking number");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "ASSIGN_COURIER",
          courierName,
          trackingNumber,
          notes: courierNotes,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to assign courier");
      }

      toast.success("Courier assigned and shipment created!");
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Courier assignment failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePayment = async (newStatus: PaymentStatus) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "UPDATE_PAYMENT",
          paymentStatus: newStatus,
          transactionId: `manual_payment_${Date.now()}`,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update payment");
      }

      toast.success("Payment status updated!");
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Payment update failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b print:hidden">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-foreground">{order.orderNumber}</h1>
            <StatusBadge status={order.status} />
            <StatusBadge status={order.paymentStatus} />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Placed on {new Date(order.createdAt).toLocaleString("en-US", { dateStyle: "long", timeStyle: "short" })}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="text-xs font-semibold"
          >
            <Printer className="h-4 w-4 mr-1.5" />
            Print Invoice
          </Button>

          <a
            href={`/track-order?orderNumber=${encodeURIComponent(order.orderNumber)}&token=${encodeURIComponent(order.trackingToken)}`}
            target="_blank"
            rel="noreferrer"
          >
            <Button size="sm" variant="outline" className="text-xs font-semibold">
              <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
              Customer View
            </Button>
          </a>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Items & Customer Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items Table */}
          <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
              <Package className="h-4 w-4 text-emerald-600" />
              Ordered Items ({order.items.length})
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/40 border-b font-bold text-muted-foreground uppercase">
                  <tr>
                    <th className="p-3">Product</th>
                    <th className="p-3">SKU</th>
                    <th className="p-3 text-right">Unit Price</th>
                    <th className="p-3 text-center">Qty</th>
                    <th className="p-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-12 rounded-lg bg-muted flex-shrink-0 border overflow-hidden">
                            <Image
                              src={item.imageUrl || "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&q=80"}
                              alt={item.productName}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-bold text-foreground">{item.productName}</p>
                            {item.variantName && (
                              <p className="text-[10px] text-muted-foreground">{item.variantName}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-muted-foreground font-mono">{item.sku}</td>
                      <td className="p-3 text-right">{formatBDT(item.unitPrice)}</td>
                      <td className="p-3 text-center font-bold">{item.quantity}</td>
                      <td className="p-3 text-right font-black text-foreground">
                        {formatBDT(item.totalPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Financial Summary */}
            <div className="p-4 rounded-xl bg-muted/30 border space-y-2 text-xs max-w-sm ml-auto">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="font-semibold text-foreground">{formatBDT(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping Charge</span>
                <span className="font-semibold text-foreground">{formatBDT(order.shippingFee)}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Discount</span>
                  <span>-{formatBDT(order.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t text-sm font-black text-foreground">
                <span>Grand Total</span>
                <span className="text-emerald-600">{formatBDT(order.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Customer & Shipping Destination */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl border bg-card shadow-sm space-y-3">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                <User className="h-4 w-4 text-emerald-600" />
                Customer Contact
              </h3>
              <div className="space-y-1.5 text-xs">
                <p><strong className="text-muted-foreground">Name:</strong> {order.customerName}</p>
                <p><strong className="text-muted-foreground">Phone:</strong> {order.customerPhone}</p>
                <p><strong className="text-muted-foreground">Email:</strong> {order.customerEmail}</p>
                {order.customerNotes && (
                  <div className="mt-2 p-2 rounded-lg bg-muted text-[11px]">
                    <strong>Customer Notes:</strong> {order.customerNotes}
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 rounded-2xl border bg-card shadow-sm space-y-3">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                <MapPin className="h-4 w-4 text-emerald-600" />
                Delivery Destination
              </h3>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p className="font-bold text-foreground">{addressObj.recipientName || order.customerName}</p>
                <p>{addressObj.addressLine}</p>
                <p>{addressObj.upazila}, {addressObj.district}, {addressObj.division}</p>
                {addressObj.deliveryInstructions && (
                  <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium pt-1">
                    Note: {addressObj.deliveryInstructions}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Audit History Timeline */}
          <div className="p-6 rounded-2xl border bg-card shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
              <History className="h-4 w-4 text-emerald-600" />
              Order Status History & Audit Log
            </h3>

            <div className="space-y-3">
              {order.statusHistory.map((h) => (
                <div key={h.id} className="flex gap-3 text-xs p-3 rounded-xl border bg-muted/20">
                  <div className="h-6 w-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground">
                        {h.fromStatus} &rarr; {h.toStatus}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(h.createdAt).toLocaleString()}
                      </span>
                    </div>
                    {h.notes && <p className="text-muted-foreground mt-0.5">{h.notes}</p>}
                    {h.actor && (
                      <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">
                        By: {h.actor.name || h.actor.email}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Operations Controls */}
        <div className="space-y-6 print:hidden">
          {/* Status Transition Control */}
          <div className="p-6 rounded-2xl border bg-card shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-foreground">Update Order Status</h3>

            <form onSubmit={handleUpdateStatus} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Fulfillment Stage</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
                  className="w-full h-9 rounded-xl border bg-background px-3 text-xs font-semibold"
                >
                  {Object.values(OrderStatus).map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Audit / Internal Notes</label>
                <Input
                  placeholder="e.g. Verified customer via phone"
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  className="text-xs"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-9"
              >
                {loading ? "Updating..." : "Update Status"}
              </Button>
            </form>
          </div>

          {/* Courier Assignment */}
          <div className="p-6 rounded-2xl border bg-card shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
              <Truck className="h-4 w-4 text-emerald-600" />
              Assign Courier & Tracking
            </h3>

            <form onSubmit={handleAssignCourier} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Courier Service</label>
                <select
                  value={courierName}
                  onChange={(e) => setCourierName(e.target.value)}
                  className="w-full h-9 rounded-xl border bg-background px-3 text-xs font-semibold"
                >
                  <option value="Steadfast Courier">Steadfast Courier</option>
                  <option value="Pathao Courier">Pathao Courier</option>
                  <option value="RedX Logistics">RedX Logistics</option>
                  <option value="Paperfly">Paperfly</option>
                  <option value="eCourier">eCourier</option>
                  <option value="Dhaka Internal Fleet">Dhaka Internal Fleet</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Consignment / Tracking #</label>
                <Input
                  required
                  placeholder="e.g. STDF-894289"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Courier Instructions</label>
                <Input
                  placeholder="Fragile / Cash collect"
                  value={courierNotes}
                  onChange={(e) => setCourierNotes(e.target.value)}
                  className="text-xs"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-9"
              >
                Dispatch with Courier
              </Button>
            </form>

            {order.shipments.length > 0 && (
              <div className="pt-2 border-t text-xs space-y-1">
                <p className="font-bold text-muted-foreground">Active Shipment:</p>
                <p>Courier: <strong>{order.shipments[0].courierName}</strong></p>
                <p>Tracking: <strong>{order.shipments[0].trackingNumber}</strong></p>
              </div>
            )}
          </div>

          {/* Payment Status Control */}
          <div className="p-6 rounded-2xl border bg-card shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-emerald-600" />
              Payment Status Management
            </h3>

            <div className="space-y-2 text-xs">
              <p>Current: <StatusBadge status={order.paymentStatus} /></p>
              <p>Method: <strong className="uppercase">{order.paymentMethod}</strong></p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={loading || order.paymentStatus === PaymentStatus.PAID}
                onClick={() => handleTogglePayment(PaymentStatus.PAID)}
                className="text-xs text-emerald-600 border-emerald-500/30 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
              >
                Mark as PAID
              </Button>

              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={loading || order.paymentStatus === PaymentStatus.REFUNDED}
                onClick={() => handleTogglePayment(PaymentStatus.REFUNDED)}
                className="text-xs text-red-600 border-red-500/30 hover:bg-red-50 dark:hover:bg-red-950/30"
              >
                Mark REFUNDED
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
