"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/lib/cart-store";
import {
  Home,
  Grid,
  ShoppingBag,
  Truck,
  User,
  X,
  ChevronRight,
  Sparkles,
  Flame,
  ArrowRight,
} from "lucide-react";

interface CategoryTreeItem {
  id: string;
  name: string;
  slug: string;
  subcategories: { name: string; slug: string }[];
}

const FABRILIFE_CATEGORIES: CategoryTreeItem[] = [
  {
    id: "men",
    name: "Men's Collection",
    slug: "mens-fashion",
    subcategories: [
      { name: "Polo T-Shirts (Designer & Luxe)", slug: "mens-polo" },
      { name: "Half Sleeve T-Shirts (Printed & Blank)", slug: "mens-tshirts" },
      { name: "Drop Shoulder T-Shirts", slug: "mens-drop-shoulder" },
      { name: "Casual & Formal Shirts", slug: "mens-shirts" },
      { name: "Festive Panjabi Collection", slug: "mens-panjabi" },
      { name: "Joggers & Comfy Trousers", slug: "mens-joggers" },
      { name: "Chino & Cargo Pants", slug: "mens-pants" },
      { name: "Shorts & Activewear", slug: "mens-shorts" },
      { name: "Hoodies & Sweatshirts", slug: "mens-hoodies" },
    ],
  },
  {
    id: "women",
    name: "Women's Collection",
    slug: "womens-fashion",
    subcategories: [
      { name: "Kurti, Tunic & Tops", slug: "womens-kurtis" },
      { name: "Salwar Kameez (2pc & 3pc)", slug: "womens-salwar-kameez" },
      { name: "Western Tops & T-Shirts", slug: "womens-tshirts" },
      { name: "Co-ords & Two Piece Sets", slug: "womens-coords" },
      { name: "Comfy Trousers & Palazzo", slug: "womens-palazzo" },
      { name: "Shrug & Winter Wear", slug: "womens-shrug" },
    ],
  },
  {
    id: "teens",
    name: "Teens Collection",
    slug: "teens-fashion",
    subcategories: [
      { name: "Teen Boys T-Shirts & Polos", slug: "teens-boys-tshirts" },
      { name: "Teen Boys Joggers & Panjabi", slug: "teens-boys-panjabi" },
      { name: "Teen Girls Kurtis & Tops", slug: "teens-girls-kurtis" },
      { name: "Teen Girls Trousers & Hoodies", slug: "teens-girls-trousers" },
    ],
  },
  {
    id: "kids",
    name: "Kids Collection",
    slug: "kids-fashion",
    subcategories: [
      { name: "Boys T-Shirts & Shorts", slug: "kids-boys-tshirts" },
      { name: "Boys Festive Panjabi", slug: "kids-boys-panjabi" },
      { name: "Girls Frocks & Dresses", slug: "kids-girls-frocks" },
      { name: "Girls Two Piece Sets", slug: "kids-girls-twopiece" },
    ],
  },
  {
    id: "sports",
    name: "Sports & Fan Edition",
    slug: "sports-activewear",
    subcategories: [
      { name: "Football Jerseys (Fan Edition)", slug: "sports-football-jerseys" },
      { name: "Player Edition Jerseys", slug: "sports-player-edition" },
      { name: "Sports Active T-Shirts", slug: "sports-tshirts" },
      { name: "Performance Training Shorts", slug: "sports-shorts" },
    ],
  },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const { toggleCart, getTotalItems } = useCartStore();
  const [mounted, setMounted] = React.useState(false);
  const [isCategorySheetOpen, setIsCategorySheetOpen] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState<CategoryTreeItem | null>(
    FABRILIFE_CATEGORIES[0]
  );

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const totalCartCount = mounted ? getTotalItems() : 0;

  // Don't render bottom nav in admin or checkout
  if (pathname.startsWith("/admin") || pathname.startsWith("/checkout")) {
    return null;
  }

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-40 h-16 border-t bg-background/95 backdrop-blur-md md:hidden px-3 shadow-lg flex items-center justify-around">
        {/* Home */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors ${
            pathname === "/" ? "text-[#04aeef] font-bold" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Home className="h-5 w-5" />
          <span>Home</span>
        </Link>

        {/* Categories */}
        <button
          onClick={() => setIsCategorySheetOpen(true)}
          className={`flex flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors ${
            isCategorySheetOpen ? "text-[#04aeef] font-bold" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Grid className="h-5 w-5" />
          <span>Category</span>
        </button>

        {/* Cart */}
        <button
          onClick={toggleCart}
          className="relative flex flex-col items-center justify-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <div className="relative">
            <ShoppingBag className="h-5 w-5" />
            <span
              className={`absolute -top-1 -right-2 h-4 min-w-[16px] px-1 rounded-full bg-[#ff3f6c] text-white text-[10px] font-bold flex items-center justify-center shadow transition-all ${
                totalCartCount > 0
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-0 pointer-events-none"
              }`}
            >
              {totalCartCount}
            </span>
          </div>
          <span>Cart</span>
        </button>

        {/* Track Order */}
        <Link
          href="/track-order"
          className={`flex flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors ${
            pathname === "/track-order" ? "text-[#04aeef] font-bold" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Truck className="h-5 w-5" />
          <span>Track</span>
        </Link>

        {/* Account */}
        <Link
          href="/account"
          className={`flex flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors ${
            pathname.startsWith("/account") || pathname === "/login"
              ? "text-[#04aeef] font-bold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <User className="h-5 w-5" />
          <span>Account</span>
        </Link>
      </nav>

      {/* Fabrilife-style Slide-up Category Drawer */}
      <div
        className={`fixed inset-0 z-50 md:hidden flex flex-col justify-end transition-opacity duration-300 ${
          isCategorySheetOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
            isCategorySheetOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsCategorySheetOpen(false)}
        />

        <div
          className={`relative z-10 w-full max-h-[85vh] bg-background rounded-t-2xl shadow-2xl flex flex-col overflow-hidden transition-transform duration-300 transform ${
            isCategorySheetOpen ? "translate-y-0" : "translate-y-full"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 border-b bg-muted/30">
              <div className="flex items-center gap-2">
                <Grid className="h-5 w-5 text-[#04aeef]" />
                <h3 className="font-bold text-base tracking-tight">Shop by Category</h3>
              </div>
              <button
                onClick={() => setIsCategorySheetOpen(false)}
                className="p-1.5 rounded-full hover:bg-muted text-muted-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Quick Filter Badges */}
            <div className="flex items-center gap-2 px-4 py-2.5 overflow-x-auto border-b text-xs font-semibold scrollbar-none bg-muted/10">
              <Link
                href="/shop?filter=new"
                onClick={() => setIsCategorySheetOpen(false)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 shrink-0"
              >
                <Sparkles className="h-3.5 w-3.5" /> New Arrivals
              </Link>
              <Link
                href="/shop?filter=top"
                onClick={() => setIsCategorySheetOpen(false)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#ff3f6c]/10 text-[#ff3f6c] shrink-0"
              >
                <Flame className="h-3.5 w-3.5" /> Top Selling
              </Link>
              <Link
                href="/shop?filter=free-shipping"
                onClick={() => setIsCategorySheetOpen(false)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 shrink-0"
              >
                <Truck className="h-3.5 w-3.5" /> Free Delivery
              </Link>
            </div>

            {/* 2-Column Split: Parent Categories on Left, Subcategories on Right */}
            <div className="flex flex-1 min-h-[350px] overflow-hidden">
              {/* Left Parent Category List */}
              <div className="w-2/5 border-r bg-muted/20 overflow-y-auto py-2">
                {FABRILIFE_CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory?.id === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full text-left px-3.5 py-3 text-xs font-semibold flex items-center justify-between border-l-4 transition-all ${
                        isSelected
                          ? "border-[#04aeef] bg-background text-[#04aeef]"
                          : "border-transparent text-muted-foreground hover:bg-muted/40"
                      }`}
                    >
                      <span className="truncate">{cat.name.replace(" Collection", "")}</span>
                      <ChevronRight className={`h-3.5 w-3.5 shrink-0 ${isSelected ? "opacity-100" : "opacity-40"}`} />
                    </button>
                  );
                })}
              </div>

              {/* Right Subcategory List */}
              <div className="w-3/5 overflow-y-auto p-4 space-y-2">
                {selectedCategory && (
                  <>
                    <div className="flex items-center justify-between pb-2 border-b">
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        {selectedCategory.name}
                      </p>
                      <Link
                        href={`/shop?category=${selectedCategory.slug}`}
                        onClick={() => setIsCategorySheetOpen(false)}
                        className="text-[11px] font-semibold text-[#04aeef] hover:underline flex items-center gap-0.5"
                      >
                        All &rarr;
                      </Link>
                    </div>

                    <div className="space-y-1 pt-1">
                      {selectedCategory.subcategories.map((sub, idx) => (
                        <Link
                          key={idx}
                          href={`/shop?category=${sub.slug}`}
                          onClick={() => setIsCategorySheetOpen(false)}
                          className="block px-2.5 py-2 text-xs rounded-lg hover:bg-muted font-medium text-foreground transition-colors"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Bottom View All Link */}
            <div className="p-3 border-t bg-muted/20 text-center">
              <Link
                href="/shop"
                onClick={() => setIsCategorySheetOpen(false)}
                className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-[#222f3f] text-white text-xs font-bold hover:bg-[#1a2430] transition-colors"
              >
                Browse All Collections <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
    </>
  );
}
