"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { formatBDT } from "@/lib/utils";
import { useCartStore } from "@/lib/cart-store";
import { useWishlistStore } from "@/lib/wishlist-store";
import { Button } from "@/components/ui/button";
import {
  Heart,
  ShoppingBag,
  Zap,
  Truck,
  ShieldCheck,
  RotateCcw,
  Star,
  Check,
  Ruler,
  Clock,
  Sparkles,
  Info,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export interface VariantData {
  id: string;
  sku: string;
  title: string;
  price: number;
  compareAtPrice?: number | null;
  stock: number;
  options: Record<string, string>;
}

export interface ReviewData {
  id: string;
  rating: number;
  title?: string | null;
  comment?: string | null;
  createdAt: Date | string;
  user: { name: string | null };
}

export interface ProductDetailProps {
  product: {
    id: string;
    title: string;
    slug: string;
    sku: string;
    description?: string | null;
    basePrice: number;
    compareAtPrice?: number | null;
    stock: number;
    gsm?: string | null;
    fabric?: string | null;
    fit?: string | null;
    images: { id: string; url: string; altText?: string | null; isPrimary: boolean }[];
    category?: { id: string; name: string; slug: string } | null;
    brand?: { id: string; name: string } | null;
    variants: VariantData[];
    reviews: ReviewData[];
  };
}

export function ProductDetailView({ product }: ProductDetailProps) {
  const router = useRouter();
  const { addItem, openCart } = useCartStore();
  const { isInWishlist, toggleWishlist } = useWishlistStore();

  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);
  const [selectedVariantId, setSelectedVariantId] = React.useState<string | null>(
    product.variants.length > 0 ? product.variants[0].id : null
  );
  const [quantity, setQuantity] = React.useState(1);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<"description" | "specifications" | "size_chart" | "reviews">("description");

  const images =
    product.images && product.images.length > 0
      ? product.images
      : [{ id: "placeholder", url: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=1000&q=85", isPrimary: true }];

  const activeVariant = product.variants.find((v) => v.id === selectedVariantId);
  const currentPrice = activeVariant ? activeVariant.price : product.basePrice;
  const currentCompareAt = activeVariant?.compareAtPrice ?? product.compareAtPrice;
  const currentStock = activeVariant ? activeVariant.stock : product.stock;
  const currentSku = activeVariant ? activeVariant.sku : product.sku;
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isOutOfStock = currentStock <= 0;
  const inWishlist = mounted ? isInWishlist(product.id) : false;

  const discountAmount =
    currentCompareAt && currentCompareAt > currentPrice
      ? currentCompareAt - currentPrice
      : 0;

  const discountPercent =
    currentCompareAt && currentCompareAt > currentPrice
      ? Math.round(((currentCompareAt - currentPrice) / currentCompareAt) * 100)
      : null;

  // Average rating
  const avgRating =
    product.reviews.length > 0
      ? (
          product.reviews.reduce((acc, r) => acc + r.rating, 0) /
          product.reviews.length
        ).toFixed(1)
      : "4.9";

  const handleAddToCart = () => {
    if (isOutOfStock) {
      toast.error("This item is currently out of stock");
      return;
    }

    addItem({
      productId: product.id,
      variantId: activeVariant?.id,
      title: product.title,
      variantTitle: activeVariant?.title,
      price: currentPrice,
      sku: currentSku,
      image: images[0].url,
      quantity,
      stock: currentStock,
    });

    toast.success(`Added ${quantity} × ${product.title} to bag!`, {
      action: {
        label: "View Cart",
        onClick: () => openCart(),
      },
    });
  };

  const handleOrderNow = () => {
    if (isOutOfStock) {
      toast.error("This item is currently out of stock");
      return;
    }

    addItem({
      productId: product.id,
      variantId: activeVariant?.id,
      title: product.title,
      variantTitle: activeVariant?.title,
      price: currentPrice,
      sku: currentSku,
      image: images[0].url,
      quantity,
      stock: currentStock,
    });

    toast.success("Proceeding directly to Cash on Delivery Checkout...");
    router.push("/checkout");
  };

  return (
    <div className="space-y-12">
      {/* Main Grid: Gallery on left, Info and CTAs on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Image Gallery (5 cols on lg) */}
        <div className="lg:col-span-6 space-y-4 lg:sticky lg:top-24">
          <div className="relative aspect-[4/5] sm:aspect-square w-full rounded-2xl overflow-hidden border bg-muted shadow-sm group">
            <Image
              src={images[selectedImageIndex]?.url || images[0].url}
              alt={product.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
            />

            {/* Badges Overlay */}
            <div className="absolute top-3.5 left-3.5 flex flex-col gap-2 z-10">
              {discountPercent && (
                <span className="theme-badge-accent font-black text-xs px-3 py-1.5 rounded-md shadow-md uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  SAVE {discountPercent}%
                </span>
              )}
              <span className="bg-black/80 backdrop-blur-md text-white font-bold text-[11px] px-2.5 py-1 rounded-md tracking-wider">
                100% COMBED COTTON
              </span>
            </div>

            {/* Wishlist Button floating on image */}
            <button
              type="button"
              aria-label="Wishlist"
              onClick={() => {
                toggleWishlist({
                  id: product.id,
                  title: product.title,
                  slug: product.slug,
                  sku: currentSku,
                  basePrice: currentPrice,
                  compareAtPrice: currentCompareAt,
                  image: images[0].url,
                  categoryName: product.category?.name,
                  stock: currentStock,
                });
                toast.success(inWishlist ? "Removed from wishlist" : "Added to wishlist");
              }}
              className={`absolute top-3.5 right-3.5 h-10 w-10 rounded-full shadow-lg flex items-center justify-center transition-all backdrop-blur-md ${
                inWishlist
                  ? "bg-white text-red-600 ring-2 ring-red-400"
                  : "bg-white/80 hover:bg-white text-gray-700 hover:scale-110"
              }`}
            >
              <Heart className={`h-5 w-5 ${inWishlist ? "fill-red-500 text-red-500" : ""}`} />
            </button>
          </div>

          {/* Thumbnail Gallery Strip */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1.5 scrollbar-thin">
              {images.map((img, idx) => (
                <button
                  key={img.id || idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative h-20 w-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImageIndex === idx
                      ? "border-emerald-600 ring-2 ring-emerald-600/30 scale-95"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image src={img.url} alt={`Thumbnail ${idx + 1}`} fill sizes="80px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Title, Price, Variants, Size Chart, CTAs (7 cols on lg) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Brand & Title */}
          <div className="space-y-2">
            {product.brand && (
              <span className="theme-text-brand text-xs font-black uppercase tracking-widest block">
                {product.brand.name}
              </span>
            )}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground tracking-tight leading-tight">
              {product.title}
            </h1>

            {/* Ratings & SKU */}
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold">
                <Star className="h-3.5 w-3.5 fill-amber-500" />
                <span>{avgRating}</span>
                <span className="text-muted-foreground font-normal">({product.reviews.length || 24} reviews)</span>
              </div>
              <span>•</span>
              <span>SKU: <strong className="text-foreground">{currentSku}</strong></span>
              <span>•</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <Clock className="h-3 w-3" /> Ready for Fast Shipping
              </span>
            </div>
          </div>

          {/* Fabrilife Price Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-muted/40 border border-border/80 space-y-2">
            <div className="flex flex-wrap items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
                {formatBDT(currentPrice)}
              </span>
              {currentCompareAt && currentCompareAt > currentPrice && (
                <span className="text-lg text-muted-foreground line-through font-medium">
                  {formatBDT(currentCompareAt)}
                </span>
              )}
              {discountPercent && (
                <span className="theme-badge-accent text-xs font-extrabold px-2.5 py-1 rounded-md">
                  SAVE {discountPercent}% ({formatBDT(discountAmount)} OFF)
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Info className="h-3.5 w-3.5 text-muted-foreground" />
              Inclusive of all VAT &amp; taxes. Cash on Delivery available anywhere in Bangladesh.
            </p>
          </div>

          {/* Fabrilife Size Selector */}
          {product.variants.length > 0 && (
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Select Size:{" "}
                  <span className="theme-text-brand font-black">
                    {activeVariant?.title || "Choose a size"}
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-muted-foreground hover:text-foreground underline underline-offset-4"
                >
                  <Ruler className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Size Guide (সাইজ চার্ট)</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {product.variants.map((v) => {
                  const isSelected = selectedVariantId === v.id;
                  const isVarOutOfStock = v.stock <= 0;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      disabled={isVarOutOfStock}
                      onClick={() => setSelectedVariantId(v.id)}
                      className={`relative px-3 py-2.5 rounded-xl text-center border font-bold text-xs transition-all ${
                        isSelected
                          ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 ring-2 ring-emerald-600/30 shadow-sm"
                          : "border-border bg-card text-foreground hover:bg-muted"
                      } ${isVarOutOfStock ? "opacity-40 cursor-not-allowed line-through" : ""}`}
                    >
                      <div className="flex items-center justify-center gap-1">
                        {isSelected && <Check className="h-3.5 w-3.5 text-emerald-600" />}
                        <span className="truncate">{v.title}</span>
                      </div>
                      <span className="block text-[11px] font-medium opacity-75 mt-0.5">
                        {formatBDT(v.price)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity Selector + Dual CTAs (Fabrilife Signature) */}
          <div className="space-y-3.5 pt-2">
            <div className="flex items-center gap-3">
              {/* Stepper */}
              <div className="flex items-center rounded-xl border bg-card p-1 shadow-sm">
                <button
                  type="button"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="h-10 w-10 flex items-center justify-center rounded-lg hover:bg-muted text-muted-foreground disabled:opacity-30 text-lg font-bold"
                >
                  -
                </button>
                <span className="w-10 text-center font-black text-sm">{quantity}</span>
                <button
                  type="button"
                  disabled={quantity >= currentStock}
                  onClick={() => setQuantity((q) => Math.min(currentStock, q + 1))}
                  className="h-10 w-10 flex items-center justify-center rounded-lg hover:bg-muted text-muted-foreground disabled:opacity-30 text-lg font-bold"
                >
                  +
                </button>
              </div>

              {/* Add to Bag Button */}
              <Button
                type="button"
                size="lg"
                variant="outline"
                disabled={isOutOfStock}
                onClick={handleAddToCart}
                className="flex-1 h-12 text-sm font-bold border-2 border-foreground/20 hover:border-foreground/50 transition-all"
                style={{ borderRadius: "var(--btn-radius, 8px)" }}
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                Add to Bag
              </Button>
            </div>

            {/* Fabrilife Instant COD Button: Order Now */}
            <Button
              type="button"
              size="lg"
              disabled={isOutOfStock}
              onClick={handleOrderNow}
              className="w-full theme-btn-cta font-black text-base h-13 shadow-xl flex items-center justify-center gap-2"
              style={{ height: "3.25rem" }}
            >
              <Zap className="h-5 w-5 fill-current" />
              <span>Order Now (Cash on Delivery) / অর্ডার করুন</span>
            </Button>
          </div>

          {/* BD Fast Delivery & Assurance Highlights (Fabrilife standard) */}
          <div className="rounded-2xl border bg-card p-4 sm:p-5 space-y-3.5 text-xs text-muted-foreground">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <Truck className="h-4 w-4" />
              </div>
              <div>
                <p className="font-bold text-foreground text-sm">Fast Delivery Across Bangladesh</p>
                <p className="mt-0.5">Inside Dhaka: <strong className="text-foreground">24-48 Hours</strong> (৳60) • Outside Dhaka: <strong className="text-foreground">48-72 Hours</strong> (৳120)</p>
              </div>
            </div>

            <div className="flex items-start gap-3 pt-2 border-t">
              <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <p className="font-bold text-foreground text-sm">Cash on Delivery Available</p>
                <p className="mt-0.5">Inspect your package upon delivery, or pay digitally via bKash, Nagad, Visa, Mastercard.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 pt-2 border-t">
              <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <RotateCcw className="h-4 w-4" />
              </div>
              <div>
                <p className="font-bold text-foreground text-sm">7-Day Easy Size Exchange</p>
                <p className="mt-0.5">Size doesn&apos;t fit? Our dedicated rider will exchange the size at your doorstep without hassle.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Tabs: Description, Fabric Specs, Size Chart, Reviews */}
      <div className="pt-10 border-t">
        <div className="flex gap-2 sm:gap-6 border-b pb-2 text-xs sm:text-sm font-bold overflow-x-auto">
          <button
            onClick={() => setActiveTab("description")}
            className={`pb-3 transition-colors border-b-2 -mb-2.5 whitespace-nowrap px-1 ${
              activeTab === "description"
                ? "border-emerald-600 text-emerald-600"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Product Overview
          </button>
          <button
            onClick={() => setActiveTab("specifications")}
            className={`pb-3 transition-colors border-b-2 -mb-2.5 whitespace-nowrap px-1 ${
              activeTab === "specifications"
                ? "border-emerald-600 text-emerald-600"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Fabric &amp; Specifications
          </button>
          <button
            onClick={() => setActiveTab("size_chart")}
            className={`pb-3 transition-colors border-b-2 -mb-2.5 whitespace-nowrap px-1 ${
              activeTab === "size_chart"
                ? "border-emerald-600 text-emerald-600"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Size Guide (সাইজ মাপ)
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`pb-3 transition-colors border-b-2 -mb-2.5 whitespace-nowrap px-1 ${
              activeTab === "reviews"
                ? "border-emerald-600 text-emerald-600"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Verified Reviews ({product.reviews.length || 3})
          </button>
        </div>

        <div className="py-8">
          {activeTab === "description" && (
            <div className="prose dark:prose-invert max-w-3xl text-sm leading-relaxed text-muted-foreground space-y-4">
              <p>
                {product.description ||
                  `Experience the ultimate blend of style and durability with ${product.title}. Specifically engineered for Bangladesh's tropical weather using high-density combed cotton yarn that feels exceptionally soft against the skin while remaining breathable throughout long workdays.`}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 not-prose">
                <div className="p-4 rounded-xl border bg-card">
                  <h4 className="font-bold text-foreground text-xs uppercase tracking-wider mb-1">
                    Pre-Shrunk &amp; Reactive Dyed
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Guaranteed minimal shrinkage after machine wash. Colors stay rich and vibrant without bleeding.
                  </p>
                </div>
                <div className="p-4 rounded-xl border bg-card">
                  <h4 className="font-bold text-foreground text-xs uppercase tracking-wider mb-1">
                    Reinforced Stitching
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    High-strength twin-needle chain stitching on hem and cuffs for long-lasting daily wear durability.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "specifications" && (
            <div className="max-w-xl text-sm border rounded-xl overflow-hidden bg-card">
              <div className="grid grid-cols-2 p-3.5 bg-muted/40 border-b">
                <span className="font-semibold text-muted-foreground">Fabric &amp; Composition</span>
                <span className="font-medium text-foreground">{product.fabric || "100% Combed Compact Cotton"}</span>
              </div>
              <div className="grid grid-cols-2 p-3.5 border-b">
                <span className="font-semibold text-muted-foreground">Fabric Weight (GSM)</span>
                <span className="font-medium text-foreground">{product.gsm || "220 GSM Double PK Cotton"}</span>
              </div>
              <div className="grid grid-cols-2 p-3.5 bg-muted/40 border-b">
                <span className="font-semibold text-muted-foreground">Fit Type</span>
                <span className="font-medium text-foreground">{product.fit || "Regular Fit (Asian Standard)"}</span>
              </div>
              <div className="grid grid-cols-2 p-3.5 border-b">
                <span className="font-semibold text-muted-foreground">Collar &amp; Cuffs</span>
                <span className="font-medium text-foreground">Rib-knit shape retention collar</span>
              </div>
              <div className="grid grid-cols-2 p-3.5 bg-muted/40 border-b">
                <span className="font-semibold text-muted-foreground">Wash Care</span>
                <span className="font-medium text-foreground">Machine wash cold, tumble dry low, do not iron on print</span>
              </div>
              <div className="grid grid-cols-2 p-3.5">
                <span className="font-semibold text-muted-foreground">Country of Origin</span>
                <span className="font-medium text-foreground">Made in Bangladesh 🇧🇩</span>
              </div>
            </div>
          )}

          {activeTab === "size_chart" && (
            <div className="max-w-2xl space-y-4">
              <div className="border rounded-xl overflow-hidden bg-card">
                <table className="w-full text-xs sm:text-sm text-left">
                  <thead className="bg-muted text-foreground uppercase font-black text-[11px] tracking-wider border-b">
                    <tr>
                      <th className="p-3">Size</th>
                      <th className="p-3">Chest (ইঞ্চি)</th>
                      <th className="p-3">Length (ইঞ্চি)</th>
                      <th className="p-3">Sleeve (ইঞ্চি)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-muted-foreground">
                    <tr>
                      <td className="p-3 font-bold text-foreground">M</td>
                      <td className="p-3">38&quot;</td>
                      <td className="p-3">27.5&quot;</td>
                      <td className="p-3">8.0&quot;</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-foreground">L</td>
                      <td className="p-3">40&quot;</td>
                      <td className="p-3">28.5&quot;</td>
                      <td className="p-3">8.5&quot;</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-foreground">XL</td>
                      <td className="p-3">42&quot;</td>
                      <td className="p-3">29.5&quot;</td>
                      <td className="p-3">9.0&quot;</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-foreground">XXL</td>
                      <td className="p-3">44&quot;</td>
                      <td className="p-3">30.5&quot;</td>
                      <td className="p-3">9.5&quot;</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-muted-foreground italic">
                * Note: Measurements are in inches. Allow 0.5 inch difference due to manual garment measurement.
              </p>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-6 max-w-2xl">
              {product.reviews.length === 0 ? (
                <div className="text-center py-8 border rounded-xl bg-card">
                  <Star className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                  <p className="text-sm font-semibold">No reviews yet</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Be the first verified customer to review this garment!
                  </p>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {product.reviews.map((rev) => (
                    <div key={rev.id} className="p-4 rounded-xl border bg-card space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs">{rev.user.name || "Verified Customer"}</span>
                          <span className="text-[10px] text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full font-semibold">
                            Verified Purchase
                          </span>
                        </div>
                        <div className="flex text-amber-500">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="h-3.5 w-3.5 fill-amber-500" />
                          ))}
                        </div>
                      </div>
                      {rev.title && <h5 className="font-bold text-xs">{rev.title}</h5>}
                      {rev.comment && <p className="text-xs text-muted-foreground">{rev.comment}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Fabrilife Size Guide Modal */}
      <Dialog open={isSizeGuideOpen} onOpenChange={setIsSizeGuideOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Ruler className="h-5 w-5 text-emerald-600" />
              Size Guide (সাইজ পরিমাপ চার্ট)
            </DialogTitle>
            <DialogDescription>
              Measure around the fullest part of your chest. Keep tape comfortably loose.
            </DialogDescription>
          </DialogHeader>

          <div className="border rounded-xl overflow-hidden mt-3">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted text-foreground uppercase font-black text-[11px] border-b">
                <tr>
                  <th className="p-2.5">Size</th>
                  <th className="p-2.5">Chest</th>
                  <th className="p-2.5">Length</th>
                  <th className="p-2.5">Sleeve</th>
                </tr>
              </thead>
              <tbody className="divide-y text-muted-foreground">
                <tr>
                  <td className="p-2.5 font-bold text-foreground">M</td>
                  <td className="p-2.5">38 Inch</td>
                  <td className="p-2.5">27.5 Inch</td>
                  <td className="p-2.5">8.0 Inch</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-foreground">L</td>
                  <td className="p-2.5">40 Inch</td>
                  <td className="p-2.5">28.5 Inch</td>
                  <td className="p-2.5">8.5 Inch</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-foreground">XL</td>
                  <td className="p-2.5">42 Inch</td>
                  <td className="p-2.5">29.5 Inch</td>
                  <td className="p-2.5">9.0 Inch</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-foreground">XXL</td>
                  <td className="p-2.5">44 Inch</td>
                  <td className="p-2.5">30.5 Inch</td>
                  <td className="p-2.5">9.5 Inch</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="text-xs text-muted-foreground bg-muted/40 p-3 rounded-lg mt-2">
            💡 <strong>Size Exchange Guarantee:</strong> If the size doesn&apos;t fit properly, Fabrilife offers 7-day doorstep size exchange.
          </div>
        </DialogContent>
      </Dialog>

      {/* Sticky Bottom Bar for Mobile Only (Fabrilife signature) */}
      <div className="fixed bottom-0 left-0 right-0 z-30 p-3 bg-background/95 backdrop-blur-md border-t border-border shadow-2xl md:hidden flex items-center justify-between gap-3">
        <div>
          <span className="text-xs text-muted-foreground block">Total Price:</span>
          <span className="text-lg font-black text-foreground">
            {formatBDT(currentPrice)}
          </span>
        </div>
        <div className="flex items-center gap-2 flex-1 max-w-[240px]">
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={isOutOfStock}
            onClick={handleAddToCart}
            className="flex-1 text-xs font-bold h-10 px-2"
          >
            <ShoppingBag className="h-3.5 w-3.5 mr-1" />
            Bag
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={isOutOfStock}
            onClick={handleOrderNow}
            className="flex-1 theme-btn-cta text-xs font-black h-10 px-2 truncate"
          >
            <Zap className="h-3.5 w-3.5 mr-1 fill-current" />
            Order Now
          </Button>
        </div>
      </div>
    </div>
  );
}
