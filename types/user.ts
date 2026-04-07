export type UserRole = "user" | "admin";

export interface UserDTO {
  _id: string;
  name?: string | null;
  email: string;
  image?: string | null;
  role: UserRole;
  googleId?: string;
  wishlist: string[];
  createdAt: string;
}
