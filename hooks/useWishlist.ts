"use client";

import { useCallback, useEffect, useRef } from "react";
import { toggleWishlist, setWishlist } from "@/store/slices/wishlistSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useSyncWishlistMutation } from "@/store/api";
import { useAuth } from "@/hooks/useAuth";

export function useWishlist() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((s) => s.wishlist.items);
  const { isAuthenticated } = useAuth();
  const [syncWishlist] = useSyncWishlistMutation();
  const skipNextSync = useRef(false);
  const hydrated = useRef(false);

  useEffect(() => {
    if (!isAuthenticated || hydrated.current) return;
    hydrated.current = true;
    void fetch("/api/wishlist")
      .then((r) => r.json() as Promise<string[]>)
      .then((ids) => {
        skipNextSync.current = true;
        dispatch(setWishlist(ids));
      })
      .catch(() => {
        hydrated.current = false;
      });
  }, [isAuthenticated, dispatch]);

  useEffect(() => {
    if (!isAuthenticated || skipNextSync.current) {
      skipNextSync.current = false;
      return;
    }
    const t = window.setTimeout(() => {
      void syncWishlist({ productIds: items });
    }, 400);
    return () => window.clearTimeout(t);
  }, [items, isAuthenticated, syncWishlist]);

  const toggle = useCallback(
    (productId: string) => {
      dispatch(toggleWishlist(productId));
    },
    [dispatch]
  );

  const hydrateFromServer = useCallback(
    (ids: string[]) => {
      skipNextSync.current = true;
      dispatch(setWishlist(ids));
    },
    [dispatch]
  );

  return { items, toggle, hydrateFromServer };
}
