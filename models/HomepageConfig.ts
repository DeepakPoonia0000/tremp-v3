import mongoose, { Schema, type Model } from "mongoose";
import type { HomepageSection } from "@/types/homepage";

export interface IHomepageConfig {
  sections: HomepageSection[];
  updatedAt: Date;
}

const SectionSchema = new Schema<HomepageSection>(
  {
    id: { type: String, required: true },
    type: {
      type: String,
      enum: [
        "hero",
        "featured-collections",
        "featured-products",
        "banner",
        "announcement",
        "newsletter",
      ],
      required: true,
    },
    order: { type: Number, required: true },
    isVisible: { type: Boolean, default: true },
    data: { type: Schema.Types.Mixed, default: {} },
  },
  { _id: false }
);

const HomepageConfigSchema = new Schema<IHomepageConfig>(
  {
    sections: [SectionSchema],
  },
  { timestamps: { createdAt: false, updatedAt: true } }
);

const HomepageConfig: Model<IHomepageConfig> =
  mongoose.models.HomepageConfig ??
  mongoose.model<IHomepageConfig>("HomepageConfig", HomepageConfigSchema);

export default HomepageConfig;
