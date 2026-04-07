import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface WishlistState {
  items: string[];
}

const initialState: WishlistState = {
  items: [],
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    toggleWishlist(state, action: PayloadAction<string>) {
      const id = action.payload;
      if (state.items.includes(id)) {
        state.items = state.items.filter((x) => x !== id);
      } else {
        state.items.push(id);
      }
    },
    setWishlist(state, action: PayloadAction<string[]>) {
      state.items = action.payload;
    },
  },
});

export const { toggleWishlist, setWishlist } = wishlistSlice.actions;

export default wishlistSlice.reducer;
