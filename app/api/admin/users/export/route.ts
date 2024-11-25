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
    const { userIds } = body;

    const users = await prisma.user.findMany({
      where: userIds ? { id: { in: userIds } } : undefined,
      include: {
        kyc: {
          select: {
            isVerified: true,
            documentType: true,
            submittedAt: true,
            verifiedAt: true,
          },
        },
        ridesOffered: {
          select: {
            id: true,
          },
        },
        bookings: {
          select: {
            id: true,
          },
        },
      },
    });

    // Transform data for export
    const exportData = users.map(user => ({
      ID: user.id,
      Name: user.name,
      Email: user.email,
      Role: user.role,
      EmailVerified: user.emailVerified ? "Yes" : "No",
      KYCStatus: user.kyc?.isVerified ? "Verified" : "Pending",
      KYCDocumentType: user.kyc?.documentType || "N/A",
      KYCSubmittedAt: user.kyc?.submittedAt || "N/A",
      KYCVerifiedAt: user.kyc?.verifiedAt || "N/A",
      RidesOffered: user.ridesOffered.length,
      BookingsMade: user.bookings.length,
      JoinedAt: user.createdAt,
    }));

    return NextResponse.json(exportData);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}