"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUploader } from "@/components/admin/image-uploader";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { slugify } from "@/lib/utils";
import { createProductAction, updateProductAction } from "@/app/admin/products/actions";

interface InitialProductData {
  id?: string;
  title?: string;
  slug?: string;
  shortDesc?: string | null;
  description?: string;
  basePrice?: number;
  compareAtPrice?: number | null;
  costPrice?: number | null;
  sku?: string;
  barcode?: string | null;
  stock?: number;
  status?: "DRAFT" | "ACTIVE" | "ARCHIVED";
  categoryId?: string;
  brandId?: string | null;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  images?: { url: string }[];
  variants?: {
    title: string;
    sku: string;
    size?: string | null;
    color?: string | null;
    price?: number | null;
    stock: number;
  }[];
  seoTitle?: string | null;
  seoDescription?: string | null;
}

interface ProductFormProps {
  initialData?: InitialProductData;
  isEditing?: boolean;
}

export function ProductForm({ initialData, isEditing = false }: ProductFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [categories, setCategories] = React.useState<{ id: string; name: string }[]>([]);
  const [brands, setBrands] = React.useState<{ id: string; name: string }[]>([]);

  // Form states
  const [title, setTitle] = React.useState(initialData?.title || "");
  const [slug, setSlug] = React.useState(initialData?.slug || "");
  const [shortDesc, setShortDesc] = React.useState(initialData?.shortDesc || "");
  const [description, setDescription] = React.useState(initialData?.description || "");
  const [basePriceBDT, setBasePriceBDT] = React.useState(
    initialData?.basePrice ? (initialData.basePrice / 100).toString() : ""
  );
  const [compareAtPriceBDT, setCompareAtPriceBDT] = React.useState(
    initialData?.compareAtPrice ? (initialData.compareAtPrice / 100).toString() : ""
  );
  const [costPriceBDT, setCostPriceBDT] = React.useState(
    initialData?.costPrice ? (initialData.costPrice / 100).toString() : ""
  );
  const [sku, setSku] = React.useState(initialData?.sku || "");
  const [barcode, setBarcode] = React.useState(initialData?.barcode || "");
  const [stock, setStock] = React.useState(initialData?.stock?.toString() || "0");
  const [status, setStatus] = React.useState(initialData?.status || "ACTIVE");
  const [categoryId, setCategoryId] = React.useState(initialData?.categoryId || "");
  const [brandId, setBrandId] = React.useState(initialData?.brandId || "");
  const [isFeatured, setIsFeatured] = React.useState(initialData?.isFeatured || false);
  const [isNewArrival, setIsNewArrival] = React.useState(initialData?.isNewArrival || false);
  const [isBestSeller, setIsBestSeller] = React.useState(initialData?.isBestSeller || false);

  const [images, setImages] = React.useState<string[]>(
    initialData?.images?.map((i) => i.url) || []
  );

  const [variants, setVariants] = React.useState<
    { title: string; sku: string; size?: string; color?: string; price?: number; stock: number }[]
  >(
    initialData?.variants?.map((v) => ({
      title: v.title,
      sku: v.sku,
      size: v.size || "",
      color: v.color || "",
      price: v.price || undefined,
      stock: v.stock,
    })) || []
  );

  const [seoTitle, setSeoTitle] = React.useState(initialData?.seoTitle || "");
  const [seoDescription, setSeoDescription] = React.useState(initialData?.seoDescription || "");

  React.useEffect(() => {
    async function loadSelectOptions() {
      try {
        const [cRes, bRes] = await Promise.all([
          fetch("/api/admin/categories"),
          fetch("/api/admin/brands"),
        ]);
        if (cRes.ok) {
          const cData = await cRes.json();
          setCategories(cData.data || []);
          if (!categoryId && cData.data?.length > 0) {
            setCategoryId(cData.data[0].id);
          }
        }
        if (bRes.ok) {
          const bData = await bRes.json();
          setBrands(bData.data || []);
        }
      } catch {
        // Handled silently
      }
    }
    loadSelectOptions();
  }, [categoryId]);

  const addVariant = () => {
    setVariants([
      ...variants,
      {
        title: "Default Variant",
        sku: `${sku || "SKU"}-${variants.length + 1}`,
        size: "",
        color: "",
        stock: 10,
      },
    ]);
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const updateVariant = (
    index: number,
    field: string,
    val: string | number | undefined
  ) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: val };
    setVariants(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !sku.trim() || !basePriceBDT || !description.trim()) {
      toast.error("Please fill in all mandatory fields (Title, SKU, Price, Description)");
      return;
    }
    if (images.length === 0) {
      toast.error("Please add at least one product image");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        slug: slug.trim() || slugify(title),
        shortDesc: shortDesc.trim() || undefined,
        description: description.trim(),
        basePrice: Math.round(parseFloat(basePriceBDT) * 100),
        compareAtPrice: compareAtPriceBDT
          ? Math.round(parseFloat(compareAtPriceBDT) * 100)
          : undefined,
        costPrice: costPriceBDT
          ? Math.round(parseFloat(costPriceBDT) * 100)
          : undefined,
        sku: sku.trim(),
        barcode: barcode.trim() || undefined,
        stock: parseInt(stock, 10) || 0,
        status,
        categoryId,
        brandId: brandId || undefined,
        isFeatured,
        isNewArrival,
        isBestSeller,
        images,
        variants: variants.map((v) => ({
          title: v.title,
          sku: v.sku,
          size: v.size || undefined,
          color: v.color || undefined,
          price: v.price || undefined,
          stock: v.stock,
        })),
        seoTitle: seoTitle.trim() || title,
        seoDescription: seoDescription.trim() || shortDesc,
      };

      if (isEditing && initialData?.id) {
        const res = await updateProductAction(initialData.id, payload);
        if (res.success) {
          toast.success("Product updated successfully!");
          router.push("/admin/products");
          router.refresh();
        } else {
          toast.error(res.error || "Failed to update product");
        }
      } else {
        const res = await createProductAction(payload);
        if (res.success) {
          toast.success("Product created successfully!");
          router.push("/admin/products");
          router.refresh();
        } else {
          toast.error(res.error || "Failed to create product");
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/products">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {isEditing ? "Edit Product" : "Create New Product"}
            </h1>
            <p className="text-xs text-muted-foreground">
              Define pricing in Bangladeshi Taka, configure variants, and upload imagery.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/products">
            <Button type="button" variant="outline" size="sm">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            size="sm"
            disabled={isSubmitting}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              "Save Product"
            )}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4 max-w-lg mb-4">
          <TabsTrigger value="general" className="text-xs">General</TabsTrigger>
          <TabsTrigger value="pricing" className="text-xs">Pricing & Stock</TabsTrigger>
          <TabsTrigger value="media" className="text-xs">Media Gallery</TabsTrigger>
          <TabsTrigger value="variants" className="text-xs">Variants</TabsTrigger>
        </TabsList>

        {/* Tab 1: General Details */}
        <TabsContent value="general" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="title">Product Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g. Royal Embroidered Silk Panjabi"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (!isEditing) setSlug(slugify(e.target.value));
                  }}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="slug">Slug (URL)</Label>
                <Input
                  id="slug"
                  placeholder="royal-silk-panjabi"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="shortDesc">Short Tagline / Summary</Label>
                <Input
                  id="shortDesc"
                  placeholder="Handcrafted pure silk with exquisite embroidery..."
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label>Detailed Description (HTML / Rich Format) *</Label>
                <RichTextEditor
                  value={description}
                  onChange={setDescription}
                  rows={10}
                />
              </div>
            </div>

            {/* Sidebar classification */}
            <div className="space-y-4">
              <div className="p-4 rounded-xl border bg-card space-y-4">
                <h3 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                  Organization
                </h3>

                <div className="space-y-1.5">
                  <Label htmlFor="category">Category *</Label>
                  <select
                    id="category"
                    className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-xs"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="brand">Brand (Optional)</Label>
                  <select
                    id="brand"
                    className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-xs"
                    value={brandId}
                    onChange={(e) => setBrandId(e.target.value)}
                  >
                    <option value="">No Brand</option>
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="status">Publish Status</Label>
                  <select
                    id="status"
                    className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-xs"
                    value={status}
                    onChange={(e) =>
                      setStatus(
                        e.target.value as "DRAFT" | "ACTIVE" | "ARCHIVED"
                      )
                    }
                  >
                    <option value="ACTIVE">Active (Live on store)</option>
                    <option value="DRAFT">Draft</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>
              </div>

              <div className="p-4 rounded-xl border bg-card space-y-3">
                <h3 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                  Badges & Merchandising
                </h3>
                <label className="flex items-center gap-2 text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  Featured on Homepage
                </label>
                <label className="flex items-center gap-2 text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isNewArrival}
                    onChange={(e) => setIsNewArrival(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  New Arrival
                </label>
                <label className="flex items-center gap-2 text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isBestSeller}
                    onChange={(e) => setIsBestSeller(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  Best Seller
                </label>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Tab 2: Pricing & Inventory */}
        <TabsContent value="pricing" className="space-y-4">
          <div className="max-w-2xl p-6 rounded-xl border bg-card space-y-4">
            <h3 className="font-semibold text-sm">Financial Pricing (BDT)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="basePrice">Base Price (৳) *</Label>
                <Input
                  id="basePrice"
                  type="number"
                  step="0.01"
                  placeholder="5850"
                  value={basePriceBDT}
                  onChange={(e) => setBasePriceBDT(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="comparePrice">Compare-at Price (৳)</Label>
                <Input
                  id="comparePrice"
                  type="number"
                  step="0.01"
                  placeholder="6500"
                  value={compareAtPriceBDT}
                  onChange={(e) => setCompareAtPriceBDT(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="costPrice">Cost Price (৳)</Label>
                <Input
                  id="costPrice"
                  type="number"
                  step="0.01"
                  placeholder="3200"
                  value={costPriceBDT}
                  onChange={(e) => setCostPriceBDT(e.target.value)}
                />
              </div>
            </div>

            <h3 className="font-semibold text-sm pt-4 border-t">Stock & Identification</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="sku">SKU Code *</Label>
                <Input
                  id="sku"
                  placeholder="PAN-ROY-001"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="barcode">Barcode / EAN</Label>
                <Input
                  id="barcode"
                  placeholder="890123456789"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="stock">Base Stock Quantity *</Label>
                <Input
                  id="stock"
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Tab 3: Media Gallery */}
        <TabsContent value="media" className="space-y-4">
          <div className="p-6 rounded-xl border bg-card">
            <h3 className="font-semibold text-sm mb-4">Product Photography Gallery</h3>
            <ImageUploader value={images} onChange={setImages} maxImages={8} />
          </div>
        </TabsContent>

        {/* Tab 4: Variants & SEO */}
        <TabsContent value="variants" className="space-y-6">
          <div className="p-6 rounded-xl border bg-card space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-sm">Product Variants</h3>
                <p className="text-xs text-muted-foreground">
                  Add size, color, or fabric options with custom SKUs and stock.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addVariant}
                className="gap-1 text-xs"
              >
                <Plus className="h-3.5 w-3.5" /> Add Variant
              </Button>
            </div>

            {variants.length > 0 ? (
              <div className="space-y-3">
                {variants.map((v, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-1 sm:grid-cols-5 gap-3 p-3 rounded-lg border bg-muted/20 items-end"
                  >
                    <div className="space-y-1">
                      <Label className="text-[11px]">Variant Title</Label>
                      <Input
                        className="h-8 text-xs"
                        value={v.title}
                        onChange={(e) => updateVariant(idx, "title", e.target.value)}
                        placeholder="e.g. Size 42 / Navy"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px]">Variant SKU</Label>
                      <Input
                        className="h-8 text-xs font-mono"
                        value={v.sku}
                        onChange={(e) => updateVariant(idx, "sku", e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px]">Size / Color</Label>
                      <div className="flex gap-1">
                        <Input
                          className="h-8 text-xs"
                          placeholder="Size"
                          value={v.size || ""}
                          onChange={(e) => updateVariant(idx, "size", e.target.value)}
                        />
                        <Input
                          className="h-8 text-xs"
                          placeholder="Color"
                          value={v.color || ""}
                          onChange={(e) => updateVariant(idx, "color", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px]">Stock</Label>
                      <Input
                        type="number"
                        className="h-8 text-xs"
                        value={v.stock}
                        onChange={(e) => updateVariant(idx, "stock", parseInt(e.target.value, 10) || 0)}
                      />
                    </div>
                    <div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeVariant(idx)}
                        className="h-8 text-xs text-rose-600 hover:text-rose-700 w-full"
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-1" /> Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground py-2">
                No variants configured. Product will sell directly with base SKU.
              </p>
            )}
          </div>

          {/* SEO Meta */}
          <div className="p-6 rounded-xl border bg-card space-y-4">
            <h3 className="font-semibold text-sm">Search Engine Optimization (SEO)</h3>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="seoTitle">Custom Meta Title</Label>
                <Input
                  id="seoTitle"
                  placeholder="Buy Royal Embroidered Silk Panjabi Online Bangladesh"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="seoDesc">Meta Description</Label>
                <Textarea
                  id="seoDesc"
                  placeholder="Exquisite 100% mulberry silk panjabi. Cash on delivery nationwide."
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  rows={2}
                />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </form>
  );
}
