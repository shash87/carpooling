import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import UserTable from "@/components/admin/users/user-table";
import UserFilters from "@/components/admin/users/user-filters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, UserX } from "lucide-react";

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">User Management</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Skeleton className="h-7 w-20" />}>
              <UserCount type="total" />
            </Suspense>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Verified Users</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Skeleton className="h-7 w-20" />}>
              <UserCount type="verified" />
            </Suspense>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending KYC</CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Skeleton className="h-7 w-20" />}>
              <UserCount type="pending" />
            </Suspense>
          </CardContent>
        </Card>
      </div>

      <UserFilters />

      <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
        <UserTable />
      </Suspense>
    </div>
  );
}

async function UserCount({ type }: { type: "total" | "verified" | "pending" }) {
  const response = await fetch(`/api/admin/users/count?type=${type}`, {
    next: { revalidate: 60 },
  });
  const { count } = await response.json();

  return (
    <div>
      <div className="text-2xl font-bold">{count}</div>
      <p className="text-xs text-muted-foreground">
        {type === "total" && "Total registered users"}
        {type === "verified" && "Users with verified KYC"}
        {type === "pending" && "Users awaiting KYC verification"}
      </p>
    </div>
  );
}