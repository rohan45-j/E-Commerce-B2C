import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { CategoryInput, BrandInput, ProductInput } from "@/validators/catalog";
import { ProductStatus } from "@prisma/client";

export class CatalogService {
  // -------------------------------------------------------------
  // CATEGORIES
  // -------------------------------------------------------------
  static async getCategories() {
    return prisma.category.findMany({
      include: {
        parent: true,
        children: true,
        _count: { select: { products: true } },
      },
      orderBy: { displayOrder: "asc" },
    });
  }

  static async createCategory(data: CategoryInput) {
    const category = await prisma.category.create({
      data: {
        name: data.name,
        slug: data.slug,
        parentId: data.parentId || null,
        description: data.description,
        imageUrl: data.imageUrl || null,
        displayOrder: data.displayOrder,
        isActive: data.isActive,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
      },
    });
    revalidatePath("/admin/categories");
    revalidatePath("/shop");
    revalidatePath("/");
    return category;
  }

  static async updateCategory(id: string, data: Partial<CategoryInput>) {
    const category = await prisma.category.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        parentId: data.parentId !== undefined ? data.parentId : undefined,
        description: data.description,
        imageUrl: data.imageUrl,
        displayOrder: data.displayOrder,
        isActive: data.isActive,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
      },
    });
    revalidatePath("/admin/categories");
    revalidatePath("/shop");
    revalidatePath("/");
    return category;
  }

  static async deleteCategory(id: string) {
    await prisma.category.delete({ where: { id } });
    revalidatePath("/admin/categories");
    revalidatePath("/shop");
    revalidatePath("/");
  }

  // -------------------------------------------------------------
  // BRANDS
  // -------------------------------------------------------------
  static async getBrands() {
    return prisma.brand.findMany({
      include: {
        _count: { select: { products: true } },
      },
      orderBy: { name: "asc" },
    });
  }

  static async createBrand(data: BrandInput) {
    const brand = await prisma.brand.create({
      data: {
        name: data.name,
        slug: data.slug,
        logoUrl: data.logoUrl || null,
        description: data.description,
        websiteUrl: data.websiteUrl || null,
        isActive: data.isActive,
      },
    });
    revalidatePath("/admin/brands");
    revalidatePath("/shop");
    return brand;
  }

  static async updateBrand(id: string, data: Partial<BrandInput>) {
    const brand = await prisma.brand.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        logoUrl: data.logoUrl,
        description: data.description,
        websiteUrl: data.websiteUrl,
        isActive: data.isActive,
      },
    });
    revalidatePath("/admin/brands");
    revalidatePath("/shop");
    return brand;
  }

  static async deleteBrand(id: string) {
    await prisma.brand.delete({ where: { id } });
    revalidatePath("/admin/brands");
    revalidatePath("/shop");
  }

  // -------------------------------------------------------------
  // PRODUCTS
  // -------------------------------------------------------------
  static async getProducts(filters?: {
    search?: string;
    categoryId?: string;
    brandId?: string;
    status?: ProductStatus;
  }) {
    return prisma.product.findMany({
      where: {
        ...(filters?.search && {
          OR: [
            { title: { contains: filters.search, mode: "insensitive" } },
            { sku: { contains: filters.search, mode: "insensitive" } },
          ],
        }),
        ...(filters?.categoryId && { categoryId: filters.categoryId }),
        ...(filters?.brandId && { brandId: filters.brandId }),
        ...(filters?.status && { status: filters.status }),
      },
      include: {
        category: true,
        brand: true,
        images: { orderBy: { displayOrder: "asc" } },
        variants: true,
        _count: { select: { reviews: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async getProductById(id: string) {
    return prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        brand: true,
        images: { orderBy: { displayOrder: "asc" } },
        variants: true,
        tags: { include: { tag: true } },
      },
    });
  }

  static async createProduct(data: ProductInput) {
    const product = await prisma.product.create({
      data: {
        title: data.title,
        slug: data.slug,
        shortDesc: data.shortDesc,
        description: data.description,
        basePrice: data.basePrice,
        compareAtPrice: data.compareAtPrice,
        costPrice: data.costPrice,
        sku: data.sku,
        barcode: data.barcode,
        stock: data.stock,
        status: data.status as ProductStatus,
        isFeatured: data.isFeatured,
        isNewArrival: data.isNewArrival,
        isBestSeller: data.isBestSeller,
        categoryId: data.categoryId,
        brandId: data.brandId || null,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        images: {
          create: data.images.map((url, idx) => ({
            url,
            isPrimary: idx === 0,
            displayOrder: idx,
            altText: data.title,
          })),
        },
        variants: {
          create: data.variants.map((v) => ({
            title: v.title,
            sku: v.sku,
            size: v.size || null,
            color: v.color || null,
            price: v.price || null,
            compareAtPrice: v.compareAtPrice || null,
            stock: v.stock,
          })),
        },
      },
    });

    revalidatePath("/admin/products");
    revalidatePath("/shop");
    revalidatePath(`/products/${product.slug}`);
    revalidatePath("/");
    return product;
  }

  static async updateProduct(id: string, data: ProductInput) {
    // Delete old images & variants to replace cleanly
    await prisma.productImage.deleteMany({ where: { productId: id } });
    await prisma.productVariant.deleteMany({ where: { productId: id } });

    const product = await prisma.product.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        shortDesc: data.shortDesc,
        description: data.description,
        basePrice: data.basePrice,
        compareAtPrice: data.compareAtPrice,
        costPrice: data.costPrice,
        sku: data.sku,
        barcode: data.barcode,
        stock: data.stock,
        status: data.status as ProductStatus,
        isFeatured: data.isFeatured,
        isNewArrival: data.isNewArrival,
        isBestSeller: data.isBestSeller,
        categoryId: data.categoryId,
        brandId: data.brandId || null,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        images: {
          create: data.images.map((url, idx) => ({
            url,
            isPrimary: idx === 0,
            displayOrder: idx,
            altText: data.title,
          })),
        },
        variants: {
          create: data.variants.map((v) => ({
            title: v.title,
            sku: v.sku,
            size: v.size || null,
            color: v.color || null,
            price: v.price || null,
            compareAtPrice: v.compareAtPrice || null,
            stock: v.stock,
          })),
        },
      },
    });

    revalidatePath("/admin/products");
    revalidatePath("/shop");
    revalidatePath(`/products/${product.slug}`);
    revalidatePath("/");
    return product;
  }

  static async deleteProduct(id: string) {
    await prisma.product.delete({ where: { id } });
    revalidatePath("/admin/products");
    revalidatePath("/shop");
    revalidatePath("/");
  }

  static async duplicateProduct(id: string) {
    const original = await this.getProductById(id);
    if (!original) throw new Error("Original product not found");

    const newSlug = `${original.slug}-copy-${Date.now().toString().slice(-4)}`;
    const newSku = `${original.sku}-COPY-${Date.now().toString().slice(-4)}`;

    return this.createProduct({
      title: `${original.title} (Copy)`,
      slug: newSlug,
      shortDesc: original.shortDesc || "",
      description: original.description,
      basePrice: original.basePrice,
      compareAtPrice: original.compareAtPrice,
      costPrice: original.costPrice,
      sku: newSku,
      barcode: original.barcode,
      stock: original.stock,
      status: "DRAFT",
      isFeatured: false,
      isNewArrival: false,
      isBestSeller: false,
      categoryId: original.categoryId,
      brandId: original.brandId,
      images: original.images.map((img) => img.url),
      variants: original.variants.map((v) => ({
        title: v.title,
        sku: `${v.sku}-COPY`,
        size: v.size,
        color: v.color,
        price: v.price,
        compareAtPrice: v.compareAtPrice,
        stock: v.stock,
      })),
      seoTitle: original.seoTitle || "",
      seoDescription: original.seoDescription || "",
    });
  }

  // -------------------------------------------------------------
  // REVIEWS MODERATION
  // -------------------------------------------------------------
  static async getReviews() {
    return prisma.review.findMany({
      include: {
        product: { select: { id: true, title: true, slug: true } },
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async moderateReview(id: string, isApproved: boolean) {
    const review = await prisma.review.update({
      where: { id },
      data: { isApproved },
    });
    revalidatePath("/admin/reviews");
    return review;
  }

  static async deleteReview(id: string) {
    await prisma.review.delete({ where: { id } });
    revalidatePath("/admin/reviews");
  }

  // -------------------------------------------------------------
  // INVENTORY
  // -------------------------------------------------------------
  static async getInventory(lowStockOnly: boolean = false) {
    return prisma.product.findMany({
      where: lowStockOnly ? { stock: { lte: 10 } } : undefined,
      select: {
        id: true,
        title: true,
        sku: true,
        stock: true,
        basePrice: true,
        status: true,
        category: { select: { name: true } },
        variants: {
          select: { id: true, title: true, sku: true, stock: true },
        },
      },
      orderBy: { stock: "asc" },
    });
  }

  static async quickUpdateStock(productId: string, newStock: number) {
    const product = await prisma.product.update({
      where: { id: productId },
      data: { stock: newStock },
    });
    revalidatePath("/admin/inventory");
    revalidatePath("/admin/products");
    revalidatePath("/admin");
    return product;
  }
}
