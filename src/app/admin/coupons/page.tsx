"use client";

import * as React from "react";
import { DataTable, Column } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { toast } from "sonner";
import { Plus, Edit2, Trash2, TicketPercent } from "lucide-react";
import {
  createCouponAction,
  updateCouponAction,
  deleteCouponAction,
} from "./actions";
import { formatBDT } from "@/lib/utils";

interface CouponRecord {
  id: string;
  code: string;
  description: string | null;
  type: "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_SHIPPING";
  value: number;
  minOrderAmount: number;
  maxDiscount: number | null;
  usageLimit: number | null;
  usageCount: number;
  perUserLimit: number;
  isActive: boolean;
  _count?: { orders: number };
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = React.useState<CouponRecord[]>([]);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingCoupon, setEditingCoupon] = React.useState<CouponRecord | null>(null);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const [formCode, setFormCode] = React.useState("");
  const [formDesc, setFormDesc] = React.useState("");
  const [formType, setFormType] = React.useState<CouponRecord["type"]>("PERCENTAGE");
  const [formValue, setFormValue] = React.useState("");
  const [formMinOrderBDT, setFormMinOrderBDT] = React.useState("");
  const [formMaxDiscountBDT, setFormMaxDiscountBDT] = React.useState("");
  const [formUsageLimit, setFormUsageLimit] = React.useState("");

  const fetchCoupons = React.useCallback(async () => {
    try {
      const res = await fetch("/api/admin/coupons");
      if (res.ok) {
        const json = await res.json();
        setCoupons(json.data || []);
      }
    } catch {
      // Handled silently
    }
  }, []);

  React.useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  const openCreateModal = () => {
    setEditingCoupon(null);
    setFormCode("");
    setFormDesc("");
    setFormType("PERCENTAGE");
    setFormValue("10");
    setFormMinOrderBDT("1000");
    setFormMaxDiscountBDT("");
    setFormUsageLimit("");
    setIsDialogOpen(true);
  };

  const openEditModal = (c: CouponRecord) => {
    setEditingCoupon(c);
    setFormCode(c.code);
    setFormDesc(c.description || "");
    setFormType(c.type);
    setFormValue(
      c.type === "FIXED_AMOUNT" ? (c.value / 100).toString() : c.value.toString()
    );
    setFormMinOrderBDT((c.minOrderAmount / 100).toString());
    setFormMaxDiscountBDT(
      c.maxDiscount ? (c.maxDiscount / 100).toString() : ""
    );
    setFormUsageLimit(c.usageLimit?.toString() || "");
    setIsDialogOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCode.trim() || !formValue) {
      toast.error("Coupon code and discount value are required");
      return;
    }

    setIsSubmitting(true);
    try {
      const numValue = parseFloat(formValue);
      const computedValue =
        formType === "FIXED_AMOUNT" ? Math.round(numValue * 100) : numValue;

      const payload = {
        code: formCode.trim().toUpperCase(),
        description: formDesc.trim() || undefined,
        type: formType,
        value: computedValue,
        minOrderAmount: Math.round((parseFloat(formMinOrderBDT) || 0) * 100),
        maxDiscount: formMaxDiscountBDT
          ? Math.round(parseFloat(formMaxDiscountBDT) * 100)
          : undefined,
        usageLimit: formUsageLimit ? parseInt(formUsageLimit, 10) : undefined,
        perUserLimit: 1,
        isActive: true,
      };

      if (editingCoupon) {
        const res = await updateCouponAction(editingCoupon.id, payload);
        if (res.success) {
          toast.success("Coupon updated successfully");
          setIsDialogOpen(false);
          fetchCoupons();
        } else {
          toast.error(res.error || "Failed to update coupon");
        }
      } else {
        const res = await createCouponAction(payload);
        if (res.success) {
          toast.success("Coupon created successfully");
          setIsDialogOpen(false);
          fetchCoupons();
        } else {
          toast.error(res.error || "Failed to create coupon");
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsSubmitting(true);
    try {
      const res = await deleteCouponAction(deleteId);
      if (res.success) {
        toast.success("Coupon deleted");
        setDeleteId(null);
        fetchCoupons();
      } else {
        toast.error(res.error || "Failed to delete coupon");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns: Column<CouponRecord>[] = [
    {
      header: "Coupon Code",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
            <TicketPercent className="h-4 w-4" />
          </div>
          <div>
            <span className="font-mono font-bold text-xs text-foreground tracking-wider">
              {row.code}
            </span>
            <p className="text-[10px] text-muted-foreground truncate max-w-xs">
              {row.description || "No description"}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "Discount Rule",
      cell: (row) => (
        <span className="text-xs font-semibold text-emerald-600">
          {row.type === "PERCENTAGE"
            ? `${row.value}% OFF`
            : row.type === "FIXED_AMOUNT"
            ? `${formatBDT(row.value)} OFF`
            : "Free Shipping"}
        </span>
      ),
    },
    {
      header: "Min Order",
      cell: (row) => (
        <span className="text-xs text-muted-foreground">
          {row.minOrderAmount > 0 ? formatBDT(row.minOrderAmount) : "None"}
        </span>
      ),
    },
    {
      header: "Usage Count",
      cell: (row) => (
        <span className="text-xs font-medium">
          {row.usageCount}
          {row.usageLimit ? ` / ${row.usageLimit}` : " (Unlimited)"}
        </span>
      ),
    },
    {
      header: "Status",
      cell: (row) =>
        row.isActive ? (
          <Badge variant="outline" className="border-emerald-500 text-emerald-600 bg-emerald-500/10 text-[10px]">
            Active
          </Badge>
        ) : (
          <Badge variant="outline" className="border-zinc-500 text-zinc-500 bg-zinc-500/10 text-[10px]">
            Disabled
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
            onClick={() => openEditModal(row)}
            title="Edit"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-rose-600 hover:text-rose-700"
            onClick={() => setDeleteId(row.id)}
            title="Delete"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Coupons & Discounts</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Create percentage discounts, fixed BDT vouchers, and free shipping codes.
          </p>
        </div>
        <Button
          onClick={openCreateModal}
          className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 text-xs"
        >
          <Plus className="h-4 w-4" /> Create Coupon
        </Button>
      </div>

      <DataTable
        data={coupons}
        columns={columns}
        searchKey="code"
        searchPlaceholder="Filter coupons by code..."
      />

      {/* Add / Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingCoupon ? "Edit Coupon" : "Create New Coupon"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="cCode">Coupon Code (e.g. EID2026)</Label>
              <Input
                id="cCode"
                placeholder="WELCOME10"
                value={formCode}
                onChange={(e) => setFormCode(e.target.value.toUpperCase())}
                className="font-mono uppercase font-bold"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cType">Discount Type</Label>
              <select
                id="cType"
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-xs"
                value={formType}
                onChange={(e) => setFormType(e.target.value as CouponRecord["type"])}
              >
                <option value="PERCENTAGE">Percentage Discount (%)</option>
                <option value="FIXED_AMOUNT">Fixed BDT Amount (৳)</option>
                <option value="FREE_SHIPPING">Free Delivery Nationwide</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cVal">
                {formType === "PERCENTAGE"
                  ? "Discount Percentage (%)"
                  : formType === "FIXED_AMOUNT"
                  ? "Fixed Amount in BDT (৳)"
                  : "Shipping Waiver Value (৳)"}
              </Label>
              <Input
                id="cVal"
                type="number"
                placeholder={formType === "PERCENTAGE" ? "10" : "500"}
                value={formValue}
                onChange={(e) => setFormValue(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="cMin">Min Order (৳)</Label>
                <Input
                  id="cMin"
                  type="number"
                  placeholder="1000"
                  value={formMinOrderBDT}
                  onChange={(e) => setFormMinOrderBDT(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cMax">Max Discount (৳)</Label>
                <Input
                  id="cMax"
                  type="number"
                  placeholder="500"
                  value={formMaxDiscountBDT}
                  onChange={(e) => setFormMaxDiscountBDT(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cUsage">Total Usage Limit (Leave blank for unlimited)</Label>
              <Input
                id="cUsage"
                type="number"
                placeholder="100"
                value={formUsageLimit}
                onChange={(e) => setFormUsageLimit(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cDesc">Public Description</Label>
              <Input
                id="cDesc"
                placeholder="Get 10% off on your first order"
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Coupon"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Coupon"
        description="Are you sure you want to delete this coupon? Customers will no longer be able to apply it at checkout."
        onConfirm={handleDelete}
        isLoading={isSubmitting}
      />
    </div>
  );
}
