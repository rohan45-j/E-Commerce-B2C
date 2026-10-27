import * as React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { StoreHeader } from "@/components/store/store-header";
import { StoreFooter } from "@/components/store/store-footer";
import { MiniCartDrawer } from "@/components/store/mini-cart-drawer";
import {
  User,
  MapPin,
  ShieldCheck,
  Package,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/account");
  }

  const navLinks = [
    { label: "Account Overview", href: "/account", icon: User },
    { label: "My Orders", href: "/account/orders", icon: Package },
    { label: "Saved Addresses", href: "/account/addresses", icon: MapPin },
    { label: "Security & Login", href: "/account/security", icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <StoreHeader />
      <MiniCartDrawer />

      <main className="flex-1 container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Customer Sidebar */}
          <aside className="space-y-6">
            <div className="p-6 rounded-2xl border bg-card/60 shadow-sm space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-black text-lg">
                  {session.user.name ? session.user.name[0].toUpperCase() : "U"}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-sm text-foreground truncate">
                    {session.user.name || "Customer"}
                  </h3>
                  <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>
                </div>
              </div>
            </div>

            <nav className="rounded-2xl border bg-card p-2 shadow-sm space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    <Icon className="h-4 w-4 text-emerald-600" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Account Page Content */}
          <div className="md:col-span-3">{children}</div>
        </div>
      </main>

      <StoreFooter />
    </div>
  );
}
