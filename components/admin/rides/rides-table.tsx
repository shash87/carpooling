"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { MoreVertical, Eye, Ban, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import RideDetailsDialog from "./ride-details-dialog";

interface Ride {
  id: string;
  startLocation: string;
  endLocation: string;
  startTime: string;
  endTime: string;
  status: string;
  driver: {
    name: string;
    email: string;
    image: string;
  };
  vehicle: {
    make: string;
    model: string;
    registrationNumber: string;
  };
  bookings: any[];
}

export default function RidesTable() {
  const [rides, setRides] = useState<Ride[]>([]);
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleStatusChange = async (rideId: string, status: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/admin/rides/${rideId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error("Failed to update ride status");

      toast({
        title: "Success",
        description: "Ride status updated successfully",
      });

      // Refresh rides
      fetchRides();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update ride status",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRides = async () => {
    try {
      const response = await fetch("/api/admin/rides");
      const data = await response.json();
      setRides(data);
    } catch (error) {
      console.error("Failed to fetch rides:", error);
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Driver</TableHead>
              <TableHead>Route</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Bookings</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rides.map((ride) => (
              <TableRow key={ride.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={ride.driver.image} />
                      <AvatarFallback>
                        {ride.driver.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{ride.driver.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {ride.driver.email}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">From: {ride.startLocation}</p>
                    <p className="text-sm font-medium">To: {ride.endLocation}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <p className="text-sm">
                      {format(new Date(ride.startTime), "MMM d, h:mm a")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      to {format(new Date(ride.endTime), "h:mm a")}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      {ride.vehicle.make} {ride.vehicle.model}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {ride.vehicle.registrationNumber}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      ride.status === "COMPLETED"
                        ? "success"
                        : ride.status === "CANCELLED"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {ride.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{ride.bookings.length}</Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setSelectedRide(ride)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      {ride.status === "SCHEDULED" && (
                        <>
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusChange(ride.id, "CANCELLED")
                            }
                          >
                            <Ban className="mr-2 h-4 w-4" />
                            Cancel Ride
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusChange(ride.id, "COMPLETED")
                            }
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Mark as Completed
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <RideDetailsDialog
        ride={selectedRide}
        open={!!selectedRide}
        onClose={() => setSelectedRide(null)}
      />
    </>
  );
}