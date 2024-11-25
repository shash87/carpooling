import { NextResponse } from "next/server";
import { getAuthSession } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getAuthSession();
    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const [
      totalUsers,
      newUsers,
      activeRides,
      completedRides,
      totalRevenue,
      pendingKyc,
      verifiedToday,
    ] = await Promise.all([
      // Total users
      prisma.user.count(),
      
      // New users this week
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),
      
      // Active rides
      prisma.ride.count({
        where: {
          startTime: {
            gte: new Date(),
          },
        },
      }),
      
      // Completed rides today
      prisma.ride.count({
        where: {
          endTime: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lt: new Date(new Date().setHours(23, 59, 59, 999)),
          },
        },
      }),
      
      // Total revenue
      prisma.payment.aggregate({
        where: {
          status: "COMPLETED",
        },
        _sum: {
          amount: true,
        },
      }),
      
      // Pending KYC verifications
      prisma.userKyc.count({
        where: {
          isVerified: false,
        },
      }),
      
      // KYC verified today
      prisma.userKyc.count({
        where: {
          verifiedAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lt: new Date(new Date().setHours(23, 59, 59, 999)),
          },
        },
      }),
    ]);

    // Calculate revenue growth
    const currentMonthRevenue = await prisma.payment.aggregate({
      where: {
        status: "COMPLETED",
        createdAt: {
          gte: new Date(new Date().setDate(1)),
        },
      },
      _sum: {
        amount: true,
      },
    });

    const lastMonthRevenue = await prisma.payment.aggregate({
      where: {
        status: "COMPLETED",
        createdAt: {
          gte: new Date(new Date().setMonth(new Date().getMonth() - 1, 1)),
          lt: new Date(new Date().setDate(1)),
        },
      },
      _sum: {
        amount: true,
      },
    });

    const revenueGrowth = lastMonthRevenue._sum.amount
      ? ((currentMonthRevenue._sum.amount || 0) - lastMonthRevenue._sum.amount) /
        lastMonthRevenue._sum.amount *
        100
      : 0;

    return NextResponse.json({
      totalUsers,
      newUsers,
      activeRides,
      completedRides,
      totalRevenue: totalRevenue._sum.amount || 0,
      revenueGrowth: Math.round(revenueGrowth * 100) / 100,
      pendingKyc,
      verifiedToday,
    });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}