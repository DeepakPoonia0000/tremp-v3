import mongoose, { Schema, type Model, type Types } from "mongoose";
import type { OrderStatus, ShippingAddressDTO, OrderItemDTO } from "@/types/order";

export interface IOrder {
  user: Types.ObjectId;
  items: OrderItemDTO[];
  total: number;
  status: OrderStatus;
  shippingAddress: ShippingAddressDTO;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: Date;
}

const OrderItemSchema = new Schema<OrderItemDTO>(
  {
    product: { type: String, required: true },
    name: { type: String, required: true },
    image: { type: String },
    qty: { type: Number, required: true },
    size: { type: String },
    color: { type: String },
    price: { type: Number, required: true },
  },
  { _id: false }
);

const ShippingSchema = new Schema<ShippingAddressDTO>(
  {
    fullName: { type: String, required: true },
    line1: { type: String, required: true },
    line2: { type: String },
    city: { type: String, required: true },
    state: { type: String },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [OrderItemSchema],
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    shippingAddress: { type: ShippingSchema, required: true },
    paymentMethod: { type: String, default: "card" },
    paymentStatus: { type: String, default: "pending" },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const Order: Model<IOrder> =
  mongoose.models.Order ?? mongoose.model<IOrder>("Order", OrderSchema);

export default Order;
