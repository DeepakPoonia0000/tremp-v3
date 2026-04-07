import mongoose, { Schema, type Model, type Types } from "mongoose";
import type { CollectionSeason } from "@/types/collection";

export interface ICollection {
  name: string;
  slug: string;
  description: string;
  bannerImage: string;
  season: CollectionSeason;
  products: Types.ObjectId[];
  isActive: boolean;
  sortOrder: number;
  metaTitle: string;
  metaDescription: string;
  createdAt: Date;
  updatedAt: Date;
}

const CollectionSchema = new Schema<ICollection>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, default: "" },
    bannerImage: { type: String, default: "" },
    season: {
      type: String,
      enum: ["summer", "winter", "spring", "fall", "all-year", "custom"],
      default: "all-year",
    },
    products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
  },
  { timestamps: true }
);

const Collection: Model<ICollection> =
  mongoose.models.Collection ??
  mongoose.model<ICollection>("Collection", CollectionSchema);

export default Collection;
