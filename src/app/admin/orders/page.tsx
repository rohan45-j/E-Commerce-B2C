import Link from "next/link";
import { AdminOrdersService } from "@/server/services/admin-orders.service";
import { formatBDT } from "@/lib/utils";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import {
  Package,
  Clock,
  Truck,
  CheckCircle2,
  AlertCircle,
  Eye,
} from "lucide-react";
import { OrderStatus, PaymentStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

interface AdminOrdersPageProps {
  searchParams: Promise<{
    status?: string;
    paymentStatus?: string;
    search?: string;
    page?: string;
  }>;
}

type OrderListItem = Awaited<ReturnType<typeof AdminOrdersService.listOrders>>["orders"][number];

export default async function AdminOrdersPage({ searchParams }: AdminOrdersPageProps) {
  const params = await searchParams;
  const currentStatus = params.status as OrderStatus | undefined;
  const currentPayment = params.paymentStatus as PaymentStatus | undefined;
  const searchQuery = params.search || "";
  const page = parseInt(params.page || "1", 10);

  let ordersData: {
    orders: OrderListItem[];
    total: number;
    page: number;
    totalPages: number;
    metrics: { total: number; pending: number; processing: number; shipped: number; delivered: number };
  } = {
    orders: [],
    total: 0,
    page: 1,
    totalPages: 1,
    metrics: { total: 0, pending: 0, processing: 0, shipped: 0, delivered: 0 },
  };

  try {
    ordersData = await AdminOrdersService.listOrders({
      status: currentStatus,
      paymentStatus: currentPayment,
      search: searchQuery,
      page,
      limit: 25,
    });
  } catch {
    // If DB is offline during build
  }

  const { orders, metrics } = ordersData;

  const STATUS_TABS: { label: string; value?: OrderStatus }[] = [
    { label: "All Orders" },
    { label: "Pending", value: OrderStatus.PENDING },
    { label: "Confirmed", value: OrderStatus.CONFIRMED },
    { label: "Processing", value: OrderStatus.PROCESSING },
    { label: "Shipped", value: OrderStatus.SHIPPED },
    { label: "Delivered", value: OrderStatus.DELIVERED },
    { label: "Cancelled", value: OrderStatus.CANCELLED },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">
            Order Management & Fulfillment
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Process incoming orders, assign delivery couriers, and manage customer fulfillment pipelines
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl border bg-card/60 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold">Total Orders</span>
            <Package className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-foreground">{metrics.total}</p>
        </div>

        <div className="p-4 rounded-2xl border bg-card/60 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold">Pending Review</span>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-amber-600">{metrics.pending}</p>
        </div>

        <div className="p-4 rounded-2xl border bg-card/60 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold">In Transit / Shipped</span>
            <Truck className="h-4 w-4 text-blue-500" />
          </div>
          <p className="text-2xl font-black text-blue-600">{metrics.shipped}</p>
        </div>

        <div className="p-4 rounded-2xl border bg-card/60 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold">Delivered</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-emerald-600">{metrics.delivered}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 border-b text-xs font-medium">
        {STATUS_TABS.map((tab) => {
          const isActive = (!tab.value && !currentStatus) || currentStatus === tab.value;
          return (
            <Link
              key={tab.label}
              href={`/admin/orders${tab.value ? `?status=${tab.value}` : ""}`}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                isActive
                  ? "bg-emerald-600 text-white font-bold shadow-sm"
                  : "bg-muted/60 text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl border bg-card overflow-hidden shadow-sm">
        {orders.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto opacity-50" />
            <h3 className="font-bold text-base">No Orders Found</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              No customer orders match the current status or search filter criteria.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 border-b font-bold text-muted-foreground uppercase tracking-wider">
                <tr>
                  <th className="p-4">Order #</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Date & Time</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4">Fulfillment Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <Link
                        href={`/admin/orders/${o.id}`}
                        className="font-bold text-emerald-600 hover:underline"
                      >
                        {o.orderNumber}
                      </Link>
                      <span className="block text-[10px] text-muted-foreground">
                        {o.items.length} items
                      </span>
                    </td>

                    <td className="p-4">
                      <p className="font-bold text-foreground">{o.customerName}</p>
                      <p className="text-muted-foreground">{o.customerPhone}</p>
                      <p className="text-[10px] text-muted-foreground">{o.customerEmail}</p>
                    </td>

                    <td className="p-4 text-muted-foreground whitespace-nowrap">
                      {new Date(o.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                      <span className="block text-[10px]">
                        {new Date(o.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </td>

                    <td className="p-4 font-black text-foreground whitespace-nowrap">
                      {formatBDT(o.totalAmount)}
                    </td>

                    <td className="p-4">
                      <div className="space-y-1">
                        <span className="block font-semibold text-[10px] uppercase text-muted-foreground">
                          {o.paymentMethod}
                        </span>
                        <StatusBadge status={o.paymentStatus} />
                      </div>
                    </td>

                    <td className="p-4">
                      <StatusBadge status={o.status} />
                    </td>

                    <td className="p-4 text-right">
                      <Link href={`/admin/orders/${o.id}`}>
                        <Button size="sm" variant="outline" className="h-8 text-xs font-semibold">
                          <Eye className="h-3.5 w-3.5 mr-1" />
                          Process
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
