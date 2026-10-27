import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

interface CMSPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CMSPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const page = await prisma.page.findUnique({ where: { slug } });
    if (!page) return { title: "Page Not Found" };
    return {
      title: page.seoTitle || `${page.title} | KinaKati Store`,
      description: page.seoDescription || `${page.title} policy and guidelines for KinaKati Store.`,
    };
  } catch {
    return { title: "Policy | KinaKati" };
  }
}

const DEFAULT_PAGES_FALLBACK: Record<string, { title: string; content: string }> = {
  "return-refund-policy": {
    title: "Return & Refund Policy",
    content: `
      <h2>1. 7-Day Hassle-Free Returns</h2>
      <p>At KinaKati Store, customer satisfaction is our highest priority. If you receive a product that is damaged, defective, or incorrect, you can request a return within 7 calendar days of delivery.</p>
      <h2>2. Eligibility for Returns</h2>
      <p>The item must be unused, unwashed, and in the exact condition that you received it, with all original tags, user manuals, accessories, and warranty cards intact.</p>
      <h2>3. Refund Processing</h2>
      <p>Once your return parcel is inspected at our Gulshan fulfillment center, your refund will be issued via bKash, Nagad, or direct bank transfer within 3 to 5 business days.</p>
    `,
  },
  "shipping-delivery-policy": {
    title: "Shipping & Delivery Policy",
    content: `
      <h2>1. Nationwide Delivery in Bangladesh</h2>
      <p>We deliver across all 64 districts in Bangladesh using our dedicated courier partners (Steadfast, Pathao, RedX, eCourier).</p>
      <h2>2. Delivery Timeline</h2>
      <p><strong>Inside Dhaka Metro:</strong> 24 to 48 hours.<br><strong>Outside Dhaka (Divisional & District towns):</strong> 48 to 72 hours.</p>
      <h2>3. Delivery Charges</h2>
      <p>Standard delivery charge inside Dhaka is ৳60 BDT. Outside Dhaka is ৳120 BDT. Orders over ৳10,000 qualify for FREE standard delivery.</p>
    `,
  },
  "terms-and-conditions": {
    title: "Terms and Conditions",
    content: `
      <h2>1. General Overview</h2>
      <p>By browsing, accessing, or placing orders on KinaKati Store, you agree to be bound by these Terms and Conditions and our Privacy Policy.</p>
      <h2>2. Order Acceptance and Pricing</h2>
      <p>All prices displayed are in Bangladeshi Taka (BDT) and are inclusive of VAT unless otherwise stated. We reserve the right to cancel or amend orders in the event of stock inaccuracies or pricing anomalies.</p>
    `,
  },
  "privacy-policy": {
    title: "Privacy Policy",
    content: `
      <h2>1. Information We Collect</h2>
      <p>We collect essential customer information such as name, mobile phone number, delivery address, and email for the purpose of fulfilling orders and delivering exceptional service.</p>
      <h2>2. Data Protection</h2>
      <p>We do not sell, rent, or trade your personal information to third parties. All payment processing is secured via PCI-DSS compliant gateways.</p>
    `,
  },
};

export default async function CMSPage({ params }: CMSPageProps) {
  const { slug } = await params;

  let pageData: { title: string; content: string; updatedAt?: Date } | null = null;

  try {
    const dbPage = await prisma.page.findUnique({
      where: { slug, isPublished: true },
    });
    if (dbPage) {
      pageData = {
        title: dbPage.title,
        content: dbPage.content,
        updatedAt: dbPage.updatedAt,
      };
    }
  } catch {
    // DB offline, fall through to fallback
  }

  if (!pageData && DEFAULT_PAGES_FALLBACK[slug]) {
    pageData = DEFAULT_PAGES_FALLBACK[slug];
  }

  if (!pageData) {
    notFound();
  }

  return (
    <div className="container py-8 md:py-16 max-w-4xl">
      <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground font-medium">{pageData.title}</span>
      </nav>

      <div className="space-y-6">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
          {pageData.title}
        </h1>
        {pageData.updatedAt && (
          <p className="text-xs text-muted-foreground">
            Last updated on {new Date(pageData.updatedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>
        )}

        <div
          className="prose dark:prose-invert max-w-none pt-6 border-t leading-relaxed"
          dangerouslySetInnerHTML={{ __html: pageData.content }}
        />
      </div>
    </div>
  );
}
