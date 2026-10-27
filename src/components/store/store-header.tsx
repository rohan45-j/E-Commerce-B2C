"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/cart-store";
import { useWishlistStore } from "@/lib/wishlist-store";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ShoppingBag,
  Heart,
  Search,
  User,
  Menu,
  X,
  MapPin,
  Sparkles,
  Phone,
  LogOut,
  ShieldCheck,
  Flame,
  Truck,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { DEFAULT_MEGA_MENU_DATA, MegaMenuItem } from "@/lib/megamenu-config";

interface StoreHeaderProps {
  categories?: { id: string; name: string; slug: string }[];
  supportPhone?: string;
  siteLogo?: string;
  siteName?: string;
  megaMenuData?: MegaMenuItem[];
}

export function StoreHeader({
  supportPhone = "+880 9612-000000",
  siteLogo,
  siteName,
  megaMenuData,
}: StoreHeaderProps) {
  const menuItems = megaMenuData && megaMenuData.length > 0 ? megaMenuData : DEFAULT_MEGA_MENU_DATA;
  const router = useRouter();
  const { data: session } = useSession();
  const { toggleCart, getTotalItems } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();

  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeMegaMenu, setActiveMegaMenu] = React.useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const totalCartCount = mounted ? getTotalItems() : 0;
  const totalWishlistCount = mounted ? wishlistItems.length : 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-background border-b shadow-sm">
      {/* 1. Dynamic Top Announcement Bar */}
      <div className="theme-announcement py-1.5 px-4 text-[11px] font-medium tracking-wide">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 font-semibold theme-text-brand">
              <Sparkles className="h-3 w-3" /> FREE SHIPPING
            </span>
            <span className="hidden sm:inline">
              on orders over ৳1,500 | Cash on Delivery Available Nationwide | 7 Days Easy Return
            </span>
            <span className="sm:hidden">
              Free Shipping over ৳1,500 | COD Nationwide
            </span>
          </div>

          <div className="hidden md:flex items-center gap-5 text-gray-300 text-xs">
            <span className="flex items-center gap-1 hover:text-white transition-colors">
              <Phone className="h-3 w-3 text-[#04aeef]" /> {supportPhone}
            </span>
            <Link
              href="/track-order"
              className="flex items-center gap-1 hover:text-[#04aeef] transition-colors"
            >
              <Truck className="h-3 w-3 text-emerald-400" /> Track Order
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Main Header Bar (Logo, Nav Links, Search, Action Buttons) */}
      <div
        className="container mx-auto px-4 relative"
        onMouseLeave={() => setActiveMegaMenu(null)}
      >
        <div className="flex h-20 items-center justify-between gap-4 lg:gap-8">
          {/* Mobile hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-foreground rounded-lg hover:bg-muted"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Dynamic Logo or Fabrilife-Inspired Text Brand */}
          <Link href="/" className="flex items-center gap-2 shrink-0 py-1 group">
            {siteLogo ? (
              <div className="relative flex items-center px-3 py-1.5 rounded-xl bg-[#141d27] dark:bg-[#111922] border border-slate-700/70 shadow-sm group-hover:border-[#04aeef]/60 group-hover:shadow-md transition-all">
                <Image
                  src={siteLogo}
                  alt={siteName || "Store Logo"}
                  width={240}
                  height={68}
                  unoptimized
                  className="h-11 sm:h-13 md:h-14 w-auto object-contain filter drop-shadow-sm transition-transform duration-200 group-hover:scale-102"
                  priority
                />
              </div>
            ) : (
              <div className="flex flex-col">
                <div className="flex items-center">
                  <span className="font-black text-2xl tracking-tight text-[#ff6600] uppercase font-sans">
                    K<span className="text-foreground">ina</span><span className="text-[#ff6600]">Kati</span>
                  </span>
                </div>
                <span className="text-[9px] font-bold text-muted-foreground -mt-1">
                  কেনাকাটা হোক আরও সহজ
                </span>
              </div>
            )}
          </Link>

          {/* Desktop Mega-Menu Navigation (Matching Screenshots) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 h-full">
            {menuItems.map((item) => {
              const isActive = activeMegaMenu === item.name;
              return (
                <div
                  key={item.name}
                  className="relative h-full flex items-center"
                  onMouseEnter={() => setActiveMegaMenu(item.name)}
                >
                  <Link
                    href={item.viewAllLink}
                    className={`px-3 py-7 text-xs sm:text-sm font-black uppercase tracking-wider block transition-colors ${
                      isActive
                        ? "text-[#ff3f6c]"
                        : "text-foreground hover:text-[#ff3f6c]"
                    }`}
                  >
                    {item.name}
                  </Link>

                  {/* Active Coral Underline Indicator Bar */}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#ff3f6c] rounded-t-sm" />
                  )}
                </div>
              );
            })}

            <Link
              href="/shop?offer=mega-deal"
              className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-[#ff3f6c] hover:opacity-80 flex items-center gap-1"
            >
              <Flame className="h-3.5 w-3.5 fill-[#ff3f6c]" /> Hot Deals
            </Link>
          </nav>

          {/* Dropdown Mega Menu (Full Width & Grid matching Screenshots) */}
          {(() => {
            const activeItem = menuItems.find((m) => m.name === activeMegaMenu) || menuItems[0];
            const isVisible = !!activeMegaMenu;

            return (
              <div
                className={`absolute top-full left-4 sm:left-6 w-[880px] xl:w-[940px] 2xl:w-[980px] bg-white dark:bg-card border border-border/80 shadow-2xl rounded-b-2xl z-50 overflow-hidden transition-all duration-150 ${
                  isVisible
                    ? "opacity-100 visible pointer-events-auto translate-y-0"
                    : "opacity-0 invisible pointer-events-none -translate-y-1"
                }`}
                onMouseEnter={() => activeMegaMenu && setActiveMegaMenu(activeMegaMenu)}
                onMouseLeave={() => setActiveMegaMenu(null)}
              >
                <div className="flex items-stretch">
                  {/* Left Side: Category Links */}
                  {activeItem.name === "Women" ? (
                    // Screenshot 2: 1 single column for WESTERN & ETHNIC
                    <div className="w-64 p-6 shrink-0">
                      <h4 className="text-xs font-black uppercase tracking-wider text-[#ff3f6c] mb-3.5">
                        {activeItem.columns[0]?.title}
                      </h4>
                      <ul className="space-y-2">
                        {activeItem.columns[0]?.items.map((subItem, sIdx) => (
                          <li key={sIdx}>
                            <Link
                              href={`/shop?category=${subItem.slug}`}
                              onClick={() => setActiveMegaMenu(null)}
                              className="text-xs font-medium text-gray-700 dark:text-gray-300 hover:text-[#ff3f6c] transition-colors block"
                            >
                              {subItem.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    // Screenshot 1: 3 columns for TOPWEAR, BOTTOMWEAR, ACCESSORIES (or 2 for Teens/Kids)
                    <div
                      className={`flex-1 p-6 grid gap-6 ${
                        activeItem.columns.length === 3 ? "grid-cols-3" : "grid-cols-2"
                      }`}
                    >
                      {activeItem.columns.map((col, cIdx) => (
                        <div key={cIdx} className="space-y-3">
                          <h4 className="text-xs font-black uppercase tracking-wider text-[#ff3f6c]">
                            {col.title}
                          </h4>
                          <ul className="space-y-2">
                            {col.items.map((subItem, sIdx) => (
                              <li key={sIdx}>
                                <Link
                                  href={`/shop?category=${subItem.slug}`}
                                  onClick={() => setActiveMegaMenu(null)}
                                  className="text-xs font-medium text-gray-700 dark:text-gray-300 hover:text-[#ff3f6c] transition-colors block"
                                >
                                  {subItem.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Right Side: NEW ARRIVALS Product Grid */}
                  <div
                    className={`border-l border-border/60 p-6 ${
                      activeItem.name === "Women"
                        ? "flex-1"
                        : "w-[360px] xl:w-[380px] shrink-0"
                    }`}
                  >
                    <h4 className="text-xs font-black uppercase tracking-wider text-[#ff3f6c] mb-3.5">
                      NEW ARRIVALS
                    </h4>
                    <div
                      className={`grid gap-3.5 ${
                        activeItem.name === "Women"
                          ? "grid-cols-3"
                          : "grid-cols-2"
                      }`}
                    >
                      {activeItem.newArrivals.map((prod, pIdx) => (
                        <Link
                          key={pIdx}
                          href={prod.link}
                          onClick={() => setActiveMegaMenu(null)}
                          className="group block"
                        >
                          <div className="relative aspect-[4/5] rounded-lg overflow-hidden border border-border/60 bg-muted/40 shadow-xs group-hover:shadow-md transition-all">
                            <Image
                              src={prod.image}
                              alt={prod.title}
                              fill
                              sizes="160px"
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <p className="text-[11px] font-semibold text-gray-800 dark:text-gray-200 mt-1.5 truncate group-hover:text-[#ff3f6c] transition-colors">
                            {prod.title}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Bar: View All Link */}
                <div className="border-t border-border/60 py-3 px-6 bg-muted/20 flex items-center justify-between">
                  <Link
                    href={activeItem.viewAllLink}
                    onClick={() => setActiveMegaMenu(null)}
                    className="text-xs font-black text-[#ff3f6c] hover:underline flex items-center gap-1.5"
                  >
                    {activeItem.viewAllText}
                  </Link>
                </div>
              </div>
            );
          })()}

          {/* Search Bar in Header */}
          <form onSubmit={handleSearch} className="flex-1 max-w-sm hidden md:block">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search t-shirts, polo, kurti, panjabi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 h-10 text-xs rounded-full bg-muted/50 border-muted-foreground/20 focus-visible:ring-[#04aeef]"
              />
            </div>
          </form>

          {/* Right Action Icons (Stores, Wishlist, Cart, Profile) */}
          <div className="flex items-center gap-1 sm:gap-2">
            <ThemeToggle />

            {/* Outlets / Stores */}
            <Link
              href="/contact"
              className="hidden sm:flex flex-col items-center justify-center px-2 py-1 text-muted-foreground hover:text-foreground text-[10px] font-semibold"
              title="Our Store Outlets"
            >
              <MapPin className="h-5 w-5" />
              <span className="mt-0.5">Stores</span>
            </Link>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative flex flex-col items-center justify-center px-2 py-1 text-muted-foreground hover:text-[#ff3f6c] text-[10px] font-semibold transition-colors"
              title="Wishlist"
            >
              <div className="relative">
                <Heart className="h-5 w-5" />
                <span
                  className={`absolute -top-1.5 -right-2 h-4 min-w-[16px] px-1 rounded-full bg-[#ff3f6c] text-white text-[9px] font-bold flex items-center justify-center shadow transition-all ${
                    totalWishlistCount > 0
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-0 pointer-events-none"
                  }`}
                >
                  {totalWishlistCount}
                </span>
              </div>
              <span className="hidden sm:inline mt-0.5">Wishlist</span>
            </Link>

            {/* Cart Drawer Trigger */}
            <button
              onClick={toggleCart}
              className="relative flex flex-col items-center justify-center px-2 py-1 text-muted-foreground hover:text-[#04aeef] text-[10px] font-semibold transition-colors"
              title="Shopping Bag"
            >
              <div className="relative">
                <ShoppingBag className="h-5 w-5" />
                <span
                  className={`absolute -top-1.5 -right-2 h-4 min-w-[16px] px-1 rounded-full bg-[#04aeef] text-white text-[9px] font-bold flex items-center justify-center shadow transition-all ${
                    totalCartCount > 0
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-0 pointer-events-none"
                  }`}
                >
                  {totalCartCount}
                </span>
              </div>
              <span className="hidden sm:inline mt-0.5">Bag</span>
            </button>

            {/* User Account / Profile */}
            <div suppressHydrationWarning className="flex items-center">
              {!mounted ? (
                <div className="w-16 h-9" />
              ) : session?.user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1.5 text-xs font-semibold px-2"
                    >
                      <User className="h-4 w-4 text-[#04aeef]" />
                      <span className="hidden sm:inline max-w-[80px] truncate">
                        {session.user.name?.split(" ")[0]}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52">
                    <DropdownMenuLabel className="text-xs">
                      <p className="font-bold">{session.user.name}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{session.user.email}</p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/account" className="text-xs cursor-pointer">
                        My Orders &amp; Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/track-order" className="text-xs cursor-pointer">
                        Track Live Order
                      </Link>
                    </DropdownMenuItem>
                    {(session.user as { role?: string }).role === "ADMIN" && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="text-xs font-bold text-emerald-600 cursor-pointer">
                          <ShieldCheck className="h-3.5 w-3.5 mr-1.5" /> Admin Panel
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="text-xs text-rose-600 cursor-pointer"
                    >
                      <LogOut className="h-3.5 w-3.5 mr-1.5" /> Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/login">
                  <Button
                    size="sm"
                    className="rounded-full bg-[#222f3f] hover:bg-[#1a2430] text-white text-xs font-bold px-4 h-9 shadow-sm"
                  >
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar below header */}
        <div className="pb-3 md:hidden">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search t-shirts, polo, kurti, panjabi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 h-9 text-xs rounded-full bg-muted/50 border-muted-foreground/20"
              />
            </div>
          </form>
        </div>
      </div>

      {/* Mobile Drawer Menu (if hamburger clicked) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t bg-background p-4 space-y-4 shadow-xl">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-2">
              Collections
            </p>
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={`/shop?category=${item.slug}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 text-xs font-bold rounded-md hover:bg-muted"
              >
                {item.name}&apos;s Collection
              </Link>
            ))}
            <Link
              href="/shop"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 text-xs font-bold text-[#04aeef] rounded-md hover:bg-muted"
            >
              All Products &rarr;
            </Link>
          </div>

          <div className="border-t pt-3 space-y-2 text-xs font-semibold">
            <Link
              href="/track-order"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-1.5 text-muted-foreground hover:text-foreground"
            >
              <Truck className="h-4 w-4" /> Track My Order
            </Link>
            <Link
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-1.5 text-muted-foreground hover:text-foreground"
            >
              <MapPin className="h-4 w-4" /> Store Outlets &amp; Contact
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
