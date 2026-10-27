import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { ProductCard, ProductCardProps } from "@/components/store/product-card";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  ArrowRight,
  Clock,
  Truck,
  Flame,
  RefreshCw,
  Award,
} from "lucide-react";

import { MarketingService } from "@/server/services/marketing.service";
import { extractHeroConfig } from "@/lib/hero-config";

export const dynamic = "force-dynamic";

const FABRILIFE_CIRCLE_CATEGORIES = [
  {
    name: "Polo Shirts",
    slug: "mens-polo",
    image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=400&q=80",
    badge: "Trending",
  },
  {
    name: "T-Shirts",
    slug: "mens-tshirts",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&q=80",
  },
  {
    name: "Drop Shoulder",
    slug: "mens-drop-shoulder",
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&q=80",
    badge: "HOT",
  },
  {
    name: "Casual Shirts",
    slug: "mens-shirts",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&q=80",
  },
  {
    name: "Festive Panjabi",
    slug: "mens-panjabi",
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&q=80",
    badge: "Festive",
  },
  {
    name: "Kurti & Tops",
    slug: "womens-kurtis",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&q=80",
  },
  {
    name: "Joggers & Pants",
    slug: "mens-joggers",
    image: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=400&q=80",
  },
  {
    name: "Sports Jerseys",
    slug: "sports-activewear",
    image: "https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=400&q=80",
    badge: "Fan Edition",
  },
];

export default async function HomePage() {
  let dbProducts: ProductCardProps[] = [];
  let heroConfig = extractHeroConfig({});

  try {
    const [productsData, settings] = await Promise.all([
      prisma.product.findMany({
        where: { status: "ACTIVE" },
        include: {
          images: { orderBy: { displayOrder: "asc" } },
          category: { select: { name: true, slug: true } },
          brand: { select: { name: true } },
        },
        take: 24,
        orderBy: { createdAt: "desc" },
      }),
      MarketingService.getSiteSettings(),
    ]);

    heroConfig = extractHeroConfig(settings);

    dbProducts = productsData.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      sku: p.sku,
      basePrice: p.basePrice,
      compareAtPrice: p.compareAtPrice,
      images: p.images.map((img) => ({ url: img.url, isPrimary: img.isPrimary })),
      category: p.category,
      brand: p.brand,
      isFeatured: p.isFeatured,
      isNewArrival: p.isNewArrival,
      isBestSeller: p.isBestSeller,
      stock: p.stock,
    }));
  } catch {
    // If DB is offline, provide high-quality Fabrilife demo catalog
    dbProducts = [
      {
        id: "fab-1",
        title: "Mens Premium Luxe Polo - Eastbound",
        slug: "mens-premium-luxe-polo-eastbound",
        sku: "POLO-LUX-001",
        basePrice: 87500, // ৳875
        compareAtPrice: 120000, // ৳1200
        images: [{ url: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&q=80", isPrimary: true }],
        category: { name: "Mens • Polo", slug: "mens-polo" },
        brand: { name: "Fabrilife Luxe" },
        isFeatured: true,
        stock: 35,
      },
      {
        id: "fab-2",
        title: "Premium Designer Edition Double PK Cotton Polo - Eminent",
        slug: "premium-designer-edition-double-pk-cotton-polo-eminent",
        sku: "POLO-PK-002",
        basePrice: 114000, // ৳1140
        compareAtPrice: 149000, // ৳1490
        images: [{ url: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=800&q=80", isPrimary: true }],
        category: { name: "Mens • Polo", slug: "mens-polo" },
        brand: { name: "Fabrilife Premium" },
        isBestSeller: true,
        stock: 42,
      },
      {
        id: "fab-3",
        title: "Cut & Stitch Designer Edition Short Sleeve T-Shirt - Obsidian",
        slug: "cut-and-stitch-designer-edition-short-sleeve-tshirt",
        sku: "TSH-CS-003",
        basePrice: 58000, // ৳580
        compareAtPrice: 75000, // ৳750
        images: [{ url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80", isPrimary: true }],
        category: { name: "Mens • T-Shirt", slug: "mens-tshirts" },
        brand: { name: "Fabrilife Street" },
        isFeatured: true,
        stock: 50,
      },
      {
        id: "fab-4",
        title: "Mens Streetwear Drop Shoulder T-Shirt - Sandstone",
        slug: "mens-streetwear-drop-shoulder-tshirt-sandstone",
        sku: "TSH-DRP-004",
        basePrice: 65000, // ৳650
        compareAtPrice: 85000, // ৳850
        images: [{ url: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80", isPrimary: true }],
        category: { name: "Mens • Drop Shoulder", slug: "mens-drop-shoulder" },
        brand: { name: "Fabrilife Street" },
        stock: 28,
      },
      {
        id: "fab-5",
        title: "Womens Premium Tunic & Kurti - Sylis Edition",
        slug: "womens-premium-tunic-kurti-sylis",
        sku: "KRT-SYL-005",
        basePrice: 99000, // ৳990
        compareAtPrice: 150000, // ৳1500
        images: [{ url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80", isPrimary: true }],
        category: { name: "Womens • Kurti", slug: "womens-kurtis" },
        brand: { name: "Fabrilife Woman" },
        isBestSeller: true,
        stock: 20,
      },
      {
        id: "fab-6",
        title: "Womens Premium Salwar Kameez [2pcs] - Harshiya",
        slug: "womens-premium-salwar-kameez-harshiya",
        sku: "SK-HAR-006",
        basePrice: 249000, // ৳2490
        compareAtPrice: 350000, // ৳3500
        images: [{ url: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&q=80", isPrimary: true }],
        category: { name: "Womens • Salwar Kameez", slug: "womens-salwar-kameez" },
        brand: { name: "Fabrilife Woman" },
        isFeatured: true,
        stock: 15,
      },
      {
        id: "fab-7",
        title: "Real Madrid 26/27 Home Jersey - Player Edition",
        slug: "real-madrid-2627-home-jersey-player-edition",
        sku: "JER-RMA-007",
        basePrice: 115000, // ৳1150
        compareAtPrice: 150000, // ৳1500
        images: [{ url: "https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800&q=80", isPrimary: true }],
        category: { name: "Sports • Jersey", slug: "sports-activewear" },
        brand: { name: "Fabrilife Sports" },
        isBestSeller: true,
        stock: 30,
      },
      {
        id: "fab-8",
        title: "Sports Edition Quick-Dry Shorts - Elysian",
        slug: "sports-edition-quick-dry-shorts-elysian",
        sku: "SHR-ELY-008",
        basePrice: 48000, // ৳480
        compareAtPrice: 65000, // ৳650
        images: [{ url: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800&q=80", isPrimary: true }],
        category: { name: "Mens • Shorts", slug: "mens-shorts" },
        brand: { name: "Fabrilife Sports" },
        stock: 45,
      },
    ];
  }

  // Segregate collections for Fabrilife-style category spotlight grids
  const poloProducts = dbProducts.filter((p) => p.category?.slug?.includes("polo") || p.title.toLowerCase().includes("polo")).slice(0, 6);
  const kurtiProducts = dbProducts.filter((p) => p.category?.slug?.includes("women") || p.title.toLowerCase().includes("kurti") || p.title.toLowerCase().includes("salwar")).slice(0, 6);
  const remainingProducts = dbProducts.slice(0, 8);

  return (
    <div className="space-y-12 sm:space-y-16 pb-20">
      {/* 1. Dynamic Hero Carousel Banner (Managed from Admin) */}
      <section className="relative overflow-hidden bg-[#222f3f] text-white">
        <div className="container mx-auto px-4 py-12 md:py-20 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-5">
              {heroConfig.badgeText && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#04aeef]/20 border border-[#04aeef]/40 text-[#04aeef] text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>{heroConfig.badgeText}</span>
                </div>
              )}

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight uppercase font-sans">
                {heroConfig.titleMain}{" "}
                <span className="text-[#04aeef]">{heroConfig.titleHighlight}</span>
              </h1>

              <p className="text-base sm:text-lg text-gray-300 font-normal leading-relaxed max-w-xl">
                {heroConfig.subtitle}
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                {heroConfig.primaryBtnText && (
                  <Link href={heroConfig.primaryBtnLink || "/shop"}>
                    <Button
                      size="lg"
                      className="theme-btn-cta font-bold px-8 h-12 text-sm shadow-lg transition-all"
                    >
                      {heroConfig.primaryBtnText}
                    </Button>
                  </Link>
                )}
                {heroConfig.secondaryBtnText && (
                  <Link href={heroConfig.secondaryBtnLink || "/shop"}>
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-white/40 text-white hover:bg-white/10 h-12 text-sm font-bold backdrop-blur-sm"
                      style={{ borderRadius: "var(--btn-radius, 8px)" }}
                    >
                      {heroConfig.secondaryBtnText}
                    </Button>
                  </Link>
                )}
              </div>

              {/* Fast Trust Bar */}
              <div className="grid grid-cols-3 gap-3 pt-6 border-t border-white/15 text-xs text-gray-300">
                {heroConfig.trustBadge1 && (
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-[#04aeef] shrink-0" />
                    <span>{heroConfig.trustBadge1}</span>
                  </div>
                )}
                {heroConfig.trustBadge2 && (
                  <div className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>{heroConfig.trustBadge2}</span>
                  </div>
                )}
                {heroConfig.trustBadge3 && (
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-amber-400 shrink-0" />
                    <span>{heroConfig.trustBadge3}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5 relative">
              <Link href={heroConfig.cardLink || "/shop"} className="block group">
                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border-2 border-white/10 shadow-2xl group-hover:border-[#04aeef]/60 transition-all">
                  {heroConfig.cardImage ? (
                    <Image
                      src={heroConfig.cardImage}
                      alt={heroConfig.cardTitle || "Hero Featured Collection"}
                      fill
                      priority
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted/20 flex items-center justify-center text-xs text-muted-foreground">
                      No image
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
                    {heroConfig.cardTag && (
                      <span className="text-[11px] font-bold uppercase tracking-widest text-[#04aeef]">
                        {heroConfig.cardTag}
                      </span>
                    )}
                    {heroConfig.cardTitle && (
                      <p className="text-xl font-extrabold text-white">
                        {heroConfig.cardTitle}
                      </p>
                    )}
                    {heroConfig.cardSubtext && (
                      <p className="text-xs text-gray-300 mt-0.5">
                        {heroConfig.cardSubtext}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Fabrilife Circular Category Scroller */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-6">
          <p className="text-xs font-bold uppercase tracking-widest text-[#04aeef]">
            Explore Collections
          </p>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground mt-0.5">
            Popular Categories
          </h2>
        </div>

        <div className="flex items-center justify-start sm:justify-center gap-4 sm:gap-6 overflow-x-auto pb-4 scrollbar-none px-2">
          {FABRILIFE_CIRCLE_CATEGORIES.map((cat, idx) => (
            <Link
              key={idx}
              href={`/shop?category=${cat.slug}`}
              className="flex flex-col items-center gap-2 shrink-0 group"
            >
              <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-full overflow-hidden border-2 border-muted group-hover:border-[#04aeef] transition-all p-1 bg-card shadow-sm group-hover:scale-105 duration-200">
                <div className="relative h-full w-full rounded-full overflow-hidden">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover"
                  />
                </div>
                {cat.badge && (
                  <span className="absolute bottom-0 inset-x-1 py-0.5 bg-[#ff3f6c] text-white text-[9px] font-black uppercase text-center rounded-full shadow">
                    {cat.badge}
                  </span>
                )}
              </div>
              <span className="text-xs font-bold text-foreground group-hover:text-[#04aeef] transition-colors text-center max-w-[90px] leading-tight">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Spotlight Section 1: Men's Designer Polo (Fabrilife 1/3 + 2/3 Layout) */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6 pb-2 border-b">
          <div>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-foreground flex items-center gap-2">
              <span className="text-[#04aeef]">Men&apos;s</span> Designer Polo
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Class and luxury engineered with double-knitted PK cotton
            </p>
          </div>
          <Link
            href="/shop?category=mens-polo"
            className="text-xs font-bold text-[#04aeef] hover:underline flex items-center gap-1"
          >
            View All Polos &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left 1/3 Spotlight Feature Card */}
          <div className="lg:col-span-4 rounded-2xl overflow-hidden relative min-h-[380px] lg:min-h-full flex flex-col justify-between p-6 bg-slate-900 text-white shadow-md group">
            <Image
              src="https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&q=80"
              alt="Designer Polo Cover"
              fill
              className="object-cover opacity-50 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="relative z-10">
              <span className="theme-badge-accent text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                Signature Collection
              </span>
              <h3 className="text-3xl font-black uppercase tracking-tight mt-3">
                Luxe Polo Edition
              </h3>
              <p className="text-xs text-gray-300 mt-2 leading-relaxed">
                Premium 220 GSM combed cotton featuring moisture-wicking weave and custom engraved buttons.
              </p>
            </div>
            <div className="relative z-10 pt-4">
              <Link href="/shop?category=mens-polo">
                <Button className="w-full theme-btn-cta font-bold text-xs h-10 shadow-sm">
                  Shop Designer Polos &rarr;
                </Button>
              </Link>
            </div>
          </div>

          {/* Right 2/3 Product Grid */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {(poloProducts.length > 0 ? poloProducts : remainingProducts.slice(0, 6)).map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Fabrilife 3-Column Promo Cards Row */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Link
            href="/shop?category=mens-tshirts"
            className="group relative rounded-2xl overflow-hidden aspect-[16/9] shadow-md border"
          >
            <Image
              src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80"
              alt="Printed Short Sleeve"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-5 text-white">
              <span className="text-[10px] font-bold text-[#04aeef] uppercase tracking-wider">
                Everyday Staples
              </span>
              <h4 className="text-lg font-black uppercase">Printed Short Sleeve</h4>
              <p className="text-xs text-gray-300">Screen printed graphic tees</p>
            </div>
          </Link>

          <Link
            href="/shop?category=mens-drop-shoulder"
            className="group relative rounded-2xl overflow-hidden aspect-[16/9] shadow-md border"
          >
            <Image
              src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80"
              alt="Designer Edition Cut & Stitch"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-5 text-white">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                Streetwear
              </span>
              <h4 className="text-lg font-black uppercase">Drop Shoulder Edition</h4>
              <p className="text-xs text-gray-300">Boxy relaxed urban silhouette</p>
            </div>
          </Link>

          <Link
            href="/shop?category=mens-tshirts"
            className="group relative rounded-2xl overflow-hidden aspect-[16/9] shadow-md border"
          >
            <Image
              src="https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80"
              alt="Short Sleeve Blanks"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-5 text-white">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                Minimalism
              </span>
              <h4 className="text-lg font-black uppercase">Solid Color Blanks</h4>
              <p className="text-xs text-gray-300">Ultra-soft 100% bio-washed cotton</p>
            </div>
          </Link>
        </div>
      </section>

      {/* 5. Spotlight Section 2: Women's Ethnic & Fusion (Kurti, Tunic & Tops) */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6 pb-2 border-b">
          <div>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-foreground flex items-center gap-2">
              <span className="text-[#ff3f6c]">Women&apos;s</span> Kurti &amp; Tunics
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Contemporary Bengali heritage tailored for modern everyday grace
            </p>
          </div>
          <Link
            href="/shop?category=womens-kurtis"
            className="text-xs font-bold text-[#ff3f6c] hover:underline flex items-center gap-1"
          >
            View All Women &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left 1/3 Spotlight Feature Card */}
          <div className="lg:col-span-4 rounded-2xl overflow-hidden relative min-h-[380px] lg:min-h-full flex flex-col justify-between p-6 bg-slate-900 text-white shadow-md group">
            <Image
              src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80"
              alt="Women Ethnic Wear Cover"
              fill
              className="object-cover opacity-50 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="relative z-10">
              <span className="theme-badge-accent text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                Festive Edit
              </span>
              <h3 className="text-3xl font-black uppercase tracking-tight mt-3">
                Kurti &amp; Tunics
              </h3>
              <p className="text-xs text-gray-300 mt-2 leading-relaxed">
                Handcrafted embroidery, modal viscose fabric, and tailored breathable silhouettes.
              </p>
            </div>
            <div className="relative z-10 pt-4">
              <Link href="/shop?category=womens-kurtis">
                <Button className="w-full theme-btn-cta font-bold text-xs h-10 shadow-sm">
                  Explore Kurti Collection &rarr;
                </Button>
              </Link>
            </div>
          </div>

          {/* Right 2/3 Product Grid */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {(kurtiProducts.length > 0 ? kurtiProducts : remainingProducts.slice(0, 6)).map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. Fabrilife "Comfort & Confidence" Brand Story Banner */}
      <section className="container mx-auto px-4">
        <div className="rounded-3xl bg-muted/40 border p-8 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#04aeef]">
                FABRILIFE PROMISE <ArrowRight className="h-3 w-3" />
              </div>
              <h3 className="text-2xl sm:text-4xl font-black tracking-tight text-foreground">
                Because comfort and confidence go hand in hand.
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
                We focus on carefully selecting the best clothing that is comfortable, looks great, and makes you confident. Apart from fabric, design, and fit, we go through strict quality control parameters to deliver what you truly deserve.
              </p>

              {/* 4 Pillars Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                <div className="p-3 rounded-xl bg-card border">
                  <Truck className="h-5 w-5 text-[#04aeef] mb-1.5" />
                  <p className="font-bold text-xs text-foreground">Cash on Delivery</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">All 64 districts in BD</p>
                </div>
                <div className="p-3 rounded-xl bg-card border">
                  <RefreshCw className="h-5 w-5 text-emerald-500 mb-1.5" />
                  <p className="font-bold text-xs text-foreground">7 Days Return</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Instant size exchange</p>
                </div>
                <div className="p-3 rounded-xl bg-card border">
                  <Award className="h-5 w-5 text-amber-500 mb-1.5" />
                  <p className="font-bold text-xs text-foreground">100% Cotton</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Pre-shrunk combed yarn</p>
                </div>
                <div className="p-3 rounded-xl bg-card border">
                  <Clock className="h-5 w-5 text-purple-500 mb-1.5" />
                  <p className="font-bold text-xs text-foreground">Express Delivery</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">24-48 Hours inside Dhaka</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 relative aspect-[4/3] rounded-2xl overflow-hidden border">
              <Image
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80"
                alt="Comfort and Confidence"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 7. New Arrivals & Best Sellers Strip */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6 pb-2 border-b">
          <div>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-foreground flex items-center gap-2">
              <Flame className="h-5 w-5 text-[#ff3f6c]" /> Top Selling &amp; New Arrivals
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Hand-picked best selling garments loved by customers across Bangladesh
            </p>
          </div>
          <Link href="/shop" className="text-xs font-bold text-[#04aeef] hover:underline">
            View All Catalog &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {remainingProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </section>
    </div>
  );
}
