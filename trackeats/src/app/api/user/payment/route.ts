import connectDb from "@/lib/db";
import User from "@/models/user.model";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    const { userId, items, paymentMethod, totalAmount, address } =
      await req.json();

    if (!items || !userId || !paymentMethod || !totalAmount || !address) {
      return NextResponse.json(
        { message: "Please send all credentials" },
        { status: 400 },
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 400 });
    }

    // Create order first (isPaid false)
    const newOrder = await Order.create({
      user: userId,
      items,
      totalAmount,
      address,
      paymentMethod: "online",
      isPaid: false,
    });

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: totalAmount * 100,
      currency: "INR",
      receipt: newOrder._id.toString(),
    });

    // Save Razorpay order id
    newOrder.razorpayOrderId = razorpayOrder.id;
    await newOrder.save();

    return NextResponse.json({
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    });
  } catch (error) {
    return NextResponse.json(
      { message: `order payment error ${error}` },
      { status: 500 },
    );
  }
}
