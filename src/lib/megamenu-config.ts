export interface MegaMenuColumn {
  title: string;
  items: { name: string; slug: string }[];
}

export interface MegaMenuArrival {
  title: string;
  image: string;
  link: string;
}

export interface MegaMenuItem {
  id?: string;
  name: string;
  slug: string;
  viewAllText: string;
  viewAllLink: string;
  columns: MegaMenuColumn[];
  newArrivals: MegaMenuArrival[];
}

export const DEFAULT_MEGA_MENU_DATA: MegaMenuItem[] = [
  {
    name: "Men",
    slug: "mens",
    viewAllText: "View All Men →",
    viewAllLink: "/shop?gender=men",
    columns: [
      {
        title: "TOPWEAR",
        items: [
          { name: "Half Sleeve T-shirt", slug: "mens-tshirts" },
          { name: "Full Sleeve T-shirt", slug: "mens-full-sleeve" },
          { name: "Polo T-shirt", slug: "mens-polo" },
          { name: "Shirt", slug: "mens-shirts" },
          { name: "Panjabi", slug: "mens-panjabi" },
          { name: "Hoodie", slug: "mens-hoodies" },
          { name: "Jacket", slug: "mens-jackets" },
          { name: "Sweatshirt", slug: "mens-sweatshirt" },
        ],
      },
      {
        title: "BOTTOMWEAR",
        items: [
          { name: "Comfy Trouser", slug: "mens-joggers" },
          { name: "Sports Trouser", slug: "mens-joggers" },
          { name: "Jeans", slug: "mens-jeans" },
          { name: "Joggers", slug: "mens-joggers" },
          { name: "Cargo Pants", slug: "mens-pants" },
          { name: "Chino Pants", slug: "mens-pants" },
          { name: "Shorts", slug: "mens-shorts" },
          { name: "Pajama", slug: "mens-pajama" },
        ],
      },
      {
        title: "ACCESSORIES",
        items: [
          { name: "Face Mask", slug: "accessories" },
          { name: "Underwear", slug: "accessories" },
          { name: "Socks", slug: "accessories" },
          { name: "Wallet", slug: "accessories" },
          { name: "Belt", slug: "accessories" },
          { name: "Cap", slug: "accessories" },
        ],
      },
    ],
    newArrivals: [
      {
        title: "Sports Edition Shorts - Elys...",
        image: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=400&q=80",
        link: "/products/sports-edition-quick-dry-shorts-elysian",
      },
      {
        title: "Mens Premium Luxe Polo- Alti...",
        image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=400&q=80",
        link: "/products/mens-premium-luxe-polo-eastbound",
      },
      {
        title: "Premium Designer Edition Dou...",
        image: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=400&q=80",
        link: "/products/premium-designer-edition-double-pk-cotton-polo-eminent",
      },
      {
        title: "Mens Premium Casual Shirt -...",
        image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&q=80",
        link: "/products/pure-linen-long-sleeve-casual-shirt-olive-moss",
      },
    ],
  },
  {
    name: "Women",
    slug: "womens",
    viewAllText: "View All Women →",
    viewAllLink: "/shop?gender=women",
    columns: [
      {
        title: "WESTERN & ETHNIC",
        items: [
          { name: "Kurti Tunic And Tops", slug: "womens-kurtis" },
          { name: "T-Shirt", slug: "womens-tshirts" },
          { name: "Kurti", slug: "womens-kurtis" },
          { name: "Comfy Trouser", slug: "womens-pants" },
          { name: "3pc Salwar Kameez", slug: "womens-salwar-kameez" },
          { name: "Co-ords", slug: "womens-coords" },
          { name: "2pc Salwar Kameez", slug: "womens-salwar-kameez" },
          { name: "Pajamas", slug: "womens-pajamas" },
          { name: "Palazzo", slug: "womens-palazzo" },
          { name: "Shrug", slug: "womens-shrug" },
        ],
      },
    ],
    newArrivals: [
      {
        title: "Womens Premium Tunic - Solen...",
        image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&q=80",
        link: "/products/womens-premium-tunic-kurti-sylis",
      },
      {
        title: "Womens Premium Tunic - Farzi...",
        image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&q=80",
        link: "/products/womens-premium-salwar-kameez-harshiya",
      },
      {
        title: "Womens Premium Salwar Kameez...",
        image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&q=80",
        link: "/products/womens-premium-salwar-kameez-harshiya",
      },
      {
        title: "Womens Premium Tops - Fioros...",
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80",
        link: "/products/womens-premium-tunic-kurti-sylis",
      },
      {
        title: "Womens Premium Kurti - Nirma...",
        image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&q=80",
        link: "/products/embroidered-silk-viscose-kurti-crimson-royale",
      },
      {
        title: "Womens Premium Kurti - Arpan...",
        image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&q=80",
        link: "/products/embroidered-silk-viscose-kurti-crimson-royale",
      },
    ],
  },
  {
    name: "Teens",
    slug: "teens",
    viewAllText: "View All Teens →",
    viewAllLink: "/shop?gender=teens",
    columns: [
      {
        title: "TEENS CASUAL",
        items: [
          { name: "Drop Shoulder T-Shirts", slug: "mens-drop-shoulder" },
          { name: "Graphic T-Shirts", slug: "mens-tshirts" },
          { name: "Oversized Tees", slug: "mens-drop-shoulder" },
          { name: "Hoodies & Sweatshirts", slug: "mens-hoodies" },
        ],
      },
      {
        title: "BOTTOMWEAR",
        items: [
          { name: "Track Pants & Joggers", slug: "mens-joggers" },
          { name: "Cargo Pants", slug: "mens-pants" },
          { name: "Active Shorts", slug: "mens-shorts" },
          { name: "Denim Jeans", slug: "mens-jeans" },
        ],
      },
    ],
    newArrivals: [
      {
        title: "Urban Oversized Drop Shoulder",
        image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&q=80",
        link: "/products/urban-oversized-drop-shoulder-t-shirt-tokyo-cyber",
      },
      {
        title: "Mens Streetwear Drop Shoulder",
        image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&q=80",
        link: "/products/mens-streetwear-drop-shoulder-tshirt-sandstone",
      },
      {
        title: "Cut & Stitch Designer Edition",
        image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=400&q=80",
        link: "/products/cut-and-stitch-designer-edition-short-sleeve-tshirt",
      },
      {
        title: "Sports Edition Quick-Dry Shorts",
        image: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=400&q=80",
        link: "/products/sports-edition-quick-dry-shorts-elysian",
      },
    ],
  },
  {
    name: "Kids",
    slug: "kids",
    viewAllText: "View All Kids →",
    viewAllLink: "/shop?gender=kids",
    columns: [
      {
        title: "BOYS COLLECTION",
        items: [
          { name: "Cotton T-Shirts", slug: "kids-boys-tshirts" },
          { name: "Polo Shirts", slug: "kids-boys-polo" },
          { name: "Denim Shorts", slug: "kids-boys-shorts" },
          { name: "Festive Panjabi Sets", slug: "kids-boys-panjabi" },
        ],
      },
      {
        title: "GIRLS COLLECTION",
        items: [
          { name: "Frocks & Dresses", slug: "kids-girls-frocks" },
          { name: "Two Piece Sets", slug: "kids-girls-twopiece" },
          { name: "T-Shirts & Tops", slug: "kids-girls-tshirts" },
          { name: "Leggings & Pajamas", slug: "kids-girls-leggings" },
        ],
      },
    ],
    newArrivals: [
      {
        title: "Boys Printed Cotton Tee",
        image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&q=80",
        link: "/shop?gender=kids",
      },
      {
        title: "Kids Festive Panjabi Edition",
        image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&q=80",
        link: "/shop?gender=kids",
      },
      {
        title: "Girls Embroidered Frock",
        image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&q=80",
        link: "/shop?gender=kids",
      },
      {
        title: "Boys Active Play Shorts",
        image: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=400&q=80",
        link: "/shop?gender=kids",
      },
    ],
  },
  {
    name: "Sports",
    slug: "sports",
    viewAllText: "View All Sports →",
    viewAllLink: "/shop?category=sports-activewear",
    columns: [
      {
        title: "SPORTS ACTIVEWEAR",
        items: [
          { name: "Club Football Jerseys", slug: "sports-football-jerseys" },
          { name: "Quick-Dry Gym T-Shirts", slug: "sports-tshirts" },
          { name: "Running Shorts", slug: "sports-shorts" },
          { name: "Gym Vests & Tanks", slug: "sports-vests" },
          { name: "Sports Tracksuits", slug: "sports-tracksuits" },
        ],
      },
    ],
    newArrivals: [
      {
        title: "Real Madrid 26/27 Home Jersey",
        image: "https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=400&q=80",
        link: "/products/real-madrid-2627-home-jersey-player-edition",
      },
      {
        title: "Pro-Dry Performance Football Jersey",
        image: "https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=400&q=80",
        link: "/products/pro-dry-performance-football-jersey-madrid-gold",
      },
      {
        title: "Sports Edition Quick-Dry Shorts",
        image: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=400&q=80",
        link: "/products/sports-edition-quick-dry-shorts-elysian",
      },
      {
        title: "Sports Performance Training Tee",
        image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=400&q=80",
        link: "/products/mens-premium-luxe-polo-eastbound",
      },
    ],
  },
];

export function parseMegaMenuData(jsonString?: string | null): MegaMenuItem[] {
  if (!jsonString) return DEFAULT_MEGA_MENU_DATA;
  try {
    const parsed = JSON.parse(jsonString);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch {
    // Return default on error
  }
  return DEFAULT_MEGA_MENU_DATA;
}
