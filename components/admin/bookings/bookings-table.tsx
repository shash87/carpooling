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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { MoreVertical, Eye, Ban, Trash2 } from "lucide-react";
import { format } from "date-fns";
import BookingDetailsDialog from "./booking-details-dialog";

interface Booking {
  id: string;
  status: string;
  seatsBooked: number;
  totalPrice: number;
  createdAt: string;
  passenger: {
    name: string;
    email: string;
    image: string;
  };
  ride: {
    startLocation: string;
    endLocation: string;
    startTime: string;
    driver: {
      name: string;
      email: string;
      image: string;
    };
  };
  payment?: {
    status: string;
  };
}

export default function BookingsTable() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [bookingToDelete, setBookingToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleStatusChange = async (bookingId: string, status: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error("Failed to update booking status");

      toast({
        title: "Success",
        description: "Booking status updated successfully",
      });

      fetchBookings();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update booking status",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!bookingToDelete) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/admin/bookings?id=${bookingToDelete}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete booking");

      toast({
        title: "Success",
        description: "Booking deleted successfully",
      });

      fetchBookings();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete booking",
      });
    } finally {
      setIsLoading(false);
      setBookingToDelete(null);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await fetch("/api/admin/bookings");
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Passenger</TableHead>
              <TableHead>Driver</TableHead>
              <TableHead>Route</TableHead>
              <TableHead>Seats</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={booking.passenger.image} />
                      <AvatarFallback>
                        {booking.passenger.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{booking.passenger.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {booking.passenger.email}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={booking.ride.driver.image} />
                      <AvatarFallback>
                        {booking.ride.driver.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{booking.ride.driver.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {booking.ride.driver.email}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      From: {booking.ride.startLocation}
                    </p>
                    <p className="text-sm font-medium">
                      To: {booking.ride.endLocation}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(booking.ride.startTime), "MMM d, h:mm a")}
                    </p>
                  </div>
                </TableCell>
                <TableCell>{booking.seatsBooked}</TableCell>
                <TableCell>₹{booking.totalPrice}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      booking.status === "COMPLETED"
                        ? "success"
                        : booking.status === "CANCELLED"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {booking.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      booking.payment?.status === "COMPLETED"
                        ? "success"
                        : "secondary"
                    }
                  >
                    {booking.payment?.status || "PENDING"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setSelectedBooking(booking)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      {booking.status === "PENDING" && (
                        <DropdownMenuItem
                          onClick={() =>
                            handleStatusChange(booking.id, "CANCELLED")
                          }
                        >
                          <Ban className="mr-2 h-4 w-4" />
                          Cancel Booking
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => setBookingToDelete(booking.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Booking
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <BookingDetailsDialog
        booking={selectedBooking}
        open={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
      />

      <AlertDialog open={!!bookingToDelete} onOpenChange={() => setBookingToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              booking and all related data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}