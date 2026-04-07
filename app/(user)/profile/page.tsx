import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/profile");

  return (
    <div>
      <h1 className="text-2xl font-semibold">Profile</h1>
      <dl className="mt-6 space-y-2 text-sm">
        <div>
          <dt className="text-muted-foreground">Name</dt>
          <dd>{session.user.name ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Email</dt>
          <dd>{session.user.email}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Role</dt>
          <dd className="capitalize">{session.user.role}</dd>
        </div>
      </dl>
    </div>
  );
}
