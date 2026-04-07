import { UserSidebar } from "@/components/layout/UserSidebar";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 md:flex-row sm:px-6">
      <UserSidebar />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
