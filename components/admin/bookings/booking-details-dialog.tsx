"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface BookingDetailsDialogProps {
  booking: any;
  open: boolean;
  onClose: () => void;
}

export default function BookingDetailsDialog({
  booking,
  open,
  onClose,
}: BookingDetailsDialogProps) {
  if (!booking) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Booking Details</DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Passenger Details
              </h3>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={booking.passenger.image} />
                  <AvatarFallback>
                    {booking.passenger.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{booking.passenger.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {booking.passenger.email}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Driver Details
              </h3>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={booking.ride.driver.image} />
                  <AvatarFallback>
                    {booking.ride.driver.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{booking.ride.driver.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {booking.ride.driver.email}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Ride Details
            </h3>
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">From</p>
                  <p className="font-medium">{booking.ride.startLocation}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">To</p>
                  <p className="font-medium">{booking.ride.endLocation}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Start Time</p>
                <p className="font-medium">
                  {format(new Date(booking.ride.startTime), "PPP p")}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Vehicle</p>
                  <p className="font-medium">
                    {booking.ride.vehicle.make} {booking.ride.vehicle.model}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Registration Number
                  </p>
                  <p className="font-medium">
                    {booking.ride.vehicle.registrationNumber}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Booking Status
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm">Status</p>
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
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm">Seats Booked</p>
                  <p className="font-medium">{booking.seatsBooked}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm">Total Amount</p>
                  <p className="font-medium">₹{booking.totalPrice}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Payment Details
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm">Payment Status</p>
                  <Badge
                    variant={
                      booking.payment?.status === "COMPLETED"
                        ? "success"
                        : "secondary"
                    }
                  >
                    {booking.payment?.status || "PENDING"}
                  </Badge>
                </div>
                {booking.payment?.razorpayPaymentId && (
                  <div className="flex items-center justify-between">
                    <p className="text-sm">Payment ID</p>
                    <p className="font-medium">
                      {booking.payment.razorpayPaymentId}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Booking Timeline
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm">Created At</p>
                <p className="font-medium">
                  {format(new Date(booking.createdAt), "PPP p")}
                </p>
              </div>
              {booking.updatedAt && (
                <div className="flex items-center justify-between">
                  <p className="text-sm">Last Updated</p>
                  <p className="font-medium">
                    {format(new Date(booking.updatedAt), "PPP p")}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}