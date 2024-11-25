import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import BookingsTable from "@/components/admin/bookings/bookings-table";
import BookingsFilters from "@/components/admin/bookings/bookings-filters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarCheck, Clock, Ban, IndianRupee } from "lucide-react";

export default function BookingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Bookings Management</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Skeleton className="h-7 w-20" />}>
              <BookingCount type="total" />
            </Suspense>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Skeleton className="h-7 w-20" />}>
              <BookingCount type="pending" />
            </Suspense>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
            <Ban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Skeleton className="h-7 w-20" />}>
              <BookingCount type="cancelled" />
            </Suspense>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Skeleton className="h-7 w-20" />}>
              <BookingRevenue />
            </Suspense>
          </CardContent>
        </Card>
      </div>

      <BookingsFilters />

      <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
        <BookingsTable />
      </Suspense>
    </div>
  );
}

async function BookingCount({ type }: { type: "total" | "pending" | "cancelled" }) {
  const response = await fetch(`/api/admin/bookings/count?type=${type}`, {
    next: { revalidate: 60 },
  });
  const { count } = await response.json();

  return (
    <div>
      <div className="text-2xl font-bold">{count}</div>
      <p className="text-xs text-muted-foreground">
        {type === "total" && "Total bookings"}
        {type === "pending" && "Pending confirmation"}
        {type === "cancelled" && "Cancelled bookings"}
      </p>
    </div>
  );
}

async function BookingRevenue() {
  const response = await fetch("/api/admin/bookings/revenue", {
    next: { revalidate: 60 },
  });
  const { revenue } = await response.json();

  return (
    <div>
      <div className="text-2xl font-bold">₹{revenue.toLocaleString()}</div>
      <p className="text-xs text-muted-foreground">Total revenue generated</p>
    </div>
  );
}