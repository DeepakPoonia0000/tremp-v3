import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl =
  typeof window !== "undefined"
    ? ""
    : process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

export type WishlistProductRow = {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number;
  image?: string;
};

function mapProductRow(p: Record<string, unknown>): WishlistProductRow {
  return {
    id: String(p._id),
    name: String(p.name),
    slug: String(p.slug),
    price: Number(p.price),
    comparePrice:
      p.comparePrice != null ? Number(p.comparePrice) : undefined,
    image:
      Array.isArray(p.images) && p.images[0]
        ? String(p.images[0])
        : undefined,
  };
}

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/api`,
    credentials: "include",
  }),
  tagTypes: ["Wishlist", "User", "WishlistProducts"],
  endpoints: (builder) => ({
    syncWishlist: builder.mutation<void, { productIds: string[] }>({
      query: (body) => ({
        url: "/users",
        method: "PATCH",
        body: { wishlist: body.productIds },
      }),
      invalidatesTags: ["Wishlist", "User"],
    }),
    wishlistProducts: builder.query<WishlistProductRow[], string>({
      query: (ids) => `/products?ids=${encodeURIComponent(ids)}`,
      transformResponse: (rows: Record<string, unknown>[]) =>
        rows.map(mapProductRow),
      providesTags: (_result, _err, ids) => [{ type: "WishlistProducts", id: ids }],
    }),
  }),
});

export const { useSyncWishlistMutation, useWishlistProductsQuery } = api;
