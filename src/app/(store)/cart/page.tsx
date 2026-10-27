"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/lib/cart-store";
import { formatBDT } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, getSubtotal } = useCartStore();
  const [mounted, setMounted] = React.useState(false);
  const [couponCode, setCouponCode] = React.useState("");
  const [appliedCoupon, setAppliedCoupon] = React.useState<{ code: string; discount: number } | null>(null);

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

  const subtotal = getSubtotal();
  const freeShippingThreshold = 1000000; // ৳10,000
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const shippingFee = subtotal >= freeShippingThreshold || appliedCoupon?.code === "FREESHIP" ? 0 : 6000;
  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = couponCode.trim().toUpperCase();
    if (!clean) return;

    if (clean === "WELCOME10") {
      const discount = Math.round((subtotal * 10) / 100);
      setAppliedCoupon({ code: clean, discount });
      toast.success("Coupon WELCOME10 applied: 10% discount!");
    } else if (clean === "DHAKA500") {
      const discount = 50000; // ৳500
      setAppliedCoupon({ code: clean, discount });
      toast.success("Coupon DHAKA500 applied: ৳500 discount!");
    } else if (clean === "FREESHIP") {
      setAppliedCoupon({ code: clean, discount: 0 });
      toast.success("Coupon FREESHIP applied: Free delivery!");
    } else {
      toast.error("Invalid coupon code. Try WELCOME10 or DHAKA500");
    }
  };

  return (
    <div className="container py-8 md:py-12">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-emerald-600" />
            Shopping Cart ({items.length} items)
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Review your luxury selections before proceed to secure checkout
          </p>
        </div>

        {items.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              clearCart();
              toast.info("Cart emptied");
            }}
            className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
          >
            <Trash2 className="h-3.5 w-3.5 mr-1.5" />
            Clear Cart
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-24 rounded-2xl border bg-card p-8 max-w-lg mx-auto">
          <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
            <ShoppingBag className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold">Your Cart is Empty</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Looks like you haven&apos;t added any items to your bag yet. Explore our newest luxury collections now!
          </p>
          <div className="mt-6">
            <Link href="/shop">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs">
                Start Shopping
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items List */}
          <div className="lg:col-span-2 space-y-4">
            {/* Free shipping bar */}
            <div className="p-4 rounded-2xl border bg-emerald-50/50 dark:bg-emerald-950/20 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                  <Truck className="h-4 w-4" />
                  {remainingForFreeShipping > 0 ? (
                    <>Add <strong>{formatBDT(remainingForFreeShipping)}</strong> more to get FREE nationwide delivery!</>
                  ) : (
                    <span className="font-bold">Congratulations! You unlocked FREE Nationwide Delivery!</span>
                  )}
                </span>
                <span className="text-muted-foreground">{freeShippingPercent}%</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                  style={{ width: `${freeShippingPercent}%` }}
                />
              </div>
            </div>

            {/* Items */}
            <div className="rounded-2xl border bg-card divide-y overflow-hidden shadow-sm">
              {items.map((item) => (
                <div key={`${item.productId}-${item.variantId || "base"}`} className="p-4 sm:p-6 flex gap-4">
                  <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-xl overflow-hidden bg-muted flex-shrink-0 border">
                    <Image
                      src={item.image || "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&q=80"}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-sm sm:text-base text-foreground line-clamp-1">
                          {item.title}
                        </h3>
                        {item.variantTitle && (
                          <span className="text-xs text-muted-foreground font-medium">
                            Variant: {item.variantTitle}
                          </span>
                        )}
                        <p className="text-xs text-muted-foreground mt-0.5">SKU: {item.sku}</p>
                      </div>
                      <span className="font-black text-sm sm:text-base text-foreground">
                        {formatBDT(item.price * item.quantity)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center rounded-xl border bg-background p-1">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variantId)}
                          className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-muted text-muted-foreground"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variantId)}
                          className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-muted text-muted-foreground"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          removeItem(item.productId, item.variantId);
                          toast.info("Item removed from cart");
                        }}
                        className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Link href="/shop" className="text-xs font-semibold text-emerald-600 hover:underline flex items-center gap-1">
                &larr; Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl border bg-card shadow-sm space-y-4">
              <h2 className="font-bold text-base text-foreground">Order Summary</h2>

              <div className="space-y-2 text-xs divide-y">
                <div className="flex justify-between py-1.5 text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="font-semibold text-foreground">{formatBDT(subtotal)}</span>
                </div>

                <div className="flex justify-between py-1.5 text-muted-foreground">
                  <span>Estimated Delivery</span>
                  <span className="font-semibold text-foreground">
                    {shippingFee === 0 ? <strong className="text-emerald-600">FREE</strong> : formatBDT(shippingFee)}
                  </span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between py-1.5 text-emerald-600 font-semibold">
                    <span>Discount ({appliedCoupon.code})</span>
                    <span>-{formatBDT(appliedCoupon.discount)}</span>
                  </div>
                )}

                <div className="flex justify-between pt-3 text-sm font-black text-foreground">
                  <span>Total Amount</span>
                  <span className="text-lg text-emerald-600">{formatBDT(grandTotal)}</span>
                </div>
              </div>

              {/* Coupon Box */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2 pt-2">
                <Input
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Coupon code (e.g. WELCOME10)"
                  className="h-9 text-xs uppercase"
                />
                <Button type="submit" size="sm" variant="outline" className="h-9 text-xs font-semibold">
                  Apply
                </Button>
              </form>

              {/* Checkout Button */}
              <Link href="/checkout" className="block pt-2">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-11 shadow-md shadow-emerald-600/20">
                  Proceed to Checkout
                  <ArrowRight className="h-4 w-4 ml-1.5" />
                </Button>
              </Link>
            </div>

            {/* Reassurance Features */}
            <div className="p-4 rounded-xl border bg-muted/40 space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                <span>100% Secure Checkout with SSL encryption</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                <span>Cash on Delivery available all over Bangladesh</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                <span>7-day easy return and instant replacement</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
