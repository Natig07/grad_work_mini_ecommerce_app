"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "./use-auth";

const LOCAL_STORAGE_KEY = "ecommerce_wishlist";

const isSupabaseConfigured = () => {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
};

export interface WishlistItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  productPriceCents: number;
}

export function useWishlist() {
  const { user, isAuthenticated } = useAuth();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadWishlist = useCallback(async () => {
    if (isAuthenticated && user && isSupabaseConfigured()) {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("wishlist_items")
          .select("*")
          .eq("user_id", user.id);

        if (!error && data) {
          const wishlistItems = data.map((item: any) => ({
            id: item.id,
            productId: item.product_id,
            productName: item.product_name,
            productImage: item.product_image,
            productPriceCents: item.product_price_cents,
          }));
          setItems(wishlistItems);
        }
      } catch (error) {
        console.error("Error loading wishlist:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      const storedWishlist = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedWishlist) {
        try {
          setItems(JSON.parse(storedWishlist));
        } catch (error) {
          console.error("Error parsing wishlist:", error);
        }
      }
    }
  }, [user, isAuthenticated]);

  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

  const saveLocalWishlist = (wishlistItems: WishlistItem[]) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(wishlistItems));
    setItems(wishlistItems);
  };

  const addItem = useCallback(
    async (
      productId: string,
      productName: string,
      productImage: string,
      productPriceCents: number,
    ) => {
      const isAlreadyAdded = items.some((item) => item.productId === productId);
      if (isAlreadyAdded) return;

      if (isAuthenticated && user && isSupabaseConfigured()) {
        try {
          await supabase.from("wishlist_items").insert({
            user_id: user.id,
            product_id: productId,
            product_name: productName,
            product_image: productImage,
            product_price_cents: productPriceCents,
          });
          await loadWishlist();
        } catch (error) {
          console.error("Error adding to wishlist:", error);
        }
      } else {
        const newItem: WishlistItem = {
          id: Date.now().toString(),
          productId,
          productName,
          productImage,
          productPriceCents,
        };
        saveLocalWishlist([...items, newItem]);
      }
    },
    [items, isAuthenticated, user, loadWishlist],
  );

  const removeItem = useCallback(
    async (productId: string) => {
      if (isAuthenticated && user && isSupabaseConfigured()) {
        try {
          await supabase
            .from("wishlist_items")
            .delete()
            .eq("user_id", user.id)
            .eq("product_id", productId);
          await loadWishlist();
        } catch (error) {
          console.error("Error removing from wishlist:", error);
        }
      } else {
        const updatedItems = items.filter(
          (item) => item.productId !== productId,
        );
        saveLocalWishlist(updatedItems);
      }
    },
    [items, isAuthenticated, user, loadWishlist],
  );

  const isInWishlist = (productId: string) => {
    return items.some((item) => item.productId === productId);
  };

  return {
    items,
    isLoading,
    addItem,
    removeItem,
    isInWishlist,
  };
}
