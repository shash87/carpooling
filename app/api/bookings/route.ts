import { NextResponse } from "next/server";
import { getAuthSession } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getAuthSession();
    
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { rideId, seatsBooked } = body;

    const ride = await prisma.ride.findUnique({
      where: { id: rideId },
    });

    if (!ride) {
      return new NextResponse("Ride not found", { status: 404 });
    }

    if (ride.availableSeats < seatsBooked) {
      return new NextResponse("Not enough seats available", { status: 400 });
    }

    const totalPrice = ride.pricePerSeat * seatsBooked;

    const booking = await prisma.booking.create({
      data: {
        ride: {
          connect: { id: rideId },
        },
        passenger: {
          connect: { id: session.user.id },
        },
        seatsBooked,
        totalPrice,
      },
      include: {
        ride: true,
        passenger: true,
      },
    });

    // Update available seats
    await prisma.ride.update({
      where: { id: rideId },
      data: {
        availableSeats: ride.availableSeats - seatsBooked,
      },
    });

    return NextResponse.json(booking);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}