import { NextRequest, NextResponse } from "next/server";
import { requireStaffOrAdmin } from "@/server/auth-helpers";
import { AdminOrdersService } from "@/server/services/admin-orders.service";
import { OrderStatus, PaymentStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await requireStaffOrAdmin();
    const searchParams = req.nextUrl.searchParams;

    const status = searchParams.get("status") as OrderStatus | null;
    const paymentStatus = searchParams.get("paymentStatus") as PaymentStatus | null;
    const search = searchParams.get("search") || undefined;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "25", 10);

    const result = await AdminOrdersService.listOrders({
      status: status || undefined,
      paymentStatus: paymentStatus || undefined,
      search,
      page,
      limit,
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch orders";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
