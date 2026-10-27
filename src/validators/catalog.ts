import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  parentId: z.string().nullable().optional(),
  description: z.string().optional(),
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  displayOrder: z.coerce.number().default(0),
  isActive: z.boolean().default(true),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export type CategoryInput = z.infer<typeof categorySchema>;

export const brandSchema = z.object({
  name: z.string().min(2, "Brand name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  logoUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  description: z.string().optional(),
  websiteUrl: z.string().url().optional().or(z.literal("")),
  isActive: z.boolean().default(true),
});

export type BrandInput = z.infer<typeof brandSchema>;

export const productVariantSchema = z.object({
  title: z.string().min(1, "Variant title is required"),
  sku: z.string().min(1, "SKU is required"),
  size: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  price: z.coerce.number().optional().nullable(),
  compareAtPrice: z.coerce.number().optional().nullable(),
  stock: z.coerce.number().min(0, "Stock cannot be negative").default(0),
});

export const productSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().min(3, "Slug is required"),
  shortDesc: z.string().optional(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  basePrice: z.coerce.number().min(0, "Base price must be positive"), // in minor units
  compareAtPrice: z.coerce.number().optional().nullable(),
  costPrice: z.coerce.number().optional().nullable(),
  sku: z.string().min(2, "SKU is required"),
  barcode: z.string().optional().nullable(),
  stock: z.coerce.number().min(0).default(0),
  status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]).default("ACTIVE"),
  isFeatured: z.boolean().default(false),
  isNewArrival: z.boolean().default(false),
  isBestSeller: z.boolean().default(false),
  categoryId: z.string().min(1, "Category is required"),
  brandId: z.string().optional().nullable(),
  images: z.array(z.string()).min(1, "At least one product image is required"),
  variants: z.array(productVariantSchema).default([]),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export type ProductInput = z.infer<typeof productSchema>;

export const quickStockSchema = z.object({
  productId: z.string().min(1),
  stock: z.coerce.number().min(0),
});
