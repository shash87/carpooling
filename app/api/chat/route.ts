import { NextResponse } from "next/server";
import { getAuthSession } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";

export async function POST(request: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { bookingId, message } = body;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        ride: {
          include: {
            driver: true,
          },
        },
        passenger: true,
      },
    });

    if (!booking) {
      return new NextResponse("Booking not found", { status: 404 });
    }

    // Verify user is either the driver or passenger
    if (
      session.user.id !== booking.passenger.id &&
      session.user.id !== booking.ride.driver.id
    ) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const chat = await prisma.chat.create({
      data: {
        message,
        sender: {
          connect: { id: session.user.id },
        },
        booking: {
          connect: { id: bookingId },
        },
      },
      include: {
        sender: true,
      },
    });

    // Trigger real-time update
    await pusherServer.trigger(`booking-${bookingId}`, "new-message", {
      ...chat,
      sender: {
        id: chat.sender.id,
        name: chat.sender.name,
        image: chat.sender.image,
      },
    });

    return NextResponse.json(chat);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}