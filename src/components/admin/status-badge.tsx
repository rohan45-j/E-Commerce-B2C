import { Badge } from "@/components/ui/badge";
import { OrderStatus, PaymentStatus, ProductStatus } from "@prisma/client";

interface StatusBadgeProps {
  status: OrderStatus | PaymentStatus | ProductStatus | string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  switch (status) {
    // Order Statuses
    case "PENDING":
      return (
        <Badge variant="outline" className="border-amber-500 text-amber-600 bg-amber-500/10">
          Pending
        </Badge>
      );
    case "CONFIRMED":
      return (
        <Badge variant="outline" className="border-blue-500 text-blue-600 bg-blue-500/10">
          Confirmed
        </Badge>
      );
    case "PROCESSING":
      return (
        <Badge variant="outline" className="border-indigo-500 text-indigo-600 bg-indigo-500/10">
          Processing
        </Badge>
      );
    case "PACKED":
      return (
        <Badge variant="outline" className="border-purple-500 text-purple-600 bg-purple-500/10">
          Packed
        </Badge>
      );
    case "SHIPPED":
    case "OUT_FOR_DELIVERY":
      return (
        <Badge variant="outline" className="border-sky-500 text-sky-600 bg-sky-500/10">
          In Transit
        </Badge>
      );
    case "DELIVERED":
    case "PAID":
    case "ACTIVE":
      return (
        <Badge variant="outline" className="border-emerald-500 text-emerald-600 bg-emerald-500/10">
          {status === "ACTIVE" ? "Active" : status === "PAID" ? "Paid" : "Delivered"}
        </Badge>
      );
    case "CANCELLED":
    case "FAILED":
    case "ARCHIVED":
      return (
        <Badge variant="outline" className="border-rose-500 text-rose-600 bg-rose-500/10">
          {status === "ARCHIVED" ? "Archived" : status === "FAILED" ? "Failed" : "Cancelled"}
        </Badge>
      );
    case "REFUNDED":
    case "RETURNED":
      return (
        <Badge variant="outline" className="border-orange-500 text-orange-600 bg-orange-500/10">
          {status === "REFUNDED" ? "Refunded" : "Returned"}
        </Badge>
      );
    case "UNPAID":
    case "DRAFT":
      return (
        <Badge variant="outline" className="border-zinc-500 text-zinc-500 bg-zinc-500/10">
          {status === "DRAFT" ? "Draft" : "Unpaid"}
        </Badge>
      );
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}
