import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatBDT } from "@/lib/utils";
import { StatusBadge } from "@/components/admin/status-badge";
import {
  Package,
  Truck,
  CheckCircle2,
  ChevronRight,
  MapPin,
  Clock,
} from "lucide-react";
import { OrderStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

interface CustomerOrderDetailPageProps {
  params: Promise<{ id: string }>;
}

const STEPPER_STAGES = [
  { status: OrderStatus.PENDING, label: "Placed" },
  { status: OrderStatus.CONFIRMED, label: "Confirmed" },
  { status: OrderStatus.PROCESSING, label: "Processing" },
  { status: OrderStatus.SHIPPED, label: "Shipped" },
  { status: OrderStatus.OUT_FOR_DELIVERY, label: "Out for Delivery" },
  { status: OrderStatus.DELIVERED, label: "Delivered" },
];

export default async function CustomerOrderDetailPage({ params }: CustomerOrderDetailPageProps) {
  const session = await auth();
  const userId = session?.user?.id;
  const { id } = await params;

  let order = null;
  if (userId) {
    try {
      order = await prisma.order.findUnique({
        where: { id },
        include: {
          items: true,
          shipments: { orderBy: { createdAt: "desc" }, take: 1 },
          statusHistory: { orderBy: { createdAt: "desc" } },
        },
      });
    } catch {
      // DB offline
    }
  }

  if (!order || (userId && order.userId !== userId)) {
    notFound();
  }

  let addressObj: Record<string, string> = {};
  try {
    addressObj = JSON.parse(order.shippingAddress);
  } catch {
    addressObj = { addressLine: order.shippingAddress };
  }

  const currentStageIndex = STEPPER_STAGES.findIndex((s) => s.status === order.status);

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link href="/account" className="hover:text-foreground">Account</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/account/orders" className="hover:text-foreground">Orders</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground font-semibold">{order.orderNumber}</span>
      </nav>

      {/* Header */}
      <div className="p-6 rounded-3xl border bg-card shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-black text-foreground">{order.orderNumber}</h1>
            <StatusBadge status={order.status} />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Placed on {new Date(order.createdAt).toLocaleDateString("en-US", { dateStyle: "long" })}
          </p>
        </div>

        <div className="text-left sm:text-right">
          <span className="text-xs text-muted-foreground block">Total Amount</span>
          <span className="text-xl font-black text-emerald-600">{formatBDT(order.totalAmount)}</span>
          <span className="text-[10px] block text-muted-foreground uppercase font-semibold">
            {order.paymentMethod} • {order.paymentStatus}
          </span>
        </div>
      </div>

      {/* Stepper Timeline */}
      <div className="p-6 rounded-3xl border bg-card shadow-sm space-y-4">
        <h3 className="font-bold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <Clock className="h-4 w-4 text-emerald-600" />
          Fulfillment Timeline
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
          {STEPPER_STAGES.map((st, idx) => {
            const isDone = currentStageIndex >= idx;
            const isCurrent = currentStageIndex === idx;

            return (
              <div
                key={st.status}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  isCurrent
                    ? "border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-600/20"
                    : isDone
                    ? "border-emerald-500/30 bg-muted/20"
                    : "border-border/50 opacity-40"
                }`}
              >
                <div
                  className={`h-6 w-6 rounded-full mx-auto mb-1.5 flex items-center justify-center text-xs font-bold ${
                    isDone ? "bg-emerald-600 text-white" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {isDone ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
                </div>
                <span className="text-xs font-bold block">{st.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Courier Tracker if shipped */}
      {order.shipments.length > 0 && (
        <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Truck className="h-6 w-6 text-emerald-600" />
            <div>
              <p className="font-bold text-xs">Dispatched via {order.shipments[0].courierName}</p>
              <p className="text-xs text-muted-foreground">
                Consignment Tracking #: <strong className="text-foreground">{order.shipments[0].trackingNumber}</strong>
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-600 bg-background px-3 py-1 rounded-full border">
            In Transit
          </span>
        </div>
      )}

      {/* Items & Shipping Address */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Items */}
        <div className="p-6 rounded-3xl border bg-card shadow-sm space-y-4">
          <h3 className="font-bold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Package className="h-4 w-4 text-emerald-600" />
            Items in Order ({order.items.length})
          </h3>
          <div className="divide-y text-xs">
            {order.items.map((i) => (
              <div key={i.id} className="py-3 flex justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 rounded-lg bg-muted flex-shrink-0 border overflow-hidden">
                    <Image
                      src={i.imageUrl || "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&q=80"}
                      alt={i.productName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">{i.productName}</p>
                    {i.variantName && (
                      <p className="text-[10px] text-muted-foreground">{i.variantName}</p>
                    )}
                    <p className="text-[11px] text-muted-foreground">Qty: {i.quantity}</p>
                  </div>
                </div>
                <span className="font-bold text-foreground">{formatBDT(i.totalPrice)}</span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t text-xs space-y-1 text-muted-foreground">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-foreground">{formatBDT(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping Fee</span>
              <span className="font-semibold text-foreground">{formatBDT(order.shippingFee)}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount</span>
                <span>-{formatBDT(order.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t font-black text-sm text-foreground">
              <span>Total</span>
              <span className="text-emerald-600">{formatBDT(order.totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Shipping Destination */}
        <div className="p-6 rounded-3xl border bg-card shadow-sm space-y-4">
          <h3 className="font-bold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <MapPin className="h-4 w-4 text-emerald-600" />
            Delivery Destination
          </h3>

          <div className="p-4 rounded-2xl bg-muted/30 border text-xs space-y-1">
            <p className="font-bold text-foreground">{addressObj.recipientName || order.customerName}</p>
            <p className="text-muted-foreground">{addressObj.addressLine}</p>
            <p className="text-muted-foreground">{addressObj.upazila}, {addressObj.district}, {addressObj.division}</p>
            <p className="text-muted-foreground pt-1">Phone: {order.customerPhone}</p>
          </div>

          <div className="pt-4 border-t text-xs text-muted-foreground space-y-2">
            <p className="font-bold text-foreground">Need Assistance with this order?</p>
            <p>Call our KinaKati helpline: <strong>+880 9612-000000</strong></p>
            <p>Email: support@kinakati.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
