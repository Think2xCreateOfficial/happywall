import { CLIENT_PRICING } from "@/data/products/product-catalog";

/**
 * Calculates item subtotal ensuring safe integer multiplication in INR.
 */
export function calculateItemSubtotal(unitPrice: number, quantity: number): number {
  const safePrice = Math.max(0, Math.floor(unitPrice || 0));
  const safeQty = Math.max(0, Math.floor(quantity || 0));
  return safePrice * safeQty;
}

/**
 * Calculates total cart subtotal by summing all item subtotals.
 */
export function calculateCartSubtotal(items: { price: number; quantity: number }[]): number {
  if (!Array.isArray(items) || items.length === 0) return 0;
  return items.reduce((sum, item) => sum + calculateItemSubtotal(item.price, item.quantity), 0);
}

/**
 * Formats integer amount in Indian Rupee format (e.g. ₹39, ₹109, ₹249).
 */
export function formatPriceINR(amount: number): string {
  const safe = Math.max(0, Math.floor(amount || 0));
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(safe);
}
