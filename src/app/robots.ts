import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://kinakati.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/shop", "/products/*", "/pages/*", "/contact", "/track-order"],
        disallow: [
          "/admin/*",
          "/account/*",
          "/api/*",
          "/cart",
          "/checkout",
          "/order-success",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
