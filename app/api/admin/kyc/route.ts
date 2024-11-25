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
    const documentType = searchParams.get("documentType");
    const status = searchParams.get("status");

    const verifications = await prisma.userKyc.findMany({
      where: {
        documentType: documentType || undefined,
        isVerified: status === "verified" ? true : status === "pending" ? false : undefined,
        OR: search
          ? [
              {
                user: {
                  name: { contains: search, mode: "insensitive" },
                },
              },
              {
                user: {
                  email: { contains: search, mode: "insensitive" },
                },
              },
            ]
          : undefined,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: {
        submittedAt: "desc",
      },
    });

    return NextResponse.json(verifications);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}