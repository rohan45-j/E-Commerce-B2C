import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CustomerOrdersList } from "@/components/store/customer-orders-list";
import { Package } from "lucide-react";

import { OrderStatus, PaymentStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

interface OrderWithItems {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  createdAt: Date;
  items: {
    id: string;
    productName: string;
    variantName: string | null;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    imageUrl: string | null;
  }[];
}

export default async function CustomerOrdersPage() {
  const session = await auth();
  const userId = session?.user?.id;

  let orders: OrderWithItems[] = [];
  if (userId) {
    try {
      orders = await prisma.order.findMany({
        where: { userId },
        include: {
          items: true,
        },
        orderBy: { createdAt: "desc" },
      });
    } catch {
      // DB offline during build
      orders = [];
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
          <Package className="h-6 w-6 text-emerald-600" />
          My Orders ({orders.length})
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          View past order history, check parcel delivery statuses, or cancel pending orders
        </p>
      </div>

      <CustomerOrdersList
        orders={orders.map((o) => ({
          id: o.id,
          orderNumber: o.orderNumber,
          status: o.status,
          paymentMethod: o.paymentMethod,
          paymentStatus: o.paymentStatus,
          totalAmount: o.totalAmount,
          createdAt: o.createdAt.toISOString(),
          items: o.items.map((i) => ({
            id: i.id,
            productName: i.productName,
            variantName: i.variantName,
            quantity: i.quantity,
            unitPrice: i.unitPrice,
            totalPrice: i.totalPrice,
            imageUrl: i.imageUrl,
          })),
        }))}
      />
    </div>
  );
}
