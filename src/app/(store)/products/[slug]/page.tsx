import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ProductDetailView } from "@/components/store/product-detail-view";
import { ProductCard, ProductCardProps } from "@/components/store/product-card";
import {
  getFabrilifeProductBySlug,
  getRelatedFabrilifeProducts,
} from "@/lib/fabrilife-catalog";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: { images: { take: 1 } },
    });

    if (product) {
      const title = product.seoTitle || `${product.title} | Fabrilife Premium`;
      const description =
        product.seoDescription ||
        product.description?.slice(0, 160) ||
        `Buy authentic ${product.title} online in Bangladesh at best price with Cash on Delivery.`;
      const imageUrl = product.images[0]?.url || "";

      return {
        title,
        description,
        openGraph: {
          title,
          description,
          images: imageUrl ? [{ url: imageUrl }] : [],
        },
      };
    }
  } catch {
    // Continue to fallback
  }

  // Fallback demo product metadata
  const fallback = getFabrilifeProductBySlug(slug);
  if (fallback) {
    const title = `${fallback.title} | Fabrilife Bangladesh`;
    const description = fallback.description.slice(0, 160);
    const imageUrl = fallback.images[0]?.url || "";

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: imageUrl ? [{ url: imageUrl }] : [],
      },
    };
  }

  return { title: "Product Details | Fabrilife" };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;

  // 1. Try to find product in PostgreSQL Prisma database
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let dbProduct: any = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let dbRelated: any[] = [];

  try {
    dbProduct = await prisma.product.findUnique({
      where: { slug },
      include: {
        images: { orderBy: { displayOrder: "asc" } },
        category: { select: { id: true, name: true, slug: true } },
        brand: { select: { id: true, name: true } },
        variants: {
          where: { isActive: true },
          orderBy: { createdAt: "asc" },
        },
        reviews: {
          where: { isApproved: true },
          include: { user: { select: { name: true } } },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (dbProduct) {
      dbRelated = await prisma.product.findMany({
        where: {
          status: "ACTIVE",
          id: { not: dbProduct.id },
          categoryId: dbProduct.categoryId,
        },
        include: {
          images: { orderBy: { displayOrder: "asc" } },
          category: { select: { name: true, slug: true } },
          brand: { select: { name: true } },
        },
        take: 4,
      });
    }
  } catch {
    // Database connection or auth error handled gracefully
  }

  // 2. If not found in DB or DB is offline, fall back to high-fidelity Fabrilife demo catalog
  let viewProduct;
  let relatedProducts: ProductCardProps[] = [];

  if (dbProduct) {
    viewProduct = {
      id: dbProduct.id,
      title: dbProduct.title,
      slug: dbProduct.slug,
      sku: dbProduct.sku,
      description: dbProduct.description,
      basePrice: dbProduct.basePrice,
      compareAtPrice: dbProduct.compareAtPrice,
      stock: dbProduct.stock,
      gsm: "220 GSM Double PK Cotton",
      fabric: "100% Combed Compact Cotton",
      fit: "Regular Fit",
      images: dbProduct.images,
      category: dbProduct.category,
      brand: dbProduct.brand,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      variants: dbProduct.variants.map((v: any) => ({
        id: v.id,
        sku: v.sku,
        title: v.title,
        price: v.price || dbProduct.basePrice,
        compareAtPrice: v.compareAtPrice,
        stock: v.stock,
        options: {
          ...(v.size ? { Size: v.size } : {}),
          ...(v.color ? { Color: v.color } : {}),
        },
      })),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      reviews: dbProduct.reviews.map((r: any) => ({
        id: r.id,
        rating: r.rating,
        title: r.title,
        comment: r.comment,
        createdAt: r.createdAt.toISOString(),
        user: { name: r.user.name },
      })),
    };

    if (dbRelated.length > 0) {
      relatedProducts = dbRelated.map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        sku: p.sku,
        basePrice: p.basePrice,
        compareAtPrice: p.compareAtPrice,
        images: p.images.map((img: { url: string; isPrimary: boolean }) => ({ url: img.url, isPrimary: img.isPrimary })),
        category: p.category,
        brand: p.brand,
        isFeatured: p.isFeatured,
        isNewArrival: p.isNewArrival,
        isBestSeller: p.isBestSeller,
        stock: p.stock,
      }));
    }
  } else {
    // Demo catalog fallback
    const fallback = getFabrilifeProductBySlug(slug);
    if (!fallback) {
      notFound();
    }

    viewProduct = {
      id: fallback.id,
      title: fallback.title,
      slug: fallback.slug,
      sku: fallback.sku,
      description: fallback.description,
      basePrice: fallback.basePrice,
      compareAtPrice: fallback.compareAtPrice,
      stock: fallback.stock,
      gsm: fallback.gsm,
      fabric: fallback.fabric,
      fit: fallback.fit,
      images: fallback.images,
      category: fallback.category,
      brand: fallback.brand,
      variants: fallback.variants,
      reviews: fallback.reviews,
    };

    // Load related items from Fabrilife catalog
    const relatedCatalog = getRelatedFabrilifeProducts(fallback.slug, 4);
    relatedProducts = relatedCatalog.map((p) => ({
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

  // JSON-LD Schema for Google Rich Snippets
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: viewProduct.title,
    image: viewProduct.images.map((img: { url: string }) => img.url),
    description: viewProduct.description,
    sku: viewProduct.sku,
    brand: {
      "@type": "Brand",
      name: viewProduct.brand?.name || "Fabrilife",
    },
    offers: {
      "@type": "Offer",
      url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/products/${viewProduct.slug}`,
      priceCurrency: "BDT",
      price: (viewProduct.basePrice / 100).toFixed(2),
      availability:
        viewProduct.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "Fabrilife Bangladesh",
      },
    },
  };

  return (
    <div className="container mx-auto px-4 py-6 md:py-10 space-y-12">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Main Fabrilife PDP Interaction Component */}
      <ProductDetailView product={viewProduct} />

      {/* Related / Similar Products Spotlight */}
      {relatedProducts.length > 0 && (
        <section className="pt-10 border-t space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="theme-text-brand text-xs font-black uppercase tracking-wider block">
                Fabrilife Collections
              </span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
                Similar Items You Might Like
              </h2>
            </div>
            <Link
              href="/shop"
              className="text-xs font-bold text-muted-foreground hover:text-foreground hover:underline"
            >
              View Full Collection &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} {...p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
