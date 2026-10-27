"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/lib/cart-store";
import { formatBDT } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  ShoppingBag,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { items, getSubtotal, clearCart } = useCartStore();

  const [mounted, setMounted] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  // Form states
  const [customerName, setCustomerName] = React.useState("");
  const [customerEmail, setCustomerEmail] = React.useState("");
  const [customerPhone, setCustomerPhone] = React.useState("");
  const [shippingZone, setShippingZone] = React.useState<"INSIDE_DHAKA" | "OUTSIDE_DHAKA">("INSIDE_DHAKA");
  const [division, setDivision] = React.useState("Dhaka");
  const [district, setDistrict] = React.useState("Dhaka");
  const [upazila, setUpazila] = React.useState("Gulshan");
  const [addressLine, setAddressLine] = React.useState("");
  const [deliveryInstructions, setDeliveryInstructions] = React.useState("");
  const [paymentMethod, setPaymentMethod] = React.useState<"COD" | "STRIPE">("COD");
  const [customerNotes, setCustomerNotes] = React.useState("");
  const [couponCode, setCouponCode] = React.useState("");
  const [appliedCoupon, setAppliedCoupon] = React.useState<{ code: string; discount: number } | null>(null);

  React.useEffect(() => {
    setMounted(true);
    if (session?.user) {
      if (session.user.name) setCustomerName(session.user.name);
      if (session.user.email) setCustomerEmail(session.user.email);
    }
  }, [session]);

  if (!mounted) {
    return (
      <div className="container py-16 text-center">
        <div className="h-8 w-40 bg-muted animate-pulse mx-auto rounded-lg mb-4" />
        <div className="h-4 w-64 bg-muted animate-pulse mx-auto rounded-lg" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container py-24 text-center max-w-md mx-auto space-y-4">
        <div className="h-16 w-16 mx-auto rounded-full bg-muted flex items-center justify-center text-muted-foreground">
          <ShoppingBag className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold">Your Bag is Empty</h1>
        <p className="text-xs text-muted-foreground">
          Add items to your cart before proceeding to checkout.
        </p>
        <Link href="/shop">
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs mt-2">
            Browse Catalog
          </Button>
        </Link>
      </div>
    );
  }

  const subtotal = getSubtotal();
  const freeShipping = subtotal >= 1000000; // ৳10,000
  const shippingFee = freeShipping ? 0 : shippingZone === "INSIDE_DHAKA" ? 6000 : 12000;
  const discount = appliedCoupon ? appliedCoupon.discount : 0;
  const totalAmount = Math.max(0, subtotal - discount + shippingFee);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = couponCode.trim().toUpperCase();
    if (!clean) return;

    if (clean === "WELCOME10") {
      const disc = Math.round((subtotal * 10) / 100);
      setAppliedCoupon({ code: clean, discount: disc });
      toast.success("Coupon WELCOME10 applied: 10% discount!");
    } else if (clean === "KINA500" || clean === "DHAKA500") {
      setAppliedCoupon({ code: "KINA500", discount: 50000 });
      toast.success("Coupon KINA500 applied: ৳500 discount!");
    } else {
      toast.error("Invalid coupon code. Try WELCOME10 or KINA500");
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerPhone.trim() || customerPhone.length < 10) {
      toast.error("Please enter a valid mobile number (e.g. 017XXXXXXXX)");
      return;
    }
    if (!addressLine.trim()) {
      toast.error("Please enter your detailed street address");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerEmail,
          customerPhone,
          shippingAddress: {
            recipientName: customerName,
            phone: customerPhone,
            email: customerEmail,
            division,
            district,
            upazila,
            addressLine,
            deliveryInstructions,
            shippingZone,
          },
          items: items.map((i) => ({
            productId: i.productId,
            variantId: i.variantId || null,
            quantity: i.quantity,
          })),
          couponCode: appliedCoupon?.code,
          paymentMethod,
          customerNotes,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to place order");
      }

      // Order created successfully!
      clearCart();
      toast.success(`Order placed successfully! Order #${data.orderNumber}`);

      if (data.redirectUrl) {
        router.push(data.redirectUrl);
      } else {
        router.push(`/order-success?orderNumber=${data.orderNumber}&token=${data.trackingToken}`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Order placement failed";
      toast.error(msg);
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-8 md:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/cart" className="hover:text-foreground">Cart</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground font-medium">Checkout</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
          Express Checkout
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          {session?.user ? `Logged in as ${session.user.email}` : "Guest Checkout (No account required)"}
        </p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Form: Customer & Shipping */}
        <div className="lg:col-span-2 space-y-6">
          {/* Step 1: Customer Contact */}
          <div className="p-6 rounded-2xl border bg-card shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b">
              <div className="h-7 w-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-xs">
                1
              </div>
              <h2 className="font-bold text-sm text-foreground">Customer Contact Information</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Full Name *</label>
                <Input
                  required
                  placeholder="e.g. Asif Mahmud"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Mobile Phone (BD) *</label>
                <Input
                  required
                  placeholder="017XXXXXXXX"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Email Address (for order receipts) *</label>
              <Input
                type="email"
                required
                placeholder="asif@example.com"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="text-xs"
              />
            </div>
          </div>

          {/* Step 2: Shipping Destination */}
          <div className="p-6 rounded-2xl border bg-card shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b">
              <div className="h-7 w-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h2 className="font-bold text-sm text-foreground">Delivery Destination in Bangladesh</h2>
            </div>

            {/* Zone Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Select Delivery Zone:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShippingZone("INSIDE_DHAKA");
                    setDivision("Dhaka");
                    setDistrict("Dhaka");
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    shippingZone === "INSIDE_DHAKA"
                      ? "border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-600/20"
                      : "border-border hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs">Inside Dhaka Metro</span>
                    <span className="text-xs font-extrabold text-emerald-600">৳60</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Express 24-48 Hours Delivery</p>
                </button>

                <button
                  type="button"
                  onClick={() => setShippingZone("OUTSIDE_DHAKA")}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    shippingZone === "OUTSIDE_DHAKA"
                      ? "border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-600/20"
                      : "border-border hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs">Outside Dhaka</span>
                    <span className="text-xs font-extrabold text-emerald-600">৳120</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">All 64 Districts (48-72 Hours)</p>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Division *</label>
                <Input
                  required
                  placeholder="e.g. Dhaka"
                  value={division}
                  onChange={(e) => setDivision(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold">District / City *</label>
                <Input
                  required
                  placeholder="e.g. Dhaka / Chittagong"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Upazila / Thana *</label>
                <Input
                  required
                  placeholder="e.g. Gulshan / Dhanmondi"
                  value={upazila}
                  onChange={(e) => setUpazila(e.target.value)}
                  className="text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Detailed Street Address / House & Road *</label>
              <Textarea
                required
                rows={2}
                placeholder="House # 12, Road # 4, Block B, Niketan, Gulshan-1"
                value={addressLine}
                onChange={(e) => setAddressLine(e.target.value)}
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Special Delivery Instructions (Optional)</label>
              <Input
                placeholder="e.g. Call before delivery, leave with security guard"
                value={deliveryInstructions}
                onChange={(e) => setDeliveryInstructions(e.target.value)}
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Order Notes (Optional)</label>
              <Input
                placeholder="Special packaging or gift note instructions"
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                className="text-xs"
              />
            </div>
          </div>

          {/* Step 3: Payment Method */}
          <div className="p-6 rounded-2xl border bg-card shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b">
              <div className="h-7 w-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-xs">
                3
              </div>
              <h2 className="font-bold text-sm text-foreground">Select Payment Method</h2>
            </div>

            <div className="space-y-3">
              {/* Cash on Delivery */}
              <button
                type="button"
                onClick={() => setPaymentMethod("COD")}
                className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all ${
                  paymentMethod === "COD"
                    ? "border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 ring-2 ring-emerald-600/20"
                    : "border-border hover:bg-muted/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center flex-shrink-0">
                    <Banknote className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-xs text-foreground">Cash on Delivery (COD)</p>
                    <p className="text-[11px] text-muted-foreground">
                      Pay cash or bKash at your doorstep after parcel inspection
                    </p>
                  </div>
                </div>
                <div className="h-4 w-4 rounded-full border-2 border-emerald-600 flex items-center justify-center p-0.5">
                  {paymentMethod === "COD" && <div className="h-full w-full rounded-full bg-emerald-600" />}
                </div>
              </button>

              {/* Stripe / Card */}
              <button
                type="button"
                onClick={() => setPaymentMethod("STRIPE")}
                className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all ${
                  paymentMethod === "STRIPE"
                    ? "border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 ring-2 ring-emerald-600/20"
                    : "border-border hover:bg-muted/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center flex-shrink-0">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-xs text-foreground">Credit / Debit Card & Stripe</p>
                    <p className="text-[11px] text-muted-foreground">
                      Visa, Mastercard, American Express via PCI-DSS encrypted gateway
                    </p>
                  </div>
                </div>
                <div className="h-4 w-4 rounded-full border-2 border-emerald-600 flex items-center justify-center p-0.5">
                  {paymentMethod === "STRIPE" && <div className="h-full w-full rounded-full bg-emerald-600" />}
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Right Form: Order Summary */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border bg-card shadow-sm space-y-4">
            <h2 className="font-bold text-base text-foreground">Items in Your Order ({items.length})</h2>

            <div className="divide-y max-h-72 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={`${item.productId}-${item.variantId || "base"}`} className="py-3 flex gap-3">
                  <div className="relative h-14 w-14 rounded-lg bg-muted flex-shrink-0 border overflow-hidden">
                    <Image
                      src={item.image || "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&q=80"}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-xs text-foreground truncate">{item.title}</h4>
                    {item.variantTitle && (
                      <p className="text-[10px] text-muted-foreground">{item.variantTitle}</p>
                    )}
                    <p className="text-[11px] text-muted-foreground">
                      {item.quantity} × {formatBDT(item.price)}
                    </p>
                  </div>
                  <span className="font-bold text-xs text-foreground">
                    {formatBDT(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations breakdown */}
            <div className="space-y-2 text-xs divide-y pt-2">
              <div className="flex justify-between py-1 text-muted-foreground">
                <span>Subtotal</span>
                <span className="font-semibold text-foreground">{formatBDT(subtotal)}</span>
              </div>

              <div className="flex justify-between py-1 text-muted-foreground">
                <span>Shipping ({shippingZone === "INSIDE_DHAKA" ? "Inside Dhaka" : "Outside Dhaka"})</span>
                <span className="font-semibold text-foreground">
                  {shippingFee === 0 ? <strong className="text-emerald-600">FREE</strong> : formatBDT(shippingFee)}
                </span>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between py-1 text-emerald-600 font-semibold">
                  <span>Discount ({appliedCoupon.code})</span>
                  <span>-{formatBDT(appliedCoupon.discount)}</span>
                </div>
              )}

              <div className="flex justify-between pt-3 text-sm font-black text-foreground">
                <span>Total Payable</span>
                <span className="text-lg text-emerald-600">{formatBDT(totalAmount)}</span>
              </div>
            </div>

            {/* Coupon Code Input */}
            <div className="pt-2">
              <div className="flex gap-2">
                <Input
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Coupon code (e.g. WELCOME10)"
                  className="h-9 text-xs uppercase"
                />
                <Button
                  type="button"
                  onClick={handleApplyCoupon}
                  variant="outline"
                  size="sm"
                  className="h-9 text-xs"
                >
                  Apply
                </Button>
              </div>
            </div>

            {/* Place Order CTA */}
            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-12 shadow-lg shadow-emerald-600/25 mt-4"
            >
              {submitting ? "Processing Order..." : `Confirm Order • ${formatBDT(totalAmount)}`}
            </Button>
          </div>

          <div className="p-4 rounded-xl border bg-muted/40 text-xs text-muted-foreground space-y-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600 flex-shrink-0" />
              <span>Bangladeshi Customer Support: +880 9612-000000</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-emerald-600 flex-shrink-0" />
              <span>Real-time SMS & Email tracking updates provided</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
