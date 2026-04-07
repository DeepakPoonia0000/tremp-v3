export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface OrderItemDTO {
  product: string;
  name: string;
  image?: string;
  qty: number;
  size?: string;
  color?: string;
  price: number;
}

export interface ShippingAddressDTO {
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
}

export interface OrderDTO {
  _id: string;
  user: string;
  items: OrderItemDTO[];
  total: number;
  status: OrderStatus;
  shippingAddress: ShippingAddressDTO;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
}
