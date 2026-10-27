"use client";

import * as React from "react";
import { DataTable, Column } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { AlertTriangle, Check, Filter } from "lucide-react";
import { quickUpdateStockAction } from "./actions";
import { formatBDT } from "@/lib/utils";

interface InventoryRecord {
  id: string;
  title: string;
  sku: string;
  stock: number;
  basePrice: number;
  category: { name: string };
  variants: { id: string; title: string; sku: string; stock: number }[];
}

export default function AdminInventoryPage() {
  const [items, setItems] = React.useState<InventoryRecord[]>([]);
  const [lowStockOnly, setLowStockOnly] = React.useState(false);
  const [editingStock, setEditingStock] = React.useState<Record<string, number>>({});
  const [savingId, setSavingId] = React.useState<string | null>(null);

  const fetchInventory = React.useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/inventory?lowStock=${lowStockOnly}`);
      if (res.ok) {
        const json = await res.json();
        setItems(json.data || []);
      }
    } catch {
      // Handled silently
    }
  }, [lowStockOnly]);

  React.useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const handleStockChange = (id: string, val: number) => {
    setEditingStock((prev) => ({ ...prev, [id]: val }));
  };

  const handleSaveStock = async (id: string) => {
    const val = editingStock[id];
    if (val === undefined || isNaN(val) || val < 0) {
      toast.error("Please enter a valid stock quantity");
      return;
    }

    setSavingId(id);
    try {
      const res = await quickUpdateStockAction({ productId: id, stock: val });
      if (res.success) {
        toast.success("Stock updated successfully");
        setEditingStock((prev) => {
          const next = { ...prev };
          delete next[id];
          return next;
        });
        fetchInventory();
      } else {
        toast.error(res.error || "Failed to update stock");
      }
    } finally {
      setSavingId(null);
    }
  };

  const columns: Column<InventoryRecord>[] = [
    {
      header: "Product / SKU",
      cell: (row) => (
        <div className="text-xs">
          <p className="font-semibold text-foreground">{row.title}</p>
          <p className="text-[10px] font-mono text-muted-foreground">{row.sku}</p>
          <p className="text-[10px] text-emerald-600">{row.category?.name}</p>
        </div>
      ),
    },
    {
      header: "Price",
      cell: (row) => (
        <span className="text-xs font-semibold">{formatBDT(row.basePrice)}</span>
      ),
    },
    {
      header: "Inventory Health",
      cell: (row) => {
        if (row.stock === 0) {
          return (
            <Badge variant="destructive" className="text-[10px]">
              Out of Stock
            </Badge>
          );
        }
        if (row.stock <= 10) {
          return (
            <Badge variant="outline" className="border-amber-500 text-amber-600 bg-amber-500/10 text-[10px] gap-1">
              <AlertTriangle className="h-3 w-3" /> Low Stock ({row.stock})
            </Badge>
          );
        }
        return (
          <Badge variant="outline" className="border-emerald-500 text-emerald-600 bg-emerald-500/10 text-[10px]">
            In Stock ({row.stock})
          </Badge>
        );
      },
    },
    {
      header: "Quick Edit Stock",
      className: "w-44",
      cell: (row) => {
        const isEditing = editingStock[row.id] !== undefined;
        const currentVal = isEditing ? editingStock[row.id] : row.stock;

        return (
          <div className="flex items-center gap-1.5">
            <Input
              type="number"
              min="0"
              value={currentVal}
              onChange={(e) =>
                handleStockChange(row.id, parseInt(e.target.value, 10) || 0)
              }
              className="h-8 w-20 text-xs font-mono"
            />
            {isEditing && (
              <Button
                size="sm"
                onClick={() => handleSaveStock(row.id)}
                disabled={savingId === row.id}
                className="h-8 px-2 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Check className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Inventory Management</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Monitor real-time warehouse stock levels, low-stock alerts, and perform quick quantity adjustments.
          </p>
        </div>
        <Button
          variant={lowStockOnly ? "default" : "outline"}
          size="sm"
          onClick={() => setLowStockOnly(!lowStockOnly)}
          className={`text-xs gap-1.5 ${
            lowStockOnly ? "bg-amber-600 hover:bg-amber-700 text-white" : ""
          }`}
        >
          <Filter className="h-3.5 w-3.5" />
          {lowStockOnly ? "Showing Low Stock (<= 10)" : "Filter Low Stock"}
        </Button>
      </div>

      <DataTable
        data={items}
        columns={columns}
        searchKey="title"
        searchPlaceholder="Search product by name or SKU..."
      />
    </div>
  );
}
