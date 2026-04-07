import { HomepageSectionManager } from "@/components/admin/HomepageSectionManager";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function AdminHomepagePage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Homepage CMS</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Reorder sections, toggle visibility, and edit hero copy.
      </p>
      <div className="mt-8">
        <HomepageSectionManager />
      </div>
    </div>
  );
}
