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
    const type = searchParams.get("type");

    let count = 0;

    switch (type) {
      case "total":
        count = await prisma.user.count();
        break;
      case "verified":
        count = await prisma.user.count({
          where: {
            kyc: {
              isVerified: true,
            },
          },
        });
        break;
      case "pending":
        count = await prisma.user.count({
          where: {
            kyc: {
              isVerified: false,
            },
          },
        });
        break;
      default:
        return new NextResponse("Invalid count type", { status: 400 });
    }

    return NextResponse.json({ count });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}