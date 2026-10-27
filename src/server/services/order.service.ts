import { prisma } from "@/lib/prisma";
import { OrderStatus, PaymentStatus, PaymentMethod, CouponType } from "@prisma/client";
import crypto from "crypto";

export interface CreateOrderItemInput {
  productId: string;
  variantId?: string | null;
  quantity: number;
}

export interface ShippingDetailsInput {
  recipientName: string;
  phone: string;
  email: string;
  division: string;
  district: string;
  upazila: string;
  addressLine: string;
  deliveryInstructions?: string;
  shippingZone: "INSIDE_DHAKA" | "OUTSIDE_DHAKA";
}

export interface PlaceOrderInput {
  userId?: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: ShippingDetailsInput;
  items: CreateOrderItemInput[];
  couponCode?: string;
  paymentMethod: PaymentMethod;
  customerNotes?: string;
}

export class OrderService {
  /**
   * Server-authoritative calculation of items, discounts, shipping and total
   */
  static async calculateOrder(
    items: CreateOrderItemInput[],
    shippingZone: "INSIDE_DHAKA" | "OUTSIDE_DHAKA",
    couponCode?: string
  ) {
    if (!items || items.length === 0) {
      throw new Error("Order must contain at least one item");
    }

    let subtotal = 0;
    const validatedItems: {
      productId: string;
      variantId?: string | null;
      productName: string;
      variantName?: string | null;
      sku: string;
      unitPrice: number;
      quantity: number;
      totalPrice: number;
      imageUrl?: string | null;
      stock: number;
    }[] = [];

    // Fetch and verify products server-side
    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        include: {
          images: { orderBy: { displayOrder: "asc" }, take: 1 },
          variants: item.variantId ? { where: { id: item.variantId } } : false,
        },
      });

      if (!product || product.status !== "ACTIVE") {
        throw new Error(`Product not found or inactive: ${item.productId}`);
      }

      let unitPrice = product.basePrice;
      let sku = product.sku;
      let variantName: string | null = null;
      let availableStock = product.stock;

      if (item.variantId) {
        const variant = product.variants?.[0];
        if (!variant || !variant.isActive) {
          throw new Error(`Selected variant not available for ${product.title}`);
        }
        if (variant.price) unitPrice = variant.price;
        sku = variant.sku;
        variantName = variant.title;
        availableStock = variant.stock;
      }

      if (availableStock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.title}. Available: ${availableStock}`);
      }

      const itemTotal = unitPrice * item.quantity;
      subtotal += itemTotal;

      validatedItems.push({
        productId: product.id,
        variantId: item.variantId,
        productName: product.title,
        variantName,
        sku,
        unitPrice,
        quantity: item.quantity,
        totalPrice: itemTotal,
        imageUrl: product.images[0]?.url || null,
        stock: availableStock,
      });
    }

    // Shipping calculation (poisha)
    let shippingFee = shippingZone === "INSIDE_DHAKA" ? 6000 : 12000; // ৳60 or ৳120
    if (subtotal >= 1000000) {
      // Free shipping for orders ৳10,000+
      shippingFee = 0;
    }

    // Coupon calculation
    let discountAmount = 0;
    let appliedCoupon: { id: string; code: string } | null = null;

    if (couponCode) {
      const now = new Date();
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode.trim().toUpperCase() },
      });

      if (
        coupon &&
        coupon.isActive &&
        coupon.startDate <= now &&
        (!coupon.endDate || coupon.endDate >= now) &&
        (!coupon.usageLimit || coupon.usageCount < coupon.usageLimit) &&
        (!coupon.minOrderAmount || subtotal >= coupon.minOrderAmount)
      ) {
        appliedCoupon = { id: coupon.id, code: coupon.code };

        if (coupon.type === CouponType.PERCENTAGE) {
          const calculatedDiscount = Math.round((subtotal * coupon.value) / 100);
          discountAmount = coupon.maxDiscount
            ? Math.min(calculatedDiscount, coupon.maxDiscount)
            : calculatedDiscount;
        } else if (coupon.type === CouponType.FIXED_AMOUNT) {
          discountAmount = Math.min(coupon.value, subtotal);
        } else if (coupon.type === CouponType.FREE_SHIPPING) {
          shippingFee = 0;
        }
      }
    }

    const totalAmount = Math.max(0, subtotal - discountAmount + shippingFee);

    return {
      subtotal,
      discountAmount,
      shippingFee,
      taxAmount: 0,
      totalAmount,
      appliedCoupon,
      validatedItems,
    };
  }

  /**
   * Atomic Order Placement with Stock Decrement and Tracking Token
   */
  static async createOrder(input: PlaceOrderInput) {
    const calculation = await this.calculateOrder(
      input.items,
      input.shippingAddress.shippingZone,
      input.couponCode
    );

    const year = new Date().getFullYear();
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const orderNumber = `ORD-${year}-${randomSuffix}`;
    const trackingToken = crypto.randomBytes(16).toString("hex");

    // Execute atomic transaction
    const order = await prisma.$transaction(async (tx) => {
      // 1. Decrement stock for each item
      for (const item of calculation.validatedItems) {
        if (item.variantId) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: { stock: { decrement: item.quantity } },
          });
        }
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // 2. Increment coupon use if applied
      if (calculation.appliedCoupon) {
        await tx.coupon.update({
          where: { id: calculation.appliedCoupon.id },
          data: { usageCount: { increment: 1 } },
        });
      }

      // 3. Create Order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          trackingToken,
          userId: input.userId || null,
          customerName: input.customerName,
          customerEmail: input.customerEmail,
          customerPhone: input.customerPhone,
          status: OrderStatus.PENDING,
          paymentStatus:
            input.paymentMethod === PaymentMethod.COD
              ? PaymentStatus.UNPAID
              : PaymentStatus.PENDING,
          paymentMethod: input.paymentMethod,
          currency: "BDT",
          subtotal: calculation.subtotal,
          discountAmount: calculation.discountAmount,
          shippingFee: calculation.shippingFee,
          taxAmount: calculation.taxAmount,
          totalAmount: calculation.totalAmount,
          couponId: calculation.appliedCoupon?.id || null,
          shippingAddress: JSON.stringify(input.shippingAddress),
          customerNotes: input.customerNotes || null,
          items: {
            create: calculation.validatedItems.map((item) => ({
              productId: item.productId,
              variantId: item.variantId || null,
              productName: item.productName,
              variantName: item.variantName || null,
              sku: item.sku,
              unitPrice: item.unitPrice,
              quantity: item.quantity,
              totalPrice: item.totalPrice,
              imageUrl: item.imageUrl || null,
            })),
          },
          statusHistory: {
            create: {
              fromStatus: OrderStatus.PENDING,
              toStatus: OrderStatus.PENDING,
              notes: "Order placed by customer via web storefront",
            },
          },
        },
        include: {
          items: true,
        },
      });

      return newOrder;
    });

    return order;
  }

  /**
   * Public tracking lookup by orderNumber and phone/email
   */
  static async trackOrder(identifier: string, contact: string) {
    const cleanId = identifier.trim().toUpperCase();
    const cleanContact = contact.trim().toLowerCase();

    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { orderNumber: cleanId },
          { trackingToken: identifier.trim() },
        ],
        AND: [
          {
            OR: [
              { customerPhone: { contains: cleanContact } },
              { customerEmail: { equals: cleanContact, mode: "insensitive" } },
            ],
          },
        ],
      },
      include: {
        items: true,
        statusHistory: { orderBy: { createdAt: "desc" } },
        shipments: { orderBy: { createdAt: "desc" }, take: 1 },
      },
    });

    return order;
  }
}
