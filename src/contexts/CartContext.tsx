'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

export interface CartItem {
  designId: string;
  title: string;
  price: number;
  thumbnailUrl: string;
  creatorUsername: string;
  category: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (designId: string) => void;
  clearCart: () => void;
  totalPrice: number;
  itemCount: number;
  isInCart: (designId: string) => boolean;
}

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = 'artroom_cart';
const MAX_ITEMS = 20;

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch {
      // Invalid data, ignore
    }
    setHydrated(true);
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, hydrated]);

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => {
      if (prev.length >= MAX_ITEMS) return prev;
      if (prev.some((i) => i.designId === item.designId)) return prev;
      return [...prev, item];
    });
  }, []);

  const removeItem = useCallback((designId: string) => {
    setItems((prev) => prev.filter((i) => i.designId !== designId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const isInCart = useCallback(
    (designId: string) => items.some((i) => i.designId === designId),
    [items]
  );

  const totalPrice = items.reduce((sum, i) => sum + i.price, 0);
  const itemCount = items.length;

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, clearCart, totalPrice, itemCount, isInCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
