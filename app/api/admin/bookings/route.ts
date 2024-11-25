import { NextResponse } from "next/server";
import { getAuthSession } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const status = searchParams.get("status");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const bookings = await prisma.booking.findMany({
      where: {
        OR: search
          ? [
              {
                passenger: {
                  OR: [
                    { name: { contains: search, mode: "insensitive" } },
                    { email: { contains: search, mode: "insensitive" } },
                  ],
                },
              },
              {
                ride: {
                  OR: [
                    { startLocation: { contains: search, mode: "insensitive" } },
                    { endLocation: { contains: search, mode: "insensitive" } },
                  ],
                },
              },
            ]
          : undefined,
        status: status || undefined,
        createdAt: {
          gte: startDate ? new Date(startDate) : undefined,
          lte: endDate ? new Date(endDate) : undefined,
        },
      },
      include: {
        passenger: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        ride: {
          include: {
            driver: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
            vehicle: true,
          },
        },
        payment: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get("id");

    if (!bookingId) {
      return new NextResponse("Booking ID is required", { status: 400 });
    }

    // Delete the booking and related records
    await prisma.booking.delete({
      where: { id: bookingId },
    });

    return new NextResponse("Booking deleted successfully");
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}