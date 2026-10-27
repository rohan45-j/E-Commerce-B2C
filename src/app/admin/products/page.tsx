"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { DataTable, Column } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/admin/status-badge";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { formatBDT } from "@/lib/utils";
import { toast } from "sonner";
import {
  Plus,
  Edit2,
  Copy,
  Trash2,
  Download,
  Package,
} from "lucide-react";
import { deleteProductAction, duplicateProductAction } from "./actions";

interface ProductRecord {
  id: string;
  title: string;
  slug: string;
  sku: string;
  basePrice: number;
  compareAtPrice: number | null;
  stock: number;
  status: string;
  isFeatured: boolean;
  category: { name: string };
  brand?: { name: string } | null;
  images: { url: string; isPrimary: boolean }[];
  variants: { id: string; title: string; sku: string; stock: number }[];
}

export default function AdminProductsPage() {
  const [products, setProducts] = React.useState<ProductRecord[]>([]);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [isActionLoading, setIsActionLoading] = React.useState(false);

  const fetchProducts = React.useCallback(async () => {
    try {
      const res = await fetch("/api/admin/products");
      if (res.ok) {
        const json = await res.json();
        setProducts(json.data || []);
      }
    } catch {
      // Handled silently
    }
  }, []);

  React.useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDuplicate = async (id: string) => {
    toast.info("Duplicating product...");
    try {
      const res = await duplicateProductAction(id);
      if (res.success) {
        toast.success("Product duplicated as draft!");
        fetchProducts();
      } else {
        toast.error(res.error || "Failed to duplicate product");
      }
    } catch {
      toast.error("Failed to duplicate product");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsActionLoading(true);
    try {
      const res = await deleteProductAction(deleteId);
      if (res.success) {
        toast.success("Product deleted successfully");
        setDeleteId(null);
        fetchProducts();
      } else {
        toast.error(res.error || "Failed to delete product");
      }
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (!products.length) {
      toast.error("No products to export");
      return;
    }
    const headers = ["Title", "SKU", "Category", "Brand", "Price (BDT)", "Stock", "Status"];
    const rows = products.map((p) => [
      `"${p.title.replace(/"/g, '""')}"`,
      p.sku,
      `"${p.category?.name || ""}"`,
      `"${p.brand?.name || ""}"`,
      p.basePrice / 100,
      p.stock,
      p.status,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `kinakati_products_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Catalog CSV downloaded");
  };

  const columns: Column<ProductRecord>[] = [
    {
      header: "Product",
      cell: (row) => {
        const primaryImg =
          row.images.find((img) => img.isPrimary)?.url || row.images[0]?.url;
        return (
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg border bg-muted/20 flex items-center justify-center overflow-hidden shrink-0">
              {primaryImg ? (
                <Image
                  src={primaryImg}
                  alt={row.title}
                  width={40}
                  height={40}
                  className="object-cover h-full w-full"
                />
              ) : (
                <Package className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
            <div className="max-w-[200px] truncate">
              <Link
                href={`/admin/products/${row.id}/edit`}
                className="font-semibold text-xs text-foreground hover:text-emerald-600 truncate block"
              >
                {row.title}
              </Link>
              <p className="text-[10px] text-muted-foreground font-mono">{row.sku}</p>
            </div>
          </div>
        );
      },
    },
    {
      header: "Category & Brand",
      cell: (row) => (
        <div className="text-xs">
          <p className="font-medium text-foreground">{row.category?.name}</p>
          <p className="text-[10px] text-muted-foreground">{row.brand?.name || "No Brand"}</p>
        </div>
      ),
    },
    {
      header: "Price",
      cell: (row) => (
        <div className="text-xs font-semibold">
          <p>{formatBDT(row.basePrice)}</p>
          {row.compareAtPrice && (
            <p className="text-[10px] text-muted-foreground line-through font-normal">
              {formatBDT(row.compareAtPrice)}
            </p>
          )}
        </div>
      ),
    },
    {
      header: "Stock",
      cell: (row) => (
        <div className="text-xs">
          <span
            className={`font-semibold ${
              row.stock <= 5
                ? "text-rose-600"
                : row.stock <= 15
                ? "text-amber-600"
                : "text-foreground"
            }`}
          >
            {row.stock} units
          </span>
          {row.variants.length > 0 && (
            <p className="text-[10px] text-muted-foreground">
              {row.variants.length} variants
            </p>
          )}
        </div>
      ),
    },
    {
      header: "Status",
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: "Actions",
      className: "text-right w-28",
      cell: (row) => (
        <div className="flex items-center justify-end gap-1">
          <Link href={`/admin/products/${row.id}/edit`}>
            <Button size="icon" variant="ghost" className="h-8 w-8" title="Edit">
              <Edit2 className="h-3.5 w-3.5" />
            </Button>
          </Link>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-blue-600 hover:text-blue-700"
            onClick={() => handleDuplicate(row.id)}
            title="Duplicate"
          >
            <Copy className="h-3.5 w-3.5" />
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
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Full catalog inventory, pricing in BDT poisha, SKU, variants, and SEO meta.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="text-xs gap-1.5"
          >
            <Download className="h-3.5 w-3.5" /> Export CSV
          </Button>
          <Link href="/admin/products/new">
            <Button
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 text-xs"
            >
              <Plus className="h-4 w-4" /> New Product
            </Button>
          </Link>
        </div>
      </div>

      <DataTable
        data={products}
        columns={columns}
        searchKey="title"
        searchPlaceholder="Search by product title or SKU..."
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Product"
        description="Are you sure you want to permanently delete this product? All image mappings and variants will also be removed."
        onConfirm={handleDelete}
        isLoading={isActionLoading}
      />
    </div>
  );
}
