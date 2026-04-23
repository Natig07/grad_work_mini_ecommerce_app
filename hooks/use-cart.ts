"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";
import type { CartItem, Cart } from "@/types/cart";
import { useAuth } from "./use-auth";

const LOCAL_STORAGE_KEY = "ecommerce_cart";

const isSupabaseConfigured = () => {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
};

export function useCart() {
  const { user, isAuthenticated } = useAuth();
  const [cart, setCart] = useState<Cart>({
    items: [],
    totalCents: 0,
    itemCount: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  const calculateTotal = (items: CartItem[]) => {
    const totalCents = items.reduce(
      (sum, item) => sum + item.productPriceCents * item.quantity,
      0,
    );
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    return { totalCents, itemCount };
  };

  const loadCart = useCallback(async () => {
    if (isAuthenticated && user && isSupabaseConfigured()) {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("cart_items")
          .select("*")
          .eq("user_id", user.id);

        if (!error && data) {
          const items = data.map((item: any) => ({
            id: item.id,
            productId: item.product_id,
            productName: item.product_name,
            productImage: item.product_image,
            productPriceCents: item.product_price_cents,
            quantity: item.quantity,
          }));
          const { totalCents, itemCount } = calculateTotal(items);
          setCart({ items, totalCents, itemCount });
        }
      } catch (error) {
        console.error("Error loading cart:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      const storedCart = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedCart) {
        try {
          const items = JSON.parse(storedCart);
          const { totalCents, itemCount } = calculateTotal(items);
          setCart({ items, totalCents, itemCount });
        } catch (error) {
          console.error("Error parsing cart:", error);
        }
      }
    }
  }, [user, isAuthenticated]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const saveLocalCart = (items: CartItem[]) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
    const { totalCents, itemCount } = calculateTotal(items);
    setCart({ items, totalCents, itemCount });
  };

  const addItem = useCallback(
    async (
      productId: string,
      productName: string,
      productImage: string,
      productPriceCents: number,
      quantity: number = 1,
    ) => {
      if (isAuthenticated && user && isSupabaseConfigured()) {
        try {
          const { data: existing } = await supabase
            .from("cart_items")
            .select("id, quantity")
            .eq("user_id", user.id)
            .eq("product_id", productId)
            .maybeSingle();

          if (existing) {
            await supabase
              .from("cart_items")
              .update({ quantity: existing.quantity + quantity })
              .eq("id", existing.id);
          } else {
            await supabase.from("cart_items").insert({
              user_id: user.id,
              product_id: productId,
              product_name: productName,
              product_image: productImage,
              product_price_cents: productPriceCents,
              quantity,
            });
          }
          await loadCart();
        } catch (error) {
          console.error("Error adding to cart:", error);
        }
      } else {
        const existing = cart.items.find(
          (item) => item.productId === productId,
        );
        let updatedItems: CartItem[];
        if (existing) {
          updatedItems = cart.items.map((item) =>
            item.productId === productId
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          );
        } else {
          updatedItems = [
            ...cart.items,
            {
              id: Date.now().toString(),
              productId,
              productName,
              productImage,
              productPriceCents,
              quantity,
            },
          ];
        }
        saveLocalCart(updatedItems);
      }
    },
    [cart.items, isAuthenticated, user, loadCart],
  );

  const removeItem = useCallback(
    async (productId: string) => {
      if (isAuthenticated && user && isSupabaseConfigured()) {
        try {
          await supabase
            .from("cart_items")
            .delete()
            .eq("user_id", user.id)
            .eq("product_id", productId);
          await loadCart();
        } catch (error) {
          console.error("Error removing from cart:", error);
        }
      } else {
        const updatedItems = cart.items.filter(
          (item) => item.productId !== productId,
        );
        saveLocalCart(updatedItems);
      }
    },
    [cart.items, isAuthenticated, user, loadCart],
  );

  const updateQuantity = useCallback(
    async (productId: string, quantity: number) => {
      if (quantity <= 0) {
        await removeItem(productId);
        return;
      }

      if (isAuthenticated && user && isSupabaseConfigured()) {
        try {
          await supabase
            .from("cart_items")
            .update({ quantity })
            .eq("user_id", user.id)
            .eq("product_id", productId);
          await loadCart();
        } catch (error) {
          console.error("Error updating quantity:", error);
        }
      } else {
        const updatedItems = cart.items.map((item) =>
          item.productId === productId ? { ...item, quantity } : item,
        );
        saveLocalCart(updatedItems);
      }
    },
    [cart.items, isAuthenticated, user, loadCart, removeItem],
  );

  const clearCart = useCallback(async () => {
    if (isAuthenticated && user && isSupabaseConfigured()) {
      try {
        await supabase.from("cart_items").delete().eq("user_id", user.id);
        setCart({ items: [], totalCents: 0, itemCount: 0 });
      } catch (error) {
        console.error("Error clearing cart:", error);
      }
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      setCart({ items: [], totalCents: 0, itemCount: 0 });
    }
  }, [isAuthenticated, user]);

  return {
    cart,
    isLoading,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };
}
