import { PrismaClient, Role, ProductStatus, CouponType, BannerPlacement, SectionType, PaymentMethod } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Dhaka Premium E-Commerce Database Seeding...");

  // 1. Clean existing records (in order of relations)
  console.log("🧹 Clearing old database records...");
  await prisma.orderStatusHistory.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.shipment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.review.deleteMany();
  await prisma.productTag.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.category.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.promotion.deleteMany();
  await prisma.banner.deleteMany();
  await prisma.homepageSection.deleteMany();
  await prisma.shippingRate.deleteMany();
  await prisma.shippingZone.deleteMany();
  await prisma.page.deleteMany();
  await prisma.siteSetting.deleteMany();
  await prisma.redirect.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.contactMessage.deleteMany();
  await prisma.newsletterSubscriber.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  // 2. Seed Users
  console.log("👤 Creating Admin and Customer users...");
  const adminPassword = process.env.ADMIN_PASSWORD || "ChangeMe123!@#";
  const adminHashedPassword = await bcrypt.hash(adminPassword, 10);
  const customerHashedPassword = await bcrypt.hash("Customer123!@#", 10);

  const adminUser = await prisma.user.create({
    data: {
      name: process.env.ADMIN_NAME || "System Administrator",
      email: process.env.ADMIN_EMAIL || "admin@example.com",
      passwordHash: adminHashedPassword,
      phone: "+8801700000001",
      role: Role.ADMIN,
      emailVerified: new Date(),
    },
  });

  const staffUser = await prisma.user.create({
    data: {
      name: "Dhaka Fulfillment Staff",
      email: "staff@example.com",
      passwordHash: await bcrypt.hash("Staff123!@#", 10),
      phone: "+8801700000002",
      role: Role.STAFF,
      emailVerified: new Date(),
    },
  });

  const demoCustomer = await prisma.user.create({
    data: {
      name: "Tanvir Ahmed",
      email: "customer@example.com",
      passwordHash: customerHashedPassword,
      phone: "+8801712345678",
      role: Role.CUSTOMER,
      emailVerified: new Date(),
      addresses: {
        create: [
          {
            recipientName: "Tanvir Ahmed",
            phone: "+8801712345678",
            division: "Dhaka",
            district: "Dhaka",
            upazila: "Dhanmondi",
            addressLine: "House 42, Road 9/A, Dhanmondi R/A",
            deliveryInstructions: "Call before delivery, 4th floor",
            isDefaultShipping: true,
            isDefaultBilling: true,
          },
        ],
      },
    },
  });

  console.log(`✅ Admin created: ${adminUser.email}`);
  console.log(`✅ Demo customer created: ${demoCustomer.email}`);

  // 3. Seed Categories
  console.log("📂 Creating categories...");
  const mensCategory = await prisma.category.create({
    data: {
      name: "Men's Fashion",
      slug: "mens-fashion",
      description: "Premium panjabis, polo shirts, suits, and everyday menswear",
      imageUrl: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&q=80",
      displayOrder: 1,
      seoTitle: "Men's Fashion Online | Dhaka Premium Store",
      seoDescription: "Shop authentic men's clothing, panjabi, shirts, and casual wear in Bangladesh.",
      children: {
        create: [
          { name: "Panjabi & Festive", slug: "mens-panjabi", displayOrder: 1 },
          { name: "Shirts & Polos", slug: "mens-shirts", displayOrder: 2 },
          { name: "Footwear & Shoes", slug: "mens-shoes", displayOrder: 3 },
        ],
      },
    },
  });

  const womensCategory = await prisma.category.create({
    data: {
      name: "Women's Fashion",
      slug: "womens-fashion",
      description: "Designer sarees, kurtis, shalwar kameez, and accessories",
      imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80",
      displayOrder: 2,
      seoTitle: "Women's Ethnic & Western Wear | Bangladesh",
      seoDescription: "Explore designer sarees, kurtis, three-piece sets, and formal women's fashion.",
      children: {
        create: [
          { name: "Sarees & Traditional", slug: "womens-sarees", displayOrder: 1 },
          { name: "Kurtis & Tunics", slug: "womens-kurtis", displayOrder: 2 },
          { name: "Bags & Leather", slug: "womens-bags", displayOrder: 3 },
        ],
      },
    },
  });

  const electronicsCategory = await prisma.category.create({
    data: {
      name: "Electronics & Gadgets",
      slug: "electronics-gadgets",
      description: "Original smartphones, wireless earbuds, smartwatches, and accessories",
      imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
      displayOrder: 3,
      seoTitle: "Smart Gadgets & Electronics in Dhaka",
      seoDescription: "Authentic electronics with official brand warranty in Bangladesh.",
      children: {
        create: [
          { name: "Audio & Headphones", slug: "audio-headphones", displayOrder: 1 },
          { name: "Smartwatches & Wearables", slug: "smartwatches", displayOrder: 2 },
          { name: "Power Banks & Cables", slug: "power-cables", displayOrder: 3 },
        ],
      },
    },
  });

  const homeLivingCategory = await prisma.category.create({
    data: {
      name: "Home & Living",
      slug: "home-living",
      description: "Handcrafted decor, bed linens, cookware, and modern interior accents",
      imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80",
      displayOrder: 4,
    },
  });

  // 4. Seed Brands
  console.log("🏷️ Creating brands...");
  const brands = await Promise.all([
    prisma.brand.create({
      data: {
        name: "Aarong Heritage",
        slug: "aarong-heritage",
        description: "Finest artisanal hand-loomed fashion and heritage craft of Bengal.",
        logoUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=300&q=80",
      },
    }),
    prisma.brand.create({
      data: {
        name: "Apex Footwear",
        slug: "apex-footwear",
        description: "Genuine leather shoes and premium comfort footwear.",
        logoUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&q=80",
      },
    }),
    prisma.brand.create({
      data: {
        name: "Yellow Lifestyle",
        slug: "yellow-lifestyle",
        description: "Contemporary trendy apparel and urban streetwear.",
        logoUrl: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=300&q=80",
      },
    }),
    prisma.brand.create({
      data: {
        name: "Walton Prime",
        slug: "walton-prime",
        description: "Trusted Bangladeshi electronics, home appliances, and smart tech.",
        logoUrl: "https://images.unsplash.com/photo-1588508065123-287b28e013da?w=300&q=80",
      },
    }),
    prisma.brand.create({
      data: {
        name: "Samsung Bangladesh",
        slug: "samsung-bangladesh",
        description: "Official Samsung audio, wearables, and smartphones.",
        logoUrl: "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=300&q=80",
      },
    }),
  ]);

  const [aarong, apex, yellow, walton, samsung] = brands;

  // 5. Seed Tags
  console.log("🔖 Creating tags...");
  const tagEid = await prisma.tag.create({ data: { name: "Eid Collection", slug: "eid-collection" } });
  const tagTrending = await prisma.tag.create({ data: { name: "Trending", slug: "trending" } });
  const tagPremium = await prisma.tag.create({ data: { name: "Premium Leather", slug: "premium-leather" } });
  const tagOrganic = await prisma.tag.create({ data: { name: "100% Cotton", slug: "100-cotton" } });

  // 6. Seed 20 Realistic Demo Products
  console.log("📦 Creating 20 demo products with images, variants, and stock...");

  interface RawVariant {
    title: string;
    size?: string;
    color?: string;
    sku: string;
    stock: number;
  }

  interface RawProduct {
    title: string;
    slug: string;
    shortDesc: string;
    description: string;
    basePrice: number;
    compareAtPrice?: number;
    costPrice: number;
    sku: string;
    stock: number;
    isFeatured?: boolean;
    isNewArrival?: boolean;
    isBestSeller?: boolean;
    categoryId: string;
    brandId: string;
    images: string[];
    variants: RawVariant[];
  }

  const rawProducts: RawProduct[] = [
    {
      title: "Royal Embroidered Silk Panjabi - Midnight Navy",
      slug: "royal-embroidered-silk-panjabi-navy",
      shortDesc: "Handcrafted pure silk Panjabi featuring exquisite thread embroidery along collar and placket.",
      description: "Crafted for festive moments and weddings. Made from 100% fine mulberry silk with intricate tonal embroidery. Tailored fit with side pockets and mother-of-pearl buttons.",
      basePrice: 585000, // ৳ 5,850.00
      compareAtPrice: 650000, // ৳ 6,500.00
      costPrice: 320000,
      sku: "PAN-ROY-001",
      stock: 45,
      isFeatured: true,
      isBestSeller: true,
      categoryId: mensCategory.id,
      brandId: aarong.id,
      images: [
        "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=900&q=80",
        "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=900&q=80",
      ],
      variants: [
        { title: "Size 40 / Navy", size: "40", color: "Navy", sku: "PAN-ROY-001-40", stock: 15 },
        { title: "Size 42 / Navy", size: "42", color: "Navy", sku: "PAN-ROY-001-42", stock: 20 },
        { title: "Size 44 / Navy", size: "44", color: "Navy", sku: "PAN-ROY-001-44", stock: 10 },
      ],
    },
    {
      title: "Handloom Jamdani Saree - Crimson Heritage Gold",
      slug: "handloom-jamdani-saree-crimson",
      shortDesc: "Authentic Dhakai Jamdani hand-woven with fine cotton and intricate gold zari motifs.",
      description: "A testament to centuries of Bengali weaving artistry. Handcrafted by master weavers in Sonargaon, taking over 45 days. Comes with verified authenticity certificate and matching blouse piece.",
      basePrice: 1450000, // ৳ 14,500.00
      compareAtPrice: 1680000,
      costPrice: 900000,
      sku: "SAR-JAM-002",
      stock: 12,
      isFeatured: true,
      isBestSeller: true,
      categoryId: womensCategory.id,
      brandId: aarong.id,
      images: [
        "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=900&q=80",
        "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=900&q=80",
      ],
      variants: [
        { title: "Standard Free Size", size: "Free Size", color: "Crimson Gold", sku: "SAR-JAM-002-STD", stock: 12 },
      ],
    },
    {
      title: "Handcrafted Full-Grain Leather Chelsea Boots",
      slug: "handcrafted-leather-chelsea-boots-brown",
      shortDesc: "Imported full-grain calfskin leather boots with durable Goodyear welted sole.",
      description: "Sophisticated styling meets enduring comfort. Breathable leather lining, elastic side gussets for easy slip-on wear, and shock-absorbing crepe rubber outsole.",
      basePrice: 620000, // ৳ 6,200.00
      compareAtPrice: 750000,
      costPrice: 380000,
      sku: "SH-CHE-003",
      stock: 28,
      isFeatured: true,
      categoryId: mensCategory.id,
      brandId: apex.id,
      images: [
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&q=80",
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=900&q=80",
      ],
      variants: [
        { title: "EU 40 / Cognac Brown", size: "EU 40", color: "Cognac Brown", sku: "SH-CHE-003-40", stock: 8 },
        { title: "EU 41 / Cognac Brown", size: "EU 41", color: "Cognac Brown", sku: "SH-CHE-003-41", stock: 10 },
        { title: "EU 42 / Cognac Brown", size: "EU 42", color: "Cognac Brown", sku: "SH-CHE-003-42", stock: 10 },
      ],
    },
    {
      title: "Noise Cancelling Wireless Hi-Res Headphones ANC-900",
      slug: "wireless-anc-headphones-titanium",
      shortDesc: "Active Noise Cancellation, 40-hour battery life, and crystal-clear LDAC audio codec.",
      description: "Block out Dhaka traffic and immerse yourself in studio-quality sound. Features 40mm titanium diaphragm drivers, dual-mic ENC for crystal clear calls, and ultra-plush memory foam earpads.",
      basePrice: 890000, // ৳ 8,900.00
      compareAtPrice: 1050000,
      costPrice: 550000,
      sku: "AUD-ANC-004",
      stock: 35,
      isFeatured: true,
      categoryId: electronicsCategory.id,
      brandId: samsung.id,
      images: [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&q=80",
        "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=900&q=80",
      ],
      variants: [
        { title: "Midnight Black", color: "Black", sku: "AUD-ANC-004-BLK", stock: 20 },
        { title: "Silver Titanium", color: "Silver", sku: "AUD-ANC-004-SLV", stock: 15 },
      ],
    },
    {
      title: "Slim Fit Pique Cotton Polo Shirt - Forest Olive",
      slug: "slim-fit-pique-cotton-polo-olive",
      shortDesc: "Double mercerized 100% Egyptian cotton polo designed for Dhaka summer warmth.",
      description: "Breathable, pre-shrunk fabric with classic ribbed collar and subtle tonal embroidery on the chest. Designed to stay crisp after dozens of washes.",
      basePrice: 185000, // ৳ 1,850.00
      compareAtPrice: 220000,
      costPrice: 95000,
      sku: "POL-SLM-005",
      stock: 60,
      isNewArrival: true,
      categoryId: mensCategory.id,
      brandId: yellow.id,
      images: [
        "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=900&q=80",
        "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=900&q=80",
      ],
      variants: [
        { title: "Medium / Olive", size: "M", color: "Olive", sku: "POL-SLM-005-M", stock: 20 },
        { title: "Large / Olive", size: "L", color: "Olive", sku: "POL-SLM-005-L", stock: 25 },
        { title: "XL / Olive", size: "XL", color: "Olive", sku: "POL-SLM-005-XL", stock: 15 },
      ],
    },
    {
      title: "Smart AMOLED Fitness Watch Ultra Pro 2",
      slug: "smart-amoled-fitness-watch-ultra-pro-2",
      shortDesc: "1.43-inch Always-on AMOLED, SpO2 & Heart Rate tracking, Bluetooth 5.3 calling.",
      description: "Rugged aerospace-grade zinc alloy casing with IP68 water resistance. 100+ sports modes, sleep tracking, and up to 10 days of continuous battery life.",
      basePrice: 425000, // ৳ 4,250.00
      compareAtPrice: 520000,
      costPrice: 260000,
      sku: "WCH-PRO-006",
      stock: 40,
      isFeatured: true,
      isBestSeller: true,
      categoryId: electronicsCategory.id,
      brandId: walton.id,
      images: [
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&q=80",
        "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=900&q=80",
      ],
      variants: [
        { title: "Space Grey / Silicone Strap", color: "Space Grey", sku: "WCH-PRO-006-GRY", stock: 25 },
        { title: "Obsidian Black / Metal Strap", color: "Black", sku: "WCH-PRO-006-BLK", stock: 15 },
      ],
    },
    {
      title: "Artisanal Nakshi Kantha Embroidered Bedspread",
      slug: "nakshi-kantha-embroidered-bedspread",
      shortDesc: "Hand-stitched vintage folk motifs on layered soft Bengal cotton.",
      description: "Each bedspread requires over 3 months of intricate needlework by women artisans in Jamalpur. Features traditional floral and village motifs that bring warmth and cultural authenticity.",
      basePrice: 780000, // ৳ 7,800.00
      compareAtPrice: 920000,
      costPrice: 480000,
      sku: "HOM-KAN-007",
      stock: 14,
      categoryId: homeLivingCategory.id,
      brandId: aarong.id,
      images: [
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=900&q=80",
        "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=900&q=80",
      ],
      variants: [
        { title: "King Size (7.5 x 8.5 ft)", size: "King", color: "Multicolor", sku: "HOM-KAN-007-KNG", stock: 14 },
      ],
    },
    {
      title: "Full-Grain Leather Executive Laptop Briefcase",
      slug: "leather-executive-laptop-briefcase-tan",
      shortDesc: "Italian tanned top-grain leather with padded 15.6-inch laptop compartment.",
      description: "Handcrafted with antique brass hardware and reinforced stitching. Features dedicated organizers for pens, cards, tablet, and charger with detachable shoulder strap.",
      basePrice: 850000, // ৳ 8,500.00
      compareAtPrice: 990000,
      costPrice: 520000,
      sku: "BAG-BRI-008",
      stock: 22,
      isFeatured: true,
      categoryId: mensCategory.id,
      brandId: apex.id,
      images: [
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=900&q=80",
        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=900&q=80",
      ],
      variants: [
        { title: "Vintage Cognac Tan", color: "Cognac Tan", sku: "BAG-BRI-008-TAN", stock: 12 },
        { title: "Classic Charcoal Black", color: "Black", sku: "BAG-BRI-008-BLK", stock: 10 },
      ],
    },
    {
      title: "Floral Georgette Festive Anarkali 3-Piece Suit",
      slug: "floral-georgette-anarkali-suit-rose",
      shortDesc: "Flowing georgette Anarkali dress paired with heavy embroidered organza dupatta.",
      description: "Graceful pastel tones highlighted with gold thread hand-embroidery. Santoon inner lining ensures day-long comfort for weddings, parties, and Eid festivities.",
      basePrice: 940000, // ৳ 9,400.00
      compareAtPrice: 1100000,
      costPrice: 580000,
      sku: "WOM-ANA-009",
      stock: 18,
      isNewArrival: true,
      categoryId: womensCategory.id,
      brandId: yellow.id,
      images: [
        "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=900&q=80",
        "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=900&q=80",
      ],
      variants: [
        { title: "Size 38 / Dusty Rose", size: "38", color: "Dusty Rose", sku: "WOM-ANA-009-38", stock: 6 },
        { title: "Size 40 / Dusty Rose", size: "40", color: "Dusty Rose", sku: "WOM-ANA-009-40", stock: 8 },
        { title: "Size 42 / Dusty Rose", size: "42", color: "Dusty Rose", sku: "WOM-ANA-009-42", stock: 4 },
      ],
    },
    {
      title: "Fast-Charging 65W GaN Charger with Dual USB-C & USB-A",
      slug: "fast-charging-65w-gan-charger",
      shortDesc: "Gallium Nitride tech delivers high-speed power for laptops, iPhones, and Android.",
      description: "Ultra-compact form factor with intelligent power distribution. Supports Power Delivery 3.0 and Quick Charge 4+. Over-voltage and surge protection certified.",
      basePrice: 220000, // ৳ 2,200.00
      compareAtPrice: 280000,
      costPrice: 120000,
      sku: "ELC-GAN-010",
      stock: 80,
      categoryId: electronicsCategory.id,
      brandId: walton.id,
      images: [
        "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=900&q=80",
      ],
      variants: [
        { title: "Matte White", color: "White", sku: "ELC-GAN-010-WHT", stock: 50 },
        { title: "Matte Black", color: "Black", sku: "ELC-GAN-010-BLK", stock: 30 },
      ],
    },
    // Adding 10 more to satisfy the 20 demo products requirement
    {
      title: "Handmade Brass Table Lamp with Jute Shade",
      slug: "brass-table-lamp-jute-shade",
      shortDesc: "Polished authentic brass pedestal topped with natural hand-woven jute shade.",
      description: "Creates soft ambient illumination ideal for bedroom nightstands or study desks. Brass is coated with anti-tarnish protective lacquer.",
      basePrice: 380000,
      compareAtPrice: 450000,
      costPrice: 210000,
      sku: "HOM-LMP-011",
      stock: 20,
      categoryId: homeLivingCategory.id,
      brandId: aarong.id,
      images: ["https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=900&q=80"],
      variants: [{ title: "Standard Brass", sku: "HOM-LMP-011-STD", stock: 20 }],
    },
    {
      title: "Men's Italian Suede Penny Loafers - Midnight Blue",
      slug: "mens-suede-penny-loafers-blue",
      shortDesc: "Buttery soft calf suede upper with hand-stitched apron toe and cushioned insole.",
      description: "Versatile casual-to-formal loafers that pair effortlessly with tailored trousers or denim. Flexible rubber driving sole.",
      basePrice: 495000,
      compareAtPrice: 580000,
      costPrice: 290000,
      sku: "SH-LOA-012",
      stock: 30,
      categoryId: mensCategory.id,
      brandId: apex.id,
      images: ["https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=900&q=80"],
      variants: [
        { title: "EU 41 / Navy", size: "41", color: "Navy", sku: "SH-LOA-012-41", stock: 15 },
        { title: "EU 42 / Navy", size: "42", color: "Navy", sku: "SH-LOA-012-42", stock: 15 },
      ],
    },
    {
      title: "Premium 20000mAh Power Bank with 22.5W Fast Charge",
      slug: "20000mah-fast-charge-power-bank",
      shortDesc: "High capacity lithium-polymer battery capable of charging smartphones 4-5 times.",
      description: "LED digital percentage display, dual input (Type-C & Micro), and triple output. Approved for airline carry-on luggage.",
      basePrice: 265000,
      compareAtPrice: 320000,
      costPrice: 150000,
      sku: "ELC-PWR-013",
      stock: 55,
      categoryId: electronicsCategory.id,
      brandId: walton.id,
      images: ["https://images.unsplash.com/photo-1609592424364-50e50f3bca8d?w=900&q=80"],
      variants: [{ title: "Gunmetal Grey", color: "Grey", sku: "ELC-PWR-013-GRY", stock: 55 }],
    },
    {
      title: "Women's Embroidered Cotton Kurti - Mint Green",
      slug: "womens-cotton-kurti-mint-green",
      shortDesc: "Casual daily wear 100% fine lawn cotton kurti with delicate Lucknowi chikan embroidery.",
      description: "Lightweight and airy silhouette engineered for warm climate comfort. Quarter sleeves with tassel lace details.",
      basePrice: 245000,
      compareAtPrice: 295000,
      costPrice: 130000,
      sku: "WOM-KUR-014",
      stock: 45,
      categoryId: womensCategory.id,
      brandId: yellow.id,
      images: ["https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=900&q=80"],
      variants: [
        { title: "Small", size: "S", sku: "WOM-KUR-014-S", stock: 15 },
        { title: "Medium", size: "M", sku: "WOM-KUR-014-M", stock: 20 },
        { title: "Large", size: "L", sku: "WOM-KUR-014-L", stock: 10 },
      ],
    },
    {
      title: "Ceramic Matte Dinner Set (16 Pieces) - Emerald Rim",
      slug: "ceramic-matte-dinner-set-16pc",
      shortDesc: "Handcrafted stoneware service for 4 including dinner plates, side plates, and bowls.",
      description: "Microwave and dishwasher safe. Matte textured finish with subtle gloss emerald hand-painted rim.",
      basePrice: 650000,
      compareAtPrice: 780000,
      costPrice: 350000,
      sku: "HOM-DIN-015",
      stock: 16,
      categoryId: homeLivingCategory.id,
      brandId: aarong.id,
      images: ["https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=900&q=80"],
      variants: [{ title: "Emerald Green", color: "Emerald", sku: "HOM-DIN-015-EMR", stock: 16 }],
    },
    {
      title: "Wireless Ergonomic Mechanical Keyboard RGB",
      slug: "wireless-ergonomic-mechanical-keyboard",
      shortDesc: "Tri-mode connectivity (2.4Ghz/Bluetooth/Type-C) with hot-swappable tactile switches.",
      description: "Compact 75% layout, PBT dye-sublimation keycaps, sound-dampening silicone pads, and 4000mAh rechargeable battery.",
      basePrice: 560000,
      compareAtPrice: 690000,
      costPrice: 320000,
      sku: "ELC-KBD-016",
      stock: 25,
      categoryId: electronicsCategory.id,
      brandId: samsung.id,
      images: ["https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=900&q=80"],
      variants: [
        { title: "Brown Tactile Switches", sku: "ELC-KBD-016-BRN", stock: 15 },
        { title: "Red Linear Switches", sku: "ELC-KBD-016-RED", stock: 10 },
      ],
    },
    {
      title: "Handmade Leather Reversible Belt - Black/Brown",
      slug: "leather-reversible-belt-black-brown",
      shortDesc: "Two colors in one belt: rotate the brushed nickel buckle to switch between black and brown.",
      description: "100% thick top-grain harness leather designed to resist cracking and creasing. Width 35mm.",
      basePrice: 195000,
      compareAtPrice: 250000,
      costPrice: 90000,
      sku: "ACC-BLT-017",
      stock: 70,
      categoryId: mensCategory.id,
      brandId: apex.id,
      images: ["https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=900&q=80"],
      variants: [
        { title: "Waist 32-34", size: "34", sku: "ACC-BLT-017-34", stock: 35 },
        { title: "Waist 36-38", size: "38", sku: "ACC-BLT-017-38", stock: 35 },
      ],
    },
    {
      title: "Silk Organza Dupatta with Zari Scalloped Borders",
      slug: "silk-organza-dupatta-ivory",
      shortDesc: "Lightweight sheer organza dupatta adorned with delicate hand-embroidered borders.",
      description: "Length 2.5 meters. The perfect accessory to elevate plain kurtis or traditional festive suits.",
      basePrice: 280000,
      compareAtPrice: 350000,
      costPrice: 140000,
      sku: "WOM-DUP-018",
      stock: 30,
      categoryId: womensCategory.id,
      brandId: aarong.id,
      images: ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=900&q=80"],
      variants: [{ title: "Ivory Gold", color: "Ivory", sku: "WOM-DUP-018-IVY", stock: 30 }],
    },
    {
      title: "Smart Wi-Fi Security Camera 2K 360° Pan-Tilt",
      slug: "smart-wifi-security-camera-2k",
      shortDesc: "AI human detection, color night vision, two-way audio, and cloud/microSD recording.",
      description: "Keep your home or office secure in crystal clear 2K resolution. Easy setup with iOS/Android mobile app in minutes.",
      basePrice: 345000,
      compareAtPrice: 420000,
      costPrice: 195000,
      sku: "ELC-CAM-019",
      stock: 40,
      categoryId: electronicsCategory.id,
      brandId: walton.id,
      images: ["https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=900&q=80"],
      variants: [{ title: "Standard White", color: "White", sku: "ELC-CAM-019-WHT", stock: 40 }],
    },
    {
      title: "Hand-Poured Soy Wax Scented Candle - Dhaka Jasmine & Oud",
      slug: "scented-candle-dhaka-jasmine-oud",
      shortDesc: "Natural soy wax infused with night-blooming beli flower (jasmine) and agarwood (oud).",
      description: "50-hour clean burn in an amber glass jar with cotton wick. Paraben and cruelty-free.",
      basePrice: 165000,
      compareAtPrice: 195000,
      costPrice: 75000,
      sku: "HOM-CND-020",
      stock: 50,
      categoryId: homeLivingCategory.id,
      brandId: aarong.id,
      images: ["https://images.unsplash.com/photo-1603006905003-be475563bc59?w=900&q=80"],
      variants: [{ title: "250g Jar", sku: "HOM-CND-020-250", stock: 50 }],
    },
  ];

  for (const item of rawProducts) {
    const p = await prisma.product.create({
      data: {
        title: item.title,
        slug: item.slug,
        shortDesc: item.shortDesc,
        description: item.description,
        basePrice: item.basePrice,
        compareAtPrice: item.compareAtPrice,
        costPrice: item.costPrice,
        sku: item.sku,
        stock: item.stock,
        status: ProductStatus.ACTIVE,
        isFeatured: item.isFeatured || false,
        isNewArrival: item.isNewArrival || false,
        isBestSeller: item.isBestSeller || false,
        categoryId: item.categoryId,
        brandId: item.brandId,
        seoTitle: `${item.title} | Buy Online Bangladesh`,
        seoDescription: item.shortDesc,
        images: {
          create: item.images.map((url, idx) => ({
            url,
            isPrimary: idx === 0,
            displayOrder: idx,
            altText: item.title,
          })),
        },
        variants: {
          create: item.variants.map((v) => ({
            title: v.title,
            size: v.size,
            color: v.color,
            sku: v.sku,
            stock: v.stock,
            price: item.basePrice,
          })),
        },
        tags: {
          create: [{ tagId: tagEid.id }, { tagId: tagTrending.id }],
        },
      },
    });

    // Add a demo review for the product
    await prisma.review.create({
      data: {
        productId: p.id,
        userId: demoCustomer.id,
        rating: 5,
        title: "Spectacular quality!",
        comment: "Exceeded my expectations. Packaging was luxurious and delivery was fast inside Dhaka within 24 hours.",
        isApproved: true,
      },
    });
  }

  // 7. Seed Banners
  console.log("🖼️ Creating promotional banners...");
  await prisma.banner.createMany({
    data: [
      {
        placement: BannerPlacement.HERO_SLIDER,
        title: "Eid Ul Adha Luxury Collection 2026",
        subtitle: "Handcrafted Silk Panjabis, Dhakai Jamdanis & Designer Footwear",
        desktopImage: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80",
        mobileImage: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80",
        linkUrl: "/shop?category=mens-fashion",
        displayOrder: 1,
        isActive: true,
      },
      {
        placement: BannerPlacement.HERO_SLIDER,
        title: "Official Audio & Wearables Launch",
        subtitle: "Active Noise Cancelling & AMOLED Smartwatches with Nationwide Warranty",
        desktopImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1600&q=80",
        mobileImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
        linkUrl: "/shop?category=electronics-gadgets",
        displayOrder: 2,
        isActive: true,
      },
      {
        placement: BannerPlacement.PROMO_STRIP,
        title: "Flash Sale: Up to 30% OFF on Top Brand Picks",
        subtitle: "Use coupon code EID2026 at checkout for instant savings!",
        desktopImage: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600&q=80",
        linkUrl: "/shop",
        displayOrder: 1,
        isActive: true,
      },
    ],
  });

  // 8. Seed Coupons
  console.log("🎟️ Creating coupons...");
  await prisma.coupon.createMany({
    data: [
      {
        code: "WELCOME10",
        description: "10% off for first-time shoppers",
        type: CouponType.PERCENTAGE,
        value: 10,
        minOrderAmount: 100000, // ৳ 1,000 minimum
        maxDiscount: 50000, // max ৳ 500
        isActive: true,
      },
      {
        code: "EID2026",
        description: "৳ 500 instant discount on orders above ৳ 3,000",
        type: CouponType.FIXED_AMOUNT,
        value: 50000, // ৳ 500 in poisha
        minOrderAmount: 300000,
        isActive: true,
      },
      {
        code: "FREESHIP",
        description: "Free delivery nationwide on orders above ৳ 2,000",
        type: CouponType.FREE_SHIPPING,
        value: 12000,
        minOrderAmount: 200000,
        isActive: true,
      },
    ],
  });

  // 9. Seed Shipping Zones & Rates
  console.log("🚚 Creating shipping zones and localized rates...");
  const dhakaZone = await prisma.shippingZone.create({
    data: {
      name: "Inside Dhaka Metro",
      description: "Dhaka city corporations (North & South)",
      rates: {
        create: [
          {
            title: "Standard Home Delivery (24-48 Hours)",
            rateAmount: 6000, // ৳ 60.00
            minOrderAmount: 500000, // Free above ৳ 5,000
            estimatedDays: "1-2 Business Days",
            isActive: true,
          },
          {
            title: "Express Same-Day Delivery",
            rateAmount: 15000, // ৳ 150.00
            estimatedDays: "Same Day (Order before 1 PM)",
            isActive: true,
          },
        ],
      },
    },
  });

  await prisma.shippingZone.create({
    data: {
      name: "Outside Dhaka (All 63 Districts)",
      description: "Chittagong, Sylhet, Rajshahi, Khulna, Barisal, Rangpur, Mymensingh divisions",
      rates: {
        create: [
          {
            title: "Nationwide Courier Delivery (Steadfast / Pathao / RedX)",
            rateAmount: 12000, // ৳ 120.00
            minOrderAmount: 700000, // Free above ৳ 7,000
            estimatedDays: "2-4 Business Days",
            isActive: true,
          },
        ],
      },
    },
  });

  // 10. Seed Site Settings
  console.log("⚙️ Creating site settings...");
  const settings = [
    { key: "site_name", value: "KinaKati" },
    { key: "site_logo", value: "/uploads/logo-1793123613850-h97mac.png" },
    { key: "support_phone", value: "+880 9612-000000" },
    { key: "support_email", value: "support@kinakati.com" },
    { key: "office_address", value: "Level 14, Crystal Palace, SE(D) 22 Gulshan Avenue, Dhaka-1212, Bangladesh" },
    { key: "currency_code", value: "BDT" },
    { key: "currency_symbol", value: "৳" },
    { key: "enable_cod", value: "true" },
    { key: "enable_stripe", value: "true" },
    { key: "enable_bkash", value: "true" },
    { key: "seo_meta_title", value: "KinaKati | কেনাকাটা হোক আরও সহজ | Online Shopping in Bangladesh" },
    { key: "seo_meta_description", value: "Official online store for authentic Bangladeshi designer fashion, premium footwear, and lifestyle apparel with express home delivery." },
  ];

  for (const s of settings) {
    await prisma.siteSetting.create({
      data: s,
    });
  }

  // 11. Seed CMS Pages
  console.log("📄 Creating CMS pages...");
  await prisma.page.createMany({
    data: [
      {
        title: "About Us",
        slug: "about",
        content: `<h2>About Dhaka Premium E-Commerce</h2><p>Established with a commitment to uncompromised authenticity, Dhaka Premium E-Commerce curates top-tier fashion, heritage handicrafts, and certified electronics across Bangladesh.</p><p>We partner directly with leading brands and master artisans to guarantee 100% genuine products with transparent pricing and dependable customer service.</p>`,
        seoTitle: "About Dhaka Premium E-Commerce",
        seoDescription: "Learn more about our mission to bring premium quality shopping to every doorstep in Bangladesh.",
      },
      {
        title: "Privacy Policy",
        slug: "privacy",
        content: `<h2>Privacy Policy</h2><p>Your privacy is of utmost importance to us. We only collect essential customer data to fulfill your orders, process secure payments, and provide delivery updates.</p><p>We do not sell or share personal information with unauthorized third parties.</p>`,
        seoTitle: "Privacy Policy | Dhaka Premium",
        seoDescription: "Review how we collect, protect, and handle your data.",
      },
      {
        title: "Terms of Service",
        slug: "terms",
        content: `<h2>Terms of Service</h2><p>By placing an order on Dhaka Premium E-Commerce, you agree to our standard shopping terms, return policies within 7 days for unworn/intact items, and cash-on-delivery inspection guidelines.</p>`,
        seoTitle: "Terms of Service | Dhaka Premium",
        seoDescription: "Our customer terms, return policies, and service conditions.",
      },
      {
        title: "Frequently Asked Questions (FAQ)",
        slug: "faq",
        content: `<h2>Frequently Asked Questions</h2><h3>How long does delivery take?</h3><p>Inside Dhaka orders are typically delivered within 24 to 48 hours. Nationwide deliveries take 2 to 4 business days.</p><h3>Can I open the parcel before paying for Cash on Delivery?</h3><p>Yes, you can inspect the outer packaging and ensure item matches before handing over payment to our courier partner rider.</p>`,
        seoTitle: "FAQ & Help Center | Dhaka Premium",
        seoDescription: "Find quick answers regarding delivery, returns, payments, and tracking.",
      },
    ],
  });

  // 12. Seed Homepage Sections
  console.log("🧩 Creating homepage layout blocks...");
  await prisma.homepageSection.createMany({
    data: [
      {
        title: "Featured Categories",
        subtitle: "Explore our finest handpicked departments",
        type: SectionType.FEATURED_CATEGORIES,
        displayOrder: 1,
        isActive: true,
      },
      {
        title: "Eid Ul Adha Specials",
        subtitle: "Handpicked festive designs and trending releases",
        type: SectionType.FLASH_SALE,
        displayOrder: 2,
        isActive: true,
      },
      {
        title: "Best Sellers",
        subtitle: "Most loved items chosen by thousands across Bangladesh",
        type: SectionType.BEST_SELLERS,
        displayOrder: 3,
        isActive: true,
      },
      {
        title: "Brand Showcase",
        subtitle: "Authentic licensed brands you know and trust",
        type: SectionType.BRAND_SHOWCASE,
        displayOrder: 4,
        isActive: true,
      },
    ],
  });

  console.log("✨ Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
