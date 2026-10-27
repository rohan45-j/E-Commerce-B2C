import { z } from "zod";

export const bannerSchema = z.object({
  placement: z.enum([
    "HERO_SLIDER",
    "PROMO_STRIP",
    "CATEGORY_FEATURE",
    "SIDEBAR",
    "FOOTER_BANNER",
  ]),
  title: z.string().optional().nullable(),
  subtitle: z.string().optional().nullable(),
  desktopImage: z.string().url("Valid image URL required"),
  mobileImage: z.string().url("Valid image URL required").optional().nullable(),
  linkUrl: z.string().optional().nullable(),
  displayOrder: z.coerce.number().default(0),
  isActive: z.boolean().default(true),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
});

export type BannerInput = z.infer<typeof bannerSchema>;

export const couponSchema = z.object({
  code: z.string().min(3, "Code must be at least 3 characters").toUpperCase(),
  description: z.string().optional().nullable(),
  type: z.enum(["PERCENTAGE", "FIXED_AMOUNT", "FREE_SHIPPING"]),
  value: z.coerce.number().min(1, "Value must be positive"), // percentage (e.g. 10) or poisha (e.g. 50000 = ৳500)
  minOrderAmount: z.coerce.number().min(0).default(0), // poisha
  maxDiscount: z.coerce.number().optional().nullable(),
  usageLimit: z.coerce.number().optional().nullable(),
  perUserLimit: z.coerce.number().default(1),
  isActive: z.boolean().default(true),
});

export type CouponInput = z.infer<typeof couponSchema>;

export const homepageSectionSchema = z.object({
  title: z.string().min(2, "Section title required"),
  subtitle: z.string().optional().nullable(),
  type: z.enum([
    "HERO_BANNER",
    "FEATURED_CATEGORIES",
    "FLASH_SALE",
    "NEW_ARRIVALS",
    "BEST_SELLERS",
    "BRAND_SHOWCASE",
    "PROMO_GRID",
    "CUSTOM_HTML",
    "TESTIMONIALS",
  ]),
  contentJson: z.string().optional().nullable(),
  displayOrder: z.coerce.number().default(0),
  isActive: z.boolean().default(true),
});

export type HomepageSectionInput = z.infer<typeof homepageSectionSchema>;

export const cmsPageSchema = z.object({
  title: z.string().min(2, "Page title is required"),
  slug: z.string().min(2, "Slug is required"),
  content: z.string().min(5, "Content is required"),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  isPublished: z.boolean().default(true),
});

export type CmsPageInput = z.infer<typeof cmsPageSchema>;

export const shippingZoneSchema = z.object({
  name: z.string().min(2, "Zone name required"),
  description: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export type ShippingZoneInput = z.infer<typeof shippingZoneSchema>;

export const shippingRateSchema = z.object({
  zoneId: z.string().min(1, "Zone is required"),
  title: z.string().min(2, "Rate title required"),
  rateAmount: z.coerce.number().min(0, "Rate must be positive"), // poisha
  minOrderAmount: z.coerce.number().optional().nullable(),
  estimatedDays: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export type ShippingRateInput = z.infer<typeof shippingRateSchema>;
