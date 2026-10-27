import { AdminDashboardService } from "@/server/services/admin-dashboard.service";
import { formatBDT, formatNumber } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RevenueChart } from "@/components/admin/revenue-chart";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  TrendingUp,
  ShoppingCart,
  Users,
  Package,
  AlertTriangle,
  ArrowRight,
  Clock,
  CheckCircle,
  Layers,
  Tag,
  Boxes,
  TicketPercent,
  Image as ImageIcon,
  LayoutTemplate,
  FileText,
  Truck,
  Settings,
  Star,
  Plus,
  Palette,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const metrics = await AdminDashboardService.getDashboardMetrics();

  return (
    <div className="space-y-8">
      {/* Database Setup Notice if running on fallback */}
      {!metrics.isDbConnected && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-amber-900 dark:text-amber-200 flex items-start gap-3 shadow-sm">
          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
          <div className="text-xs space-y-1 flex-1">
            <p className="font-semibold text-sm">PostgreSQL Database Connection Pending</p>
            <p>
              Your local PostgreSQL server rejected the default password. The admin panel is currently running in fallback demo mode.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-[11px]">
              <span className="bg-background/80 px-2 py-1 rounded border border-amber-500/20 text-foreground">
                Set DATABASE_URL in .env &rarr; npx prisma db push &rarr; pnpm seed
              </span>
            </div>
          </div>
        </div>
      )}
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Admin Overview</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time analytics, daily revenue, order progress, and inventory health.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/products/new">
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white shadow">
              + New Product
            </Button>
          </Link>
          <Link href="/admin/orders">
            <Button size="sm" variant="outline">
              Process Orders
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Today&apos;s Sales
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight">
              {formatBDT(metrics.todaySales)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {metrics.todayOrderCount} orders placed today
            </p>
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              7-Day Revenue
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <ShoppingCart className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight">
              {formatBDT(metrics.weekSales)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {metrics.weekOrderCount} orders this week
            </p>
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              30-Day Revenue
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
              <CheckCircle className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight">
              {formatBDT(metrics.monthSales)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {metrics.monthOrderCount} orders in last 30 days
            </p>
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Active Customers
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight">
              {formatNumber(metrics.customerCount)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {metrics.productCount} active catalog products
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Store CMS & Direct Management Hub */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Store CMS & Catalog Operations</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Direct access to product catalog, category tree, marketing promotions, and storefront CMS blocks.
            </p>
          </div>
          <Link href="/admin/products/new">
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow gap-1.5">
              <Plus className="h-4 w-4" /> Add New Product
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          <Link
            href="/admin/products"
            className="group p-4 rounded-xl border bg-card hover:bg-emerald-500/5 hover:border-emerald-500/30 transition-all flex flex-col justify-between"
          >
            <div className="h-9 w-9 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight group-hover:text-emerald-600">Products</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Catalog & Variants</p>
            </div>
          </Link>

          <Link
            href="/admin/categories"
            className="group p-4 rounded-xl border bg-card hover:bg-blue-500/5 hover:border-blue-500/30 transition-all flex flex-col justify-between"
          >
            <div className="h-9 w-9 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight group-hover:text-blue-600">Categories</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Tree & SEO</p>
            </div>
          </Link>

          <Link
            href="/admin/brands"
            className="group p-4 rounded-xl border bg-card hover:bg-amber-500/5 hover:border-amber-500/30 transition-all flex flex-col justify-between"
          >
            <div className="h-9 w-9 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Tag className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight group-hover:text-amber-600">Brands</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Brand Directory</p>
            </div>
          </Link>

          <Link
            href="/admin/inventory"
            className="group p-4 rounded-xl border bg-card hover:bg-purple-500/5 hover:border-purple-500/30 transition-all flex flex-col justify-between"
          >
            <div className="h-9 w-9 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Boxes className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight group-hover:text-purple-600">Inventory</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Stock & SKU Editor</p>
            </div>
          </Link>

          <Link
            href="/admin/orders"
            className="group p-4 rounded-xl border bg-card hover:bg-rose-500/5 hover:border-rose-500/30 transition-all flex flex-col justify-between"
          >
            <div className="h-9 w-9 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <ShoppingCart className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight group-hover:text-rose-600">Orders</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Dispatch & Invoices</p>
            </div>
          </Link>

          <Link
            href="/admin/homepage"
            className="group p-4 rounded-xl border bg-card hover:bg-teal-500/5 hover:border-teal-500/30 transition-all flex flex-col justify-between"
          >
            <div className="h-9 w-9 rounded-lg bg-teal-500/10 text-teal-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <LayoutTemplate className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight group-hover:text-teal-600">Homepage CMS</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Sections Builder</p>
            </div>
          </Link>

          <Link
            href="/admin/banners"
            className="group p-4 rounded-xl border bg-card hover:bg-sky-500/5 hover:border-sky-500/30 transition-all flex flex-col justify-between"
          >
            <div className="h-9 w-9 rounded-lg bg-sky-500/10 text-sky-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <ImageIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight group-hover:text-sky-600">Banners</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Hero &amp; Sliders</p>
            </div>
          </Link>

          <Link
            href="/admin/theme"
            className="group p-4 rounded-xl border bg-card hover:bg-[#04aeef]/5 hover:border-[#04aeef]/30 transition-all flex flex-col justify-between"
          >
            <div className="h-9 w-9 rounded-lg bg-[#04aeef]/10 text-[#04aeef] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Palette className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight group-hover:text-[#04aeef]">Theme &amp; Colors</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Brand &amp; CTA Styles</p>
            </div>
          </Link>

          <Link
            href="/admin/coupons"
            className="group p-4 rounded-xl border bg-card hover:bg-pink-500/5 hover:border-pink-500/30 transition-all flex flex-col justify-between"
          >
            <div className="h-9 w-9 rounded-lg bg-pink-500/10 text-pink-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <TicketPercent className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight group-hover:text-pink-600">Coupons</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Discounts & Codes</p>
            </div>
          </Link>

          <Link
            href="/admin/pages"
            className="group p-4 rounded-xl border bg-card hover:bg-indigo-500/5 hover:border-indigo-500/30 transition-all flex flex-col justify-between"
          >
            <div className="h-9 w-9 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight group-hover:text-indigo-600">CMS Pages</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Terms, Privacy, About</p>
            </div>
          </Link>

          <Link
            href="/admin/shipping"
            className="group p-4 rounded-xl border bg-card hover:bg-amber-500/5 hover:border-amber-500/30 transition-all flex flex-col justify-between"
          >
            <div className="h-9 w-9 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight group-hover:text-amber-600">Shipping</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Zones & Rates</p>
            </div>
          </Link>

          <Link
            href="/admin/reviews"
            className="group p-4 rounded-xl border bg-card hover:bg-yellow-500/5 hover:border-yellow-500/30 transition-all flex flex-col justify-between"
          >
            <div className="h-9 w-9 rounded-lg bg-yellow-500/10 text-yellow-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Star className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight group-hover:text-yellow-600">Reviews</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Customer Ratings</p>
            </div>
          </Link>

          <Link
            href="/admin/settings"
            className="group p-4 rounded-xl border bg-card hover:bg-zinc-500/5 hover:border-zinc-500/30 transition-all flex flex-col justify-between"
          >
            <div className="h-9 w-9 rounded-lg bg-zinc-500/10 text-zinc-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Settings className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight group-hover:text-zinc-600">Settings</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">COD, Currency & Brand</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Charts & Status Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2 border shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Weekly Sales Trend</CardTitle>
            <CardDescription className="text-xs">
              Daily gross sales revenue generated across Bangladesh in BDT.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RevenueChart data={metrics.chartDays} />
          </CardContent>
        </Card>

        {/* Order Status Breakdown */}
        <Card className="border shadow-sm flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Order Fulfillment Pipeline</CardTitle>
            <CardDescription className="text-xs">
              Current lifecycle status of customer orders.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-medium text-amber-600">
                  <Clock className="h-3.5 w-3.5" /> Pending Confirmation
                </span>
                <span className="font-bold">{metrics.statusMap["PENDING"] || 0}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-medium text-blue-600">
                  <Package className="h-3.5 w-3.5" /> Confirmed / Processing
                </span>
                <span className="font-bold">
                  {(metrics.statusMap["CONFIRMED"] || 0) + (metrics.statusMap["PROCESSING"] || 0)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-medium text-purple-600">
                  <Package className="h-3.5 w-3.5" /> Packed for Dispatch
                </span>
                <span className="font-bold">{metrics.statusMap["PACKED"] || 0}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-medium text-sky-600">
                  <ShoppingCart className="h-3.5 w-3.5" /> Out for Delivery
                </span>
                <span className="font-bold">
                  {(metrics.statusMap["SHIPPED"] || 0) + (metrics.statusMap["OUT_FOR_DELIVERY"] || 0)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-medium text-emerald-600">
                  <CheckCircle className="h-3.5 w-3.5" /> Successfully Delivered
                </span>
                <span className="font-bold">{metrics.statusMap["DELIVERED"] || 0}</span>
              </div>
            </div>

            <Link href="/admin/orders" className="block pt-2">
              <Button variant="outline" size="sm" className="w-full text-xs">
                View All Orders <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders & Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <Card className="lg:col-span-2 border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">Recent Orders</CardTitle>
              <CardDescription className="text-xs">
                Latest customer purchases awaiting action.
              </CardDescription>
            </div>
            <Link href="/admin/orders">
              <Button variant="ghost" size="sm" className="text-xs text-emerald-600">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {metrics.recentOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b text-muted-foreground text-left">
                      <th className="pb-2 font-medium">Order #</th>
                      <th className="pb-2 font-medium">Customer</th>
                      <th className="pb-2 font-medium">Status</th>
                      <th className="pb-2 font-medium">Payment</th>
                      <th className="pb-2 font-medium text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {metrics.recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-muted/40 transition-colors">
                        <td className="py-2.5 font-semibold text-emerald-600">
                          <Link href={`/admin/orders/${order.id}`} className="hover:underline">
                            {order.orderNumber}
                          </Link>
                        </td>
                        <td className="py-2.5">
                          <p className="font-medium">{order.customerName}</p>
                          <p className="text-[10px] text-muted-foreground">{order.customerPhone}</p>
                        </td>
                        <td className="py-2.5">
                          <StatusBadge status={order.status} />
                        </td>
                        <td className="py-2.5">
                          <span className="font-mono text-[11px] uppercase">
                            {order.paymentMethod}
                          </span>
                        </td>
                        <td className="py-2.5 text-right font-bold">
                          {formatBDT(order.totalAmount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground text-xs">
                No orders placed yet. Orders will show here in real-time.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Low Stock Alerts */}
        <Card className="border shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <CardTitle className="text-base font-semibold">Low Stock Warnings</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Items with 10 or fewer units in inventory.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {metrics.lowStockProducts.length > 0 ? (
              <div className="space-y-3">
                {metrics.lowStockProducts.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between text-xs p-2 rounded-lg border bg-muted/20"
                  >
                    <div className="truncate pr-2">
                      <p className="font-medium truncate">{p.title}</p>
                      <p className="text-[10px] font-mono text-muted-foreground">{p.sku}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/10 text-amber-600">
                        {p.stock} left
                      </span>
                    </div>
                  </div>
                ))}
                <Link href="/admin/inventory" className="block pt-2">
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    Manage Inventory
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground text-xs">
                ✓ All items currently have healthy stock levels.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
