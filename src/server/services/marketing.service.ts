import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import {
  BannerInput,
  CouponInput,
  HomepageSectionInput,
  CmsPageInput,
  ShippingZoneInput,
  ShippingRateInput,
} from "@/validators/marketing";

export class MarketingService {
  // -------------------------------------------------------------
  // BANNERS
  // -------------------------------------------------------------
  static async getBanners() {
    return prisma.banner.findMany({
      orderBy: [{ placement: "asc" }, { displayOrder: "asc" }],
    });
  }

  static async createBanner(data: BannerInput) {
    const banner = await prisma.banner.create({
      data: {
        placement: data.placement,
        title: data.title || null,
        subtitle: data.subtitle || null,
        desktopImage: data.desktopImage,
        mobileImage: data.mobileImage || null,
        linkUrl: data.linkUrl || null,
        displayOrder: data.displayOrder,
        isActive: data.isActive,
      },
    });
    revalidatePath("/");
    revalidatePath("/admin/banners");
    return banner;
  }

  static async updateBanner(id: string, data: BannerInput) {
    const banner = await prisma.banner.update({
      where: { id },
      data: {
        placement: data.placement,
        title: data.title || null,
        subtitle: data.subtitle || null,
        desktopImage: data.desktopImage,
        mobileImage: data.mobileImage || null,
        linkUrl: data.linkUrl || null,
        displayOrder: data.displayOrder,
        isActive: data.isActive,
      },
    });
    revalidatePath("/");
    revalidatePath("/admin/banners");
    return banner;
  }

  static async deleteBanner(id: string) {
    await prisma.banner.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/admin/banners");
  }

  // -------------------------------------------------------------
  // COUPONS
  // -------------------------------------------------------------
  static async getCoupons() {
    return prisma.coupon.findMany({
      include: { _count: { select: { orders: true } } },
      orderBy: { createdAt: "desc" },
    });
  }

  static async createCoupon(data: CouponInput) {
    const coupon = await prisma.coupon.create({
      data: {
        code: data.code.toUpperCase(),
        description: data.description || null,
        type: data.type,
        value: data.value,
        minOrderAmount: data.minOrderAmount,
        maxDiscount: data.maxDiscount || null,
        usageLimit: data.usageLimit || null,
        perUserLimit: data.perUserLimit,
        isActive: data.isActive,
      },
    });
    revalidatePath("/admin/coupons");
    return coupon;
  }

  static async updateCoupon(id: string, data: CouponInput) {
    const coupon = await prisma.coupon.update({
      where: { id },
      data: {
        code: data.code.toUpperCase(),
        description: data.description || null,
        type: data.type,
        value: data.value,
        minOrderAmount: data.minOrderAmount,
        maxDiscount: data.maxDiscount || null,
        usageLimit: data.usageLimit || null,
        perUserLimit: data.perUserLimit,
        isActive: data.isActive,
      },
    });
    revalidatePath("/admin/coupons");
    return coupon;
  }

  static async deleteCoupon(id: string) {
    await prisma.coupon.delete({ where: { id } });
    revalidatePath("/admin/coupons");
  }

  // -------------------------------------------------------------
  // HOMEPAGE SECTIONS
  // -------------------------------------------------------------
  static async getHomepageSections() {
    return prisma.homepageSection.findMany({
      orderBy: { displayOrder: "asc" },
    });
  }

  static async createHomepageSection(data: HomepageSectionInput) {
    const section = await prisma.homepageSection.create({
      data: {
        title: data.title,
        subtitle: data.subtitle || null,
        type: data.type,
        contentJson: data.contentJson || null,
        displayOrder: data.displayOrder,
        isActive: data.isActive,
      },
    });
    revalidatePath("/");
    revalidatePath("/admin/homepage");
    return section;
  }

  static async updateHomepageSection(id: string, data: HomepageSectionInput) {
    const section = await prisma.homepageSection.update({
      where: { id },
      data: {
        title: data.title,
        subtitle: data.subtitle || null,
        type: data.type,
        contentJson: data.contentJson || null,
        displayOrder: data.displayOrder,
        isActive: data.isActive,
      },
    });
    revalidatePath("/");
    revalidatePath("/admin/homepage");
    return section;
  }

  static async deleteHomepageSection(id: string) {
    await prisma.homepageSection.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/admin/homepage");
  }

  // -------------------------------------------------------------
  // CMS PAGES
  // -------------------------------------------------------------
  static async getPages() {
    return prisma.page.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  static async getPageBySlug(slug: string) {
    return prisma.page.findUnique({
      where: { slug },
    });
  }

  static async createPage(data: CmsPageInput) {
    const page = await prisma.page.create({
      data: {
        title: data.title,
        slug: data.slug,
        content: data.content,
        seoTitle: data.seoTitle || null,
        seoDescription: data.seoDescription || null,
        isPublished: data.isPublished,
      },
    });
    revalidatePath(`/pages/${page.slug}`);
    revalidatePath("/admin/pages");
    return page;
  }

  static async updatePage(id: string, data: CmsPageInput) {
    const page = await prisma.page.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        content: data.content,
        seoTitle: data.seoTitle || null,
        seoDescription: data.seoDescription || null,
        isPublished: data.isPublished,
      },
    });
    revalidatePath(`/pages/${page.slug}`);
    revalidatePath("/admin/pages");
    return page;
  }

  static async deletePage(id: string) {
    await prisma.page.delete({ where: { id } });
    revalidatePath("/admin/pages");
  }

  // -------------------------------------------------------------
  // SHIPPING ZONES & RATES
  // -------------------------------------------------------------
  static async getShippingZones() {
    return prisma.shippingZone.findMany({
      include: { rates: true },
      orderBy: { name: "asc" },
    });
  }

  static async createShippingZone(data: ShippingZoneInput) {
    const zone = await prisma.shippingZone.create({
      data: {
        name: data.name,
        description: data.description || null,
        isActive: data.isActive,
      },
    });
    revalidatePath("/admin/shipping");
    return zone;
  }

  static async deleteShippingZone(id: string) {
    await prisma.shippingZone.delete({ where: { id } });
    revalidatePath("/admin/shipping");
  }

  static async createShippingRate(data: ShippingRateInput) {
    const rate = await prisma.shippingRate.create({
      data: {
        zoneId: data.zoneId,
        title: data.title,
        rateAmount: data.rateAmount,
        minOrderAmount: data.minOrderAmount || null,
        estimatedDays: data.estimatedDays || null,
        isActive: data.isActive,
      },
    });
    revalidatePath("/admin/shipping");
    return rate;
  }

  static async deleteShippingRate(id: string) {
    await prisma.shippingRate.delete({ where: { id } });
    revalidatePath("/admin/shipping");
  }

  // -------------------------------------------------------------
  // SITE SETTINGS
  // -------------------------------------------------------------
  static async getSiteSettings(): Promise<Record<string, string>> {
    const records = await prisma.siteSetting.findMany();
    const map: Record<string, string> = {};
    records.forEach((r) => {
      map[r.key] = r.value;
    });
    return map;
  }

  static async updateSiteSettings(settings: Record<string, string>) {
    for (const [key, value] of Object.entries(settings)) {
      await prisma.siteSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      });
    }
    revalidatePath("/", "layout");
    revalidatePath("/admin/settings");
  }
}
