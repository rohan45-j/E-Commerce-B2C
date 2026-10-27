import { notFound } from "next/navigation";
import { requireStaffOrAdmin } from "@/server/auth-helpers";
import { AdminOrdersService } from "@/server/services/admin-orders.service";
import { OrderDetailManager } from "@/components/admin/order-detail-manager";

export const dynamic = "force-dynamic";

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminOrderDetailPage({ params }: OrderDetailPageProps) {
  await requireStaffOrAdmin();
  const { id } = await params;

  let order = null;
  try {
    order = await AdminOrdersService.getOrderById(id);
  } catch {
    // If DB is offline during build
    order = null;
  }

  if (!order) {
    notFound();
  }

  return (
    <OrderDetailManager
      order={{
        id: order.id,
        orderNumber: order.orderNumber,
        trackingToken: order.trackingToken,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone,
        status: order.status,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        currency: order.currency,
        subtotal: order.subtotal,
        discountAmount: order.discountAmount,
        shippingFee: order.shippingFee,
        totalAmount: order.totalAmount,
        shippingAddress: order.shippingAddress,
        customerNotes: order.customerNotes,
        createdAt: order.createdAt.toISOString(),
        items: order.items.map((i) => ({
          id: i.id,
          productName: i.productName,
          variantName: i.variantName,
          sku: i.sku,
          unitPrice: i.unitPrice,
          quantity: i.quantity,
          totalPrice: i.totalPrice,
          imageUrl: i.imageUrl,
        })),
        statusHistory: order.statusHistory.map((h) => ({
          id: h.id,
          fromStatus: h.fromStatus,
          toStatus: h.toStatus,
          notes: h.notes,
          createdAt: h.createdAt.toISOString(),
          actor: h.actor ? { name: h.actor.name, email: h.actor.email } : null,
        })),
        shipments: order.shipments.map((s) => ({
          id: s.id,
          courierName: s.courierName,
          trackingNumber: s.trackingNumber,
          status: s.status,
          dispatchedAt: s.dispatchedAt ? s.dispatchedAt.toISOString() : null,
        })),
      }}
    />
  );
}
