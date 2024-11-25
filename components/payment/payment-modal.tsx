"use client";

import { useState } from "react";
import Script from "next/script";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

interface PaymentModalProps {
  bookingId: string;
  amount: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PaymentModal({
  bookingId,
  amount,
  isOpen,
  onClose,
  onSuccess,
}: PaymentModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handlePayment = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId }),
      });

      if (!response.ok) throw new Error("Failed to create payment");
      const data = await response.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: "GOALYFT",
        description: "Ride Booking Payment",
        order_id: data.orderId,
        handler: async (response: any) => {
          try {
            const verifyResponse = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...response,
                paymentId: data.paymentId,
              }),
            });

            if (!verifyResponse.ok) throw new Error("Payment verification failed");

            toast({
              title: "Success",
              description: "Payment completed successfully",
            });
            onSuccess();
          } catch (error) {
            toast({
              variant: "destructive",
              title: "Error",
              description: "Payment verification failed",
            });
          }
        },
        prefill: {
          name: "John Doe",
          email: "john@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#000000",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to initiate payment",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />
      
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Payment</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-2xl font-bold">₹{amount}</p>
              <p className="text-sm text-muted-foreground">
                Secure payment via Razorpay
              </p>
            </div>

            <Button
              className="w-full"
              onClick={handlePayment}
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Pay Now
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}