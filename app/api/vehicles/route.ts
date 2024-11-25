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
    const { make, model, year, registrationNumber, seatCount } = body;

    const vehicle = await prisma.vehicle.create({
      data: {
        make,
        model,
        year,
        registrationNumber,
        seatCount,
        owner: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });

    return NextResponse.json(vehicle);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const session = await getAuthSession();
    
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const vehicles = await prisma.vehicle.findMany({
      where: {
        ownerId: session.user.id,
      },
    });

    return NextResponse.json(vehicles);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}