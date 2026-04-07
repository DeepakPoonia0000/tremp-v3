import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Order from "@/models/Order";
import User from "@/models/User";
import { MetricsCard } from "@/components/admin/MetricsCard";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminDashboardPage() {
  await connectDB();
  const [productCount, orderCount, userCount] = await Promise.all([
    Product.countDocuments(),
    Order.countDocuments(),
    User.countDocuments(),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Overview of your store.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <MetricsCard title="Products" value={productCount} />
        <MetricsCard title="Orders" value={orderCount} />
        <MetricsCard title="Users" value={userCount} />
      </div>
    </div>
  );
}
