import { NextResponse } from "next/server";
import { getAuthSession } from "@/app/api/auth/[...nextauth]/route";
import { razorpay } from "@/lib/razorpay";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { bookingId } = body;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        ride: true,
      },
    });

    if (!booking) {
      return new NextResponse("Booking not found", { status: 404 });
    }

    const order = await razorpay.orders.create({
      amount: Math.round(booking.totalPrice * 100), // Convert to paise
      currency: "INR",
      receipt: bookingId,
    });

    const payment = await prisma.payment.create({
      data: {
        amount: booking.totalPrice,
        razorpayOrderId: order.id,
        user: { connect: { id: session.user.id } },
        booking: { connect: { id: bookingId } },
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      paymentId: payment.id,
    });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}