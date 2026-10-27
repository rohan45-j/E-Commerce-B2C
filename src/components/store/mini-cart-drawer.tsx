"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/lib/cart-store";
import { formatBDT } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Truck,
} from "lucide-react";

export function MiniCartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    getSubtotal,
    getTotalItems,
  } = useCartStore();

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const subtotal = getSubtotal();
  const totalItems = getTotalItems();

  // Free shipping threshold at ৳ 2,000 (200000 poisha)
  const freeShippingThreshold = 200000;
  const progressPercent = Math.min((subtotal / freeShippingThreshold) * 100, 100);
  const remainingForFreeShipping = Math.max(freeShippingThreshold - subtotal, 0);

  if (!mounted) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-50 overflow-hidden transition-opacity duration-300 ${
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div
          className={`w-screen max-w-md bg-background shadow-2xl flex flex-col transition-transform duration-300 transform ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-emerald-600" />
              <h2 className="text-base font-bold">Shopping Bag ({totalItems})</h2>
            </div>
            <button
              onClick={closeCart}
              className="rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Free Shipping Progress bar */}
          <div className="bg-emerald-50 dark:bg-emerald-950/30 p-3.5 border-b text-xs">
            <div className="flex items-center gap-2 mb-1.5 font-medium text-emerald-800 dark:text-emerald-300">
              <Truck className="h-4 w-4 shrink-0 text-emerald-600" />
              {remainingForFreeShipping > 0 ? (
                <span>
                  Add <strong>{formatBDT(remainingForFreeShipping)}</strong> more for <strong>Free Delivery</strong>!
                </span>
              ) : (
                <span className="font-semibold text-emerald-700 dark:text-emerald-300">
                  🎉 Congratulations! You unlocked Free Delivery nationwide!
                </span>
              )}
            </div>
            <div className="w-full bg-emerald-200 dark:bg-emerald-900 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-emerald-600 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length > 0 ? (
              items.map((item, idx) => (
                <div
                  key={`${item.productId}-${item.variantId || "base"}-${idx}`}
                  className="flex gap-4 p-3 rounded-xl border bg-card shadow-sm"
                >
                  <div className="relative h-20 w-20 rounded-lg overflow-hidden border bg-muted/20 shrink-0">
                    <Image
                      src={
                        item.image ||
                        "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&q=80"
                      }
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-semibold text-xs text-foreground line-clamp-1">
                          {item.title}
                        </h4>
                        <button
                          onClick={() => removeItem(item.productId, item.variantId)}
                          className="text-muted-foreground hover:text-rose-600 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      {item.variantTitle && (
                        <p className="text-[11px] text-muted-foreground">
                          {item.variantTitle}
                        </p>
                      )}
                      <p className="text-xs font-bold text-emerald-600">
                        {formatBDT(item.price)}
                      </p>
                    </div>

                    {/* Quantity Stepper */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center rounded-lg border bg-muted/40 h-7">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.quantity - 1,
                              item.variantId
                            )
                          }
                          className="px-2 h-full flex items-center justify-center text-muted-foreground hover:text-foreground"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-2 text-xs font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.quantity + 1,
                              item.variantId
                            )
                          }
                          className="px-2 h-full flex items-center justify-center text-muted-foreground hover:text-foreground"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <span className="text-xs font-bold text-foreground">
                        {formatBDT(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <ShoppingBag className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Your Bag is Empty</h3>
                  <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                    Explore our curated collection of authentic fashion, gadgets, and home goods.
                  </p>
                </div>
                <Button
                  onClick={closeCart}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
                >
                  Start Shopping
                </Button>
              </div>
            )}
          </div>

          {/* Footer Subtotal & Checkout */}
          {items.length > 0 && (
            <div className="p-6 border-t bg-card space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="font-semibold text-foreground text-sm">
                    {formatBDT(subtotal)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>

              <div className="space-y-2">
                <Link href="/checkout" onClick={closeCart} className="block w-full">
                  <Button className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md gap-2">
                    Proceed to Checkout <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/cart" onClick={closeCart} className="block w-full">
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    View Shopping Cart
                  </Button>
                </Link>
              </div>

              <p className="text-[11px] text-center text-muted-foreground">
                🔒 Safe & Secure Checkout • Cash on Delivery Available
              </p>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
