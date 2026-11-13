"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { lineKey, round2, type CartLine } from "@/lib/pricing";

const STORAGE_KEY = "rsm-cart-v1";

type CartContextValue = {
  items: CartLine[];
  ready: boolean;
  count: number;
  subtotal: number;
  taxTotal: number;
  addItem: (item: Omit<CartLine, "quantity">, quantity?: number) => void;
  setQuantity: (lineKey: string, quantity: number) => void;
  removeItem: (lineKey: string) => void;
  clear: () => void;
  lastAdded: string | null;
};

const CartContext = createContext<CartContextValue | null>(null);

function readCart(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartLine[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((line) => line && typeof line.productId === "number" && line.quantity > 0);
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);
  const [lastAdded, setLastAdded] = useState<string | null>(null);

  useEffect(() => {
    setItems(readCart());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, ready]);

  const addItem = useCallback((item: Omit<CartLine, "quantity">, quantity?: number) => {
    const qty = Math.max(item.moq || 1, quantity ?? (item.moq || 1));
    setItems((current) => {
      const key = lineKey(item);
      const existing = current.find((line) => lineKey(line) === key);
      if (existing) {
        return current.map((line) => (lineKey(line) === key ? { ...line, quantity: round2(line.quantity + qty) } : line));
      }
      return [...current, { ...item, quantity: qty }];
    });
    setLastAdded(item.name);
    window.setTimeout(() => setLastAdded(null), 2600);
  }, []);

  const setQuantity = useCallback((key: string, quantity: number) => {
    setItems((current) =>
      current.map((line) =>
        lineKey(line) === key ? { ...line, quantity: Math.max(line.moq || 1, Math.round(quantity)) } : line,
      ),
    );
  }, []);

  const removeItem = useCallback((key: string) => {
    setItems((current) => current.filter((line) => lineKey(line) !== key));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(() => {
    const subtotal = round2(items.reduce((sum, line) => sum + line.basePrice * line.quantity, 0));
    const taxTotal = round2(
      items.reduce((sum, line) => sum + (line.basePrice * line.quantity * line.taxRate) / 100, 0),
    );
    return {
      items,
      ready,
      count: items.reduce((sum, line) => sum + line.quantity, 0),
      subtotal,
      taxTotal,
      addItem,
      setQuantity,
      removeItem,
      clear,
      lastAdded,
    };
  }, [items, ready, addItem, setQuantity, removeItem, clear, lastAdded]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
