import { NextResponse } from "next/server";
import { getAuthSession } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

export async function PATCH(
  request: Request,
  { params }: { params: { kycId: string } }
) {
  try {
    const session = await getAuthSession();
    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { action } = body;

    const kyc = await prisma.userKyc.findUnique({
      where: { id: params.kycId },
      include: {
        user: true,
      },
    });

    if (!kyc) {
      return new NextResponse("KYC verification not found", { status: 404 });
    }

    const updatedKyc = await prisma.userKyc.update({
      where: { id: params.kycId },
      data: {
        isVerified: action === "approve",
        verifiedAt: action === "approve" ? new Date() : null,
      },
      include: {
        user: true,
      },
    });

    // Send email notification
    if (kyc.user.email) {
      await sendEmail({
        to: kyc.user.email,
        subject: `KYC Verification ${action === "approve" ? "Approved" : "Rejected"}`,
        react: (
          <div>
            <h1>KYC Verification Update</h1>
            <p>
              Your KYC verification has been {action === "approve" ? "approved" : "rejected"}.
            </p>
          </div>
        ),
      });
    }

    return NextResponse.json(updatedKyc);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}