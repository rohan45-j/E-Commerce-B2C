import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatBDT } from "@/lib/utils";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import {
  Package,
  Clock,
  CheckCircle2,
  ShoppingBag,
  ExternalLink,
} from "lucide-react";
import { OrderStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

interface RecentOrderRecord {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  totalAmount: number;
  createdAt: Date;
  items: { id: string }[];
}

export default async function AccountOverviewPage() {
  const session = await auth();
  const userId = session?.user?.id;

  let orders: RecentOrderRecord[] = [];
  let stats = { total: 0, pending: 0, completed: 0 };

  if (userId) {
    try {
      const [userOrders, totalCount, pendingCount, completedCount] = await Promise.all([
        prisma.order.findMany({
          where: { userId },
          include: { items: true },
          orderBy: { createdAt: "desc" },
          take: 5,
        }),
        prisma.order.count({ where: { userId } }),
        prisma.order.count({
          where: {
            userId,
            status: { in: [OrderStatus.PENDING, OrderStatus.CONFIRMED, OrderStatus.PROCESSING, OrderStatus.SHIPPED, OrderStatus.OUT_FOR_DELIVERY] },
          },
        }),
        prisma.order.count({
          where: { userId, status: OrderStatus.DELIVERED },
        }),
      ]);

      orders = userOrders;
      stats = { total: totalCount, pending: pendingCount, completed: completedCount };
    } catch {
      // DB offline
    }
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl border bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 text-white shadow-md">
        <h1 className="text-2xl sm:text-3xl font-black">
          Welcome back, {session?.user?.name || "Customer"}!
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
          Manage your personal addresses, track active shipments in real-time, and view your complete purchase history.
        </p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl border bg-card shadow-sm space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold">Total Orders</span>
            <Package className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-foreground">{stats.total}</p>
        </div>

        <div className="p-5 rounded-2xl border bg-card shadow-sm space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold">Active In Transit</span>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-amber-600">{stats.pending}</p>
        </div>

        <div className="p-5 rounded-2xl border bg-card shadow-sm space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold">Completed Orders</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-emerald-600">{stats.completed}</p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="rounded-2xl border bg-card shadow-sm overflow-hidden space-y-4 p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-sm text-foreground flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 text-emerald-600" />
            Recent Orders
          </h2>
          <Link href="/account/orders" className="text-xs font-semibold text-emerald-600 hover:underline">
            View All Orders &rarr;
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="p-8 text-center border rounded-xl bg-muted/20 space-y-2">
            <p className="text-xs text-muted-foreground">You haven&apos;t placed any orders yet.</p>
            <Link href="/shop">
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs mt-2">
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="divide-y text-xs">
            {orders.map((o) => (
              <div key={o.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-foreground">{o.orderNumber}</strong>
                    <StatusBadge status={o.status} />
                  </div>
                  <p className="text-muted-foreground mt-0.5">
                    {o.items.length} items • {new Date(o.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-black text-foreground">{formatBDT(o.totalAmount)}</span>
                  <Link href={`/account/orders/${o.id}`}>
                    <Button size="sm" variant="outline" className="h-8 text-xs">
                      View Details
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
