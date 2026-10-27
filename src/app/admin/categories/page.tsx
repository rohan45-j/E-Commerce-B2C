"use client";

import * as React from "react";
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
import { Plus, Edit2, Trash2, Layers, FolderTree } from "lucide-react";
import {
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
} from "./actions";
import { slugify } from "@/lib/utils";

interface CategoryRecord {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  description: string | null;
  imageUrl: string | null;
  displayOrder: number;
  isActive: boolean;
  seoTitle?: string | null;
  seoDescription?: string | null;
  parent?: { name: string } | null;
  _count?: { products: number };
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = React.useState<CategoryRecord[]>([]);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingCategory, setEditingCategory] = React.useState<CategoryRecord | null>(null);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const [formName, setFormName] = React.useState("");
  const [formSlug, setFormSlug] = React.useState("");
  const [formParentId, setFormParentId] = React.useState<string>("");
  const [formDesc, setFormDesc] = React.useState("");
  const [formImageUrl, setFormImageUrl] = React.useState("");
  const [formOrder, setFormOrder] = React.useState(0);

  const fetchCategories = React.useCallback(async () => {
    try {
      const res = await fetch("/api/admin/categories");
      if (res.ok) {
        const json = await res.json();
        setCategories(json.data || []);
      }
    } catch {
      // Handled silently
    }
  }, []);

  React.useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormName("");
    setFormSlug("");
    setFormParentId("");
    setFormDesc("");
    setFormImageUrl("");
    setFormOrder(0);
    setIsDialogOpen(true);
  };

  const openEditModal = (cat: CategoryRecord) => {
    setEditingCategory(cat);
    setFormName(cat.name);
    setFormSlug(cat.slug);
    setFormParentId(cat.parentId || "");
    setFormDesc(cat.description || "");
    setFormImageUrl(cat.imageUrl || "");
    setFormOrder(cat.displayOrder);
    setIsDialogOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      toast.error("Category name is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: formName.trim(),
        slug: formSlug.trim() || slugify(formName),
        parentId: formParentId || null,
        description: formDesc.trim() || undefined,
        imageUrl: formImageUrl.trim() || undefined,
        displayOrder: Number(formOrder),
        isActive: true,
      };

      if (editingCategory) {
        const res = await updateCategoryAction(editingCategory.id, payload);
        if (res.success) {
          toast.success("Category updated successfully");
          setIsDialogOpen(false);
          fetchCategories();
        } else {
          toast.error(res.error || "Failed to update category");
        }
      } else {
        const res = await createCategoryAction(payload);
        if (res.success) {
          toast.success("Category created successfully");
          setIsDialogOpen(false);
          fetchCategories();
        } else {
          toast.error(res.error || "Failed to create category");
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
      const res = await deleteCategoryAction(deleteId);
      if (res.success) {
        toast.success("Category deleted");
        setDeleteId(null);
        fetchCategories();
      } else {
        toast.error(res.error || "Failed to delete category");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns: Column<CategoryRecord>[] = [
    {
      header: "Category Name",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
            <Layers className="h-4 w-4" />
          </div>
          <div>
            <p className="font-semibold text-xs text-foreground">{row.name}</p>
            <p className="text-[10px] text-muted-foreground font-mono">/{row.slug}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Parent Category",
      cell: (row) => (
        <span className="text-xs text-muted-foreground">
          {row.parent ? (
            <span className="inline-flex items-center gap-1">
              <FolderTree className="h-3 w-3 text-emerald-600" /> {row.parent.name}
            </span>
          ) : (
            <span className="text-zinc-400 font-mono text-[11px]">— Root —</span>
          )}
        </span>
      ),
    },
    {
      header: "Products",
      cell: (row) => (
        <span className="text-xs font-semibold text-muted-foreground">
          {row._count?.products || 0} items
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
          <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage hierarchical product categories, subcategories, and display order.
          </p>
        </div>
        <Button
          onClick={openCreateModal}
          className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 text-xs"
        >
          <Plus className="h-4 w-4" /> Add Category
        </Button>
      </div>

      <DataTable
        data={categories}
        columns={columns}
        searchKey="name"
        searchPlaceholder="Filter categories..."
      />

      {/* Add / Edit Category Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Edit Category" : "Create New Category"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="catName">Name</Label>
              <Input
                id="catName"
                placeholder="e.g. Men's Panjabi"
                value={formName}
                onChange={(e) => {
                  setFormName(e.target.value);
                  if (!editingCategory) setFormSlug(slugify(e.target.value));
                }}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="catSlug">Slug</Label>
              <Input
                id="catSlug"
                placeholder="mens-panjabi"
                value={formSlug}
                onChange={(e) => setFormSlug(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="catParent">Parent Category (Optional)</Label>
              <select
                id="catParent"
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-xs"
                value={formParentId}
                onChange={(e) => setFormParentId(e.target.value)}
              >
                <option value="">— None (Top Level Root Category) —</option>
                {categories
                  .filter((c) => !editingCategory || c.id !== editingCategory.id)
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="catImg">Banner / Thumbnail Image URL</Label>
              <Input
                id="catImg"
                placeholder="https://..."
                value={formImageUrl}
                onChange={(e) => setFormImageUrl(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="catOrder">Display Order</Label>
                <Input
                  id="catOrder"
                  type="number"
                  value={formOrder}
                  onChange={(e) => setFormOrder(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="catDesc">Description</Label>
              <Textarea
                id="catDesc"
                placeholder="Short description for storefront category banner..."
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
                {isSubmitting ? "Saving..." : "Save Category"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Category"
        description="Are you sure you want to delete this category? Associated products will have their category unlinked."
        onConfirm={handleDelete}
        isLoading={isSubmitting}
      />
    </div>
  );
}
