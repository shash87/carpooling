import { NextResponse } from "next/server";
import { getAuthSession } from "@/app/api/auth/[...nextauth]/route";
import { razorpay } from "@/lib/razorpay";
import prisma from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import BookingConfirmationEmail from "@/emails/booking-confirmation";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      paymentId,
    } = body;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return new NextResponse("Invalid signature", { status: 400 });
    }

    const payment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: "COMPLETED",
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
      },
      include: {
        booking: {
          include: {
            ride: {
              include: {
                driver: true,
              },
            },
            passenger: true,
          },
        },
      },
    });

    // Send booking confirmation email
    if (payment.booking?.passenger.email) {
      await sendEmail({
        to: payment.booking.passenger.email,
        subject: "Booking Confirmation - GOALYFT",
        react: BookingConfirmationEmail({
          passengerName: payment.booking.passenger.name || "Valued Customer",
          driverName: payment.booking.ride.driver.name || "Your Driver",
          startLocation: payment.booking.ride.startLocation,
          endLocation: payment.booking.ride.endLocation,
          startTime: payment.booking.ride.startTime,
          seatsBooked: payment.booking.seatsBooked,
          totalAmount: payment.amount,
          bookingId: payment.booking.id,
        }),
      });
    }

    return NextResponse.json(payment);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}