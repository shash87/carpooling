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
    const { documentType, documentNumber, address, documentImage } = body;

    const kyc = await prisma.userKyc.create({
      data: {
        documentType,
        documentNumber,
        address,
        documentImage,
        user: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });

    return NextResponse.json(kyc);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}