"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { formatBDT } from "@/lib/utils";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { Package, ExternalLink, XCircle, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { OrderStatus } from "@prisma/client";

interface CustomerOrder {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentMethod: string;
  paymentStatus: string;
  totalAmount: number;
  createdAt: Date | string;
  items: {
    id: string;
    productName: string;
    variantName?: string | null;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    imageUrl?: string | null;
  }[];
}

export function CustomerOrdersList({ orders }: { orders: CustomerOrder[] }) {
  const router = useRouter();
  const [cancellingId, setCancellingId] = React.useState<string | null>(null);

  const handleCancelOrder = async (orderId: string, orderNumber: string) => {
    if (!confirm(`Are you sure you want to cancel Order #${orderNumber}?`)) return;

    setCancellingId(orderId);

    try {
      const res = await fetch(`/api/account/orders/${orderId}/cancel`, {
        method: "POST",
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to cancel order");
      }

      toast.success("Order cancelled successfully");
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to cancel order";
      toast.error(msg);
    } finally {
      setCancellingId(null);
    }
  };

  if (orders.length === 0) {
    return (
      <div className="p-12 text-center rounded-2xl border bg-card space-y-4">
        <Package className="h-12 w-12 text-muted-foreground mx-auto opacity-50" />
        <h3 className="font-bold text-base">No Orders Placed Yet</h3>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          You haven&apos;t placed any orders with us yet. Explore our curated luxury catalogue to begin.
        </p>
        <Link href="/shop">
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs mt-2">
            Explore Collections
            <ArrowRight className="h-4 w-4 ml-1.5" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((o) => {
        const canCancel = o.status === OrderStatus.PENDING;

        return (
          <div
            key={o.id}
            className="rounded-2xl border bg-card shadow-sm overflow-hidden divide-y"
          >
            {/* Card Header */}
            <div className="p-4 sm:p-5 bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-sm text-foreground">{o.orderNumber}</span>
                  <StatusBadge status={o.status} />
                </div>
                <p className="text-muted-foreground mt-0.5">
                  Ordered on {new Date(o.createdAt).toLocaleDateString("en-US", { dateStyle: "medium" })}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-left sm:text-right">
                  <span className="text-[10px] text-muted-foreground block uppercase font-semibold">Total</span>
                  <span className="font-black text-sm text-emerald-600">{formatBDT(o.totalAmount)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Link href={`/account/orders/${o.id}`}>
                    <Button size="sm" variant="outline" className="h-8 text-xs font-semibold">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  </Link>

                  {canCancel && (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={cancellingId === o.id}
                      onClick={() => handleCancelOrder(o.id, o.orderNumber)}
                      className="h-8 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                    >
                      <XCircle className="h-3 w-3 mr-1" />
                      {cancellingId === o.id ? "Cancelling..." : "Cancel"}
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Items Preview */}
            <div className="p-4 sm:p-5 divide-y text-xs">
              {o.items.map((item) => (
                <div key={item.id} className="py-2.5 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 rounded-lg bg-muted flex-shrink-0 border overflow-hidden">
                      <Image
                        src={item.imageUrl || "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&q=80"}
                        alt={item.productName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{item.productName}</p>
                      {item.variantName && (
                        <p className="text-[10px] text-muted-foreground">{item.variantName}</p>
                      )}
                      <p className="text-[10px] text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold text-foreground">
                    {formatBDT(item.totalPrice)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
