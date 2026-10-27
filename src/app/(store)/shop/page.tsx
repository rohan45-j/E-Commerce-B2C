import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard, ProductCardProps } from "@/components/store/product-card";
import { ArrowUpDown } from "lucide-react";
import { FabrilifeShopHeader } from "@/components/store/fabrilife-shop-header";
import { FabrilifeShopSidebar } from "@/components/store/fabrilife-shop-sidebar";
import { FABRILIFE_CATALOG } from "@/lib/fabrilife-catalog";

export const dynamic = "force-dynamic";

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    brand?: string;
    gender?: string;
    tag?: string;
    offer?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    q?: string;
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const currentCategory = params.category || "";
  const currentBrand = params.brand || "";
  const currentGender = params.gender || "";
  const currentTag = params.tag || "";
  const currentOffer = params.offer || "";
  const currentSort = params.sort || "newest";
  const searchQuery = params.q || "";
  const minPriceNum = params.minPrice ? parseInt(params.minPrice, 10) * 100 : undefined;
  const maxPriceNum = params.maxPrice ? parseInt(params.maxPrice, 10) * 100 : undefined;

  let products: ProductCardProps[] = [];
  let totalCount = 0;

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = { status: "ACTIVE" };

    if (currentCategory) {
      where.category = { slug: { contains: currentCategory, mode: "insensitive" } };
    }

    if (currentBrand) {
      where.brand = { name: currentBrand };
    }

    if (searchQuery) {
      where.OR = [
        { title: { contains: searchQuery, mode: "insensitive" } },
        { description: { contains: searchQuery, mode: "insensitive" } },
      ];
    }

    if (minPriceNum !== undefined || maxPriceNum !== undefined) {
      where.basePrice = {};
      if (minPriceNum !== undefined) where.basePrice.gte = minPriceNum;
      if (maxPriceNum !== undefined) where.basePrice.lte = maxPriceNum;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let orderBy: any = { createdAt: "desc" };
    if (currentSort === "price_asc") orderBy = { basePrice: "asc" };
    else if (currentSort === "price_desc") orderBy = { basePrice: "desc" };
    else if (currentSort === "featured") orderBy = { isFeatured: "desc" };

    const [dbProducts, count] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        include: {
          images: { orderBy: { displayOrder: "asc" } },
          category: { select: { name: true, slug: true } },
          brand: { select: { name: true } },
        },
        take: 40,
      }),
      prisma.product.count({ where }),
    ]);

    totalCount = count;

    products = dbProducts.map((p) => ({
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
    // If DB is offline or empty, use the rich Fabrilife demo catalog
    products = [];
  }

  // If products is empty (or DB disconnected), filter from FABRILIFE_CATALOG
  if (products.length === 0) {
    let demoList = [...FABRILIFE_CATALOG];

    // Filter by Gender
    if (currentGender === "women") {
      demoList = demoList.filter(
        (p) =>
          p.category.slug.includes("women") ||
          p.title.toLowerCase().includes("women") ||
          p.title.toLowerCase().includes("kurti") ||
          p.title.toLowerCase().includes("salwar")
      );
    } else if (currentGender === "kids" || currentGender === "teens") {
      demoList = demoList.filter(
        (p) =>
          p.category.slug.includes("sports") ||
          p.category.slug.includes("drop") ||
          p.title.toLowerCase().includes("jersey") ||
          p.title.toLowerCase().includes("drop")
      );
    } else if (currentGender === "men") {
      demoList = demoList.filter(
        (p) =>
          !p.category.slug.includes("women") &&
          !p.title.toLowerCase().includes("kurti") &&
          !p.title.toLowerCase().includes("salwar")
      );
    }

    // Filter by Tag
    if (currentTag) {
      if (currentTag === "drop-shoulder") {
        demoList = demoList.filter((p) => p.slug.includes("drop-shoulder") || p.title.toLowerCase().includes("drop"));
      } else if (currentTag === "sports") {
        demoList = demoList.filter((p) => p.slug.includes("jersey") || p.slug.includes("shorts") || p.category.slug.includes("sports"));
      } else if (currentTag === "cut-stitch" || currentTag === "cut-stitch-designer") {
        demoList = demoList.filter((p) => p.slug.includes("cut-and-stitch") || p.slug.includes("tshirt") || p.slug.includes("polo"));
      } else if (currentTag === "polo") {
        demoList = demoList.filter((p) => p.slug.includes("polo"));
      } else if (currentTag === "linen") {
        demoList = demoList.filter((p) => p.slug.includes("linen"));
      }
    }

    // Filter by Category
    if (currentCategory) {
      demoList = demoList.filter((p) =>
        p.category.slug.toLowerCase().includes(currentCategory.toLowerCase()) ||
        p.title.toLowerCase().includes(currentCategory.toLowerCase())
      );
    }

    // Filter by Search Query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      demoList = demoList.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.name.toLowerCase().includes(q)
      );
    }

    // Filter by Special Offer
    if (currentOffer === "mega-deal") {
      demoList = demoList.filter((p) => p.compareAtPrice && p.compareAtPrice > p.basePrice);
    } else if (currentOffer === "top-selling") {
      demoList = demoList.filter((p) => p.stock > 30);
    }

    // Sort
    if (currentSort === "price_asc") {
      demoList.sort((a, b) => a.basePrice - b.basePrice);
    } else if (currentSort === "price_desc") {
      demoList.sort((a, b) => b.basePrice - a.basePrice);
    }

    totalCount = demoList.length;

    products = demoList.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      sku: p.sku,
      basePrice: p.basePrice,
      compareAtPrice: p.compareAtPrice,
      images: p.images.map((img) => ({ url: img.url, isPrimary: img.isPrimary })),
      category: p.category,
      brand: p.brand,
      isFeatured: true,
      stock: p.stock,
    }));
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-10 space-y-6">
      {/* Main 2-Column Fabrilife Catalog Layout: Left Sidebar + Right Products Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Column: Special Offers & Category Tree (3 cols on lg) */}
        <div className="lg:col-span-3">
          <FabrilifeShopSidebar />
        </div>

        {/* Right Column: Fabrilife Filter Header + Products Grid (9 cols on lg) */}
        <div className="lg:col-span-9 space-y-6">
          {/* 1. Fabrilife Top Filter Header (The Red Box from User Screenshot) */}
          <FabrilifeShopHeader />

          {/* 2. Top Bar: Results Count + Sort Dropdown */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b text-xs">
            <div>
              <span className="text-muted-foreground">Showing </span>
              <strong className="text-foreground">{products.length}</strong>
              <span className="text-muted-foreground"> of {totalCount} products in catalog</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-muted-foreground font-semibold flex items-center gap-1">
                <ArrowUpDown className="h-3.5 w-3.5" />
                Sort:
              </span>
              <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg">
                <Link
                  href={`/shop?sort=newest${currentCategory ? `&category=${currentCategory}` : ""}${currentGender ? `&gender=${currentGender}` : ""}${currentTag ? `&tag=${currentTag}` : ""}`}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    currentSort === "newest"
                      ? "bg-background text-foreground font-bold shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Newest
                </Link>
                <Link
                  href={`/shop?sort=price_asc${currentCategory ? `&category=${currentCategory}` : ""}${currentGender ? `&gender=${currentGender}` : ""}${currentTag ? `&tag=${currentTag}` : ""}`}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    currentSort === "price_asc"
                      ? "bg-background text-foreground font-bold shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Price: Low &rarr; High
                </Link>
                <Link
                  href={`/shop?sort=price_desc${currentCategory ? `&category=${currentCategory}` : ""}${currentGender ? `&gender=${currentGender}` : ""}${currentTag ? `&tag=${currentTag}` : ""}`}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    currentSort === "price_desc"
                      ? "bg-background text-foreground font-bold shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Price: High &rarr; Low
                </Link>
              </div>
            </div>
          </div>

          {/* 3. Products Grid */}
          {products.length === 0 ? (
            <div className="text-center py-16 border rounded-2xl bg-card space-y-3">
              <p className="text-base font-bold text-foreground">No products found</p>
              <p className="text-xs text-muted-foreground">
                Try selecting another category, gender, or clear active filters.
              </p>
              <Link
                href="/shop"
                className="inline-block mt-2 px-4 py-2 rounded-xl bg-[#04aeef] text-white font-bold text-xs"
              >
                Reset All Filters
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6">
              {products.map((p) => (
                <ProductCard key={p.id} {...p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
