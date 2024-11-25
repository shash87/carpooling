import { NextResponse } from "next/server";
import { getAuthSession } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { userIds, action } = body;

    if (!userIds || !Array.isArray(userIds)) {
      return new NextResponse("Invalid user IDs", { status: 400 });
    }

    switch (action) {
      case "verify":
        await prisma.userKyc.updateMany({
          where: {
            userId: {
              in: userIds,
            },
          },
          data: {
            isVerified: true,
            verifiedAt: new Date(),
          },
        });
        break;

      case "suspend":
        await prisma.user.updateMany({
          where: {
            id: {
              in: userIds,
            },
            role: {
              not: "ADMIN",
            },
          },
          data: {
            suspended: true,
          },
        });
        break;

      default:
        return new NextResponse("Invalid action", { status: 400 });
    }

    return new NextResponse("Bulk action completed successfully");
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}