import { ProductNewForm } from "@/app/admin/products/new/product-new-form";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function AdminNewProductPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">New product</h1>
      <div className="mt-8">
        <ProductNewForm />
      </div>
    </div>
  );
}
