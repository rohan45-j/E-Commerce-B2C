import { NextRequest, NextResponse } from "next/server";
import { requireStaffOrAdmin } from "@/server/auth-helpers";
import { AdminOrdersService } from "@/server/services/admin-orders.service";

export const dynamic = "force-dynamic";

interface RouteProps {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteProps) {
  try {
    await requireStaffOrAdmin();
    const { id } = await params;
    const order = await AdminOrdersService.getOrderById(id);

    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: order });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch order";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest, { params }: RouteProps) {
  try {
    const session = await requireStaffOrAdmin();
    const { id } = await params;
    const body = await req.json();

    const { action } = body;

    if (action === "UPDATE_STATUS") {
      await AdminOrdersService.updateOrderStatus(
        id,
        body.status,
        body.notes,
        session.id
      );
      return NextResponse.json({ success: true, message: `Status updated to ${body.status}` });
    }

    if (action === "ASSIGN_COURIER") {
      await AdminOrdersService.assignCourier(
        id,
        body.courierName,
        body.trackingNumber,
        body.notes,
        session.id
      );
      return NextResponse.json({ success: true, message: "Courier assigned and order marked shipped" });
    }

    if (action === "UPDATE_PAYMENT") {
      await AdminOrdersService.updatePaymentStatus(
        id,
        body.paymentStatus,
        body.transactionId
      );
      return NextResponse.json({ success: true, message: "Payment status updated" });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update order";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
