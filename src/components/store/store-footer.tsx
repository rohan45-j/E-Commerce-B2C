"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Truck,
  RotateCcw,
  CreditCard,
  Building2,
  Clock,
} from "lucide-react";

interface StoreFooterProps {
  siteLogo?: string;
  siteName?: string;
}

export function StoreFooter({ siteLogo, siteName }: StoreFooterProps = {}) {
  return (
    <footer className="w-full border-t bg-[#1a2430] text-slate-300">
      {/* 1. Value Proposition Strip */}
      <div className="border-b border-slate-700/60 bg-[#141d27]">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-[#1e2a38] border border-slate-700/50 shadow-sm">
              <div className="h-12 w-12 rounded-xl bg-[#04aeef]/10 flex items-center justify-center text-[#04aeef] flex-shrink-0">
                <Truck className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">Nationwide Delivery</h4>
                <p className="text-xs text-slate-400">Inside Dhaka 24-48h, Outside Dhaka 72h</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-[#1e2a38] border border-slate-700/50 shadow-sm">
              <div className="h-12 w-12 rounded-xl bg-[#04aeef]/10 flex items-center justify-center text-[#04aeef] flex-shrink-0">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">100% Combed Cotton</h4>
                <p className="text-xs text-slate-400">Reactive dyed, anti-shrink &amp; color-fast</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-[#1e2a38] border border-slate-700/50 shadow-sm">
              <div className="h-12 w-12 rounded-xl bg-[#04aeef]/10 flex items-center justify-center text-[#04aeef] flex-shrink-0">
                <CreditCard className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">Cash on Delivery &amp; bKash</h4>
                <p className="text-xs text-slate-400">Pay on doorstep or via bKash, Nagad, Card</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-[#1e2a38] border border-slate-700/50 shadow-sm">
              <div className="h-12 w-12 rounded-xl bg-[#04aeef]/10 flex items-center justify-center text-[#04aeef] flex-shrink-0">
                <RotateCcw className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">7-Day Easy Exchange</h4>
                <p className="text-xs text-slate-400">Hassle-free size replacement policy</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Navigation Links */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Brand & Contact Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2 group">
              {siteLogo ? (
                <div className="p-2 sm:p-2.5 rounded-xl bg-[#141d27] border border-slate-700/60 shadow-sm inline-flex items-center group-hover:border-[#04aeef]/50 transition-all">
                  <Image
                    src={siteLogo}
                    alt={siteName || "Store Logo"}
                    width={220}
                    height={60}
                    unoptimized
                    className="h-10 sm:h-12 w-auto object-contain"
                  />
                </div>
              ) : (
                <span className="font-black text-2xl tracking-tight text-[#ff6600] uppercase font-sans">
                  K<span className="text-white">ina</span><span className="text-[#ff6600]">Kati</span>
                </span>
              )}
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              {siteName || "KinaKati"} — কেনাকাটা হোক আরও সহজ। Bangladesh&apos;s premier direct-to-consumer lifestyle brand delivering
              meticulously engineered apparel, premium polos, and ethnic fashion with supreme comfort.
            </p>

            <div className="space-y-2.5 text-sm text-slate-300 pt-2">
              <div className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-[#04aeef] flex-shrink-0" />
                <span>House 42, Road 11, Banani / Gulshan, Dhaka 1213</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-[#04aeef] flex-shrink-0" />
                <span>+880 9612-000000 (10:00 AM – 10:00 PM)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-[#04aeef] flex-shrink-0" />
                <span>support@kinakati.com</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Building2 className="h-4 w-4 text-[#04aeef] flex-shrink-0" />
                <span>Outlets: Uttara • Dhanmondi • Banani • Mirpur • Chattogram</span>
              </div>
            </div>
          </div>

          {/* Men's Collection */}
          <div className="space-y-3">
            <h5 className="font-bold text-sm tracking-wider uppercase text-white">Men&apos;s Fashion</h5>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/shop?category=mens-polo" className="hover:text-[#04aeef] transition-colors">
                  Premium Polo Shirts
                </Link>
              </li>
              <li>
                <Link href="/shop?category=mens-drop-shoulder" className="hover:text-[#04aeef] transition-colors">
                  Drop Shoulder T-Shirts
                </Link>
              </li>
              <li>
                <Link href="/shop?category=mens-casual-shirts" className="hover:text-[#04aeef] transition-colors">
                  Casual &amp; Formal Shirts
                </Link>
              </li>
              <li>
                <Link href="/shop?category=mens-panjabi" className="hover:text-[#04aeef] transition-colors">
                  Classic Panjabi
                </Link>
              </li>
              <li>
                <Link href="/shop?category=mens-joggers" className="hover:text-[#04aeef] transition-colors">
                  Joggers &amp; Cargo Pants
                </Link>
              </li>
              <li>
                <Link href="/shop?category=mens-innerwear" className="hover:text-[#04aeef] transition-colors">
                  Boxers &amp; Underwear
                </Link>
              </li>
            </ul>
          </div>

          {/* Women & Sports */}
          <div className="space-y-3">
            <h5 className="font-bold text-sm tracking-wider uppercase text-white">Women &amp; Active</h5>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/shop?category=womens-kurtis" className="hover:text-[#04aeef] transition-colors">
                  Kurti &amp; Tunics
                </Link>
              </li>
              <li>
                <Link href="/shop?category=womens-tops" className="hover:text-[#04aeef] transition-colors">
                  Women&apos;s Tops &amp; Tees
                </Link>
              </li>
              <li>
                <Link href="/shop?category=womens-palazzos" className="hover:text-[#04aeef] transition-colors">
                  Palazzos &amp; Trousers
                </Link>
              </li>
              <li>
                <Link href="/shop?category=sports-football-jerseys" className="hover:text-[#04aeef] transition-colors">
                  Club Football Jerseys
                </Link>
              </li>
              <li>
                <Link href="/shop?category=sports-tshirts" className="hover:text-[#04aeef] transition-colors">
                  Gym &amp; Active T-Shirts
                </Link>
              </li>
              <li>
                <Link href="/shop?category=kids-fashion" className="hover:text-[#04aeef] transition-colors">
                  Kids &amp; Teens Collection
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care & Policies */}
          <div className="space-y-3">
            <h5 className="font-bold text-sm tracking-wider uppercase text-white">Help &amp; Support</h5>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/track-order" className="hover:text-[#04aeef] transition-colors font-medium text-white flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-[#04aeef]" /> Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/pages/return-refund-policy" className="hover:text-[#04aeef] transition-colors">
                  Exchange &amp; Return Policy
                </Link>
              </li>
              <li>
                <Link href="/pages/shipping-delivery-policy" className="hover:text-[#04aeef] transition-colors">
                  Shipping &amp; Delivery Terms
                </Link>
              </li>
              <li>
                <Link href="/pages/terms-and-conditions" className="hover:text-[#04aeef] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/pages/privacy-policy" className="hover:text-[#04aeef] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#04aeef] transition-colors">
                  Store Locator &amp; Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment & Logistics Badges Strip */}
        <div className="mt-12 pt-8 border-t border-slate-700/60 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Payment Methods Accepted:
            </p>
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold">
              <span className="px-2.5 py-1 rounded-md bg-[#1e2a38] border border-slate-700 text-white">Cash on Delivery</span>
              <span className="px-2.5 py-1 rounded-md bg-[#d82a6f] text-white">bKash</span>
              <span className="px-2.5 py-1 rounded-md bg-[#e35d26] text-white">Nagad</span>
              <span className="px-2.5 py-1 rounded-md bg-[#1e2a38] border border-slate-700 text-white">Visa</span>
              <span className="px-2.5 py-1 rounded-md bg-[#1e2a38] border border-slate-700 text-white">Mastercard</span>
              <span className="px-2.5 py-1 rounded-md bg-[#635bff] text-white">Stripe</span>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Official Logistics &amp; Delivery Partners:
            </p>
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold">
              <span className="px-2.5 py-1 rounded-md bg-[#1e2a38] border border-slate-700 text-red-400">Pathao Courier</span>
              <span className="px-2.5 py-1 rounded-md bg-[#1e2a38] border border-slate-700 text-emerald-400">Steadfast Courier</span>
              <span className="px-2.5 py-1 rounded-md bg-[#1e2a38] border border-slate-700 text-yellow-400">Paperfly</span>
              <span className="px-2.5 py-1 rounded-md bg-[#1e2a38] border border-slate-700 text-sky-400">RedX</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Copyright Bar */}
      <div className="border-t border-slate-800 bg-[#111922] py-6">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} {siteName || "KinaKati"} Ltd. All rights reserved.</p>
          <p className="flex items-center gap-2">
            <span>Currency: <strong className="text-white">BDT (৳)</strong></span>
            <span>•</span>
            <span>Bangladeshi Taka</span>
            <span>•</span>
            <Link href="/admin" className="text-slate-500 hover:text-[#04aeef] transition-colors">
              Admin Portal
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
