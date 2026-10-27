"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { formatBDT } from "@/lib/utils";
import { useCartStore } from "@/lib/cart-store";
import { useWishlistStore } from "@/lib/wishlist-store";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag, Eye } from "lucide-react";
import { toast } from "sonner";

export interface ProductCardProps {
  id: string;
  title: string;
  slug: string;
  sku: string;
  basePrice: number;
  compareAtPrice?: number | null;
  images: { url: string; isPrimary?: boolean }[];
  category?: { name: string; slug?: string } | null;
  brand?: { name: string } | null;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  stock: number;
}

export function ProductCard({
  id,
  title,
  slug,
  sku,
  basePrice,
  compareAtPrice,
  images,
  category,
  brand,
  isFeatured,
  isBestSeller,
  stock,
}: ProductCardProps) {
  const { addItem } = useCartStore();
  const { isInWishlist, toggleWishlist } = useWishlistStore();

  const primaryImage =
    images.find((img) => img.isPrimary)?.url ||
    images[0]?.url ||
    "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&q=80";
  const hoverImage = images[1]?.url || primaryImage;

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const inWishlist = mounted ? isInWishlist(id) : false;

  const discountPercent =
    compareAtPrice && compareAtPrice > basePrice
      ? Math.round(((compareAtPrice - basePrice) / compareAtPrice) * 100)
      : null;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (stock <= 0) {
      toast.error("This item is currently out of stock");
      return;
    }

    addItem({
      productId: id,
      title,
      sku,
      price: basePrice,
      image: primaryImage,
      quantity: 1,
      stock,
    });
    toast.success(`Added "${title}" to your cart!`);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    toggleWishlist({
      id,
      title,
      slug,
      sku,
      basePrice,
      compareAtPrice,
      image: primaryImage,
      categoryName: category?.name,
      stock,
    });

    if (inWishlist) {
      toast.info("Removed from wishlist");
    } else {
      toast.success("Saved to your wishlist!");
    }
  };

  return (
    <div className="group relative flex flex-col rounded-xl border border-slate-200 dark:border-slate-800 bg-card overflow-hidden shadow-sm hover:shadow-xl hover:border-[#04aeef]/40 transition-all duration-300">
      {/* Thumbnail with hover zoom */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-50 dark:bg-slate-900">
        <Link href={`/products/${slug}`} className="block h-full w-full">
          <Image
            src={primaryImage}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {hoverImage !== primaryImage && (
            <Image
              src={hoverImage}
              alt={`${title} alternate`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
          )}
        </Link>

        {/* Dynamic Discount & Promo Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10 pointer-events-none">
          {discountPercent && (
            <span className="theme-badge-accent text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              -{discountPercent}%
            </span>
          )}
          {isBestSeller && (
            <span className="theme-btn-cta text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm uppercase tracking-wide">
              Bestseller
            </span>
          )}
          {isFeatured && !isBestSeller && (
            <span className="theme-bg-brand text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm uppercase tracking-wide">
              Trending
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute top-2.5 right-2.5 z-10 h-8 w-8 rounded-full flex items-center justify-center transition-all ${
            inWishlist
              ? "bg-[#ff3f6c]/10 text-[#ff3f6c] shadow-sm"
              : "bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 hover:text-[#ff3f6c] hover:bg-white shadow-sm"
          }`}
        >
          <Heart
            className={`h-4 w-4 ${inWishlist ? "fill-[#ff3f6c] text-[#ff3f6c]" : ""}`}
          />
        </button>

        {/* Dynamic Quick Add Strip on Desktop Hover */}
        <div className="absolute inset-x-2.5 bottom-2.5 z-10 hidden sm:flex items-center gap-2 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200">
          <Button
            size="sm"
            onClick={handleQuickAdd}
            disabled={stock <= 0}
            className="flex-1 theme-btn-cta shadow-md text-xs font-bold uppercase tracking-wider gap-1.5 h-9"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            {stock > 0 ? "Add to Bag" : "Out of Stock"}
          </Button>
          <Link href={`/products/${slug}`}>
            <Button
              size="icon"
              variant="secondary"
              className="h-9 w-9 bg-white/90 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-[#04aeef] shadow-md"
              title="Quick View"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Information Area */}
      <div className="flex flex-1 flex-col p-3.5 justify-between space-y-2">
        <div className="space-y-1">
          {category && (
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              {category.name}
            </p>
          )}
          <Link
            href={`/products/${slug}`}
            className="font-semibold text-sm text-foreground line-clamp-2 hover:text-[#04aeef] transition-colors leading-snug"
          >
            {title}
          </Link>
          {brand && (
            <p className="text-[11px] text-muted-foreground font-medium">{brand.name}</p>
          )}
        </div>

        {/* Price & Mobile Add */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800/80">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-base text-[#222f3f] dark:text-white">
                {formatBDT(basePrice)}
              </span>
              {compareAtPrice && compareAtPrice > basePrice && (
                <span className="text-xs text-muted-foreground line-through">
                  {formatBDT(compareAtPrice)}
                </span>
              )}
            </div>
            <p className="text-[10px]">
              {stock > 0 ? (
                <span className="text-emerald-600 font-medium">In stock</span>
              ) : (
                <span className="text-[#ff3f6c] font-medium">Sold out</span>
              )}
            </p>
          </div>

          <Button
            size="icon"
            onClick={handleQuickAdd}
            disabled={stock <= 0}
            className="sm:hidden h-8 w-8 rounded-full theme-btn-cta"
            title="Add to bag"
          >
            <ShoppingBag className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
