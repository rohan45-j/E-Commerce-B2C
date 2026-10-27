"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { DataTable, Column } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { toast } from "sonner";
import { Plus, Edit2, Trash2, Sparkles } from "lucide-react";
import {
  createBannerAction,
  updateBannerAction,
  deleteBannerAction,
} from "./actions";

interface BannerRecord {
  id: string;
  placement: "HERO_SLIDER" | "PROMO_STRIP" | "CATEGORY_FEATURE" | "SIDEBAR" | "FOOTER_BANNER";
  title: string | null;
  subtitle: string | null;
  desktopImage: string;
  mobileImage: string | null;
  linkUrl: string | null;
  displayOrder: number;
  isActive: boolean;
}

export default function AdminBannersPage() {
  const [banners, setBanners] = React.useState<BannerRecord[]>([]);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingBanner, setEditingBanner] = React.useState<BannerRecord | null>(null);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const [formPlacement, setFormPlacement] = React.useState<BannerRecord["placement"]>("HERO_SLIDER");
  const [formTitle, setFormTitle] = React.useState("");
  const [formSubtitle, setFormSubtitle] = React.useState("");
  const [formDesktopImage, setFormDesktopImage] = React.useState("");
  const [formMobileImage, setFormMobileImage] = React.useState("");
  const [formLinkUrl, setFormLinkUrl] = React.useState("");
  const [formOrder, setFormOrder] = React.useState(0);

  const fetchBanners = React.useCallback(async () => {
    try {
      const res = await fetch("/api/admin/banners");
      if (res.ok) {
        const json = await res.json();
        setBanners(json.data || []);
      }
    } catch {
      // Handled silently
    }
  }, []);

  React.useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  const openCreateModal = () => {
    setEditingBanner(null);
    setFormPlacement("HERO_SLIDER");
    setFormTitle("");
    setFormSubtitle("");
    setFormDesktopImage("");
    setFormMobileImage("");
    setFormLinkUrl("");
    setFormOrder(0);
    setIsDialogOpen(true);
  };

  const openEditModal = (b: BannerRecord) => {
    setEditingBanner(b);
    setFormPlacement(b.placement);
    setFormTitle(b.title || "");
    setFormSubtitle(b.subtitle || "");
    setFormDesktopImage(b.desktopImage);
    setFormMobileImage(b.mobileImage || "");
    setFormLinkUrl(b.linkUrl || "");
    setFormOrder(b.displayOrder);
    setIsDialogOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formDesktopImage.trim()) {
      toast.error("Desktop image URL is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        placement: formPlacement,
        title: formTitle.trim() || undefined,
        subtitle: formSubtitle.trim() || undefined,
        desktopImage: formDesktopImage.trim(),
        mobileImage: formMobileImage.trim() || undefined,
        linkUrl: formLinkUrl.trim() || undefined,
        displayOrder: Number(formOrder),
        isActive: true,
      };

      if (editingBanner) {
        const res = await updateBannerAction(editingBanner.id, payload);
        if (res.success) {
          toast.success("Banner updated successfully");
          setIsDialogOpen(false);
          fetchBanners();
        } else {
          toast.error(res.error || "Failed to update banner");
        }
      } else {
        const res = await createBannerAction(payload);
        if (res.success) {
          toast.success("Banner created successfully");
          setIsDialogOpen(false);
          fetchBanners();
        } else {
          toast.error(res.error || "Failed to create banner");
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
      const res = await deleteBannerAction(deleteId);
      if (res.success) {
        toast.success("Banner deleted");
        setDeleteId(null);
        fetchBanners();
      } else {
        toast.error(res.error || "Failed to delete banner");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns: Column<BannerRecord>[] = [
    {
      header: "Banner Preview",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-24 rounded-lg border bg-muted/20 overflow-hidden shrink-0">
            <Image
              src={row.desktopImage}
              alt={row.title || "Banner"}
              fill
              className="object-cover"
            />
          </div>
          <div className="max-w-[200px] truncate text-xs">
            <p className="font-semibold text-foreground truncate">
              {row.title || "Untitled Banner"}
            </p>
            <p className="text-[10px] text-muted-foreground truncate">
              {row.subtitle || row.linkUrl || "No link"}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "Placement",
      cell: (row) => (
        <span className="font-mono text-xs bg-muted/60 px-2 py-0.5 rounded">
          {row.placement}
        </span>
      ),
    },
    {
      header: "Order",
      accessorKey: "displayOrder",
      className: "w-20 text-center",
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
          <h1 className="text-2xl font-bold tracking-tight">Banners & Media</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage hero sliders, promo bars, seasonal strips, and targeted placement visuals.
          </p>
        </div>
        <Button
          onClick={openCreateModal}
          className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 text-xs"
        >
          <Plus className="h-4 w-4" /> Add Banner
        </Button>
      </div>

      <div className="rounded-xl border border-[#04aeef]/30 bg-[#04aeef]/5 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Sparkles className="h-5 w-5 text-[#04aeef] shrink-0" />
          <p className="text-xs text-foreground">
            Looking to edit the <strong>Homepage Hero Section</strong> (headlines, CTA buttons, showcase cards, and trust badges)? Use the visual customizer in <strong>Homepage Builder</strong>.
          </p>
        </div>
        <Link href="/admin/homepage">
          <Button size="sm" variant="outline" className="border-[#04aeef]/40 text-[#04aeef] hover:bg-[#04aeef]/10 text-xs font-bold shrink-0">
            Edit Hero Banner &rarr;
          </Button>
        </Link>
      </div>

      <DataTable
        data={banners}
        columns={columns}
        searchKey="title"
        searchPlaceholder="Filter banners..."
      />

      {/* Add / Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingBanner ? "Edit Banner" : "New Promotional Banner"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="placement">Placement Location</Label>
              <select
                id="placement"
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-xs"
                value={formPlacement}
                onChange={(e) => setFormPlacement(e.target.value as BannerRecord["placement"])}
              >
                <option value="HERO_SLIDER">Hero Slider (Top of Homepage)</option>
                <option value="PROMO_STRIP">Promo Strip (Sitewide Announcement)</option>
                <option value="CATEGORY_FEATURE">Category Feature Grid</option>
                <option value="SIDEBAR">Shop Sidebar</option>
                <option value="FOOTER_BANNER">Footer Banner</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="bTitle">Banner Headline (Optional)</Label>
              <Input
                id="bTitle"
                placeholder="e.g. Eid Luxury Collection 2026"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="bSubtitle">Subtitle / Tagline (Optional)</Label>
              <Input
                id="bSubtitle"
                placeholder="e.g. Handcrafted Silk Panjabis & Jamdanis"
                value={formSubtitle}
                onChange={(e) => setFormSubtitle(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="bDeskImg">Desktop Image URL *</Label>
              <Input
                id="bDeskImg"
                placeholder="https://images.unsplash.com/..."
                value={formDesktopImage}
                onChange={(e) => setFormDesktopImage(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="bMobImg">Mobile Image URL (Optional)</Label>
              <Input
                id="bMobImg"
                placeholder="https://..."
                value={formMobileImage}
                onChange={(e) => setFormMobileImage(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="bLink">Target Link URL</Label>
                <Input
                  id="bLink"
                  placeholder="/shop?category=mens-fashion"
                  value={formLinkUrl}
                  onChange={(e) => setFormLinkUrl(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="bOrder">Display Order</Label>
                <Input
                  id="bOrder"
                  type="number"
                  value={formOrder}
                  onChange={(e) => setFormOrder(Number(e.target.value))}
                />
              </div>
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
                {isSubmitting ? "Saving..." : "Save Banner"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Banner"
        description="Are you sure you want to delete this promotional banner?"
        onConfirm={handleDelete}
        isLoading={isSubmitting}
      />
    </div>
  );
}
