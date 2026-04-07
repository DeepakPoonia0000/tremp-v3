import mongoose, { Schema, type Model, type Types } from "mongoose";

export interface IProduct {
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
  collections: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true },
    comparePrice: { type: Number },
    images: [{ type: String }],
    category: { type: String, default: "general" },
    sizes: [{ type: String }],
    colors: [{ type: String }],
    stock: { type: Number, default: 0 },
    tags: [{ type: String }],
    isFeatured: { type: Boolean, default: false },
    collections: [{ type: Schema.Types.ObjectId, ref: "Collection" }],
  },
  { timestamps: true }
);

ProductSchema.index({ name: "text", description: "text", tags: "text" });

const Product: Model<IProduct> =
  mongoose.models.Product ?? mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
