"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { Car, MapPin, Calendar, Clock, Users, IndianRupee } from "lucide-react";
import { format } from "date-fns";
import PaymentModal from "@/components/payment/payment-modal";

interface RideCardProps {
  ride: {
    id: string;
    startLocation: string;
    endLocation: string;
    startTime: string;
    endTime: string;
    availableSeats: number;
    pricePerSeat: number;
    driver: {
      id: string;
      name: string;
      image: string;
    };
    vehicle: {
      make: string;
      model: string;
    };
  };
}

export default function RideCard({ ride }: RideCardProps) {
  const [isBooking, setIsBooking] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const { toast } = useToast();

  const handleBooking = async () => {
    try {
      setIsBooking(true);
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rideId: ride.id,
          seatsBooked: 1,
        }),
      });

      if (!response.ok) throw new Error("Failed to book ride");
      
      const booking = await response.json();
      setBookingId(booking.id);
      setShowPayment(true);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to book ride",
      });
    } finally {
      setIsBooking(false);
    }
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    toast({
      title: "Success",
      description: "Ride booked successfully",
    });
  };

  return (
    <>
      <div className="bg-card p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <Avatar>
                <AvatarImage src={ride.driver.image} />
                <AvatarFallback>{ride.driver.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{ride.driver.name}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Car className="h-4 w-4" />
                  {ride.vehicle.make} {ride.vehicle.model}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>From: {ride.startLocation}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{format(new Date(ride.startTime), "MMM d, yyyy")}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{format(new Date(ride.startTime), "h:mm a")}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>To: {ride.endLocation}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{ride.availableSeats} seats available</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <IndianRupee className="h-4 w-4 text-muted-foreground" />
                  <span>₹{ride.pricePerSeat} per seat</span>
                </div>
              </div>
            </div>
          </div>

          <Button
            onClick={handleBooking}
            disabled={isBooking || ride.availableSeats === 0}
          >
            {isBooking ? "Booking..." : "Book Now"}
          </Button>
        </div>
      </div>

      <PaymentModal
        bookingId={bookingId}
        amount={ride.pricePerSeat}
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        onSuccess={handlePaymentSuccess}
      />
    </>
  );
}