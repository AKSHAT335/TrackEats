import { auth } from "@/auth";
import connectDb from "@/lib/db";
import DeliveryAssignment from "@/models/deliveryAssignment.model";
import "@/models/order.model";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDb();
    const session = await auth();

    const deliveryBoyId = session?.user?.id;
    if (!deliveryBoyId || !mongoose.Types.ObjectId.isValid(deliveryBoyId)) {
      return NextResponse.json({ assignments: [] }, { status: 200 });
    }

    const assignments = await DeliveryAssignment.find({
      brodcastedTo: deliveryBoyId,
      status: "brodcasted",
    }).populate("order");

    return NextResponse.json({ assignments }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `get assignments error ${error}`, assignments: [] },
      { status: 500 },
    );
  }
}
