"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Product, PosterSize } from "@/types/product";
import { PosterCollectionItem } from "@/types/collection";
import { calculateCartSubtotal } from "@/lib/products/pricing-utils";
import { isValidCartItem } from "@/lib/products/cart-utils";

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  category: string;
  image: string;
  size: PosterSize | string;
  dimensions: string;
  price: number;
  quantity: number;
  inclusions?: string;
  whatsappMessage?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (
    itemOrProduct: Product | PosterCollectionItem,
    size?: PosterSize | string,
    quantity?: number
  ) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalAmount: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "happy_walls_cart_v2";

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Restore cart from localStorage with strict runtime validation
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Validate each item with central validator
          const validItems = parsed.filter(isValidCartItem);
          setItems(validItems);
        }
      }
    } catch (error) {
      console.warn("Happy Walls: Unable to restore saved cart state, resetting.", error);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.warn("Happy Walls: Unable to persist cart state to localStorage.", error);
    }
  }, [items, isInitialized]);

  /**
   * Adds an item to the cart.
   * Supports both standard Product objects and PosterCollectionItem objects.
   */
  const addItem = useCallback(
    (
      itemOrProduct: Product | PosterCollectionItem,
      sizeChoice?: PosterSize | string,
      qtyToAdd: number = 1
    ) => {
      if (!itemOrProduct || !itemOrProduct.id) {
        console.error("Happy Walls: Invalid product provided to addItem.");
        return;
      }

      const quantity = Math.max(1, Math.floor(qtyToAdd || 1));

      // Resolve product properties whether passed from Product or PosterCollectionItem
      let productId: string;
      let name: string;
      let category: string;
      let image: string;
      let size: string;
      let dimensions: string;
      let unitPrice: number;
      let inclusions: string | undefined;
      let whatsappMessage: string | undefined;

      // Discriminate Product vs PosterCollectionItem
      if ("availableSizes" in itemOrProduct) {
        // Standard Product
        const prod = itemOrProduct as Product;
        productId = prod.id;
        name = prod.name;
        category = prod.category;
        image = prod.image;
        const resolvedSizeOption =
          prod.availableSizes.find((s) => s.id === sizeChoice) || prod.availableSizes[0];
        size = resolvedSizeOption.id;
        dimensions = resolvedSizeOption.dimensions;
        unitPrice = Math.round(resolvedSizeOption.price);
        inclusions = resolvedSizeOption.inclusions || prod.inclusions;
      } else {
        // PosterCollectionItem
        const col = itemOrProduct as PosterCollectionItem;
        productId = col.id;
        name = col.title;
        category = col.category;
        image = col.image;
        size = sizeChoice || (col.categorySlug === "split-poster" ? "Split Poster Set" : "A4 Size Poster");
        dimensions = col.sizeText || (col.categorySlug === "split-poster" ? "3 × A4 size posters" : "21 × 29.7 cm");
        unitPrice = Math.round(col.price);
        inclusions = col.inclusions;
        whatsappMessage = col.whatsappMessage;
      }

      const cartItemId = `${productId}-${size.replace(/\s+/g, "_")}`;

      setItems((prevItems) => {
        const existingIndex = prevItems.findIndex((item) => item.id === cartItemId);
        if (existingIndex > -1) {
          // Increment quantity for existing product + size combination
          return prevItems.map((item, idx) =>
            idx === existingIndex
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }

        // Add new cart entry
        return [
          ...prevItems,
          {
            id: cartItemId,
            productId,
            name,
            category,
            image,
            size,
            dimensions,
            price: unitPrice,
            quantity,
            inclusions,
            whatsappMessage,
          },
        ];
      });

      // Automatically open the cart drawer to provide direct user feedback
      setIsCartOpen(true);
    },
    []
  );

  const removeItem = useCallback((itemId: string) => {
    if (!itemId) return;
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  }, []);

  const updateQuantity = useCallback((itemId: string, newQuantity: number) => {
    if (!itemId) return;
    const safeQty = Math.floor(newQuantity);
    if (safeQty <= 0) {
      setItems((prev) => prev.filter((item) => item.id !== itemId));
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity: safeQty } : item))
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const totalAmount = calculateCartSubtotal(items);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalAmount,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
