"use client";

import * as React from "react";
import { DataTable, Column } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { toast } from "sonner";
import { Star, CheckCircle, EyeOff, Trash2 } from "lucide-react";
import { moderateReviewAction, deleteReviewAction } from "./actions";

interface ReviewRecord {
  id: string;
  rating: number;
  title: string | null;
  comment: string;
  isApproved: boolean;
  createdAt: string;
  product: { id: string; title: string; slug: string };
  user: { id: string; name: string | null; email: string };
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = React.useState<ReviewRecord[]>([]);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [isActionLoading, setIsActionLoading] = React.useState(false);

  const fetchReviews = React.useCallback(async () => {
    try {
      const res = await fetch("/api/admin/reviews");
      if (res.ok) {
        const json = await res.json();
        setReviews(json.data || []);
      }
    } catch {
      // Handled silently
    }
  }, []);

  React.useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleToggleApprove = async (id: string, currentStatus: boolean) => {
    try {
      const res = await moderateReviewAction(id, !currentStatus);
      if (res.success) {
        toast.success(
          !currentStatus ? "Review approved and visible to public" : "Review hidden"
        );
        fetchReviews();
      } else {
        toast.error(res.error || "Action failed");
      }
    } catch {
      toast.error("Failed to update review status");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsActionLoading(true);
    try {
      const res = await deleteReviewAction(deleteId);
      if (res.success) {
        toast.success("Review deleted");
        setDeleteId(null);
        fetchReviews();
      } else {
        toast.error(res.error || "Failed to delete review");
      }
    } finally {
      setIsActionLoading(false);
    }
  };

  const columns: Column<ReviewRecord>[] = [
    {
      header: "Product",
      cell: (row) => (
        <div className="max-w-[200px] truncate text-xs">
          <p className="font-semibold text-foreground truncate">{row.product.title}</p>
          <p className="text-[10px] text-muted-foreground">ID: {row.product.id.slice(0, 8)}...</p>
        </div>
      ),
    },
    {
      header: "Rating",
      cell: (row) => (
        <div className="flex items-center gap-1 text-amber-500">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-3.5 w-3.5 ${
                i < row.rating ? "fill-amber-400 text-amber-400" : "text-muted"
              }`}
            />
          ))}
        </div>
      ),
    },
    {
      header: "Comment",
      cell: (row) => (
        <div className="max-w-xs text-xs space-y-0.5">
          {row.title && <p className="font-semibold">{row.title}</p>}
          <p className="text-muted-foreground line-clamp-2">{row.comment}</p>
        </div>
      ),
    },
    {
      header: "Author",
      cell: (row) => (
        <div className="text-xs">
          <p className="font-medium">{row.user.name || "Anonymous"}</p>
          <p className="text-[10px] text-muted-foreground">{row.user.email}</p>
        </div>
      ),
    },
    {
      header: "Status",
      cell: (row) =>
        row.isApproved ? (
          <Badge variant="outline" className="border-emerald-500 text-emerald-600 bg-emerald-500/10 text-[10px]">
            Approved
          </Badge>
        ) : (
          <Badge variant="outline" className="border-amber-500 text-amber-600 bg-amber-500/10 text-[10px]">
            Pending / Hidden
          </Badge>
        ),
    },
    {
      header: "Actions",
      className: "text-right w-24",
      cell: (row) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={() => handleToggleApprove(row.id, row.isApproved)}
            title={row.isApproved ? "Hide Review" : "Approve Review"}
          >
            {row.isApproved ? (
              <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
            ) : (
              <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
            )}
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-rose-600 hover:text-rose-700"
            onClick={() => setDeleteId(row.id)}
            title="Delete Review"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Customer Reviews</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Moderate verified buyer reviews before they appear publicly on product pages.
        </p>
      </div>

      <DataTable
        data={reviews}
        columns={columns}
        searchKey="comment"
        searchPlaceholder="Search review comments..."
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Review"
        description="Are you sure you want to delete this customer review permanently?"
        onConfirm={handleDelete}
        isLoading={isActionLoading}
      />
    </div>
  );
}
