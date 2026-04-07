import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { DataTable } from "@/components/admin/DataTable";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminUsersPage() {
  await connectDB();
  const users = await User.find({})
    .sort({ createdAt: -1 })
    .limit(500)
    .lean();

  return (
    <div>
      <h1 className="text-2xl font-semibold">Users</h1>
      <div className="mt-8">
        <DataTable
          columns={[
            { key: "name", label: "Name" },
            { key: "email", label: "Email" },
            { key: "role", label: "Role" },
            { key: "created", label: "Joined" },
          ]}
          rows={users.map((u) => ({
            name: u.name ?? "—",
            email: u.email,
            role: u.role,
            created: new Date(u.createdAt).toLocaleDateString(),
          }))}
        />
      </div>
    </div>
  );
}
