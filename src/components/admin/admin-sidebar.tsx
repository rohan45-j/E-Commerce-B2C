"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Layers,
  Tag,
  Boxes,
  ShoppingCart,
  Users,
  Star,
  TicketPercent,
  Image as ImageIcon,
  LayoutTemplate,
  FileText,
  Truck,
  Settings,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Store,
  Palette,
  Menu as MenuIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Categories", href: "/admin/categories", icon: Layers },
  { label: "Brands", href: "/admin/brands", icon: Tag },
  { label: "Inventory", href: "/admin/inventory", icon: Boxes },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Reviews", href: "/admin/reviews", icon: Star },
  { label: "Coupons & Sales", href: "/admin/coupons", icon: TicketPercent },
  { label: "Banners & Media", href: "/admin/banners", icon: ImageIcon },
  { label: "Homepage Builder", href: "/admin/homepage", icon: LayoutTemplate },
  { label: "Mega Menu CMS", href: "/admin/megamenu", icon: MenuIcon },
  { label: "Theme & Styling", href: "/admin/theme", icon: Palette },
  { label: "CMS Pages", href: "/admin/pages", icon: FileText },
  { label: "Shipping Rates", href: "/admin/shipping", icon: Truck },
  { label: "Site Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <aside
      className={`relative flex flex-col border-r bg-card transition-all duration-300 select-none ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-3.5 border-b">
        {!isCollapsed && (
          <Link href="/admin" className="flex items-center gap-2">
            <div className="px-2.5 py-1.5 rounded-xl bg-[#141d27] border border-slate-700/70 shadow-sm flex items-center">
              <Image
                src="/uploads/logo-1793123613850-h97mac.png"
                alt="KinaKati Admin"
                width={120}
                height={34}
                unoptimized
                className="h-7 w-auto object-contain"
              />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
              Admin
            </span>
          </Link>
        )}
        {isCollapsed && (
          <div className="mx-auto h-9 w-9 rounded-xl bg-[#141d27] border border-slate-700/70 flex items-center justify-center p-1 shadow-sm">
            <Image
              src="/uploads/logo-1793123613850-h97mac.png"
              alt="KinaKati"
              width={30}
              height={30}
              unoptimized
              className="h-6 w-auto object-contain"
            />
          </div>
        )}
      </div>

      {/* Collapse Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 z-20 h-6 w-6 rounded-full border bg-background shadow-md flex items-center justify-center text-muted-foreground hover:text-foreground"
      >
        {isCollapsed ? (
          <ChevronRight className="h-3.5 w-3.5" />
        ) : (
          <ChevronLeft className="h-3.5 w-3.5" />
        )}
      </button>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? "bg-emerald-600 text-white shadow-sm font-semibold"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              } ${isCollapsed ? "justify-center px-0" : ""}`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </div>

      {/* Live Store Link */}
      <div className="p-3 border-t">
        <Link href="/" target="_blank">
          <Button
            variant="outline"
            size="sm"
            className={`w-full text-xs gap-2 ${isCollapsed ? "px-0" : ""}`}
            title="View Live Storefront"
          >
            <ExternalLink className="h-3.5 w-3.5 text-emerald-600" />
            {!isCollapsed && "Live Store"}
          </Button>
        </Link>
      </div>
    </aside>
  );
}
