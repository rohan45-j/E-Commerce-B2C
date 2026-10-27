"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { toast } from "sonner";
import { Plus, Trash2, Truck } from "lucide-react";
import {
  createShippingZoneAction,
  deleteShippingZoneAction,
  createShippingRateAction,
  deleteShippingRateAction,
} from "./actions";
import { formatBDT } from "@/lib/utils";

interface ShippingRateRecord {
  id: string;
  zoneId: string;
  title: string;
  rateAmount: number;
  minOrderAmount: number | null;
  estimatedDays: string | null;
  isActive: boolean;
}

interface ShippingZoneRecord {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  rates: ShippingRateRecord[];
}

export default function AdminShippingPage() {
  const [zones, setZones] = React.useState<ShippingZoneRecord[]>([]);
  const [isZoneDialogOpen, setIsZoneDialogOpen] = React.useState(false);
  const [isRateDialogOpen, setIsRateDialogOpen] = React.useState(false);
  const [selectedZoneId, setSelectedZoneId] = React.useState<string | null>(null);

  const [deleteZoneId, setDeleteZoneId] = React.useState<string | null>(null);
  const [deleteRateId, setDeleteRateId] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Zone form
  const [zoneName, setZoneName] = React.useState("");
  const [zoneDesc, setZoneDesc] = React.useState("");

  // Rate form
  const [rateTitle, setRateTitle] = React.useState("");
  const [rateAmountBDT, setRateAmountBDT] = React.useState("");
  const [rateMinOrderBDT, setRateMinOrderBDT] = React.useState("");
  const [rateDays, setRateDays] = React.useState("");

  const fetchZones = React.useCallback(async () => {
    try {
      const res = await fetch("/api/admin/shipping");
      if (res.ok) {
        const json = await res.json();
        setZones(json.data || []);
      }
    } catch {
      // Handled silently
    }
  }, []);

  React.useEffect(() => {
    fetchZones();
  }, [fetchZones]);

  const handleCreateZone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!zoneName.trim()) {
      toast.error("Zone name is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createShippingZoneAction({
        name: zoneName.trim(),
        description: zoneDesc.trim() || undefined,
        isActive: true,
      });

      if (res.success) {
        toast.success("Shipping zone created");
        setIsZoneDialogOpen(false);
        setZoneName("");
        setZoneDesc("");
        fetchZones();
      } else {
        toast.error(res.error || "Failed to create zone");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateRate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedZoneId || !rateTitle.trim() || !rateAmountBDT) {
      toast.error("Please fill in rate title and amount");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createShippingRateAction({
        zoneId: selectedZoneId,
        title: rateTitle.trim(),
        rateAmount: Math.round(parseFloat(rateAmountBDT) * 100),
        minOrderAmount: rateMinOrderBDT
          ? Math.round(parseFloat(rateMinOrderBDT) * 100)
          : undefined,
        estimatedDays: rateDays.trim() || undefined,
        isActive: true,
      });

      if (res.success) {
        toast.success("Delivery rate added");
        setIsRateDialogOpen(false);
        setRateTitle("");
        setRateAmountBDT("");
        setRateMinOrderBDT("");
        setRateDays("");
        fetchZones();
      } else {
        toast.error(res.error || "Failed to add rate");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteZone = async () => {
    if (!deleteZoneId) return;
    setIsSubmitting(true);
    try {
      const res = await deleteShippingZoneAction(deleteZoneId);
      if (res.success) {
        toast.success("Zone deleted");
        setDeleteZoneId(null);
        fetchZones();
      } else {
        toast.error(res.error || "Failed to delete zone");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRate = async () => {
    if (!deleteRateId) return;
    setIsSubmitting(true);
    try {
      const res = await deleteShippingRateAction(deleteRateId);
      if (res.success) {
        toast.success("Rate deleted");
        setDeleteRateId(null);
        fetchZones();
      } else {
        toast.error(res.error || "Failed to delete rate");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Shipping Zones & Rates</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure delivery fees by region (Inside Dhaka, Outside Dhaka, All 64 Districts).
          </p>
        </div>
        <Button
          onClick={() => setIsZoneDialogOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 text-xs"
        >
          <Plus className="h-4 w-4" /> Add Delivery Zone
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {zones.map((zone) => (
          <Card key={zone.id} className="border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <Truck className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-sm font-semibold">{zone.name}</CardTitle>
                  <CardDescription className="text-xs">
                    {zone.description || "Configured shipping rates"}
                  </CardDescription>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-rose-600 hover:text-rose-700"
                onClick={() => setDeleteZoneId(zone.id)}
                title="Delete Zone"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {zone.rates.length > 0 ? (
                  zone.rates.map((rate) => (
                    <div
                      key={rate.id}
                      className="flex items-center justify-between p-2.5 rounded-lg border bg-muted/20 text-xs"
                    >
                      <div>
                        <p className="font-semibold text-foreground">{rate.title}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {rate.estimatedDays || "Standard timing"} •{" "}
                          {rate.minOrderAmount
                            ? `Free over ${formatBDT(rate.minOrderAmount)}`
                            : "Fixed rate"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-emerald-600">
                          {formatBDT(rate.rateAmount)}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-rose-600 hover:text-rose-700"
                          onClick={() => setDeleteRateId(rate.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground py-2 text-center">
                    No delivery rates defined for this zone.
                  </p>
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs gap-1.5"
                onClick={() => {
                  setSelectedZoneId(zone.id);
                  setIsRateDialogOpen(true);
                }}
              >
                <Plus className="h-3.5 w-3.5" /> Add Shipping Rate Option
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Zone Dialog */}
      <Dialog open={isZoneDialogOpen} onOpenChange={setIsZoneDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Shipping Zone</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateZone} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="zName">Zone Name</Label>
              <Input
                id="zName"
                placeholder="e.g. Inside Dhaka Metro"
                value={zoneName}
                onChange={(e) => setZoneName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="zDesc">Coverage Description</Label>
              <Input
                id="zDesc"
                placeholder="e.g. Dhaka North and South city corporations"
                value={zoneDesc}
                onChange={(e) => setZoneDesc(e.target.value)}
              />
            </div>
            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsZoneDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Zone"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Rate Dialog */}
      <Dialog open={isRateDialogOpen} onOpenChange={setIsRateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Delivery Rate Option</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateRate} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="rTitle">Rate Title</Label>
              <Input
                id="rTitle"
                placeholder="e.g. Standard Home Delivery (24-48 Hours)"
                value={rateTitle}
                onChange={(e) => setRateTitle(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="rAmt">Charge Amount (৳)</Label>
                <Input
                  id="rAmt"
                  type="number"
                  placeholder="60"
                  value={rateAmountBDT}
                  onChange={(e) => setRateAmountBDT(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="rFreeMin">Free Shipping Min (৳)</Label>
                <Input
                  id="rFreeMin"
                  type="number"
                  placeholder="5000"
                  value={rateMinOrderBDT}
                  onChange={(e) => setRateMinOrderBDT(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="rDays">Estimated Delivery Timeline</Label>
              <Input
                id="rDays"
                placeholder="e.g. 1-2 Business Days"
                value={rateDays}
                onChange={(e) => setRateDays(e.target.value)}
              />
            </div>
            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsRateDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Delivery Rate"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmations */}
      <ConfirmDialog
        open={!!deleteZoneId}
        onOpenChange={(open) => !open && setDeleteZoneId(null)}
        title="Delete Shipping Zone"
        description="Are you sure you want to delete this zone and all associated delivery rates?"
        onConfirm={handleDeleteZone}
        isLoading={isSubmitting}
      />

      <ConfirmDialog
        open={!!deleteRateId}
        onOpenChange={(open) => !open && setDeleteRateId(null)}
        title="Delete Delivery Rate"
        description="Are you sure you want to delete this delivery option?"
        onConfirm={handleDeleteRate}
        isLoading={isSubmitting}
      />
    </div>
  );
}
