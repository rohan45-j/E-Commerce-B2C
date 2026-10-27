import { prisma } from "@/lib/prisma";
import { OrderStatus, PaymentStatus } from "@prisma/client";

export interface OrderFilterParams {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  search?: string;
  page?: number;
  limit?: number;
}

export class AdminOrdersService {
  /**
   * List orders with faceted filters and search
   */
  static async listOrders(params: OrderFilterParams = {}) {
    const page = params.page || 1;
    const limit = params.limit || 25;
    const skip = (page - 1) * limit;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (params.status) {
      where.status = params.status;
    }

    if (params.paymentStatus) {
      where.paymentStatus = params.paymentStatus;
    }

    if (params.search) {
      const q = params.search.trim();
      where.OR = [
        { orderNumber: { contains: q, mode: "insensitive" } },
        { customerName: { contains: q, mode: "insensitive" } },
        { customerPhone: { contains: q } },
        { customerEmail: { contains: q, mode: "insensitive" } },
      ];
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: true,
          shipments: { orderBy: { createdAt: "desc" }, take: 1 },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    // Metric counts
    const [pendingCount, processingCount, shippedCount, deliveredCount] = await Promise.all([
      prisma.order.count({ where: { status: OrderStatus.PENDING } }),
      prisma.order.count({ where: { status: OrderStatus.PROCESSING } }),
      prisma.order.count({ where: { status: OrderStatus.SHIPPED } }),
      prisma.order.count({ where: { status: OrderStatus.DELIVERED } }),
    ]);

    return {
      orders,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      metrics: {
        total,
        pending: pendingCount,
        processing: processingCount,
        shipped: shippedCount,
        delivered: deliveredCount,
      },
    };
  }

  /**
   * Get single order details with full relations
   */
  static async getOrderById(id: string) {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        statusHistory: {
          include: { actor: { select: { name: true, email: true } } },
          orderBy: { createdAt: "desc" },
        },
        shipments: { orderBy: { createdAt: "desc" } },
        payments: { orderBy: { createdAt: "desc" } },
      },
    });

    return order;
  }

  /**
   * Update order status with audit log and inventory restoration on cancellation
   */
  static async updateOrderStatus(
    orderId: string,
    newStatus: OrderStatus,
    notes?: string,
    actorId?: string
  ) {
    const current = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!current) throw new Error("Order not found");

    await prisma.$transaction(async (tx) => {
      // 1. If transitioning to CANCELLED or REFUNDED from an active status, restore stock
      const isCancelling =
        (newStatus === OrderStatus.CANCELLED || newStatus === OrderStatus.REFUNDED) &&
        current.status !== OrderStatus.CANCELLED &&
        current.status !== OrderStatus.REFUNDED;

      if (isCancelling) {
        for (const item of current.items) {
          if (item.variantId) {
            await tx.productVariant.update({
              where: { id: item.variantId },
              data: { stock: { increment: item.quantity } },
            });
          }
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          });
        }
      }

      // 2. Update order status
      await tx.order.update({
        where: { id: orderId },
        data: { status: newStatus },
      });

      // 3. Create status history log
      await tx.orderStatusHistory.create({
        data: {
          orderId,
          actorId: actorId || null,
          fromStatus: current.status,
          toStatus: newStatus,
          notes: notes || `Order status updated to ${newStatus}`,
        },
      });
    });

    return { success: true };
  }

  /**
   * Assign courier and dispatch shipment
   */
  static async assignCourier(
    orderId: string,
    courierName: string,
    trackingNumber: string,
    notes?: string,
    actorId?: string
  ) {
    const current = await prisma.order.findUnique({ where: { id: orderId } });
    if (!current) throw new Error("Order not found");

    await prisma.$transaction(async (tx) => {
      await tx.shipment.create({
        data: {
          orderId,
          courierName,
          trackingNumber,
          status: "DISPATCHED",
          dispatchedAt: new Date(),
          notes: notes || null,
        },
      });

      await tx.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.SHIPPED },
      });

      await tx.orderStatusHistory.create({
        data: {
          orderId,
          actorId: actorId || null,
          fromStatus: current.status,
          toStatus: OrderStatus.SHIPPED,
          notes: `Assigned courier: ${courierName} (Consignment: ${trackingNumber})`,
        },
      });
    });

    return { success: true };
  }

  /**
   * Update payment status (e.g. COD collection confirmed)
   */
  static async updatePaymentStatus(
    orderId: string,
    paymentStatus: PaymentStatus,
    transactionId?: string
  ) {
    await prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus },
    });

    if (transactionId) {
      await prisma.payment.upsert({
        where: { transactionId },
        update: { status: paymentStatus },
        create: {
          orderId,
          provider: "COD",
          transactionId,
          amount: 0,
          status: paymentStatus,
        },
      });
    }

    return { success: true };
  }
}
