import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  productId: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  qty: number;
  size?: string;
  color?: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

const initialState: CartState = {
  items: [],
  isOpen: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<CartItem>) {
      const existing = state.items.find(
        (i) =>
          i.productId === action.payload.productId &&
          i.size === action.payload.size &&
          i.color === action.payload.color
      );
      if (existing) {
        existing.qty += action.payload.qty;
      } else {
        state.items.push({ ...action.payload });
      }
    },
    removeItem(
      state,
      action: PayloadAction<{ productId: string; size?: string; color?: string }>
    ) {
      state.items = state.items.filter(
        (i) =>
          !(
            i.productId === action.payload.productId &&
            i.size === action.payload.size &&
            i.color === action.payload.color
          )
      );
    },
    updateQty(
      state,
      action: PayloadAction<{
        productId: string;
        size?: string;
        color?: string;
        qty: number;
      }>
    ) {
      const item = state.items.find(
        (i) =>
          i.productId === action.payload.productId &&
          i.size === action.payload.size &&
          i.color === action.payload.color
      );
      if (item) item.qty = Math.max(1, action.payload.qty);
    },
    clearCart(state) {
      state.items = [];
    },
    toggleCart(state) {
      state.isOpen = !state.isOpen;
    },
    setCartOpen(state, action: PayloadAction<boolean>) {
      state.isOpen = action.payload;
    },
  },
});

export const {
  addItem,
  removeItem,
  updateQty,
  clearCart,
  toggleCart,
  setCartOpen,
} = cartSlice.actions;

export default cartSlice.reducer;
