"use client";

import { useCallback } from "react";
import {
  addItem,
  removeItem,
  updateQty,
  clearCart,
  toggleCart,
  setCartOpen,
  type CartItem,
} from "@/store/slices/cartSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export function useCart() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((s) => s.cart.items);
  const isOpen = useAppSelector((s) => s.cart.isOpen);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  return {
    items,
    isOpen,
    subtotal,
    add: useCallback(
      (item: CartItem) => {
        dispatch(addItem(item));
      },
      [dispatch]
    ),
    remove: useCallback(
      (payload: { productId: string; size?: string; color?: string }) => {
        dispatch(removeItem(payload));
      },
      [dispatch]
    ),
    updateQuantity: useCallback(
      (payload: {
        productId: string;
        size?: string;
        color?: string;
        qty: number;
      }) => {
        dispatch(updateQty(payload));
      },
      [dispatch]
    ),
    clear: useCallback(() => dispatch(clearCart()), [dispatch]),
    toggle: useCallback(() => dispatch(toggleCart()), [dispatch]),
    setOpen: useCallback(
      (open: boolean) => dispatch(setCartOpen(open)),
      [dispatch]
    ),
  };
}
