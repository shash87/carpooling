import { NextResponse } from "next/server";
import { getAuthSession } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getAuthSession();
    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: params.userId },
      include: {
        kyc: true,
        ridesOffered: {
          select: {
            id: true,
            status: true,
          },
        },
        bookings: {
          select: {
            id: true,
            status: true,
          },
        },
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Calculate ride statistics
    const rides = {
      total: user.ridesOffered.length,
      completed: user.ridesOffered.filter((ride) => ride.status === "COMPLETED")
        .length,
      cancelled: user.ridesOffered.filter((ride) => ride.status === "CANCELLED")
        .length,
    };

    // Calculate booking statistics
    const bookings = {
      total: user.bookings.length,
      completed: user.bookings.filter(
        (booking) => booking.status === "COMPLETED"
      ).length,
      cancelled: user.bookings.filter(
        (booking) => booking.status === "CANCELLED"
      ).length,
    };

    return NextResponse.json({
      ...user,
      rides,
      bookings,
    });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getAuthSession();
    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { action } = body;

    const user = await prisma.user.findUnique({
      where: { id: params.userId },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    switch (action) {
      case "promote":
        await prisma.user.update({
          where: { id: params.userId },
          data: { role: "ADMIN" },
        });
        break;

      case "suspend":
        await prisma.user.update({
          where: { id: params.userId },
          data: { suspended: true },
        });
        break;

      case "delete":
        await prisma.user.delete({
          where: { id: params.userId },
        });
        break;

      default:
        return new NextResponse("Invalid action", { status: 400 });
    }

    return new NextResponse("Action completed successfully");
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}