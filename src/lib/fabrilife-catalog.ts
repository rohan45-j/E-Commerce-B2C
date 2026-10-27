export interface FabrilifeProduct {
  id: string;
  title: string;
  slug: string;
  sku: string;
  description: string;
  basePrice: number; // in poisha (e.g. 87500 = ৳875)
  compareAtPrice: number; // in poisha (e.g. 120000 = ৳1200)
  stock: number;
  gsm?: string;
  fabric?: string;
  fit?: string;
  images: { id: string; url: string; altText?: string; isPrimary: boolean }[];
  category: { id: string; name: string; slug: string };
  brand: { id: string; name: string };
  variants: {
    id: string;
    sku: string;
    title: string;
    price: number;
    compareAtPrice?: number;
    stock: number;
    options: Record<string, string>;
  }[];
  reviews: {
    id: string;
    rating: number;
    title?: string;
    comment: string;
    createdAt: string;
    user: { name: string };
  }[];
}

export const FABRILIFE_CATALOG: FabrilifeProduct[] = [
  {
    id: "fab-1",
    title: "Mens Premium Luxe Polo - Eastbound",
    slug: "mens-premium-luxe-polo-eastbound",
    sku: "POLO-LUX-001",
    description:
      "Crafted from 220 GSM 100% combed double PK compact cotton. Featuring a reinforced collar that never rolls, mother-of-pearl buttons, and reactive dye color fastness that maintains vibrance after dozens of washes. Ideal for everyday executive casual wear and weekend outings.",
    basePrice: 87500, // ৳875
    compareAtPrice: 120000, // ৳1200
    stock: 45,
    gsm: "220 GSM Double PK Cotton",
    fabric: "100% Combed Compact Cotton",
    fit: "Regular Fit (True to Asian Sizing)",
    images: [
      { id: "img-1a", url: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=1000&q=85", altText: "Front View", isPrimary: true },
      { id: "img-1b", url: "https://images.unsplash.com/photo-1625910513413-5a0a4c7e63b3?w=1000&q=85", altText: "Angle Detail", isPrimary: false },
      { id: "img-1c", url: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=1000&q=85", altText: "Collar Close-up", isPrimary: false },
      { id: "img-1d", url: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=1000&q=85", altText: "Fabric Texture", isPrimary: false },
    ],
    category: { id: "cat-polo", name: "Mens • Polo Shirts", slug: "mens-polo" },
    brand: { id: "br-luxe", name: "Fabrilife Luxe" },
    variants: [
      { id: "v-1-m", sku: "POLO-LUX-001-M", title: "M (Chest 38\")", price: 87500, compareAtPrice: 120000, stock: 15, options: { Size: "M" } },
      { id: "v-1-l", sku: "POLO-LUX-001-L", title: "L (Chest 40\")", price: 87500, compareAtPrice: 120000, stock: 18, options: { Size: "L" } },
      { id: "v-1-xl", sku: "POLO-LUX-001-XL", title: "XL (Chest 42\")", price: 87500, compareAtPrice: 120000, stock: 8, options: { Size: "XL" } },
      { id: "v-1-xxl", sku: "POLO-LUX-001-XXL", title: "XXL (Chest 44\")", price: 87500, compareAtPrice: 120000, stock: 4, options: { Size: "XXL" } },
    ],
    reviews: [
      {
        id: "r1-1",
        rating: 5,
        title: "Outstanding Fabric Quality!",
        comment: "Fabric feels super premium, collar stays stiff even after 3 washes. Size L fits perfectly on 5'9\" height. Highly recommended!",
        createdAt: "2026-03-12T10:00:00.000Z",
        user: { name: "Tanvir Ahmed" },
      },
      {
        id: "r1-2",
        rating: 5,
        title: "Exact Fabrilife fit",
        comment: "Delivered within 24 hours inside Dhaka. COD delivery boy was polite and gave me time to check the product.",
        createdAt: "2026-03-08T14:30:00.000Z",
        user: { name: "Shakil Mahmud" },
      },
      {
        id: "r1-3",
        rating: 4,
        title: "Comfortable and breathable",
        comment: "Great color and breathability in Dhaka summer weather. Will buy the Eminent edition next.",
        createdAt: "2026-02-28T09:15:00.000Z",
        user: { name: "Farhan Kabir" },
      },
    ],
  },
  {
    id: "fab-2",
    title: "Premium Designer Edition Double PK Cotton Polo - Eminent",
    slug: "premium-designer-edition-double-pk-cotton-polo-eminent",
    sku: "POLO-PK-002",
    description:
      "Exclusive two-tone woven tipping on collar and cuff with double-needle tailoring. Crafted from breathable 230 GSM organic cotton yarn treated with anti-pilling wash. Guaranteed color longevity under direct sunlight.",
    basePrice: 114000, // ৳1140
    compareAtPrice: 149000, // ৳1490
    stock: 38,
    gsm: "230 GSM Double PK Cotton",
    fabric: "100% Combed Compact Cotton with Silicone Softener",
    fit: "Tailored Smart Fit",
    images: [
      { id: "img-2a", url: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=1000&q=85", altText: "Front", isPrimary: true },
      { id: "img-2b", url: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=1000&q=85", altText: "Side", isPrimary: false },
      { id: "img-2c", url: "https://images.unsplash.com/photo-1625910513413-5a0a4c7e63b3?w=1000&q=85", altText: "Detail", isPrimary: false },
    ],
    category: { id: "cat-polo", name: "Mens • Polo Shirts", slug: "mens-polo" },
    brand: { id: "br-luxe", name: "Fabrilife Premium" },
    variants: [
      { id: "v-2-m", sku: "POLO-PK-002-M", title: "M (Chest 38\")", price: 114000, compareAtPrice: 149000, stock: 12, options: { Size: "M" } },
      { id: "v-2-l", sku: "POLO-PK-002-L", title: "L (Chest 40\")", price: 114000, compareAtPrice: 149000, stock: 14, options: { Size: "L" } },
      { id: "v-2-xl", sku: "POLO-PK-002-XL", title: "XL (Chest 42\")", price: 114000, compareAtPrice: 149000, stock: 8, options: { Size: "XL" } },
      { id: "v-2-xxl", sku: "POLO-PK-002-XXL", title: "XXL (Chest 44\")", price: 114000, compareAtPrice: 149000, stock: 4, options: { Size: "XXL" } },
    ],
    reviews: [
      {
        id: "r2-1",
        rating: 5,
        title: "Very classy collar design",
        comment: "The contrast tipping collar gives it a high-end designer look. Worth every taka.",
        createdAt: "2026-03-14T11:20:00.000Z",
        user: { name: "Mahfuzur Rahman" },
      },
    ],
  },
  {
    id: "fab-3",
    title: "Cut & Stitch Designer Edition Short Sleeve T-Shirt - Obsidian",
    slug: "cut-and-stitch-designer-edition-short-sleeve-tshirt",
    sku: "TSH-CS-003",
    description:
      "Bold geometric panel cut & sewn with precision flatlock seams. 185 GSM 100% ring-spun organic cotton with bio-wash finish for an ultra-soft cloud-like handfeel.",
    basePrice: 58000, // ৳580
    compareAtPrice: 75000, // ৳750
    stock: 52,
    gsm: "185 GSM Organic Ring-Spun Cotton",
    fabric: "100% Combed Cotton Bio-Washed",
    fit: "Regular Modern Fit",
    images: [
      { id: "img-3a", url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1000&q=85", altText: "Front", isPrimary: true },
      { id: "img-3b", url: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1000&q=85", altText: "Angle", isPrimary: false },
    ],
    category: { id: "cat-tshirt", name: "Mens • T-Shirts", slug: "mens-tshirts" },
    brand: { id: "br-street", name: "Fabrilife Street" },
    variants: [
      { id: "v-3-m", sku: "TSH-CS-003-M", title: "M (Chest 38\")", price: 58000, compareAtPrice: 75000, stock: 20, options: { Size: "M" } },
      { id: "v-3-l", sku: "TSH-CS-003-L", title: "L (Chest 40\")", price: 58000, compareAtPrice: 75000, stock: 18, options: { Size: "L" } },
      { id: "v-3-xl", sku: "TSH-CS-003-XL", title: "XL (Chest 42\")", price: 58000, compareAtPrice: 75000, stock: 10, options: { Size: "XL" } },
      { id: "v-3-xxl", sku: "TSH-CS-003-XXL", title: "XXL (Chest 44\")", price: 58000, compareAtPrice: 75000, stock: 4, options: { Size: "XXL" } },
    ],
    reviews: [
      {
        id: "r3-1",
        rating: 5,
        title: "Super soft tee",
        comment: "Color does not fade, stitching is top-notch. Love this brand!",
        createdAt: "2026-03-01T16:00:00.000Z",
        user: { name: "Raihan Chowdhury" },
      },
    ],
  },
  {
    id: "fab-4",
    title: "Mens Streetwear Drop Shoulder T-Shirt - Sandstone",
    slug: "mens-streetwear-drop-shoulder-tshirt-sandstone",
    sku: "TSH-DRP-004",
    description:
      "Modern relaxed silhouette with dropped shoulders and a boxy urban drape. Heavyweight 210 GSM combed cotton that holds its structure throughout the day without clinging.",
    basePrice: 65000, // ৳650
    compareAtPrice: 85000, // ৳850
    stock: 35,
    gsm: "210 GSM Heavyweight Jersey",
    fabric: "100% Combed Cotton",
    fit: "Oversized / Boxy Drop Shoulder",
    images: [
      { id: "img-4a", url: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1000&q=85", altText: "Front", isPrimary: true },
      { id: "img-4b", url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1000&q=85", altText: "Detail", isPrimary: false },
    ],
    category: { id: "cat-drop", name: "Mens • Drop Shoulder", slug: "mens-drop-shoulder" },
    brand: { id: "br-street", name: "Fabrilife Street" },
    variants: [
      { id: "v-4-m", sku: "TSH-DRP-004-M", title: "M (Chest 40\" Oversized)", price: 65000, compareAtPrice: 85000, stock: 10, options: { Size: "M" } },
      { id: "v-4-l", sku: "TSH-DRP-004-L", title: "L (Chest 42\" Oversized)", price: 65000, compareAtPrice: 85000, stock: 15, options: { Size: "L" } },
      { id: "v-4-xl", sku: "TSH-DRP-004-XL", title: "XL (Chest 44\" Oversized)", price: 65000, compareAtPrice: 85000, stock: 10, options: { Size: "XL" } },
    ],
    reviews: [
      {
        id: "r4-1",
        rating: 5,
        title: "Exact trendy drop shoulder cut",
        comment: "Great streetwear silhouette, heavy cotton without being hot.",
        createdAt: "2026-03-10T12:00:00.000Z",
        user: { name: "Zubair Hasan" },
      },
    ],
  },
  {
    id: "fab-5",
    title: "Urban Oversized Drop Shoulder T-Shirt - Tokyo Cyber",
    slug: "urban-oversized-drop-shoulder-t-shirt-tokyo-cyber",
    sku: "TEE-OVR-003",
    description:
      "Futuristic minimalist chest print with back typography. 210 GSM combed cotton treated for optimal airflow and wrinkle resistance.",
    basePrice: 65000, // ৳650
    compareAtPrice: 90000, // ৳900
    stock: 45,
    gsm: "210 GSM Combed Cotton",
    fabric: "100% Combed Compact Cotton",
    fit: "Oversized Fit",
    images: [
      { id: "img-5a", url: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1000&q=85", altText: "Tokyo Cyber", isPrimary: true },
      { id: "img-5b", url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1000&q=85", altText: "Tokyo Cyber Back", isPrimary: false },
    ],
    category: { id: "cat-drop", name: "Mens • Drop Shoulder", slug: "mens-drop-shoulder" },
    brand: { id: "br-street", name: "Fabrilife Street" },
    variants: [
      { id: "v-5-m", sku: "TEE-OVR-003-M", title: "M (Chest 40\")", price: 65000, compareAtPrice: 90000, stock: 12, options: { Size: "M" } },
      { id: "v-5-l", sku: "TEE-OVR-003-L", title: "L (Chest 42\")", price: 65000, compareAtPrice: 90000, stock: 16, options: { Size: "L" } },
      { id: "v-5-xl", sku: "TEE-OVR-003-XL", title: "XL (Chest 44\")", price: 65000, compareAtPrice: 90000, stock: 12, options: { Size: "XL" } },
    ],
    reviews: [
      {
        id: "r5-1",
        rating: 5,
        title: "Cyber print is fire!",
        comment: "Print does not crack or peel after multiple washes. Loved it.",
        createdAt: "2026-03-05T18:00:00.000Z",
        user: { name: "Anisul Haque" },
      },
    ],
  },
  {
    id: "fab-6",
    title: "Pure Linen Long Sleeve Casual Shirt - Olive Moss",
    slug: "pure-linen-long-sleeve-casual-shirt-olive-moss",
    sku: "SHR-LIN-004",
    description:
      "Spun from 100% natural European flax linen fibers. Breathable, sweat-wicking, with subtle textured slub weave. Finished with tonal horn buttons and curved shirt hem.",
    basePrice: 145000, // ৳1450
    compareAtPrice: 195000, // ৳1950
    stock: 25,
    gsm: "165 GSM Pure Natural Linen",
    fabric: "100% European Flax Linen",
    fit: "Relaxed Casual Fit",
    images: [
      { id: "img-6a", url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=1000&q=85", altText: "Olive Moss Shirt", isPrimary: true },
      { id: "img-6b", url: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=1000&q=85", altText: "Collar and buttons", isPrimary: false },
    ],
    category: { id: "cat-shirt", name: "Mens • Casual Shirts", slug: "mens-shirts" },
    brand: { id: "br-luxe", name: "Fabrilife Luxe" },
    variants: [
      { id: "v-6-m", sku: "SHR-LIN-004-M", title: "M (Chest 39\")", price: 145000, compareAtPrice: 195000, stock: 8, options: { Size: "M" } },
      { id: "v-6-l", sku: "SHR-LIN-004-L", title: "L (Chest 41\")", price: 145000, compareAtPrice: 195000, stock: 10, options: { Size: "L" } },
      { id: "v-6-xl", sku: "SHR-LIN-004-XL", title: "XL (Chest 43\")", price: 145000, compareAtPrice: 195000, stock: 5, options: { Size: "XL" } },
    ],
    reviews: [
      {
        id: "r6-1",
        rating: 5,
        title: "Pure linen, exceptional comfort",
        comment: "Keeps you cool throughout humid summer days in Dhaka. Looks very executive.",
        createdAt: "2026-03-02T10:00:00.000Z",
        user: { name: "Nafis Imtiaz" },
      },
    ],
  },
  {
    id: "fab-7",
    title: "Womens Premium Tunic & Kurti - Sylis Edition",
    slug: "womens-premium-tunic-kurti-sylis",
    sku: "KRT-SYL-005",
    description:
      "Contemporary A-line kurti crafted with pure viscose cotton blend with intricate geometric neckline motif and lace sleeve detailing. Ultra-breathable and wrinkle resistant.",
    basePrice: 99000, // ৳990
    compareAtPrice: 150000, // ৳1500
    stock: 22,
    gsm: "170 GSM Viscose Cotton",
    fabric: "Viscose Cotton Blend",
    fit: "A-Line Regular Fit",
    images: [
      { id: "img-7a", url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1000&q=85", altText: "Sylis Kurti", isPrimary: true },
      { id: "img-7b", url: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=1000&q=85", altText: "Detail", isPrimary: false },
    ],
    category: { id: "cat-women", name: "Womens • Kurti & Tops", slug: "womens-kurtis" },
    brand: { id: "br-woman", name: "Fabrilife Woman" },
    variants: [
      { id: "v-7-36", sku: "KRT-SYL-005-36", title: "36 (Chest 36\")", price: 99000, compareAtPrice: 150000, stock: 6, options: { Size: "36" } },
      { id: "v-7-38", sku: "KRT-SYL-005-38", title: "38 (Chest 38\")", price: 99000, compareAtPrice: 150000, stock: 8, options: { Size: "38" } },
      { id: "v-7-40", sku: "KRT-SYL-005-40", title: "40 (Chest 40\")", price: 99000, compareAtPrice: 150000, stock: 5, options: { Size: "40" } },
      { id: "v-7-42", sku: "KRT-SYL-005-42", title: "42 (Chest 42\")", price: 99000, compareAtPrice: 150000, stock: 3, options: { Size: "42" } },
    ],
    reviews: [
      {
        id: "r7-1",
        rating: 5,
        title: "Beautiful fitting and color",
        comment: "Color matches the photos exactly. Perfect for office and university.",
        createdAt: "2026-03-07T15:20:00.000Z",
        user: { name: "Nusrat Jahan" },
      },
    ],
  },
  {
    id: "fab-8",
    title: "Womens Premium Salwar Kameez [2pcs] - Harshiya",
    slug: "womens-premium-salwar-kameez-harshiya",
    sku: "SK-HAR-006",
    description:
      "Opulent 2-piece set featuring embroidered kameez and matching tailored trouser. Crafted from breathable lawn fabric with organza sleeve trims and pearl accents.",
    basePrice: 249000, // ৳2490
    compareAtPrice: 350000, // ৳3500
    stock: 18,
    gsm: "Premium Lawn Fabric",
    fabric: "100% Pure Mercerized Cotton",
    fit: "Comfort Traditional Fit",
    images: [
      { id: "img-8a", url: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=1000&q=85", altText: "Harshiya Set", isPrimary: true },
      { id: "img-8b", url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1000&q=85", altText: "Neckline", isPrimary: false },
    ],
    category: { id: "cat-salwar", name: "Womens • Salwar Kameez", slug: "womens-salwar-kameez" },
    brand: { id: "br-woman", name: "Fabrilife Woman" },
    variants: [
      { id: "v-8-s", sku: "SK-HAR-006-S", title: "S (36)", price: 249000, compareAtPrice: 350000, stock: 4, options: { Size: "S" } },
      { id: "v-8-m", sku: "SK-HAR-006-M", title: "M (38)", price: 249000, compareAtPrice: 350000, stock: 6, options: { Size: "M" } },
      { id: "v-8-l", sku: "SK-HAR-006-L", title: "L (40)", price: 249000, compareAtPrice: 350000, stock: 5, options: { Size: "L" } },
      { id: "v-8-xl", sku: "SK-HAR-006-XL", title: "XL (42)", price: 249000, compareAtPrice: 350000, stock: 3, options: { Size: "XL" } },
    ],
    reviews: [
      {
        id: "r8-1",
        rating: 5,
        title: "Exceeded my expectations",
        comment: "Embroidery is so clean and elegant. Got so many compliments during Eid!",
        createdAt: "2026-03-11T19:00:00.000Z",
        user: { name: "Sadia Afrin" },
      },
    ],
  },
  {
    id: "fab-9",
    title: "Real Madrid 26/27 Home Jersey - Player Edition",
    slug: "real-madrid-2627-home-jersey-player-edition",
    sku: "JER-RMA-007",
    description:
      "AeroReady moisture-absorbing fabric engineered for championship performance. Heat-applied metallic gold club crest, ribbed collar, and laser-perforated ventilation panels.",
    basePrice: 115000, // ৳1150
    compareAtPrice: 150000, // ৳1500
    stock: 30,
    gsm: "160 GSM Pro-Dry Microfiber",
    fabric: "100% Recycled Poly-AeroReady",
    fit: "Athletic Slim Fit",
    images: [
      { id: "img-9a", url: "https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=1000&q=85", altText: "Real Madrid Jersey", isPrimary: true },
    ],
    category: { id: "cat-sports", name: "Sports • Jersey", slug: "sports-activewear" },
    brand: { id: "br-sports", name: "Fabrilife Sports" },
    variants: [
      { id: "v-9-m", sku: "JER-RMA-007-M", title: "M (Chest 38\")", price: 115000, compareAtPrice: 150000, stock: 10, options: { Size: "M" } },
      { id: "v-9-l", sku: "JER-RMA-007-L", title: "L (Chest 40\")", price: 115000, compareAtPrice: 150000, stock: 12, options: { Size: "L" } },
      { id: "v-9-xl", sku: "JER-RMA-007-XL", title: "XL (Chest 42\")", price: 115000, compareAtPrice: 150000, stock: 8, options: { Size: "XL" } },
    ],
    reviews: [
      {
        id: "r9-1",
        rating: 5,
        title: "Player version quality is insane",
        comment: "Badge is heat pressed, breathable side mesh. Hala Madrid!",
        createdAt: "2026-03-04T13:45:00.000Z",
        user: { name: "Shakib Al Hasan" },
      },
    ],
  },
  {
    id: "fab-10",
    title: "Sports Edition Quick-Dry Shorts - Elysian",
    slug: "sports-edition-quick-dry-shorts-elysian",
    sku: "SHR-ELY-008",
    description:
      "4-way stretch active fabric with zippered deep pocket storage. Built for gym, running, and casual lounge comfort. Moisture-wicking inner mesh.",
    basePrice: 48000, // ৳480
    compareAtPrice: 65000, // ৳650
    stock: 40,
    gsm: "140 GSM 4-Way Stretch Poly-Spandex",
    fabric: "92% Polyester, 8% Spandex",
    fit: "Athletic 7\" Inseam",
    images: [
      { id: "img-10a", url: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=1000&q=85", altText: "Elysian Shorts", isPrimary: true },
    ],
    category: { id: "cat-shorts", name: "Mens • Active Shorts", slug: "mens-shorts" },
    brand: { id: "br-sports", name: "Fabrilife Sports" },
    variants: [
      { id: "v-10-m", sku: "SHR-ELY-008-M", title: "M (Waist 30-32\")", price: 48000, compareAtPrice: 65000, stock: 15, options: { Size: "M" } },
      { id: "v-10-l", sku: "SHR-ELY-008-L", title: "L (Waist 32-34\")", price: 48000, compareAtPrice: 65000, stock: 15, options: { Size: "L" } },
      { id: "v-10-xl", sku: "SHR-ELY-008-XL", title: "XL (Waist 34-36\")", price: 48000, compareAtPrice: 65000, stock: 10, options: { Size: "XL" } },
    ],
    reviews: [
      {
        id: "r10-1",
        rating: 5,
        title: "Best running shorts",
        comment: "Zipped pockets keep my phone safe while running. Fabric dries instantly.",
        createdAt: "2026-03-09T08:30:00.000Z",
        user: { name: "Rakibul Islam" },
      },
    ],
  },
  {
    id: "fab-11",
    title: "Pro-Dry Performance Football Jersey - Madrid Gold",
    slug: "pro-dry-performance-football-jersey-madrid-gold",
    sku: "JER-MAD-009",
    description:
      "High-ventilation honeycomb mesh knit. Sublimated fade-proof graphics, quick dry moisture management, and non-restrictive raglan cut sleeves.",
    basePrice: 95000, // ৳950
    compareAtPrice: 135000, // ৳1350
    stock: 28,
    gsm: "160 GSM Pro-Dry Mesh",
    fabric: "100% Breathable Microfiber",
    fit: "Regular Fan Edition",
    images: [
      { id: "img-11a", url: "https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=1000&q=85", altText: "Madrid Gold Jersey", isPrimary: true },
    ],
    category: { id: "cat-sports", name: "Sports • Jersey", slug: "sports-activewear" },
    brand: { id: "br-sports", name: "Fabrilife Sports" },
    variants: [
      { id: "v-11-m", sku: "JER-MAD-009-M", title: "M (Chest 38\")", price: 95000, compareAtPrice: 135000, stock: 10, options: { Size: "M" } },
      { id: "v-11-l", sku: "JER-MAD-009-L", title: "L (Chest 40\")", price: 95000, compareAtPrice: 135000, stock: 10, options: { Size: "L" } },
      { id: "v-11-xl", sku: "JER-MAD-009-XL", title: "XL (Chest 42\")", price: 95000, compareAtPrice: 135000, stock: 8, options: { Size: "XL" } },
    ],
    reviews: [
      {
        id: "r11-1",
        rating: 5,
        title: "Brilliant jersey",
        comment: "Very comfortable for football matches on turf.",
        createdAt: "2026-03-03T11:00:00.000Z",
        user: { name: "Arafat Hossain" },
      },
    ],
  },
  {
    id: "fab-12",
    title: "Embroidered Silk Viscose Kurti - Crimson Royale",
    slug: "embroidered-silk-viscose-kurti-crimson-royale",
    sku: "KRT-CRM-010",
    description:
      "Vibrant jewel-toned crimson viscose kurti adorned with zari needlework and sequin embellishments along the neckline and cuffs. Pair with palazzo or cigarette pants.",
    basePrice: 185000, // ৳1850
    compareAtPrice: 245000, // ৳2450
    stock: 20,
    gsm: "180 GSM Silk Viscose",
    fabric: "Silk Viscose Blend",
    fit: "Straight Cut Comfort Fit",
    images: [
      { id: "img-12a", url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1000&q=85", altText: "Crimson Royale Kurti", isPrimary: true },
    ],
    category: { id: "cat-women", name: "Womens • Kurti & Tops", slug: "womens-kurtis" },
    brand: { id: "br-woman", name: "Fabrilife Woman" },
    variants: [
      { id: "v-12-36", sku: "KRT-CRM-010-36", title: "36 (Chest 36\")", price: 185000, compareAtPrice: 245000, stock: 5, options: { Size: "36" } },
      { id: "v-12-38", sku: "KRT-CRM-010-38", title: "38 (Chest 38\")", price: 185000, compareAtPrice: 245000, stock: 8, options: { Size: "38" } },
      { id: "v-12-40", sku: "KRT-CRM-010-40", title: "40 (Chest 40\")", price: 185000, compareAtPrice: 245000, stock: 5, options: { Size: "40" } },
      { id: "v-12-42", sku: "KRT-CRM-010-42", title: "42 (Chest 42\")", price: 185000, compareAtPrice: 245000, stock: 2, options: { Size: "42" } },
    ],
    reviews: [
      {
        id: "r12-1",
        rating: 5,
        title: "Royal Crimson Shade!",
        comment: "Rich festive look without being excessively heavy. Perfect stitching.",
        createdAt: "2026-03-06T17:10:00.000Z",
        user: { name: "Mehnaz Parveen" },
      },
    ],
  },
];

export function getFabrilifeProductBySlug(slug: string): FabrilifeProduct | null {
  const normalizedSlug = slug.toLowerCase().trim();
  const found = FABRILIFE_CATALOG.find(
    (p) => p.slug.toLowerCase() === normalizedSlug || p.id.toLowerCase() === normalizedSlug
  );
  if (found) return found;

  // Fallback fuzzy search by keyword or return first item if slug matches nothing
  const fuzzy = FABRILIFE_CATALOG.find(
    (p) =>
      normalizedSlug.includes(p.slug) ||
      p.slug.includes(normalizedSlug) ||
      p.title.toLowerCase().includes(normalizedSlug)
  );

  return fuzzy || FABRILIFE_CATALOG[0]; // Never return 404 for demo preview
}

export function getRelatedFabrilifeProducts(currentSlug: string, count: number = 4): FabrilifeProduct[] {
  return FABRILIFE_CATALOG.filter((p) => p.slug !== currentSlug).slice(0, count);
}
