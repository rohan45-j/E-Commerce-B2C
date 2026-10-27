import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/shared/providers";

import { MarketingService } from "@/server/services/marketing.service";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  let siteTitle = "KinaKati | কেনাকাটা হোক আরও সহজ";
  let brandName = "KinaKati";
  let faviconUrl = "/favicon.ico";
  let ogImage = "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=1200&q=80";

  try {
    const settings = await MarketingService.getSiteSettings();
    if (settings["site_name"]) {
      brandName = settings["site_name"];
      siteTitle = `${settings["site_name"]} | Luxury & Fashion Store`;
    }
    if (settings["site_favicon"]) {
      faviconUrl = settings["site_favicon"];
    }
    if (settings["site_logo"]) {
      ogImage = settings["site_logo"];
    }
  } catch {
    // DB fallback during initial builds
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return {
    metadataBase: new URL(appUrl),
    title: {
      default: siteTitle,
      template: `%s | ${brandName}`,
    },
    description:
      "Leading direct-to-consumer fashion & lifestyle platform in Bangladesh. Cash on Delivery, bKash, and nationwide doorstep delivery.",
    keywords: [
      "Fabrilife",
      "Bangladesh online shopping",
      "Men fashion BD",
      "Polo t-shirts",
      "Kurti & Panjabi",
      "Cash on delivery BD",
    ],
    authors: [{ name: brandName }],
    creator: brandName,
    icons: {
      icon: faviconUrl,
      shortcut: faviconUrl,
      apple: faviconUrl,
    },
    openGraph: {
      type: "website",
      locale: "en_BD",
      url: appUrl,
      title: siteTitle,
      description:
        "Leading direct-to-consumer fashion & lifestyle platform in Bangladesh. Cash on Delivery, bKash, and nationwide doorstep delivery.",
      siteName: brandName,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: siteTitle,
      description:
        "Leading direct-to-consumer fashion & lifestyle platform in Bangladesh. Cash on Delivery, bKash, and nationwide doorstep delivery.",
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

import { extractThemeTokens, generateThemeCss } from "@/lib/theme-config";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let themeCss = "";
  try {
    const settings = await MarketingService.getSiteSettings();
    const tokens = extractThemeTokens(settings);
    themeCss = generateThemeCss(tokens);
  } catch {
    const tokens = extractThemeTokens({});
    themeCss = generateThemeCss(tokens);
  }

  return (
    <html
      lang="en"
      translate="no"
      className={`notranslate ${inter.variable}`}
      suppressHydrationWarning
    >
      <head>
        <meta name="google" content="notranslate" />
        <script
          id="react-dom-shield"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (typeof window === 'undefined') return;
                var origInsert = Node.prototype.insertBefore;
                Node.prototype.insertBefore = function(newNode, refNode) {
                  if (refNode && refNode.parentNode !== this) {
                    if (refNode.parentNode) {
                      return refNode.parentNode.insertBefore(newNode, refNode);
                    }
                    return this.appendChild(newNode);
                  }
                  return origInsert.call(this, newNode, refNode);
                };
                var origRemove = Node.prototype.removeChild;
                Node.prototype.removeChild = function(child) {
                  if (child && child.parentNode !== this) {
                    if (child.parentNode) {
                      return child.parentNode.removeChild(child);
                    }
                    return child;
                  }
                  return origRemove.call(this, child);
                };
              })();
            `,
          }}
        />
        <style
          id="dynamic-theme-styles"
          dangerouslySetInnerHTML={{ __html: themeCss }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="notranslate min-h-screen bg-background font-sans antialiased flex flex-col"
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
