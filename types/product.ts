import type { Types } from "mongoose";

export interface ProductDTO {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number;
  images: string[];
  category: string;
  sizes: string[];
  colors: string[];
  stock: number;
  tags: string[];
  isFeatured: boolean;
  collections: Types.ObjectId[] | string[];
  createdAt: string;
  updatedAt: string;
}
