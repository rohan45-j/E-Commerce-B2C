import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/server/auth-helpers";
import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

interface RouteProps {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, { params }: RouteProps) {
  try {
    const user = await requireUser();
    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    if (order.userId !== user.id) {
      return NextResponse.json({ success: false, error: "Unauthorized access to order" }, { status: 403 });
    }

    if (order.status !== OrderStatus.PENDING) {
      return NextResponse.json(
        { success: false, error: "Only pending orders can be cancelled. Please contact customer care." },
        { status: 400 }
      );
    }

    // Cancel order and restore stock in atomic transaction
    await prisma.$transaction(async (tx) => {
      // 1. Restore stock
      for (const item of order.items) {
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

      // 2. Mark cancelled
      await tx.order.update({
        where: { id },
        data: { status: OrderStatus.CANCELLED },
      });

      // 3. Log history
      await tx.orderStatusHistory.create({
        data: {
          orderId: id,
          actorId: user.id,
          fromStatus: OrderStatus.PENDING,
          toStatus: OrderStatus.CANCELLED,
          notes: "Cancelled by customer via account portal",
        },
      });
    });

    return NextResponse.json({ success: true, message: "Order cancelled successfully and stock restored" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to cancel order";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
