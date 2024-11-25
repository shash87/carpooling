import { redirect } from "next/navigation";
import { getAuthSession } from "@/app/api/auth/[...nextauth]/route";
import AdminSidebar from "@/components/admin/sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAuthSession();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto bg-muted/50 p-8">
        {children}
      </main>
    </div>
  );
}