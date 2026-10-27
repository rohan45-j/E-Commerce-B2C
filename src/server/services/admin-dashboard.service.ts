import { prisma } from "@/lib/prisma";

export interface DashboardMetrics {
  todaySales: number;
  todayOrderCount: number;
  weekSales: number;
  weekOrderCount: number;
  monthSales: number;
  monthOrderCount: number;
  allOrdersCount: number;
  customerCount: number;
  productCount: number;
  lowStockProducts: {
    id: string;
    title: string;
    sku: string;
    stock: number;
    basePrice: number;
  }[];
  recentOrders: {
    id: string;
    orderNumber: string;
    customerName: string;
    customerPhone: string;
    status: string;
    paymentStatus: string;
    paymentMethod: string;
    totalAmount: number;
    createdAt: Date;
  }[];
  statusMap: Record<string, number>;
  isDbConnected: boolean;
  chartDays: {
    day: string;
    date?: string;
    revenue: number;
    orders: number;
  }[];
}

export class AdminDashboardService {
  static async getDashboardMetrics(): Promise<DashboardMetrics> {
    try {
      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      // 1. Sales & Orders counts
      const [
        todayOrders,
        weekOrders,
        monthOrders,
        allOrdersCount,
        customerCount,
        productCount,
        lowStockProducts,
        recentOrders,
        ordersByStatus,
      ] = await Promise.all([
        prisma.order.aggregate({
          where: { createdAt: { gte: startOfToday } },
          _sum: { totalAmount: true },
          _count: { id: true },
        }),
        prisma.order.aggregate({
          where: { createdAt: { gte: sevenDaysAgo } },
          _sum: { totalAmount: true },
          _count: { id: true },
        }),
        prisma.order.aggregate({
          where: { createdAt: { gte: thirtyDaysAgo } },
          _sum: { totalAmount: true },
          _count: { id: true },
        }),
        prisma.order.count(),
        prisma.user.count({ where: { role: "CUSTOMER" } }),
        prisma.product.count(),
        prisma.product.findMany({
          where: { stock: { lte: 10 } },
          select: {
            id: true,
            title: true,
            sku: true,
            stock: true,
            basePrice: true,
          },
          take: 8,
          orderBy: { stock: "asc" },
        }),
        prisma.order.findMany({
          take: 6,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            orderNumber: true,
            customerName: true,
            customerPhone: true,
            status: true,
            paymentStatus: true,
            paymentMethod: true,
            totalAmount: true,
            createdAt: true,
          },
        }),
        prisma.order.groupBy({
          by: ["status"],
          _count: { id: true },
        }),
      ]);

      // Calculate status breakdown dictionary
      const statusMap: Record<string, number> = {};
      ordersByStatus.forEach((item) => {
        statusMap[item.status] = item._count.id;
      });

      // Daily chart data for the past 7 days
      const chartDays = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const dayLabel = d.toLocaleDateString("en-US", { weekday: "short" });
        chartDays.push({
          day: dayLabel,
          date: d.toISOString().split("T")[0],
          revenue: 0,
          orders: 0,
        });
      }

      return {
        todaySales: todayOrders._sum.totalAmount || 0,
        todayOrderCount: todayOrders._count.id || 0,
        weekSales: weekOrders._sum.totalAmount || 0,
        weekOrderCount: weekOrders._count.id || 0,
        monthSales: monthOrders._sum.totalAmount || 0,
        monthOrderCount: monthOrders._count.id || 0,
        allOrdersCount,
        customerCount,
        productCount,
        lowStockProducts,
        recentOrders,
        statusMap,
        isDbConnected: true,
        chartDays,
      };
    } catch (error) {
      console.warn("[Admin Dashboard] Database connection pending, using demo fallback data:", error instanceof Error ? error.message : error);
      // Return safe fallback values if DB is empty or disconnected during build
      return {
        isDbConnected: false,
        todaySales: 0,
        todayOrderCount: 0,
        weekSales: 0,
        weekOrderCount: 0,
        monthSales: 0,
        monthOrderCount: 0,
        allOrdersCount: 0,
        customerCount: 0,
        productCount: 0,
        lowStockProducts: [],
        recentOrders: [],
        statusMap: {},
        chartDays: [
          { day: "Mon", revenue: 1200000, orders: 12 },
          { day: "Tue", revenue: 1850000, orders: 18 },
          { day: "Wed", revenue: 2400000, orders: 24 },
          { day: "Thu", revenue: 3100000, orders: 30 },
          { day: "Fri", revenue: 4200000, orders: 45 },
          { day: "Sat", revenue: 5600000, orders: 60 },
          { day: "Sun", revenue: 4800000, orders: 52 },
        ],
      };
    }
  }
}
