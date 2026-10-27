import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format poisha (minor units) or flat BDT amount into localized Bangladeshi Taka display
 * Example: 150000 -> ৳ 1,500.00 or if poisha is 0 -> ৳ 1,500
 */
export function formatBDT(amountInPoisha: number): string {
  const bdt = amountInPoisha / 100;
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    minimumFractionDigits: amountInPoisha % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })
    .format(bdt)
    .replace("BDT", "৳");
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-BD").format(value);
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}
