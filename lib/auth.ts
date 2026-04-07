import { auth as getAuth } from "@/auth";

export async function getServerSession() {
  return getAuth();
}
