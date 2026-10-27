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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HeroSectionCustomizer } from "@/components/admin/hero-section-customizer";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { toast } from "sonner";
import { Plus, Edit2, Trash2, LayoutTemplate, Sparkles } from "lucide-react";
import {
  createHomepageSectionAction,
  updateHomepageSectionAction,
  deleteHomepageSectionAction,
} from "./actions";

interface HomepageSectionRecord {
  id: string;
  title: string;
  subtitle: string | null;
  type:
    | "HERO_BANNER"
    | "FEATURED_CATEGORIES"
    | "FLASH_SALE"
    | "NEW_ARRIVALS"
    | "BEST_SELLERS"
    | "BRAND_SHOWCASE"
    | "PROMO_GRID"
    | "CUSTOM_HTML"
    | "TESTIMONIALS";
  contentJson: string | null;
  displayOrder: number;
  isActive: boolean;
}

export default function AdminHomepagePage() {
  const [sections, setSections] = React.useState<HomepageSectionRecord[]>([]);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingSection, setEditingSection] = React.useState<HomepageSectionRecord | null>(null);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const [formTitle, setFormTitle] = React.useState("");
  const [formSubtitle, setFormSubtitle] = React.useState("");
  const [formType, setFormType] = React.useState<HomepageSectionRecord["type"]>("FEATURED_CATEGORIES");
  const [formOrder, setFormOrder] = React.useState(0);
  const [formActive, setFormActive] = React.useState(true);
  const [settings, setSettings] = React.useState<Record<string, string>>({});

  const fetchSettings = React.useCallback(async () => {
    try {
      const res = await fetch("/api/admin/settings");
      if (res.ok) {
        const json = await res.json();
        setSettings(json.data || {});
      }
    } catch {
      // Handled silently
    }
  }, []);

  const fetchSections = React.useCallback(async () => {
    try {
      const res = await fetch("/api/admin/homepage");
      if (res.ok) {
        const json = await res.json();
        setSections(json.data || []);
      }
    } catch {
      // Handled silently
    }
  }, []);

  React.useEffect(() => {
    fetchSections();
    fetchSettings();
  }, [fetchSections, fetchSettings]);

  const openCreateModal = () => {
    setEditingSection(null);
    setFormTitle("");
    setFormSubtitle("");
    setFormType("FEATURED_CATEGORIES");
    setFormOrder(sections.length + 1);
    setFormActive(true);
    setIsDialogOpen(true);
  };

  const openEditModal = (s: HomepageSectionRecord) => {
    setEditingSection(s);
    setFormTitle(s.title);
    setFormSubtitle(s.subtitle || "");
    setFormType(s.type);
    setFormOrder(s.displayOrder);
    setFormActive(s.isActive);
    setIsDialogOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      toast.error("Section title is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        title: formTitle.trim(),
        subtitle: formSubtitle.trim() || undefined,
        type: formType,
        displayOrder: Number(formOrder),
        isActive: formActive,
      };

      if (editingSection) {
        const res = await updateHomepageSectionAction(editingSection.id, payload);
        if (res.success) {
          toast.success("Homepage section updated");
          setIsDialogOpen(false);
          fetchSections();
        } else {
          toast.error(res.error || "Failed to update section");
        }
      } else {
        const res = await createHomepageSectionAction(payload);
        if (res.success) {
          toast.success("Homepage section created");
          setIsDialogOpen(false);
          fetchSections();
        } else {
          toast.error(res.error || "Failed to create section");
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
      const res = await deleteHomepageSectionAction(deleteId);
      if (res.success) {
        toast.success("Section removed");
        setDeleteId(null);
        fetchSections();
      } else {
        toast.error(res.error || "Failed to delete section");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns: Column<HomepageSectionRecord>[] = [
    {
      header: "Section Block",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
            <LayoutTemplate className="h-4 w-4" />
          </div>
          <div>
            <p className="font-semibold text-xs text-foreground">{row.title}</p>
            <p className="text-[10px] text-muted-foreground">{row.subtitle || "No subtitle"}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Component Type",
      cell: (row) => (
        <span className="font-mono text-xs bg-muted/60 px-2 py-0.5 rounded">
          {row.type}
        </span>
      ),
    },
    {
      header: "Display Order",
      accessorKey: "displayOrder",
      className: "w-24 text-center",
    },
    {
      header: "Status",
      cell: (row) =>
        row.isActive ? (
          <Badge variant="outline" className="border-emerald-500 text-emerald-600 bg-emerald-500/10 text-[10px]">
            Visible
          </Badge>
        ) : (
          <Badge variant="outline" className="border-zinc-500 text-zinc-500 bg-zinc-500/10 text-[10px]">
            Hidden
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
          <h1 className="text-2xl font-bold tracking-tight">Homepage Builder</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage your storefront hero banner, headlines, CTA buttons, and dynamic content sections.
          </p>
        </div>
      </div>

      <Tabs defaultValue="hero" className="w-full">
        <TabsList className="mb-6 grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="hero" className="gap-2 text-xs font-bold text-[#04aeef]">
            <Sparkles className="h-3.5 w-3.5" /> Hero Banner Section
          </TabsTrigger>
          <TabsTrigger value="sections" className="gap-2 text-xs font-bold">
            <LayoutTemplate className="h-3.5 w-3.5" /> Content Sections
          </TabsTrigger>
        </TabsList>

        <TabsContent value="hero">
          <HeroSectionCustomizer initialSettings={settings} onSaved={fetchSettings} />
        </TabsContent>

        <TabsContent value="sections" className="space-y-6">
          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground">
              Arrange category rails, flash sales, and brand blocks below the hero banner.
            </p>
            <Button
              onClick={openCreateModal}
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 text-xs"
            >
              <Plus className="h-4 w-4" /> Add Section
            </Button>
          </div>

          <DataTable
            data={sections}
            columns={columns}
            searchKey="title"
            searchPlaceholder="Filter sections..."
          />
        </TabsContent>
      </Tabs>

      {/* Add / Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingSection ? "Edit Section Block" : "Add Section Block"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="secTitle">Section Title</Label>
              <Input
                id="secTitle"
                placeholder="e.g. Featured Categories"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="secSubtitle">Subtitle (Optional)</Label>
              <Input
                id="secSubtitle"
                placeholder="e.g. Explore our finest handpicked collections"
                value={formSubtitle}
                onChange={(e) => setFormSubtitle(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="secType">Section Type</Label>
              <select
                id="secType"
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-xs"
                value={formType}
                onChange={(e) => setFormType(e.target.value as HomepageSectionRecord["type"])}
              >
                <option value="HERO_BANNER">Hero Banner Slider</option>
                <option value="FEATURED_CATEGORIES">Featured Categories Grid</option>
                <option value="FLASH_SALE">Flash Sale / Festive Deals</option>
                <option value="NEW_ARRIVALS">New Arrivals Carousel</option>
                <option value="BEST_SELLERS">Best Sellers Grid</option>
                <option value="BRAND_SHOWCASE">Brand Logos Showcase</option>
                <option value="PROMO_GRID">Promo Image Grid</option>
                <option value="TESTIMONIALS">Customer Testimonials</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="secOrder">Display Order (1 = top)</Label>
                <Input
                  id="secOrder"
                  type="number"
                  value={formOrder}
                  onChange={(e) => setFormOrder(Number(e.target.value))}
                />
              </div>

              <div className="space-y-1.5 flex flex-col justify-end">
                <label className="flex items-center gap-2 text-xs cursor-pointer pb-2">
                  <input
                    type="checkbox"
                    checked={formActive}
                    onChange={(e) => setFormActive(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  Active & Visible
                </label>
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
                {isSubmitting ? "Saving..." : "Save Section"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Homepage Section"
        description="Are you sure you want to remove this section from the storefront homepage?"
        onConfirm={handleDelete}
        isLoading={isSubmitting}
      />
    </div>
  );
}
