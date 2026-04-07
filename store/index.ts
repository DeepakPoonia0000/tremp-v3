import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import cartReducer from "@/store/slices/cartSlice";
import wishlistReducer from "@/store/slices/wishlistSlice";
import uiReducer from "@/store/slices/uiSlice";
import { api } from "@/store/api";

const noopStorage = {
  getItem: () => Promise.resolve(null),
  setItem: () => Promise.resolve(),
  removeItem: () => Promise.resolve(),
};

const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : noopStorage;

const rootReducer = combineReducers({
  cart: cartReducer,
  wishlist: wishlistReducer,
  ui: uiReducer,
  [api.reducerPath]: api.reducer,
});

const persistConfig = {
  key: "tremp-store",
  storage,
  whitelist: ["cart", "wishlist"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(api.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
