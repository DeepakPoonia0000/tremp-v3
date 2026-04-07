import mongoose, { Schema, type Model, type Types } from "mongoose";
import type { UserRole } from "@/types/user";

export interface IUser {
  name?: string;
  email: string;
  image?: string;
  role: UserRole;
  googleId?: string;
  wishlist: Types.ObjectId[];
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true, index: true },
    image: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    googleId: { type: String, index: true, sparse: true },
    wishlist: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const User: Model<IUser> =
  mongoose.models.User ?? mongoose.model<IUser>("User", UserSchema);

export default User;
