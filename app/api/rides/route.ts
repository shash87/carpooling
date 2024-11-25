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
    const {
      startLocation,
      endLocation,
      startTime,
      endTime,
      vehicleId,
      availableSeats,
      pricePerSeat,
    } = body;

    const ride = await prisma.ride.create({
      data: {
        startLocation,
        endLocation,
        startTime,
        endTime,
        availableSeats,
        pricePerSeat,
        driver: {
          connect: {
            id: session.user.id,
          },
        },
        vehicle: {
          connect: {
            id: vehicleId,
          },
        },
      },
      include: {
        driver: true,
        vehicle: true,
      },
    });

    return NextResponse.json(ride);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const startLocation = searchParams.get("startLocation");
    const endLocation = searchParams.get("endLocation");
    const date = searchParams.get("date");

    const rides = await prisma.ride.findMany({
      where: {
        startLocation: startLocation ? {
          contains: startLocation,
          mode: "insensitive",
        } : undefined,
        endLocation: endLocation ? {
          contains: endLocation,
          mode: "insensitive",
        } : undefined,
        startTime: date ? {
          gte: new Date(date),
          lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1)),
        } : undefined,
        availableSeats: {
          gt: 0,
        },
      },
      include: {
        driver: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        vehicle: true,
      },
      orderBy: {
        startTime: "asc",
      },
    });

    return NextResponse.json(rides);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}