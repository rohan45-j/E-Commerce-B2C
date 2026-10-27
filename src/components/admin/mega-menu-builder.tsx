"use client";

import * as React from "react";
import Image from "next/image";
import {
  MegaMenuItem,
  DEFAULT_MEGA_MENU_DATA,
} from "@/lib/megamenu-config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Plus,
  Trash2,
  Save,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Eye,
  Layers,
  Sparkles,
  Loader2,
  FolderPlus,
} from "lucide-react";
import { toast } from "sonner";

interface MegaMenuBuilderProps {
  initialData: MegaMenuItem[];
}

export function MegaMenuBuilder({ initialData }: MegaMenuBuilderProps) {
  const [menuItems, setMenuItems] = React.useState<MegaMenuItem[]>(() =>
    initialData && initialData.length > 0 ? initialData : DEFAULT_MEGA_MENU_DATA
  );
  const [activeTabIndex, setActiveTabIndex] = React.useState<number>(0);
  const [isSaving, setIsSaving] = React.useState(false);
  const [previewMode, setPreviewMode] = React.useState<boolean>(true);

  // Keep active index in bounds
  const currentItem = menuItems[activeTabIndex] || menuItems[0];

  // Save changes to API
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/megamenu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(menuItems),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save mega menu");
      }

      toast.success("Mega Menu updated successfully! Storefront navigation is now synchronized.");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to default Fabrilife menu
  const handleReset = () => {
    if (confirm("Reset mega menu to default Fabrilife structure? Any unsaved edits will be lost.")) {
      setMenuItems(JSON.parse(JSON.stringify(DEFAULT_MEGA_MENU_DATA)));
      setActiveTabIndex(0);
      toast.info("Restored default Fabrilife mega menu data. Click 'Save Changes' to apply.");
    }
  };

  // Add a new tab
  const handleAddTab = () => {
    const newName = prompt("Enter new Menu Tab title (e.g. Winter, Beauty, Gifts):");
    if (!newName || !newName.trim()) return;

    const trimmed = newName.trim();
    const newSlug = trimmed.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const newTab: MegaMenuItem = {
      name: trimmed,
      slug: newSlug,
      viewAllText: `View All ${trimmed} →`,
      viewAllLink: `/shop?category=${newSlug}`,
      columns: [
        {
          title: "FEATURED",
          items: [
            { name: "New Arrivals", slug: newSlug },
            { name: "Best Sellers", slug: `${newSlug}-bestsellers` },
          ],
        },
      ],
      newArrivals: [
        {
          title: `${trimmed} Collection`,
          image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&auto=format&fit=crop&q=80",
          link: `/shop?category=${newSlug}`,
        },
      ],
    };

    setMenuItems((prev) => [...prev, newTab]);
    setActiveTabIndex(menuItems.length);
    toast.success(`Created "${trimmed}" tab!`);
  };

  // Delete current tab
  const handleDeleteTab = (index: number) => {
    if (menuItems.length <= 1) {
      toast.error("You must have at least one menu item in the mega menu.");
      return;
    }
    const itemToDelete = menuItems[index];
    if (confirm(`Are you sure you want to delete "${itemToDelete.name}" tab?`)) {
      setMenuItems((prev) => prev.filter((_, i) => i !== index));
      setActiveTabIndex((prev) => Math.max(0, prev > 0 ? prev - 1 : 0));
      toast.success(`Deleted "${itemToDelete.name}" tab.`);
    }
  };

  // Move tab position
  const handleMoveTab = (index: number, direction: "left" | "right") => {
    const targetIndex = direction === "left" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= menuItems.length) return;

    setMenuItems((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
    });
    setActiveTabIndex(targetIndex);
  };

  // Update current tab basic details
  const updateCurrentTab = (field: keyof MegaMenuItem, value: string) => {
    setMenuItems((prev) => {
      const copy = [...prev];
      copy[activeTabIndex] = {
        ...copy[activeTabIndex],
        [field]: value,
      };
      return copy;
    });
  };

  // Column operations
  const handleAddColumn = () => {
    const title = prompt("Enter Column Title (e.g. TOPWEAR, FOOTWEAR):");
    if (!title || !title.trim()) return;

    setMenuItems((prev) => {
      const copy = [...prev];
      const current = copy[activeTabIndex];
      copy[activeTabIndex] = {
        ...current,
        columns: [
          ...current.columns,
          {
            title: title.trim().toUpperCase(),
            items: [{ name: "Example Item", slug: "all" }],
          },
        ],
      };
      return copy;
    });
    toast.success(`Added "${title.toUpperCase()}" column`);
  };

  const handleUpdateColumnTitle = (colIndex: number, newTitle: string) => {
    setMenuItems((prev) => {
      const copy = [...prev];
      const current = copy[activeTabIndex];
      const cols = [...current.columns];
      cols[colIndex] = { ...cols[colIndex], title: newTitle };
      copy[activeTabIndex] = { ...current, columns: cols };
      return copy;
    });
  };

  const handleDeleteColumn = (colIndex: number) => {
    setMenuItems((prev) => {
      const copy = [...prev];
      const current = copy[activeTabIndex];
      copy[activeTabIndex] = {
        ...current,
        columns: current.columns.filter((_, i) => i !== colIndex),
      };
      return copy;
    });
  };

  const handleMoveColumn = (colIndex: number, direction: "left" | "right") => {
    const targetIndex = direction === "left" ? colIndex - 1 : colIndex + 1;
    if (targetIndex < 0 || targetIndex >= currentItem.columns.length) return;

    setMenuItems((prev) => {
      const copy = [...prev];
      const current = copy[activeTabIndex];
      const cols = [...current.columns];
      const temp = cols[colIndex];
      cols[colIndex] = cols[targetIndex];
      cols[targetIndex] = temp;
      copy[activeTabIndex] = { ...current, columns: cols };
      return copy;
    });
  };

  // Sub-item operations
  const handleAddSubItem = (colIndex: number) => {
    setMenuItems((prev) => {
      const copy = [...prev];
      const current = copy[activeTabIndex];
      const cols = [...current.columns];
      cols[colIndex] = {
        ...cols[colIndex],
        items: [...cols[colIndex].items, { name: "New Sub-category", slug: "shop" }],
      };
      copy[activeTabIndex] = { ...current, columns: cols };
      return copy;
    });
  };

  const handleUpdateSubItem = (
    colIndex: number,
    itemIndex: number,
    field: "name" | "slug",
    value: string
  ) => {
    setMenuItems((prev) => {
      const copy = [...prev];
      const current = copy[activeTabIndex];
      const cols = [...current.columns];
      const items = [...cols[colIndex].items];
      items[itemIndex] = { ...items[itemIndex], [field]: value };
      cols[colIndex] = { ...cols[colIndex], items };
      copy[activeTabIndex] = { ...current, columns: cols };
      return copy;
    });
  };

  const handleDeleteSubItem = (colIndex: number, itemIndex: number) => {
    setMenuItems((prev) => {
      const copy = [...prev];
      const current = copy[activeTabIndex];
      const cols = [...current.columns];
      cols[colIndex] = {
        ...cols[colIndex],
        items: cols[colIndex].items.filter((_, i) => i !== itemIndex),
      };
      copy[activeTabIndex] = { ...current, columns: cols };
      return copy;
    });
  };

  // New arrivals operations
  const handleAddNewArrival = () => {
    setMenuItems((prev) => {
      const copy = [...prev];
      const current = copy[activeTabIndex];
      copy[activeTabIndex] = {
        ...current,
        newArrivals: [
          ...current.newArrivals,
          {
            title: "New Arrival Product",
            image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&auto=format&fit=crop&q=80",
            link: "/shop",
          },
        ],
      };
      return copy;
    });
  };

  const handleUpdateNewArrival = (
    arrivalIndex: number,
    field: "title" | "image" | "link",
    value: string
  ) => {
    setMenuItems((prev) => {
      const copy = [...prev];
      const current = copy[activeTabIndex];
      const arrivals = [...current.newArrivals];
      arrivals[arrivalIndex] = { ...arrivals[arrivalIndex], [field]: value };
      copy[activeTabIndex] = { ...current, newArrivals: arrivals };
      return copy;
    });
  };

  const handleDeleteNewArrival = (arrivalIndex: number) => {
    setMenuItems((prev) => {
      const copy = [...prev];
      const current = copy[activeTabIndex];
      copy[activeTabIndex] = {
        ...current,
        newArrivals: current.newArrivals.filter((_, i) => i !== arrivalIndex),
      };
      return copy;
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Mega Menu CMS Studio</h1>
            <span className="bg-[#ff3f6c]/10 text-[#ff3f6c] text-xs font-bold px-2 py-0.5 rounded-full uppercase">
              Dynamic
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Customize navigation tabs, category columns, sub-links, and new arrival cards for the storefront header.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPreviewMode(!previewMode)}
            className="flex items-center gap-1.5 text-xs font-semibold"
          >
            <Eye className="h-4 w-4" />
            {previewMode ? "Hide Live Preview" : "Show Live Preview"}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-4 w-4" />
            Restore Defaults
          </Button>

          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-[#ff3f6c] hover:bg-[#e0355d] text-white flex items-center gap-2 text-xs font-bold px-4"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save Mega Menu
          </Button>
        </div>
      </div>

      {/* Tabs Row Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b">
        <span className="text-xs font-bold uppercase text-muted-foreground tracking-wider mr-1">
          Menu Tabs:
        </span>
        {menuItems.map((item, idx) => {
          const isActive = idx === activeTabIndex;
          return (
            <div
              key={idx}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-black uppercase tracking-wider transition-all cursor-pointer border ${
                isActive
                  ? "bg-[#ff3f6c] text-white border-[#ff3f6c] shadow-xs"
                  : "bg-muted/50 hover:bg-muted text-foreground border-transparent"
              }`}
              onClick={() => setActiveTabIndex(idx)}
            >
              <span>{item.name}</span>

              {/* Tab Quick Reorder / Delete */}
              {isActive && (
                <div className="flex items-center gap-0.5 ml-1.5 border-l border-white/30 pl-1.5" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => handleMoveTab(idx, "left")}
                    disabled={idx === 0}
                    className="p-0.5 hover:bg-white/20 rounded disabled:opacity-30"
                    title="Move tab left"
                  >
                    <ChevronLeft className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveTab(idx, "right")}
                    disabled={idx === menuItems.length - 1}
                    className="p-0.5 hover:bg-white/20 rounded disabled:opacity-30"
                    title="Move tab right"
                  >
                    <ChevronRight className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteTab(idx)}
                    className="p-0.5 hover:bg-white/20 rounded text-white"
                    title="Delete this tab"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          );
        })}

        <Button
          variant="outline"
          size="sm"
          onClick={handleAddTab}
          className="h-8 text-xs font-bold border-dashed border-primary/40 hover:border-primary text-primary flex items-center gap-1"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Tab
        </Button>
      </div>

      {/* Main Tab Editor Section */}
      {currentItem && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Tab Settings & Columns Editor (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Tab Basic Meta Card */}
            <Card>
              <CardHeader className="py-4 px-6 border-b">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#ff3f6c]" />
                  Tab Details: &quot;{currentItem.name}&quot;
                </CardTitle>
                <CardDescription className="text-xs">
                  Configure display name, target URL, and bottom &quot;View All&quot; banner link.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-bold text-muted-foreground uppercase">
                      Tab Title (e.g. Men, Women)
                    </Label>
                    <Input
                      value={currentItem.name}
                      onChange={(e) => updateCurrentTab("name", e.target.value)}
                      className="mt-1 h-9 text-xs"
                    />
                  </div>

                  <div>
                    <Label className="text-xs font-bold text-muted-foreground uppercase">
                      Tab Slug Identifier
                    </Label>
                    <Input
                      value={currentItem.slug}
                      onChange={(e) => updateCurrentTab("slug", e.target.value)}
                      className="mt-1 h-9 text-xs"
                    />
                  </div>

                  <div>
                    <Label className="text-xs font-bold text-muted-foreground uppercase">
                      View All Button Text
                    </Label>
                    <Input
                      value={currentItem.viewAllText}
                      onChange={(e) => updateCurrentTab("viewAllText", e.target.value)}
                      className="mt-1 h-9 text-xs"
                      placeholder="View All Men →"
                    />
                  </div>

                  <div>
                    <Label className="text-xs font-bold text-muted-foreground uppercase">
                      View All Target URL
                    </Label>
                    <Input
                      value={currentItem.viewAllLink}
                      onChange={(e) => updateCurrentTab("viewAllLink", e.target.value)}
                      className="mt-1 h-9 text-xs"
                      placeholder="/shop?gender=men"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Category Columns & Sub-links Section */}
            <Card>
              <CardHeader className="py-4 px-6 border-b flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Layers className="h-4 w-4 text-[#04aeef]" />
                    Category Columns ({currentItem.columns.length})
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Each column holds grouped sub-links (e.g. Topwear, Bottomwear, Accessories).
                  </CardDescription>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleAddColumn}
                  className="h-8 text-xs font-bold flex items-center gap-1 text-[#04aeef] border-[#04aeef]/40 hover:bg-[#04aeef]/10"
                >
                  <FolderPlus className="h-3.5 w-3.5" />
                  Add Column
                </Button>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                {currentItem.columns.length === 0 ? (
                  <div className="text-center py-8 border border-dashed rounded-lg text-muted-foreground text-xs">
                    No category columns in this menu tab yet. Click &quot;Add Column&quot; to create one.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {currentItem.columns.map((column, colIdx) => (
                      <div
                        key={colIdx}
                        className="border rounded-lg bg-card p-4 space-y-3 shadow-2xs relative flex flex-col justify-between"
                      >
                        {/* Column Header Controls */}
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-2">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase">
                              Column {colIdx + 1}
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleMoveColumn(colIdx, "left")}
                                disabled={colIdx === 0}
                                className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-20"
                                title="Move left"
                              >
                                <ChevronLeft className="h-3 w-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleMoveColumn(colIdx, "right")}
                                disabled={colIdx === currentItem.columns.length - 1}
                                className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-20"
                                title="Move right"
                              >
                                <ChevronRight className="h-3 w-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteColumn(colIdx)}
                                className="p-1 text-red-500 hover:text-red-700"
                                title="Delete column"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>

                          <Input
                            value={column.title}
                            onChange={(e) => handleUpdateColumnTitle(colIdx, e.target.value)}
                            className="h-8 text-xs font-black uppercase tracking-wider text-[#ff3f6c] border-muted"
                            placeholder="COLUMN TITLE"
                          />
                        </div>

                        {/* Sub-links List */}
                        <div className="space-y-2 flex-1 pt-2">
                          <Label className="text-[10px] font-bold uppercase text-muted-foreground">
                            Sub-links ({column.items.length})
                          </Label>

                          <div className="space-y-1.5 max-h-[260px] overflow-y-auto pr-1">
                            {column.items.map((subItem, sIdx) => (
                              <div
                                key={sIdx}
                                className="flex items-center gap-1.5 bg-muted/40 p-1.5 rounded border border-border/50 text-xs"
                              >
                                <Input
                                  value={subItem.name}
                                  onChange={(e) =>
                                    handleUpdateSubItem(colIdx, sIdx, "name", e.target.value)
                                  }
                                  placeholder="Link Label"
                                  className="h-7 text-xs flex-1"
                                />
                                <Input
                                  value={subItem.slug}
                                  onChange={(e) =>
                                    handleUpdateSubItem(colIdx, sIdx, "slug", e.target.value)
                                  }
                                  placeholder="slug-or-url"
                                  className="h-7 text-xs w-28 shrink-0 font-mono text-[11px]"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleDeleteSubItem(colIdx, sIdx)}
                                  className="text-muted-foreground hover:text-red-600 p-1"
                                  title="Delete item"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                            ))}
                          </div>

                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleAddSubItem(colIdx)}
                            className="w-full h-7 text-[11px] font-bold text-muted-foreground hover:text-foreground border border-dashed border-border mt-2"
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add Link
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* New Arrivals Showcase Cards Editor (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            <Card>
              <CardHeader className="py-4 px-6 border-b flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[#ff3f6c]" />
                    New Arrivals Showcase
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Product cards shown on the right side of the dropdown.
                  </CardDescription>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleAddNewArrival}
                  className="h-8 text-xs font-bold flex items-center gap-1"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Card
                </Button>
              </CardHeader>

              <CardContent className="p-6 space-y-4">
                {currentItem.newArrivals.length === 0 ? (
                  <div className="text-center py-8 border border-dashed rounded-lg text-muted-foreground text-xs">
                    No showcase cards added yet.
                  </div>
                ) : (
                  currentItem.newArrivals.map((card, aIdx) => (
                    <div
                      key={aIdx}
                      className="border rounded-lg p-3 bg-card shadow-2xs space-y-2.5 relative"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">
                          Card #{aIdx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDeleteNewArrival(aIdx)}
                          className="text-red-500 hover:text-red-700 p-1"
                          title="Delete card"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>

                      <div className="flex gap-3">
                        {/* Image Preview Thumbnail */}
                        <div className="relative w-16 h-20 rounded bg-muted overflow-hidden shrink-0 border">
                          {card.image ? (
                            <Image
                              src={card.image}
                              alt={card.title}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-[9px]">
                              No img
                            </div>
                          )}
                        </div>

                        {/* Card Inputs */}
                        <div className="flex-1 space-y-2">
                          <div>
                            <Label className="text-[10px] font-bold uppercase text-muted-foreground">
                              Product Title
                            </Label>
                            <Input
                              value={card.title}
                              onChange={(e) =>
                                handleUpdateNewArrival(aIdx, "title", e.target.value)
                              }
                              className="h-7 text-xs"
                              placeholder="e.g. Polo T-Shirt"
                            />
                          </div>

                          <div>
                            <Label className="text-[10px] font-bold uppercase text-muted-foreground">
                              Target Link
                            </Label>
                            <Input
                              value={card.link}
                              onChange={(e) =>
                                handleUpdateNewArrival(aIdx, "link", e.target.value)
                              }
                              className="h-7 text-xs font-mono text-[11px]"
                              placeholder="/shop?category=mens-polo"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label className="text-[10px] font-bold uppercase text-muted-foreground">
                          Image URL
                        </Label>
                        <Input
                          value={card.image}
                          onChange={(e) =>
                            handleUpdateNewArrival(aIdx, "image", e.target.value)
                          }
                          className="h-7 text-xs font-mono text-[11px]"
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Live Visual Mega Menu Dropdown Simulator */}
      {previewMode && currentItem && (
        <Card className="border-2 border-primary/20 shadow-md overflow-hidden">
          <CardHeader className="py-3 px-6 bg-muted/40 border-b flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-[#ff3f6c]" />
              <CardTitle className="text-xs font-black uppercase tracking-wider">
                Live Storefront Dropdown Preview: &quot;{currentItem.name}&quot;
              </CardTitle>
            </div>
            <span className="text-[11px] text-muted-foreground">
              This is how customer sees it when hovering over &quot;{currentItem.name}&quot; in the header
            </span>
          </CardHeader>

          <CardContent className="p-6 bg-background">
            {/* Header Simulator Bar */}
            <div className="border rounded-t-xl bg-card shadow-sm px-6 py-3 flex items-center gap-6 border-b-0">
              <span className="font-black text-lg tracking-tighter text-[#222f3f] dark:text-white uppercase font-sans">
                FABRI<span className="text-[#04aeef]">LIFE</span>
              </span>

              <div className="flex items-center gap-3">
                {menuItems.map((item, idx) => (
                  <span
                    key={idx}
                    className={`text-xs font-black uppercase tracking-wider px-2 py-1 ${
                      idx === activeTabIndex
                        ? "text-[#ff3f6c] border-b-2 border-[#ff3f6c]"
                        : "text-muted-foreground"
                    }`}
                  >
                    {item.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Simulated Dropdown Panel */}
            <div className="border rounded-b-xl bg-card shadow-xl overflow-hidden">
              <div className="flex flex-col md:flex-row">
                {/* Columns */}
                {currentItem.columns.length === 1 ? (
                  <div className="w-64 p-6 shrink-0 border-r">
                    <h4 className="text-xs font-black uppercase tracking-wider text-[#ff3f6c] mb-3.5">
                      {currentItem.columns[0]?.title}
                    </h4>
                    <ul className="space-y-2">
                      {currentItem.columns[0]?.items.map((sub, sIdx) => (
                        <li key={sIdx} className="text-xs font-medium text-gray-700 dark:text-gray-300">
                          {sub.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div
                    className={`flex-1 p-6 grid gap-6 ${
                      currentItem.columns.length >= 3
                        ? "grid-cols-3"
                        : currentItem.columns.length === 2
                        ? "grid-cols-2"
                        : "grid-cols-1"
                    }`}
                  >
                    {currentItem.columns.map((col, cIdx) => (
                      <div key={cIdx} className="space-y-3">
                        <h4 className="text-xs font-black uppercase tracking-wider text-[#ff3f6c]">
                          {col.title}
                        </h4>
                        <ul className="space-y-2">
                          {col.items.map((sub, sIdx) => (
                            <li
                              key={sIdx}
                              className="text-xs font-medium text-gray-700 dark:text-gray-300 hover:text-[#ff3f6c] transition-colors"
                            >
                              {sub.name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {/* New Arrivals Preview */}
                <div
                  className={`border-l border-border/60 p-6 ${
                    currentItem.name.toLowerCase() === "women"
                      ? "flex-1"
                      : "w-[360px] xl:w-[380px] shrink-0"
                  }`}
                >
                  <h4 className="text-xs font-black uppercase tracking-wider text-[#ff3f6c] mb-3.5">
                    NEW ARRIVALS
                  </h4>
                  <div
                    className={`grid gap-3.5 ${
                      currentItem.name.toLowerCase() === "women"
                        ? "grid-cols-3"
                        : "grid-cols-2"
                    }`}
                  >
                    {currentItem.newArrivals.map((card, aIdx) => (
                      <div key={aIdx} className="group block">
                        <div className="relative aspect-[4/5] rounded-lg overflow-hidden border border-border/60 bg-muted/40 shadow-xs">
                          {card.image && (
                            <Image
                              src={card.image}
                              alt={card.title}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          )}
                        </div>
                        <p className="text-[11px] font-semibold text-gray-800 dark:text-gray-200 mt-1.5 truncate">
                          {card.title}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom "View All" Bar */}
              <div className="border-t border-border/60 py-3 px-6 bg-muted/20 flex items-center justify-between">
                <span className="text-xs font-black text-[#ff3f6c] flex items-center gap-1.5 cursor-pointer hover:underline">
                  {currentItem.viewAllText || `View All ${currentItem.name} →`}
                </span>
                <span className="text-[11px] text-muted-foreground font-mono">
                  Target: {currentItem.viewAllLink}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
