import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import TicketsTable from "@/components/admin/support/tickets-table";
import TicketsFilters from "@/components/admin/support/tickets-filters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, AlertCircle, CheckCircle, Clock } from "lucide-react";

export default function SupportPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Support Tickets</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Skeleton className="h-7 w-20" />}>
              <TicketCount type="total" />
            </Suspense>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Open</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Skeleton className="h-7 w-20" />}>
              <TicketCount type="open" />
            </Suspense>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Skeleton className="h-7 w-20" />}>
              <TicketCount type="in_progress" />
            </Suspense>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Skeleton className="h-7 w-20" />}>
              <TicketCount type="closed" />
            </Suspense>
          </CardContent>
        </Card>
      </div>

      <TicketsFilters />

      <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
        <TicketsTable />
      </Suspense>
    </div>
  );
}

async function TicketCount({ type }: { type: "total" | "open" | "in_progress" | "closed" }) {
  const response = await fetch(`/api/admin/support/count?type=${type}`, {
    next: { revalidate: 60 },
  });
  const { count } = await response.json();

  return (
    <div>
      <div className="text-2xl font-bold">{count}</div>
      <p className="text-xs text-muted-foreground">
        {type === "total" && "Total tickets"}
        {type === "open" && "Open tickets"}
        {type === "in_progress" && "In progress"}
        {type === "closed" && "Resolved tickets"}
      </p>
    </div>
  );
}