import mongoose, { Schema, type Model, type Types } from "mongoose";

export interface IBlog {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  featuredImage: string;
  isPublished: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true, default: "Admin" },
    category: { type: String, required: true, default: "general" },
    tags: [{ type: String }],
    featuredImage: { type: String, default: "" },
    isPublished: { type: Boolean, default: false },
    publishedAt: { type: Date },
  },
  { timestamps: true }
);

BlogSchema.index({ title: "text", excerpt: "text", content: "text", tags: "text" });
BlogSchema.index({ category: 1, publishedAt: -1 });
BlogSchema.index({ isPublished: 1, publishedAt: -1 });

const Blog: Model<IBlog> =
  mongoose.models.Blog ?? mongoose.model<IBlog>("Blog", BlogSchema);

export default Blog;
