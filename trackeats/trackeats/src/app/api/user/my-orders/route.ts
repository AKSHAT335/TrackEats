import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Order from "@/models/order.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDb();
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = new mongoose.Types.ObjectId(session.user.id);

    const orders = await Order.find({ user: userId })
      .populate("assignedDeliveryBoy", "name mobile")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error: any) {
    console.error("GET MY ORDERS ERROR:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
