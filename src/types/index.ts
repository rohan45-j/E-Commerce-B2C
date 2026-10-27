import { Role, OrderStatus, PaymentStatus, PaymentMethod, ProductStatus, CouponType } from "@prisma/client";

export type { Role, OrderStatus, PaymentStatus, PaymentMethod, ProductStatus, CouponType };

export interface CartItemInput {
  productId: string;
  variantId?: string | null;
  title: string;
  variantTitle?: string | null;
  sku: string;
  price: number; // in integer poisha or flat BDT
  image?: string | null;
  quantity: number;
  stock: number;
}

export interface ShippingAddressInput {
  recipientName: string;
  phone: string;
  email?: string;
  division: string;
  district: string;
  upazila: string;
  addressLine: string;
  deliveryInstructions?: string;
}

export interface OrderCalculationSummary {
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  taxAmount: number;
  totalAmount: number;
  appliedCoupon?: {
    code: string;
    discountAmount: number;
  } | null;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
