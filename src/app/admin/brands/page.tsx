"use client";

import * as React from "react";
import Image from "next/image";
import { DataTable, Column } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { toast } from "sonner";
import { Plus, Edit2, Trash2, Tag } from "lucide-react";
import { createBrandAction, updateBrandAction, deleteBrandAction } from "./actions";
import { slugify } from "@/lib/utils";

interface BrandRecord {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  description: string | null;
  websiteUrl: string | null;
  isActive: boolean;
  _count?: { products: number };
}

export default function AdminBrandsPage() {
  const [brands, setBrands] = React.useState<BrandRecord[]>([]);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingBrand, setEditingBrand] = React.useState<BrandRecord | null>(null);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const [formName, setFormName] = React.useState("");
  const [formSlug, setFormSlug] = React.useState("");
  const [formLogoUrl, setFormLogoUrl] = React.useState("");
  const [formWebsiteUrl, setFormWebsiteUrl] = React.useState("");
  const [formDesc, setFormDesc] = React.useState("");

  const fetchBrands = React.useCallback(async () => {
    try {
      const res = await fetch("/api/admin/brands");
      if (res.ok) {
        const json = await res.json();
        setBrands(json.data || []);
      }
    } catch {
      // Handled silently
    }
  }, []);

  React.useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  const openCreateModal = () => {
    setEditingBrand(null);
    setFormName("");
    setFormSlug("");
    setFormLogoUrl("");
    setFormWebsiteUrl("");
    setFormDesc("");
    setIsDialogOpen(true);
  };

  const openEditModal = (b: BrandRecord) => {
    setEditingBrand(b);
    setFormName(b.name);
    setFormSlug(b.slug);
    setFormLogoUrl(b.logoUrl || "");
    setFormWebsiteUrl(b.websiteUrl || "");
    setFormDesc(b.description || "");
    setIsDialogOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      toast.error("Brand name is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: formName.trim(),
        slug: formSlug.trim() || slugify(formName),
        logoUrl: formLogoUrl.trim() || undefined,
        websiteUrl: formWebsiteUrl.trim() || undefined,
        description: formDesc.trim() || undefined,
        isActive: true,
      };

      if (editingBrand) {
        const res = await updateBrandAction(editingBrand.id, payload);
        if (res.success) {
          toast.success("Brand updated successfully");
          setIsDialogOpen(false);
          fetchBrands();
        } else {
          toast.error(res.error || "Failed to update brand");
        }
      } else {
        const res = await createBrandAction(payload);
        if (res.success) {
          toast.success("Brand created successfully");
          setIsDialogOpen(false);
          fetchBrands();
        } else {
          toast.error(res.error || "Failed to create brand");
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
      const res = await deleteBrandAction(deleteId);
      if (res.success) {
        toast.success("Brand deleted");
        setDeleteId(null);
        fetchBrands();
      } else {
        toast.error(res.error || "Failed to delete brand");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns: Column<BrandRecord>[] = [
    {
      header: "Brand Name",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg border bg-muted/20 flex items-center justify-center overflow-hidden shrink-0">
            {row.logoUrl ? (
              <Image
                src={row.logoUrl}
                alt={row.name}
                width={36}
                height={36}
                className="object-cover"
              />
            ) : (
              <Tag className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
          <div>
            <p className="font-semibold text-xs text-foreground">{row.name}</p>
            <p className="text-[10px] text-muted-foreground font-mono">/{row.slug}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Website",
      cell: (row) => (
        <span className="text-xs text-muted-foreground">
          {row.websiteUrl ? (
            <a
              href={row.websiteUrl}
              target="_blank"
              rel="noreferrer"
              className="text-emerald-600 hover:underline"
            >
              {row.websiteUrl.replace(/^https?:\/\//, "")}
            </a>
          ) : (
            "—"
          )}
        </span>
      ),
    },
    {
      header: "Products Linked",
      cell: (row) => (
        <span className="text-xs font-semibold text-muted-foreground">
          {row._count?.products || 0} products
        </span>
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
          <h1 className="text-2xl font-bold tracking-tight">Brands</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage partner brands, manufacturer logos, and store brand profiles.
          </p>
        </div>
        <Button
          onClick={openCreateModal}
          className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 text-xs"
        >
          <Plus className="h-4 w-4" /> Add Brand
        </Button>
      </div>

      <DataTable
        data={brands}
        columns={columns}
        searchKey="name"
        searchPlaceholder="Filter brands..."
      />

      {/* Add / Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingBrand ? "Edit Brand" : "Create New Brand"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="brandName">Name</Label>
              <Input
                id="brandName"
                placeholder="e.g. Apex Footwear"
                value={formName}
                onChange={(e) => {
                  setFormName(e.target.value);
                  if (!editingBrand) setFormSlug(slugify(e.target.value));
                }}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="brandSlug">Slug</Label>
              <Input
                id="brandSlug"
                placeholder="apex-footwear"
                value={formSlug}
                onChange={(e) => setFormSlug(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="brandLogo">Logo Image URL</Label>
              <Input
                id="brandLogo"
                placeholder="https://..."
                value={formLogoUrl}
                onChange={(e) => setFormLogoUrl(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="brandWeb">Website URL (Optional)</Label>
              <Input
                id="brandWeb"
                placeholder="https://example.com"
                value={formWebsiteUrl}
                onChange={(e) => setFormWebsiteUrl(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="brandDesc">Description</Label>
              <Textarea
                id="brandDesc"
                placeholder="Brief heritage background of the brand..."
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
                rows={3}
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
                {isSubmitting ? "Saving..." : "Save Brand"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Brand"
        description="Are you sure you want to delete this brand? Products linked to this brand will remain intact with brand unlinked."
        onConfirm={handleDelete}
        isLoading={isSubmitting}
      />
    </div>
  );
}
