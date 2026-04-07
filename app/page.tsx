import { HomepageSections } from "@/components/homepage/HomepageSections";

/** Dynamic: requires MongoDB at request time (build/CI may not have a database). */
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl space-y-16 px-4 py-10 sm:px-6">
      <HomepageSections />
    </div>
  );
}
