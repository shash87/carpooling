import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import RidesTable from "@/components/admin/rides/rides-table";
import RidesFilters from "@/components/admin/rides/rides-filters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, CheckCircle, XCircle, Clock } from "lucide-react";

export default function RidesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Rides Management</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Rides</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Skeleton className="h-7 w-20" />}>
              <RideCount type="total" />
            </Suspense>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Rides</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Skeleton className="h-7 w-20" />}>
              <RideCount type="active" />
            </Suspense>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Skeleton className="h-7 w-20" />}>
              <RideCount type="completed" />
            </Suspense>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Skeleton className="h-7 w-20" />}>
              <RideCount type="cancelled" />
            </Suspense>
          </CardContent>
        </Card>
      </div>

      <RidesFilters />

      <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
        <RidesTable />
      </Suspense>
    </div>
  );
}

async function RideCount({ type }: { type: "total" | "active" | "completed" | "cancelled" }) {
  const response = await fetch(`/api/admin/rides/count?type=${type}`, {
    next: { revalidate: 60 },
  });
  const { count } = await response.json();

  return (
    <div>
      <div className="text-2xl font-bold">{count}</div>
      <p className="text-xs text-muted-foreground">
        {type === "total" && "Total rides"}
        {type === "active" && "Currently active rides"}
        {type === "completed" && "Completed rides"}
        {type === "cancelled" && "Cancelled rides"}
      </p>
    </div>
  );
}