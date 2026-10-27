"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useWishlistStore } from "@/lib/wishlist-store";
import { useCartStore } from "@/lib/cart-store";
import { formatBDT } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const { addItem, openCart } = useCartStore();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="container py-16 text-center">
        <div className="h-8 w-40 bg-muted animate-pulse mx-auto rounded-lg mb-4" />
        <div className="h-4 w-64 bg-muted animate-pulse mx-auto rounded-lg" />
      </div>
    );
  }

  const handleMoveToCart = (item: (typeof items)[0]) => {
    if (item.stock <= 0) {
      toast.error("This item is currently out of stock");
      return;
    }

    addItem({
      productId: item.id,
      title: item.title,
      price: item.basePrice,
      sku: item.sku || `PROD-${item.id.slice(0, 6)}`,
      image: item.image || "",
      quantity: 1,
      stock: item.stock,
    });

    removeItem(item.id);
    toast.success(`Moved "${item.title}" to cart!`);
    openCart();
  };

  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground flex items-center gap-2">
            <Heart className="h-6 w-6 text-red-500 fill-red-500" />
            My Wishlist ({items.length})
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Items you have saved to purchase later
          </p>
        </div>

        {items.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              clearWishlist();
              toast.info("Wishlist cleared");
            }}
            className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
          >
            <Trash2 className="h-3.5 w-3.5 mr-1.5" />
            Clear Wishlist
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-24 rounded-2xl border bg-card p-8 max-w-lg mx-auto">
          <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center">
            <Heart className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold">Your Wishlist is Empty</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Explore our curated luxury collections and save your favorite fashion pieces and gadgets for later.
          </p>
          <div className="mt-6">
            <Link href="/shop">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs">
                Explore Collections
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-2xl border bg-card overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-square w-full overflow-hidden bg-muted">
                  <Image
                    src={item.image || "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&q=80"}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  <button
                    onClick={() => {
                      removeItem(item.id);
                      toast.info("Item removed from wishlist");
                    }}
                    className="absolute top-3 right-3 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm border flex items-center justify-center text-muted-foreground hover:text-red-500 transition-colors shadow-sm"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="p-4 space-y-2">
                  <Link
                    href={`/products/${item.slug}`}
                    className="font-bold text-sm text-foreground hover:text-emerald-600 line-clamp-1 transition-colors"
                  >
                    {item.title}
                  </Link>
                  <p className="font-black text-base text-foreground">
                    {formatBDT(item.basePrice)}
                  </p>
                  <p className="text-xs">
                    {item.stock > 0 ? (
                      <span className="text-emerald-600 font-semibold">In Stock</span>
                    ) : (
                      <span className="text-red-500 font-semibold">Out of Stock</span>
                    )}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0">
                <Button
                  size="sm"
                  disabled={item.stock <= 0}
                  onClick={() => handleMoveToCart(item)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-9"
                >
                  <ShoppingBag className="h-3.5 w-3.5 mr-1.5" />
                  Move to Bag
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
