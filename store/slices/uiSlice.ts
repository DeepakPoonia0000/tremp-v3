import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type ToastType = "default" | "success" | "error";

interface UiState {
  mobileMenuOpen: boolean;
  filterDrawerOpen: boolean;
  toast: {
    message: string;
    type: ToastType;
    visible: boolean;
  };
}

const initialState: UiState = {
  mobileMenuOpen: false,
  filterDrawerOpen: false,
  toast: { message: "", type: "default", visible: false },
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleMobileMenu(state) {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    toggleFilterDrawer(state) {
      state.filterDrawerOpen = !state.filterDrawerOpen;
    },
    showToast(
      state,
      action: PayloadAction<{ message: string; type?: ToastType }>
    ) {
      state.toast = {
        message: action.payload.message,
        type: action.payload.type ?? "default",
        visible: true,
      };
    },
    hideToast(state) {
      state.toast.visible = false;
    },
  },
});

export const { toggleMobileMenu, toggleFilterDrawer, showToast, hideToast } =
  uiSlice.actions;

export default uiSlice.reducer;
