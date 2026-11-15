import { CartItem } from "@/context/CartContext";
import { calculateCartSubtotal } from "./pricing-utils";

/**
 * Validates a cart item against corruption and unexpected values.
 */
export function isValidCartItem(item: unknown): item is CartItem {
  if (!item || typeof item !== "object") return false;
  const candidate = item as Partial<CartItem>;
  return (
    typeof candidate.id === "string" &&
    candidate.id.trim().length > 0 &&
    typeof candidate.name === "string" &&
    typeof candidate.price === "number" &&
    !isNaN(candidate.price) &&
    candidate.price >= 0 &&
    typeof candidate.quantity === "number" &&
    !isNaN(candidate.quantity) &&
    candidate.quantity > 0
  );
}

/**
 * Merges duplicate items in a cart list based on their unique item ID (productId + size).
 */
export function mergeCartDuplicates(items: CartItem[]): CartItem[] {
  const itemMap = new Map<string, CartItem>();

  for (const item of items) {
    if (!isValidCartItem(item)) continue;
    const existing = itemMap.get(item.id);
    if (existing) {
      itemMap.set(item.id, {
        ...existing,
        quantity: existing.quantity + item.quantity,
      });
    } else {
      itemMap.set(item.id, { ...item });
    }
  }

  return Array.from(itemMap.values());
}
