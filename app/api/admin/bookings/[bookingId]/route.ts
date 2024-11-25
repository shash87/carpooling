import { NextResponse } from "next/server";
import { getAuthSession } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: { bookingId: string } }
) {
  try {
    const session = await getAuthSession();
    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { status } = body;

    const booking = await prisma.booking.update({
      where: { id: params.bookingId },
      data: { status },
      include: {
        passenger: {
          select: {
            email: true,
          },
        },
      },
    });

    // If the booking is cancelled, update the ride's available seats
    if (status === "CANCELLED") {
      await prisma.ride.update({
        where: { id: booking.rideId },
        data: {
          availableSeats: {
            increment: booking.seatsBooked,
          },
        },
      });
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}